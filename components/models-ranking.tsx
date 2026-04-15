'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Type, 
  Image as ImageIcon, 
  Video, 
  Loader2, 
  ChevronRight, 
  Trophy, 
  Target, 
  Zap, 
  ShieldCheck, 
  Cpu, 
  Activity, 
  Clock,
  Search,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AIModel {
  id: number;
  nombre: string;
  empresa: string;
  descripcion: string;
  metrica_principal: string;
  puntaje: number;
  razonamiento: number;
  velocidad: number;
  precision: number;
  eficiencia: number;
}

export function ModelsRanking() {
  const [loading, setLoading] = useState(true);
  const [models, setModels] = useState<AIModel[]>([]);
  const [activeTab, setActiveTab] = useState('Texto'); // 'Texto', 'Imagen', 'Video'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModels, setSelectedModels] = useState<number[]>([]);
  const [isComparing, setIsComparing] = useState(false);

  const categories = [
    { name: 'Texto', icon: <Type className="h-4 w-4" />, desc: 'Modelos de lenguaje, razonamiento y código.' },
    { name: 'Imagen', icon: <ImageIcon className="h-4 w-4" />, desc: 'Generación, edición y visión artificial.' },
    { name: 'Video', icon: <Video className="h-4 w-4" />, desc: 'Generación de video y animación por IA.' }
  ];

  const fetchModels = async (category: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/models-rank', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category })
      });
      const data = await response.json();
      if (data.modelos) setModels(data.modelos);
    } catch (err) {
      console.error('Error fetching rankings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels(activeTab);
  }, [activeTab]);

  const filteredModels = useMemo(() => {
    return models.filter(m => m.nombre.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [models, searchQuery]);

  const toggleSelection = (id: number) => {
    setSelectedModels(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id].slice(-3)
    );
  };

  const MetricBar = ({ label, value, icon, color }: { label: string, value: number, icon: React.ReactNode, color: string }) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-zinc-500">
        <span className="flex items-center gap-1">{icon} {label}</span>
        <span className="text-white">{value}%</span>
      </div>
      <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`h-full rounded-full ${color} shadow-[0_0_10px_rgba(255,255,255,0.1)]`}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Search and Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 h-4 w-4" />
          <input
            type="text"
            placeholder={`Filtrar en ${activeTab}...`}
            className="w-full bg-black/40 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-sm focus:border-neon-blue/50 outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex bg-zinc-900/50 border border-white/5 p-1 rounded-2xl self-start">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveTab(cat.name)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === cat.name ? 'bg-white text-black shadow-xl' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Models */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array(6).fill(0).map((_, i) => (
            <Card key={i} className="h-64 rounded-[32px] bg-zinc-900/20 border-white/5 animate-pulse" />
          ))
        ) : (
          filteredModels.map((model) => (
            <motion.div
              layout
              key={model.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-7 rounded-[32px] bg-zinc-900/20 border transition-all duration-300 relative group overflow-hidden ${
                selectedModels.includes(model.id) 
                ? 'border-neon-blue ring-4 ring-neon-blue/5 shadow-[0_0_30px_rgba(0,163,255,0.1)]' 
                : 'border-white/5 hover:border-white/20'
              }`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 rounded-2xl bg-white/5 text-neon-blue">
                  {activeTab === 'Texto' ? <Type size={22} /> : activeTab === 'Imagen' ? <ImageIcon size={22} /> : <Video size={22} />}
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[9px] text-zinc-500 uppercase font-black tracking-widest">{model.empresa}</span>
                  <span className="text-sm font-orbitron font-bold text-white">{model.puntaje} <span className="text-[10px] opacity-40">PTS</span></span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{model.nombre}</h3>
              <p className="text-xs text-zinc-500 leading-relaxed mb-8 line-clamp-2 h-8">{model.descripcion}</p>
              
              <Button
                onClick={() => toggleSelection(model.id)}
                className={`w-full py-6 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  selectedModels.includes(model.id) 
                  ? 'bg-neon-blue text-black shadow-lg shadow-neon-blue/20' 
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                }`}
              >
                {selectedModels.includes(model.id) ? 'Seleccionado' : 'Añadir al Benchmark'}
              </Button>
            </motion.div>
          ))
        )}
      </div>

      {/* Floating Action Bar */}
      <AnimatePresence>
        {selectedModels.length > 0 && (
          <motion.div 
            initial={{ y: 100, x: '-50%' }}
            animate={{ y: 0, x: '-50%' }}
            exit={{ y: 100, x: '-50%' }}
            className="fixed bottom-8 left-1/2 z-[100]"
          >
            <div className="bg-black/80 backdrop-blur-2xl border border-neon-blue/30 p-2.5 pl-6 rounded-full flex items-center gap-6 shadow-2xl shadow-neon-blue/10">
              <div className="text-[10px] font-black text-white uppercase tracking-widest">
                {selectedModels.length} Modelos <span className="text-neon-blue italic">En Cola</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setSelectedModels([])} className="px-5 py-2.5 text-[10px] font-bold text-zinc-500 hover:text-white transition-colors">LIMPIAR</button>
                <Button
                  onClick={() => setIsComparing(true)}
                  className="px-8 py-2.5 bg-neon-blue text-black rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
                >
                  Ejecutar Benchmark
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Benchmark Overlay View */}
      <AnimatePresence>
        {isComparing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-black flex flex-col p-8 overflow-y-auto custom-scrollbar"
          >
            <div className="max-w-7xl mx-auto w-full pb-20">
              <div className="flex items-center justify-between mb-12">
                <Button
                  variant="ghost"
                  onClick={() => setIsComparing(false)}
                  className="flex items-center gap-2 text-neon-blue font-bold text-[10px] uppercase tracking-widest hover:text-white"
                >
                  <ChevronRight className="h-4 w-4 rotate-180" /> Cerrar Benchmark
                </Button>
                <div className="flex items-center gap-3">
                  <Trophy className="text-amber-400 h-6 w-6" />
                  <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase font-orbitron">Elite Comparison <span className="text-neon-blue">Mode</span></h2>
                </div>
                <div className="w-24 hidden md:block" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {selectedModels.map((id) => {
                  const model = models.find(m => m.id === id);
                  if (!model) return null;
                  return (
                    <motion.div 
                      key={id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-8 rounded-[40px] bg-zinc-900/40 border border-white/5 relative overflow-hidden group"
                    >
                      <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                        <Activity className="h-40 w-40" />
                      </div>

                      <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-8">
                          <div className="w-12 h-12 rounded-2xl bg-neon-blue/10 flex items-center justify-center text-neon-blue font-black border border-neon-blue/20">
                            {model.nombre[0]}
                          </div>
                          <div>
                            <h3 className="text-2xl font-black text-white leading-none">{model.nombre}</h3>
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">{model.empresa}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-10">
                          <div className="p-5 rounded-2xl bg-black/40 border border-white/5 shadow-inner">
                            <p className="text-[10px] text-zinc-500 uppercase font-black mb-1">Puntaje General</p>
                            <p className="text-2xl font-black text-neon-blue font-orbitron">{model.puntaje}/100</p>
                          </div>
                          <div className="p-5 rounded-2xl bg-black/40 border border-white/5 shadow-inner">
                            <p className="text-[10px] text-zinc-500 uppercase font-black mb-1">Capacidad</p>
                            <p className="text-sm font-black text-white uppercase">{model.metrica_principal}</p>
                          </div>
                        </div>

                        <div className="space-y-6">
                          <MetricBar label="Razonamiento" value={model.razonamiento} icon={<Target className="h-3 w-3" />} color="bg-neon-blue" />
                          <MetricBar label="Velocidad / Latencia" value={model.velocidad} icon={<Zap className="h-3 w-3" />} color="bg-indigo-500" />
                          <MetricBar label="Precisión / Exactitud" value={model.precision} icon={<ShieldCheck className="h-3 w-3" />} color="bg-emerald-500" />
                          <MetricBar label="Eficiencia / Costo" value={model.eficiencia} icon={<Cpu className="h-3 w-3" />} color="bg-neon-purple" />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-12 p-8 rounded-[40px] border border-neon-blue/20 bg-neon-blue/5 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-xl">
                <div className="flex items-center gap-4">
                  <Clock className="text-neon-blue h-6 w-6" />
                  <div>
                    <p className="text-sm font-bold text-white uppercase tracking-widest">Generación de Reporte Técnico</p>
                    <p className="text-xs text-zinc-500">Datos actualizados mediante análisis de Beatriz Orchestrator en tiempo real con Groq.</p>
                  </div>
                </div>
                <Button className="px-8 py-6 bg-white text-black font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-neon-blue transition-all">
                  Exportar PDF del Análisis
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
