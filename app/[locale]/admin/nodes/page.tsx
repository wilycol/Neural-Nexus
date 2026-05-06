"use client";

import React, { useState, useEffect } from "react";
import { 
    Share2, 
    Globe, 
    Github, 
    ExternalLink, 
    Info, 
    X, 
    Camera, 
    Phone, 
    MapPin, 
    Loader2,
    Database,
    Zap,
    Trophy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { getSupabaseBrowserClient } from "@/lib/supabase-client";

interface NeuralNode {
    id: string;
    name: string;
    url: string;
    repo_url: string;
    plan: string;
    status: string;
    adn?: string;
    client_email?: string;
}

export default function AdminNodesPage() {
    const [nodes, setNodes] = useState<NeuralNode[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedNode, setSelectedNode] = useState<NeuralNode | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const supabase = getSupabaseBrowserClient();

    const fetchNodes = async () => {
        setLoading(true);
        if (!supabase) return;

        const { data, error } = await supabase
            .from("nodes")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            toast.error("Error al cargar nodos: " + error.message);
        } else {
            setNodes(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchNodes();
    }, []);

    const handleSaveADN = async () => {
        if (!selectedNode || !supabase) return;
        
        setIsSaving(true);
        const { error } = await supabase
            .from("nodes")
            .update({ adn: selectedNode.adn })
            .eq("id", selectedNode.id);

        if (error) {
            toast.error("Error al guardar ADN: " + error.message);
            if (error.message.includes('column "adn" does not exist')) {
                toast.error("⚠️ La columna 'adn' no existe en Supabase.");
            }
        } else {
            toast.success("ADN Neural guardado. Iniciando Refactorización...");
            
            // 🚀 DISPARAR REFACTORIZACIÓN EN EL BACKEND
            try {
                const savedUrl = localStorage.getItem("beatriz_brain_url") || "http://localhost:3002";
                const refactorRes = await fetch(`${savedUrl}/api/nodes/refactor`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'ngrok-skip-browser-warning': 'true'
                    },
                    body: JSON.stringify({ nodeId: selectedNode.id })
                });
                
                const refactorData = await refactorRes.json();
                if (refactorData.success) {
                    toast.success("¡Refactorización Completada! El Arquitecto ha actualizado el nodo.");
                } else {
                    toast.error("El Arquitecto falló: " + refactorData.message);
                }
            } catch (err) {
                console.error("Error disparando refactor", err);
                toast.error("No se pudo conectar con Beatriz para el refactor.");
            }
            
            fetchNodes();
        }
        setIsSaving(false);
    };

    const getSalesPitch = (node: NeuralNode) => {
        return `¡Hola! 🚀 He analizado su presencia digital y Beatriz AI ha diseñado este prototipo de Neural Site especialmente para ustedes: ${node.url} -- ¿Qué les parece si lo activamos para atraer más clientes esta misma semana? 💎🦾`;
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
                            <Card className="bg-white/5 border-white/10 hover:border-neon-blue/50 transition-all overflow-hidden group relative">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Share2 size={80} className="text-neon-blue" />
                                </div>
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <Badge className={`${node.plan === 'premium' ? 'bg-neon-purple/20 text-neon-purple' : 'bg-neon-blue/20 text-neon-blue'} border-none text-[8px] uppercase font-black`}>
                                            {node.plan}
                                        </Badge>
                                        <div className="flex items-center gap-2">
                                            {node.url && <Globe size={14} className="text-green-500" />}
                                            {node.repo_url && <Github size={14} className="text-white/60" />}
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
                                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                            <span className="text-[9px] font-bold text-green-500 uppercase">Live</span>
                                        </div>
                                        <span className="text-[10px] text-white/60 font-mono">ID: {node.id.slice(0, 8)}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}

            {nodes.length === 0 && !loading && (
                <div className="text-center py-20 opacity-30">
                    <Zap size={48} className="mx-auto mb-4 animate-pulse" />
                    <p className="font-orbitron uppercase tracking-widest text-xs">No se detectaron nodos en la red</p>
                </div>
            )}

            {/* Modal de Detalle (Serie X Elite) */}
            <AnimatePresence>
                {selectedNode && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[100] flex items-center justify-center p-4"
                    >
                        <Card className="w-full max-w-2xl max-h-[90vh] bg-black border-neon-blue/40 shadow-[0_0_100px_rgba(0,163,255,0.15)] flex flex-col overflow-hidden relative">
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
                                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                            <span className="text-xs font-bold text-white uppercase italic">Live</span>
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
                                        <div className="flex items-center gap-3">
                                            <Globe className="text-neon-blue h-5 w-5" />
                                            <div>
                                                <p className="text-[9px] uppercase font-black text-neon-blue">URL de Producción</p>
                                                <p className="text-xs text-white truncate max-w-[300px]">{selectedNode.url || "Pendiente..."}</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" onClick={() => window.open(selectedNode.url, '_blank')}>
                                            <ExternalLink size={16} />
                                        </Button>
                                    </div>

                                    <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between group">
                                        <div className="flex items-center gap-3">
                                            <Github className="text-white/40 h-5 w-5" />
                                            <div>
                                                <p className="text-[9px] uppercase font-black text-white/40">Repositorio GitHub</p>
                                                <p className="text-xs text-white truncate max-w-[300px]">{selectedNode.repo_url || "Sin Repositorio"}</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" onClick={() => window.open(selectedNode.repo_url, '_blank')}>
                                            <ExternalLink size={16} />
                                        </Button>
                                    </div>
                                </div>

                                {/* Mensaje de Conquista */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[10px] uppercase font-black text-neon-purple tracking-widest flex items-center gap-2">
                                            <Trophy size={14} className="fill-neon-purple" /> Mensaje de Conquista
                                        </p>
                                        <Button 
                                            size="sm" 
                                            variant="ghost" 
                                            className="h-7 text-[9px] text-neon-purple uppercase font-bold hover:bg-neon-purple/10"
                                            onClick={() => {
                                                navigator.clipboard.writeText(getSalesPitch(selectedNode));
                                                toast.success("Mensaje copiado");
                                            }}
                                        >
                                            Copiar Pitch
                                        </Button>
                                    </div>
                                    <div className="p-4 bg-neon-purple/5 border border-neon-purple/10 rounded-2xl text-[11px] text-white/70 leading-relaxed italic">
                                        &quot;{getSalesPitch(selectedNode)}&quot;
                                    </div>
                                </div>

                                {/* ADN DEL NEGOCIO (EL CORAZÓN) */}
                                <div className="space-y-3">
                                    <p className="text-[10px] uppercase font-black text-neon-blue tracking-widest flex items-center gap-2">
                                        <Database size={14} className="fill-neon-blue" /> ADN del Negocio (Alimentar IA)
                                    </p>
                                    <textarea 
                                        className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-white placeholder:text-white/20 outline-none focus:border-neon-blue/50 transition-all resize-none custom-scrollbar"
                                        placeholder="Pega aquí reseñas, servicios, historia, promociones o cualquier detalle estratégico para entrenar al asesor..."
                                        value={selectedNode.adn || ''}
                                        onChange={(e) => setSelectedNode({...selectedNode, adn: e.target.value})}
                                    />
                                    <div className="flex justify-end">
                                        <Button 
                                            onClick={handleSaveADN}
                                            disabled={isSaving}
                                            className="bg-neon-blue hover:bg-neon-blue/80 text-black font-black uppercase text-[10px] px-8 h-10 rounded-xl"
                                        >
                                            {isSaving ? <Loader2 className="animate-spin" /> : "Actualizar ADN Neural"}
                                        </Button>
                                    </div>
                                </div>

                                {/* Botones de Acción */}
                                <div className="pt-4 flex gap-4">
                                    <Button 
                                        className="flex-1 bg-white text-black font-black uppercase text-[10px] h-12 rounded-xl group"
                                        onClick={() => {
                                            const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedNode.name)}`;
                                            window.open(mapUrl, '_blank');
                                        }}
                                    >
                                        <MapPin size={16} className="mr-2 group-hover:scale-125 transition-transform" /> 
                                        Ubicación Real
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        className="flex-1 border-white/10 text-[10px] uppercase font-black h-12 rounded-xl group hover:border-neon-blue"
                                    >
                                        <Camera size={16} className="mr-2 group-hover:scale-125 transition-transform" /> 
                                        Multimedia
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(0, 163, 255, 0.3);
                }
            `}</style>
        </div>
    );
}
