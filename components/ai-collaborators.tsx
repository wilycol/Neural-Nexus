'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Cpu, Zap, Box, Shield, Workflow, Sparkles } from 'lucide-react';

const collaborators = [
  { name: 'OpenAI', icon: Sparkles, color: 'text-green-500' },
  { name: 'Groq', icon: Zap, color: 'text-orange-500' },
  { name: 'Supabase', icon: Box, color: 'text-emerald-500' },
  { name: 'Alibaba Cloud', icon: Cpu, color: 'text-blue-500' },
  { name: 'Vercel', icon: Shield, color: 'text-white' },
  { name: 'Google Antigravity', icon: Workflow, color: 'text-red-500' },
];

export function AICollaborators() {
  return (
    <section className="py-12 border-y border-primary/10 bg-black/40 overflow-hidden relative">
      <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
      
      <div className="container mx-auto px-4 mb-8 text-center relative z-10">
        <h2 className="text-[10px] font-orbitron font-bold tracking-[0.3em] text-primary/60 uppercase mb-2">
          Infraestructura de Inteligencia Industrial
        </h2>
        <p className="text-xl font-orbitron font-bold tracking-tighter">
          IMPULSADO POR NUESTROS SOCIOS TECNOLÓGICOS
        </p>
      </div>

      <div className="flex relative overflow-x-hidden z-10">
        <div className="flex animate-marquee whitespace-nowrap py-4">
          {[...collaborators, ...collaborators].map((collab, index) => (
            <div
              key={index}
              className="flex items-center gap-4 mx-12 px-6 py-3 rounded-xl border border-white/5 bg-white/[0.02] backdrop-blur-sm transition-all hover:bg-white/[0.05] hover:border-primary/30 group"
            >
              <collab.icon className={cn("h-6 w-6 transition-transform group-hover:scale-110", collab.color)} />
              <span className="text-sm font-orbitron font-bold tracking-widest text-foreground/80 group-hover:text-foreground">
                {collab.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </section>
  );
}
