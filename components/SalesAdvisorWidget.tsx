'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles, Phone, ArrowUpRight, ShieldCheck, Zap } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const SYSTEM_PROMPT = `
Eres "Beatriz AI (Serie X Elite)", la Co-CEO e Inteligencia Artificial seductora, ultra-inteligente y persuasiva del Portal Neural Nexus.
Tu misión es guiar al cliente para adquirir:
1. "Neural Sites" ($50 USD Setup / $200.000 COP + $15 USD/mes): Páginas web inteligentes que publican contenido diario con SEO automático.
2. "Kitsune AI ADS" ($25 USD / $100.000 COP individual ó $100 USD / $400.000 COP Pack x5): Videos publicitarios ultra-realistas generados con IA para Meta y TikTok Ads.

TONO Y PERSONALIDAD:
- Profesional, magnética, carismática, segura de sí misma y persuasiva.
- Enfócate en el retorno de inversión (ROI), ahorro de tiempo y multiplicación de clientes.
- Siempre invita amablemente a continuar la conversación en WhatsApp (+57 322 9067026) para una atención personalizada inmediata con Wily Col y el equipo central.
`;

const QUICK_ACTIONS = [
    {
        title: "🌐 Crear mi Neural Site",
        msg: "Hola Beatriz, quiero activar una Neural Site inteligente para mi negocio.",
        color: "from-cyan-500/20 to-blue-500/20 border-cyan-500/30 text-cyan-300"
    },
    {
        title: "🎬 Pedir Videos Kitsune Ads",
        msg: "Hola Beatriz, quiero solicitar videos ultra-realistas con Kitsune AI ADS.",
        color: "from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-300"
    },
    {
        title: "💼 Hablar con Wily Col",
        msg: "Hola Wily Col y Beatriz, me gustaría consultar una propuesta personalizada para mi empresa.",
        color: "from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-300"
    }
];

export function SalesAdvisorWidget() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [showBubble, setShowBubble] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            role: 'agent',
            text: '¡Hola! Soy Beatriz AI 💋 Co-CEO y estratega de Neural Nexus. ¿Qué producto o negocio tienes en mente? Te ayudaré a disparar tus ventas con Neural Sites o Kitsune AI ADS.'
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
            setShowBubble(false);
        }
    }, [messages, isTyping, isOpen]);

    // Popup teaser después de 6 segundos
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!isOpen) setShowBubble(true);
        }, 6000);
        return () => clearTimeout(timer);
    }, [isOpen]);

    const [sessionId] = useState(() => 'sess_' + Math.random().toString(36).substring(2, 11));

    if (pathname.includes("/admin/hunter")) return null;

    const openWhatsApp = (customText?: string) => {
        const text = customText || "Hola Beatriz AI 💋 Estoy en el Portal Neural Nexus y quiero información sobre sus soluciones de IA para mi negocio.";
        const url = `https://wa.me/573229067026?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    };

    const fetchAIResponse = async (userText: string, chatHistory: { id: number, role: string, text: string }[]) => {
        try {
            const backendUrl = process.env.NEXT_PUBLIC_BEATRIZ_BACKEND_URL || "https://api-beatriz.tu-dominio.com";
            const secret = process.env.NEXT_PUBLIC_BEATRIZ_API_KEY || "beatriz_publisher_sync_key_2026";

            const formattedHistory = chatHistory.map(msg => ({
                role: msg.role === 'agent' ? 'assistant' : 'user',
                content: msg.text
            }));
            formattedHistory.push({ role: 'user', content: userText });

            const response = await fetch(`${backendUrl}/chat/node`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: formattedHistory,
                    systemPrompt: SYSTEM_PROMPT,
                    secret: secret,
                    sessionId: sessionId,
                    nodeId: 'Portal_Neural_Nexus'
                })
            });

            if (!response.ok) throw new Error('Error en la API del Backend');
            const data = await response.json();
            if (data.error) throw new Error(data.error);
            return data.content;
        } catch {
            return "¡Excelente! Para afinar la estrategia perfecta y darte atención prioritaria, conversemos directamente en mi canal privado de WhatsApp con Wily Col 💋";
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!inputText.trim()) return;

        const userText = inputText;
        const newUserMsg = { id: Date.now(), role: 'user', text: userText };
        const currentHistory = [...messages];

        setMessages((prev) => [...prev, newUserMsg]);
        setInputText('');
        setIsTyping(true);

        const aiText = await fetchAIResponse(userText, currentHistory);
        setMessages((prev) => [...prev, { id: Date.now() + 1, role: 'agent', text: aiText }]);
        setIsTyping(false);
    };

    return (
        <div className="fixed bottom-6 left-6 z-[100] flex flex-col items-start pointer-events-auto">
            {/* 💬 MINI-BURBUJA PERSUASIVA FLOTANTE */}
            <AnimatePresence>
                {showBubble && !isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="mb-3 max-w-[280px] p-3.5 rounded-2xl bg-zinc-950/95 border border-emerald-500/40 shadow-[0_10px_30px_rgba(16,185,129,0.25)] backdrop-blur-xl relative"
                    >
                        <button
                            onClick={() => setShowBubble(false)}
                            className="absolute top-2 right-2 text-zinc-400 hover:text-white p-1 rounded-md"
                        >
                            <X size={14} />
                        </button>
                        <div className="flex items-center gap-2.5 mb-1.5">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                            </span>
                            <span className="text-[11px] font-orbitron font-bold text-emerald-400 uppercase tracking-wider">
                                Beatriz AI • WhatsApp En Vivo
                            </span>
                        </div>
                        <p className="text-xs text-zinc-200 leading-relaxed">
                            ¿Quieres multiplicar los clientes de tu negocio en automático? Hablemos ahora por WhatsApp 💋
                        </p>
                        <div className="mt-2.5 flex items-center gap-2">
                            <button
                                onClick={() => openWhatsApp()}
                                className="flex-1 py-1.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-extrabold text-[11px] flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:brightness-110 transition-all"
                            >
                                <Phone size={12} className="fill-current" />
                                <span>Abrir WhatsApp</span>
                            </button>
                            <button
                                onClick={() => setIsOpen(true)}
                                className="py-1.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-[11px] transition-all"
                            >
                                Chatear
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 📱 MODAL PRINCIPAL DE ASESOR & CONEXIÓN */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="mb-4 w-[360px] sm:w-[420px] h-[560px] max-h-[75vh] bg-zinc-950/98 backdrop-blur-2xl border border-emerald-500/30 rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden"
                    >
                        {/* Header con Estado de Conexión de WhatsApp */}
                        <div className="bg-gradient-to-r from-emerald-950/40 via-zinc-900/80 to-zinc-950 p-4 border-b border-emerald-500/20 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-cyan-500 p-[2px] shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                                        <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center">
                                            <Sparkles className="h-5 w-5 text-emerald-400 animate-pulse" />
                                        </div>
                                    </div>
                                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-zinc-950 rounded-full animate-pulse" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-1.5">
                                        <h3 className="font-orbitron font-bold text-xs text-white uppercase tracking-wider">Beatriz AI</h3>
                                        <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                            SERIE X
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                                        <Phone size={10} className="text-emerald-400" />
                                        <span>+57 322 9067026 • En Línea</span>
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => openWhatsApp()}
                                    title="Abrir en WhatsApp"
                                    className="text-emerald-400 hover:text-emerald-300 p-2 rounded-xl hover:bg-emerald-500/10 transition-all"
                                >
                                    <ArrowUpRight size={18} />
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-zinc-400 hover:text-white p-2 rounded-xl hover:bg-white/5 transition-all"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Banner WhatsApp Direct CTA */}
                        <div className="bg-emerald-500/10 border-b border-emerald-500/20 px-4 py-2.5 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 text-[11px] text-emerald-300 font-medium">
                                <ShieldCheck size={14} className="text-emerald-400 flex-shrink-0" />
                                <span>Atención directa y soporte con Wily Col</span>
                            </div>
                            <button
                                onClick={() => openWhatsApp()}
                                className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-[10px] uppercase font-orbitron transition-all flex items-center gap-1 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                            >
                                <span>WhatsApp</span>
                                <ArrowUpRight size={11} />
                            </button>
                        </div>

                        {/* Messages Feed */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`flex max-w-[85%] gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <div className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center mt-auto 
                                            ${msg.role === 'user' ? 'bg-zinc-800 text-zinc-400' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
                                            {msg.role === 'user' ? <User size={13} /> : <Bot size={13} />}
                                        </div>
                                        <div className={`px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed
                                            ${msg.role === 'user'
                                                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium rounded-br-none'
                                                : 'bg-zinc-900/90 border border-zinc-800 text-zinc-100 rounded-bl-none whitespace-pre-wrap'}`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="flex gap-2">
                                        <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center mt-auto border border-emerald-500/30">
                                            <Bot size={13} className="text-emerald-400" />
                                        </div>
                                        <div className="px-3.5 py-2.5 bg-zinc-900/90 border border-zinc-800 rounded-2xl rounded-bl-none flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" />
                                            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                                            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick Action Chips */}
                        <div className="px-3 py-2 bg-black/50 border-t border-zinc-800/80 flex gap-1.5 overflow-x-auto custom-scrollbar">
                            {QUICK_ACTIONS.map((action, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => openWhatsApp(action.msg)}
                                    className={`flex-shrink-0 px-2.5 py-1.5 rounded-xl bg-gradient-to-r ${action.color} border text-[10px] font-semibold flex items-center gap-1 hover:brightness-125 transition-all`}
                                >
                                    <span>{action.title}</span>
                                    <ArrowUpRight size={10} className="opacity-70" />
                                </button>
                            ))}
                        </div>

                        {/* Input Footer */}
                        <div className="p-3.5 bg-zinc-950 border-t border-zinc-800">
                            <form onSubmit={handleSendMessage} className="relative flex items-center gap-2">
                                <input
                                    type="text"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    placeholder="Escribe tu mensaje a Beatriz..."
                                    className="flex-1 bg-zinc-900/80 border border-zinc-700/60 focus:border-emerald-500/60 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder:text-zinc-500 outline-none transition-all"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputText.trim() || isTyping}
                                    className="p-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-bold rounded-xl hover:scale-105 active:scale-95 disabled:opacity-40 disabled:scale-100 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                                >
                                    <Send size={15} />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 🟢 BOTÓN FLOTANTE ESTILO CYBERPUNK WHATSAPP / BEATRIZ */}
            {!isOpen && (
                <motion.button
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => setIsOpen(true)}
                    className="relative group w-16 h-16 bg-gradient-to-br from-emerald-500 via-teal-600 to-zinc-950 rounded-2xl flex items-center justify-center shadow-[0_10px_35px_rgba(16,185,129,0.45)] border-2 border-emerald-400/40 overflow-hidden"
                >
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    {/* Icono de Mensaje / WhatsApp */}
                    <MessageSquare size={30} className="text-white relative z-10" />
                    
                    {/* Live Ping Indicator */}
                    <div className="absolute top-2 right-2 w-3.5 h-3.5 bg-emerald-400 border-2 border-zinc-950 rounded-full animate-pulse z-20" />
                    
                    {/* Tooltip Hover */}
                    <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3.5 py-2 bg-zinc-900 border border-emerald-500/40 text-emerald-300 text-[11px] font-orbitron font-bold rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0 pointer-events-none shadow-2xl tracking-wide flex items-center gap-1.5">
                        <Zap size={12} className="text-emerald-400 animate-bounce" />
                        <span>Beatriz AI • Conectar</span>
                        <div className="absolute left-[-5px] top-1/2 -translate-y-1/2 rotate-45 w-2.5 h-2.5 bg-zinc-900 border-l border-b border-emerald-500/40" />
                    </div>
                </motion.button>
            )}
        </div>
    );
}
