"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Zap, Search, Layers, Sparkles, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { templates } from "@/lib/templates-data";

export const TemplateCarousel3D = () => {
  // 3D Carousel State
  const [activeSeries, setActiveSeries] = useState<"kimi" | "classic">("kimi");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Catalog Grid State
  const [searchQuery, setSearchQuery] = useState("");
  const [gridFilter, setGridFilter] = useState<"all" | "kimi" | "classic">("all");

  const currentCarouselTemplates = useMemo(() => {
    return activeSeries === "kimi" 
      ? templates.filter(t => !t.isClassic) 
      : templates.filter(t => t.isClassic);
  }, [activeSeries]);

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % currentCarouselTemplates.length);
  }, [currentCarouselTemplates]);

  const prev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + currentCarouselTemplates.length) % currentCarouselTemplates.length);
  }, [currentCarouselTemplates]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [activeSeries]);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(next, 3500);
    return () => clearInterval(interval);
  }, [isAutoPlaying, next]);

  const getPosition = (index: number) => {
    const total = currentCarouselTemplates.length;
    const diff = (index - currentIndex + total) % total;
    
    if (diff === 0) return "center";
    if (diff === 1 || diff === -(total - 1)) return "right";
    if (diff === total - 1 || diff === -1) return "left";
    return "hidden";
  };

  const variants = {
    center: { x: "0%", scale: 1, zIndex: 10, opacity: 1, rotateY: 0, filter: "blur(0px)" },
    right: { x: "50%", scale: 0.75, zIndex: 5, opacity: 0.4, rotateY: -40, filter: "blur(6px)" },
    left: { x: "-50%", scale: 0.75, zIndex: 5, opacity: 0.4, rotateY: 40, filter: "blur(6px)" },
    hidden: { x: "0%", scale: 0.4, zIndex: 0, opacity: 0, filter: "blur(15px)" }
  };

  // Catalog filtering logic
  const filteredGridTemplates = useMemo(() => {
    return templates.filter((template) => {
      const matchesSearch = 
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.niche.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.badge.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = 
        gridFilter === "all" ||
        (gridFilter === "kimi" && !template.isClassic) ||
        (gridFilter === "classic" && template.isClassic);

      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, gridFilter]);

  return (
    <div className="relative w-full max-w-7xl mx-auto py-8 px-4 overflow-hidden">
      
      {/* SECTION 1: Carousel 3D Showcase */}
      <div className="text-center mb-10">
        <span className="text-[10px] font-orbitron tracking-[0.4em] text-neon-blue uppercase bg-neon-blue/5 px-4 py-1.5 rounded-full border border-neon-blue/10">
          Galardonadas de la Colmena
        </span>
        <h3 className="text-2xl md:text-3xl font-orbitron font-bold mt-4 mb-8 uppercase tracking-widest text-white">
          Showcase 3D de Modelos Activos
        </h3>

        {/* Series Tabs for Carousel */}
        <div className="flex justify-center gap-4 mb-8">
          <Button
            onClick={() => setActiveSeries("kimi")}
            className={`rounded-full px-6 py-2 font-orbitron text-xs tracking-wider transition-all duration-300 ${
              activeSeries === "kimi"
                ? "bg-neon-blue text-black shadow-[0_0_15px_rgba(0,240,255,0.4)]"
                : "bg-white/5 border border-white/10 text-white hover:bg-white/10"
            }`}
          >
            <Layers className="h-3.5 w-3.5 mr-2" /> SERIE MODULAR KIMI ({templates.filter(t => !t.isClassic).length})
          </Button>
          <Button
            onClick={() => setActiveSeries("classic")}
            className={`rounded-full px-6 py-2 font-orbitron text-xs tracking-wider transition-all duration-300 ${
              activeSeries === "classic"
                ? "bg-neon-purple text-white shadow-[0_0_15px_rgba(184,41,247,0.4)]"
                : "bg-white/5 border border-white/10 text-white hover:bg-white/10"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 mr-2" /> SERIE ELITE CLASSIC ({templates.filter(t => t.isClassic).length})
          </Button>
        </div>
      </div>

      <div className="relative h-[460px] flex items-center justify-center perspective-1000">
        <AnimatePresence initial={false}>
          {currentCarouselTemplates.map((template, index) => {
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
                      <div className="text-[8px] font-mono text-white/20 tracking-tighter">
                        https://neural-nexus.ai/demo/{template.id}
                      </div>
                    </div>
                  </div>

                  {/* Template Visual Content */}
                  <div 
                    className="absolute inset-0 pt-10 flex flex-col items-center justify-center p-10 text-center"
                    style={{ 
                      background: `radial-gradient(circle at center, ${template.accentHex}15 0%, transparent 70%), #080808`
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
                      <div className="absolute inset-0 blur-2xl opacity-20" style={{ backgroundColor: template.accentHex }} />
                      <Zap className="h-16 w-16 relative z-10" style={{ color: template.accentHex }} />
                    </motion.div>
                    
                    <span className="text-[10px] font-orbitron tracking-[0.5em] text-white/30 mb-4 uppercase">
                      {template.isClassic ? "Protocolo Classic Elite" : "Protocolo Kimi Modular"}
                    </span>
                    <h4 className="text-4xl font-orbitron font-black mb-4 tracking-tighter" style={{ color: template.accentHex }}>
                      {template.name}
                    </h4>
                    <div className="h-[1px] w-12 mb-6" style={{ backgroundColor: template.accentHex }} />
                    <p className="text-white/50 text-xs uppercase tracking-[0.2em] font-light leading-relaxed max-w-[240px]">
                      Especializado para: <br/>
                      <span className="text-white font-bold">{template.niche}</span>
                    </p>
                  </div>

                  {/* Hover Overlay Buttons */}
                  <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center gap-4 z-30">
                     <Button 
                        className="bg-white text-black hover:bg-white/90 rounded-full font-orbitron text-[10px] tracking-widest px-8"
                        onClick={() => window.open(`/es/neural-sites/demo/${template.id}`, "_blank")}
                     >
                        VER DEMO EN VIVO
                     </Button>
                     <div className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] max-w-[250px] text-center px-4">
                       {template.heroSubtitle}
                     </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Modern Navigation Controls */}
      <div className="mt-8 flex flex-col items-center gap-8 mb-24">
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
            Nicho {currentIndex + 1} <span className="text-white/20 mx-2">|</span> {currentCarouselTemplates.length}
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
          {currentCarouselTemplates.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setCurrentIndex(i)}
              className={`h-1 rounded-full transition-all duration-500 ${
                i === currentIndex 
                  ? "w-6 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]" 
                  : "w-1 bg-white/10 hover:bg-white/30"
              }`} 
            />
          ))}
        </div>
      </div>

      {/* SECTION 2: Master Grid Catalog of 31 Templates */}
      <div className="border-t border-white/5 pt-20 mb-16">
        <div className="text-center mb-12">
          <span className="text-[10px] font-orbitron tracking-[0.4em] text-neon-purple uppercase bg-neon-purple/5 px-4 py-1.5 rounded-full border border-neon-purple/10">
            Base de Conocimiento de Beatriz AI
          </span>
          <h2 className="text-3xl md:text-5xl font-orbitron font-black text-center mt-4 mb-4 uppercase italic tracking-widest text-white">
            Catálogo Global Neural
          </h2>
          <p className="text-white/40 uppercase tracking-[0.2em] text-xs max-w-2xl mx-auto">
            Explora las {templates.length} plantillas adaptativas. Busca y filtra para desplegar instantáneamente con nuestro Scaffolder Modular.
          </p>
        </div>

        {/* Catalog Control Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 bg-white/[0.02] border border-white/5 p-6 rounded-3xl backdrop-blur-xl">
          {/* Search Box */}
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            <input 
              type="text" 
              placeholder="Buscar por nicho, nombre, serie..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-neon-blue rounded-full pl-12 pr-6 py-3 text-sm text-white placeholder-white/30 focus:outline-none transition-all"
            />
          </div>

          {/* Catalog Tab Filters */}
          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setGridFilter("all")}
              className={`rounded-full font-orbitron text-[9px] tracking-widest px-4 h-9 ${
                gridFilter === "all"
                  ? "bg-white text-black border-white"
                  : "border-white/10 text-white/70 hover:bg-white/5"
              }`}
            >
              TODAS ({templates.length})
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setGridFilter("kimi")}
              className={`rounded-full font-orbitron text-[9px] tracking-widest px-4 h-9 ${
                gridFilter === "kimi"
                  ? "bg-neon-blue/20 text-neon-blue border-neon-blue/30"
                  : "border-white/10 text-white/70 hover:bg-white/5"
              }`}
            >
              MODULAR KIMI ({templates.filter(t => !t.isClassic).length})
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setGridFilter("classic")}
              className={`rounded-full font-orbitron text-[9px] tracking-widest px-4 h-9 ${
                gridFilter === "classic"
                  ? "bg-neon-purple/20 text-neon-purple border-neon-purple/30"
                  : "border-white/10 text-white/70 hover:bg-white/5"
              }`}
            >
              ELITE CLASSIC ({templates.filter(t => t.isClassic).length})
            </Button>
          </div>

          {/* Results Badge */}
          <div className="font-mono text-[10px] tracking-wider bg-white/5 px-4 py-2 border border-white/5 rounded-full text-white/50">
            [ <span className="text-white font-bold">{filteredGridTemplates.length}</span> ENCONTRADAS ]
          </div>
        </div>

        {/* Catalog Grid Display */}
        <AnimatePresence mode="popLayout">
          {filteredGridTemplates.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredGridTemplates.map((template) => (
                <motion.div
                  key={template.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="relative group rounded-3xl border border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent p-6 hover:border-white/20 transition-all flex flex-col justify-between overflow-hidden"
                >
                  {/* Accent Glowing Background */}
                  <div 
                    className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(circle at 80% 20%, ${template.accentHex} 0%, transparent 60%)`
                    }}
                  />

                  <div>
                    {/* Header: Badge & Category Indicator */}
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-[8px] font-mono text-white/30 tracking-widest uppercase">
                        {template.isClassic ? "Serie Classic Elite" : "Serie Kimi Modular"}
                      </span>
                      <span 
                        className="h-2 w-2 rounded-full shadow-[0_0_10px_currentColor]"
                        style={{ color: template.accentHex, backgroundColor: template.accentHex }}
                      />
                    </div>

                    {/* Template Name & Niche */}
                    <h4 
                      className="text-2xl font-orbitron font-black tracking-tight mb-2 uppercase group-hover:translate-x-1 transition-transform duration-300"
                      style={{ color: template.accentHex }}
                    >
                      {template.name}
                    </h4>
                    <p className="text-xs text-white/50 uppercase tracking-widest mb-4 font-mono font-bold">
                      {template.niche}
                    </p>
                    
                    {/* Subtitle Description */}
                    <p className="text-xs text-white/40 leading-relaxed font-light mb-8">
                      {template.heroSubtitle}
                    </p>
                  </div>

                  {/* Actions Area */}
                  <div className="border-t border-white/5 pt-4 flex items-center justify-between mt-auto">
                    <span className="text-[9px] font-mono text-white/20">
                      /{template.id}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => window.open(`/es/neural-sites/demo/${template.id}`, "_blank")}
                      className="bg-white/5 hover:bg-white text-white hover:text-black rounded-full font-orbitron text-[9px] tracking-widest px-4 h-8 flex items-center gap-1.5 transition-all border border-white/10"
                    >
                      VER DEMO <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-white/[0.01] border border-dashed border-white/5 rounded-3xl"
            >
              <Zap className="h-12 w-12 text-white/10 mx-auto mb-4" />
              <h3 className="text-lg font-orbitron font-bold text-white/60 mb-2">CÓDIGO_NO_ENCONTRADO</h3>
              <p className="text-xs text-white/30 uppercase tracking-wider">
                Ninguna plantilla de la federación coincide con tu consulta de búsqueda.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
};
