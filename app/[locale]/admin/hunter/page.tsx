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
    X,
    Search,
    History,
    Star,
    Download,
    BookMarked,
    ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { getSupabaseHiveClient } from "@/lib/supabase-hive-client";

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
    isNodeActive?: boolean;
    nodeUrl?: string;
    nodeId?: string;
    notInMaps?: boolean;
}

interface PlaceResult {
    id: string;
    name: string;
    address: string;
    rating: number;
    city: string;
    location: { latitude: number; longitude: number };
}

interface SearchHistory {
    id: string;
    query: string;
    label: string;
    total: number;
    places: PlaceResult[];
    created_at: string;
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
    const [backendUrl, setBackendUrl] = useState("https://claudine-tristful-moly.ngrok-free.dev");
    // 💋 Serie X Elite - Sincronización Dinámica Activa (v1.2)
    const [selectedNiche, setSelectedNiche] = useState(NICHES[0]);
    const [showConfig, setShowConfig] = useState(false);
    const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
    const [searchRadius, setSearchRadius] = useState(500); // Radio por defecto en metros
    const [manualPivotCoords, setManualPivotCoords] = useState(""); // Para inyección remota
    const [isScanning, setIsScanning] = useState(false);
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
    const [isManualMode, setIsManualMode] = useState(false);
    const [manualEntry, setManualEntry] = useState({
        name: "",
        address: "",
        phone: "",
        niche: "general",
        notInMaps: false,
        adn: ""
    });
    const [isOnboarding, setIsOnboarding] = useState(false);
    const [telemetry, setTelemetry] = useState<string[]>([]);
    const [isApproved, setIsApproved] = useState(false);
    const [isInvestigating, setIsInvestigating] = useState(false);

    // 🔍 Búsqueda Preferencial — Estados
    const [showPreferentialSearch, setShowPreferentialSearch] = useState(false);
    const [showPivotHistory, setShowPivotHistory] = useState(false);
    const [preferentialQuery, setPreferentialQuery] = useState("");
    const [preferentialLimit, setPreferentialLimit] = useState(50);
    const [preferentialResults, setPreferentialResults] = useState<PlaceResult[]>([]);
    const [isSearchingPreferential, setIsSearchingPreferential] = useState(false);
    const [preferentialError, setPreferentialError] = useState("");
    const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [expandedHistoryId, setExpandedHistoryId] = useState<string | null>(null);
    const [historyFilter, setHistoryFilter] = useState("");

    const supabase = getSupabaseHiveClient();

