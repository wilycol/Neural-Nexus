'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Check, Zap, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { NeuralCheckoutModal } from './payment/NeuralCheckoutModal';
import { getSupabaseBrowserClient } from '@/lib/supabase';

export function NeuralSitesPricing() {
  const t = useTranslations('NeuralSites');
  const [selectedPlan, setSelectedPlan] = useState<'silver' | 'gold' | 'platinum' | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [remainingSlots, setRemainingSlots] = useState(39);
  const supabase = getSupabaseBrowserClient();

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        if (!supabase) return;
        const { count, error } = await supabase
          .from('client_sites')
          .select('*', { count: 'exact', head: true });
        
        if (!error && count !== null) {
          const calculated = 100 - count;
          setRemainingSlots(Math.max(calculated, 7)); // Mantener un mínimo de 7 para urgencia real
        }
      } catch (err) {
        console.error('Error fetching site slots:', err);
      }
    };
    fetchSlots();
  }, [supabase]);

  const openCheckout = (plan: 'silver' | 'gold' | 'platinum') => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const plans: { id: 'silver' | 'gold' | 'platinum'; name: string; priceUSD: string; priceCOP: string; image: string; features: string[]; color: string; glow: string; popular?: boolean }[] = [
    {
      id: 'silver',
      name: t('plans.silver'),
      priceUSD: '$15',
      priceCOP: '$60.000',
      image: '/assets/plans/silver.png',
      features: ['1 Noticia/día', 'SEO Básico', 'Telemetría'],
      color: 'border-slate-400/30',
      glow: 'shadow-[0_0_20px_rgba(148,163,184,0.2)]'
    },
    {
      id: 'gold',
      name: t('plans.gold'),
      priceUSD: '$38',
      priceCOP: '$152.000',
      image: '/assets/plans/gold.png',
      features: ['3 Noticias/día', 'Multimedia IA', 'Mejoramiento Estadístico'],
      color: 'border-amber-400/50',
      glow: 'shadow-[0_0_30px_rgba(251,191,36,0.3)]',
      popular: true
    },
    {
      id: 'platinum',
      name: t('plans.platinum'),
      priceUSD: '$79',
      priceCOP: '$316.000',
      image: '/assets/plans/platinum.png',
      features: ['Ilimitado', 'Video Semanal', 'Gestión Social Full'],
      color: 'border-purple-400/50',
      glow: 'shadow-[0_0_40px_rgba(168,85,247,0.4)]'
    }
  ];

  return (
    <section className="py-12 relative overflow-hidden">
      <div className="flex flex-col items-center mb-10 text-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 text-red-500 text-sm font-bold uppercase tracking-widest mb-6 animate-pulse"
        >
          <Zap className="h-4 w-4 fill-current" />
          ¡Solo quedan {remainingSlots} de 100 cupos (50% OFF Setup)!
        </motion.div>
        
        <h2 className="text-4xl md:text-5xl font-orbitron font-bold gradient-text mb-4">
          {t('title')}
        </h2>
        <p className="text-muted-foreground max-w-2xl text-lg">
          {t('tagline')} - Tu presencia digital, automatizada por el poder de Beatriz.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, idx) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`relative group flex flex-col rounded-2xl bg-card/40 backdrop-blur-xl border-2 ${plan.color} ${plan.glow} p-6 hover:scale-[1.02] transition-all`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-[10px] font-bold text-white uppercase tracking-tighter shadow-lg z-20">
                Más Elegido
              </div>
            )}

            <div className="relative h-48 mb-6 rounded-xl overflow-hidden border border-white/10">
              <Image 
                src={plan.image} 
                alt={plan.name} 
                fill 
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4">
                <h3 className="text-xl font-orbitron font-bold text-white tracking-widest">{plan.name}</h3>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold font-orbitron text-primary">{plan.priceUSD}</span>
                <span className="text-muted-foreground line-through text-sm opacity-50">/mes</span>
              </div>
              <p className="text-xs text-primary/70 font-mono mt-1">~ {plan.priceCOP} COP</p>
            </div>

            <div className="space-y-3 mb-8 flex-1">
              {plan.features.map((feature) => (
                <div key={feature} className="flex items-center gap-3 text-sm text-foreground/80">
                  <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                    <Check className="h-3 w-3 text-primary" />
                  </div>
                  {feature}
                </div>
              ))}
            </div>

            <Button 
              className={`w-full h-12 rounded-xl font-bold uppercase tracking-widest ${
                plan.popular ? 'bg-primary shadow-[0_0_20px_rgba(0,163,255,0.4)]' : 'bg-secondary'
              } hover:scale-105 transition-all`}
              onClick={() => openCheckout(plan.id)}
            >
              {t('cta')} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        ))}
      </div>

      <NeuralCheckoutModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        planId={selectedPlan || 'silver'} 
      />
    </section>
  );
}
