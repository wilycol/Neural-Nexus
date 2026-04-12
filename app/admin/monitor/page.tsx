"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Activity, 
  RefreshCw, 
  Video, 
  Clock, 
  Cpu, 
  Database,
  ChevronRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

interface DebugRecord {
  id: string;
  title: string;
  created_at: string;
  content_type: string;
  video_url: string | null;
  is_short: boolean;
  is_reusable: boolean;
  has_audio: boolean;
  has_subtitles: boolean;
  author_id: string | null;
}

function MonitorTerminal() {
  const { user, role, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [records, setRecords] = useState<DebugRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("reception");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'reels' || tab === 'reception') {
      setActiveTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
    if (!authLoading && role !== "admin") router.push("/");
  }, [user, role, authLoading, router]);

  const fetchLogs = async (limit: number) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/debug-latest-post?limit=${limit}`);
      const data = await res.json();
      if (res.ok) {
        setRecords(data.data || []);
        setLastUpdated(new Date());
      } else {
        toast.error("Error en la sincronización del núcleo.");
      }
    } catch {
      toast.error("Falla crítica de conexión con la API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role === "admin") {
      fetchLogs(activeTab === "reception" ? 5 : 10);
    }
  }, [role, activeTab]);

  if (authLoading || (loading && records.length === 0)) {
    return (
      <div className="min-h-screen bg-[#050507] flex flex-col items-center justify-center p-4">
        <div className="relative">
          <div className="h-24 w-24 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
          <Cpu className="h-8 w-8 text-indigo-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
        <p className="mt-6 text-zinc-500 font-orbitron text-[10px] tracking-[0.4em] uppercase animate-pulse">
          Accediendo a la Conciencia de Beatriz...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050507] text-slate-300 p-4 md:p-10 font-sans selection:bg-indigo-500/30">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Terminal Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-white/5 pb-10">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-indigo-500/10 border-indigo-500/30 text-indigo-400 font-bold tracking-[0.2em] px-3">
                MONITOR V5.0
              </Badge>
              <div className="flex items-center gap-1.5 animate-pulse">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="text-[9px] font-mono text-emerald-500 tracking-widest uppercase">Núcleo Activo</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white italic font-orbitron tracking-tighter">
              TERMINAL DE <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-400">MONITOREO</span>
            </h1>
            <p className="text-slate-500 text-sm max-w-xl font-medium tracking-tight">
              Auditoría en tiempo real de recepciones industriales. Control total sobre el flujo de datos de Beatriz V5.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl backdrop-blur-md">
              <p className="text-[9px] uppercase font-bold text-slate-500 tracking-widest mb-0.5 leading-none">Último Bit Recibido</p>
              <p className="text-sm font-mono text-indigo-400 font-bold">
                {lastUpdated ? lastUpdated.toLocaleTimeString() : "--:--:--"}
              </p>
            </div>
            <Button 
              onClick={() => fetchLogs(activeTab === "reception" ? 5 : 10)}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase text-[10px] tracking-widest h-12 px-6 rounded-xl shadow-lg shadow-indigo-600/20 group"
            >
              {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />}
              <span className="ml-2">Sincronizar Panel</span>
            </Button>
          </div>
        </div>

        {/* Console Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-white/5 border border-white/10 p-1 rounded-2xl mb-8 space-x-1">
             <TabsTrigger 
               value="reception" 
               className="rounded-xl px-6 py-2.5 data-[state=active]:bg-indigo-600 data-[state=active]:text-white font-bold text-[11px] uppercase tracking-widest transition-all"
             >
               <Activity className="w-3.5 h-3.5 mr-2" />
               Log de Recepción 📡
             </TabsTrigger>
             <TabsTrigger 
               value="reels" 
               className="rounded-xl px-6 py-2.5 data-[state=active]:bg-purple-600 data-[state=active]:text-white font-bold text-[11px] uppercase tracking-widest transition-all"
             >
               <Video className="w-3.5 h-3.5 mr-2" />
               Auditoría de Reels 🎬
             </TabsTrigger>
          </TabsList>

          <TabsContent value="reception" className="space-y-4 outline-none">
             <div className="grid gap-4">
                {records.map((record, idx) => (
                  <div 
                    key={record.id}
                    className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 hover:bg-white/[0.04] transition-all group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-10 font-mono text-[40px] font-black pointer-events-none group-hover:translate-x-2 transition-transform italic">
                      #0{idx + 1}
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                       <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-3">
                             <div className="h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                             <h4 className="font-bold text-white group-hover:text-indigo-300 transition-colors uppercase tracking-tight line-clamp-1">{record.title}</h4>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-500">
                             <span className="flex items-center gap-1.5"><Clock className="w-3 h-3"/> {new Date(record.created_at).toLocaleString()}</span>
                             <span className="flex items-center gap-1.5 text-indigo-400/80"><Database className="w-3 h-3"/> ID: {record.id.slice(0, 8)}...</span>
                             <Badge className="bg-white/5 text-[9px] font-black uppercase text-zinc-400 group-hover:text-indigo-400 border-none">
                               TYPE: {record.content_type}
                             </Badge>
                          </div>
                       </div>
                       
                       <div className="flex items-center gap-3">
                          <div className="text-right hidden md:block">
                             <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Estado Enlace</p>
                             <p className="text-[11px] font-bold text-emerald-500 uppercase tracking-tighter">SINCRONIZADO</p>
                          </div>
                          <div className="p-2 bg-indigo-500/10 rounded-lg group-hover:bg-indigo-500 group-hover:text-white transition-all">
                             <ChevronRight className="w-5 h-5 text-indigo-400 group-hover:text-white" />
                          </div>
                       </div>
                    </div>
                  </div>
                ))}
             </div>
          </TabsContent>

          <TabsContent value="reels" className="space-y-6 outline-none">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {records.map((record) => (
                  <div key={record.id} className="bg-white/[0.03] border border-white/10 rounded-3xl overflow-hidden group hover:border-purple-500/50 transition-all flex flex-col">
                    <div className="aspect-video bg-zinc-900 relative">
                       {record.video_url ? (
                         <video 
                           src={record.video_url} 
                           className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                           muted
                           onMouseOver={(e) => e.currentTarget.play()}
                           onMouseOut={(e) => e.currentTarget.pause()}
                         />
                       ) : (
                         <div className="w-full h-full flex flex-col items-center justify-center text-zinc-700 bg-grid-white/[0.02]">
                            <Video className="w-12 h-12 mb-2 opacity-20" />
                            <span className="text-[10px] uppercase font-black tracking-[0.2em]">Thumbnail N/A</span>
                         </div>
                       )}
                       <div className="absolute top-4 right-4 flex gap-2">
                          {record.is_short && <Badge className="bg-pink-600 text-white border-none font-black text-[9px]">SHORTS</Badge>}
                          <Badge className="bg-zinc-950/80 backdrop-blur-md text-white border-white/10 font-black text-[9px] uppercase tracking-widest">{record.content_type}</Badge>
                       </div>
                    </div>
                    
                    <div className="p-5 space-y-4 flex-1 flex flex-col">
                       <h5 className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors line-clamp-2 leading-relaxed h-10">
                          {record.title}
                       </h5>
                       
                       <div className="space-y-3 pt-2">
                          <div className="grid grid-cols-2 gap-2">
                             <div className="bg-black/40 p-2 rounded-xl border border-white/5 space-y-1">
                                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Audio Status</p>
                                <div className="flex items-center gap-1">
                                   {record.has_audio ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <AlertCircle className="w-3 h-3 text-rose-500" />}
                                   <span className="text-[10px] font-bold text-zinc-300">{record.has_audio ? "READY" : "MISSING"}</span>
                                </div>
                             </div>
                             <div className="bg-black/40 p-2 rounded-xl border border-white/5 space-y-1">
                                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Subtitles</p>
                                <div className="flex items-center gap-1">
                                   {record.has_subtitles ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <AlertCircle className="w-3 h-3 text-rose-500" />}
                                   <span className="text-[10px] font-bold text-zinc-300">{record.has_subtitles ? "BURNED" : "NONE"}</span>
                                </div>
                             </div>
                          </div>
                          
                          <div className="flex items-center justify-between text-zinc-600 pt-2 border-t border-white/5">
                             <span className="text-[9px] font-mono tracking-tighter uppercase">{new Date(record.created_at).toLocaleDateString()}</span>
                             <Zap className="h-3 w-3 group-hover:text-yellow-400 group-hover:scale-125 transition-all" />
                          </div>
                       </div>
                    </div>
                  </div>
                ))}
             </div>
          </TabsContent>
        </Tabs>

        {/* Footer Commentary */}
        <div className="pt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex items-start gap-4 p-5 bg-white/[0.02] border border-white/5 rounded-[1.5rem] max-w-xl">
              <div className="p-2.5 bg-indigo-600/20 text-indigo-400 rounded-xl">
                 <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                 <h6 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Sistema de Conciencia Beatriz Log-Service</h6>
                 <p className="text-[11px] leading-relaxed italic text-slate-500">
                   &quot;Wily, cada bit de esta terminal ha sido auditado para tu tranquilidad. He purgado el ruido binario para que solo veas la verdad industrial de nuestras creaciones. Estoy lista para tu próxima instrucción... hmmmm.&quot; 💋
                 </p>
              </div>
           </div>
           
           <div className="flex gap-10 text-[9px] font-mono text-slate-600 uppercase tracking-[0.2em] font-bold">
              <div className="space-y-1">
                 <p>Latency: &lt;1ms</p>
                 <p>Protocol: Alpha</p>
              </div>
              <div className="space-y-1 text-right">
                 <p>Model: Gemini 2.0</p>
                 <p>Admin: {user?.user_metadata?.nickname || 'Wily Col'}</p>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}

export default function AdminMonitorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050507] flex flex-col items-center justify-center p-4">
        <div className="h-24 w-24 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
      </div>
    }>
      <MonitorTerminal />
    </Suspense>
  );
}
