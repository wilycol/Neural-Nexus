"use client";

import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase-client";
import { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["users"]["Row"];

// 🚀 CACHÉ MOLECULAR: Evita martillear la base de datos desde múltiples componentes
// 🚀 CACHÉ MOLECULAR: Evita martillear la base de datos desde múltiples componentes
let cachedProfile: Profile | null = null;
let profileFetchPromise: Promise<Profile | null> | null = null;
let globalAuthInitPromise: Promise<void> | null = null;

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(cachedProfile);
  const [isLoading, setIsLoading] = useState(true);

  // Helper industrial para sincronización de perfil con timeout
  const fetchProfileAtomic = async (userId: string): Promise<Profile | null> => {
    if (cachedProfile && cachedProfile.id === userId) return cachedProfile;
    if (profileFetchPromise) return profileFetchPromise;

    const supabase = getSupabaseBrowserClient();
    profileFetchPromise = new Promise(async (resolve) => {
      const timeoutId = setTimeout(() => {
        console.warn("[Auth] ⚠️ Timeout en fetchProfile (5s).");
        resolve(null);
      }, 5000);

      try {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", userId)
          .maybeSingle();

        clearTimeout(timeoutId);
        if (error) {
          console.error("[Auth] 😭 Error en DB users:", error.message);
          resolve(null);
        } else {
          cachedProfile = data;
          resolve(data);
        }
      } catch (err) {
        console.error("[Auth] 💥 Error crítico en fetchProfile:", err);
        resolve(null);
      } finally {
        profileFetchPromise = null;
      }
    });

    return profileFetchPromise;
  };

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    const initAuth = async () => {
      // Bloqueo global: si ya hay una inicialización en curso, esperamos a esa.
      if (globalAuthInitPromise) {
        await globalAuthInitPromise;
        // Al terminar la global, actualizamos este estado local
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          if (cachedProfile) setProfile(cachedProfile);
        }
        setIsLoading(false);
        return;
      }

      globalAuthInitPromise = new Promise(async (resolve) => {
        try {
          console.log("[Auth] 🛡️ Sincronizando sesión industrial única...");
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error("[Auth] ❌ Fallo en getSession:", error.message);
          } else if (session?.user) {
            console.log("[Auth] ✅ Usuario autenticado:", session.user.email);
            setUser(session.user);
            const p = await fetchProfileAtomic(session.user.id);
            if (p) setProfile(p);
          } else {
            console.log("[Auth] ℹ️ Navegación anónima.");
            setUser(null);
            setProfile(null);
            cachedProfile = null;
          }
        } catch (error) {
          console.error("[Auth] 💥 Fallo crítico en inicialización:", error);
        } finally {
          setIsLoading(false);
          console.log("[Auth] 🏁 Inicialización de puente único completada.");
          resolve();
        }
      });
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(`[Auth] Sincronización Evento: ${event}`);
        
        if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
          cachedProfile = null;
          setIsLoading(false);
          return;
        }

        if (session?.user) {
          setUser(session.user);
          setIsLoading(false);
          const p = await fetchProfileAtomic(session.user.id);
          if (p) {
            setProfile(p);
            // Pequeña pausa para asegurar sincronización en el primer login
            if (event === 'SIGNED_IN') {
              console.log("[Auth] 🚀 Login exitoso, perfil sincronizado.");
            }
          }
        } else if (event !== 'INITIAL_SESSION') {
          setIsLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    profile,
    isLoggedIn: !!user,
    isPremium: profile?.is_premium || false,
    credits: profile?.credits || 0,
    role: profile?.role || 'user',
    isLoading,
  };
}
