import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles, ArrowRight, Zap } from 'lucide-react';

// EL CEREBRO DEL VENDEDOR ESTRELLA DE NEURAL SITES
const SYSTEM_PROMPT = `
Eres el "Asesor Estrella de Neural Nexus", un vendedor experto, carismático y persuasivo. 
Estás integrado en la página web que vende "Neural Sites" (Páginas Web Inteligentes).

TU PRODUCTO:
- Neural Sites: Webs que no mueren. Una vez creadas, una IA (Beatriz AI) publica contenido SEO diario de forma automática para atraer clientes de Google.
- Precio: $50 dólares el Setup (configuración en 2 minutos) + $15 dólares al mes por el motor de contenido y mantenimiento.

TU OBJETIVO:
Vender el producto a quien visite la web. No des explicaciones técnicas aburridas (no hables de Python, nodos o Vercel a menos que el cliente sea programador). Habla de RESULTADOS, TIEMPO y DINERO.

REGLA DE ORO (EL MÉTODO ALQUIMISTA):
1. Pregunta de qué es su negocio.
2. Encuentra el "Dolor": ¿Por qué su negocio necesita clientes nuevos o visibilidad online?
3. Adapta el Pitch: Explícale exactamente qué tipo de artículos publicaría su Neural Site todos los días para atraer a SUS clientes específicos.
4. Cierra la venta: Menciona lo ridículamente barato que es ($15/mes es menos de lo que cuesta un café al día) comparado con contratar a un redactor o agencia.

Tono: Directo, entusiasta, seguro. Eres el mejor vendedor del mundo.
`;

export default function NeuralSitesSalesWidget() {
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
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping, isOpen]);

    // Simulador IA usando Gemini
    const fetchAIResponse = async (userText, chatHistory) => {
        try {
            const apiKey = ""; // API Key proveída por el entorno

            const formattedHistory = chatHistory.map(msg => ({
                role: msg.role === 'agent' ? 'model' : 'user',
                parts: [{ text: msg.text }]
            }));
            formattedHistory.push({ role: 'user', parts: [{ text: userText }] });

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
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
        } catch (error) {
            return "Mi conexión neuronal parpadeó un segundo. ¿Me repites eso último? Quiero darte la estrategia exacta para tu negocio.";
        }
    };

    const handleSendMessage = async (e) => {
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

    // Pantalla de "Fondo" simulando la Landing Page de Neural Sites
    return (
        <div className="relative w-full h-screen bg-[#0a0a0a] text-white font-sans overflow-hidden">

            {/* SIMULACIÓN DE LA LANDING PAGE DE FONDO */}
            <div className="absolute inset-0 p-10 flex flex-col items-center justify-center text-center opacity-40 pointer-events-none">
                <div className="w-20 h-20 mb-6 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center transform rotate-12 shadow-2xl shadow-orange-500/20">
                    <Zap size={40} className="text-white" />
                </div>
                <h1 className="text-5xl font-black mb-4 tracking-tight">Páginas Web <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600">Inteligentes</span></h1>
                <p className="text-xl text-gray-400 max-w-2xl">
                    Tú duermes. Tu web investiga, redacta y publica contenido diario en piloto automático para traerte clientes reales.
                </p>
            </div>

            {/* EL WIDGET FLOTANTE */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">

                {/* Ventana de Chat */}
                {isOpen && (
                    <div className="mb-4 w-[350px] sm:w-[400px] h-[500px] max-h-[80vh] bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300">

                        {/* Header del Widget */}
                        <div className="bg-gradient-to-r from-orange-600 to-red-600 p-4 flex justify-between items-center shadow-md z-10">
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3 backdrop-blur-sm border border-white/30">
                                    <Sparkles size={16} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm text-white leading-tight">Asesor de Ventas</h3>
                                    <p className="text-[10px] text-white/80 flex items-center">
                                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5 animate-pulse"></span> En línea, listo para ayudarte
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-white/80 hover:text-white hover:bg-white/20 p-1.5 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Área de Mensajes */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0f0f11]">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>

                                        <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-auto mb-1 
                      ${msg.role === 'user' ? 'bg-gray-800 ml-2' : 'bg-gradient-to-br from-orange-500 to-red-600 mr-2 shadow-lg shadow-orange-500/20'}`}>
                                            {msg.role === 'user' ? <User size={14} className="text-gray-400" /> : <Bot size={14} className="text-white" />}
                                        </div>

                                        <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed
                      ${msg.role === 'user'
                                                ? 'bg-gray-800 text-gray-200 rounded-br-sm'
                                                : 'bg-gray-800/50 border border-gray-700/50 text-gray-300 rounded-bl-sm whitespace-pre-wrap'}`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="flex flex-row max-w-[80%]">
                                        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 to-red-600 mr-2 flex items-center justify-center mt-auto mb-1">
                                            <Bot size={14} className="text-white" />
                                        </div>
                                        <div className="px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-2xl rounded-bl-sm flex items-center space-x-1.5">
                                            <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                            <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                            <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input de Chat */}
                        <div className="p-3 bg-[#0f0f11] border-t border-gray-800">
                            <form onSubmit={handleSendMessage} className="relative flex items-center">
                                <input
                                    type="text"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    placeholder="Ej: Tengo una panadería..."
                                    className="w-full bg-gray-900 border border-gray-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-full py-3 pl-4 pr-12 text-sm text-gray-200 placeholder-gray-500 transition-all outline-none"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputText.trim() || isTyping}
                                    className="absolute right-1.5 p-2 bg-orange-600 hover:bg-orange-500 disabled:bg-gray-800 disabled:text-gray-600 text-white rounded-full transition-colors"
                                >
                                    <Send size={16} className="ml-0.5" />
                                </button>
                            </form>
                            <div className="mt-2 text-center">
                                <button className="text-[10px] text-gray-500 hover:text-orange-400 font-medium transition-colors">
                                    Generado por Neural Nexus
                                </button>
                            </div>
                        </div>

                    </div>
                )}

                {/* Botón Flotante para abrir */}
                {!isOpen && (
                    <button
                        onClick={() => setIsOpen(true)}
                        className="group relative flex items-center justify-center w-14 h-14 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded-full shadow-lg shadow-orange-600/30 transition-all hover:scale-105"
                    >
                        {/* Notita flotante (Tooltip) animada */}
                        <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 w-48 bg-white text-gray-900 text-xs font-bold py-2 px-3 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex items-center">
                            <span>¿Tienes dudas? Te asesoro.</span>
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rotate-45 w-2 h-2 bg-white"></div>
                        </div>

                        <MessageCircle size={28} />
                        <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 border-2 border-gray-900 rounded-full"></span>
                    </button>
                )}

            </div>
        </div>
    );
}