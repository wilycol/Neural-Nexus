"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, ExternalLink, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Template {
  name: string;
  niche: string;
  style: string;
  primaryColor: string;
  demoUrl?: string;
  imageUrl?: string;
}

const TEMPLATES: Template[] = [
  { name: "Luxe", niche: "Moda & Estética", style: "Minimalista", primaryColor: "#f472b6", demoUrl: "https://nodesecretosdemujer.vercel.app" },
  { name: "Titan", niche: "Industria & Construcción", style: "Robusto", primaryColor: "#3b82f6" },
  { name: "Nebula", niche: "Agencias IA & Futurismo", style: "Cyberpunk", primaryColor: "#f97316" },
  { name: "Sage", niche: "Gastronomía & Gourmet", style: "Natural", primaryColor: "#84cc16" },
  { name: "Summit", niche: "Gimnasios & Deporte", style: "Energético", primaryColor: "#facc15" },
  { name: "Aura", niche: "Wellness & Spa", style: "Relajante", primaryColor: "#a78bfa" }
];

export const TemplateCarousel3D = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % TEMPLATES.length);
  }, []);

  const prev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + TEMPLATES.length) % TEMPLATES.length);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(next, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, next]);

  const getPosition = (index: number) => {
    const diff = (index - currentIndex + TEMPLATES.length) % TEMPLATES.length;
    
    if (diff === 0) return "center";
    if (diff === 1 || diff === -(TEMPLATES.length - 1)) return "right";
    if (diff === TEMPLATES.length - 1 || diff === -1) return "left";
    return "hidden";
  };

  const variants = {
    center: { x: "0%", scale: 1, zIndex: 10, opacity: 1, rotateY: 0, filter: "blur(0px)" },
    right: { x: "45%", scale: 0.8, zIndex: 5, opacity: 0.6, rotateY: -45, filter: "blur(4px)" },
    left: { x: "-45%", scale: 0.8, zIndex: 5, opacity: 0.6, rotateY: 45, filter: "blur(4px)" },
    hidden: { x: "0%", scale: 0.5, zIndex: 0, opacity: 0, filter: "blur(10px)" }
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto py-20 px-4 overflow-hidden perspective-1000">
      <div className="relative h-[450px] flex items-center justify-center">
        <AnimatePresence initial={false}>
          {TEMPLATES.map((template, index) => {
            const pos = getPosition(index);
            if (pos === "hidden") return null;

            return (
              <motion.div
                key={template.name}
                initial="hidden"
                animate={pos}
                exit="hidden"
                variants={variants}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute w-full max-w-[320px] md:max-w-[400px] h-full"
                onMouseEnter={() => setIsAutoPlaying(false)}
                onMouseLeave={() => setIsAutoPlaying(true)}
              >
                <div className="relative w-full h-full rounded-[32px] overflow-hidden border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl group">
                  {/* Mock Browser UI */}
                  <div className="absolute top-0 left-0 right-0 h-8 bg-white/5 border-b border-white/10 flex items-center px-4 gap-2 z-20">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-red-500/50" />
                      <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                      <div className="w-2 h-2 rounded-full bg-green-500/50" />
                    </div>
                    <div className="flex-1 bg-white/5 rounded-full h-4 mx-4 border border-white/5" />
                  </div>

                  {/* Template Content Visual (Mock) */}
                  <div 
                    className="absolute inset-0 pt-8 bg-cover bg-center"
                    style={{ 
                      backgroundImage: `linear-gradient(to bottom, transparent, rgba(0,0,0,0.8)), url(${template.imageUrl || `/assets/templates/${template.name.toLowerCase()}.png`})`,
                      backgroundColor: "#111"
                    }}
                  >
                    {!template.imageUrl && (
                        <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
                            <Zap className="h-12 w-12 mb-4 animate-pulse" style={{ color: template.primaryColor }} />
                            <h4 className="text-2xl font-orbitron font-bold mb-2 uppercase tracking-tighter" style={{ color: template.primaryColor }}>
                                {template.name}
                            </h4>
                            <p className="text-white/40 text-xs uppercase tracking-widest">{template.niche}</p>
                        </div>
                    )}
                  </div>

                  {/* Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black to-transparent transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="flex justify-between items-end">
                      <div>
                        <span className="text-[10px] font-orbitron text-white/40 tracking-[0.3em] uppercase mb-1 block">Nicho Detectado</span>
                        <h3 className="text-xl font-orbitron font-bold text-white uppercase">{template.niche}</h3>
                      </div>
                      <Button 
                        size="icon" 
                        variant="outline" 
                        className="rounded-full border-white/10 bg-white/5 hover:bg-neon-blue/20 hover:border-neon-blue transition-all"
                        onClick={() => template.demoUrl && window.open(template.demoUrl, "_blank")}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-center items-center gap-8 mt-12">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={prev}
          className="rounded-full border-white/10 bg-white/5 hover:border-neon-blue text-white transition-all h-12 w-12"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex gap-2">
          {TEMPLATES.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-500 ${i === currentIndex ? "w-8 bg-neon-blue shadow-[0_0_10px_rgba(0,163,255,0.8)]" : "w-2 bg-white/10"}`} 
            />
          ))}
        </div>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={next}
          className="rounded-full border-white/10 bg-white/5 hover:border-neon-blue text-white transition-all h-12 w-12"
        >
          <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
