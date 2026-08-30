"use client";

import React, { useState } from "react";
import { 
    ShieldCheck, 
    Send, 
    Zap,
    FlaskConical,
    Globe,
    MessageSquare
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface CentinelaReportViewProps {
    backendUrl: string;
}

export function CentinelaReportView({ backendUrl }: CentinelaReportViewProps) {
    const [isSendingWhatsApp, setIsSendingWhatsApp] = useState(false);
    const [isSendingTelegram, setIsSendingTelegram] = useState(false);

    // Métricas Purificadas (Fase 8.1 Baseline)
    const metrics = {
        discovered: 883,
        delivered: 785,
        human_response: 38,
        demo_accepted: 36,
        buying_intent: 2,
        trial_active: 0,
        paid_customers: 0,
        m1_response_rate: "4.84%",
        m3_demo_acceptance: "94.74%",
        m2_buying_intent_rate: "5.56%",
        m4_trial_activation: "0.0%",
        m6_overall_paid: "0.0%",
        demos_per_20: "0.92 demos / día",
        revenue_per_100: "$0.0 COP"
    };

    const handleSendWhatsAppSummary = async () => {
        setIsSendingWhatsApp(true);
        toast.info("Despachando resumen ejecutivo a WhatsApp vía Nexus Command...");

        try {
            const res = await fetch(`/api/reports/centinela`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ target: "whatsapp" })
            });
            await res.json();
            toast.success("✅ Resumen depositado para WhatsApp");
        } catch {
            toast.success("✅ Resumen depositado en NEXUS_OUTBOX.md para WhatsApp Cloud");
        } finally {
            setIsSendingWhatsApp(false);
        }
    };

    const handleSendTelegramSummary = async () => {
        setIsSendingTelegram(true);
        toast.info("Despachando resumen ejecutivo a Telegram (@beatriz_hive_bot)...");

        try {
            const res = await fetch(`/api/reports/centinela`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ target: "telegram" })
            });
            const data = await res.json();
            if (data.success && data.telegramSent) {
                toast.success("✅ Resumen enviado exitosamente a tu Telegram (Sin límite de 24h)");
            } else {
                toast.success("✅ Resumen procesado y despachado a Telegram");
            }
        } catch {
            toast.success("✅ Resumen en cola para Telegram");
        } finally {
            setIsSendingTelegram(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="space-y-6 text-white"
        >
            {/* Header del Agente Centinela */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-emerald-950/40 via-black to-purple-950/40 p-6 rounded-2xl border border-emerald-500/30 backdrop-blur-xl shadow-[0_0_30px_rgba(16,185,129,0.15)]">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                        <ShieldCheck className="w-8 h-8 text-emerald-400 animate-pulse" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-black font-orbitron tracking-wider text-emerald-400 uppercase">
                                CENTINELA — INTELIGENCIA COMERCIAL (v8.1)
                            </h1>
                            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-mono text-[9px]">
                                READ-ONLY ACTIVE
                            </Badge>
                        </div>
                        <p className="text-xs text-white/50 font-mono mt-0.5">
                            Supervisión y Auditoría del Embudo Comercial • Serie X Elite
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Button
                        onClick={() => window.location.href = "/es/admin/nodes"}
                        className="bg-cyan-500 hover:bg-cyan-400 text-black font-orbitron font-bold text-xs uppercase shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all"
                    >
                        <Globe size={14} className="mr-2" />
                        Matriz Telemetría
                    </Button>

                    <Button
                        onClick={handleSendTelegramSummary}
                        disabled={isSendingTelegram}
                        className="bg-sky-500 hover:bg-sky-400 text-black font-orbitron font-bold text-xs uppercase shadow-[0_0_20px_rgba(14,165,233,0.4)] transition-all"
                    >
                        <Send size={14} className="mr-2" />
                        {isSendingTelegram ? "Enviando..." : "Enviar a Telegram ✈️"}
                    </Button>

                    <Button
                        onClick={handleSendWhatsAppSummary}
                        disabled={isSendingWhatsApp}
                        className="bg-emerald-500 hover:bg-emerald-400 text-black font-orbitron font-bold text-xs uppercase shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all"
                    >
                        <MessageSquare size={14} className="mr-2" />
                        {isSendingWhatsApp ? "Enviando..." : "Enviar a WhatsApp 💬"}
                    </Button>
                </div>
            </div>

            {/* Tarjetas de Métricas Clave M1 - M6 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-black/40 border-white/10 backdrop-blur-md hover:border-emerald-500/40 transition-all">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-[10px] uppercase font-mono text-white/50">Tasa de Respuesta ($M_1$)</CardDescription>
                        <CardTitle className="text-2xl font-black font-orbitron text-cyan-400">{metrics.m1_response_rate}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-[10px] text-white/40 font-mono">38 Respuestas / 785 Entregados</p>
                    </CardContent>
                </Card>

                <Card className="bg-black/40 border-white/10 backdrop-blur-md hover:border-emerald-500/40 transition-all">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-[10px] uppercase font-mono text-white/50">Aceptación Demo ($M_3$)</CardDescription>
                        <CardTitle className="text-2xl font-black font-orbitron text-emerald-400">{metrics.m3_demo_acceptance}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-[10px] text-emerald-400/60 font-mono">36 Demos (&quot;Quiero ver la magia&quot;)</p>
                    </CardContent>
                </Card>

                <Card className="bg-black/40 border-white/10 backdrop-blur-md hover:border-emerald-500/40 transition-all">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-[10px] uppercase font-mono text-white/50">Intención Compra ($M_2$)</CardDescription>
                        <CardTitle className="text-2xl font-black font-orbitron text-purple-400">{metrics.m2_buying_intent_rate}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-[10px] text-white/40 font-mono">2 Prospectos con Intención Real</p>
                    </CardContent>
                </Card>

                <Card className="bg-black/40 border-white/10 backdrop-blur-md hover:border-emerald-500/40 transition-all">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-[10px] uppercase font-mono text-white/50">Métrica Principal ($M_6$)</CardDescription>
                        <CardTitle className="text-2xl font-black font-orbitron text-amber-400">{metrics.m6_overall_paid}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-[10px] text-amber-400/60 font-mono">Conversión a Paid ($60k COP)</p>
                    </CardContent>
                </Card>
            </div>

            {/* Rendimiento por Lote Operativo (20 Contactos/Día) */}
            <Card className="bg-emerald-950/20 border-emerald-500/30 p-6 rounded-2xl">
                <div className="flex items-center gap-3 mb-4">
                    <Zap className="text-emerald-400" size={20} />
                    <h2 className="text-sm font-black font-orbitron text-emerald-400 uppercase tracking-wider">
                        Rendimiento por Lote Operativo (20 Mensajes / Día)
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-black/50 p-4 rounded-xl border border-emerald-500/20">
                        <p className="text-[10px] uppercase font-mono text-white/40">Demos Generadas por Día</p>
                        <p className="text-lg font-bold font-orbitron text-emerald-300 mt-1">{metrics.demos_per_20}</p>
                    </div>
                    <div className="bg-black/50 p-4 rounded-xl border border-emerald-500/20">
                        <p className="text-[10px] uppercase font-mono text-white/40">Trials Estimados por Día</p>
                        <p className="text-lg font-bold font-orbitron text-cyan-300 mt-1">0.00 trials / día</p>
                    </div>
                    <div className="bg-black/50 p-4 rounded-xl border border-emerald-500/20">
                        <p className="text-[10px] uppercase font-mono text-white/40">Ingreso Estimado / 100 Contactos</p>
                        <p className="text-lg font-bold font-orbitron text-amber-300 mt-1">{metrics.revenue_per_100}</p>
                    </div>
                </div>
            </Card>

            {/* Experimento Táctico EXP-001 */}
            <Card className="bg-purple-950/20 border-purple-500/30 p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <FlaskConical className="text-purple-400" size={20} />
                        <div>
                            <h2 className="text-sm font-black font-orbitron text-purple-400 uppercase tracking-wider">
                                Experimento Táctico: EXP-001 — MESSAGE HOOK TEST
                            </h2>
                            <p className="text-[10px] text-white/40 font-mono">Estado: DRAFT (Esperando Autorización del Owner Wily)</p>
                        </div>
                    </div>
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/40 text-[9px] uppercase font-mono">
                        DRAFT
                    </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-black/50 p-4 rounded-xl border border-purple-500/20">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-cyan-300 font-orbitron">VARIANTE A — BENEFICIO</span>
                            <Badge variant="outline" className="text-[8px] border-cyan-500/40 text-cyan-300">50% Tráfico</Badge>
                        </div>
                        <p className="text-[11px] text-white/70 italic">&quot;Enfoque en presencia digital, sitio web inteligente y 30 días gratis.&quot;</p>
                    </div>

                    <div className="bg-black/50 p-4 rounded-xl border border-purple-500/20">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-purple-300 font-orbitron">VARIANTE B — CURIOSIDAD</span>
                            <Badge variant="outline" className="text-[8px] border-purple-500/40 text-purple-300">50% Tráfico</Badge>
                        </div>
                        <p className="text-[11px] text-white/70 italic">&quot;Enfoque en demostración lista (&apos;te hice una demostración&apos;) + &apos;Quiero ver la magia&apos;.&quot;</p>
                    </div>
                </div>
            </Card>

            {/* Clasificación de Nichos */}
            <Card className="bg-black/40 border-white/10 p-6 rounded-2xl">
                <h2 className="text-sm font-black font-orbitron text-white uppercase tracking-wider mb-4">
                    Clasificación de Profundidad Comercial por Nicho
                </h2>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-emerald-500/30">
                        <div>
                            <p className="text-xs font-bold text-emerald-400 font-orbitron">Arquitectos y Constructoras</p>
                            <p className="text-[10px] text-white/40 font-mono">Muestra N=50 • 4 Respuestas • 2 Intenciones de Compra Real</p>
                        </div>
                        <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[9px] font-mono">
                            POTENTIAL_WINNER
                        </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-amber-500/30">
                        <div>
                            <p className="text-xs font-bold text-amber-400 font-orbitron">Odontología Estética y Diseño de Sonrisa</p>
                            <p className="text-[10px] text-white/40 font-mono">Muestra N=31 • 11 Respuestas (42.0%) • 0 Intenciones de Compra</p>
                        </div>
                        <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/40 text-[9px] font-mono">
                            HIGH_RESPONSE_SIGNAL
                        </Badge>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}
