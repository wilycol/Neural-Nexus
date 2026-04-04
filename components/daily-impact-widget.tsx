"use client";

import React from "react";
import { Eye, TrendingUp, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface DailyImpactWidgetProps {
  todayViews: number;
}

export function DailyImpactWidget({ todayViews }: DailyImpactWidgetProps) {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="flex items-center gap-2">
        <Zap className="h-5 w-5 text-neon-blue animate-pulse" />
        <h2 className="text-xl font-bold font-orbitron uppercase tracking-wider">Impacto de Hoy</h2>
      </div>
      
      <Card className="bg-card/30 backdrop-blur-md border-neon-blue/30 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/5 via-transparent to-neon-purple/5 opacity-50" />
        
        {/* Radar Effect Decoration */}
        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full border border-neon-blue/10 animate-[ping_3s_infinite] opacity-20" />
        <div className="absolute -right-4 -top-4 w-16 h-16 rounded-full border border-neon-blue/20 animate-[pulse_2s_infinite] opacity-30" />

        <CardContent className="p-8 text-center relative z-10">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="p-4 rounded-full bg-neon-blue/10 text-neon-blue border border-neon-blue/20 shadow-[0_0_20px_rgba(0,163,255,0.2)]">
              <Eye className="h-8 w-8" />
            </div>
            
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-orbitron mb-1">Visitas del Ciclo Actual</p>
              <div className="flex items-center justify-center gap-3">
                <h3 className="text-5xl font-bold font-orbitron text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]">
                  {todayViews.toLocaleString()}
                </h3>
                {todayViews > 0 && (
                  <div className="flex items-center text-green-400 text-xs font-mono bg-green-500/10 px-2 py-1 rounded-sm border border-green-500/20">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    LIVE
                  </div>
                )}
              </div>
            </div>

            <p className="text-[10px] text-muted-foreground max-w-[250px] italic">
              El motor de Beatriz está procesando el tráfico en tiempo real para optimizar la próxima oleada de noticias.
            </p>
          </div>
        </CardContent>
        
        {/* Animated Scanning Line */}
        <div className="absolute bottom-0 left-0 h-[1px] w-full bg-neon-blue/40 shadow-[0_0_10px_rgba(0,163,255,1)] animate-[scan_3s_linear_infinite]" />
      </Card>
      
      <style jsx global>{`
        @keyframes scan {
          0% { transform: translateY(-300px); opacity: 0; }
          50% { opacity: 0.5; }
          100% { transform: translateY(0); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
