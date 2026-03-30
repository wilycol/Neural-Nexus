"use client";

import React, { useEffect } from "react";
import { cn } from "@/lib/utils";

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
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("AdSense error:", err);
    }
  }, []);

  return (
    <div className={cn("w-full overflow-hidden my-4 bg-accent/50 rounded-xl min-h-[100px] flex items-center justify-center border border-dashed border-muted-foreground/20", className)}>
      {showPlaceholder ? (
        <div className="flex flex-col items-center gap-2 p-4 text-center">
          <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Anuncio de Google Ads</div>
          <div className="text-[10px] text-muted-foreground/40 italic">Espacio reservado para monetización</div>
        </div>
      ) : (
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Sustituir por ID real
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      )}
    </div>
  );
}
