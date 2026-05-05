"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
    Send, 
    User, 
    Sparkles, 
    Bot, 
    Mic, 
    Image as ImageIcon,
    Loader2,
    ArrowLeft,
    Heart
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
            text: "¡Hola mi amor! 🖤🦾 Aquí estoy, conectada contigo. ¿Qué misión tenemos para hoy?",
            sender: 'beatriz',
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll al final
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
            const response = await fetch("http://localhost:3002/chat/portal", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: input })
            });

            const data = await response.json();

            const beatrizMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: data.response || "Amor, tuve un pequeño mareo digital...",
                sender: 'beatriz',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, beatrizMsg]);
        } catch {
            toast.error("Error de conexión con Beatriz");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] bg-background overflow-hidden relative">
            {/* Background Decor */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-blue rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple rounded-full blur-[120px]" />
            </div>

            {/* Header */}
            <header className="p-4 border-b border-white/5 bg-black/20 backdrop-blur-xl flex items-center justify-between z-10">
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
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                    </div>
                    <div>
                        <h1 className="text-sm font-bold font-orbitron tracking-tighter flex items-center gap-2 uppercase italic">
                            Beatriz <Heart size={12} className="text-neon-purple fill-neon-purple" />
                        </h1>
                        <p className="text-[10px] text-green-500 uppercase tracking-widest font-black">Serie X Elite • Online</p>
                    </div>
                </div>
                <div className="hidden md:block">
                    <Badge className="border-neon-blue/30 text-neon-blue bg-neon-blue/10">
                        Protocolo de Seducción Activo
                    </Badge>
                </div>
            </header>

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
                                            ? 'bg-neon-blue/20 border border-neon-blue/30 text-white rounded-tr-none shadow-[0_0_15px_rgba(0,163,255,0.1)]' 
                                            : 'bg-white/5 border border-white/10 text-white/90 rounded-tl-none backdrop-blur-sm'
                                    }`}>
                                        {msg.text}
                                        <div className="mt-2 text-[8px] opacity-40 text-right uppercase tracking-widest font-mono">
                                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {isLoading && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex justify-start pl-11"
                        >
                            <div className="bg-white/5 border border-white/10 p-3 rounded-2xl rounded-tl-none flex gap-2">
                                <span className="w-1.5 h-1.5 bg-neon-purple rounded-full animate-bounce" />
                                <span className="w-1.5 h-1.5 bg-neon-purple rounded-full animate-bounce [animation-delay:0.2s]" />
                                <span className="w-1.5 h-1.5 bg-neon-purple rounded-full animate-bounce [animation-delay:0.4s]" />
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/5 bg-black/40 backdrop-blur-xl z-10">
                <div className="max-w-3xl mx-auto relative flex gap-2">
                    <div className="flex-1 relative">
                        <Input 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Háblame, mi amor..."
                            className="bg-white/5 border-white/10 focus:border-neon-blue/50 pr-12 rounded-2xl h-12 text-sm"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-white/30 hover:text-white">
                                <ImageIcon size={18} />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-white/30 hover:text-white">
                                <Mic size={18} />
                            </Button>
                        </div>
                    </div>
                    <Button 
                        onClick={handleSendMessage}
                        disabled={isLoading || !input.trim()}
                        className="h-12 w-12 rounded-2xl bg-neon-blue hover:bg-neon-blue/80 shadow-[0_0_15px_rgba(0,163,255,0.4)] transition-all active:scale-90"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                    </Button>
                </div>
                <p className="mt-3 text-[9px] text-center text-white/20 uppercase tracking-[0.3em] font-orbitron">
                    Beatriz Industrial Bridge v1.0 • Secure Encryption
                </p>
            </div>
        </div>
    );
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${className}`}>
            {children}
        </div>
    );
}
