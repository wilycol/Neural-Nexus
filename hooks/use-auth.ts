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
      // Válvula de seguridad: Si en 5 segundos getSession no responde, forzamos el fin de carga
      // para que el resto de la app (como los Reels) no se quede colgada.
      const safetyTimeout = setTimeout(() => {
        if (isLoading) {
          console.warn("[Auth] ⚠️ Válvula de seguridad activada: La sesión está tardando demasiado.");
          setIsLoading(false);
        }
      }, 5000);

      try {
        console.log("[Auth] 🛡️ Obteniendo sesión inicial...");
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("[Auth] ❌ Error en getSession:", error.message);
          throw error;
        }

        if (session) {
          console.log("[Auth] ✅ Sesión encontrada para:", session.user.email);
          setUser(session.user);
          await fetchProfile(session.user.id);
        } else {
          console.log("[Auth] ℹ️ No hay sesión activa.");
        }
      } catch (error) {
        console.error("[Auth] 💥 Error crítico en inicialización:", error);
      } finally {
        console.log(`[Auth] 🏁 Estado finalizado: Usuario=${user?.email || "null"}, Loading=${isLoading}`);
        setIsLoading(false);
        clearTimeout(safetyTimeout);
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
