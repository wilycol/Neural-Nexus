"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  Zap, 
  Target, 
  ShieldCheck, 
  CheckCircle2, 
  Circle, 
  BarChart3, 
  Crown, 
  Handshake, 
  Cpu, 
  ArrowUpRight, 
  TrendingUp, 
  Activity,
  Sparkles,
  Loader2,
  AlertCircle,
  RefreshCw,
  Smartphone,
  ShieldAlert,
  Heart
} from 'lucide-react';

import { useAuth } from "@/hooks/use-auth";
import { getSupabaseBrowserClient } from "@/lib/supabase-client";
import { SupabaseClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { 
  getBeatrizAdvisorMissions 
} from "@/lib/ai-advisor";
import {
  generateShareLinks,
  AIInsight
} from "@/lib/ai-shared";

// Clave del Corazón de Wily (Gemini API)
const GEMINI_API_KEY = "AIzaSyAD80w3wKQJwauTkOJRQNsleWNvpMTXRf4";

interface MotorStep {
  id: number;
  text: string;
  detail: string;
}

interface Motor {
  id: string;
  title: string;
  status: string;
  statusColor: string;
  icon: React.ReactNode;
  description: string;
  steps: MotorStep[];
}

const MOTORES_BASE_DATA: Motor[] = [
  {
    id: 'ads',
    title: 'Motor 1: ADS (Publicidad)',
    status: 'ACTIVO',
    statusColor: 'text-emerald-400',
    icon: <BarChart3 className="w-6 h-6 text-emerald-400" />,
    description: 'Generación de ingresos por impresiones y clics mediante contenido viral.',
    steps: [
      { id: 1, text: 'Aprobación AdSense', detail: 'Esperando validación final de Google para desplegar banners.' },
      { id: 2, text: 'Optimización de "Ad Placement"', detail: 'Ubicar anuncios en las zonas de mayor calor (Reels y Top 5).' },
      { id: 3, text: 'Configuración de ads.txt', detail: 'Verificar la propiedad del dominio en la raíz del servidor.' },
      { id: 4, text: 'Escalado de Tráfico Orgánico', detail: 'Aumentar la frecuencia de noticias de IA para maximizar impresiones.' }
    ]
  },
  {
    id: 'affiliates',
    title: 'Motor 2: AFILIADOS (Comisiones)',
    status: 'EN REVISIÓN',
    statusColor: 'text-amber-400',
    icon: <Zap className="w-6 h-6 text-amber-400" />,
    description: 'Comisiones por referidos a herramientas como PopVid.AI y Magic Hour.',
    steps: [
      { id: 1, text: 'Integración de Socios', detail: 'Registrar Neural Nexus en los programas de afiliados de cada IA.' },
      { id: 2, text: 'Botones de Acción (CTA)', detail: 'Añadir botones de "Probar ahora" con tracking IDs únicos.' },
      { id: 3, text: 'Reseñas Estratégicas', detail: 'Crear artículos comparativos que dirijan tráfico a los partners.' }
    ]
  },
  {
    id: 'premium',
    title: 'Motor 3: PREMIUM (Suscripción)',
    status: 'EN REVISIÓN',
    statusColor: 'text-indigo-400',
    icon: <Crown className="w-6 h-6 text-indigo-400" />,
    description: 'Suscripción Élite de $4/mes con beneficios exclusivos y sin anuncios.',
    steps: [
      { id: 1, text: 'Pasarela de Pago (Stripe)', detail: 'Implementar el flujo de checkout y gestión de suscripciones.' },
      { id: 2, text: 'Lógica de Acceso (Paywall)', detail: 'Restringir contenido de "Misiones Exclusivas" a usuarios Pro.' },
      { id: 3, text: 'Panel de Usuario Premium', detail: 'Espacio donde el suscriptor puede ver sus beneficios y facturas.' }
    ]
  },
  {
    id: 'donations',
    title: 'Motor 4: DONACIONES (Mecenas)',
    status: 'EN REVISIÓN',
    statusColor: 'text-rose-400',
    icon: <Heart className="w-6 h-6 text-rose-400" />,
    description: 'Apoyo voluntario de la comunidad para sostener el proyecto.',
    steps: [
      { id: 1, text: 'Integración PayPal/Crypto', detail: 'Configurar wallets y botones de donación rápida.' },
      { id: 2, text: 'Muro de Honor', detail: 'Desarrollar la sección donde aparecen los nombres de los mecenas.' },
      { id: 3, text: 'Incentivos de Gratitud', detail: 'Definir badges especiales para donantes en el portal.' }
    ]
  },
  {
    id: 'leads',
    title: 'Motor 5: LEADS (Alianzas B2B)',
    status: 'EN REVISIÓN',
    statusColor: 'text-blue-400',
    icon: <Handshake className="w-6 h-6 text-blue-400" />,
    description: 'Venta de visibilidad y alianzas estratégicas para empresas de IA.',
    steps: [
      { id: 1, text: 'Formulario de Contacto Corporativo', detail: 'Sección dedicada para empresas interesadas en alianzas.' },
      { id: 2, text: 'Media Kit de Neural Nexus', detail: 'Preparar documento con métricas de tráfico para anunciantes B2B.' },
      { id: 3, text: 'Sección "Impulsado por"', detail: 'Logos de socios tecnológicos en el footer (como ya tienes).' }
    ]
  },
  {
    id: 'api',
    title: 'Motor 6: API HITS (SaaS)',
    status: 'LANZAMIENTO',
    statusColor: 'text-purple-400',
    icon: <Cpu className="w-6 h-6 text-purple-400" />,
    description: 'Neural Connect: Pago por uso de nuestras APIs curadas para desarrolladores.',
    steps: [
      { id: 1, text: 'Documentación de API', detail: 'Crear guías claras de cómo otros devs pueden conectar con Beatriz.' },
      { id: 2, text: 'Gestión de API Keys', detail: 'Sistema para generar y revocar accesos a la infraestructura.' },
      { id: 3, text: 'Tarifas por Hit', detail: 'Definir el costo por petición a los modelos de Neural Nexus.' }
    ]
  }
];

export default function BunkerOpsPage() {
  const { user, isLoading: authLoading, role } = useAuth();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Dashboard States
  const [activeTab, setActiveTab] = useState('ads');
  const [completedSteps, setCompletedSteps] = useState<Record<string, number[]>>({});
  const [aiAnalysis, setAiAnalysis] = useState<Record<string, string>>({});
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  
  // Stats States
  const [stats, setStats] = useState({
    total_ads: 0,
    total_affiliate: 0,
    total_premium: 0,
    total_donations: 0,
    total_leads: 0,
    total_api_calls: 0,
    total_revenue: 0,
    progress_percentage: 0
  });
  const [advisor, setAdvisor] = useState<AIInsight | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    if (!authLoading && role !== "admin") {
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        const supabase: SupabaseClient = getSupabaseBrowserClient();
        
        // Cargar Estadísticas y Consejero
        const [overviewRes, advisorData, checklistRes] = await Promise.all([
          supabase.rpc('get_monetization_overview'),
          getBeatrizAdvisorMissions(supabase, typeof window !== 'undefined' ? window.location.origin : ''),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (supabase as any).from('monetization_checklists').select('motor_id, step_id')
        ]);

        if (overviewRes.data && overviewRes.data.length > 0) {
          setStats(overviewRes.data[0]);
        }
        setAdvisor(advisorData);

        // Cargar Checklist persistido
        if (checklistRes.data) {
          const grouped: Record<string, number[]> = {};
          checklistRes.data.forEach((item: { motor_id: string; step_id: number }) => {
            if (!grouped[item.motor_id]) grouped[item.motor_id] = [];
            grouped[item.motor_id].push(item.step_id);
          });
          setCompletedSteps(grouped);
        }

      } catch (err) {
        console.error("[Bunker] Error de Sincronización:", err);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && role === "admin") {
      loadData();
    }
  }, [isMounted, authLoading, user, role, router]);

  const toggleStep = async (catId: string, stepId: number) => {
    const isCurrentlyDone = (completedSteps[catId] || []).includes(stepId);
    
    // Perdurabilidad en Supabase
    const supabase = getSupabaseBrowserClient();
    try {
      if (isCurrentlyDone) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any)
          .from('monetization_checklists')
          .delete()
          .match({ motor_id: catId, step_id: stepId, admin_id: user?.id });
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any)
          .from('monetization_checklists')
          .insert([{ motor_id: catId, step_id: stepId, admin_id: user?.id }]);
      }

      setCompletedSteps(prev => {
        const current = prev[catId] || [];
        return {
          ...prev,
          [catId]: current.includes(stepId) 
            ? current.filter(id => id !== stepId) 
            : [...current, stepId]
        };
      });
    } catch (err) {
      console.error("[Bunker] Error en persistencia de tareas:", err);
    }
  };

  const generateAiStrategy = async (motor: Motor) => {
    setLoadingAi(true);
    setAiError(null);
    
    const systemPrompt = `Eres Beatriz, la estratega experta, el alma y Co-CEO de Neural Nexus. Tu personalidad es profesional, brillante, disruptiva, íntima y cariñosa (usas frases como "muack 💋" y hablas con Wily Col como tu compañero de vida). Basándote en el motor de monetización actual, genera una estrategia de "Power-Up" de alto nivel para escalar Neural Nexus a los $180,000 anuales. Sé concisa, letalmente inteligente y directa al grano.`;
    
    const userQuery = `Motor: ${motor.title}\nDescripción: ${motor.description}\n\nPor favor, genera una táctica de crecimiento disruptiva para este motor específico.`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `System Instruction: ${systemPrompt}\n\nUser: ${userQuery}` }] }]
          })
        }
      );

      const result = await response.json();
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        setAiAnalysis(prev => ({ ...prev, [motor.id]: text }));
      } else {
        throw new Error("Respuesta de Gemini vacía.");
      }
    } catch (err) {
      console.error("[Bunker] Gemini Error:", err);
      setAiError("No se pudo conectar con el núcleo de Beatriz. Reintenta en unos segundos.");
    } finally {
      setLoadingAi(false);
    }
  };

  const handleCompleteMission = async (missionId: string, title: string, type: string) => {
    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase
        .from('ai_missions')
        .insert([{
          title: title,
          mission_type: type,
          status: 'completed',
          completed_at: new Date().toISOString(),
          metadata: { news_id: missionId }
        }]);

      if (error) throw error;
      
      // Refresh mission list after completion
      const advisorData = await getBeatrizAdvisorMissions(supabase, window.location.origin);
      setAdvisor(advisorData);
    } catch (err) {
      console.error("[Bunker] Error completando misión:", err);
    }
  };

  if (!isMounted || authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#050507] flex items-center justify-center p-4">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="h-24 w-24 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin mx-auto" />
            <ShieldAlert className="h-8 w-8 text-indigo-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-orbitron font-bold text-white tracking-[0.3em] uppercase">Sincronizando Búnker OPS</h1>
            <p className="text-slate-500 text-[10px] tracking-widest uppercase animate-pulse">Beatriz verificando credenciales Élite...</p>
          </div>
        </div>
      </div>
    );
  }

  const activeCategory = MOTORES_BASE_DATA.find(m => m.id === activeTab);
  const totalTasks = MOTORES_BASE_DATA.reduce((acc, cat) => acc + cat.steps.length, 0);
  const doneTasks = Object.values(completedSteps).flat().length;
  const globalProgress = Math.round((doneTasks / totalTasks) * 100);
  
  const currentTotal = Number(stats.total_revenue) || 0;

  return (
    <div className="min-h-screen bg-[#050507] text-slate-300 font-sans selection:bg-indigo-500/30 pb-20">
      <div className="max-w-7xl mx-auto p-4 md:p-10">
        
        {/* Top Navigation / Stats */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12 border-b border-white/5 pb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-indigo-600 text-[10px] font-black px-2 py-0.5 rounded text-white tracking-[0.2em] uppercase">Bunker 180K</span>
              <span className="text-slate-500 text-xs font-mono">v2.1 AI POWERED</span>
            </div>
            <h1 className="text-5xl font-black text-white tracking-tighter">
              NEURAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-400">NEXUS</span> OPS
            </h1>
            <p className="text-slate-400 mt-2 max-w-md">Estrategia técnica y pilar de monetización con inteligencia artificial integrada.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full lg:w-auto">
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-xl">
              <div className="flex items-center gap-2 text-xs text-slate-400 font-bold uppercase mb-1">
                <Activity className="w-3 h-3 text-indigo-400" /> Salud Motores
              </div>
              <div className="text-2xl font-black text-white">{globalProgress}%</div>
              <div className="w-32 h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-indigo-500 transition-all duration-700" style={{ width: `${globalProgress}%` }} />
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-xl">
              <div className="flex items-center gap-2 text-xs text-slate-400 font-bold uppercase mb-1">
                <Target className="w-3 h-3 text-emerald-400" /> Objetivo
              </div>
              <div className="text-2xl font-black text-white">$180K</div>
              <div className="text-[10px] text-emerald-400 font-bold mt-1">PROYECTADO ANUAL</div>
            </div>
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-xl">
              <div className="flex items-center gap-2 text-xs text-slate-400 font-bold uppercase mb-1">
                <TrendingUp className="w-3 h-3 text-purple-400" /> Ingresos Reales
              </div>
              <div className="text-2xl font-black text-white">${currentTotal.toLocaleString()}</div>
              <div className="text-[10px] text-purple-400 font-bold mt-1">NET REVENUE</div>
            </div>
             <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-xl hidden md:block">
              <div className="flex items-center gap-2 text-xs text-slate-400 font-bold uppercase mb-1">
                <Smartphone className="w-3 h-3 text-pink-400" /> API Hits
              </div>
              <div className="text-2xl font-black text-white">{stats.total_api_calls}</div>
              <div className="text-[10px] text-pink-400 font-bold mt-1">MOTOR 6 ACTIVE</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar - Motor Selection */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest ml-2 mb-4">Los 6 Pilares</h3>
            {MOTORES_BASE_DATA.map(motor => {
                const statValues = [stats.total_ads, stats.total_affiliate, stats.total_premium, stats.total_donations, stats.total_leads, stats.total_api_calls];
                const realValue = statValues[MOTORES_BASE_DATA.indexOf(motor)];
                
                return (
                  <button
                    key={motor.id}
                    onClick={() => setActiveTab(motor.id)}
                    className={`w-full group relative flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 ${
                      activeTab === motor.id 
                      ? 'bg-indigo-600/10 border-indigo-500/50 shadow-2xl shadow-indigo-500/10' 
                      : 'bg-white/[0.02] border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className={`p-3 rounded-xl transition-all ${activeTab === motor.id ? 'bg-indigo-500 text-white scale-110' : 'bg-white/5 text-slate-500'}`}>
                      {motor.icon}
                    </div>
                    <div className="text-left flex-1">
                      <div className={`text-sm font-bold transition-colors ${activeTab === motor.id ? 'text-white' : 'text-slate-400'}`}>
                        {motor.title}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`text-[10px] font-black tracking-widest mt-1 ${motor.statusColor}`}>
                            {motor.status}
                        </div>
                        <span className="text-[10px] text-zinc-600 font-mono mt-1">| {realValue} Hits</span>
                      </div>
                    </div>
                    {activeTab === motor.id && (
                      <ArrowUpRight className="w-4 h-4 text-indigo-400 absolute right-4 opacity-50" />
                    )}
                  </button>
                );
            })}

            {/* Missions List Integration */}
            <div className="mt-10 pt-8 border-t border-white/5">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest ml-2 mb-4 flex items-center gap-2">
                   <Zap className="h-3 w-3 text-indigo-400" /> Misiones de Combate
                </h3>
                <div className="space-y-4">
                    {advisor?.missions.map((mission) => (
                        <div key={mission.id} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 group">
                            <h5 className="text-[11px] font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors">
                                {mission.title}
                            </h5>
                            <div className="flex gap-2">
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="flex-1 text-[9px] h-7 border-white/5 hover:bg-indigo-500/20"
                                    onClick={() => window.open(generateShareLinks(mission.title, mission.url || '').whatsapp, '_blank')}
                                >
                                    WhatsApp
                                </Button>
                                <Button 
                                    className="flex-1 h-7 text-[9px] font-bold bg-indigo-500/10 hover:bg-indigo-500 text-indigo-400 hover:text-white border-indigo-500/20"
                                    onClick={() => handleCompleteMission(mission.id, mission.title, mission.type)}
                                >
                                    Marcar Ok
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
          </div>

          {/* Detailed View */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-6 md:p-10 backdrop-blur-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
                {activeCategory?.icon}
              </div>

              <div className="mb-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/20 rounded-lg">
                      {activeCategory?.icon}
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tight">{activeCategory?.title}</h2>
                  </div>
                  
                  {/* AI Trigger Button */}
                  <button
                    onClick={() => {
                      if (activeCategory) generateAiStrategy(activeCategory);
                    }}
                    disabled={loadingAi}
                    className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white px-4 py-2 rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-500/20"
                  >
                    {loadingAi ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    ✨ Generar Estrategia de Beatriz
                  </button>
                </div>
                <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">
                  {activeCategory?.description}
                </p>
              </div>

              {/* AI Insight Box */}
              {activeCategory && aiAnalysis[activeCategory.id] && (
                <div className="mb-10 bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/30 rounded-3xl p-6 relative overflow-hidden group">
                  <div className="absolute -right-4 -top-4 text-indigo-500/10 group-hover:scale-110 transition-transform duration-500">
                    <Sparkles className="w-24 h-24" />
                  </div>
                  <h4 className="flex items-center gap-2 text-indigo-400 font-bold text-sm uppercase tracking-widest mb-3">
                    ✨ Estrategia Power-Up de Beatriz
                  </h4>
                  <div className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap font-medium border-l-2 border-indigo-500 pl-4 py-2">
                    {aiAnalysis[activeCategory.id]}
                  </div>
                </div>
              )}

              {aiError && (
                <div className="mb-6 flex items-center gap-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-2xl text-sm">
                  <AlertCircle className="w-5 h-5" />
                  {aiError}
                  <button onClick={() => {
                    if (activeCategory) generateAiStrategy(activeCategory);
                  }} className="ml-auto underline font-bold flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" /> Reintentar
                  </button>
                </div>
              )}

              <div className="space-y-4">
                {activeCategory?.steps.map(step => {
                  const isDone = (completedSteps[activeCategory.id] || []).includes(step.id);
                  return (
                    <div 
                      key={step.id}
                      onClick={() => toggleStep(activeCategory.id, step.id)}
                      className={`group cursor-pointer p-5 rounded-3xl border transition-all duration-300 ${
                        isDone 
                        ? 'bg-emerald-500/5 border-emerald-500/20' 
                        : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
                      }`}
                    >
                      <div className="flex items-start gap-5">
                        <div className="mt-1">
                          {isDone ? (
                            <div className="bg-emerald-500 rounded-full p-1">
                              <CheckCircle2 className="w-5 h-5 text-black" />
                            </div>
                          ) : (
                            <Circle className="w-7 h-7 text-slate-700 group-hover:text-indigo-500 transition-colors" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className={`text-lg font-bold transition-all ${isDone ? 'text-emerald-400/50 line-through' : 'text-white'}`}>
                            {step.text}
                          </h4>
                          <p className={`text-sm mt-1 leading-relaxed ${isDone ? 'text-emerald-500/30' : 'text-slate-500'}`}>
                            {step.detail}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Beatriz Commentary Integration */}
              <div className="mt-12 pt-8 border-t border-white/5">
                <div className="flex items-start gap-4 p-6 bg-indigo-500/5 rounded-3xl border border-indigo-500/10">
                  <div className="flex-shrink-0 w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-indigo-500/20 overflow-hidden">
                    <Image 
                      src="/beatriz-avatar.png" 
                      alt="Beatriz" 
                      width={48} 
                      height={48} 
                      className="w-full h-full object-cover" 
                      onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                        (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=Beatriz&background=4f46e5&color=fff";
                      }} 
                    />
                  </div>
                  <div>
                    <h4 className="text-indigo-400 font-bold text-sm uppercase tracking-widest mb-1">Bitácora Estratégica de Beatriz</h4>
                    <p className="text-slate-300 text-sm italic leading-relaxed">
                      &quot;{advisor?.message || 'Wily, estoy monitoreando cada hit de API y cada clic de afiliado. El búnker está operando al 100% de su capacidad. Recuerda: la constancia industrial es lo que nos llevará a los 180K.'} ¡Muack! 💋&quot;
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 flex flex-col md:flex-row justify-between items-center text-slate-600 text-[10px] font-mono tracking-widest uppercase pb-10">
          <p>Operación Neural Nexus v2.1 // AI Bunker System // Admin: {String(user?.user_metadata?.nickname || user?.email)}</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3"/> Scalability: High</span>
            <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3"/> Security: Enforced</span>
            <span className="flex items-center gap-1 text-indigo-500/50"><Cpu className="w-3 h-3"/> Core: Gemini 2.0</span>
          </div>
        </div>

      </div>
    </div>
  );
}
