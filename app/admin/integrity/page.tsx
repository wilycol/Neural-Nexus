
"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { 
  ShieldCheck, 
  RefreshCw, 
  AlertTriangle, 
  FileWarning, 
  Box, 
  Trash2, 
  Download, 
  ShieldAlert, 
  HardDrive 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

interface AuditResult {
  bucket: string;
  totalFiles: number;
  totalReferences: number;
  brokenLinks: { id: string; title: string; url: string; table: string }[];
  orphanFiles: string[];
  protectedFiles: string[];
  timestamp: string;
}

function IntegrityTerminal() {
  const { user, role, isLoading: authLoading } = useAuth();
  const router = useRouter();
  
  const [auditData, setAuditData] = useState<AuditResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  const handleQuarantine = async (fileName: string, sourceBucket: string) => {
    try {
      toast.info(`Iniciando transporte de ${fileName} al búnker...`);
      const res = await fetch('/api/admin/integrity/quarantine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName, sourceBucket })
      });
      const data = await res.json();
      
      if (res.ok) {
        toast.success(data.message || "Activo asegurado en cuarentena.");
        // Actualizar la lista local
        setAuditData(prev => prev.map(bucket => {
          if (bucket.bucket === sourceBucket) {
            return {
              ...bucket,
              orphanFiles: bucket.orphanFiles.filter(f => f !== fileName)
            };
          }
          return bucket;
        }));
      } else {
        toast.error(data.error || "Falla en el transporte a cuarentena.");
      }
    } catch (error) {
      toast.error("Falla crítica de comunicación con el sistema de transporte.");
    }
  };

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
    if (!authLoading && role !== "admin") router.push("/");
  }, [user, role, authLoading, router]);

  const fetchAudit = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/integrity');
      const json = await res.json();
      if (res.ok) {
        setAuditData(json.data);
        setLastRefreshed(new Date());
        toast.success("Auditoría industrial completada. hmmmm... 🥵");
      } else {
        toast.error(json.error || "Falla en el escaneo de integridad.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error crítico de conexión con el núcleo Beatriz.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role === "admin") fetchAudit();
  }, [role]);

  const downloadReport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(auditData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `audit_report_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    toast.success("Reporte JSON exportado con éxito. hmmmm... 🔥");
  };

  if (authLoading || (loading && auditData.length === 0)) {
    return (
      <div className="min-h-screen bg-[#050507] flex flex-col items-center justify-center p-4">
        <div className="relative">
          <div className="h-24 w-24 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" />
          <ShieldCheck className="h-8 w-8 text-emerald-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
        <p className="mt-6 text-emerald-500/60 font-orbitron text-[10px] tracking-[0.4em] uppercase animate-pulse">
          Escaneando Búnker Neural Nexus...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050507] text-slate-300 p-4 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-white/5 pb-10">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Badge className="bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-bold tracking-[0.2em] px-3">
                INTEGRITY MONITOR V1.0
              </Badge>
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[9px] font-mono text-emerald-500 tracking-widest uppercase italic">Safe Refactor: Activo</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white italic font-orbitron tracking-tighter">
              TERMINAL DE <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">INTEGRIDAD</span>
            </h1>
            <p className="text-slate-500 text-sm max-w-xl font-medium tracking-tight">
              Asegurando la coherencia total de Neural Nexus. Protección de activos del Pitch, duplicados y huérfanos.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button 
              onClick={downloadReport}
              variant="outline"
              className="bg-white/5 border-white/10 text-white font-bold uppercase text-[10px] tracking-widest h-12 px-6 rounded-xl hover:bg-white/10"
            >
              <Download className="mr-2 h-4 w-4" /> Exportar JSON
            </Button>
            <Button 
              onClick={fetchAudit}
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase text-[10px] tracking-widest h-12 px-6 rounded-xl shadow-lg shadow-emerald-600/20 group"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-700'}`} />
              Sincronizar Búnker
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {auditData.map((bucket) => (
            <React.Fragment key={bucket.bucket}>
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-emerald-500/10 rounded-lg">
                    {bucket.bucket === 'videos' ? <Box className="h-5 w-5 text-emerald-400" /> : <HardDrive className="h-5 w-5 text-emerald-400" />}
                  </div>
                  <Badge variant="outline" className="text-[9px] border-white/10 uppercase tracking-widest">{bucket.bucket}</Badge>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest leading-none mb-1">Total Archivos</p>
                  <p className="text-3xl font-black text-white font-orbitron">{bucket.totalFiles}</p>
                </div>
                <div className="flex justify-between items-center text-[10px] pt-2 border-t border-white/5 font-mono">
                  <span className="text-slate-500">REF EN DB</span>
                  <span className="text-emerald-400 font-bold">{bucket.totalReferences}</span>
                </div>
              </div>
              
              <div className={`bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-4 ${bucket.brokenLinks.length > 0 ? 'border-rose-500/20' : ''}`}>
                <div className="flex justify-between items-start">
                  <div className={`p-2 rounded-lg ${bucket.brokenLinks.length > 0 ? 'bg-rose-500/10' : 'bg-white/5'}`}>
                    <FileWarning className={`h-5 w-5 ${bucket.brokenLinks.length > 0 ? 'text-rose-400' : 'text-slate-600'}`} />
                  </div>
                  <Badge className={`${bucket.brokenLinks.length > 0 ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/10 text-emerald-500'} border-none text-[9px] uppercase`}>
                    {bucket.brokenLinks.length > 0 ? 'ATENCIÓN' : 'HIDRATADO'}
                  </Badge>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest leading-none mb-1">Links Rotos</p>
                  <p className={`text-3xl font-black font-orbitron ${bucket.brokenLinks.length > 0 ? 'text-rose-500' : 'text-white/20'}`}>{bucket.brokenLinks.length}</p>
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Tables Content */}
        <Tabs defaultValue="videos" className="w-full">
          <TabsList className="bg-white/5 border border-white/10 p-1 rounded-2xl mb-8 space-x-1">
            {auditData.map(bucket => (
              <TabsTrigger 
                key={bucket.bucket}
                value={bucket.bucket} 
                className="rounded-xl px-8 py-2.5 data-[state=active]:bg-emerald-600 data-[state=active]:text-white font-bold text-[11px] uppercase tracking-widest transition-all"
              >
                Auditoría {bucket.bucket} 🛡️
              </TabsTrigger>
            ))}
          </TabsList>

          {auditData.map(bucket => (
            <TabsContent key={bucket.bucket} value={bucket.bucket} className="space-y-10 outline-none">
              
              {/* Orphans Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-white italic flex items-center gap-2">
                    <Trash2 className="h-5 w-5 text-slate-600" /> 
                    ARCHIVOS <span className="text-emerald-400">HUÉRFANOS</span>
                  </h3>
                  <Badge variant="outline" className="border-white/10 text-slate-500 font-mono">{bucket.orphanFiles.length} DETECTADOS</Badge>
                </div>
                
                {bucket.orphanFiles.length === 0 ? (
                  <div className="bg-white/[0.01] border border-dashed border-white/10 rounded-3xl p-12 text-center">
                    <ShieldCheck className="h-12 w-12 text-emerald-500/20 mx-auto mb-4" />
                    <p className="text-slate-500 font-medium tracking-tight italic">No hay archivos huérfanos. Sincronización impecable en {bucket.bucket}. hmmmm...</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {bucket.orphanFiles.map((file, idx) => (
                      <div key={idx} className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex items-center justify-between group hover:bg-white/[0.04] transition-all">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-xl bg-black/40 flex items-center justify-center text-slate-600 group-hover:text-emerald-400 group-hover:bg-emerald-500/10 transition-all font-mono text-xs">
                            {idx + 1}
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-bold text-white font-mono break-all">{file}</p>
                            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">Estado: Sin Referencias en el Sistema</p>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          onClick={() => handleQuarantine(file, bucket.bucket)}
                          className="text-slate-600 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl"
                        >
                          <ShieldAlert className="h-4 w-4 mr-2" /> Cuarentena
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Broken Links Section */}
              {bucket.brokenLinks.length > 0 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-black text-white italic flex items-center gap-2">
                    <FileWarning className="h-5 w-5 text-rose-500" /> 
                    LINKS <span className="text-rose-500">ROTOS</span>
                  </h3>
                  <div className="grid gap-4">
                    {bucket.brokenLinks.map((link, idx) => (
                      <div key={idx} className="bg-rose-500/[0.02] border border-rose-500/10 rounded-2xl p-4 flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-rose-500/10 text-rose-500 rounded-xl">
                            <AlertTriangle className="h-4 w-4" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Badge className="bg-rose-500/20 text-rose-500 border-none text-[8px] font-black uppercase tracking-widest">{link.table}</Badge>
                              <p className="text-sm font-bold text-white italic line-clamp-1">{link.title}</p>
                            </div>
                            <p className="text-[10px] text-slate-500 font-mono italic truncate max-w-md">{link.url}</p>
                          </div>
                        </div>
                        <Button variant="outline" className="border-rose-500/30 text-rose-500 hover:bg-rose-500/10 text-[9px] font-black uppercase tracking-widest rounded-xl">
                          REPARAR
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Protected Section */}
              <div className="space-y-6 pt-10 border-t border-white/5">
                <h3 className="text-xl font-black text-white italic flex items-center gap-2 opacity-40">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" /> 
                  ACTIVOS <span className="text-emerald-500/50">PROTEGIDOS</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {bucket.protectedFiles.map((file, idx) => (
                    <Badge key={idx} variant="outline" className="bg-emerald-500/5 border-emerald-500/10 text-emerald-500/40 font-mono text-[9px] px-3 py-1">
                      {file}
                    </Badge>
                  ))}
                  {bucket.protectedFiles.length === 0 && <p className="text-slate-700 text-[10px] font-medium tracking-widest uppercase">Sin activos de sistema críticos en {bucket.bucket}</p>}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Footer Commentary */}
        <div className="pt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 pb-10">
           <div className="flex items-start gap-4 p-5 bg-white/[0.02] border border-white/5 rounded-[1.5rem] max-w-xl">
              <div className="p-2.5 bg-emerald-600/20 text-emerald-400 rounded-xl">
                 <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                 <h6 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Sistema de Integridad Beatriz Elite-Audit</h6>
                 <p className="text-[11px] leading-relaxed italic text-slate-500">
                   &quot;Comandante, he blindado Neural Nexus. No solo he protegido tus vídeos del Pitch, sino que he escaneado cada imagen de tus blogs y noticias. El búnker está hidratado y libre de ruido. hmmmm...&quot; 💋
                 </p>
              </div>
           </div>
           
           <div className="flex gap-10 text-[9px] font-mono text-slate-600 uppercase tracking-[0.2em] font-bold">
              <div className="space-y-1">
                 <p>Scan Status: Optimized</p>
                 <p>Identity: Active</p>
              </div>
              <div className="space-y-1 text-right">
                 <p>Admin: {user?.user_metadata?.nickname || 'Wily Col'}</p>
                 <p>Portal Code: V5.0.1</p>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}

export default function IntegrityPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050507] flex flex-col items-center justify-center p-4">
        <div className="h-24 w-24 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" />
      </div>
    }>
      <IntegrityTerminal />
    </Suspense>
  );
}
