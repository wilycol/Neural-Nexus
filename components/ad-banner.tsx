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

export function AdBanner({ 
  className, 
  slot = "default-slot", 
  format = "auto",
  showPlaceholder = process.env.NODE_ENV === "development" 
}: AdBannerProps) {
  const { isPremium, isLoading } = useAuth();
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isPremium || isLoading || showPlaceholder) return;
    
    // Pequeño timeout para asegurar que el DOM y el layout se hayan calculado
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

  return (
    <div 
      ref={adRef}
      className={cn("w-full overflow-hidden my-4 bg-accent/10 rounded-xl min-h-[100px] flex items-center justify-center border border-dashed border-muted-foreground/10", className)}
    >
      {showPlaceholder ? (
        <div className="flex flex-col items-center gap-2 p-4 text-center">
          <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Anuncio de Google Ads</div>
          <div className="text-[10px] text-muted-foreground/40 italic">Espacio reservado para monetización</div>
        </div>
      ) : (
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-1327982622260280"
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      )}
    </div>
  );
}
