"use client";

import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase-client";
import { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["users"]["Row"];

// 🚀 CACHÉ MOLECULAR: Evita martillear la base de datos desde múltiples componentes
let cachedProfile: Profile | null = null;
let profileFetchPromise: Promise<Profile | null> | null = null;

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(cachedProfile);
  const [isLoading, setIsLoading] = useState(true);

  // Helper industrial para sincronización de perfil con timeout
  const fetchProfileAtomic = async (userId: string): Promise<Profile | null> => {
    // Si ya tenemos el perfil en caché para este usuario, lo devolvemos
    if (cachedProfile && cachedProfile.id === userId) {
      return cachedProfile;
    }

    // Si ya hay una petición en curso para este usuario, nos unimos a ella
    if (profileFetchPromise) {
      return profileFetchPromise;
    }

    const supabase = getSupabaseBrowserClient();
    
    // Creamos la promesa de carga con protección de timeout (5s)
    profileFetchPromise = new Promise(async (resolve) => {
      const timeoutId = setTimeout(() => {
        console.warn("[Auth] ⚠️ Timeout en fetchProfile (5s). Continuando sin perfil extendido.");
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
      try {
        console.log("[Auth] 🛡️ Sincronizando sesión industrial...");
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("[Auth] ❌ Fallo en getSession:", error.message);
          setIsLoading(false);
          return;
        }

        if (session?.user) {
          console.log("[Auth] ✅ Usuario autenticado:", session.user.email);
          setUser(session.user);
          
          // DESBLOQUEO ASÍNCRONO: Consideramos cargado el sistema BASE
          setIsLoading(false); 
          
          // Cargamos el perfil en paralelo sin bloquear el resto de la web
          const p = await fetchProfileAtomic(session.user.id);
          if (p) setProfile(p);
        } else {
          console.log("[Auth] ℹ️ Navegación anónima.");
          setUser(null);
          setProfile(null);
          cachedProfile = null;
          setIsLoading(false);
        }
      } catch (error) {
        console.error("[Auth] 💥 Fallo crítico en inicialización:", error);
        setIsLoading(false);
      } finally {
        console.log("[Auth] 🏁 Inicialización de puente completada.");
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(`[Auth] Sincronización Evento: ${event}`);
        
        if (session?.user) {
          setUser(session.user);
          setIsLoading(false);
          const p = await fetchProfileAtomic(session.user.id);
          if (p) setProfile(p);
        } else {
          setUser(null);
          setProfile(null);
          cachedProfile = null;
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
