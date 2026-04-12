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
  LineChart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogClose 
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";

export function ArchitectureEcosystem() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const portalNodes = [
    { id: 'news-hunt', label: 'News Hunter', icon: Search, desc: 'Buscador de noticias', color: 'text-blue-400' },
    { id: 'audio-gen', label: 'Audio Gen', icon: Mic2, desc: 'Nano Banana Engine', color: 'text-yellow-400' },
    { id: 'video-synth', label: 'Video Synth', icon: Video, desc: 'Happy Bridge Integration', color: 'text-purple-400' }
  ];

  const beatrizNodes = [
    { id: 'osint-engine', label: 'OSINT Engine', icon: Globe, desc: 'Investigación profunda', color: 'text-neon-blue' },
    { id: 'script-agent', label: 'Script Agent', icon: FileJson, desc: 'Generación de guiones', color: 'text-neon-purple' },
    { id: 'orchestrator', label: 'Medi Orchestrator', icon: Workflow, desc: 'Orquestación total', color: 'text-neon-cyan' }
  ];

  const DiagramContent = ({ fullscreen = false }) => (
    <div className={`relative w-full h-full flex flex-col items-center justify-center p-8 bg-black/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden ${fullscreen ? 'min-h-[80vh]' : 'aspect-square'}`}>
      <div className="absolute inset-0 bg-grid-white/[0.02]" />
      
      {/* Portals and Beatriz Label */}
      <div className="absolute top-8 left-8 flex items-center gap-2">
        <Badge className="bg-neon-blue/20 text-neon-blue border-neon-blue/30 font-orbitron text-[10px]">BEATRIZ AUTOPUBLISHER</Badge>
      </div>
      <div className="absolute bottom-8 right-8 flex items-center gap-2">
        <Badge className="bg-neon-purple/20 text-neon-purple border-neon-purple/30 font-orbitron text-[10px]">NEURAL NEXUS PORTAL</Badge>
      </div>

      {/* Main Core */}
      <motion.div 
        animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-20 h-32 w-32 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple p-[2px] shadow-[0_0_50px_rgba(0,163,255,0.4)]"
      >
        <div className="h-full w-full rounded-full bg-zinc-950 flex items-center justify-center">
          <Cpu className="h-12 w-12 text-white animate-pulse" />
        </div>
      </motion.div>

      {/* Connection Lines (Simulated SVG) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
        <defs>
          <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00a3ff" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
        <circle cx="50%" cy="50%" r="40%" fill="none" stroke="url(#line-grad)" strokeWidth="1" strokeDasharray="10 20" className="animate-spin-slow" />
      </svg>

      {/* Beatriz Nodes (Top Half) */}
      <div className="absolute top-[15%] w-full flex justify-around px-8">
        {beatrizNodes.map((node, i) => (
          <NodeItem key={node.id} node={node} delay={i * 0.2} />
        ))}
      </div>

      {/* Portal Nodes (Bottom Half) */}
      <div className="absolute bottom-[15%] w-full flex justify-around px-8">
        {portalNodes.map((node, i) => (
          <NodeItem key={node.id} node={node} delay={i * 0.2 + 0.6} />
        ))}
      </div>

      {/* Metadata Indicators */}
      <div className="absolute top-1/2 left-8 -translate-y-1/2 space-y-4">
        <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500">
          <div className="h-1.5 w-1.5 rounded-full bg-neon-blue animate-ping" />
          <span>DATA_SYNC: ACTIVE</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500">
          <div className="h-1.5 w-1.5 rounded-full bg-neon-purple animate-ping delay-300" />
          <span>MISSION_LOG: STREAMING</span>
        </div>
      </div>

      {!fullscreen && (
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsFullscreen(true)}
          className="absolute top-4 right-4 h-8 w-8 text-zinc-500 hover:text-white hover:bg-white/10 rounded-full"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );

  return (
    <>
      <DiagramContent />

      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-[95vw] h-[90vh] bg-zinc-950/95 border-white/10 p-0 overflow-hidden">
          <div className="absolute top-4 right-4 z-50">
            <DialogClose asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full">
                <X className="h-6 w-6" />
              </Button>
            </DialogClose>
          </div>
          <DialogHeader className="p-8 absolute top-0 left-0 z-50">
            <DialogTitle className="font-orbitron font-bold text-2xl bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent italic">
              NEURAL NEXUS ECOSYSTEM V2.0
            </DialogTitle>
          </DialogHeader>
          <DiagramContent fullscreen />
        </DialogContent>
      </Dialog>
    </>
  );
}

function NodeItem({ node, delay }: { node: any, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="flex flex-col items-center gap-2 group cursor-help"
    >
      <div className={`h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-neon-blue/50 group-hover:bg-neon-blue/10 transition-all shadow-[0_0_20px_rgba(255,255,255,0.02)]`}>
        <node.icon className={`h-6 w-6 ${node.color}`} />
      </div>
      <div className="text-center opacity-0 group-hover:opacity-100 transition-opacity absolute -top-12 bg-zinc-900 border border-white/10 p-2 rounded-lg pointer-events-none z-50 min-w-[120px]">
        <p className="text-[10px] font-orbitron font-bold text-white uppercase">{node.label}</p>
        <p className="text-[9px] text-zinc-500 leading-none">{node.desc}</p>
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
