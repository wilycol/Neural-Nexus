"use client";

import { useEffect, useRef } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase-client";

/**
 * StatsTracker: Componente silencioso encargado de alimentar el Growth Engine.
 * Registra una vista diaria mediante la llamada al RPC de Supabase.
 */
export function StatsTracker() {
  const hasTracked = useRef(false);

  useEffect(() => {
    // 1. Evitar tracking múltiple en la misma sesión/montaje (StrictMode)
    if (hasTracked.current) return;
    
    // 2. Persistencia en SessionStorage para evitar doble conteo por login/re-montaje
    const today = new Date().toISOString().split('T')[0];
    const sessionKey = `nn_tracked_${today}`;
    
    if (typeof window !== "undefined" && sessionStorage.getItem(sessionKey)) {
      hasTracked.current = true;
      return;
    }
    
    async function trackVisit() {
      const supabase = getSupabaseBrowserClient();
      
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any).rpc('increment_daily_views');
        
        if (error) {
          console.error("Growth Engine Error (tracking):", error.message);
        } else {
          // Guardar en sesión que ya contamos esta visita hoy
          if (typeof window !== "undefined") {
            sessionStorage.setItem(sessionKey, "true");
          }
        }
      } catch {
        // Silencioso para el usuario
      }
    }

    trackVisit();
    hasTracked.current = true;
  }, []);

  return null; // Componente invisible
}
