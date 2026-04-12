"use client";

import React, { useState } from "react";
import { 
  Workflow, 
  Network, 
  Flame, 
  ArrowRight,
  Layers,
  BarChart3,
  TrendingUp,
  ShieldCheck,
  Languages
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PitchVideoCarousel } from "@/components/pitch-video-carousel";
import { AICollaborators } from "@/components/ai-collaborators";

const PITCH_CONTENT = {
  en: {
    hero: {
      badge: "The Future of Media",
      title: "Neural Nexus: Technical Vision",
      subtitle: "Autonomous Content Engineering for the Hyper-Connected Era.",
    },
    strategy: {
      title: "The 1-3-1 Strategy",
      subtitle: "Our proprietary orchestration for industrial-scale content production.",
      items: [
        { 
          title: "1 Deep Trend", 
          desc: "Multi-layered OSINT research using Groq & Deepseek to identify signals before they peak.",
          icon: Network
        },
        { 
          title: "3 Synthesis Models", 
          desc: "Orchestrating Google Veo 3.1, Magic Hour, and Wan 2.6 for high-fidelity audio/visual generation.",
          icon: Layers
        },
        { 
          title: "1 Viral Impact", 
          desc: "Smart distribution through our Growth Engine to maximize cross-platform engagement.",
          icon: Flame
        }
      ]
    },
    architecture: {
      title: "System Architecture",
      subtitle: "A seamless pipeline from autonomous research to global publication.",
      layers: [
        { name: "Beatriz AutoPublisher", status: "Active Core", desc: "The autonomous brain driving research and script generation." },
        { name: "Neural Nexus Bridge", status: "Enterprise API", desc: "High-performance receiver and content processor." },
        { name: "Growth Engine", status: "Algorithmic", desc: "Real-time performance tracking and viral detection." },
        { name: "Social Expansion", status: "Deployment", desc: "Automated adaptation for TikTok, Reels, and YouTube Shorts." }
      ]
    },
    engine: {
      title: "The Growth Engine",
      formula: "score = (views * 0.4) + (likes * 0.3) + (shares * 0.3)",
      stats: [
        { label: "Viral Threshold", value: "300+ Points" },
        { label: "Trend Detection", value: "< 5ms" },
        { label: "Scalability", value: "Unlimited" }
      ]
    }
  },
  es: {
    hero: {
      badge: "El Futuro de los Medios",
      title: "Neural Nexus: Visión Técnica",
      subtitle: "Ingeniería de Contenido Autónomo para la Era Hiper-Conectada.",
    },
    strategy: {
      title: "La Estrategia 1-3-1",
      subtitle: "Nuestra orquestación patentada para la producción de contenido a escala industrial.",
      items: [
        { 
          title: "1 Tendencia Profunda", 
          desc: "Investigación OSINT multicapa usando Groq y Deepseek para identificar señales antes del pico.",
          icon: Network
        },
        { 
          title: "3 Modelos de Síntesis", 
          desc: "Orquestación de Google Veo 3.1, Magic Hour y Wan 2.6 para generación audiovisual de alta fidelidad.",
          icon: Layers
        },
        { 
          title: "1 Impacto Viral", 
          desc: "Distribución inteligente a través de nuestro Growth Engine para maximizar el engagement multiplataforma.",
          icon: Flame
        }
      ]
    },
    architecture: {
      title: "Arquitectura del Sistema",
      subtitle: "Un pipeline fluido desde la investigación autónoma hasta la publicación global.",
      layers: [
        { name: "Beatriz AutoPublisher", status: "Núcleo Activo", desc: "El cerebro autónomo que impulsa la investigación y generación de guiones." },
        { name: "Neural Nexus Bridge", status: "API Enterprise", desc: "Receptor y procesador de contenido de alto rendimiento." },
        { name: "Growth Engine", status: "Algorítmico", desc: "Seguimiento de rendimiento en tiempo real y detección viral." },
        { name: "Social Expansion", status: "Despliegue", desc: "Adaptación automatizada para TikTok, Reels y YouTube Shorts." }
      ]
    },
    engine: {
      title: "El Motor de Crecimiento",
      formula: "puntuación = (vistas * 0.4) + (likes * 0.3) + (shares * 0.3)",
      stats: [
        { label: "Umbral Viral", value: "300+ Puntos" },
        { label: "Detección de Tendencia", value: "< 5ms" },
        { label: "Escalabilidad", value: "Ilimitada" }
      ]
    }
  }
};

