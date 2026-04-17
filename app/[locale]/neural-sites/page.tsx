"use client";

import React, { useState, useEffect } from "react";
import { 
  ScanHeart,
  Zap,
  Check,
  Play,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Globe,
  BarChart3,
  Bot,
  Factory,
  Database,
  Cloud,
  Activity,
  History,
  TrendingUp,
  MonitorCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { NeuralSitesPricing } from "@/components/neural-sites-pricing";

const PLAN_IMAGES = [
  "/assets/plans/silver.png",
  "/assets/plans/gold.png",
  "/assets/plans/platinum.png"
];

export default function NeuralSitesPage() {
  const [currentPlanImage, setCurrentPlanImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPlanImage((prev) => (prev + 1) % PLAN_IMAGES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
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
        <section className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-4xl md:text-7xl font-bold font-orbitron mb-8 tracking-tighter leading-tight"
          >
            <span className="gradient-text drop-shadow-[0_0_25px_rgba(0,163,255,0.5)]">
              Tu negocio debería publicar contenido todos los días… sin que tú hagas nada.
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-white/70 max-w-4xl mx-auto font-light leading-relaxed mb-12"
          >
            Construimos páginas web que generan y publican contenido automáticamente con IA, para que tu negocio se mantenga activo, visible y creciendo 24/7.
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
                Quiero mi web automática
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
            <Button 
              variant="outline"
              size="lg" 
              className="border-white/10 text-white px-10 h-16 rounded-full font-orbitron tracking-widest text-sm hover:bg-white/5 transition-all"
              asChild
            >
              <a href="#demo">Ver demo</a>
            </Button>
          </motion.div>
        </section>

        {/* Video Section Placeholder */}
        <section id="demo" className="mb-28">
          <div className="aspect-video w-full max-w-5xl mx-auto rounded-[32px] border border-white/10 bg-black/60 shadow-2xl relative overflow-hidden group cursor-pointer">
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-colors">
              <div className="h-20 w-20 rounded-full bg-neon-blue flex items-center justify-center shadow-[0_0_30px_rgba(0,163,255,0.5)] group-hover:scale-110 transition-transform">
                <Play className="h-8 w-8 text-black fill-current ml-1" />
              </div>
            </div>
            <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
              <div className="font-orbitron text-xs text-white/40 tracking-[0.3em] uppercase">Introducción Neural Sites SaaS</div>
              <div className="h-1 w-32 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full w-1/3 bg-neon-blue" />
              </div>
            </div>
          </div>
        </section>

        {/* Problema Section */}
        <section className="mb-28 text-center max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-orbitron font-bold mb-8">
            La mayoría de las páginas web mueren después de crearse.
          </h2>
          <p className="text-xl text-white/60 leading-relaxed italic">
            &quot;No hay contenido nuevo. No hay tráfico. No hay resultados. <br/>
            <span className="text-neon-blue font-bold">Una web sin contenido es invisible.</span>&quot;
          </p>
        </section>

        {/* Solución Section */}
        <section className="mb-28 bg-white/5 p-12 rounded-[40px] border border-white/5 backdrop-blur-3xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-orbitron font-bold mb-8">Convertimos tu web en un sistema vivo.</h2>
              <ul className="space-y-6">
                {[
                  "Publica contenido automáticamente",
                  "Usa tus propios productos e imágenes",
                  "Mantiene tu negocio activo todos los días",
                  "No requiere trabajo manual"
                ].map((text, i) => (
                  <li key={i} className="flex items-center gap-4 text-white/80">
                    <div className="h-8 w-8 rounded-full bg-neon-blue/20 flex items-center justify-center text-neon-blue">
                      <Check className="h-5 w-5" />
                    </div>
                    {text}
                  </li>
                ))}
              </ul>
            </div>
            <div className="hidden lg:block">
              <div className="relative aspect-video rounded-2xl border border-white/10 bg-gradient-to-br from-neon-blue/10 to-neon-purple/10 flex items-center justify-center">
                 <Zap className="h-20 w-20 text-neon-blue animate-pulse" />
              </div>
            </div>
          </div>
        </section>

        {/* Casos de Uso Section */}
        <section className="mb-28">
          <h2 className="text-4xl font-orbitron font-bold text-center mb-16 uppercase italic tracking-widest">Creado para negocios reales</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "PARA TIENDAS", desc: "Publica productos, ofertas y promociones automáticamente todos los días.", icon: Database },
              { title: "PARA RESTAURANTES", desc: "Mantén tu menú y promociones activos sin contratar un creador de contenido.", icon: Factory },
              { title: "PARA MARCAS PERSONALES", desc: "Mantente visible sin tener que crear contenido manualmente.", icon: Bot }
            ].map((item, i) => (
              <Card key={i} className="p-8 bg-white/5 border-white/10 rounded-3xl hover:border-neon-blue transition-colors">
                <h3 className="text-neon-blue font-bold mb-4 font-orbitron">{item.title}</h3>
                <p className="text-white/60">{item.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Galería de Complejidad (Templates) */}
        <section className="mb-28">
           <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-orbitron font-bold mb-4">Niveles de Complejidad</h2>
              <p className="text-white/40 uppercase tracking-[0.2em] text-xs">Despliegue Adaptativo de Beatriz AI para Máxima Conversión</p>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end">
              {[
                { 
                  level: "Low", 
                  desc: "Presencia digital básica y efectiva.", 
                  areas: ["Encabezado", "Sobre Nosotros", "Contacto"],
                  color: "white/20",
                  height: "h-[350px]",
                  glow: ""
                },
                { 
                  level: "Mid-Low", 
                  desc: "Estructura comercial con flujo de blog.", 
                  areas: ["Hero Section", "Servicios", "Blog IA", "Newsletter"],
                  color: "neon-blue/40",
                  height: "h-[400px]",
                  glow: "shadow-[0_0_20px_rgba(0,163,255,0.1)]"
                },
                { 
                  level: "Middle", 
                  desc: "Sistema multimedia con interacción dinámica.", 
                  areas: ["Imágenes IA", "Galería", "FAQ IA", "Lead Magnet"],
                  color: "neon-blue",
                  height: "h-[450px]",
                  glow: "shadow-[0_0_25px_rgba(0,163,255,0.2)]"
                },
                { 
                  level: "Mid-High", 
                  desc: "Omnicanalidad y automatización avanzada.", 
                  areas: ["Social Sync", "News Feed", "Lead CRM", "SEO Audit"],
                  color: "neon-purple",
                  height: "h-[500px]",
                  glow: "shadow-[0_0_30px_rgba(168,85,247,0.2)]"
                },
                { 
                  level: "High", 
                  desc: "Ecosistema industrial de contenido total.", 
                  areas: ["Video Gen IA", "Real-time Data", "Advanced SEO", "A/B Testing", "Bi-Sync"],
                  color: "white",
                  featured: true,
                  height: "h-[550px]",
                  glow: "shadow-[0_0_40px_rgba(255,255,255,0.3)]"
                }
              ].map((template, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`group relative ${template.height} rounded-2xl border transition-all duration-500 cursor-crosshair overflow-hidden p-6 flex flex-col justify-between
                    ${template.featured ? 'bg-gradient-to-b from-white/10 to-transparent border-white/40 scale-105 z-20 shadow-2xl' : 'bg-white/5 border-white/5 hover:border-neon-blue/50'}
                    ${template.glow}
                  `}
                >
                   {template.featured && (
                     <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-neon-blue via-white to-neon-purple" />
                   )}
                   <div className="space-y-4">
                      <div className={`font-bold font-orbitron text-[10px] tracking-widest uppercase ${template.featured ? 'text-white' : 'text-neon-blue'}`}>
                        {template.level}
                      </div>
                      <div className="h-[1px] w-full bg-white/10" />
                      <div className="space-y-2">
                         {template.areas.map((area, j) => (
                           <motion.div 
                            initial={{ x: -10, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            transition={{ delay: (i*0.1) + (j*0.05) }}
                            key={j} 
                            className={`text-[8px] border rounded px-2 py-1 uppercase tracking-tighter
                              ${template.featured ? 'border-white/20 text-white/60 bg-white/5' : 'border-white/5 text-white/30'}
                            `}
                           >
                              {area}
                           </motion.div>
                         ))}
                      </div>
                   </div>
                   <div className="space-y-4">
                      <p className={`text-[10px] leading-snug ${template.featured ? 'text-white font-medium' : 'text-white/50'}`}>
                        {template.desc}
                      </p>
                      {template.featured && (
                        <div className="text-[8px] font-orbitron text-neon-blue animate-pulse">RECOMENDADO PARA ESCALAR</div>
                      )}
                   </div>
                </motion.div>
              ))}
           </div>
        </section>

        {/* Triple Engine Section -> Contenido Automático */}
        <section className="mb-28">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Configuración Automática",
                desc: "Onboarding comercial. Beatriz AI absorbe la esencia de tu negocio para configurar un sitio que hable tu idioma desde el primer segundo.",
                icon: Bot,
                glow: "group-hover:shadow-[0_0_30px_rgba(0,163,255,0.3)]",
                border: "border-neon-blue/20"
              },
              {
                title: "Publicaciones Diarias",
                desc: "Olvídate de las actualizaciones. Beatriz AI gestiona el contenido automático, la seguridad y el negocio activo 24/7 sin trabajo manual.",
                icon: Factory,
                glow: "group-hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]",
                border: "border-neon-purple/20"
              },
              {
                title: "Crecimiento Sin Esfuerzo",
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

        {/* Diferencial Clave */}
        <section className="mb-28 relative overflow-hidden flex flex-col items-center justify-center p-16 rounded-[60px] border border-white/5 bg-black/40 backdrop-blur-3xl shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-tr from-neon-blue/5 to-neon-purple/5 -z-10" />
          <div className="flex flex-col items-center text-center max-w-4xl">
            <Badge variant="outline" className="mb-8 border-neon-blue/50 text-neon-blue px-3 py-1 font-orbitron text-[10px] tracking-[0.3em]">
              TELEMETRÍA_AVANZADA • PROTOCOLO_X
            </Badge>
            <h2 className="text-4xl md:text-5xl font-orbitron font-bold mb-8 italic text-neon-blue drop-shadow-neon">Aprende lo que funciona.</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-8">
              <p className="text-lg text-white/70 leading-relaxed text-left">
                Nuestra arquitectura integra trazabilidad absoluta y telemetría de comportamiento en tiempo real. 
                <span className="text-white font-bold"> Beatriz AI no solo observa; decodifica qué convierte y qué no</span>, ajustando cada píxel de contenido para maximizar tu Retorno de Inversión automáticamente.
              </p>
              <div className="space-y-4">
                 {[
                   { label: "Trazabilidad de Sesión", icon: History },
                   { label: "Telemetría de Conversión", icon: Activity },
                   { label: "Ajuste Predictivo", icon: TrendingUp },
                   { label: "Validación de Contenido", icon: MonitorCheck }
                 ].map((item, idx) => (
                   <div key={idx} className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                      <item.icon className="h-4 w-4 text-neon-blue" />
                      <span className="text-[10px] font-orbitron text-white/50 uppercase tracking-widest">{item.label}</span>
                   </div>
                 ))}
              </div>
            </div>
          </div>
        </section>

        {/* Industrial Architecture Infographic */}
        <section className="mb-40 relative">
          <div className="absolute inset-0 bg-neon-blue/5 rounded-[40px] blur-3xl -z-10" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center p-8 md:p-16 rounded-[40px] border border-white/5 bg-black/40 backdrop-blur-3xl overflow-hidden">
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] text-white/50 font-orbitron uppercase tracking-widest mb-6">
                Publicaciones diarias SaaS Enterprise
              </div>
              <h2 className="text-4xl md:text-5xl font-orbitron font-bold mb-8 leading-tight">Arquitectura de <span className="text-neon-blue">Alto Rendimiento</span></h2>
              <div className="space-y-6">
                {[
                  { name: "Global Edge Network", desc: "Despliegue instántaneo en más de 200 nodos mundiales.", icon: Globe },
                  { name: "IA-Native CMS", desc: "Beatriz AI escribe, diseña y publica contenido automático en tiempo real.", icon: Database },
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

        {/* Propuesta Simple con Carrusel de Fondos */}
        <section className="mb-28 relative text-center min-h-[400px] flex flex-col items-center justify-center p-16 rounded-[60px] border border-neon-blue/20 overflow-hidden group">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPlanImage}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 0.15, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0 bg-cover bg-center -z-10"
              style={{ backgroundImage: `url(${PLAN_IMAGES[currentPlanImage]})` }}
            />
          </AnimatePresence>
          <h2 className="text-4xl font-orbitron font-bold mb-8 relative z-10">Ya tienes tus productos. <br/> Ya tienes tus imágenes.</h2>
          <p className="text-2xl text-white/70 italic font-light tracking-widest uppercase relative z-10">
            Nosotros convertimos eso en <span className="text-neon-blue font-bold">contenido diario</span> que trabaja por ti.
          </p>
        </section>

        {/* Final CTA Card */}
        <section className="mb-20">
          <Card className="p-12 bg-gradient-to-r from-neon-blue/20 via-background to-neon-purple/20 border-white/5 relative overflow-hidden group shadow-2xl">
            <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
            <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
              <div className="max-w-xl text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
                  <h2 className="text-3xl md:text-4xl font-orbitron font-bold italic uppercase tracking-tighter">Empieza hoy tu web automática.</h2>
                  <div className="shrink-0 flex items-center gap-2 bg-neon-blue/10 border border-neon-blue text-neon-blue px-4 py-1.5 rounded-full font-orbitron text-[10px] animate-pulse shadow-[0_0_15px_rgba(0,163,255,0.3)]">
                    <TrendingUp className="h-3 w-3" /> 39 cupos de 100 disponibles
                  </div>
                </div>
                <p className="text-white/60 text-lg leading-relaxed mb-8 italic">
                   Cupos iniciales con condiciones preferenciales. Deja que Beatriz AI tome el control del contenido automático mientras tú haces crecer tu negocio.
                </p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/30 text-green-500 text-xs font-mono">
                    <ScanHeart className="h-4 w-4" /> ENTREGA INMEDIATA
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-mono">
                    <Zap className="h-4 w-4" /> 100% AUTOMATIZADO
                  </div>
                </div>
              </div>
              <Button 
                size="lg" 
                className="bg-neon-blue text-black hover:bg-neon-blue/90 px-12 h-16 rounded-full font-orbitron font-bold tracking-widest text-sm shadow-[0_0_30px_rgba(0,163,255,0.4)]"
                asChild
              >
                <a href="#precios">Solicitar implementación</a>
              </Button>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