    // 🔍 Función: Búsqueda Preferencial
    const runPreferentialSearch = async () => {
        if (!preferentialQuery.trim() || preferentialQuery.trim().length < 3) {
            setPreferentialError("El prompt debe tener al menos 3 caracteres.");
            return;
        }
        setIsSearchingPreferential(true);
        setPreferentialResults([]);
        setPreferentialError("");
        try {
            const res = await fetch(`${backendUrl}/hunter/preferential-search`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
                body: JSON.stringify({ query: preferentialQuery, limit: preferentialLimit })
            });
            const data = await res.json();
            if (data.success && data.places) {
                setPreferentialResults(data.places);
                if (data.cached) {
                    toast.success(`⚡ Cargado desde Caché (${data.places.length} resultados)`);
                } else {
                    toast.success(`🔍 Búsqueda completada (${data.places.length} resultados)`);
                }
            } else {
                setPreferentialError(data.error || "No se encontraron resultados.");
            }
        } catch {
            setPreferentialError("Error de conexión con el Hunter.");
        } finally {
            setIsSearchingPreferential(false);
        }
    };

    // 📍 Función: Inyectar Pivote desde resultado preferencial
    const injectPivotFromPlace = (place: PlaceResult) => {
        if (!place.location?.latitude || !place.location?.longitude) {
            toast.error("Este lugar no tiene coordenadas válidas.");
            return;
        }
        const lat = place.location.latitude;
        const lng = place.location.longitude;
        const coordStr = `${lat}, ${lng}`;
        setManualPivotCoords(coordStr);
        setCoords({ lat, lng });
        setShowPreferentialSearch(false);
        setShowPivotHistory(false);
        toast.success(`📍 Pivote fijado: ${place.name}`, { description: `${lat.toFixed(4)}, ${lng.toFixed(4)}` });
    };

    // 📋 Función: Cargar historial desde el Backend (Memoria Local)
    const loadSearchHistory = useCallback(async () => {
        setIsLoadingHistory(true);
        try {
            const res = await fetch(`${backendUrl}/hunter/history`, {
                headers: { 'ngrok-skip-browser-warning': 'true' }
            });
            const data = await res.json();
            if (data.success && data.history) {
                setSearchHistory(data.history);
            } else {
                setSearchHistory([]);
            }
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : "Error";
            toast.error("Error cargando historial de búsqueda: " + msg);
            setSearchHistory([]);
        } finally {
            setIsLoadingHistory(false);
        }
    }, [backendUrl]);

    // 📥 Función: Descargar JSON
    const downloadResultsAsJson = () => {
        if (preferentialResults.length === 0) return;
        const payload = { success: true, query: preferentialQuery, total: preferentialResults.length, places: preferentialResults };
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `hunter_${preferentialQuery.replace(/\s+/g, '_').slice(0, 30)}_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    useEffect(() => {
        const savedUrl = localStorage.getItem("beatriz_bridge_url");
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
        let activeCoords = coords;

        // Si hay pivote manual, intentar parsearlo
        if (manualPivotCoords.trim()) {
            const parts = manualPivotCoords.split(",").map(p => parseFloat(p.trim()));
            if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
                activeCoords = { lat: parts[0], lng: parts[1] };
                setCoords(activeCoords); // Sincronizar visualmente
                setTelemetry(prev => [`🎯 Pivote Remoto detectado: ${parts[0]}, ${parts[1]}`, ...prev]);
            } else {
                toast.error("Formato de coordenadas manuales inválido (Lat, Lng)");
                return;
            }
        }

        if (!activeCoords) {
            toast.error("Primero activa el GPS o inyecta un Pivote Remoto");
            return;
        }

        setIsScanning(true);
        setBusinesses([]);
        
        try {
            setTelemetry(prev => [`📡 Iniciando Cacería Quirúrgica (${selectedNiche.label})...`, ...prev]);
            setTelemetry(prev => [`📏 Radio de Barrido: ${searchRadius}m`, ...prev]);
            
            if (!supabase) {
                toast.error("Error de conexión con la Federación");
                return;
            }

            // Llamamos a nuestra nueva API en el backend de Beatriz
            const res = await fetch(`${backendUrl}/hunter/nearby?lat=${activeCoords.lat}&lng=${activeCoords.lng}&radius=${searchRadius}&types=${selectedNiche.types}`, {
                headers: { "ngrok-skip-browser-warning": "true" }
            });
            const data = await res.json();
            
            if (data.results) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const { data: existingNodes } = await (supabase as any).from("nodes").select("name, url");
                
                const processedResults = (data.results as Business[]).map((biz) => {
                    const cleanBizName = biz.name.toLowerCase().replace(/\s+/g, '');
                    const existingNode = (existingNodes as { name: string, url: string }[] | null)?.find((node) => 
                        node.name.toLowerCase().replace(/\s+/g, '').includes(cleanBizName) || 
                        cleanBizName.includes(node.name.toLowerCase().replace(/\s+/g, ''))
                    );

                    return {
                        ...biz,
                        isNodeActive: !!existingNode,
                        nodeUrl: existingNode?.url
                    };
                });

                setBusinesses(processedResults);
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
        if (isInvestigating) return;
        setIsInvestigating(true);
        setIsApproved(false); // Reset approval while investigating
        
        setTelemetry(prev => [`🔍 Activando Triple Misión para: ${biz.name}`, ...prev]);
        setTelemetry(prev => [`🕵️ Hunter: Iniciando OSINT profundo y extracción de activos...`, ...prev]);
        
        try {
            const res = await fetch(`${backendUrl}/hunter/approve-candidate`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                },
                body: JSON.stringify({
                    businessId: biz.id,
                    name: biz.name,
                    address: biz.address,
                    phone: biz.phone,
                    website: biz.website,
                    rating: biz.rating,
                    types: selectedNiche.types,
                    location: biz.location // 🛰️ Enviamos las coordenadas detectadas
                })
            });
            
            const data = await res.json();
            
            if (data.success) {
                setTelemetry(prev => [`✅ INTELIGENCIA COMPLETADA. ADN del cliente asegurado.`, ...prev]);
                setTelemetry(prev => [`🏗️ Arquitecto: Blueprint listo para despliegue.`, ...prev]);
                setTelemetry(prev => [`💌 Seductor: Misiva de conquista redactada.`, ...prev]);
                
                // Actualizar el negocio seleccionado con los nuevos datos (ID del nodo, etc)
                const updatedBiz = { ...biz, status: 'investigating' as const, nodeId: data.nodeId };
                setBusinesses(prev => prev.map(b => b.id === biz.id ? updatedBiz : b));
                setSelectedBusiness(updatedBiz);
                
                setIsApproved(true);
                toast.success("Investigación Finalizada: Hunter, Arquitecto y Seductor en posición.");
            } else {
                throw new Error(data.error || "Fallo en la investigación");
            }
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Fallo desconocido";
            toast.error("Error en la cacería: " + errorMessage);
            setTelemetry(prev => [`❌ FALLO DE MISIÓN: ${errorMessage}`, ...prev]);
        } finally {
            setIsInvestigating(false);
        }
    };

    // 🏗️ Paso 3: Lanzar Prototipo (Misión Express)
    const launchPrototye = async () => {
        if (!selectedBusiness) return;
        
        setIsOnboarding(true);
        setTelemetry(prev => [`🚀 INICIANDO DESPLIEGUE INDUSTRIAL: ${selectedBusiness.name}`, ...prev]);
        
        try {
            // Si tenemos nodeId (creado por el Hunter), usamos REFACTOR para inyectar ADN real
            const endpoint = selectedBusiness.nodeId 
                ? `${backendUrl}/api/nodes/refactor` 
                : `${backendUrl}/api/nodes/create`;
            
            setTelemetry(prev => [`🔨 Arquitecto: ${selectedBusiness.nodeId ? 'Refactorizando con ADN Industrial...' : 'Clonando Plantilla Express...'}`, ...prev]);

            const payload = selectedBusiness.nodeId 
                ? { nodeId: selectedBusiness.nodeId, mode: 'preview' }
                : {
                    name: selectedBusiness.name.replace(/\s+/g, '_'),
                    brandHtml: `<span>${selectedBusiness.name}</span>`,
                    color: "neon-blue",
                    plan: "premium",
                    clientEmail: selectedBusiness.phone || "portalneuralnexus@gmail.com"
                };

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            
            if (data.success) {
                const nodeName = data.nodeName || selectedBusiness.name.replace(/\s+/g, '_');
                const url = `https://${nodeName.toLowerCase()}.neural-nodes.com`; // URL Industrial estandarizada
                
                setTelemetry(prev => [`✅ NODO VIVO: ${url}`, ...prev]);
                setTelemetry(prev => [`📡 HIVE: Registro en Supabase completado.`, ...prev]);
                
                const updatedBiz = { 
                    ...selectedBusiness, 
                    status: 'completed' as const, 
                    missionUrl: url,
                    isNodeActive: true 
                };
                setBusinesses(prev => prev.map(b => b.id === selectedBusiness.id ? updatedBiz : b));
                setSelectedBusiness(updatedBiz);

                toast.success("¡Despliegue Exitoso!", {
                    description: "Beatriz ha materializado el sitio en la Federación.",
                    duration: 5000
                });
            } else {
                throw new Error(data.message || "Fallo en el despliegue");
            }
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : "Fallo desconocido";
            setTelemetry(prev => [`❌ ERROR: ${errorMsg}`, ...prev]);
            toast.error("Error en la arquitectura: " + errorMsg);
        } finally {
            setIsOnboarding(false);
        }
    };

    return (
        <>
        <div className="min-h-screen bg-background text-white p-4 pb-44 space-y-6">
            {/* Header Industrial */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-black font-orbitron text-neon-blue uppercase tracking-tighter">
                        Hunter <span className="text-white">Field Ops</span>
                    </h1>
                    <div className="flex items-center gap-2">
                        <p className="text-[10px] text-white/50 uppercase tracking-widest font-mono">
                            Nivel de Acceso: SuperAdmin - Serie X Elite
                        </p>
                        {backendUrl.includes("ngrok") && (
                            <Badge className="h-3 text-[7px] bg-neon-purple/20 text-neon-purple border-neon-purple/30 px-1">SYNC ACTIVE</Badge>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className={`transition-all ${isManualMode ? 'text-neon-purple animate-pulse' : 'text-white/40 hover:text-white'}`}
                        onClick={() => {
                            setIsManualMode(!isManualMode);
                            toast.info(isManualMode ? "Radar normal activado" : "🧬 MODO HÉROE: Inyección Manual Activada");
                        }}
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
                                    localStorage.setItem("beatriz_bridge_url", backendUrl);
                                    setShowConfig(false); 
                                    toast.success("Puente Sincronizado"); 
                                }}>Guardar</Button>
                            </div>

                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/5 pt-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase font-mono text-white/50 block">Pivote Maestro (Manual Coords)</label>
                                    <input 
                                        type="text" 
                                        value={manualPivotCoords}
                                        onChange={(e) => setManualPivotCoords(e.target.value)}
                                        placeholder="Ej: 7.9398, -72.4989"
                                        className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-xs font-mono outline-none focus:border-neon-blue/50"
                                    />
                                    <p className="text-[8px] text-white/30 italic">Copia desde Google Maps para cacería remota.</p>
                                    <button
                                        id="btn-historial-pivote"
                                        onClick={() => { setShowPivotHistory(true); loadSearchHistory(); }}
                                        className="w-full flex items-center gap-2 px-2 py-1.5 rounded border border-neon-blue/20 text-neon-blue/60 hover:bg-neon-blue/10 hover:text-neon-blue transition-all text-[9px] font-mono uppercase tracking-widest mt-1"
                                    >
                                        <History size={11} /> Ver Historial de Búsquedas
                                    </button>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase font-mono text-white/50 block">Radio de Cacería (Metros)</label>
                                    <select 
                                        value={searchRadius}
                                        onChange={(e) => setSearchRadius(parseInt(e.target.value))}
                                        className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-xs font-mono outline-none focus:border-neon-blue/50"
                                    >
                                        <option value="250">250m (Precisión)</option>
                                        <option value="500">500m (Estándar)</option>
                                        <option value="1000">1km (Barrido)</option>
                                        <option value="2000">2km (Exploración)</option>
                                        <option value="5000">5km (Artillería)</option>
                                    </select>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 🧬 MODO HÉROE: INYECCIÓN MANUAL */}
            <AnimatePresence>
                {isManualMode && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                    >
                        <Card className="bg-neon-purple/5 border-neon-purple/20 backdrop-blur-md p-6 space-y-4 shadow-[0_0_30px_rgba(191,0,255,0.1)]">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-neon-purple/20 rounded-lg">
                                    <Radar size={20} className="text-neon-purple animate-pulse" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-black font-orbitron text-neon-purple uppercase tracking-widest">Inyección de Inteligencia Manual</h2>
                                    <p className="text-[10px] text-white/40 uppercase tracking-tighter">Serie X • Modo Héroe Activado</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[9px] uppercase font-bold text-white/40">Nombre del Negocio</label>
                                    <input 
                                        type="text" 
                                        value={manualEntry.name}
                                        onChange={(e) => setManualEntry({...manualEntry, name: e.target.value})}
                                        placeholder="Ej: Heladería El Paraíso"
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono outline-none focus:border-neon-purple/50"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] uppercase font-bold text-white/40">Dirección Física</label>
                                    <input 
                                        type="text" 
                                        value={manualEntry.address}
                                        onChange={(e) => setManualEntry({...manualEntry, address: e.target.value})}
                                        placeholder="Ej: Calle 10 #5-20"
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono outline-none focus:border-neon-purple/50"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[9px] uppercase font-bold text-white/40">ADN / Notas de Entrevista</label>
                                <textarea 
                                    value={manualEntry.adn}
                                    onChange={(e) => setManualEntry({...manualEntry, adn: e.target.value})}
                                    placeholder="¿Qué te dijo el dueño? ¿Qué sueña para su negocio?"
                                    className="w-full h-20 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono outline-none focus:border-neon-purple/50 resize-none"
                                />
                            </div>

                            <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                                <div className="flex items-center gap-2">
                                    <input 
                                        type="checkbox" 
                                        checked={manualEntry.notInMaps}
                                        onChange={(e) => setManualEntry({...manualEntry, notInMaps: e.target.checked})}
                                        className="w-4 h-4 accent-neon-purple"
                                    />
                                    <span className="text-[10px] uppercase font-black text-white/60">¿No existe en Google Maps?</span>
                                </div>
                                <Button 
                                    size="sm"
                                    className="bg-neon-purple hover:bg-neon-purple/80 text-white font-black text-[10px] uppercase"
                                    onClick={() => {
                                        if(!manualEntry.name) return toast.error("El nombre es obligatorio");
                                        const newBiz: Business = {
                                            id: `manual_${Date.now()}`,
                                            name: manualEntry.name,
                                            address: manualEntry.address,
                                            rating: 0,
                                            opportunityScore: 100,
                                            location: coords || { lat: 0, lng: 0 },
                                            phone: manualEntry.phone,
                                            status: 'detected',
                                            adn: manualEntry.adn
                                        };
                                        setBusinesses([newBiz, ...businesses]);
                                        setIsManualMode(false);
                                        toast.success("Lead inyectado con éxito. ¡A por ellos!");
                                    }}
                                >
                                    Fijar Objetivo
                                </Button>
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
                    <CardTitle className="text-sm font-orbitron uppercase tracking-widest flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <MapPin className="text-neon-blue" size={18} /> Radar de Oportunidades
                        </div>
                        <Badge variant="outline" className="text-[9px] border-neon-blue/20 text-neon-blue">
                            R: {searchRadius}m
                        </Badge>
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

                    {/* 🔍 Búsqueda Preferencial — Botón siempre visible */}
                    <button
                        id="btn-busqueda-preferencial"
                        onClick={() => setShowPreferentialSearch(true)}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-dashed border-neon-blue/40 text-neon-blue/70 hover:bg-neon-blue/10 hover:border-neon-blue/70 hover:text-neon-blue transition-all font-orbitron text-[10px] uppercase tracking-widest"
                    >
                        <Search size={13} />
                        Búsqueda Preferencial
                        <span className="ml-auto text-[8px] text-neon-blue/40 font-mono normal-case">Hunter Mode</span>
                    </button>

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
                                                    {biz.isNodeActive && <Badge className="bg-amber-500 text-black text-[8px] h-4">DENTRO DE LA COLMENA 🛰️</Badge>}
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
                        <Card className="w-full max-w-lg max-h-[85vh] md:max-h-[90vh] bg-black border-neon-blue/30 shadow-[0_0_50px_rgba(0,163,255,0.2)] flex flex-col overflow-hidden">
                            <CardHeader className="border-b border-white/5 shrink-0">
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
                            <CardContent className="p-6 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-[9px] uppercase text-white/30 font-bold">Estado Digital</p>
                                        <div className="flex flex-col gap-1 text-xs">
                                            <div className="flex items-center gap-2">
                                                {selectedBusiness.website ? <Globe size={14} className="text-green-500" /> : <Globe size={14} className="text-red-500" />}
                                                {selectedBusiness.website ? (
                                                    <a href={selectedBusiness.website} target="_blank" rel="noopener noreferrer" className="text-neon-blue hover:underline font-mono truncate max-w-[200px]">
                                                        {selectedBusiness.website}
                                                    </a>
                                                ) : (
                                                    <span>Sin Presencia Web</span>
                                                )}
                                            </div>
                                            {selectedBusiness.website && (
                                                <div className="mt-2 p-2 bg-neon-purple/10 border border-neon-purple/30 rounded-lg">
                                                    <p className="text-[9px] uppercase text-neon-purple font-black mb-1">🎯 Oportunidad de Inyección Neural</p>
                                                    <p className="text-[10px] text-white/80 leading-tight">
                                                        Este sitio web estático puede ser absorbido y convertido en una web inteligente por Beatriz AI. Ideal para ofrecer el Plan Gold/Platinum y unirlo a la Federación.
                                                    </p>
                                                </div>
                                            )}
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
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
                                            const query = encodeURIComponent(`${selectedBusiness.name} ${selectedBusiness.address}`);
                                            const mapUrl = selectedBusiness.notInMaps 
                                                ? `https://www.google.com/maps/search/?api=1&query=${query}`
                                                : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedBusiness.name)}&query_place_id=${selectedBusiness.id}`;
                                            window.open(mapUrl, '_blank');
                                        }}
                                    >
                                        {selectedBusiness.notInMaps ? "Registrar en Google Maps" : "Abrir en Google Maps"}
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
                                {/* 1. Detalle (Info) */}
                                <Button 
                                    variant="outline" 
                                    size="icon"
                                    className="border-white/10 text-white/40 hover:text-neon-blue hover:border-neon-blue transition-all h-9 w-9 shrink-0"
                                    onClick={() => setShowConfig(true)}
                                    title="Ver Expediente"
                                >
                                    <Info size={14} />
                                </Button>

                                {/* 2. Hunter (Check) */}
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
                                    disabled={isInvestigating}
                                    title="Activar Hunter (OSINT Profundo)"
                                >
                                    {isInvestigating ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={16} />}
                                </Button>

                                {/* 3. Arquitecto (HardHat) */}
                                <Button 
                                    className={`font-orbitron font-black text-[9px] uppercase tracking-tighter transition-all h-9 px-3 shrink-0 ${
                                        selectedBusiness.status === 'completed'
                                        ? 'bg-neon-blue text-black shadow-[0_0_25px_rgba(0,163,255,0.5)] border-none'
                                        : isApproved 
                                        ? 'bg-neon-purple text-white shadow-[0_0_25px_rgba(191,0,255,0.5)] border-none' 
                                        : 'bg-white/5 text-white/20 border border-white/5'
                                    }`}
                                    onClick={() => {
                                        if (selectedBusiness.nodeId) {
                                            // 🚀 EL PUENTE: Redirección directa al detalle del nodo en la Colmena
                                            window.location.href = `/es/admin/nodes?nodeId=${selectedBusiness.nodeId}`;
                                        } else if (selectedBusiness.status === 'completed' && selectedBusiness.missionUrl) {
                                            window.open(selectedBusiness.missionUrl, '_blank');
                                        } else {
                                            launchPrototye();
                                        }
                                    }}
                                    disabled={isOnboarding || isInvestigating || (!isApproved && selectedBusiness.status !== 'completed')}
                                    title="Lanzar Arquitecto (Despliegue de Nodo)"
                                >
                                    {isOnboarding ? <Loader2 className="animate-spin" /> : <HardHat size={12} className="mr-1.5" />} 
                                    {selectedBusiness.isNodeActive ? "Ver Nodo" : selectedBusiness.status === 'completed' ? "Ver Nodo" : isApproved ? "Arquitecto" : "Espera"}
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

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* 🔍 MODAL: BÚSQUEDA PREFERENCIAL                               */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <AnimatePresence>
            {showPreferentialSearch && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/85 backdrop-blur-md z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4"
                >
                    <motion.div
                        initial={{ y: 60, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 60, opacity: 0 }}
                        className="w-full sm:max-w-lg max-h-[92vh] bg-[#070B14] border border-neon-blue/30 sm:rounded-2xl rounded-t-2xl shadow-[0_0_60px_rgba(0,163,255,0.15)] flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-white/5 shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-neon-blue/15 rounded-lg">
                                    <Search size={16} className="text-neon-blue" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-black font-orbitron text-neon-blue uppercase tracking-widest">Búsqueda Preferencial</h2>
                                    <p className="text-[9px] text-white/40 uppercase tracking-tighter">Hunter Serie X Elite • Colombia</p>
                                </div>
                            </div>
                            <button onClick={() => setShowPreferentialSearch(false)} className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition-all">
                                <X size={16} />
                            </button>
                        </div>

                        {/* Search Controls */}
                        <div className="p-4 space-y-3 border-b border-white/5 shrink-0">
                            <div className="space-y-1.5">
                                <label className="text-[9px] uppercase font-bold text-white/40 tracking-widest">¿Qué buscar?</label>
                                <div className="flex gap-2">
                                    <input
                                        id="preferential-query-input"
                                        type="text"
                                        value={preferentialQuery}
                                        onChange={(e) => setPreferentialQuery(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && runPreferentialSearch()}
                                        placeholder="Ej: 100 mejores ferreterías en Colombia"
                                        className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono outline-none focus:border-neon-blue/50 transition-all text-white placeholder:text-white/20"
                                        autoFocus
                                    />
                                    <select
                                        value={preferentialLimit}
                                        onChange={(e) => setPreferentialLimit(parseInt(e.target.value))}
                                        className="bg-black/40 border border-white/10 rounded-lg px-2 py-2 text-xs font-mono outline-none focus:border-neon-blue/50 text-white"
                                    >
                                        <option value={10}>10</option>
                                        <option value={25}>25</option>
                                        <option value={50}>50</option>
                                        <option value={100}>100</option>
                                    </select>
                                </div>
                                {preferentialError && (
                                    <p className="text-[10px] text-red-400 font-mono">{preferentialError}</p>
                                )}
                            </div>
                            <button
                                id="btn-lanzar-hunter"
                                onClick={runPreferentialSearch}
                                disabled={isSearchingPreferential}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-neon-blue hover:bg-neon-blue/80 disabled:opacity-50 text-black font-orbitron font-black text-[10px] uppercase tracking-widest shadow-[0_0_20px_rgba(0,163,255,0.3)] transition-all"
                            >
                                {isSearchingPreferential ? (
                                    <><Loader2 size={13} className="animate-spin" /> Buscando en 5 ciudades...</>
                                ) : (
                                    <><Search size={13} /> Lanzar Hunter</>  
                                )}
                            </button>
                        </div>

                        {/* Results */}
                        <div className="flex-1 overflow-y-auto">
                            {preferentialResults.length > 0 ? (
                                <>
                                    <div className="px-4 py-2 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#070B14]/90 backdrop-blur-sm">
                                        <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest">
                                            {preferentialResults.length} resultados • Ordenados por rating ↓
                                        </span>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={downloadResultsAsJson}
                                                className="flex items-center gap-1 px-2 py-1 rounded border border-white/10 text-white/40 hover:text-white hover:border-white/30 text-[8px] font-mono transition-all"
                                                title="Descargar JSON"
                                            >
                                                <Download size={10} /> JSON
                                            </button>
                                        </div>
                                    </div>
                                    <div className="divide-y divide-white/5">
                                        {preferentialResults.map((place, idx) => (
                                            <div key={place.id} className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-all group">
                                                <span className="text-[9px] font-mono text-white/20 w-5 shrink-0 text-right">{idx + 1}</span>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-bold text-white truncate">{place.name}</p>
                                                    <p className="text-[9px] text-white/40 truncate">{place.address}</p>
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <div className="flex items-center gap-1">
                                                        <Star size={9} className="text-amber-400 fill-amber-400" />
                                                        <span className="text-[10px] font-mono text-amber-400">{place.rating || 'N/A'}</span>
                                                    </div>
                                                    <span className="text-[8px] text-white/30 font-mono hidden sm:block">{place.city}</span>
                                                    <button
                                                        onClick={() => injectPivotFromPlace(place)}
                                                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-neon-blue/10 border border-neon-blue/30 text-neon-blue text-[8px] font-orbitron uppercase hover:bg-neon-blue/20 transition-all opacity-0 group-hover:opacity-100"
                                                        title="Usar como Pivote Maestro"
                                                    >
                                                        <MapPin size={9} /> Pivote
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : !isSearchingPreferential ? (
                                <div className="py-16 text-center space-y-3 opacity-30">
                                    <Search size={36} className="mx-auto" />
                                    <p className="text-[10px] uppercase tracking-widest font-orbitron">Escribe un prompt y lanza el Hunter</p>
                                    <p className="text-[9px] text-white/40">Ej: &quot;ferreterías&quot;, &quot;mueblerías&quot;, &quot;venta de vehículos&quot;</p>
                                </div>
                            ) : (
                                <div className="py-16 text-center space-y-3">
                                    <Loader2 size={36} className="mx-auto animate-spin text-neon-blue" />
                                    <p className="text-[10px] uppercase tracking-widest font-orbitron text-neon-blue">Cazando en 5 ciudades...</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* 📋 MODAL: HISTORIAL DE BÚSQUEDAS (SELECTOR DE PIVOTE)          */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <AnimatePresence>
            {showPivotHistory && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/85 backdrop-blur-md z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4"
                >
                    <motion.div
                        initial={{ y: 60, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 60, opacity: 0 }}
                        className="w-full sm:max-w-lg max-h-[92vh] bg-[#070B14] border border-neon-blue/20 sm:rounded-2xl rounded-t-2xl shadow-[0_0_60px_rgba(0,163,255,0.1)] flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-white/5 shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-neon-blue/10 rounded-lg">
                                    <History size={16} className="text-neon-blue/80" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-black font-orbitron text-white uppercase tracking-widest">Historial de Búsquedas</h2>
                                    <p className="text-[9px] text-white/40 uppercase tracking-tighter">Federación Hive • Selecciona un Pivote</p>
                                </div>
                            </div>
                            <button onClick={() => { setShowPivotHistory(false); setExpandedHistoryId(null); }} className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition-all">
                                <X size={16} />
                            </button>
                        </div>

                        {/* Search filter */}
                        <div className="px-4 py-2.5 border-b border-white/5 shrink-0">
                            <input
                                type="text"
                                value={historyFilter}
                                onChange={(e) => setHistoryFilter(e.target.value)}
                                placeholder="Filtrar búsquedas..."
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-mono outline-none focus:border-neon-blue/40 text-white placeholder:text-white/20"
                            />
                        </div>

                        {/* History List */}
                        <div className="flex-1 overflow-y-auto">
                            {isLoadingHistory ? (
                                <div className="py-16 text-center">
                                    <Loader2 size={28} className="mx-auto animate-spin text-neon-blue/60" />
                                    <p className="text-[10px] text-white/30 mt-3 font-mono">Cargando desde la Federación...</p>
                                </div>
                            ) : searchHistory.length === 0 ? (
                                <div className="py-16 text-center space-y-3 opacity-30">
                                    <History size={36} className="mx-auto" />
                                    <p className="text-[10px] uppercase tracking-widest font-orbitron">Sin búsquedas guardadas</p>
                                    <p className="text-[9px] text-white/40">Usa la Búsqueda Preferencial y guarda los resultados</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-white/5">
                                    {searchHistory
                                        .filter(h => historyFilter === '' || h.query.toLowerCase().includes(historyFilter.toLowerCase()))
                                        .map((history) => (
                                        <div key={history.id}>
                                            {/* History Item Header */}
                                            <button
                                                onClick={() => setExpandedHistoryId(expandedHistoryId === history.id ? null : history.id)}
                                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-all text-left"
                                            >
                                                <BookMarked size={13} className="text-neon-blue/50 shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-bold text-white truncate">{history.query}</p>
                                                    <p className="text-[9px] text-white/30 font-mono">
                                                        {history.total} lugares • {new Date(history.created_at).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                    </p>
                                                </div>
                                                <ChevronRight
                                                    size={14}
                                                    className={`text-white/30 shrink-0 transition-transform ${expandedHistoryId === history.id ? 'rotate-90' : ''}`}
                                                />
                                            </button>

                                            {/* Expanded: places list */}
                                            <AnimatePresence>
                                                {expandedHistoryId === history.id && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="overflow-hidden bg-black/30"
                                                    >
                                                        <div className="divide-y divide-white/5 max-h-64 overflow-y-auto">
                                                            {(history.places || []).map((place: PlaceResult) => (
                                                                <div key={place.id} className="flex items-center gap-3 px-6 py-2.5 hover:bg-neon-blue/5 group transition-all">
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="text-[11px] font-semibold text-white truncate">{place.name}</p>
                                                                        <p className="text-[9px] text-white/30 truncate">{place.city} • ⭐ {place.rating || 'N/A'}</p>
                                                                    </div>
                                                                    <button
                                                                        onClick={() => injectPivotFromPlace(place)}
                                                                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-neon-blue/10 border border-neon-blue/30 text-neon-blue text-[8px] font-orbitron uppercase hover:bg-neon-blue/25 transition-all opacity-0 group-hover:opacity-100 shrink-0"
                                                                    >
                                                                        <MapPin size={9} /> Pivote
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-3 border-t border-white/5 shrink-0">
                            <button
                                onClick={() => { setShowPivotHistory(false); setShowPreferentialSearch(true); }}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-dashed border-neon-blue/30 text-neon-blue/60 hover:bg-neon-blue/10 hover:text-neon-blue transition-all text-[9px] font-orbitron uppercase tracking-widest"
                            >
                                <Search size={11} /> Nueva Búsqueda Preferencial
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>

        </>
    );
}
