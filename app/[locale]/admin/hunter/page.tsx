"use client";

import React, { useState, useEffect, useCallback } from "react";
import { 
    MapPin, 
    Radar, 
    Zap, 
    Store, 
    AlertCircle, 
    Camera, 
    Loader2,
    Terminal,
    Settings,
    CheckCircle2,
    HardHat
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface Business {
    id: string;
    name: string;
    address: string;
    rating: number;
    opportunityScore: number;
    location: { lat: number; lng: number };
}

export default function AdminHunterPage() {
    const [backendUrl, setBackendUrl] = useState("http://localhost:3002");
    const [showConfig, setShowConfig] = useState(false);
    const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
    const [isOnboarding, setIsOnboarding] = useState(false);
    const [telemetry, setTelemetry] = useState<string[]>([]);
    const [isApproved, setIsApproved] = useState(false);

    useEffect(() => {
        const savedUrl = localStorage.getItem("beatriz_backend_url");
        if (savedUrl) setBackendUrl(savedUrl);
    }, []);

    // 📡 Polling de Telemetría
    const fetchLogs = useCallback(async () => {
        try {
            const res = await fetch(`${backendUrl}/hunter/logs`, {
                headers: { "ngrok-skip-browser-warning": "true" }
            });
            const data = await res.json();
            if (data.logs) {
                setTelemetry(data.logs);
            }
        } catch (err) {
            console.error("Error fetching logs", err);
        }
    }, [backendUrl]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isScanning || businesses.length > 0) {
            interval = setInterval(fetchLogs, 2000);
        }
        return () => clearInterval(interval);
    }, [isScanning, businesses.length, fetchLogs]);

    // 🎯 Paso 1: Obtener GPS
    const getGPS = () => {
        if (!navigator.geolocation) {
            toast.error("GPS no soportado en este dispositivo");
            return;
        }

        toast.info("Localizando radar...");
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                toast.success("Ubicación fijada");
            },
            (err) => {
                toast.error("Error al obtener GPS: " + err.message);
            }
        );
    };

    // 🛰️ Paso 2: Escanear Entorno
    const scanNearby = async () => {
        if (!coords) {
            toast.error("Primero activa el GPS");
            return;
        }

        setIsScanning(true);
        setBusinesses([]);
        
        try {
            setTelemetry(prev => ["📡 Iniciando Escaneo Industrial...", ...prev]);
            // Llamamos a nuestra nueva API en el backend de Beatriz
            const res = await fetch(`${backendUrl}/hunter/nearby?lat=${coords.lat}&lng=${coords.lng}`, {
                headers: { "ngrok-skip-browser-warning": "true" }
            });
            const data = await res.json();
            
            if (data.results) {
                setBusinesses(data.results);
                toast.success(`${data.count} oportunidades detectadas`);
            }
        } catch {
            toast.error("Fallo en la conexión con el Hunter");
        } finally {
            setIsScanning(false);
        }
    };

    // 🏗️ Paso 3: Lanzar Prototipo (Misión Express)
    const launchPrototye = async () => {
        setIsOnboarding(true);
        toast.promise(
            new Promise(resolve => setTimeout(resolve, 3000)), // Simulación de proceso
            {
                loading: 'Construyendo Nodo Neural...',
                success: '¡Página de prueba generada!',
                error: 'Fallo en la arquitectura',
            }
        );

        // Aquí iría el fetch a /api/hunter/onboarding
        setTimeout(() => {
            setIsOnboarding(false);
            window.open('https://github.com/wilycol', '_blank');
        }, 3500);
    };

    return (
        <div className="min-h-screen bg-background text-white p-4 pb-20 space-y-6">
            {/* Header Industrial */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-black font-orbitron text-neon-blue uppercase tracking-tighter">
                        Hunter <span className="text-white">Field Ops</span>
                    </h1>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest font-mono">
                        Nivel de Acceso: SuperAdmin - Serie X Elite
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-white/40 hover:text-white"
                        onClick={() => setShowConfig(!showConfig)}
                    >
                        <Settings size={20} />
                    </Button>
                    <Badge variant="outline" className="border-neon-blue/30 text-neon-blue bg-neon-blue/10 animate-pulse">
                        Live Sync
                    </Badge>
                </div>
            </div>

            {/* Configuración del Backend */}
            <AnimatePresence>
                {showConfig && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <Card className="bg-white/5 border-white/10 p-4 mb-6">
                            <label className="text-[10px] uppercase font-mono text-white/50 block mb-2">Backend IP/URL (Ej: http://192.168.1.5:3002)</label>
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    value={backendUrl}
                                    onChange={(e) => setBackendUrl(e.target.value)}
                                    className="flex-1 bg-black/40 border border-white/10 rounded px-3 py-2 text-xs font-mono"
                                />
                                <Button size="sm" onClick={() => { 
                                    localStorage.setItem("beatriz_backend_url", backendUrl);
                                    setShowConfig(false); 
                                    toast.success("Puente Sincronizado"); 
                                }}>Guardar</Button>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Panel de Radar */}
            <Card className="bg-black/40 border-neon-blue/20 backdrop-blur-md overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                    <Radar size={120} className="text-neon-blue" />
                </div>
                
                <CardHeader>
                    <CardTitle className="text-sm font-orbitron uppercase tracking-widest flex items-center gap-2">
                        <MapPin className="text-neon-blue" size={18} /> Radar de Oportunidades
                    </CardTitle>
                    <CardDescription className="text-xs">
                        {coords ? `Coords: ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` : "GPS Desactivado"}
                    </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-3">
                    <div className="flex gap-3">
                        <Button 
                            onClick={getGPS}
                            variant="outline" 
                            className="flex-1 border-white/10 hover:bg-white/5 font-orbitron text-[10px]"
                        >
                            {coords ? "Actualizar GPS" : "Activar GPS"}
                        </Button>
                        <Button 
                            onClick={scanNearby}
                            disabled={!coords || isScanning}
                            className="flex-1 bg-neon-blue hover:bg-neon-blue/80 text-white font-orbitron text-[10px] shadow-[0_0_15px_rgba(0,163,255,0.4)]"
                        >
                            {isScanning ? <Loader2 className="animate-spin" /> : "Escanear Entorno"}
                        </Button>
                    </div>

                    <div className="pt-2 border-t border-white/5">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[9px] uppercase font-bold text-neon-blue flex items-center gap-1">
                                <Terminal size={12} /> Consola de Telemetría
                            </span>
                            {isScanning && <Loader2 size={12} className="animate-spin text-neon-blue" />}
                        </div>
                        <div className="h-24 bg-black/60 rounded border border-white/5 p-2 font-mono text-[9px] overflow-y-auto space-y-1">
                            {telemetry.length === 0 && <p className="text-white/20 italic">Esperando datos de la Serie X...</p>}
                            {telemetry.map((log, i) => (
                                <p key={i} className={`${log.includes('Error') ? 'text-red-400' : 'text-green-400/80'}`}>
                                    {`> ${log}`}
                                </p>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Lista de Resultados */}
            <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {businesses.map((biz) => (
                        <motion.div
                            key={biz.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            layout
                        >
                            <Card 
                                className={`border-white/5 bg-white/5 hover:border-neon-blue/40 transition-all cursor-pointer ${selectedBusiness?.id === biz.id ? 'border-neon-blue bg-neon-blue/5' : ''}`}
                                onClick={() => setSelectedBusiness(biz)}
                            >
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                                                <Store size={20} className="text-white/60" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-sm uppercase">{biz.name}</h3>
                                                <p className="text-[10px] text-white/40 truncate max-w-[200px]">{biz.address}</p>
                                            </div>
                                        </div>
                                        <Badge className={`${biz.opportunityScore > 80 ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'} border-none text-[9px]`}>
                                            Score: {biz.opportunityScore}%
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {businesses.length === 0 && !isScanning && (
                    <div className="py-20 text-center space-y-4 opacity-30">
                        <Radar size={48} className="mx-auto mb-4 animate-pulse" />
                        <p className="text-xs uppercase tracking-widest font-orbitron">Buscando señales neurales...</p>
                    </div>
                )}
            </div>

            {/* Modal de Acción (Sticky Bottom) */}
            <AnimatePresence>
                {selectedBusiness && (
                    <motion.div 
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        exit={{ y: 100 }}
                        className="fixed bottom-0 left-0 w-full p-4 bg-background/80 backdrop-blur-xl border-t border-neon-blue/20 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]"
                    >
                        <div className="max-w-xl mx-auto flex items-center justify-between gap-4">
                            <div className="flex-1">
                                <h4 className="text-xs font-bold uppercase truncate">{selectedBusiness.name}</h4>
                                <p className="text-[10px] text-neon-blue font-mono">DETECTADO • LISTO PARA SCAFFOLD</p>
                            </div>
                            <div className="flex gap-2">
                                <Button 
                                    variant="outline" 
                                    size="icon"
                                    className="border-white/10"
                                    onClick={() => setSelectedBusiness(null)}
                                >
                                    <AlertCircle size={18} />
                                </Button>
                                <Button 
                                    className={`${isApproved ? 'bg-neon-purple shadow-[0_0_20px_rgba(191,0,255,0.4)]' : 'bg-white/5 text-white/40'} hover:bg-neon-purple/80 transition-all gap-2 font-orbitron text-[10px] px-6`}
                                    onClick={() => launchPrototye()}
                                    disabled={isOnboarding || !isApproved}
                                >
                                    {isOnboarding ? <Loader2 className="animate-spin" /> : (isApproved ? <Zap size={14} /> : <HardHat size={14} />)} 
                                    {isApproved ? "Entregar al Arquitecto" : "Esperando Aprobación"}
                                </Button>
                                {!isApproved && (
                                    <Button 
                                        className="bg-green-500/20 text-green-400 border border-green-500/30 font-orbitron text-[10px]"
                                        onClick={() => {
                                            setIsApproved(true);
                                            toast.success("Misión Aprobada. Preparando entrevista.");
                                        }}
                                    >
                                        <CheckCircle2 size={14} />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Action: Onboarding Manual */}
            <div className="fixed bottom-24 right-4">
                <Button 
                    className="w-14 h-14 rounded-full bg-neon-blue shadow-[0_0_20px_rgba(0,163,255,0.6)] flex items-center justify-center p-0"
                    onClick={() => toast.info("Modo Manual: Sube fotos del local")}
                >
                    <Camera size={24} />
                </Button>
            </div>
        </div>
    );
}
