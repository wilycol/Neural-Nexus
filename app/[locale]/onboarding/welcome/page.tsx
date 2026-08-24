'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle2, MessageSquare, ArrowRight, Sparkles, Shield, Cpu, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function OnboardingWelcomePage() {
  const searchParams = useSearchParams();
  const ref = searchParams.get('ref') || searchParams.get('id') || 'PNN-CONFIRMED';
  const plan = searchParams.get('plan') || 'Neural Site Pro';

  const whatsappLink = `https://wa.me/573229067026?text=${encodeURIComponent(
    `¡Hola Beatriz! 🎉 Acabo de confirmar mi pago de mi ${plan} (Ref: ${ref}) y estoy listo para iniciar la configuración de mi ADN de negocio.`
  )}`;

  return (
    <div className="min-h-[90vh] container mx-auto px-4 py-12 max-w-3xl flex flex-col items-center justify-center">
      {/* Glow Superior */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/15 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="w-20 h-20 rounded-3xl bg-emerald-500/10 border-2 border-emerald-500/40 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.3)]"
      >
        <CheckCircle2 className="w-10 h-10 text-emerald-400 animate-pulse" />
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-mono mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>TRANSACCIÓN APROBADA • REF: {ref}</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-orbitron font-extrabold text-foreground mb-4 tracking-tight">
          ¡Bienvenido a la <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">Federación</span>!
        </h1>
        <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
          Tu pago ha sido procesado con éxito. Tu cuenta en el **Portal Neural Nexus** ha sido creada y tu rol ha sido elevado a <strong className="text-foreground">Propietario de Nodo Neural</strong>.
        </p>
      </motion.div>

      {/* Tarjeta Principal de Estado */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="w-full bg-card/40 backdrop-blur-2xl border border-primary/20 rounded-3xl p-6 md:p-8 shadow-[0_0_50px_rgba(0,163,255,0.08)] mb-8"
      >
        <h2 className="text-sm font-orbitron uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
          <Cpu className="w-4 h-4" />
          <span>Estado del Despliegue en Tiempo Real</span>
        </h2>

        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-bold">1</div>
              <span className="text-sm font-medium text-foreground">Pago Confirmado (Wompi / Nequi)</span>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full">COMPLETADO</span>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-bold">2</div>
              <span className="text-sm font-medium text-foreground">Auto-Registro PNN & Rol Asignado</span>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full">ACTIVO</span>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-primary/5 border border-primary/30 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">3</div>
              <span className="text-sm font-medium text-primary">Agente Seductor Beatriz AI Activado</span>
            </div>
            <span className="text-xs font-mono text-primary font-bold bg-primary/10 px-2.5 py-1 rounded-full">LISTO PARA CHAT</span>
          </div>
        </div>

        {/* Acciones Principales */}
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold font-orbitron text-sm shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <MessageSquare className="w-5 h-5 fill-current" />
            <span>Iniciar ADN en WhatsApp</span>
            <ExternalLink className="w-4 h-4 opacity-70" />
          </a>

          <Link
            href="/es"
            className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-card border border-primary/30 hover:border-primary/60 text-foreground font-semibold text-sm transition-all hover:bg-primary/5"
          >
            <span>Ir al Portal</span>
            <ArrowRight className="w-4 h-4 text-primary" />
          </Link>
        </div>
      </motion.div>

      {/* Garantía & Seguridad */}
      <div className="flex items-center gap-6 opacity-60 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>Encriptación SSL 256-Bit</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-primary" />
          <span>Inteligencia Autónoma por Beatriz AI</span>
        </div>
      </div>
    </div>
  );
}
