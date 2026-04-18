"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Megaphone, Zap, Heart, ShieldCheck, ArrowRight, Network } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

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
  bgImage: string;
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
    color: "neon-blue",
    bgImage: "/assets/billboard_ads_bg.png"
  },
  {
    id: "saas",
    badge: "Red Neural Sites",
    title: "Neural Sites SaaS",
    description: "Tu web inteligente con contenido automático de Beatriz. Únete a la colmena industrial hoy.",
    icon: Zap,
    buttonText: "Ver Soluciones",
    buttonLink: "/#pricing",
    color: "neon-purple",
    bgImage: "/assets/billboard_saas_bg.png"
  },
  {
    id: "donations",
    badge: "Apoyo Industrial",
    title: "Nexus Support",
    description: "Apoya la infraestructura del Hub. Tu contribución expande el alcance de nuestra inteligencia.",
    icon: Heart,
    buttonText: "Hacer Donación",
    onClickType: "donation",
    color: "red-500",
    bgImage: "/assets/billboard_donations_bg.png"
  },
  {
    id: "premium",
    badge: "Membresía Élite",
    title: "Nexus Premium",
    description: "Desbloquea telemetría avanzada y beneficios industriales por solo $4/mes.",
    icon: ShieldCheck,
    buttonText: "Ser Premium",
    buttonLink: "/premium",
    color: "amber-500",
    bgImage: "/assets/billboard_premium_bg.png"
  },
  {
    id: "hive",
    badge: "Ecosistema Hive",
    title: "Federación Nexus Hive",
    description: "Únete a la red neuronal de negocios. Comparte autoridad, tráfico y SEO entre nodos inteligentes.",
    icon: Network,
    buttonText: "Entrar en el Ecosistema",
    buttonLink: "/hive",
    color: "emerald-500",
    bgImage: "/assets/billboard_hive_bg.png"
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
      "relative overflow-hidden rounded-xl border border-white/10 bg-[#020817]/80 backdrop-blur-xl p-6 min-h-[260px] flex flex-col items-center justify-center text-center group transition-all duration-700 shadow-2xl shadow-black/50",
      className
    )}>
      {/* Dynamic Background Image with AnimatePresence */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.bgImage}
            initial={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            animate={{ opacity: 0.5, scale: 1, filter: "blur(1px)" }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image 
              src={currentSlide.bgImage} 
              alt="Background" 
              fill 
              className="object-cover opacity-80"
              priority={currentIndex === 0}
            />
            {/* Ambient Overlay for depth - Adjusted for more transparency */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#020817] via-transparent to-[#020817] opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#020817] via-transparent to-[#020817] opacity-40" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Cyber Grid Background overlay - Reduced opacity */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px] z-1"></div>
      
      {/* Scanline Effect - Subtle */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.04] z-2">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent h-[15%] w-full animate-scanline"></div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide.id}
          initial={{ opacity: 0, y: 15, filter: "blur(5px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -15, filter: "blur(5px)" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center gap-4 w-full"
        >
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className={cn(
              "p-3 rounded-2xl border transition-all duration-500 backdrop-blur-md bg-black/40",
              currentIndex === 0 && "border-neon-blue/30 text-neon-blue shadow-[0_0_20px_rgba(0,163,255,0.3)]",
              currentIndex === 1 && "border-neon-purple/30 text-neon-purple shadow-[0_0_20px_rgba(168,85,247,0.3)]",
              currentIndex === 2 && "border-red-500/30 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]",
              currentIndex === 3 && "border-amber-500/30 text-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.3)]",
              currentIndex === 4 && "border-emerald-500/30 text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            )}
          >
            <currentSlide.icon className="h-7 w-7 animate-pulse" />
          </motion.div>
          
          <div className="max-w-[440px]">
            <div className={cn(
               "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-orbitron uppercase tracking-widest mb-4 border bg-black/60",
               currentIndex === 0 && "border-neon-blue/30 text-neon-blue shadow-[0_0_10px_rgba(0,163,255,0.1)]",
               currentIndex === 1 && "border-neon-purple/30 text-neon-purple shadow-[0_0_10px_rgba(168,85,247,0.1)]",
               currentIndex === 2 && "border-red-500/30 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.1)]",
               currentIndex === 3 && "border-amber-500/30 text-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.1)]",
               currentIndex === 4 && "border-emerald-500/30 text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.1)]"
            )}>
              <Sparkles className="h-3 w-3" /> {currentSlide.badge}
            </div>
            
            <h3 className="text-2xl font-bold font-orbitron text-white mb-3 tracking-tighter drop-shadow-md">
              {currentSlide.title}
            </h3>
            
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed italic mb-6 font-exo px-4">
              &quot;{currentSlide.description}&quot;
            </p>

            <div className="flex justify-center items-center gap-4">
              {currentSlide.buttonLink ? (
                <Button 
                  asChild
                  className={cn(
                    "rounded-full px-8 h-10 font-orbitron text-[10px] tracking-widest uppercase transition-all hover:scale-105 active:scale-95 shadow-lg",
                    currentIndex === 0 && "bg-neon-blue hover:bg-neon-blue/80 text-white shadow-neon-blue/20",
                    currentIndex === 1 && "bg-neon-purple hover:bg-neon-purple/80 text-white shadow-neon-purple/20",
                    currentIndex === 2 && "bg-red-500 hover:bg-red-600 text-white shadow-red-500/20",
                    currentIndex === 3 && "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20",
                    currentIndex === 4 && "bg-emerald-500 hover:bg-emerald-600 text-black shadow-emerald-500/20"
                  )}
                >
                  <Link href={currentSlide.buttonLink}>
                    {currentSlide.buttonText}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <Button 
                  onClick={handleButtonClick}
                  className={cn(
                    "rounded-full px-8 h-10 font-orbitron text-[10px] tracking-widest uppercase transition-all hover:scale-105 active:scale-95 shadow-lg",
                    currentIndex === 0 && "bg-neon-blue hover:bg-neon-blue/80 text-white shadow-neon-blue/20",
                    currentIndex === 1 && "bg-neon-purple hover:bg-neon-purple/80 text-white shadow-neon-purple/20",
                    currentIndex === 2 && "bg-red-500 hover:bg-red-600 text-white shadow-red-500/20",
                    currentIndex === 3 && "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20",
                    currentIndex === 4 && "bg-emerald-500 hover:bg-emerald-600 text-black shadow-emerald-500/20"
                  )}
                >
                  {currentSlide.buttonText}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Progress Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {SLIDES.map((_, i) => (
          <button 
            key={i} 
            onClick={() => setCurrentIndex(i)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-500",
              i === currentIndex ? "w-8 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]" : "w-2 bg-white/20 hover:bg-white/40"
            )}
            title={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
