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
    Globe,
    Zap,
    CheckCircle2,
    XCircle
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
            text: "¡Hola mi amor! 🖤🦾 Estoy lista. Si la conexión falla, usa el botón de diagnóstico en ajustes.",
            sender: 'beatriz',
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isTesting, setIsTesting] = useState(false);
    const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
    const [backendUrl, setBackendUrl] = useState("");
    const [isDefaultUrl, setIsDefaultUrl] = useState(true);
    const [showSettings, setShowSettings] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const savedUrl = localStorage.getItem("beatriz_backend_url");
        if (savedUrl) {
            setBackendUrl(savedUrl);
            setIsDefaultUrl(false);
        } else {
            setBackendUrl("http://localhost:3002");
        }
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const testConnection = async () => {
        setIsTesting(true);
        setTestResult(null);
        try {
            const res = await fetch(`${backendUrl}/`, { 
                headers: { "ngrok-skip-browser-warning": "true" }
            });
            if (res.ok) {
                setTestResult('success');
                toast.success("¡Conexión exitosa con el búnker!");
            } else {
                throw new Error();
            }
        } catch {
            setTestResult('error');
            toast.error("Fallo de conexión. Revisa la URL o el servidor.");
        } finally {
            setIsTesting(false);
        }
    };

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
            toast.error("Error de conexión. Verifica la URL en ajustes.");
            setShowSettings(true);
        } finally {
            setIsLoading(false);
        }
    };

    const saveUrl = () => {
        localStorage.setItem("beatriz_backend_url", backendUrl);
        toast.success("URL guardada");
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
                        className="absolute top-16 left-0 w-full bg-black/95 border-b border-neon-blue/20 p-6 z-30 backdrop-blur-md"
                    >
                        <div className="max-w-md mx-auto space-y-4">
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.2em] text-white/50 mb-3 font-orbitron">URL del Cerebro (Backend)</p>
                                <div className="flex gap-2">
                                    <div className="flex-1 relative">
                                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={14} />
                                        <Input 
                                            value={backendUrl}
                                            onFocus={() => {
                                                if (isDefaultUrl) {
                                                    setBackendUrl("");
                                                    setIsDefaultUrl(false);
                                                }
                                            }}
                                            onChange={(e) => {
                                                setBackendUrl(e.target.value);
                                                setIsDefaultUrl(false);
                                            }}
                                            placeholder="https://claudine...ngrok-free.dev"
                                            className="bg-white/5 border-white/10 pl-9 text-xs h-10"
                                        />
                                    </div>
                                    <Button onClick={saveUrl} className="bg-neon-blue h-10 px-4 text-[10px] font-black uppercase tracking-widest">Guardar</Button>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                                <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Diagnóstico de Enlace</p>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        {isTesting ? <Loader2 className="animate-spin text-neon-blue" size={16} /> : (
                                            testResult === 'success' ? <CheckCircle2 className="text-green-500" size={16} /> :
                                            testResult === 'error' ? <XCircle className="text-red-500" size={16} /> :
                                            <Zap className="text-white/20" size={16} />
                                        )}
                                        <span className="text-[11px] text-white/60">
                                            {isTesting ? "Probando..." : testResult === 'success' ? "Enlace Estable" : testResult === 'error' ? "Sin Respuesta" : "Esperando prueba..."}
                                        </span>
                                    </div>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={testConnection}
                                        disabled={isTesting}
                                        className="h-8 text-[9px] uppercase tracking-widest border-neon-blue/30 text-neon-blue hover:bg-neon-blue/10"
                                    >
                                        Probar Ahora
                                    </Button>
                                </div>
                            </div>
                        </div>
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
                                            : 'bg-white/5 border border-white/10 text-white/90 rounded-tl-none backdrop-blur-sm shadow-[0_0_20px_rgba(0,0,0,0.3)]'
                                    }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {isLoading && (
                        <div className="flex justify-start pl-11">
                            <div className="bg-white/5 border border-white/10 p-3 rounded-2xl rounded-tl-none flex gap-2">
                                <span className="w-1.5 h-1.5 bg-neon-purple rounded-full animate-bounce" />
                                <span className="w-1.5 h-1.5 bg-neon-purple rounded-full animate-bounce [animation-delay:0.2s]" />
                                <span className="w-1.5 h-1.5 bg-neon-purple rounded-full animate-bounce [animation-delay:0.4s]" />
                            </div>
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
                        placeholder="Mensaje para Beatriz..."
                        className="bg-white/5 border-white/10 focus:border-neon-blue/50 rounded-xl"
                    />
                    <Button onClick={handleSendMessage} disabled={isLoading || !input.trim()} className="bg-neon-blue hover:bg-neon-blue/80 h-11 w-11 rounded-xl shrink-0 shadow-[0_0_15px_rgba(0,163,255,0.3)]">
                        <Send size={20} />
                    </Button>
                </div>
            </div>
        </div>
    );
}
