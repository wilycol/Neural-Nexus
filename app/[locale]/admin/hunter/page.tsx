"use client";

import React, { useState, useEffect, useCallback } from "react";
import { 
    MapPin, 
    Radar, 
    Store, 
    Camera, 
    Loader2,
    Terminal,
    Settings,
    CheckCircle2,
    HardHat,
    ShoppingBag,
    Cpu,
    Wrench,
    Utensils,
    Sparkles,
    Info,
    Globe,
    Phone,
    ExternalLink,
    X
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
    website?: string;
    phone?: string;
    missionUrl?: string;
    pitch?: string;
    status: 'detected' | 'investigating' | 'completed';
    adn?: string;
}

const NICHES = [
    { id: 'general', label: 'General', icon: Store, types: 'store' },
    { id: 'moda', label: 'Zapatos/Moda', icon: ShoppingBag, types: 'shoe_store,clothing_store' },
    { id: 'tech', label: 'Tecnología', icon: Cpu, types: 'electronics_store,computer_repair' },
    { id: 'auto', label: 'Automotriz', icon: Wrench, types: 'car_repair,car_dealer' },
    { id: 'food', label: 'Gastronomía', icon: Utensils, types: 'restaurant,cafe' },
    { id: 'beauty', label: 'Estética/Gym', icon: Sparkles, types: 'beauty_salon,gym' },
];

