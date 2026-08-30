"use client";

import React, { useState, useEffect, useCallback } from "react";
import { 
    MessageCircle, Users, XCircle, Clock, Search, Send, FileText, History
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface Lead {
    id: number;
    nombre: string;
    whatsapp: string;
    estado_envio: string;
    nivel_clasificacion: string;
    nicho: string;
    ciudad: string;
}

interface ChatMessage {
    id: number;
    sender_id: string;
    sender_name: string;
    content: string;
    created_at: string;
}

interface SeductorOpsProps {
    backendUrl: string;
}

export function SeductorOps({ backendUrl }: SeductorOpsProps) {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [selectedLeads, setSelectedLeads] = useState<number[]>([]);
    const [templates, setTemplates] = useState<{name: string, language: string}[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    
    // Audit Modal State
    const [auditLead, setAuditLead] = useState<Lead | null>(null);
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);

    // Filtrar leads según la búsqueda en caliente (nombre, whatsapp, nicho, ciudad)
    const filteredLeads = leads.filter(lead => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) return true;
        return (
            (lead.nombre?.toLowerCase() || "").includes(query) ||
            (lead.whatsapp?.toLowerCase() || "").includes(query) ||
            (lead.nicho?.toLowerCase() || "").includes(query) ||
            (lead.ciudad?.toLowerCase() || "").includes(query)
        );
    });

    const fetchLeads = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/proxy?backendUrl=${encodeURIComponent(backendUrl)}&path=/api/leads`, {
                headers: { 'ngrok-skip-browser-warning': 'true' }
            });
            const data = await res.json();
            if (data.success) {
                // Solo mostrar leads con WhatsApp
                setLeads(data.data.filter((l: Lead) => l.whatsapp));
            }
        } catch (e) {
            console.error(e);
            toast.error("Error cargando leads");
        } finally {
            setIsLoading(false);
        }
    }, [backendUrl]);

    const fetchTemplates = useCallback(async () => {
        try {
            const res = await fetch(`/api/proxy?backendUrl=${encodeURIComponent(backendUrl)}&path=/api/leads/templates`, {
                headers: { 'ngrok-skip-browser-warning': 'true' }
            });
            const data = await res.json();
            if (data.success && data.data) {
                setTemplates(data.data);
            }
        } catch (e) {
            console.error(e);
        }
    }, [backendUrl]);

    useEffect(() => {
        fetchLeads();
        fetchTemplates();
    }, [fetchLeads, fetchTemplates]);

    const toggleLeadSelection = (id: number) => {
        if (selectedLeads.includes(id)) {
            setSelectedLeads(prev => prev.filter(lId => lId !== id));
        } else {
            setSelectedLeads(prev => [...prev, id]);
        }
    };

    const selectAll = () => {
        if (selectedLeads.length === leads.length) {
            setSelectedLeads([]);
        } else {
            setSelectedLeads(leads.map(l => l.id));
        }
    };

    const launchCampaign = async () => {
        if (selectedLeads.length === 0) return toast.error("Selecciona al menos un prospecto");
        if (!selectedTemplate) return toast.error("Selecciona una plantilla");

        setIsSending(true);
        toast.info(`Iniciando campaña masiva a ${selectedLeads.length} leads...`);

        try {
            const res = await fetch(`/api/proxy?backendUrl=${encodeURIComponent(backendUrl)}&path=/api/leads/campaign`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                },
                body: JSON.stringify({
                    leadIds: selectedLeads,
                    templateName: selectedTemplate
                })
            });
            
            const data = await res.json();
            if (data.success) {
                toast.success(`Campaña finalizada. Revisa los estados.`);
                setSelectedLeads([]);
                fetchLeads(); // Recargar para ver los estados "Enviado" o "Número Inválido"
            } else {
                toast.error(`Error: ${data.error}`);
            }
        } catch (e) {
            console.error(e);
            toast.error("Error de red al lanzar campaña");
        } finally {
            setIsSending(false);
        }
    };

    const openAudit = async (lead: Lead) => {
        setAuditLead(lead);
        setIsLoadingHistory(true);
        try {
            const res = await fetch(`/api/proxy?backendUrl=${encodeURIComponent(backendUrl)}&path=/api/leads/history/${encodeURIComponent(lead.whatsapp)}`, {
                headers: { 'ngrok-skip-browser-warning': 'true' }
            });
            const data = await res.json();
            if (data.success) {
                setChatHistory(data.data || []);
            } else {
                setChatHistory([]);
            }
        } catch (e) {
            console.error(e);
            toast.error("Error cargando historial de chat");
        } finally {
            setIsLoadingHistory(false);
        }
    };

    const updateLeadStatus = async (leadId: number, newState: string, newLevel: string) => {
        try {
            const res = await fetch(`/api/proxy?backendUrl=${encodeURIComponent(backendUrl)}&path=/api/leads/${leadId}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                },
                body: JSON.stringify({ estado_envio: newState, nivel_clasificacion: newLevel })
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Estado actualizado manualmente");
                setAuditLead(null);
                fetchLeads();
            } else {
                toast.error("Error al actualizar estado");
            }
        } catch {
            toast.error("Error de conexión");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-orbitron font-black text-neon-purple flex items-center gap-2">
                        <MessageCircle size={24} /> OPERACIONES SEDUCTOR
                    </h2>
                    <p className="text-xs text-white/50 font-mono mt-1">Seducción industrial automatizada por WhatsApp Cloud</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-none sm:w-64">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Buscar negocio, número o nicho..."
                            className="w-full bg-black/40 border border-white/10 rounded-lg pl-9 pr-4 py-1.5 text-xs text-white placeholder-white/30 outline-none focus:border-neon-purple/50 font-mono"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                            >
                                <XCircle size={12} />
                            </button>
                        )}
                    </div>
                    <Button 
                        onClick={fetchLeads} 
                        variant="outline" 
                        size="sm"
                        className="border-neon-purple/30 text-neon-purple hover:bg-neon-purple/10 text-[10px] font-orbitron py-2 h-auto"
                    >
                        <History size={14} className="mr-2"/> Refrescar Base
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* PANEL IZQUIERDO: CONFIGURACIÓN DE CAMPAÑA */}
                <Card className="bg-black/40 border-neon-purple/20 backdrop-blur-md lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-sm uppercase font-orbitron text-white/80">Lanzamiento de Campaña</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-bold text-white/40 flex items-center gap-2">
                                <FileText size={12}/> Plantilla Aprobada (Meta)
                            </label>
                            <select 
                                value={selectedTemplate}
                                onChange={(e) => setSelectedTemplate(e.target.value)}
                                className="w-full bg-[#0a0518] text-white border border-neon-purple/30 rounded px-3 py-2 text-xs font-mono outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple"
                            >
                                <option value="" className="bg-[#0a0518] text-white/50">-- Seleccionar Plantilla --</option>
                                {templates.map((t, i) => (
                                    <option key={i} value={t.name} className="bg-[#0a0518] text-white hover:bg-neon-purple/20">
                                        {t.name} ({t.language || 'es'})
                                    </option>
                                ))}
                            </select>
                            <p className="text-[9px] text-white/30 italic">Variable {'{{1}}'} será reemplazada por el nombre del negocio automáticamente.</p>
                        </div>

                        <div className="bg-neon-purple/10 border border-neon-purple/20 rounded p-3 text-center space-y-2 mt-6">
                            <p className="text-xl font-black text-white">{selectedLeads.length}</p>
                            <p className="text-[10px] uppercase tracking-widest text-white/50">Prospectos Seleccionados</p>
                        </div>

                        <Button 
                            className="w-full bg-neon-purple hover:bg-neon-purple/80 text-white font-black uppercase text-xs"
                            disabled={isSending || selectedLeads.length === 0 || !selectedTemplate}
                            onClick={launchCampaign}
                        >
                            {isSending ? (
                                <><Clock className="mr-2 animate-spin" size={16}/> Seduciendo...</>
                            ) : (
                                <><Send className="mr-2" size={16}/> Disparar Seductor</>
                            )}
                        </Button>
                    </CardContent>
                </Card>

                {/* PANEL DERECHO: BASE DE DATOS DE LEADS */}
                <Card className="bg-black/40 border-white/10 backdrop-blur-md lg:col-span-2 overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm uppercase font-orbitron text-white/80 flex items-center gap-2">
                            <Users size={16}/> Base de Operaciones ({searchQuery ? `${filteredLeads.length} de ${leads.length}` : leads.length})
                        </CardTitle>
                        <Button variant="ghost" size="sm" onClick={selectAll} className="text-[10px] text-white/50 hover:text-white">
                            Seleccionar Todos
                        </Button>
                    </CardHeader>
                    <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-white/5 sticky top-0 z-10">
                                <tr>
                                    <th className="p-3 font-mono text-white/40 w-10 text-center">Sel</th>
                                    <th className="p-3 font-mono text-white/40">Negocio</th>
                                    <th className="p-3 font-mono text-white/40">WhatsApp</th>
                                    <th className="p-3 font-mono text-white/40">Estado Envío</th>
                                    <th className="p-3 font-mono text-white/40">Clasificación</th>
                                    <th className="p-3 font-mono text-white/40 text-right">Auditar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLeads.map((lead) => (
                                    <tr key={lead.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="p-3 text-center">
                                            <input 
                                                type="checkbox" 
                                                checked={selectedLeads.includes(lead.id)}
                                                onChange={() => toggleLeadSelection(lead.id)}
                                                className="accent-neon-purple w-4 h-4 cursor-pointer"
                                            />
                                        </td>
                                        <td className="p-3 font-bold text-white/80">{lead.nombre}</td>
                                        <td className="p-3 font-mono text-white/60">{lead.whatsapp}</td>
                                        <td className="p-3">
                                            <Badge variant="outline" className={`text-[9px] ${
                                                lead.estado_envio.includes('Enviado') ? 'border-green-500/50 text-green-400' :
                                                lead.estado_envio.includes('Inválido') || lead.estado_envio.includes('Error') ? 'border-red-500/50 text-red-400' :
                                                lead.estado_envio.includes('Respondió') ? 'border-blue-500/50 text-blue-400' :
                                                lead.estado_envio.includes('Esperando') ? 'border-yellow-500/50 text-yellow-400' :
                                                'border-white/20 text-white/40'
                                            }`}>
                                                {lead.estado_envio}
                                            </Badge>
                                        </td>
                                        <td className="p-3">
                                            <Badge variant="outline" className={`text-[9px] ${
                                                lead.nivel_clasificacion === 'Hot Lead' ? 'bg-orange-500/20 border-orange-500/50 text-orange-400' :
                                                lead.nivel_clasificacion === 'Rechazado' ? 'bg-red-500/20 border-red-500/50 text-red-400' :
                                                'border-white/20 text-white/40'
                                            }`}>
                                                {lead.nivel_clasificacion}
                                            </Badge>
                                        </td>
                                        <td className="p-3 text-right">
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                className="text-white/40 hover:text-neon-purple"
                                                onClick={() => openAudit(lead)}
                                            >
                                                <Search size={14}/>
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {leads.length === 0 && !isLoading && (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-white/30 font-mono text-sm">
                                            No hay leads con WhatsApp en la base de datos. Usa el Hunter para atrapar algunos.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

            {/* MODAL DE AUDITORÍA */}
            <AnimatePresence>
                {auditLead && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    >
                        <motion.div 
                            initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
                            className="bg-[#0f172a] border border-white/10 rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-[0_0_50px_rgba(191,0,255,0.1)] overflow-hidden"
                        >
                            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/40">
                                <div>
                                    <h3 className="font-bold text-white flex items-center gap-2">
                                        <MessageCircle size={16} className="text-neon-purple"/>
                                        Auditoría Seductor: {auditLead.nombre}
                                    </h3>
                                    <p className="text-xs text-white/50 font-mono">{auditLead.whatsapp}</p>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setAuditLead(null)} className="text-white/50 hover:text-white">
                                    <XCircle size={20}/>
                                </Button>
                            </div>

                            <div className="p-4 flex-1 overflow-y-auto space-y-4 bg-black/20" style={{ backgroundImage: "radial-gradient(circle at center, rgba(191,0,255,0.05) 0%, transparent 70%)" }}>
                                {isLoadingHistory ? (
                                    <div className="flex justify-center p-8"><Clock className="animate-spin text-white/30" /></div>
                                ) : chatHistory.length === 0 ? (
                                    <div className="text-center p-8 text-white/30 font-mono text-xs">No hay historial de conversación registrado.</div>
                                ) : (
                                    chatHistory.map((msg, i) => {
                                        const isFallbackMsg = msg.content?.includes("Mientras mi equipo estratégico procesa") || msg.content?.includes("video exclusivo de 2 minutos");
                                        const isApiErrorMsg = msg.content?.includes("Error de Inteligencia");
                                        
                                        return (
                                            <div key={i} className={`flex flex-col ${msg.sender_id === 'CLIENT' ? 'items-start' : 'items-end'}`}>
                                                <div className={`max-w-[80%] rounded-xl p-3 text-sm ${
                                                    msg.sender_id === 'CLIENT' 
                                                    ? 'bg-white/10 text-white rounded-tl-sm' 
                                                    : isFallbackMsg
                                                    ? 'bg-amber-500/10 border border-amber-500/30 text-amber-200 rounded-tr-sm'
                                                    : isApiErrorMsg
                                                    ? 'bg-red-500/10 border border-red-500/30 text-red-300 rounded-tr-sm'
                                                    : 'bg-neon-purple/20 border border-neon-purple/30 text-white rounded-tr-sm'
                                                }`}>
                                                    {isFallbackMsg && (
                                                        <div className="flex items-center gap-1 text-[9px] uppercase font-bold text-amber-400 mb-1 font-mono">
                                                            <span>🎬 DEMO EN VIDEO ENVIADA (ESPERA REFRESCO API)</span>
                                                        </div>
                                                    )}
                                                    {msg.content}
                                                </div>
                                                <span className="text-[9px] text-white/30 mt-1 font-mono">
                                                    {msg.sender_id === 'CLIENT' ? 'Cliente' : 'Seductor (IA)'} • {new Date(msg.created_at).toLocaleString()}
                                                </span>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            <div className="p-4 bg-black/60 border-t border-white/10 flex flex-col gap-3">
                                <p className="text-[10px] uppercase font-bold text-white/40 text-center">Clasificación Manual (Sobreescribir)</p>
                                <div className="flex justify-center gap-2">
                                    <Button size="sm" onClick={() => updateLeadStatus(auditLead.id, 'Interesado - En Progreso', 'Hot Lead')} className="bg-orange-500/20 text-orange-400 hover:bg-orange-500/40 border border-orange-500/50 text-[10px] uppercase">
                                        🔥 Marcar Hot Lead
                                    </Button>
                                    <Button size="sm" onClick={() => updateLeadStatus(auditLead.id, 'Requiere Seguimiento', 'Enfriado')} className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/40 border border-blue-500/50 text-[10px] uppercase">
                                        ❄️ Marcar Cold
                                    </Button>
                                    <Button size="sm" onClick={() => updateLeadStatus(auditLead.id, 'Rechazado Manual', 'Rechazado')} className="bg-red-500/20 text-red-400 hover:bg-red-500/40 border border-red-500/50 text-[10px] uppercase">
                                        ❌ Marcar Rechazado
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
