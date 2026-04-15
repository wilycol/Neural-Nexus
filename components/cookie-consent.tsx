"use client";

import React, { useEffect, useState } from "react";
import { X, Cookie, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Verificar si el usuario ya dio su consentimiento
    const consent = localStorage.getItem("neural-nexus-consent");
    if (!consent) {
      // Pequeño delay para no abrumar al inicio
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("neural-nexus-consent", "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("neural-nexus-consent", "declined");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-0 right-0 z-[60] px-4 pointer-events-none animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="container mx-auto max-w-4xl pointer-events-auto">
        <div className="relative overflow-hidden rounded-2xl bg-background/80 backdrop-blur-xl border border-neon-blue/30 shadow-[0_0_40px_rgba(0,163,255,0.15)] p-5 md:p-6 lg:flex lg:items-center lg:justify-between gap-6 transition-all hover:border-neon-blue/50 group">
          {/* Luz de fondo sutil */}
          <div className="absolute -top-24 -left-24 h-48 w-48 bg-neon-blue/10 rounded-full blur-[80px]" />
          
          <div className="flex items-start gap-4 flex-1 relative z-10">
            <div className="p-3 rounded-xl bg-neon-blue/10 text-neon-blue hidden sm:block">
              <Cookie className="h-6 w-6 animate-pulse" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-orbitron font-bold tracking-widest text-neon-blue flex items-center gap-2">
                <ShieldCheck className="h-3 w-3" />
                CONSENTIMIENTO NEURAL
              </h4>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed max-w-2xl">
                Utilizamos cookies propias y de terceros (como Google AdSense) para alimentar nuestro motor de crecimiento, analizar el tráfico y personalizar tu experiencia IA. Al continuar, aceptas nuestra <a href="/legal/privacidad" className="text-neon-blue hover:underline font-medium">Política de Privacidad</a>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-4 lg:mt-0 relative z-10 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDecline}
              className="text-[10px] font-orbitron tracking-tighter border-muted-foreground/20 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all rounded-full h-9"
            >
              GESTIONAR
            </Button>
            <Button
              size="sm"
              onClick={handleAccept}
              className="text-[10px] font-orbitron tracking-tighter bg-gradient-to-r from-neon-blue to-neon-purple text-white shadow-[0_0_15px_rgba(0,163,255,0.3)] hover:shadow-[0_0_25px_rgba(0,243,255,0.5)] transition-all rounded-full h-9 px-6"
            >
              ACEPTAR NEXO
            </Button>
            <button 
              onClick={() => setIsVisible(false)}
              className="p-1 hover:text-white text-muted-foreground transition-colors absolute -top-4 -right-4 lg:static"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
