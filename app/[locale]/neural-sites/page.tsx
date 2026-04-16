"use client";

import React from "react";
import { 
  ArrowRight,
  ShieldCheck,
  Cpu,
  Globe,
  BarChart3,
  Bot,
  Factory,
  Database,
  Cloud,
  ScanHeart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { NeuralSitesPricing } from "@/components/neural-sites-pricing";

export default function NeuralSitesPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Decor - Industrial Glows */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-neon-blue/20 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-neon-purple/20 blur-[150px] rounded-full animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 py-12 max-w-6xl relative z-10">
        {/* Header Badge */}
        <header className="flex justify-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Badge variant="outline" className="border-neon-blue/50 text-neon-blue px-4 py-1.5 font-orbitron tracking-[0.3em] bg-neon-blue/5 uppercase text-[10px]">
              Neural Sites SaaS • Protocolo de Despliegue v2.0
            </Badge>
          </motion.div>
        </header>

        {/* Hero Section */}
        <section className="text-center mb-28">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-5xl md:text-8xl font-bold font-orbitron mb-8 tracking-tighter leading-tight"
          >
            <span className="gradient-text drop-shadow-[0_0_25px_rgba(0,163,255,0.5)]">
              Fábrica de Sitios IA-Native
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-white/70 max-w-4xl mx-auto font-light leading-relaxed mb-12"
          >
            Tu presencia digital no solo es inteligente, es <span className="text-neon-blue font-bold">Autónoma</span>. Despliega ecosistemas de contenido que respiran, aprenden y convierten bajo el mando de Beatriz.
          </motion.p>
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.4 }}
             className="flex flex-wrap justify-center gap-6"
          >
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-neon-blue to-neon-purple text-white px-10 h-16 rounded-full shadow-[0_0_30px_rgba(0,163,255,0.4)] font-orbitron tracking-widest text-sm hover:scale-105 transition-all group"
              asChild
            >
              <a href="#precios">
                ENCENDER MOTORES
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
          </motion.div>
        </section>

        {/* Triple Engine Section */}
        <section className="mb-40">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "ADN Digital Inteligente",
                desc: "Onboarding industrial. Beatriz absorbe la esencia de tu negocio para configurar un sitio que hable tu idioma desde el primer segundo.",
                icon: Bot,
                glow: "group-hover:shadow-[0_0_30px_rgba(0,163,255,0.3)]",
                border: "border-neon-blue/20"
              },
              {
                title: "Mantenimiento Autónomo",
                desc: "Olvídate de las actualizaciones. La IA gestiona el contenido, la seguridad y la optimización técnica 24/7 sin intervención humana.",
                icon: Factory,
                glow: "group-hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]",
                border: "border-neon-purple/20"
              },
              {
                title: "Evolución Dinámica",
                desc: "Tu sitio crece solo. Integración nativa con noticias IA, SEO predictivo y análisis de tendencias en tiempo real para mantenerte en el tope.",
                icon: BarChart3,
                glow: "group-hover:shadow-[0_0_30px_rgba(0,255,255,0.3)]",
                border: "border-cyan-500/20"
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`group relative p-8 rounded-3xl bg-card/10 backdrop-blur-2xl border ${feature.border} transition-all duration-500 ${feature.glow}`}
              >
                <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/10 group-hover:bg-white/10 transition-colors">
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-orbitron font-bold mb-4 text-white">{feature.title}</h3>
                <p className="text-white/60 leading-relaxed font-light">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Industrial Architecture Infographic */}
        <section className="mb-40 relative">
          <div className="absolute inset-0 bg-neon-blue/5 rounded-[40px] blur-3xl -z-10" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center p-8 md:p-16 rounded-[40px] border border-white/5 bg-black/40 backdrop-blur-3xl overflow-hidden">
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] text-white/50 font-orbitron uppercase tracking-widest mb-6">
                Infraestructura SaaS Enterprise
              </div>
              <h2 className="text-4xl md:text-5xl font-orbitron font-bold mb-8 leading-tight">Arquitectura de <span className="text-neon-blue">Alto Rendimiento</span></h2>
              <div className="space-y-6">
                {[
                  { name: "Global Edge Network", desc: "Despliegue instántaneo en más de 200 nodos mundiales.", icon: Globe },
                  { name: "IA-Native CMS", desc: "Beatriz escribe, diseña y publica noticias en tiempo real.", icon: Database },
                  { name: "Security Shield", desc: "Blindaje industrial contra ataques DDoS y malware.", icon: ShieldCheck },
                  { name: "Scalability Pro", desc: "Crecimiento ilimitado de tráfico sin cuellos de botella.", icon: Cloud }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="mt-1 h-10 w-10 shrink-0 rounded-lg bg-neon-blue/10 flex items-center justify-center group-hover:bg-neon-blue/20 transition-colors">
                      <item.icon className="h-5 w-5 text-neon-blue" />
                    </div>
                    <div>
                      <h4 className="font-orbitron font-bold text-sm text-white mb-1">{item.name}</h4>
                      <p className="text-xs text-white/40 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative aspect-square flex items-center justify-center">
               {/* Visual representation of the factory */}
               <div className="relative w-full h-full flex items-center justify-center">
                  <div className="absolute inset-0 border border-neon-blue/20 rounded-full animate-rotate-slow" />
                  <div className="absolute inset-20 border border-neon-purple/20 rounded-full animate-rotate-reverse" />
                  <div className="relative bg-gradient-to-br from-neon-blue to-neon-purple p-1 rounded-full shadow-[0_0_50px_rgba(0,163,255,0.3)]">
                    <div className="bg-background rounded-full p-8">
                      <Cpu className="h-16 w-16 text-white animate-pulse" />
                    </div>
                  </div>
                  {/* Floating particles */}
                  {[...Array(6)].map((_, i) => (
                    <div 
                      key={i}
                      className="absolute w-2 h-2 bg-neon-blue rounded-full blur-[1px] animate-float"
                      style={{ 
                        top: `${Math.random() * 100}%`, 
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${i * 0.5}s`
                      }}
                    />
                  ))}
               </div>
            </div>
          </div>
        </section>

        {/* Pricing Section (The moved section) */}
        <section id="precios" className="mb-40">
           <div className="text-center mb-16">
              <Badge className="bg-neon-blue/20 text-neon-blue border-neon-blue/30 mb-8 font-orbitron tracking-tighter">PROTOCOLO_MONETIZACIÓN</Badge>
              <h2 className="text-4xl font-orbitron font-bold mb-4 italic uppercase">Planes de Producción SaaS</h2>
              <p className="text-white/50 text-lg uppercase tracking-widest font-light">Elige el nivel de autonomía para tu imperio digital</p>
           </div>
           <NeuralSitesPricing />
        </section>

        {/* Final CTA Card */}
        <section className="mb-20">
          <Card className="p-12 bg-gradient-to-r from-neon-blue/20 via-background to-neon-purple/20 border-white/5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
            <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
              <div className="max-w-xl text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-orbitron font-bold mb-6 italic">¿Listo para la Revolución Autónoma?</h2>
                <p className="text-white/60 text-lg leading-relaxed mb-8 italic">
                  Deja que Beatriz tome el control. Mientras tú te enfocas en la estrategia, nosotros nos enfocamos en el éxito industrial.
                </p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/30 text-green-500 text-xs font-mono">
                    <ScanHeart className="h-4 w-4" /> UPTIME 99.9%
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-mono">
                    <Database className="h-4 w-4" /> REAL-TIME INJECTION
                  </div>
                </div>
              </div>
              <Button 
                size="lg" 
                className="bg-white text-black hover:bg-white/90 px-12 h-16 rounded-full font-orbitron font-bold tracking-widest text-sm shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                asChild
              >
                <a href="#precios">DESPLEGAR AHORA</a>
              </Button>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
