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

    // 1. Obtener sesión inicial
    const initAuth = async () => {
      try {
        console.log("[Auth] Iniciando sincronización de sesión...");
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("[Auth] Error al obtener sesión inicial:", error);
        }

        if (session?.user) {
          console.log("[Auth] Sesión activa encontrada:", session.user.email);
          setUser(session.user);
          await fetchProfile(session.user.id);
        } else {
          console.log("[Auth] No hay sesión activa inicial.");
        }
      } catch (err) {
        console.error("[Auth] Fallo crítico en initAuth:", err);
      } finally {
        setIsLoading(false);
        console.log("[Auth] Estado de carga de sesión finalizado.");
      }
    };

    initAuth();

    // 2. Escuchar cambios de estado
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
        setIsLoading(false);
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
