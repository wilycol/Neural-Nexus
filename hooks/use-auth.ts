"use client";

import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase-client";
import { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["users"]["Row"];

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (data && !error) {
      setProfile(data);
    }
  };

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    // 1. Obtener sesión inicial de forma robusta
    const initAuth = async () => {
      try {
        console.log("[Auth] 🛡️ Obteniendo sesión inicial...");
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("[Auth] ❌ Error en getSession:", error.message);
          throw error;
        }

        if (session?.user) {
          console.log("[Auth] ✅ Sesión encontrada para:", session.user.email);
          setUser(session.user);
          await fetchProfile(session.user.id);
        } else {
          console.log("[Auth] ℹ️ No hay sesión inicial activa.");
          setUser(null);
          setProfile(null);
        }
      } catch (error) {
        console.error("[Auth] 💥 Fallo en inicialización:", error);
      } finally {
        // Marcamos el fin de la carga inicial DESPUÉS de intentar obtener el perfil
        setIsLoading(false);
        console.log("[Auth] 🏁 Inicialización completada.");
      }
    };

    initAuth();

    // 2. Escuchar cambios de estado industriales
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(`[Auth] Evento de cambio de estado: ${event}`);
        
        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
        }

        // Si el evento es SIGNED_IN o INITIAL_SESSION, nos aseguramos de que termine el loading
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'INITIAL_SESSION') {
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
