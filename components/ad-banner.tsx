"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

interface AdBannerProps {
  className?: string;
  slot?: string;
  format?: "auto" | "fluid" | "rectangle" | "vertical";
  showPlaceholder?: boolean;
}

// TOGGLE DE MONETIZACIÓN LIVE
// Cambiar a true cuando Google haya aprobado el sitio y hayas creado los bloques de anuncios en el panel
const ADS_LIVE = true; 

export function AdBanner({ 
  className, 
  slot, 
  format = "auto",
  showPlaceholder = process.env.NODE_ENV === "development" 
}: AdBannerProps) {
  const { isPremium, isLoading } = useAuth();
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Si no estamos en modo LIVE, no intentamos llamar a Google Ads
    // Esto evita errores 400 por IDs de bloque (slots) no registrados todavía
    if (isPremium || isLoading || showPlaceholder || !ADS_LIVE || !slot) return;
    
    const timer = setTimeout(() => {
      try {
        if (adRef.current && adRef.current.offsetWidth > 0) {
          // @ts-expect-error: Loading Google Ads snippet
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      } catch (err) {
        console.error("AdSense Error (pushing):", err);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [isPremium, isLoading, showPlaceholder, slot]);

  if (isPremium || isLoading) return null;

  // Si no está en modo LIVE, siempre mostramos el marcador de posición estético
  const shouldShowPlaceholder = showPlaceholder || !ADS_LIVE || !slot;

  return (
    <div 
      ref={adRef}
      className={cn("w-full overflow-hidden my-4 bg-accent/5 rounded-xl min-h-[100px] border border-dashed border-muted-foreground/10", className)}
      style={{ display: 'block' }}
    >
      {shouldShowPlaceholder ? (
        <div className="flex flex-col items-center justify-center gap-2 p-4 text-center min-h-[100px]">
          <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Anuncio de Google Ads</div>
          <div className="text-[10px] text-muted-foreground/40 italic">
            {!slot ? "Slot no configurado" : "Esperando aprobación de Google AdSense"}
          </div>
        </div>
      ) : (
        <ins
          className="adsbygoogle"
          style={{ display: "block", width: "100%", height: "auto", minHeight: "100px" }}
          data-ad-client="ca-pub-1327982622260280"
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      )}
    </div>
  );
}
