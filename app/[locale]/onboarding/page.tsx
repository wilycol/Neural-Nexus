'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { BusinessForm } from '@/components/onboarding/business-form';
import { Rocket, Sparkles, ShieldCheck } from 'lucide-react';

export default function OnboardingPage() {
  const t = useTranslations('NeuralSites.onboarding');
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-[90vh] container mx-auto px-4 py-12 max-w-4xl">
      <div className="flex flex-col items-center mb-12 text-center">
        <div className="h-16 w-16 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30 mb-6 group">
          <Rocket className="h-8 w-8 text-primary group-hover:rotate-12 transition-transform" />
        </div>
        <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-primary mb-4">
          Activación Neural Sites
        </h1>
        <p className="text-muted-foreground max-w-xl text-lg">
          Danos los insumos de tu negocio. Beatriz usará esta información para fabricar tu presencia digital autónoma.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <StepIndicator current={step} number={1} label={t('step1')} />
        <StepIndicator current={step} number={2} label={t('step2')} />
        <StepIndicator current={step} number={3} label={t('step3')} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card/30 backdrop-blur-2xl border border-primary/20 rounded-3xl p-8 md:p-12 shadow-[0_0_50px_rgba(0,163,255,0.05)]"
      >
        <BusinessForm onSuccess={() => setStep(2)} />
      </motion.div>

      <div className="mt-12 flex justify-center items-center gap-6 opacity-50 grayscale hover:grayscale-0 transition-all">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4" />
          <span className="text-[10px] font-bold uppercase tracking-widest">SSL Secure</span>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          <span className="text-[10px] font-bold uppercase tracking-widest">AI Power by Beatriz</span>
        </div>
      </div>
    </div>
  );
}

function StepIndicator({ current, number, label }: { current: number; number: number; label: string }) {
  const isActive = current >= number;
  return (
    <div className="flex flex-col items-center gap-3">
      <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 font-orbitron text-sm ${
        isActive ? 'bg-primary border-primary text-primary-foreground shadow-[0_0_15px_rgba(0,163,255,0.5)]' : 'border-muted-foreground/30 text-muted-foreground'
      }`}>
        {number}
      </div>
      <span className={`text-[10px] uppercase tracking-[0.2em] font-bold ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
        {label}
      </span>
    </div>
  );
}
