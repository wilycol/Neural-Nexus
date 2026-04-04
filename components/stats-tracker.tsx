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
    // 1. Evitar tracking múltiple en el mismo montaje de componente
    if (hasTracked.current) return;
    
    // 2. Escudo de SessionStorage (Primera capa de defensa cliente)
    const today = new Date().toISOString().split('T')[0];
    const sessionKey = `nn_tracked_${today}`;
    
    if (typeof window !== "undefined" && sessionStorage.getItem(sessionKey)) {
      hasTracked.current = true;
      return;
    }
    
    async function trackVisit() {
      try {
        // 3. Llamada al API que ahora tiene el Escudo de Cookies (Defensa definitiva)
        const response = await fetch('/api/stats/track-visit', {
          method: 'POST',
        });
        
        if (response.ok) {
          // Guardar en sesión que ya enviamos la señal
          if (typeof window !== "undefined") {
            sessionStorage.setItem(sessionKey, "true");
          }
        }
      } catch (error) {
        console.error("Error en el sistema de rastreo:", error);
      }
    }

    trackVisit();
    hasTracked.current = true;
  }, []);

  return null; // Componente invisible
}
