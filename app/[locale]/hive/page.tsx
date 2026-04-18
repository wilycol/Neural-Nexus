"use client";

import React, { useState } from "react";
import { 
  Network, 
  ArrowRight,
  ShieldCheck,
  Languages,
  Activity,
  Share2,
  Cpu,
  Globe
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const HIVE_CONTENT = {
  en: {
    hero: {
      badge: "Industrial Federation",
      title: "Nexus Hive Federation",
      subtitle: "The decentralized business neural network. Beyond a website, an ecosystem of shared authority.",
    },
    rings: {
      title: "The Ring Structure",
      subtitle: "A multi-layered ecosystem where every node strengthens the swarm.",
      items: [
        { 
          title: "The Hub (Nodo Central)", 
          desc: "Our primary gateway and authority source (DR/UR), distributing global trends to the network.",
          icon: Globe,
          color: "text-neon-blue"
        },
        { 
          title: "The Nodes (Satellites)", 
          desc: "Intelligent customer sites (Silver, Gold, Platinum) that channel niche traffic back to the hub.",
          icon: Share2,
          color: "text-emerald-500"
        },
        { 
          title: "Beatriz AI (Circulatory)", 
          desc: "The orchestrator managing telemetry, content generation, and dynamic cross-linking.",
          icon: Cpu,
          color: "text-neon-purple"
        }
      ]
    },
    dynamics: {
      title: "System Dynamics",
      subtitle: "How the information circulatory system flows through the Hive.",
      features: [
        { name: "Authority Injection", desc: "Central hub distributes high-value content to keep satellite nodes active and updated." },
        { name: "Traffic Routing", desc: "Niche organic traffic from nodes is channeled back to the central Hub to consolidate volume." },
        { name: "Semantic Cross-Linking", desc: "Beatriz AI identifies business opportunities between nodes and creates smart mentions." }
      ]
    },
    value: {
      title: "Federation Value",
      desc: "You don't just get a website; you join a Business Neural Network where your content is never invisible.",
      stats: [
        { label: "Network Connectivity", value: "100%" },
        { label: "Content Freshness", value: "Daily" },
        { label: "SEO Authority", value: "Shared" }
      ]
    }
  },
  es: {
    hero: {
      badge: "Federación Industrial",
      title: "Federación Nexus Hive",
      subtitle: "La red neuronal de negocios descentralizada. Más que una web, un ecosistema de autoridad compartida.",
    },
    rings: {
      title: "Estructura de Anillos",
      subtitle: "Un ecosistema multicapa donde cada nodo fortalece a la colmena.",
      items: [
        { 
          title: "The Hub (Nodo Central)", 
          desc: "Nuestra puerta de enlace principal y fuente de autoridad (DR/UR), distribuyendo tendencias globales.",
          icon: Globe,
          color: "text-neon-blue"
        },
        { 
          title: "The Nodes (Satélites)", 
          desc: "Sitios inteligentes de clientes (Silver, Gold, Platinum) que canalizan tráfico de nicho hacia el hub.",
          icon: Share2,
          color: "text-emerald-500"
        },
        { 
          title: "Beatriz AI (Circulatorio)", 
          desc: "El orquestador que gestiona la telemetría, generación de contenido y enlazado dinámico.",
          icon: Cpu,
          color: "text-neon-purple"
        }
      ]
    },
    dynamics: {
      title: "Dinámica del Sistema",
      subtitle: "Cómo fluye el sistema circulatorio de información a través de la Colmena.",
      features: [
        { name: "Inyección de Autoridad", desc: "El hub central distribuye contenido de alto valor para mantener los nodos satélite activos." },
        { name: "Enrutamiento de Tráfico", desc: "El tráfico orgánico de nicho se canaliza hacia el Hub central para consolidar el volumen." },
        { name: "Cross-Linking Semántico", desc: "Beatriz AI identifica oportunidades de negocio entre nodos y crea menciones inteligentes." }
      ]
    },
    value: {
      title: "Valor de la Federación",
      desc: "No solo obtienes una página web; te unes a una Red Neuronal de Negocios donde tu contenido nunca es invisible.",
      stats: [
        { label: "Conectividad de Red", value: "100%" },
        { label: "Frescura de Contenido", value: "Diaria" },
        { label: "Autoridad SEO", value: "Compartida" }
      ]
    }
  }
};

export default function HivePage() {
  const [lang, setLang] = useState<"en" | "es">("es");
  const content = HIVE_CONTENT[lang];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-blue/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/20 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>

      <div className="container mx-auto px-4 py-12 max-w-6xl relative z-10">
        {/* Header */}
        <header className="flex justify-between items-center mb-16">
          <Badge variant="outline" className="border-emerald-500/50 text-emerald-500 px-3 py-1 font-orbitron tracking-widest bg-emerald-500/5">
            {content.hero.badge}
          </Badge>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setLang(lang === "en" ? "es" : "en")}
            className="flex items-center gap-2 border-emerald-500/20 bg-black/20 hover:bg-emerald-500/10 rounded-full font-orbitron"
          >
            <Languages className="h-4 w-4 text-emerald-500" />
            {lang === "en" ? "Español" : "English"}
          </Button>
        </header>

        {/* Hero Section */}
        <section className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block p-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-6"
          >
            <Network className="h-10 w-10 text-emerald-500" />
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-bold font-orbitron mb-6 tracking-tighter leading-none">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-neon-blue to-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.4)]">
              {content.hero.title}
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
            {content.hero.subtitle}
          </p>
        </section>

        {/* Ring Architecture */}
        <section className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-orbitron font-bold mb-4">{content.rings.title}</h2>
            <p className="text-muted-foreground text-lg">{content.rings.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.rings.items.map((item, idx) => (
              <Card key={idx} className="p-8 bg-card/20 backdrop-blur-xl border-white/5 hover:border-emerald-500/40 transition-all group">
                <div className={cn("h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(255,255,255,0.05)]", item.color)}>
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-orbitron font-bold mb-3">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Dynamics Section */}
        <section className="mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-orbitron font-bold mb-6">{content.dynamics.title}</h2>
              <p className="text-muted-foreground text-lg mb-8">{content.dynamics.subtitle}</p>
              <div className="space-y-4">
                {content.dynamics.features.map((feature, idx) => (
                  <div key={idx} className="flex gap-4 p-5 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-emerald-500/[0.05] transition-all group">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                      <Activity className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-orbitron font-bold text-sm mb-1 group-hover:text-emerald-400 transition-colors">{feature.name}</h4>
                      <p className="text-xs text-muted-foreground">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative p-8 rounded-3xl border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-3xl overflow-hidden group">
               <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]" />
               <div className="relative z-10 flex flex-col items-center justify-center min-h-[300px] text-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-emerald-500/20 blur-[50px] animate-pulse rounded-full" />
                    <Network className="h-32 w-32 text-emerald-500 relative z-10" />
                  </div>
                  <p className="mt-8 font-orbitron text-xs tracking-[0.3em] uppercase opacity-50">Industrial Swarm Protocol Active</p>
               </div>
            </div>
          </div>
        </section>

        {/* Value Prop */}
        <section className="mb-32">
          <Card className="p-12 bg-gradient-to-br from-emerald-500/10 via-background to-neon-blue/10 border-emerald-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <ShieldCheck className="h-32 w-32 text-emerald-500" />
            </div>
            <div className="max-w-2xl relative z-10">
              <h2 className="text-3xl font-orbitron font-bold mb-6">{content.value.title}</h2>
              <p className="text-lg text-muted-foreground mb-10 leading-relaxed italic">
                &quot;{content.value.desc}&quot;
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                {content.value.stats.map((stat, idx) => (
                  <div key={idx}>
                    <p className="text-[10px] uppercase font-orbitron tracking-widest text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold font-orbitron text-emerald-500 shadow-emerald-500/20 drop-shadow-sm">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </section>

        {/* Call to Action */}
        <footer className="text-center py-20 border-t border-white/5">
          <h2 className="text-3xl font-orbitron font-bold mb-6">¿Preparado para unirte a la colmena?</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg" 
              asChild
              className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold px-8 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all hover:scale-105 active:scale-95"
            >
              <Link href="/#pricing">
                Empezar Construcción
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            
            <Button size="lg" variant="outline" className="rounded-full border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10" asChild>
              <Link href="/pitch">
                Visión Técnica 1-3-1
              </Link>
            </Button>
          </div>
        </footer>
      </div>
    </div>
  );
}
