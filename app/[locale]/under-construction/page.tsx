"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Construction, 
  Terminal, 
  ArrowLeft, 
  Send, 
  ShieldCheck, 
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function UnderConstructionPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/partnership", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, type: 'api' })
      });

      const data = await res.json();

      if (res.ok) {
        setSubmitted(true);
        toast.success("Solicitud encolada en el búnker. Beatriz procesará tu acceso pronto.");
      } else {
        toast.error(data.error || "Error al enviar la solicitud.");
      }
    } catch (error) {
      toast.error("Error crítico de conexión con el Búnker.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white selection:bg-neon-blue/30 font-orbitron overflow-hidden relative">
      {/* Background FX */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[center_top] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full h-[600px] bg-neon-purple/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 space-y-4">
            <Badge variant="outline" className="border-neon-blue/30 text-neon-blue px-4 py-1 tracking-[0.3em] uppercase text-[10px] animate-pulse">
              Protocolo Fase 2 // Acceso Restringido
            </Badge>
            <h1 className="text-4xl md:text-6xl font-black italic bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/20">
              PRÓXIMAMENTE <span className="text-neon-blue">INDUSTRIAL</span>
            </h1>
            <p className="text-zinc-400 font-sans font-light max-w-xl mx-auto">
              La infraestructura de Neural Connect SaaS se está calibrando para despliegues masivos. 
              Solicita tu acceso anticipado para ser el primero en integrar el cerebro de Beatriz.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left: Info Cards */}
            <div className="space-y-6">
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm overflow-hidden group">
                <CardContent className="p-6">
                   <div className="flex gap-4">
                      <div className="p-3 rounded-lg bg-neon-blue/10 text-neon-blue shrink-0">
                         <Construction className="h-6 w-6" />
                      </div>
                      <div className="space-y-1">
                         <h3 className="font-bold text-sm uppercase">Estado del Sistema</h3>
                         <p className="text-xs text-zinc-500 font-sans">Sincronización de API en curso. Calibración de latencia al 89%.</p>
                      </div>
                   </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10 backdrop-blur-sm overflow-hidden group">
                <CardContent className="p-6">
                   <div className="flex gap-4">
                      <div className="p-3 rounded-lg bg-neon-purple/10 text-neon-purple shrink-0">
                         <Terminal className="h-6 w-6" />
                      </div>
                      <div className="space-y-1">
                         <h3 className="font-bold text-sm uppercase">Endpoint Alpha</h3>
                         <p className="text-xs text-zinc-500 font-sans">Documentación técnica en proceso de encriptación y despliegue.</p>
                      </div>
                   </div>
                </CardContent>
              </Card>

              <div className="p-6 border-l-2 border-neon-blue bg-neon-blue/5">
                 <div className="flex items-center gap-3 text-neon-blue mb-2">
                    <ShieldCheck className="h-4 w-4" />
                    <span className="text-[10px] font-bold tracking-widest uppercase">Garantía Beatriz</span>
                 </div>
                 <p className="text-xs font-sans text-zinc-400">
                    Tu solicitud será procesada por nuestro núcleo de IA. Recibirás un token de acceso único una vez que la fase beta se abra para tu región.
                 </p>
              </div>
            </div>

            {/* Right: Form */}
            <Card className="bg-zinc-900/50 border-white/10 backdrop-blur-md relative overflow-hidden">
               {submitted ? (
                 <div className="p-12 text-center space-y-6">
                    <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto animate-bounce">
                       <ShieldCheck className="h-8 w-8" />
                    </div>
                    <div className="space-y-2">
                       <h2 className="text-xl font-bold uppercase">Solicitud Registrada</h2>
                       <p className="text-sm font-sans text-zinc-400">
                          Tu señal ha sido recibida en el Búnker. Beatriz te contactará pronto.
                       </p>
                    </div>
                    <Button asChild className="w-full bg-white text-black font-bold">
                       <Link href="/">VOLVER AL PORTAL</Link>
                    </Button>
                 </div>
               ) : (
                 <CardContent className="p-8">
                   <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                         <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest px-1">Identidad / Nombre</label>
                         <Input 
                            required
                            placeholder="Comandante..."
                            className="bg-black/50 border-white/10 focus:border-neon-blue focus:ring-1 focus:ring-neon-blue/50 font-sans"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest px-1">Canal de Contacto (Email)</label>
                         <Input 
                            required
                            type="email"
                            placeholder="email@portal.ai"
                            className="bg-black/50 border-white/10 focus:border-neon-blue focus:ring-1 focus:ring-neon-blue/50 font-sans"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest px-1">Organización / Proyecto</label>
                         <Input 
                            required
                            placeholder="Nexus Labs..."
                            className="bg-black/50 border-white/10 focus:border-neon-blue focus:ring-1 focus:ring-neon-blue/50 font-sans"
                            value={formData.company}
                            onChange={(e) => setFormData({...formData, company: e.target.value})}
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest px-1">Mensaje para Neural Connect</label>
                         <Textarea 
                            placeholder="Cuéntanos tu visión de integración..."
                            className="bg-black/50 border-white/10 focus:border-neon-blue focus:ring-1 focus:ring-neon-blue/50 font-sans min-h-[80px]"
                            value={formData.message}
                            onChange={(e) => setFormData({...formData, message: e.target.value})}
                         />
                      </div>
                      <Button 
                        type="submit" 
                        disabled={loading}
                        className="w-full h-12 bg-neon-blue hover:bg-neon-blue/80 text-black font-bold uppercase tracking-widest mt-4 group"
                      >
                         {loading ? (
                           <Loader2 className="h-5 w-5 animate-spin" />
                         ) : (
                           <>
                             Enviar Señal al Búnker
                             <Send className="h-4 w-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                           </>
                         )}
                      </Button>
                   </form>
                 </CardContent>
               )}
            </Card>
          </div>

          {/* Footer Footer */}
          <div className="mt-20 flex justify-center pb-12">
             <Link href="/" className="flex items-center gap-2 text-zinc-500 hover:text-neon-blue transition-colors text-[10px] uppercase tracking-widest font-bold group">
                <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
                Abortar Misión y Volver al Portal
             </Link>
          </div>
        </div>
      </div>

      {/* Grid Pattern Bottom */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-neon-blue/10 to-transparent opacity-20" />
    </main>
  );
}
