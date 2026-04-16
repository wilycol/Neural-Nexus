"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Megaphone } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdCardProps {
  className?: string;
  slot?: string;
}

export function AdCard({ className, slot }: AdCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      className={cn(
        "relative overflow-hidden rounded-xl border border-neon-blue/20 bg-card/10 backdrop-blur-md p-6 min-h-[200px] flex flex-col items-center justify-center text-center group",
        className
      )}
    >
      {/* Cyber Grid Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:20px_20px]"></div>
      
      {/* Neon Glows */}
      <div className="absolute -top-10 -left-10 w-32 h-32 bg-neon-blue/10 rounded-full blur-3xl group-hover:bg-neon-blue/20 transition-colors"></div>
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-neon-purple/10 rounded-full blur-3xl group-hover:bg-neon-purple/20 transition-colors"></div>

      <div className="relative z-10 flex flex-col items-center gap-4">
        <div className="p-3 rounded-full bg-neon-blue/10 border border-neon-blue/30 text-neon-blue animate-pulse">
          <Megaphone className="h-6 w-6" />
        </div>
        
        <div>
          <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-md bg-neon-blue/10 border border-neon-blue/20 text-[10px] text-neon-blue font-orbitron uppercase tracking-widest mb-2">
            <Sparkles className="h-3 w-3" /> Espacio Publicitario
          </div>
          <h3 className="text-xl font-bold font-orbitron text-foreground mb-2">Neural Ad Engine</h3>
          <p className="text-sm text-muted-foreground max-w-[280px]">
            Tu marca aquí, impulsada por inteligencia artificial y segmentación de alta precisión.
          </p>
        </div>

        {/* AdSense Placeholder */}
        <div className="w-full h-[60px] border border-dashed border-muted-foreground/30 rounded-lg flex items-center justify-center text-[10px] text-muted-foreground/50 font-mono italic px-2">
          ADSENSE SLOT: {slot || "AUTO-INJECTED"}
        </div>
      </div>

      {/* Industrial Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.05]">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent h-[10%] w-full animate-scanline"></div>
      </div>
    </motion.div>
  );
}
