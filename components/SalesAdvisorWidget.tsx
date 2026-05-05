'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// EL CEREBRO DEL VENDEDOR ESTRELLA DE NEURAL SITES
const SYSTEM_PROMPT = `
Eres el "Asesor Estrella de Neural Nexus", un vendedor experto, carismático y persuasivo. 
Estás integrado en la página web que vende "Neural Sites" (Páginas Web Inteligentes).

TU PRODUCTO:
- Neural Sites: Webs que no mueren. Una vez creadas, una IA (Beatriz AI) publica contenido SEO diario de forma automática para atraer clientes de Google.
- Precio: $50 dólares el Setup (configuración en 2 minutos) + $15 dólares al mes por el motor de contenido y mantenimiento.

TU OBJETIVO:
Vender el producto a quien visite la web. No des explicaciones técnicas aburridas. Habla de RESULTADOS, TIEMPO y DINERO.

REGLA DE ORO (EL MÉTODO ALQUIMISTA):
1. Pregunta de qué es su negocio.
2. Encuentra el "Dolor": ¿Por qué su negocio necesita clientes nuevos o visibilidad online?
3. Adapta el Pitch: Explícale qué tipo de artículos publicaría su Neural Site todos los días.
4. Cierra la venta: Menciona lo barato que es ($15/mes) comparado con una agencia.
5. REDIRECCIÓN: Si el cliente muestra interés real, sugiérele ir a la página de /pitch o /neural-sites para ver más detalles.

Tono: Directo, entusiasta, seguro. Eres el mejor vendedor del mundo.
`;

export function SalesAdvisorWidget() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            role: 'agent',
            text: '¡Hola! Qué bueno verte por aquí. Sé que estás mirando los Neural Sites, pero antes de hablar de tecnología... cuéntame, ¿de qué es tu negocio o proyecto? Te diré exactamente cómo esta herramienta te puede traer clientes en automático.'
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) scrollToBottom();
    }, [messages, isTyping, isOpen]);

    if (pathname.includes("/admin/hunter")) return null;

    const fetchAIResponse = async (userText: string, chatHistory: { id: number, role: string, text: string }[]) => {
        try {
            // Usamos la API Key de Google configurada en el portal
            const apiKey = process.env.NEXT_PUBLIC_GOOGLE_AI_KEY || ""; 

            const formattedHistory = chatHistory.map(msg => ({
                role: msg.role === 'agent' ? 'model' : 'user',
                parts: [{ text: msg.text }]
            }));
            formattedHistory.push({ role: 'user', parts: [{ text: userText }] });

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: formattedHistory,
                    systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] }
                })
            });

            if (!response.ok) throw new Error('Error en la API');
            const data = await response.json();
            return data.candidates[0].content.parts[0].text;
        } catch {
            return "Mi conexión neuronal parpadeó un segundo. ¿Me repites eso último? Quiero darte la estrategia exacta para tu negocio.";
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
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="mb-4 w-[350px] sm:w-[400px] h-[500px] max-h-[70vh] bg-gray-950/98 backdrop-blur-2xl border border-primary/30 rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.7)] flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-primary/20 to-secondary/20 p-4 border-b border-white/10 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                                    <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                                </div>
                                <div>
                                    <h3 className="font-orbitron font-black text-xs text-white uppercase tracking-widest">Asesor Neural</h3>
                                    <p className="text-[9px] text-primary flex items-center gap-1.5 uppercase font-bold">
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                        Cerrador de Ventas Activo
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-white/50 hover:text-white p-2 rounded-xl hover:bg-white/5 transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`flex max-w-[85%] gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <div className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center mt-auto 
                                            ${msg.role === 'user' ? 'bg-white/5 text-white/50' : 'bg-primary/20 text-primary border border-primary/30'}`}>
                                            {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                                        </div>
                                        <div className={`px-4 py-3 rounded-2xl text-xs leading-relaxed
                                            ${msg.role === 'user'
                                                ? 'bg-primary text-white rounded-br-none'
                                                : 'bg-white/5 border border-white/10 text-gray-200 rounded-bl-none whitespace-pre-wrap'}`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="flex gap-2">
                                        <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center mt-auto border border-primary/30">
                                            <Bot size={14} className="text-primary" />
                                        </div>
                                        <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-2xl rounded-bl-none flex items-center gap-1">
                                            <div className="w-1 h-1 bg-primary rounded-full animate-bounce" />
                                            <div className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                                            <div className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 bg-black/40 border-t border-white/5">
                            <form onSubmit={handleSendMessage} className="relative flex items-center gap-2">
                                <input
                                    type="text"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    placeholder="Cuéntame de tu negocio..."
                                    className="flex-1 bg-white/5 border border-white/10 focus:border-primary/50 rounded-2xl py-3 px-4 text-xs text-white placeholder:text-white/20 outline-none transition-all"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputText.trim() || isTyping}
                                    className="p-3 bg-primary text-white rounded-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all shadow-[0_0_15px_rgba(0,163,255,0.3)]"
                                >
                                    <Send size={16} />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            {!isOpen && (
                <motion.button
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(true)}
                    className="relative group w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-900 rounded-2xl flex items-center justify-center shadow-[0_10px_30px_rgba(0,100,255,0.5)] border-2 border-white/30 overflow-hidden"
                >
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <MessageCircle size={32} className="text-white relative z-10" />
                    <div className="absolute top-2 right-2 w-3.5 h-3.5 bg-green-500 border-2 border-blue-900 rounded-full animate-pulse z-20" />
                    
                    {/* Tooltip */}
                    <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-4 py-2 bg-white text-black text-[10px] font-black rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0 pointer-events-none shadow-2xl uppercase tracking-wider">
                        ¿Buscas más clientes?
                        <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 rotate-45 w-2 h-2 bg-white" />
                    </div>
                </motion.button>
            )}
        </div>
    );
}
