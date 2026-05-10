"use client";

import React, { useState, useEffect, useCallback } from "react";
import { 
    Share2, 
    Globe, 
    Github, 
    ExternalLink, 
    X, 
    MapPin, 
    Loader2,
    Database,
    Zap,
    Trophy,
    MessageSquare,
    Instagram,
    Facebook,
    Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { getSupabaseHiveClient } from "@/lib/supabase-hive-client";

interface NeuralNode {
    id: string;
    name: string;
    url: string;
    refactor_url?: string;
    repo_url: string;
    plan: string;
    status: string;
    adn?: string;
    client_email?: string;
    address?: string;
    whatsapp_number?: string;
    instagram_url?: string;
    facebook_url?: string;
    drive_path?: string;
    competitor_url?: string;
    neural_blueprint?: string;
    expires_at?: string;
    manual_notes?: string;
    construction_level?: number;
    findings_json?: {
        address?: string;
        [key: string]: unknown;
    };
}

export default function AdminNodesPage() {
    const [nodes, setNodes] = useState<NeuralNode[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedNode, setSelectedNode] = useState<NeuralNode | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [targetLevel, setTargetLevel] = useState(0);

    const searchParams = useSearchParams();
    const nodeIdFromUrl = searchParams.get('nodeId');

    // 🎯 Auto-selección por URL
    useEffect(() => {
        if (nodeIdFromUrl && nodes.length > 0) {
            const targetNode = nodes.find(n => n.id === nodeIdFromUrl);
            if (targetNode) {
                setSelectedNode(targetNode);
            }
        }
    }, [nodeIdFromUrl, nodes]);

    // 🧠 Sincronizar nivel al seleccionar nodo
    useEffect(() => {
        if (selectedNode) {
            setTargetLevel(selectedNode.construction_level || 0);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedNode?.id]); // Solo cuando cambia el nodo

    const supabase = getSupabaseHiveClient();

    const fetchNodes = useCallback(async () => {
        setLoading(true);
        if (!supabase) return;

        console.log("🛰️ Hive Client: Solicitando nodos a la Federación...");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabase as any).from("nodes").select("*");

        if (error) {
            toast.error("Error al cargar nodos: " + error.message);
        } else {
            setNodes(data || []);
            if (selectedNode) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const updated = data?.find((n: any) => n.id === selectedNode.id);
                if (updated) {
                    setSelectedNode(prev => prev ? updated : null);
                }
            }
        }
        setLoading(false);
    }, [supabase, selectedNode]);

    useEffect(() => {
        fetchNodes();
    }, [fetchNodes]);

    const handleSaveADN = async () => {
        if (!selectedNode || !supabase) return;
        setIsSaving(true);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
            .from("nodes")
            .update({ 
                adn: selectedNode.adn,
                manual_notes: selectedNode.manual_notes 
            })
            .eq("id", selectedNode.id);

        if (error) toast.error("Error al guardar: " + error.message);
        else {
            toast.success("Notas e Inteligencia guardadas con éxito.");
            fetchNodes();
        }
        setIsSaving(false);
    };

    const handleLaunchHunter = async (node: NeuralNode) => {
        toast.promise(
            fetch(`/api/bridge`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    endpoint: "/hunter/investigate",
                    businessId: node.id,
                    nodeId: node.id,
                    name: node.name
                })
            }).then(async (res) => {
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Fallo en el Bridge");
                return data;
            }),
            {
                loading: `🛰️ Hunter iniciando Apertura de Expediente para ${node.name.replace(/_/g, ' ')}...`,
                success: () => {
                    fetchNodes();
                    return `✅ Expediente y ADN actualizados.`;
                },
                error: (err) => `❌ Error: ${err.message}`,
            }
        );
    };

    const handleLaunchArchitect = (node: NeuralNode, mode: "preview" | "prod" = "preview") => {
        toast.promise(
            fetch(`/api/bridge`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    endpoint: "/api/nodes/refactor",
                    nodeId: node.id,
                    mode: mode,
                    targetLevel: targetLevel // 🚀 NIVEL ESTRATÉGICO SELECCIONADO
                })
            }).then(async (res) => {
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Fallo en el Architect");
                return data;
            }),
            {
                loading: `🏗️ Arquitecto iniciando Refactorización (${mode.toUpperCase()}) para ${node.name}...`,
                success: () => {
                    fetchNodes();
                    return `✅ Misión iniciada en rama ${mode === 'preview' ? 'DEV' : 'MAIN'}`;
                },
                error: (err) => `❌ Error: ${err.message}`,
            }
        );
    };

    const handleApproveRefactor = (node: NeuralNode) => {
        toast.promise(
            fetch(`/api/bridge`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    endpoint: "/api/nodes/approve",
                    nodeId: node.id
                })
            }).then(async (res) => {
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Fallo en la Fusión");
                return data;
            }),
            {
                loading: `🤝 Beatriz iniciando Fusión Maestra (Merge DEV -> MAIN) para ${node.name}...`,
                success: () => {
                    fetchNodes();
                    return '✅ ¡Sitio aprobado y actualizado en PRODUCCIÓN!';
                },
                error: (err) => `❌ Error: ${err.message}`,
            }
        );
    };

    const handleShareWhatsApp = (node: NeuralNode) => {
        const text = getSalesPitch(node);
        const phone = node.whatsapp_number ? node.whatsapp_number.replace(/\D/g, '') : "";
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    };

    const getDaysLeft = (dateStr?: string) => {
        if (!dateStr) return 0;
        const diff = new Date(dateStr).getTime() - new Date().getTime();
        return Math.max(0, Math.ceil(diff / (1000 * 3600 * 24)));
    };

    const handleRegeneratePitch = async (node: NeuralNode) => {
        setIsSaving(true);
        toast.info("💋 Beatriz está redactando un nuevo mensaje de seducción...");
        try {
            const savedUrl = localStorage.getItem("beatriz_brain_url") || "http://localhost:3002";
            const res = await fetch(`${savedUrl}/api/nodes/generate-pitch`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    nodeId: node.id,
                    businessName: node.name,
                    adn: node.adn,
                    daysLeft: getDaysLeft(node.expires_at)
                })
            });
            const data = await res.json();
            if (data.success) {
                toast.success("¡Mensaje de Seducción actualizado!");
                fetchNodes();
            }
        } catch {
            toast.error("Fallo al conectar con el Seductor.");
        }
        setIsSaving(false);
    };

    const getSalesPitch = (node: NeuralNode) => {
        const days = getDaysLeft(node.expires_at);
        return `¡Hola! 🚀 He analizado el potencial de su negocio y Beatriz AI ha diseñado una propuesta de dominancia digital para ustedes. Vean su prototipo aquí: ${node.url} -- Le quedan solo ${days} días de su período de prueba exclusivo. Nuestra Federación Neural puede automatizar su crecimiento y captar clientes en piloto automático. ¿Hablamos de cómo llevarlos al siguiente nivel antes de que expire su acceso? 💎🦾`;
    };

    return (
        <div className="min-h-screen bg-background text-white p-4 pb-20 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-black font-orbitron text-neon-blue uppercase tracking-tighter">
                        Neural <span className="text-white">Nodes</span>
                    </h1>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest font-mono">
                        Federación Neural Hive • Gestión de Nodos Serie X
                    </p>
                </div>
                <Badge variant="outline" className="border-neon-blue/30 text-neon-blue bg-neon-blue/10">
                    {nodes.length} Nodos Activos
                </Badge>
            </div>

            {/* Lista de Nodos */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-neon-blue h-12 w-12" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {nodes.map((node) => (
                        <motion.div
                            key={node.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => setSelectedNode(node)}
                            className="cursor-pointer"
                        >
                            <Card className={`bg-white/5 border-white/10 ${node.refactor_url ? 'border-neon-purple/50 shadow-[0_0_20px_rgba(191,0,255,0.1)]' : 'hover:border-neon-blue/50'} transition-all overflow-hidden group relative`}>
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Share2 size={80} className="text-neon-blue" />
                                </div>
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <Badge className={`${node.plan === 'premium' ? 'bg-neon-purple/20 text-neon-purple' : 'bg-neon-blue/20 text-neon-blue'} border-none text-[8px] uppercase font-black`}>
                                            {node.plan}
                                        </Badge>
                                        <div className="flex items-center gap-2">
                                            {node.refactor_url && <Zap size={14} className="text-neon-purple animate-pulse" />}
                                            {node.url && <Globe size={14} className="text-green-500" />}
                                        </div>
                                    </div>
                                    <CardTitle className="text-lg font-orbitron uppercase tracking-tighter mt-2 truncate">
                                        {node.name.replace(/_/g, ' ')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-[10px] text-white/40 truncate mb-4">{node.url || "Sin URL de despliegue"}</p>
                                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                        <div className="flex items-center gap-1">
                                            <div className={`w-1.5 h-1.5 ${node.status === 'refactoring' ? 'bg-neon-purple' : 'bg-green-500'} rounded-full animate-pulse`} />
                                            <span className={`text-[9px] font-bold ${node.status === 'refactoring' ? 'text-neon-purple' : 'text-green-500'} uppercase`}>
                                                {node.status}
                                            </span>
                                        </div>
                                        <span className="text-[10px] text-white/60 font-mono">ID: {node.id.slice(0, 8)}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Modal de Detalle (Serie X Elite) */}
            <AnimatePresence>
                {selectedNode && (
                    <motion.div 
                        key="modal-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedNode(null)}
                        className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[100] flex items-center justify-center p-4"
                    >
                        <Card 
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-2xl max-h-[90vh] bg-black border-neon-blue/40 shadow-[0_0_100px_rgba(0,163,255,0.15)] flex flex-col overflow-hidden relative"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-blue" />
                            
                            <CardHeader className="border-b border-white/5 shrink-0">
                                <div className="flex justify-between items-start">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 bg-neon-blue/10 rounded-xl flex items-center justify-center border border-neon-blue/20">
                                            <Share2 className="text-neon-blue" size={24} />
                                        </div>
                                        <div>
                                            <CardTitle className="font-orbitron text-xl text-white uppercase tracking-tighter">
                                                {selectedNode.name.replace(/_/g, ' ')}
                                            </CardTitle>
                                            <CardDescription className="text-[10px] text-white/40 uppercase tracking-widest">
                                                Expediente de Inteligencia • Serie X Elite
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="hover:bg-white/5" onClick={() => setSelectedNode(null)}>
                                        <X size={20} />
                                    </Button>
                                </div>
                            </CardHeader>

                            <CardContent className="p-6 space-y-8 overflow-y-auto flex-1 custom-scrollbar">
                                {/* Info Rápida */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-center">
                                        <p className="text-[8px] text-white/40 uppercase font-black mb-1">Plan</p>
                                        <p className="text-xs font-bold text-neon-purple uppercase italic">{selectedNode.plan}</p>
                                    </div>
                                    <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-center">
                                        <p className="text-[8px] text-white/40 uppercase font-black mb-1">Estado</p>
                                        <div className="flex items-center justify-center gap-1">
                                            <div className={`w-1.5 h-1.5 ${selectedNode.status === 'live' ? 'bg-green-500' : 'bg-neon-purple'} rounded-full animate-pulse`} />
                                            <span className={`text-xs font-bold ${selectedNode.status === 'live' ? 'text-white' : 'text-neon-purple'} uppercase italic`}>
                                                {selectedNode.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-center col-span-2">
                                        <p className="text-[8px] text-white/40 uppercase font-black mb-1">ID Federado</p>
                                        <p className="text-xs font-mono text-white/60 truncate px-2">{selectedNode.id}</p>
                                    </div>
                                </div>

                                {/* Enlaces Industriales */}
                                <div className="space-y-4">
                                    <div className="p-4 bg-neon-blue/5 border border-neon-blue/20 rounded-2xl flex items-center justify-between group">
                                        <div className="flex-1 min-w-0 mr-2">
                                            <div className="flex items-center gap-3">
                                                <Globe className="text-neon-blue h-5 w-5 shrink-0" />
                                                <div className="min-w-0">
                                                    <p className="text-[9px] uppercase font-black text-neon-blue">URL de Producción</p>
                                                    <p className="text-[11px] text-white break-all leading-tight">{selectedNode.url || "Pendiente..."}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" className="shrink-0" onClick={() => window.open(selectedNode.url, '_blank')}>
                                            <ExternalLink size={16} />
                                        </Button>
                                    </div>

                                    {/* 🧪 LABORATORIO DE REFACCIÓN (DEV) */}
                                    {selectedNode.refactor_url && (
                                        <div className="p-4 bg-neon-purple/5 border border-neon-purple/40 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 group animate-in fade-in zoom-in duration-500">
                                            <div className="flex-1 min-w-0 w-full">
                                                <div className="flex items-center gap-3">
                                                    <Zap className="text-neon-purple h-5 w-5 shrink-0 animate-pulse" />
                                                    <div className="min-w-0">
                                                        <p className="text-[9px] uppercase font-black text-neon-purple">Refactorización Neural (Laboratorio DEV)</p>
                                                        <p className="text-[11px] text-white break-all leading-tight">{selectedNode.refactor_url}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 w-full sm:w-auto shrink-0">
                                                <Button 
                                                    className="flex-1 sm:flex-none bg-neon-purple hover:bg-neon-purple/80 text-white font-black uppercase text-[10px] px-4 h-8 rounded-lg"
                                                    onClick={() => handleApproveRefactor(selectedNode)}
                                                >
                                                    Aprobar Merge
                                                </Button>
                                                <Button variant="ghost" size="icon" className="shrink-0" onClick={() => window.open(selectedNode.refactor_url, '_blank')}>
                                                    <ExternalLink size={16} className="text-neon-purple" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between group">
                                        <div className="flex-1 min-w-0 mr-2">
                                            <div className="flex items-center gap-3">
                                                <Github className="text-white/40 h-5 w-5 shrink-0" />
                                                <div className="min-w-0">
                                                    <p className="text-[9px] uppercase font-black text-white/40">Repositorio GitHub</p>
                                                    <p className="text-[11px] text-white break-all leading-tight">{selectedNode.repo_url || "Sin Repositorio"}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" className="shrink-0" onClick={() => window.open(selectedNode.repo_url, '_blank')}>
                                            <ExternalLink size={16} />
                                        </Button>
                                    </div>

                                    {/* Dirección y Contacto */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-2">
                                            <p className="text-[9px] uppercase font-black text-white/40 flex items-center gap-1">
                                                <MapPin size={10} /> Ubicación del Negocio
                                            </p>
                                            <p className="text-[11px] text-white leading-tight">
                                                {selectedNode.address || "Dirección no registrada"}
                                            </p>
                                        </div>
                                        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-3">
                                            <p className="text-[9px] uppercase font-black text-white/40 flex items-center gap-1">
                                                <MessageSquare size={10} /> Canales de Contacto
                                            </p>
                                            <div className="flex gap-4">
                                                {selectedNode.whatsapp_number && (
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-green-500 hover:bg-green-500/10" onClick={() => window.open(`https://wa.me/${selectedNode.whatsapp_number!.replace(/\D/g, '')}`, '_blank')}>
                                                        <MessageSquare size={18} />
                                                    </Button>
                                                )}
                                                {selectedNode.instagram_url && (
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-pink-500 hover:bg-pink-500/10" onClick={() => window.open(selectedNode.instagram_url!, '_blank')}>
                                                        <Instagram size={18} />
                                                    </Button>
                                                )}
                                                {selectedNode.facebook_url && (
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:bg-blue-500/10" onClick={() => window.open(selectedNode.facebook_url!, '_blank')}>
                                                        <Facebook size={18} />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Mensaje de Conquista */}
                                {selectedNode.plan?.toLowerCase() === 'free' && (
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <p className="text-[10px] uppercase font-black text-neon-purple tracking-widest flex items-center gap-2">
                                                <Trophy size={14} className="fill-neon-purple" /> Mensaje de Conquista
                                            </p>
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="ghost" className="h-7 text-[9px] text-white/40 uppercase font-bold" onClick={() => handleRegeneratePitch(selectedNode)}>
                                                    <Zap size={12} className="mr-1" /> Regenerar Seducción
                                                </Button>
                                                <Button size="sm" variant="ghost" className="h-7 text-[9px] text-neon-purple uppercase font-bold" onClick={() => handleShareWhatsApp(selectedNode)}>
                                                    <MessageSquare size={12} className="mr-1" /> Compartir Pitch
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="p-4 bg-neon-purple/5 border border-neon-purple/10 rounded-2xl text-[11px] text-white/70 leading-relaxed italic">
                                            &quot;{getSalesPitch(selectedNode)}&quot;
                                        </div>
                                    </div>
                                )}

                                {/* INTELIGENCIA RECOPILADA (ADN) */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[10px] uppercase font-black text-neon-blue tracking-widest flex items-center gap-2">
                                            <Database size={14} className="fill-neon-blue" /> Inteligencia Recopilada (ADN)
                                        </p>
                                        {selectedNode.findings_json?.address && (
                                            <a 
                                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedNode.findings_json.address)}`} 
                                                target="_blank" 
                                                className="flex items-center gap-1.5 px-3 py-1 bg-neon-blue/10 border border-neon-blue/30 rounded-lg hover:bg-neon-blue/20 transition-all text-[9px] font-black uppercase tracking-widest text-neon-blue"
                                            >
                                                <MapPin size={12} /> Google Maps
                                            </a>
                                        )}
                                    </div>
                                    <div className="p-4 bg-neon-blue/5 border border-neon-blue/10 rounded-2xl">
                                        <div className="text-[11px] text-white/80 leading-relaxed whitespace-pre-wrap break-all">
                                            {selectedNode.adn || "Sin datos OSINT profundos."}
                                        </div>
                                    </div>
                                </div>

                                {/* 🏗️ ORQUESTACIÓN POR NIVELES (SERIE X) */}
                                <div className="space-y-4 p-4 bg-white/5 border border-white/10 rounded-2xl">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-[10px] uppercase font-black text-white/40 tracking-widest flex items-center gap-2">
                                            <Layers size={14} /> Pipeline de Construcción
                                        </p>
                                        <Badge className="bg-neon-blue/20 text-neon-blue border-neon-blue/30 text-[9px]">
                                            Nivel Actual: {selectedNode.construction_level || 0}
                                        </Badge>
                                    </div>
                                    
                                    <div className="flex items-center justify-between gap-2">
                                        {[0, 1, 2, 3, 4, 5, 6].map((level) => {
                                            const currentLevel = selectedNode.construction_level || 0;
                                            const isCompleted = level < currentLevel;
                                            const isCurrent = level === currentLevel;
                                            const isNext = level === currentLevel + 1;
                                            const isSelectable = isCurrent || isNext;
                                            const isSelected = targetLevel === level;

                                            return (
                                                <button
                                                    key={level}
                                                    disabled={!isSelectable}
                                                    onClick={() => setTargetLevel(level)}
                                                    className={`flex-1 h-10 rounded-xl border transition-all flex flex-col items-center justify-center gap-0.5 relative ${
                                                        isSelected 
                                                            ? 'bg-neon-purple/40 border-neon-purple shadow-[0_0_20px_rgba(191,0,255,0.4)] z-10 scale-105' 
                                                            : isCompleted
                                                                ? 'bg-green-500/10 border-green-500/30'
                                                                : isNext
                                                                    ? 'bg-white/10 border-white/20 hover:border-neon-blue/50'
                                                                    : 'bg-white/5 border-white/5 opacity-20 cursor-not-allowed'
                                                    }`}
                                                >
                                                    {isCompleted && (
                                                        <div className="absolute -top-1 -right-1">
                                                            <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_5px_rgba(34,197,94,0.8)]" />
                                                        </div>
                                                    )}
                                                    <span className={`text-xs font-black ${isSelected || isCompleted ? 'text-white' : 'text-white/40'}`}>
                                                        {level}
                                                    </span>
                                                    <span className="text-[6px] font-black uppercase tracking-tighter opacity-50">
                                                        {level === 0 ? 'PLAN' : `LVL ${level}`}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        <p className="text-[9px] text-white/30 italic text-center leading-tight">
                                            {targetLevel === selectedNode.construction_level 
                                                ? `🔄 Refactorización: El Arquitecto repetirá el Nivel ${targetLevel} para pulir el resultado anterior.` 
                                                : targetLevel === (selectedNode.construction_level || 0) + 1
                                                    ? `🚀 Expansión: El Arquitecto avanzará hacia los objetivos del Nivel ${targetLevel}.`
                                                    : "Pipeline en espera de comando estratégico."}
                                        </p>
                                        <p className="text-[8px] font-bold text-neon-blue/50 uppercase tracking-[0.2em]">
                                            {targetLevel > (selectedNode.construction_level || 0) ? "Modo: Construcción" : "Modo: Refactorización"}
                                        </p>
                                    </div>
                                </div>

                                {/* OPERACIONES DE CAMPO (AGENTES) */}
                                <div className="grid grid-cols-2 gap-3">
                                    <Button 
                                        variant="outline" 
                                        className="border-neon-blue/20 text-neon-blue text-[9px] uppercase font-black h-10 rounded-xl hover:bg-neon-blue/10 flex items-center justify-center gap-2"
                                        onClick={() => handleLaunchHunter(selectedNode)}
                                    >
                                        <Zap size={14} /> Sincronizar Hunter
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        className="border-neon-purple/20 text-neon-purple text-[9px] uppercase font-black h-10 rounded-xl hover:bg-neon-purple/10 flex items-center justify-center gap-2"
                                        onClick={() => handleLaunchArchitect(selectedNode, "preview")}
                                    >
                                        <Zap size={14} /> Refactorizar (DEV)
                                    </Button>
                                </div>

                                {/* ADN DEL NEGOCIO */}
                                <div className="space-y-3">
                                    <p className="text-[10px] uppercase font-black text-white/40 tracking-widest flex items-center gap-2">
                                        <MessageSquare size={14} /> Alimentar IA (Notas Manuales)
                                    </p>
                                    <textarea 
                                        className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-white placeholder:text-white/20 outline-none focus:border-neon-blue/50 transition-all resize-none custom-scrollbar"
                                        value={selectedNode.manual_notes || ''}
                                        onChange={(e) => setSelectedNode({...selectedNode, manual_notes: e.target.value})}
                                    />
                                    <div className="flex justify-end gap-3">
                                        {(() => {
                                            let mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedNode.name + " " + (selectedNode.address || ""))}`;
                                            try {
                                                const adn = JSON.parse(selectedNode.adn || "{}");
                                                if (adn.location && adn.location.latitude) {
                                                    mapUrl = `https://www.google.com/maps/search/?api=1&query=${adn.location.latitude},${adn.location.longitude}`;
                                                }
                                            } catch (e) { console.error("ADN Parse error", e); }
                                            
                                            return (
                                                <Button 
                                                    variant="outline"
                                                    className="border-neon-blue/20 text-neon-blue font-black uppercase text-[10px] px-6 h-10 rounded-xl hover:bg-neon-blue/10 flex items-center gap-2"
                                                    onClick={() => window.open(mapUrl, '_blank')}
                                                >
                                                    <MapPin size={14} /> Google Maps
                                                </Button>
                                            );
                                        })()}
                                        <Button onClick={handleSaveADN} disabled={isSaving} className="bg-neon-blue text-black font-black uppercase text-[10px] px-8 h-10 rounded-xl">
                                            {isSaving ? <Loader2 className="animate-spin" /> : "Actualizar Notas e IA"}
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0, 163, 255, 0.3); }
            `}</style>
        </div>
    );
}