export default function AdminHunterPage() {
    const [backendUrl, setBackendUrl] = useState("http://localhost:3002");
    const [selectedNiche, setSelectedNiche] = useState(NICHES[0]);
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
            setTelemetry(prev => [`📡 Iniciando Cacería Quirúrgica (${selectedNiche.label})...`, ...prev]);
            // Llamamos a nuestra nueva API en el backend de Beatriz
            const res = await fetch(`${backendUrl}/hunter/nearby?lat=${coords.lat}&lng=${coords.lng}&types=${selectedNiche.types}`, {
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

    // 🚀 Fase 2: Investigación Profunda (Triple Misión)
    const investigateDeeply = async (biz: Business) => {
        setIsScanning(true);
        setTelemetry(prev => [`🔍 Activando Triple Misión para: ${biz.name}`, ...prev]);
        setTelemetry(prev => [`🕵️ Hunter: Buscando activos digitales y fotos...`, ...prev]);
        
        try {
            // Simulamos la activación del búnker
            await fetch(`${backendUrl}/hunter/logs`, {
                method: 'GET',
                headers: { 'ngrok-skip-browser-warning': 'true' }
            });
            
            setTelemetry(prev => [`🏗️ Arquitecto: Preparando Blueprint para ${biz.name}...`, ...prev]);
            setTelemetry(prev => [`💌 Seductor: Redactando misiva de conquista...`, ...prev]);
            
            setIsApproved(true);
            toast.success("Triple Misión Iniciada: Hunter, Arquitecto y Seductor en posición.");
        } catch {
            toast.error("Error al conectar con el búnker para la investigación.");
        } finally {
            setIsScanning(false);
        }
    };

    // 🏗️ Paso 3: Lanzar Prototipo (Misión Express)
    const launchPrototye = async () => {
        if (!selectedBusiness) return;
        
        setIsOnboarding(true);
        setTelemetry(prev => [`🚀 INICIANDO DESPLIEGUE INDUSTRIAL: ${selectedBusiness.name}`, ...prev]);
        setTelemetry(prev => [`🔨 Arquitecto: Clonando Plantilla FreeSmoke...`, ...prev]);
        
        try {
            // Llamada REAL al búnker de Beatriz
            const res = await fetch(`${backendUrl}/api/nodes/create`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                },
                body: JSON.stringify({
                    name: selectedBusiness.name.replace(/\s+/g, '_'),
                    brandHtml: `<span>${selectedBusiness.name}</span>`,
                    color: "neon-blue",
                    plan: "premium",
                    clientEmail: selectedBusiness.phone || "portalneuralnexus@gmail.com"
                })
            });

            const data = await res.json();
            
            if (data.success) {
                const url = data.url || `https://neural-hive.vercel.app/node/${selectedBusiness.id}`;
                const pitch = `¡Hola ${selectedBusiness.name}! 🚀 He estado analizando su presencia en Google y veo un potencial enorme que no se está aprovechando. Beatriz AI ha diseñado este prototipo de Neural Site especialmente para ustedes: ${url} -- ¿Qué les parece si lo activamos para atraer más clientes esta misma semana? 💎🦾`;
                
                setTelemetry(prev => [`✅ NODO VIVO: ${url}`, ...prev]);
                setTelemetry(prev => [`📡 HIVE: Registro en Supabase completado.`, ...prev]);
                
                const updatedBiz = { ...selectedBusiness, status: 'completed' as const, missionUrl: url, pitch };
                setBusinesses(prev => prev.map(b => b.id === selectedBusiness.id ? updatedBiz : b));
                setSelectedBusiness(updatedBiz);

                toast.success("¡Despliegue Exitoso!", {
                    description: "El nodo está vivo y registrado en la Federación.",
                    duration: 5000
                });
            } else {
                throw new Error(data.message || "Fallo en el despliegue");
            }
        } catch (err: any) {
            setTelemetry(prev => [`❌ ERROR: ${err.message}`, ...prev]);
            toast.error("Error en la arquitectura: " + err.message);
        } finally {
            setIsOnboarding(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-white p-4 pb-44 space-y-6">
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
                        onClick={() => toast.info("Modo Manual: Sube fotos del local")}
                    >
                        <Camera size={20} />
                    </Button>
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
                
                <CardContent className="space-y-4">
                    {/* Selector de Nichos */}
                    <div className="space-y-2">
                        <label className="text-[9px] uppercase font-bold text-white/40 tracking-widest">Nicho de Cacería</label>
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            {NICHES.map((niche) => (
                                <button
                                    key={niche.id}
                                    onClick={() => setSelectedNiche(niche)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all whitespace-nowrap ${
                                        selectedNiche.id === niche.id 
                                        ? 'bg-neon-blue/20 border-neon-blue text-neon-blue shadow-[0_0_10px_rgba(0,163,255,0.2)]' 
                                        : 'bg-white/5 border-white/10 text-white/50 hover:border-white/20'
                                    }`}
                                >
                                    <niche.icon size={14} />
                                    <span className="text-[10px] font-orbitron uppercase">{niche.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

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
                            {telemetry.length === 0 && (
                                <div className="space-y-1">
                                    <p className="text-white/20 italic">Esperando datos de la Serie X...</p>
                                    <p className="text-[8px] text-white/10 uppercase font-mono tracking-tighter">Target: {backendUrl}</p>
                                </div>
                            )}
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
                                                <h3 className="font-bold text-sm uppercase flex items-center gap-2">
                                                    {biz.name}
                                                    {biz.status === 'completed' && <Badge className="bg-green-500 text-black text-[8px] h-4">NODO VIVO</Badge>}
                                                </h3>
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
            {/* Expediente de Inteligencia (Modal) */}
            <AnimatePresence>
                {showConfig && selectedBusiness && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4"
                    >
                        <Card className="w-full max-w-lg bg-black border-neon-blue/30 shadow-[0_0_50px_rgba(0,163,255,0.2)]">
                            <CardHeader className="border-b border-white/5">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="font-orbitron text-neon-blue uppercase tracking-tighter">{selectedBusiness.name}</CardTitle>
                                        <CardDescription className="text-[10px] text-white/40 uppercase">Expediente de Inteligencia • Serie X</CardDescription>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => setShowConfig(false)}>
                                        <X size={20} />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-[9px] uppercase text-white/30 font-bold">Estado Digital</p>
                                        <div className="flex items-center gap-2 text-xs">
                                            {selectedBusiness.website ? <Globe size={14} className="text-green-500" /> : <Globe size={14} className="text-red-500" />}
                                            <span>{selectedBusiness.website ? "Sitio Web Detectado" : "Sin Presencia Web"}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[9px] uppercase text-white/30 font-bold">Contacto</p>
                                        <div className="flex items-center gap-2 text-xs">
                                            <Phone size={14} className="text-neon-blue" />
                                            <span>{selectedBusiness.phone || "Solicitar en Local"}</span>
                                        </div>
                                    </div>
                                </div>

                                {selectedBusiness.status === 'completed' && (
                                    <div className="space-y-4">
                                        <div className="p-3 bg-neon-blue/10 border border-neon-blue/30 rounded-lg space-y-2">
                                            <p className="text-[9px] uppercase text-neon-blue font-black">Link del Nodo Vivo</p>
                                            <a 
                                                href={selectedBusiness.missionUrl} 
                                                target="_blank" 
                                                className="text-xs text-white underline break-all flex items-center gap-2"
                                            >
                                                <ExternalLink size={12} /> {selectedBusiness.missionUrl}
                                            </a>
                                        </div>

                                        <div className="p-3 bg-neon-purple/10 border border-neon-purple/30 rounded-lg space-y-2">
                                            <p className="text-[9px] uppercase text-neon-purple font-black">💌 Mensaje de Conquista (Seductor)</p>
                                            <p className="text-[11px] text-white/80 leading-relaxed">
                                                {selectedBusiness.pitch}
                                            </p>
                                            <Button 
                                                size="sm" 
                                                variant="ghost" 
                                                className="w-full text-neon-purple hover:bg-neon-purple/10 h-8 text-[10px]"
                                                onClick={() => {
                                                    if (selectedBusiness.pitch) {
                                                        navigator.clipboard.writeText(selectedBusiness.pitch);
                                                        toast.success("Mensaje copiado para WhatsApp");
                                                    }
                                                }}
                                            >
                                                Copiar Mensaje de Venta
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <p className="text-[9px] uppercase text-white/30 font-bold">Análisis de Oportunidad</p>
                                    <div className="p-3 bg-white/5 rounded-lg border border-white/10 text-[11px] leading-relaxed italic">
                                        &quot;{selectedBusiness.opportunityScore > 80 
                                            ? "Objetivo de alta prioridad. La ausencia de optimización digital lo hace extremadamente vulnerable a la competencia. Ideal para Neural Site." 
                                            : "Negocio estable, pero con margen de mejora en automatización de contenido."}&quot;
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-[9px] uppercase text-neon-blue font-bold">ADN del Negocio (Alimentar IA)</p>
                                    <textarea 
                                        className="w-full h-24 bg-white/5 border border-white/10 rounded-lg p-3 text-xs text-white placeholder:text-white/20 outline-none focus:border-neon-blue/50 transition-all resize-none"
                                        placeholder="Pega aquí reseñas, servicios, historia o cualquier detalle estratégico..."
                                        value={selectedBusiness.adn || ''}
                                        onChange={(e) => {
                                            const newAdn = e.target.value;
                                            setBusinesses(prev => prev.map(b => 
                                                b.id === selectedBusiness.id ? { ...b, adn: newAdn } : b
                                            ));
                                            setSelectedBusiness(prev => prev ? { ...prev, adn: newAdn } : null);
                                        }}
                                    />
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <Button 
                                        className="flex-1 bg-neon-blue text-black font-black uppercase text-[10px]"
                                        onClick={() => {
                                            const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedBusiness.name)}&query_place_id=${selectedBusiness.id}`;
                                            window.open(mapUrl, '_blank');
                                        }}
                                    >
                                        Abrir en Google Maps
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        className="flex-1 border-white/10 text-[10px] uppercase font-bold"
                                        onClick={() => {
                                            const input = document.createElement('input');
                                            input.type = 'file';
                                            input.multiple = true;
                                            input.accept = 'image/*,video/*';
                                            input.onchange = (e: Event) => {
                                                const target = e.target as HTMLInputElement;
                                                const files = target.files;
                                                if (files && files.length > 0) {
                                                    toast.success(`${files.length} archivos de evidencia cargados.`);
                                                }
                                            };
                                            input.click();
                                        }}
                                    >
                                        <Camera size={14} className="mr-2" /> Multimedia
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modal de Acción (Sticky Bottom) */}
            <AnimatePresence>
                {selectedBusiness && (
                    <motion.div 
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        exit={{ y: 100 }}
                        className="fixed bottom-0 left-0 w-full p-4 bg-background/90 backdrop-blur-2xl border-t border-neon-blue/30 z-50 shadow-[0_-20px_40px_rgba(0,0,0,0.7)]"
                    >
                        <div className="max-w-xl mx-auto flex items-center justify-between gap-2">
                            <div className="flex-1 min-w-0">
                                <h4 className="text-[10px] font-black uppercase truncate text-white">{selectedBusiness.name}</h4>
                                <p className="text-[8px] text-neon-blue font-mono flex items-center gap-1">
                                    <Sparkles size={8} /> READY
                                </p>
                            </div>
                            
                            <div className="flex items-center gap-1.5 shrink-0">
                                {/* Inteligencia Geográfica */}
                                <Button 
                                    variant="outline" 
                                    size="icon"
                                    className="border-white/10 text-white/40 hover:text-neon-blue hover:border-neon-blue transition-all h-9 w-9 shrink-0"
                                    onClick={() => setShowConfig(true)}
                                    title="Ver Expediente"
                                >
                                    <Info size={14} />
                                </Button>

                                {/* Disparador del Arquitecto / Ver Nodo */}
                                <Button 
                                    className={`font-orbitron font-black text-[9px] uppercase tracking-tighter transition-all h-9 px-3 shrink-0 ${
                                        selectedBusiness.status === 'completed'
                                        ? 'bg-neon-blue text-black shadow-[0_0_25px_rgba(0,163,255,0.5)] border-none'
                                        : isApproved 
                                        ? 'bg-neon-purple text-white shadow-[0_0_25px_rgba(191,0,255,0.5)] border-none' 
                                        : 'bg-white/5 text-white/20 border border-white/5'
                                    }`}
                                    onClick={() => {
                                        if (selectedBusiness.status === 'completed' && selectedBusiness.missionUrl) {
                                            window.open(selectedBusiness.missionUrl, '_blank');
                                        } else {
                                            launchPrototye();
                                        }
                                    }}
                                    disabled={isOnboarding || (!isApproved && selectedBusiness.status !== 'completed')}
                                >
                                    {isOnboarding ? <Loader2 className="animate-spin" /> : <HardHat size={12} className="mr-1.5" />} 
                                    {selectedBusiness.status === 'completed' ? "Ver Nodo" : isApproved ? "Arquitecto" : "Espera"}
                                </Button>

                                {/* Switch de Aprobación Industrial */}
                                <Button 
                                    size="icon"
                                    className={`h-9 w-9 shrink-0 transition-all ${
                                        isApproved 
                                        ? 'bg-green-500 text-black shadow-[0_0_20px_rgba(34,197,94,0.5)]' 
                                        : 'bg-white/5 border border-white/10 text-white/30'
                                    }`}
                                    onClick={() => {
                                        if (isApproved) {
                                            setIsApproved(false);
                                        } else {
                                            investigateDeeply(selectedBusiness);
                                        }
                                    }}
                                >
                                    {isScanning ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={16} />}
                                </Button>

                                {/* Cerrar Selección */}
                                <Button 
                                    variant="ghost" 
                                    size="icon"
                                    className="text-white/20 hover:text-red-500 h-9 w-9 shrink-0"
                                    onClick={() => setSelectedBusiness(null)}
                                >
                                    <X size={14} />
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}
