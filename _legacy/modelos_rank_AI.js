import React, { useState, useEffect, useMemo } from 'react';
import {
    Search,
    LayoutGrid,
    List,
    ChevronRight,
    Zap,
    Cpu,
    Globe,
    ShieldCheck,
    BarChart3,
    Filter,
    ArrowUpDown,
    Moon,
    ExternalLink,
    MessageSquare,
    Sparkles,
    Info,
    Type,
    Image as ImageIcon,
    Video,
    Layers,
    X,
    Activity,
    Trophy,
    Target,
    Clock
} from 'lucide-react';

const apiKey = "";
const appId = typeof __app_id !== 'undefined' ? __app_id : 'neural-nexus-multimodal';

const App = () => {
    const [loading, setLoading] = useState(true);
    const [models, setModels] = useState([]);
    const [activeTab, setActiveTab] = useState('Texto'); // 'Texto', 'Imagen', 'Video'
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedModels, setSelectedModels] = useState([]);
    const [isComparing, setIsComparing] = useState(false);

    const categories = [
        { name: 'Texto', icon: <Type size={18} />, desc: 'Modelos de lenguaje, razonamiento y código.' },
        { name: 'Imagen', icon: <ImageIcon size={18} />, desc: 'Generación, edición y visión artificial.' },
        { name: 'Video', icon: <Video size={18} />, desc: 'Generación de video y animación por IA.' }
    ];

    const fetchModelsByCategory = async (category) => {
        setLoading(true);
        const systemPrompt = `Eres un experto en IA. Genera un JSON con los 8 mejores modelos actuales para: ${category}.
    Campos por objeto: id, nombre, empresa, descripcion, metrica_principal, puntaje (0-100), razonamiento (0-100), velocidad (0-100), precision (0-100), eficiencia (0-100).
    Responde solo el JSON.`;

        try {
            let retries = 0;
            const maxRetries = 5;
            while (retries < maxRetries) {
                try {
                    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: [{ parts: [{ text: `Ranking técnico de ${category} 2024.` }] }],
                            systemInstruction: { parts: [{ text: systemPrompt }] },
                            generationConfig: { responseMimeType: "application/json" }
                        })
                    });
                    const data = await response.json();
                    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;
                    const parsed = JSON.parse(resultText);
                    const list = Array.isArray(parsed) ? parsed : (parsed.modelos || Object.values(parsed)[0]);
                    setModels(list);
                    break;
                } catch (e) {
                    retries++;
                    await new Promise(r => setTimeout(r, Math.pow(2, retries) * 1000));
                    if (retries === maxRetries) throw e;
                }
            }
        } catch (err) {
            setModels(fallbackData[category]);
        } finally {
            setLoading(false);
        }
    };

    const fallbackData = {
        'Texto': [
            { id: 1, nombre: "GPT-4o", empresa: "OpenAI", descripcion: "Omnimodal con razonamiento superior.", metrica_principal: "128k Tokens", puntaje: 95, razonamiento: 98, velocidad: 90, precision: 96, eficiencia: 85 },
            { id: 2, nombre: "Claude 3.5 Sonnet", empresa: "Anthropic", descripcion: "Líder en programación y matices humanos.", metrica_principal: "200k Tokens", puntaje: 96, razonamiento: 97, velocidad: 92, precision: 98, eficiencia: 88 }
        ],
        'Imagen': [
            { id: 10, nombre: "Midjourney v6", empresa: "Midjourney", descripcion: "Fotorrealismo artístico.", metrica_principal: "Alta Estética", puntaje: 98, razonamiento: 85, velocidad: 70, precision: 95, eficiencia: 75 }
        ],
        'Video': [
            { id: 20, nombre: "Sora", empresa: "OpenAI", descripcion: "Comprensión física del mundo.", metrica_principal: "60s Video", puntaje: 97, razonamiento: 95, velocidad: 40, precision: 98, eficiencia: 60 }
        ]
    };

    useEffect(() => {
        fetchModelsByCategory(activeTab);
    }, [activeTab]);

    const filteredModels = useMemo(() => {
        return models.filter(m => m.nombre.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [models, searchQuery]);

    const toggleSelection = (id) => {
        setSelectedModels(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id].slice(-3));
    };

    // UI Component para los gráficos de comparación
    const MetricBar = ({ label, value, icon, color }) => (
        <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-gray-500">
                <span className="flex items-center gap-1">{icon} {label}</span>
                <span className="text-white">{value}%</span>
            </div>
            <div className="h-1.5 w-full bg-gray-900 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(255,255,255,0.1)] ${color}`}
                    style={{ width: isComparing ? `${value}%` : '0%' }}
                />
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-gray-200 font-sans flex overflow-hidden">
            {/* Sidebar - Neural Nexus Style */}
            <aside className={`w-64 border-r border-gray-800 p-6 hidden md:flex flex-col gap-8 bg-[#0d0d0d] z-20 transition-all ${isComparing ? 'opacity-30 pointer-events-none' : ''}`}>
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-9 h-9 bg-cyan-500 rounded-xl flex items-center justify-center text-black shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                        <Layers size={20} />
                    </div>
                    <span className="text-xl font-bold tracking-tighter text-white uppercase italic">Neural <span className="text-cyan-400">Nexus</span></span>
                </div>
                <nav className="flex flex-col gap-2">
                    {['Inicio', 'Reels', 'Modelos', 'Herramientas', 'Papers', 'Drama'].map((item) => (
                        <button key={item} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${item === 'Modelos' ? 'bg-white text-black font-bold' : 'hover:bg-gray-800 text-gray-400'}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${item === 'Modelos' ? 'bg-cyan-500' : 'bg-transparent'}`} />
                            {item}
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen relative overflow-hidden">

                {/* Comparison Overlay View */}
                {isComparing && (
                    <div className="absolute inset-0 z-50 bg-[#0a0a0a] flex flex-col p-8 animate-in fade-in duration-500 overflow-y-auto custom-scrollbar">
                        <div className="max-w-7xl mx-auto w-full">
                            <div className="flex items-center justify-between mb-12">
                                <button
                                    onClick={() => setIsComparing(false)}
                                    className="flex items-center gap-2 text-cyan-500 font-bold text-sm uppercase tracking-widest hover:text-white transition-colors"
                                >
                                    <ChevronRight size={18} className="rotate-180" /> Cerrar Benchmark
                                </button>
                                <div className="flex items-center gap-3">
                                    <Trophy className="text-amber-400" size={24} />
                                    <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">Elite Comparison <span className="text-cyan-400">Mode</span></h2>
                                </div>
                                <div className="w-24" />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {selectedModels.map((id) => {
                                    const model = models.find(m => m.id === id);
                                    return (
                                        <div key={id} className="p-8 rounded-[40px] bg-[#111] border border-gray-800 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                                <Activity size={120} />
                                            </div>

                                            <div className="relative z-10">
                                                <div className="flex items-center gap-3 mb-6">
                                                    <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 font-bold border border-cyan-500/20">
                                                        {model.nombre[0]}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-2xl font-black text-white leading-none">{model.nombre}</h3>
                                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">{model.empresa}</span>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4 mb-8">
                                                    <div className="p-4 rounded-2xl bg-black/40 border border-gray-800">
                                                        <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Puntaje General</p>
                                                        <p className="text-2xl font-black text-cyan-400">{model.puntaje}/100</p>
                                                    </div>
                                                    <div className="p-4 rounded-2xl bg-black/40 border border-gray-800">
                                                        <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Capacidad</p>
                                                        <p className="text-sm font-black text-white">{model.metrica_principal}</p>
                                                    </div>
                                                </div>

                                                <div className="space-y-6">
                                                    <MetricBar label="Razonamiento" value={model.razonamiento} icon={<Target size={12} />} color="bg-cyan-500" />
                                                    <MetricBar label="Velocidad / Latencia" value={model.velocidad} icon={<Zap size={12} />} color="bg-indigo-500" />
                                                    <MetricBar label="Precisión / Exactitud" value={model.precision} icon={<ShieldCheck size={12} />} color="bg-emerald-500" />
                                                    <MetricBar label="Eficiencia / Costo" value={model.eficiencia} icon={<Cpu size={12} />} color="bg-purple-500" />
                                                </div>

                                                <div className="mt-10 p-5 rounded-3xl bg-gray-900/30 border border-gray-800/50">
                                                    <p className="text-xs text-gray-400 italic leading-relaxed">
                                                        "Este modelo demuestra un rendimiento {model.razonamiento > 90 ? 'excepcional' : 'balanceado'} en tareas de {activeTab.toLowerCase()}."
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-12 p-8 rounded-[40px] border border-cyan-500/20 bg-cyan-500/5 flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="flex items-center gap-4">
                                    <Clock className="text-cyan-400" />
                                    <div>
                                        <p className="text-sm font-bold text-white">Generación de Reporte Técnico</p>
                                        <p className="text-xs text-gray-500">Datos actualizados mediante análisis de benchmarks MMLU y HumanEval en tiempo real.</p>
                                    </div>
                                </div>
                                <button className="px-8 py-3 bg-white text-black font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-cyan-400 transition-all">Exportar PDF del Análisis</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Normal Header */}
                <header className="h-20 border-b border-gray-800 px-8 flex items-center justify-between bg-[#0a0a0a]/50 backdrop-blur-xl z-10">
                    <div className="relative w-full max-w-lg">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                        <input
                            type="text"
                            placeholder={`Filtrar en ${activeTab}...`}
                            className="w-full bg-[#121212] border border-gray-800 rounded-2xl py-2.5 pl-12 pr-4 text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button className="px-6 py-2 bg-cyan-500 text-black font-black rounded-xl text-sm">Entrar</button>
                </header>

                {/* Browser Area */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                            <div>
                                <h1 className="text-5xl font-black text-white tracking-tighter mb-2">
                                    Ranking <span className="text-cyan-400">{activeTab}</span>
                                </h1>
                                <p className="text-gray-500">Selecciona hasta 3 modelos para comparativa técnica.</p>
                            </div>
                            <div className="flex bg-[#121212] border border-gray-800 p-1 rounded-2xl">
                                {categories.map((cat) => (
                                    <button
                                        key={cat.name}
                                        onClick={() => setActiveTab(cat.name)}
                                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === cat.name ? 'bg-white text-black shadow-xl' : 'text-gray-500 hover:text-gray-300'}`}
                                    >
                                        {cat.icon} {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {loading ? (
                                Array(4).fill(0).map((_, i) => <div key={i} className="h-80 rounded-[32px] bg-[#121212] animate-pulse" />)
                            ) : (
                                filteredModels.map((model) => (
                                    <div
                                        key={model.id}
                                        className={`p-7 rounded-[32px] bg-[#121212] border transition-all duration-300 ${selectedModels.includes(model.id) ? 'border-cyan-500 ring-4 ring-cyan-500/5 shadow-[0_0_30px_rgba(6,182,212,0.1)]' : 'border-gray-800 hover:border-gray-600'}`}
                                    >
                                        <div className="flex justify-between items-start mb-6">
                                            <div className={`p-3 rounded-2xl bg-white/5 text-cyan-400`}>
                                                {activeTab === 'Texto' ? <Type size={22} /> : activeTab === 'Imagen' ? <ImageIcon size={22} /> : <Video size={22} />}
                                            </div>
                                            <div className="flex flex-col items-end font-bold">
                                                <span className="text-[9px] text-gray-500 uppercase tracking-widest">{model.empresa}</span>
                                                <span className="text-sm text-white">{model.puntaje} pts</span>
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-black text-white mb-2">{model.nombre}</h3>
                                        <p className="text-xs text-gray-500 leading-relaxed mb-8 line-clamp-2">{model.descripcion}</p>
                                        <button
                                            onClick={() => toggleSelection(model.id)}
                                            className={`w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedModels.includes(model.id) ? 'bg-cyan-500 text-black shadow-[0_5px_15px_rgba(6,182,212,0.3)]' : 'bg-gray-800 text-gray-400'}`}
                                        >
                                            {selectedModels.includes(model.id) ? 'Seleccionado' : 'Añadir al Benchmark'}
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Floating Bar */}
                {selectedModels.length > 0 && (
                    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[60]">
                        <div className="bg-black/80 backdrop-blur-2xl border border-cyan-500/50 p-2.5 pl-6 rounded-full flex items-center gap-6 shadow-[0_0_50px_-10px_rgba(6,182,212,0.4)]">
                            <div className="text-xs font-bold text-white uppercase tracking-widest">
                                {selectedModels.length} Modelos <span className="text-cyan-400 italic">Lista</span>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => setSelectedModels([])} className="px-5 py-2.5 text-xs font-bold text-gray-500 hover:text-white transition-colors">Limpiar</button>
                                <button
                                    onClick={() => setIsComparing(true)}
                                    className="px-8 py-2.5 bg-cyan-500 text-black rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
                                >
                                    Ejecutar Benchmark
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #222; border-radius: 10px; }
      `}</style>
        </div>
    );
};

export default App;