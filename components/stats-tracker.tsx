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
    // Evitar tracking múltiple en la misma sesión/montaje (StrictMode de React)
    if (hasTracked.current) return;
    
    async function trackVisit() {
      const supabase = getSupabaseBrowserClient();
      
      try {
        // Llamada al RPC 'increment_daily_views'
        // @ts-expect-error: RPC dynamic call before type generation
        const { error } = await supabase.rpc('increment_daily_views');
        
        if (error) {
          console.error("Growth Engine Error (tracking):", error.message);
        } else {
          // console.log("Growth Engine: Vista registrada.");
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
