"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { templates } from "@/lib/templates-data";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Zap, 
  Layout, 
  Smartphone, 
  Clock,
  Tag,
  MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default function TemplateDemoPage() {
  const { templateId } = useParams();
  const router = useRouter();
  
  const template = templates.find((t) => t.id === templateId);

  if (!template) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6">
        <h1 className="text-4xl font-orbitron font-bold text-white mb-4">404_PROTOCOLO_NO_ENCONTRADO</h1>
        <p className="text-white/50 mb-8 uppercase tracking-widest">La plantilla {templateId} no existe en nuestra base de datos.</p>
        <Button onClick={() => router.back()} variant="outline" className="border-neon-blue text-neon-blue hover:bg-neon-blue/10">
           Regresar al Portal
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden font-inter">
      {/* Mini Header / Toolbar */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-black/80 backdrop-blur-md border-b border-white/5 z-50 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
            <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  if (typeof window !== 'undefined' && window.history.length > 1) {
                    router.back();
                  } else {
                    router.push('/es/neural-sites');
                  }
                }} 
                className="text-white/80 border-white/10 bg-white/5 hover:bg-white/10 rounded-full px-4 h-9 font-orbitron text-[10px] tracking-widest"
            >
                <ArrowLeft className="mr-2 h-3 w-3" /> VOLVER
            </Button>
            <div className="h-4 w-[1px] bg-white/10" />
            <div className="flex items-center gap-2">
                <Badge className="bg-white/5 border-white/10 text-[10px] tracking-tighter uppercase">{template.name}</Badge>
                <span className="text-[10px] text-white/30 uppercase tracking-widest hidden md:inline">Vista Previa Industrial</span>
            </div>
        </div>
        
        <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-3 mr-4">
                <Smartphone className="h-4 w-4 text-white/30" />
                <Layout className="h-4 w-4 text-neon-blue" />
                <MonitorCheck className="h-4 w-4 text-white/30" />
            </div>
            <Button 
                className="bg-neon-blue text-black hover:bg-neon-blue/90 font-orbitron text-[10px] tracking-widest rounded-full px-6"
                onClick={() => router.push("/es/neural-sites#precios")}
            >
                LO QUIERO PARA MI NEGOCIO
            </Button>
        </div>
      </nav>

      {/* Hero Section Demo */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-radial-gradient opacity-20" style={{ backgroundImage: `radial-gradient(circle at 50% 20%, ${template.accentHex}40 0%, transparent 70%)` }} />
            <div className="absolute inset-0 bg-grid-white/[0.02]" />
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
            >
                <Badge variant="outline" className="mb-6 border-white/10 text-white/50 px-4 py-1 font-mono tracking-widest text-[10px]">
                    {template.badge}
                </Badge>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-orbitron font-black mb-8 leading-tight tracking-tighter uppercase" style={{ color: template.accentHex }}>
                    {template.heroTitle}
                </h1>
                <p className="text-xl md:text-2xl text-white/60 max-w-3xl mx-auto font-light leading-relaxed mb-12">
                    {template.heroSubtitle}
                </p>
                <div className="flex flex-wrap justify-center gap-6">
                    <Button size="lg" className="h-16 px-10 rounded-full font-orbitron tracking-widest text-sm" style={{ backgroundColor: template.accentHex, color: 'black' }}>
                        {template.primaryCTA}
                    </Button>
                    <Button variant="outline" size="lg" className="h-16 px-10 rounded-full border-white/10 text-white font-orbitron tracking-widest text-sm hover:bg-white/5">
                        {template.secondaryCTA}
                    </Button>
                    <Button 
                        variant="outline" 
                        size="lg" 
                        className="h-16 px-10 rounded-full border-emerald-500/20 text-emerald-400 font-orbitron tracking-widest text-sm hover:bg-emerald-500/10 flex items-center gap-2"
                        onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(template.niche + ' ' + template.name)}`, '_blank')}
                    >
                        <MapPin className="h-4 w-4" /> GPS: CÓMO LLEGAR
                    </Button>
                </div>
            </motion.div>

            {/* Browser Preview Mockup */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="relative max-w-5xl mx-auto rounded-[32px] border border-white/10 bg-black/40 backdrop-blur-3xl overflow-hidden shadow-2xl"
            >
                <div className="h-10 bg-white/5 border-b border-white/5 flex items-center px-6 gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/30" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/30" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/30" />
                    </div>
                </div>
                <div className="aspect-[16/9] bg-cover bg-center" style={{ backgroundImage: `linear-gradient(to bottom, transparent, #050505), url(${template.heroImage || '/assets/placeholder-site.jpg'})`, backgroundColor: '#111' }}>
                    <div className="w-full h-full flex flex-col items-center justify-center p-20 opacity-40">
                         <Zap className="h-24 w-24 mb-6" style={{ color: template.accentHex }} />
                         <span className="font-orbitron text-sm tracking-[1em] uppercase">Visualización de Activo</span>
                    </div>
                </div>
            </motion.div>
        </div>
      </section>

      {/* Services Section Demo */}
      <section className="py-32 px-6 bg-white/[0.02]">
        <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-20">
                <h2 className="text-4xl md:text-5xl font-orbitron font-bold mb-6 italic uppercase">{template.servicesTitle}</h2>
                <div className="h-1 w-20 mx-auto rounded-full" style={{ backgroundColor: template.accentHex }} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {template.services.map((service, idx) => (
                    <Card key={idx} className="p-8 bg-black/40 border-white/5 hover:border-white/20 transition-all group rounded-3xl">
                        <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/5 group-hover:scale-110 transition-transform">
                            <service.icon className="h-7 w-7" style={{ color: template.accentHex }} />
                        </div>
                        <h3 className="text-xl font-orbitron font-bold mb-4 uppercase leading-tight">{service.title}</h3>
                        <p className="text-white/50 text-sm leading-relaxed">{service.description}</p>
                    </Card>
                ))}
            </div>
        </div>
      </section>

      {/* Neural Feed Section (Blog) */}
      <section className="py-32 px-6">
        <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
                <div className="max-w-2xl">
                    <div className="flex flex-wrap gap-2 mb-4">
                        <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 font-orbitron tracking-widest text-[9px]">BEATRIZ_FACTORY_V5.0</Badge>
                        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-orbitron tracking-widest text-[9px]">ADN_NEURAL_CONECTADO</Badge>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-orbitron font-bold italic uppercase">Feed Autónomo de Noticias</h2>
                    <p className="text-white/50 mt-4 leading-relaxed italic uppercase tracking-widest text-xs">
                        Nuestra IA Beatriz conecta con el ADN de tu negocio y auto-genera contenido inteligente y noticias sobre tus productos diariamente.
                    </p>
                </div>
                <Button variant="outline" className="border-white/10 text-white rounded-full px-8 h-12 font-orbitron text-[10px] tracking-widest">
                    CONFIGURAR ALGORITMO
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {template.articles.map((article, idx) => (
                    <div key={idx} className="relative p-8 rounded-3xl border border-white/5 bg-gradient-to-br from-white/5 to-transparent hover:border-white/20 transition-all cursor-pointer">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex items-center gap-1.5 text-[10px] font-mono text-white/40">
                                <Tag className="h-3 w-3" /> {article.category}
                            </div>
                            <div className="h-1 w-1 rounded-full bg-white/20" />
                            <div className="flex items-center gap-1.5 text-[10px] font-mono text-white/40">
                                <Clock className="h-3 w-3" /> {article.readTime}
                            </div>
                        </div>
                        <h3 className="text-xl font-orbitron font-bold mb-8 group-hover:text-neon-blue transition-colors leading-snug">
                            {article.title}
                        </h3>
                        <div className="flex items-center gap-2 text-neon-blue text-[10px] font-orbitron tracking-widest uppercase">
                            LEER ARTICULO <ArrowRight className="h-3 w-3" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* Final CTA Demo */}
      <section className="py-40 px-6 text-center">
         <div className="max-w-4xl mx-auto p-16 rounded-[60px] border border-white/5 bg-gradient-to-t from-white/5 to-transparent backdrop-blur-3xl">
            <h2 className="text-4xl md:text-5xl font-orbitron font-black mb-8 italic uppercase leading-tight">¿Te gusta este sistema para tu negocio?</h2>
            <p className="text-xl text-white/60 mb-12 font-light">
                Activa tu **Neural Site** hoy mismo y deja que Beatriz AI tome el control total de tu contenido y crecimiento.
            </p>
            <Button 
                size="lg" 
                className="h-20 px-16 rounded-full bg-white text-black font-orbitron font-black tracking-[0.2em] hover:scale-105 transition-all text-sm"
                onClick={() => router.push("/es/neural-sites#precios")}
            >
                ACTIVAR {template.name} AHORA
            </Button>
         </div>
      </section>

      {/* Footer Demo */}
      <footer className="py-20 border-t border-white/5 px-6">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-4">
                <Zap className="h-6 w-6 text-neon-blue" />
                <span className="font-orbitron font-bold tracking-widest text-sm">NEURAL NEXUS × {template.name}</span>
            </div>
            <div className="text-white/20 text-[10px] font-mono uppercase tracking-[0.5em]">
                Protocolo de Despliegue Industrial v2.0 • 2026
            </div>
        </div>
      </footer>
    </div>
  );
}

// Auxiliar components that might be missing
function MonitorCheck({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/><path d="m9 10 2 2 4-4"/>
        </svg>
    )
}

function ArrowRight({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
        </svg>
    )
}
