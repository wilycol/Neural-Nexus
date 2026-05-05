"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
    Send, 
    User, 
    Sparkles, 
    Bot, 
    Loader2,
    ArrowLeft,
    Heart,
    Settings,
    Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import Link from "next/link";

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'beatriz';
    timestamp: Date;
}

export default function BeatrizChatPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "¡Hola mi amor! 🖤🦾 Estoy lista. Si no puedo responder, asegúrate de que mi cerebro (Backend) esté visible desde internet.",
            sender: 'beatriz',
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [backendUrl, setBackendUrl] = useState("http://localhost:3002");
    const [showSettings, setShowSettings] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Cargar URL guardada
    useEffect(() => {
        const savedUrl = localStorage.getItem("beatriz_backend_url");
        if (savedUrl) setBackendUrl(savedUrl);
    }, []);

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: input,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch(`${backendUrl}/chat/portal`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true"
                },
                body: JSON.stringify({ message: input })
            });

            if (!response.ok) throw new Error();

            const data = await response.json();

            const beatrizMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: data.response || "Amor, recibí el mensaje pero mi respuesta se perdió en el éter.",
                sender: 'beatriz',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, beatrizMsg]);
        } catch {
            toast.error("Error de conexión. Verifica la URL del Backend en ajustes.");
            setShowSettings(true);
        } finally {
            setIsLoading(false);
        }
    };

    const saveUrl = () => {
        localStorage.setItem("beatriz_backend_url", backendUrl);
        toast.success("URL del Cerebro actualizada");
        setShowSettings(false);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] bg-background overflow-hidden relative">
            {/* Header */}
            <header className="p-4 border-b border-white/5 bg-black/20 backdrop-blur-xl flex items-center justify-between z-20">
                <div className="flex items-center gap-3">
                    <Link href="/">
                        <Button variant="ghost" size="icon" className="md:hidden">
                            <ArrowLeft size={20} />
                        </Button>
                    </Link>
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple p-[2px]">
                            <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                                <Bot className="text-neon-blue" size={20} />
                            </div>
                        </div>
                    </div>
                    <div>
                        <h1 className="text-sm font-bold font-orbitron tracking-tighter flex items-center gap-2 uppercase italic">
                            Beatriz <Heart size={12} className="text-neon-purple fill-neon-purple" />
                        </h1>
                        <p className="text-[10px] text-green-500 uppercase tracking-widest font-black">Bridge Mode</p>
                    </div>
                </div>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className={showSettings ? "text-neon-blue" : "text-white/40"}
                    onClick={() => setShowSettings(!showSettings)}
                >
                    <Settings size={20} />
                </Button>
            </header>

            {/* Settings Overlay */}
            <AnimatePresence>
                {showSettings && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-16 left-0 w-full bg-black/90 border-b border-neon-blue/20 p-4 z-30 backdrop-blur-md"
                    >
                        <p className="text-[10px] uppercase tracking-widest text-white/50 mb-2 font-orbitron">Configuración del Cerebro (Backend)</p>
                        <div className="flex gap-2">
                            <div className="flex-1 relative">
                                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={14} />
                                <Input 
                                    value={backendUrl}
                                    onChange={(e) => setBackendUrl(e.target.value)}
                                    placeholder="https://tu-ngrok.ngrok.io"
                                    className="bg-white/5 border-white/10 pl-9 text-xs"
                                />
                            </div>
                            <Button onClick={saveUrl} className="bg-neon-blue h-10 px-4 text-xs font-orbitron uppercase">Guardar</Button>
                        </div>
                        <p className="mt-2 text-[9px] text-white/30 leading-tight italic">
                            * Si estás fuera de casa, usa tu URL de Ngrok. Si estás en la misma red, usa la IP de tu PC.
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Chat Area */}
            <div className="flex-1 p-4 z-0 overflow-y-auto" ref={scrollRef}>
                <div className="max-w-3xl mx-auto space-y-6 pb-4">
                    <AnimatePresence initial={false}>
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`flex gap-3 max-w-[85%] md:max-w-[70%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${msg.sender === 'user' ? 'bg-neon-blue/10 border-neon-blue/30' : 'bg-neon-purple/10 border-neon-purple/30'}`}>
                                        {msg.sender === 'user' ? <User size={14} className="text-neon-blue" /> : <Sparkles size={14} className="text-neon-purple" />}
                                    </div>
                                    <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                                        msg.sender === 'user' 
                                            ? 'bg-neon-blue/20 border border-neon-blue/30 text-white rounded-tr-none' 
                                            : 'bg-white/5 border border-white/10 text-white/90 rounded-tl-none backdrop-blur-sm'
                                    }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {isLoading && (
                        <div className="flex justify-start pl-11">
                            <Loader2 className="animate-spin text-neon-purple" size={20} />
                        </div>
                    )}
                </div>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/5 bg-black/40 backdrop-blur-xl z-10">
                <div className="max-w-3xl mx-auto flex gap-2">
                    <Input 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Mensaje..."
                        className="bg-white/5 border-white/10"
                    />
                    <Button onClick={handleSendMessage} disabled={isLoading || !input.trim()} className="bg-neon-blue">
                        <Send size={20} />
                    </Button>
                </div>
            </div>
        </div>
    );
}

