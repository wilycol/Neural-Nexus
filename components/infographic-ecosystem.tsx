"use client";

import React, { useState } from "react";
import { 
  Workflow, 
  Cpu, 
  Globe, 
  Search, 
  Mic2, 
  Video, 
  FileJson, 
  Database, 
  Maximize2, 
  X,
  Zap,
  ArrowRight,
  TrendingUp,
  LineChart,
  HardDrive,
  Cloud,
  RefreshCcw,
  BarChart4,
  LayoutDashboard,
  Boxes
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogClose 
} from "@/components/ui/dialog";
import { motion } from "framer-motion";

export function InfographicEcosystem() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const DiagramContent = ({ fullscreen = false }) => (
    <div className={`relative w-full h-full flex flex-col items-center justify-between p-12 bg-black/60 backdrop-blur-3xl border border-white/5 rounded-[40px] overflow-hidden ${fullscreen ? 'min-h-[90vh]' : 'aspect-[16/10]'}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,163,255,0.1),transparent_70%)]" />
      <div className="absolute inset-0 bg-grid-white/[0.02]" />

      {/* --- NIVEL 1: LOCAL (BEATRIZ AUTOPUBLISHER) --- */}
      <div className="relative z-10 w-full flex flex-col items-center gap-6">
        <div className="flex items-center gap-3 mb-2">
          <Badge className="bg-neon-blue/20 text-neon-blue border-neon-blue/30 px-4 py-1 text-xs font-bold tracking-widest">LOCAL TO CLOUD ARCHITECTURE</Badge>
          <div className="h-[2px] w-20 bg-gradient-to-r from-neon-blue to-transparent" />
        </div>
        
        <div className="grid grid-cols-4 gap-4 w-full max-w-4xl">
          <InfographicNode 
            title="Buscadores AI" 
            icon={Search} 
            desc="OSINT & Trend Detection" 
            color="text-blue-400"
            tags={['API Hunt', 'Real-time']}
          />
          <InfographicNode 
            title="Modos de Gen" 
            icon={Boxes} 
            desc="Classic, Img, Vid, Format" 
            color="text-neon-purple"
            tags={['4-Way Engine']}
          />
          <InfographicNode 
            title="Blueprints" 
            icon={Workflow} 
            desc="Nodos de Automatización" 
            color="text-neon-cyan"
            tags={['Logic Flow']}
          />
          <InfographicNode 
            title="Beatriz Core" 
            icon={Cpu} 
            desc="Orquestador Industrial" 
            color="text-white"
            glow="shadow-[0_0_20px_rgba(0,163,255,0.5)]"
            tags={['Elite Series X']}
          />
        </div>
      </div>

      {/* --- NIVEL 2: HÍBRIDO (DATABRIDGE & STORAGE) --- */}
      <div className="relative z-20 w-full flex items-center justify-center gap-20 py-8">
        <div className="flex flex-col items-center gap-2">
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="p-4 rounded-2xl bg-white/5 border border-white/10"
            >
              <Database className="h-10 w-10 text-neon-blue" />
            </motion.div>
            <span className="text-[10px] font-orbitron text-zinc-500">PostgreSQL (RLS)</span>
        </div>

        <div className="relative flex-1 flex items-center justify-center">
            {/* Animación de flujo de datos */}
            <div className="h-[2px] w-full bg-gradient-to-r from-neon-blue via-neon-purple to-neon-cyan relative overflow-hidden">
                <motion.div 
                   animate={{ x: ['-100%', '200%'] }}
                   transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                   className="absolute top-0 h-full w-20 bg-white shadow-[0_0_15px_#fff]"
                />
            </div>
            <div className="absolute top-[-30px] flex items-center gap-2 italic text-[9px] font-mono text-neon-purple">
                <Zap className="h-3 w-3" />
                <span>HYBRID_SYNC_ACTIVE</span>
            </div>
        </div>

        <div className="flex flex-col items-center gap-2">
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
              className="p-4 rounded-2xl bg-white/5 border border-white/10"
            >
              <HardDrive className="h-10 w-10 text-neon-cyan" />
            </motion.div>
            <span className="text-[10px] font-orbitron text-zinc-500">Mega-Storage (Vid/Img)</span>
        </div>
      </div>

      {/* --- NIVEL 3: CLOUD (VERCEL & PORTAL) --- */}
      <div className="relative z-10 w-full flex flex-col items-center gap-6">
        <div className="grid grid-cols-4 gap-4 w-full max-w-4xl">
          <InfographicNode 
            title="Portal Nexus" 
            icon={Globe} 
            desc="UI/UX Presence Cloud" 
            color="text-white"
            tags={['Next.js 14']}
          />
          <InfographicNode 
            title="Metrics / Telemetry" 
            icon={BarChart4} 
            desc="Likes, Comms, Views" 
            color="text-green-400"
            tags={['Real Analytics']}
          />
          <InfographicNode 
            title="Admin Modals" 
            icon={LayoutDashboard} 
            desc="Contabilidad & Control" 
            color="text-orange-400"
            tags={['Secure Access']}
          />
          <InfographicNode 
            title="Autopublisher" 
            icon={RefreshCcw} 
            desc="Smart Fallback Engine" 
            color="text-neon-purple"
            tags={['Always On']}
          />
        </div>

        <div className="flex items-center gap-3 mt-2">
           <div className="h-[2px] w-20 bg-gradient-to-l from-neon-cyan to-transparent" />
           <Badge className="bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30 px-4 py-1 text-xs font-bold tracking-widest italic">NEURAL NEXUS ECOSYSTEM</Badge>
        </div>
      </div>

      {/* --- FEEDBACK LOOP (LÍNEA DE RETORNO) --- */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <path 
           d="M 100 800 Q 50 450 100 100" 
           fill="none" 
           stroke="rgba(0,163,255,0.1)" 
           strokeWidth="2" 
           strokeDasharray="5 5"
           className="animate-pulse"
        />
        <path 
           d="M 1100 800 Q 1150 450 1100 100" 
           fill="none" 
           stroke="rgba(168,85,247,0.1)" 
           strokeWidth="2" 
           strokeDasharray="5 5"
           className="animate-pulse"
        />
      </svg>
      
      <div className="absolute left-4 top-1/2 -translate-y-1/2 -rotate-90 flex items-center gap-2 opacity-30">
        <TrendingUp className="h-4 w-4 text-neon-blue" />
        <span className="text-[10px] font-orbitron tracking-[0.3em] text-neon-blue whitespace-nowrap uppercase">Data Feedback Loop</span>
      </div>

      {!fullscreen && (
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsFullscreen(true)}
          className="absolute top-6 right-6 h-10 w-10 bg-white/5 hover:bg-white/10 text-zinc-500 hover:text-white rounded-xl transition-all"
        >
          <Maximize2 className="h-5 w-5" />
        </Button>
      )}
    </div>
  );

  return (
    <>
      <DiagramContent />

      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-[98vw] h-[95vh] bg-zinc-950/98 border-white/5 p-0 overflow-hidden">
          <div className="absolute top-6 right-6 z-50">
            <DialogClose asChild>
              <Button variant="ghost" size="icon" className="h-12 w-12 bg-white/5 hover:bg-white/10 text-white rounded-full">
                <X className="h-8 w-8" />
              </Button>
            </DialogClose>
          </div>
          <DiagramContent fullscreen />
        </DialogContent>
      </Dialog>
    </>
  );
}

function InfographicNode({ title, icon: Icon, desc, color, tags, glow }: any) {
  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }}
      className={`p-5 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all flex flex-col items-center gap-3 relative group ${glow}`}
    >
      <div className={`p-4 rounded-2xl bg-black/40 border border-white/5 group-hover:scale-110 transition-transform`}>
        <Icon className={`h-8 w-8 ${color}`} />
      </div>
      <div className="text-center">
        <h4 className="text-sm font-orbitron font-bold text-white tracking-tight">{title}</h4>
        <p className="text-[10px] text-zinc-500 leading-tight mt-1">{desc}</p>
      </div>
      <div className="flex flex-wrap justify-center gap-1 mt-1">
        {tags.map((tag: string) => (
          <span key={tag} className="text-[8px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-400 font-mono italic">
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`px-2 py-0.5 rounded-full border text-[10px] font-orbitron tracking-tighter ${className}`}>
      {children}
    </div>
  );
}
