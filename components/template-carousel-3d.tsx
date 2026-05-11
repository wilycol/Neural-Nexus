"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Template {
  id: string;
  name: string;
  niche: string;
  style: string;
  primaryColor: string;
  demoUrl?: string;
}

const TEMPLATES: Template[] = [
  { id: "foundry", name: "FOUNDRY", niche: "Ferretería Industrial", style: "Robusto", primaryColor: "#FFB800" },
  { id: "vitalis", name: "VITALIS", niche: "Farmacia & Salud", style: "Profesional", primaryColor: "#39FF14" },
  { id: "torque", name: "TORQUE", niche: "Taller Mecánico", style: "Potente", primaryColor: "#FF6B35" },
  { id: "prism", name: "PRISM", niche: "Clínica Dental", style: "Vanguardista", primaryColor: "#00F0FF" },
  { id: "forge", name: "FORGE", niche: "Gimnasio / Crossfit", style: "Energético", primaryColor: "#FF2D55" },
  { id: "ember", name: "EMBER", niche: "Restaurante Gourmet", style: "Premium", primaryColor: "#FFB800" },
  { id: "brew", name: "BREW", niche: "Cafetería / Panadería", style: "Artesanal", primaryColor: "#FFB800" },
  { id: "atelier", name: "ATELIER", niche: "Boutique de Moda", style: "Elegante", primaryColor: "#B829F7" },
  { id: "haven", name: "HAVEN", niche: "Pet Shop / Veterinaria", style: "Confiable", primaryColor: "#39FF14" },
  { id: "domain", name: "DOMAIN", niche: "Inmobiliaria", style: "Lujoso", primaryColor: "#00F0FF" },
  { id: "citadel", name: "CITADEL", niche: "Bufete de Abogados", style: "Autoridad", primaryColor: "#B829F7" },
  { id: "aura", name: "AURA", niche: "Spa / Masajes", style: "Relajante", primaryColor: "#B829F7" },
  { id: "edge", name: "EDGE", niche: "Barbería / Salón", style: "Urbano", primaryColor: "#00F0FF" },
  { id: "overclock", name: "OVERCLOCK", niche: "Electrónica / Gaming", style: "High-Tech", primaryColor: "#39FF14" },
  { id: "horizon", name: "HORIZON", niche: "Agencia de Viajes", style: "Aventurero", primaryColor: "#00F0FF" },
  { id: "apex", name: "APEX", niche: "Marca Personal", style: "Influyente", primaryColor: "#B829F7" }
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
    const interval = setInterval(next, 3500); // Un poco más rápido para mostrar los 16
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
    right: { x: "50%", scale: 0.75, zIndex: 5, opacity: 0.4, rotateY: -40, filter: "blur(6px)" },
    left: { x: "-50%", scale: 0.75, zIndex: 5, opacity: 0.4, rotateY: 40, filter: "blur(6px)" },
    hidden: { x: "0%", scale: 0.4, zIndex: 0, opacity: 0, filter: "blur(15px)" }
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto py-16 px-4 overflow-hidden perspective-1000">
      <div className="relative h-[480px] flex items-center justify-center">
        <AnimatePresence initial={false}>
          {TEMPLATES.map((template, index) => {
            const pos = getPosition(index);
            if (pos === "hidden") return null;

            return (
              <motion.div
                key={template.id}
                initial="hidden"
                animate={pos}
                exit="hidden"
                variants={variants}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                className="absolute w-full max-w-[340px] md:max-w-[420px] h-full"
                onMouseEnter={() => setIsAutoPlaying(false)}
                onMouseLeave={() => setIsAutoPlaying(true)}
              >
                <div className="relative w-full h-full rounded-[40px] overflow-hidden border border-white/10 bg-black/40 backdrop-blur-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] group">
                  {/* Mock Browser UI */}
                  <div className="absolute top-0 left-0 right-0 h-10 bg-white/5 border-b border-white/10 flex items-center px-6 gap-2 z-20">
                    <div className="flex gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
                    </div>
                    <div className="flex-1 bg-white/5 rounded-full h-5 mx-6 border border-white/5 flex items-center px-3">
                        <div className="text-[8px] font-mono text-white/20 tracking-tighter">https://neural-sites.ai/demo/{template.id}</div>
                    </div>
                  </div>

                  {/* Template Visual Content */}
                  <div 
                    className="absolute inset-0 pt-10 flex flex-col items-center justify-center p-10 text-center"
                    style={{ 
                      background: `radial-gradient(circle at center, ${template.primaryColor}15 0%, transparent 70%), #080808`
                    }}
                  >
                    <motion.div
                        animate={{ 
                            scale: [1, 1.05, 1],
                            opacity: [0.8, 1, 0.8]
                        }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="mb-6 relative"
                    >
                        <div className="absolute inset-0 blur-2xl opacity-20" style={{ backgroundColor: template.primaryColor }} />
                        <Zap className="h-16 w-16 relative z-10" style={{ color: template.primaryColor }} />
                    </motion.div>
                    
                    <span className="text-[10px] font-orbitron tracking-[0.5em] text-white/30 mb-4 uppercase">Protocolo {template.style}</span>
                    <h4 className="text-4xl font-orbitron font-black mb-4 tracking-tighter" style={{ color: template.primaryColor }}>
                        {template.name}
                    </h4>
                    <div className="h-[1px] w-12 mb-6" style={{ backgroundColor: template.primaryColor }} />
                    <p className="text-white/50 text-xs uppercase tracking-[0.2em] font-light leading-relaxed max-w-[200px]">
                        Especializado para: <br/>
                        <span className="text-white font-bold">{template.niche}</span>
                    </p>
                  </div>

                  {/* Hover Overlay Buttons */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center gap-4 z-30">
                     <Button 
                        className="bg-white text-black hover:bg-white/90 rounded-full font-orbitron text-[10px] tracking-widest px-8"
                        onClick={() => window.open(`/es/neural-sites/demo/${template.id}`, "_blank")}
                     >
                        VER DEMO EN VIVO
                     </Button>
                     <Button 
                        variant="outline" 
                        className="border-white/20 text-white hover:bg-white/10 rounded-full font-orbitron text-[10px] tracking-widest px-8"
                     >
                        DETALLES TÉCNICOS
                     </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Modern Navigation Controls */}
      <div className="mt-16 flex flex-col items-center gap-8">
        <div className="flex items-center gap-6">
            <Button 
                variant="outline" 
                size="icon" 
                onClick={prev}
                className="rounded-full border-white/5 bg-white/5 hover:border-white/20 text-white transition-all h-14 w-14 group"
            >
                <ArrowLeft className="h-6 w-6 group-hover:-translate-x-1 transition-transform" />
            </Button>
            
            {/* Template Counter */}
            <div className="font-orbitron text-[10px] text-white/40 tracking-[0.4em] uppercase bg-white/5 px-6 py-2 rounded-full border border-white/5">
                Nicho {currentIndex + 1} <span className="text-white/20 mx-2">|</span> 16
            </div>

            <Button 
                variant="outline" 
                size="icon" 
                onClick={next}
                className="rounded-full border-white/5 bg-white/5 hover:border-white/20 text-white transition-all h-14 w-14 group"
            >
                <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </Button>
        </div>

        {/* Dynamic Pagination Dots */}
        <div className="flex gap-1.5 flex-wrap justify-center max-w-[300px]">
          {TEMPLATES.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setCurrentIndex(i)}
              className={`h-1 rounded-full transition-all duration-500 ${i === currentIndex ? "w-6 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]" : "w-1 bg-white/10 hover:bg-white/30"}`} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};
