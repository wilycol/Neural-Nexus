"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Megaphone, Zap, Heart, ShieldCheck, ArrowRight, Network } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface SlideContent {
  id: string;
  badge: string;
  title: string;
  description: string;
  icon: React.ElementType;
  buttonText: string;
  buttonLink?: string;
  onClickType?: "partnership" | "donation";
  color: string;
}

const SLIDES: SlideContent[] = [
  {
    id: "ads",
    badge: "Espacio Publicitario",
    title: "Neural Ad Engine",
    description: "Posiciona tu marca en el nodo principal de la Red Nexus Hive. Segmentación IA de alta precisión.",
    icon: Megaphone,
    buttonText: "Publicar con Nosotros",
    onClickType: "partnership",
    color: "neon-blue"
  },
  {
    id: "saas",
    badge: "Red Neural Sites",
    title: "Neural Sites SaaS",
    description: "Tu web inteligente con contenido automático de Beatriz. Únete a la colmena industrial hoy.",
    icon: Zap,
    buttonText: "Ver Soluciones",
    buttonLink: "/#pricing",
    color: "neon-purple"
  },
  {
    id: "donations",
    badge: "Apoyo Industrial",
    title: "Nexus Support",
    description: "Apoya la infraestructura del Hub. Tu contribución expande el alcance de nuestra inteligencia.",
    icon: Heart,
    buttonText: "Hacer Donación",
    onClickType: "donation",
    color: "red-500"
  },
  {
    id: "premium",
    badge: "Membresía Élite",
    title: "Nexus Premium",
    description: "Desbloquea telemetría avanzada y beneficios industriales por solo $4/mes.",
    icon: ShieldCheck,
    buttonText: "Ser Premium",
    buttonLink: "/premium",
    color: "amber-500"
  },
  {
    id: "hive",
    badge: "Ecosistema Hive",
    title: "Federación Nexus Hive",
    description: "Únete a la red neuronal de negocios. Comparte autoridad, tráfico y SEO entre nodos inteligentes.",
    icon: Network,
    buttonText: "Entrar en el Ecosistema",
    buttonLink: "/hive",
    color: "emerald-500"
  }
];

interface NeuralBillboardProps {
  className?: string;
  onPartnershipClick?: () => void;
  onDonationClick?: () => void;
}

export function NeuralBillboard({ className, onPartnershipClick, onDonationClick }: NeuralBillboardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const currentSlide = SLIDES[currentIndex];

  const handleButtonClick = () => {
    if (currentSlide.onClickType === "partnership" && onPartnershipClick) {
      onPartnershipClick();
    } else if (currentSlide.onClickType === "donation" && onDonationClick) {
      onDonationClick();
    }
  };

  return (
    <div className={cn(
      "relative overflow-hidden rounded-xl border border-white/10 bg-black/40 backdrop-blur-md p-6 min-h-[220px] flex flex-col items-center justify-center text-center group",
      className
    )}>
      {/* Cyber Grid Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:20px_20px]"></div>
      
      {/* Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.05]">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent h-[10%] w-full animate-scanline"></div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide.id}
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.98 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center gap-4 w-full"
        >
          <div className={cn(
            "p-3 rounded-xl border transition-all duration-500",
            currentIndex === 0 && "bg-neon-blue/10 border-neon-blue/20 text-neon-blue shadow-[0_0_15px_rgba(0,163,255,0.2)]",
            currentIndex === 1 && "bg-neon-purple/10 border-neon-purple/20 text-neon-purple shadow-[0_0_15px_rgba(168,85,247,0.2)]",
            currentIndex === 2 && "bg-red-500/10 border-red-500/20 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]",
            currentIndex === 3 && "bg-amber-500/10 border-amber-500/20 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
          )}>
            <currentSlide.icon className="h-6 w-6 animate-pulse" />
          </div>
          
          <div className="max-w-[400px]">
            <div className={cn(
               "inline-flex items-center gap-2 px-2 py-0.5 rounded-md text-[10px] font-orbitron uppercase tracking-widest mb-3 border",
               currentIndex === 0 && "bg-neon-blue/10 border-neon-blue/20 text-neon-blue",
               currentIndex === 1 && "bg-neon-purple/10 border-neon-purple/20 text-neon-purple",
               currentIndex === 2 && "bg-red-500/10 border-red-500/20 text-red-500",
               currentIndex === 3 && "bg-amber-500/10 border-amber-500/20 text-amber-500"
            )}>
              <Sparkles className="h-3 w-3" /> {currentSlide.badge}
            </div>
            
            <h3 className="text-xl font-bold font-orbitron text-foreground mb-2 tracking-tight">
              {currentSlide.title}
            </h3>
            
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed italic mb-4">
              &quot;{currentSlide.description}&quot;
            </p>

            {currentSlide.buttonLink ? (
              <Button 
                variant="outline" 
                size="sm"
                asChild
                className={cn(
                  "rounded-full border px-6 font-orbitron text-[10px] tracking-widest uppercase transition-all hover:scale-105 active:scale-95",
                  currentIndex === 0 && "border-neon-blue/30 text-neon-blue hover:bg-neon-blue/10",
                  currentIndex === 1 && "border-neon-purple/30 text-neon-purple hover:bg-neon-purple/10",
                  currentIndex === 2 && "border-red-500/30 text-red-500 hover:bg-red-500/10",
                  currentIndex === 3 && "border-amber-500/30 text-amber-500 hover:bg-amber-500/10"
                )}
              >
                <Link href={currentSlide.buttonLink}>
                  {currentSlide.buttonText}
                  <ArrowRight className="ml-2 h-3 w-3" />
                </Link>
              </Button>
            ) : (
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleButtonClick}
                className={cn(
                  "rounded-full border px-6 font-orbitron text-[10px] tracking-widest uppercase transition-all hover:scale-105 active:scale-95",
                  currentIndex === 0 && "border-neon-blue/30 text-neon-blue hover:bg-neon-blue/10",
                  currentIndex === 1 && "border-neon-purple/30 text-neon-purple hover:bg-neon-purple/10",
                  currentIndex === 2 && "border-red-500/30 text-red-500 hover:bg-red-500/10",
                  currentIndex === 3 && "border-amber-500/30 text-amber-500 hover:bg-amber-500/10"
                )}
              >
                {currentSlide.buttonText}
                <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Progress Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
        {SLIDES.map((_, i) => (
          <div 
            key={i} 
            className={cn(
              "h-1 rounded-full transition-all duration-500",
              i === currentIndex ? "w-6 bg-primary" : "w-1.5 bg-white/10"
            )}
          />
        ))}
      </div>
    </div>
  );
}