export default function PitchPage() {
  const [lang, setLang] = useState<"en" | "es">("es");
  const content = PITCH_CONTENT[lang];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-blue/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-purple/20 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>

      <div className="container mx-auto px-4 py-12 max-w-6xl relative z-10">
        {/* Header with Language Switch */}
        <header className="flex justify-between items-center mb-16">
          <Badge variant="outline" className="border-neon-blue/50 text-neon-blue px-3 py-1 font-orbitron tracking-widest bg-neon-blue/5">
            {content.hero.badge}
          </Badge>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setLang(lang === "en" ? "es" : "en")}
            className="flex items-center gap-2 border-neon-blue/20 bg-black/20 hover:bg-neon-blue/10 rounded-full font-orbitron"
          >
            <Languages className="h-4 w-4 text-neon-blue" />
            {lang === "en" ? "Español" : "English"}
          </Button>
        </header>

        {/* Hero Section */}
        <section className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-bold font-orbitron mb-6 tracking-tighter leading-none">
            <span className="gradient-text drop-shadow-[0_0_15px_rgba(0,163,255,0.4)]">
              {content.hero.title}
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
            {content.hero.subtitle}
          </p>
        </section>

        {/* Video Pitch Showcase */}
        <section className="mb-32">
          <div className="text-center mb-10">
            <Badge className="bg-neon-purple/20 text-neon-purple border-neon-purple/30 mb-4 font-mono">VISION_SHOWCASE_V1</Badge>
            <h2 className="text-3xl font-orbitron font-bold">Beatriz Presence</h2>
          </div>
          <PitchVideoCarousel />
        </section>

        {/* Strategy Section */}
        <section className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-orbitron font-bold mb-4">{content.strategy.title}</h2>
            <p className="text-muted-foreground text-lg">{content.strategy.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.strategy.items.map((item, idx) => (
              <Card key={idx} className="p-8 bg-card/20 backdrop-blur-xl border-neon-blue/10 hover:border-neon-blue/40 transition-all group">
                <div className="h-12 w-12 rounded-xl bg-neon-blue/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(0,163,255,0.2)]">
                  <item.icon className="h-6 w-6 text-neon-blue" />
                </div>
                <h3 className="text-xl font-orbitron font-bold mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Architecture Section */}
        <section className="mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-orbitron font-bold mb-6">{content.architecture.title}</h2>
              <p className="text-muted-foreground text-lg mb-8">{content.architecture.subtitle}</p>
              <div className="space-y-4">
                {content.architecture.layers.map((layer, idx) => (
                  <div key={idx} className="flex gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all">
                    <div className="mt-1 h-3 w-3 rounded-full bg-neon-blue animate-pulse" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-orbitron font-bold text-sm">{layer.name}</span>
                        <Badge variant="secondary" className="text-[9px] h-4 font-mono px-1.5 opacity-60">{layer.status}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{layer.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl border border-neon-blue/20 bg-gradient-to-br from-neon-blue/5 via-transparent to-neon-purple/5 p-8 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-grid-white/[0.03]" />
                <div className="relative z-10 flex flex-col items-center gap-6">
                  <div className="h-20 w-20 rounded-full bg-neon-blue/20 flex items-center justify-center shadow-[0_0_30px_rgba(0,163,255,0.3)] animate-pulse">
                    <Workflow className="h-10 w-10 text-neon-blue" />
                  </div>
                  <div className="flex gap-8">
                    <div className="h-14 w-14 rounded-xl bg-neon-purple/10 border border-neon-purple/20 flex items-center justify-center animate-bounce delay-100">
                      <BarChart3 className="h-6 w-6 text-neon-purple" />
                    </div>
                    <div className="h-14 w-14 rounded-xl bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center animate-bounce delay-300">
                      <TrendingUp className="h-6 w-6 text-blue-400" />
                    </div>
                  </div>
                </div>
              </div>
              {/* Floating orbits */}
              <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full border border-dashed border-neon-blue/30 animate-spin-slow" />
              <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full border border-dashed border-neon-purple/20 animate-spin-reverse-slow" />
            </div>
          </div>
        </section>

        {/* Growth Engine Details */}
        <section className="mb-32">
          <Card className="p-12 bg-gradient-to-r from-neon-blue/5 to-neon-purple/5 border-neon-blue/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <ShieldCheck className="h-32 w-32 text-neon-blue" />
            </div>
            <div className="max-w-2xl">
              <h2 className="text-3xl font-orbitron font-bold mb-6">{content.engine.title}</h2>
              <div className="p-6 rounded-2xl bg-black/40 border border-neon-blue/30 mb-8 inline-block shadow-[inset_0_0_20px_rgba(0,163,255,0.1)]">
                <code className="text-xl md:text-2xl font-mono text-neon-blue font-bold tracking-tight">
                  {content.engine.formula}
                </code>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                {content.engine.stats.map((stat, idx) => (
                  <div key={idx}>
                    <p className="text-[10px] uppercase font-orbitron tracking-widest text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold font-orbitron text-white">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </section>

        {/* Partners Marquee */}
        <section className="mb-32">
          <AICollaborators />
        </section>

        {/* Footer Call to Action */}
        <footer className="text-center py-20 border-t border-white/5">
          <h2 className="text-3xl font-orbitron font-bold mb-6">Ready to scale?</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-gradient-to-r from-neon-blue to-neon-purple text-white px-8 rounded-full shadow-[0_0_20px_rgba(0,163,255,0.4)]">
              Partner with Neural Nexus
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-full border-neon-blue/20 text-neon-blue hover:bg-neon-blue/10">
              Documentation
            </Button>
          </div>
        </footer>
      </div>

      <style jsx global>{`
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes spin-reverse-slow {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .animate-spin-reverse-slow {
          animation: spin-reverse-slow 25s linear infinite;
        }
        .gradient-text {
          background: linear-gradient(to right, #00a3ff, #a855f7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </div>
  );
}
