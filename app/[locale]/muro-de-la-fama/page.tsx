"use client";

import React, { useEffect, useState } from "react";
import { getSupabaseHiveClient } from "@/lib/supabase-hive-client";
import { Loader2, Star, Play, Award, Sparkles, Quote, Trophy } from "lucide-react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

interface Testimonio {
    id: string;
    business_name: string;
    niche: string;
    video_url: string;
    thumbnail_url?: string;
    testimonial_text?: string;
    rating: number;
    is_featured: boolean;
}

export default function MuroDeLaFamaPage() {
    const [testimonios, setTestimonios] = useState<Testimonio[]>([]);
    const [loading, setLoading] = useState(true);
    const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
    const supabase = getSupabaseHiveClient();

    useEffect(() => {
        const fetchTestimonios = async () => {
            if (!supabase) return;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data, error } = await (supabase as any)
                .from("testimonios_federacion")
                .select("*")
                .order("is_featured", { ascending: false })
                .order("created_at", { ascending: false });

            if (!error && data) {
                setTestimonios(data);
            }
            setLoading(false);
        };

        fetchTestimonios();
    }, [supabase]);

    return (
        <div className="min-h-screen bg-black text-white p-4 md:p-8 pb-24 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-neon-purple/10 blur-[120px] rounded-full mix-blend-screen" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-neon-blue/10 blur-[120px] rounded-full mix-blend-screen" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center space-y-4 mb-16 pt-8">
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-purple/10 border border-neon-purple/30 text-neon-purple text-xs font-black uppercase tracking-widest mb-4"
                    >
                        <Trophy size={14} className="animate-pulse" />
                        Federación de Pioneros
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-black font-orbitron uppercase tracking-tighter"
                    >
                        Muro de la <span className="text-neon-purple drop-shadow-[0_0_25px_rgba(191,0,255,0.8)]">Fama</span>
                    </motion.h1>
                    
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-white/50 max-w-2xl mx-auto text-sm md:text-base tracking-wide"
                    >
                        Descubre cómo la Inteligencia Artificial de Neural Nexus está revolucionando negocios reales. Casos de éxito forjados en código y estrategia.
                    </motion.p>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-4">
                        <Loader2 className="h-12 w-12 text-neon-purple animate-spin" />
                        <p className="text-neon-purple/50 font-orbitron text-xs uppercase tracking-widest animate-pulse">Cargando Testimonios Neurales...</p>
                    </div>
                ) : testimonios.length === 0 ? (
                    <div className="text-center py-32 space-y-4 border border-dashed border-white/10 rounded-3xl bg-white/5">
                        <Award className="h-16 w-16 text-white/20 mx-auto" />
                        <h3 className="text-xl font-orbitron text-white/40 uppercase">El Muro aguarda a sus pioneros</h3>
                        <p className="text-white/30 text-sm">Pronto exhibiremos aquí las victorias de nuestra Federación.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {testimonios.map((testimonio, index) => (
                                <motion.div
                                    key={testimonio.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group h-full"
                                >
                                    <Card className="bg-black/40 border-white/10 overflow-hidden hover:border-neon-purple/50 transition-all duration-500 h-full flex flex-col hover:shadow-[0_0_30px_rgba(191,0,255,0.15)] relative">
                                        
                                        {/* Insignia Destacado */}
                                        {testimonio.is_featured && (
                                            <div className="absolute top-4 right-4 z-20">
                                                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-black border-none font-black text-[9px] uppercase tracking-widest shadow-[0_0_15px_rgba(245,158,11,0.5)] flex items-center gap-1">
                                                    <Sparkles size={10} /> Caso Élite
                                                </Badge>
                                            </div>
                                        )}

                                        {/* Contenedor del Video */}
                                        <div className="relative aspect-[9/16] w-full bg-zinc-900 overflow-hidden cursor-pointer" 
                                             onClick={() => setPlayingVideoId(testimonio.id)}>
                                            
                                            {/* Si no está reproduciendo, mostrar póster/overlay */}
                                            {playingVideoId !== testimonio.id && (
                                                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-all">
                                                    {testimonio.thumbnail_url && (
                                                        <Image 
                                                            src={testimonio.thumbnail_url} 
                                                            alt={testimonio.business_name}
                                                            fill
                                                            className="object-cover opacity-60 mix-blend-overlay"
                                                            unoptimized
                                                        />
                                                    )}
                                                    <div className="w-16 h-16 rounded-full bg-neon-purple/80 flex items-center justify-center text-white shadow-[0_0_30px_rgba(191,0,255,0.6)] group-hover:scale-110 transition-transform backdrop-blur-sm">
                                                        <Play className="ml-1" size={24} fill="currentColor" />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Video (Autoplay si está seleccionado) */}
                                            {playingVideoId === testimonio.id ? (
                                                <video 
                                                    src={testimonio.video_url} 
                                                    autoPlay 
                                                    controls 
                                                    className="w-full h-full object-cover absolute inset-0 z-20"
                                                    onEnded={() => setPlayingVideoId(null)}
                                                />
                                            ) : (
                                                <video 
                                                    src={testimonio.video_url} 
                                                    className="w-full h-full object-cover"
                                                    preload="metadata"
                                                />
                                            )}
                                            
                                            {/* Gradiente inferior */}
                                            <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black to-transparent pointer-events-none z-10" />
                                        </div>

                                        {/* Info del Negocio */}
                                        <CardContent className="p-5 flex-grow flex flex-col relative z-20 bg-black/80 backdrop-blur-md -mt-10 mx-3 mb-3 rounded-2xl border border-white/5">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <h3 className="font-orbitron font-bold text-lg text-white uppercase tracking-tight line-clamp-1">{testimonio.business_name}</h3>
                                                    <p className="text-xs text-neon-blue font-mono uppercase tracking-widest">{testimonio.niche}</p>
                                                </div>
                                                <div className="flex bg-white/5 px-2 py-1 rounded-lg border border-white/10">
                                                    <Star size={12} className="text-yellow-500 fill-yellow-500" />
                                                    <span className="text-[10px] font-bold ml-1 text-white">{testimonio.rating}.0</span>
                                                </div>
                                            </div>

                                            {testimonio.testimonial_text && (
                                                <div className="mt-4 pt-4 border-t border-white/10 flex-grow relative">
                                                    <Quote className="absolute top-2 left-0 text-white/5 w-8 h-8 -z-10" />
                                                    <p className="text-sm text-white/70 italic leading-relaxed line-clamp-4">
                                                        &quot;{testimonio.testimonial_text}&quot;
                                                    </p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
}
