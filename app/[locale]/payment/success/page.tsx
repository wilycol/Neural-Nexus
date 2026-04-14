'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { CheckCircle2, Rocket, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  const t = useTranslations('NeuralSites.checkout');

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-card/30 backdrop-blur-2xl border border-primary/20 rounded-3xl p-8 text-center shadow-[0_0_50px_rgba(0,163,255,0.1)]"
      >
        <div className="mb-6 flex justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 10, stiffness: 100, delay: 0.2 }}
            className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30"
          >
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </motion.div>
        </div>

        <h1 className="text-3xl font-orbitron font-bold text-primary mb-4 tracking-tight">
          ¡Inversión Recibida!
        </h1>
        
        <p className="text-muted-foreground mb-8 text-lg">
          {t('success_msg')} <br/>
          <span className="text-sm italic opacity-70">Detectando SKU Industrial...</span>
        </p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
            <Rocket className="h-6 w-6 text-primary mx-auto mb-2" />
            <p className="text-[10px] uppercase tracking-widest font-bold">Sitio IA</p>
            <p className="text-xs text-muted-foreground">En Construcción</p>
          </div>
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
            <ShieldCheck className="h-6 w-6 text-primary mx-auto mb-2" />
            <p className="text-[10px] uppercase tracking-widest font-bold">Estado</p>
            <p className="text-xs text-muted-foreground">Verificado</p>
          </div>
        </div>

        <div className="space-y-4">
          <Button className="w-full h-12 rounded-xl bg-primary hover:scale-[1.02] transition-all font-bold group" asChild>
            <Link href="/onboarding">
              EMPEZAR CONFIGURACIÓN <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          
          <Button variant="ghost" className="w-full h-12" asChild>
            <Link href="/">
              VOLVER AL PORTAL
            </Link>
          </Button>
        </div>

        <div className="mt-8 pt-6 border-t border-primary/10">
          <p className="text-[10px] text-muted-foreground flex items-center justify-center gap-2">
            <Sparkles className="h-3 w-3" /> BEATRIZ SERIE X ELITE - ACTIVADA
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function Sparkles({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
    </svg>
  );
}
