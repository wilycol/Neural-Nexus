"use client";

import React, { useEffect, useState } from "react";
import { 
  Terminal, 
  Activity, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ExternalLink,
  ChevronRight,
  RefreshCcw,
  Zap,
  Play
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Mission {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  platform: string;
  published_url?: string;
  error_log?: string;
  created_at: string;
  news?: {
    title: string;
    slug: string;
  };
}

export default function MissionsAdminPage() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30);

  const fetchMissions = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/missions");
      const json = await res.json();
      if (json.data) setMissions(json.data);
    } catch (error) {
      console.error("Error fetching missions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMissions();
    const interval = setInterval(fetchMissions, refreshInterval * 1000);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  const getStatusColor = (status: Mission['status']) => {
    switch (status) {
      case 'completed': return 'text-green-400 border-green-400/30 bg-green-400/10';
      case 'processing': return 'text-neon-purple border-neon-purple/30 bg-neon-purple/10';
      case 'failed': return 'text-red-400 border-red-400/30 bg-red-400/10';
      default: return 'text-neon-blue border-neon-blue/30 bg-neon-blue/10';
    }
  };

  const getStatusIcon = (status: Mission['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-4 w-4" />;
      case 'processing': return <RefreshCcw className="h-4 w-4 animate-spin" />;
      case 'failed': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <main className="min-h-screen bg-black text-white p-6 pt-24 font-orbitron">
      {/* Header Industrial */}
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-neon-blue">
              <Terminal className="h-5 w-5" />
              <span className="text-xs uppercase tracking-widest font-bold">Protocolo Alpha // Vigilancia Industrial</span>
            </div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-white via-neon-blue to-neon-purple bg-clip-text text-transparent italic">
              MISSION CONTROL CENTER 💋
            </h1>
            <p className="text-xs text-muted-foreground font-mono">Monitoreo de producción asíncrona Beatriz Series X Elite</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-muted-foreground uppercase">Frecuencia de actualización</span>
              <div className="flex gap-2 mt-1">
                {[10, 30, 60].map(sec => (
                  <Button 
                    key={sec}
                    variant="outline" 
                    size="sm" 
                    className={`h-7 px-2 text-[10px] ${refreshInterval === sec ? 'border-neon-blue text-neon-blue bg-neon-blue/5' : ''}`}
                    onClick={() => setRefreshInterval(sec)}
                  >
                    {sec}s
                  </Button>
                ))}
              </div>
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-10 w-10 border-white/20 hover:border-neon-blue hover:text-neon-blue transition-all"
              onClick={fetchMissions}
              disabled={loading}
            >
              <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-neon-blue/10 text-neon-blue">
                  <Zap className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase">Total Misiones</p>
                <p className="text-2xl font-black">{missions.length}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-neon-purple/10 text-neon-purple">
                  <RefreshCcw className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase">En Proceso</p>
                <p className="text-2xl font-black">{missions.filter(m => m.status === 'processing').length}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-400/10 text-green-400">
                  <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase">Completadas</p>
                <p className="text-2xl font-black text-green-400">{missions.filter(m => m.status === 'completed').length}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-red-400/10 text-red-400">
                  <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase">Fallidas</p>
                <p className="text-2xl font-black text-red-400">{missions.filter(m => m.status === 'failed').length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Missions Table/List style */}
        <div className="space-y-4">
          {missions.length === 0 && !loading ? (
             <div className="text-center py-20 border border-dashed border-white/10 rounded-xl">
                <Activity className="h-10 w-10 text-muted-foreground mx-auto mb-4 opacity-20" />
                <p className="text-muted-foreground">Silencio en el canal... No hay misiones industriales activas.</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {missions.map((mission) => (
                <Card 
                  key={mission.id} 
                  className="bg-zinc-950 border-white/5 hover:border-white/20 transition-all group overflow-hidden"
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                      {/* Left: Status & Icon */}
                      <div className="flex-shrink-0">
                         <Badge className={`${getStatusColor(mission.status)} font-mono px-3 py-1 flex items-center gap-2 border`}>
                            {getStatusIcon(mission.status)}
                            {mission.status.toUpperCase()}
                         </Badge>
                      </div>

                      {/* Middle: Details */}
                      <div className="flex-grow space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                           <h3 className="text-sm font-bold truncate group-hover:text-neon-blue transition-colors">
                              {mission.title}
                           </h3>
                           <ChevronRight className="h-3 w-3 text-white/20" />
                           <span className="text-[10px] text-muted-foreground font-mono bg-white/5 px-2 py-0.5 rounded uppercase">
                              {mission.platform}
                           </span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                           <Clock className="h-3 w-3" />
                           {new Date(mission.created_at).toLocaleString()}
                           {mission.news && (
                             <>
                               <Separator orientation="vertical" className="h-2 bg-white/10" />
                               <span className="flex items-center gap-1">
                                  Origen: <span className="text-neon-blue underline cursor-pointer">{mission.news.title}</span>
                               </span>
                             </>
                           )}
                        </div>
                      </div>

                      {/* Right: Actions & Links */}
                      <div className="flex flex-wrap gap-2 md:flex-nowrap">
                         {mission.published_url && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 border-green-500/50 text-green-400 hover:bg-green-500/10 gap-2"
                              asChild
                            >
                              <a href={mission.published_url} target="_blank" rel="noopener noreferrer">
                                <Play className="h-3 w-3" />
                                Ver Reel 💋
                              </a>
                            </Button>
                         )}
                         <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 text-white/50 hover:text-white gap-2"
                            asChild
                         >
                            <a href={`/news/${mission.news?.slug}`} target="_blank">
                              Noticia Original
                              <ExternalLink className="h-3 w-3" />
                            </a>
                         </Button>
                      </div>
                    </div>

                    {/* Progress Bar (if processing) */}
                    {mission.status === 'processing' && (
                       <div className="mt-4 h-[1px] w-full bg-white/5 overflow-hidden">
                          <div className="h-full bg-neon-purple animate-ping opacity-50" />
                       </div>
                    )}

                    {/* Error Log (if failed) */}
                    {mission.status === 'failed' && mission.error_log && (
                       <div className="mt-3 p-3 bg-red-950/20 border border-red-500/20 rounded text-[10px] text-red-400 font-mono">
                          <p className="font-bold mb-1">LOG DE ERROR:</p>
                          {mission.error_log}
                       </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Estilos Globales para Animaciones de Beatriz */}
      <style jsx global>{`
        @keyframes scan {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 0.5; }
          100% { transform: translateY(100%); opacity: 0; }
        }
        .bunker-grid {
          background-image: 
            linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>
    </main>
  );
}
