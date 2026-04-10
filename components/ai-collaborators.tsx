'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Cpu, Zap, Box, Shield, Workflow, Sparkles } from 'lucide-react';

const collaborators = [
  { name: 'Google Antigravity', icon: Workflow, color: 'text-red-500', url: 'https://github.com/google-deepmind' },
  { name: 'OpenAI', icon: Sparkles, color: 'text-green-500', url: 'https://openai.com' },
  { name: 'NVIDIA', icon: Zap, color: 'text-[#76B900]', url: 'https://www.nvidia.com/en-us/ai/' },
  { name: 'Magic Hour', icon: Zap, color: 'text-purple-500', url: 'https://magichour.ai' },
  { name: 'Groq', icon: Zap, color: 'text-orange-500', url: 'https://groq.com' },
  { name: 'Supabase', icon: Box, color: 'text-emerald-500', url: 'https://supabase.com' },
  { name: 'Alibaba Cloud', icon: Cpu, color: 'text-blue-500', url: 'https://www.alibabacloud.com' },
  { name: 'FLUX.ai', icon: Sparkles, color: 'text-white', url: 'https://blackforestlabs.ai' },
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
            <a
              key={index}
              href={collab.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 mx-12 px-6 py-3 rounded-xl border border-white/5 bg-white/[0.02] backdrop-blur-sm transition-all hover:bg-white/[0.05] hover:border-primary/30 group cursor-pointer"
            >
              <collab.icon className={cn("h-6 w-6 transition-transform group-hover:scale-110", collab.color)} />
              <span className="text-sm font-orbitron font-bold tracking-widest text-foreground/80 group-hover:text-foreground">
                {collab.name}
              </span>
            </a>
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
