< !DOCTYPE html >
    <html lang="es">
        <head>
            <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Neural Hunter - Localizador de Leads Inteligentes</title>
                    <script src="https://cdn.tailwindcss.com"></script>
                    <script src="https://unpkg.com/lucide@latest"></script>
                    <!-- Firebase SDKs -->
                    <script type="module">
                        import {initializeApp} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
                        import {getFirestore, collection, addDoc, onSnapshot, query, doc, updateDoc, deleteDoc} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
                        import {getAuth, signInAnonymously, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

                        // Global State & Config
                        const apiKey = ""; // Gemini API Key (handled by environment)
                        const firebaseConfig = JSON.parse(window.__firebase_config || '{ }');
                        const appId = window.__app_id || 'neural-hunter-dev';

                        // Initialize Firebase
                        const app = initializeApp(firebaseConfig);
                        const db = getFirestore(app);
                        const auth = getAuth(app);

                        window.state = {
                            user: null,
                        leads: [],
                        searchResults: [],
                        isSearching: false,
                        isAnalyzing: false,
                        googleMapsKey: localStorage.getItem('nh_maps_key') || '',
                        selectedLead: null
        };

        // Authentication logic
        const initAuth = async () => {
            try {
                            await signInAnonymously(auth);
            } catch (error) {
                            console.error("Auth error:", error);
            }
        };

        onAuthStateChanged(auth, (user) => {
                            window.state.user = user;
                        if (user) {
                            loadLeads();
            }
        });

                        initAuth();

        // Firestore Logic
        const loadLeads = () => {
            if (!window.state.user) return;
                        const q = collection(db, 'artifacts', appId, 'users', window.state.user.uid, 'leads');
            onSnapshot(q, (snapshot) => {
                            window.state.leads = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                        renderLeads();
            }, (error) => console.error("Firestore error:", error));
        };

        window.saveLead = async (leadData) => {
            if (!window.state.user) return;
                        try {
                            await addDoc(collection(db, 'artifacts', appId, 'users', window.state.user.uid, 'leads'), {
                                ...leadData,
                                status: 'nuevo',
                                createdAt: new Date().toISOString()
                            });
                        alert('Cliente guardado en tu base de datos.');
            } catch (e) {
                            console.error("Error saving lead:", e);
            }
        };

        // Google Places API Logic
        window.searchBusinesses = async () => {
            const queryText = document.getElementById('searchQuery').value;
                        const location = document.getElementById('location').value;
                        const mapsKey = document.getElementById('mapsKey').value;

                        if (!mapsKey || !queryText || !location) {
                            alert("Por favor completa la API Key de Maps, el tipo de negocio y la ubicación.");
                        return;
            }

                        localStorage.setItem('nh_maps_key', mapsKey);
                        window.state.isSearching = true;
                        renderSearch();

                        try {
                            // Note: Direct browser calls to Google Maps API often require a Proxy or CORS handling.
                            // For this demo, we simulate the results if the key is 'demo', otherwise we attempt the fetch.
                            let results = [];
                        if (mapsKey === 'demo') {
                            results = [
                                { name: "Restaurante La Casona", formatted_address: "Cúcuta, Centro", rating: 3.8, website: null, place_id: "1" },
                                { name: "Pizzería Di Roma", formatted_address: "Av. 0, Cúcuta", rating: 4.5, website: "http://diroma-old.com", place_id: "2" },
                                { name: "Modas Elegance", formatted_address: "CC Ventura Plaza", rating: 4.1, website: null, place_id: "3" }
                            ];
                } else {
                    const response = await fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${queryText}+in+${location}&key=${mapsKey}`);
                        const data = await response.json();
                        results = data.results || [];
                }

                window.state.searchResults = results.map(r => ({
                            name: r.name,
                        address: r.formatted_address || r.vicinity,
                        rating: r.rating,
                        website: r.website || null,
                        placeId: r.place_id,
                        reviewsCount: r.user_ratings_total || 0
                }));
            } catch (error) {
                            alert("Error al conectar con Google Maps. Revisa tu API Key y cuotas.");
            } finally {
                            window.state.isSearching = false;
                        renderSearch();
            }
        };

        // AI Analysis Logic
        window.analyzeLead = async (index) => {
            const lead = window.state.searchResults[index];
                        window.state.isAnalyzing = true;
                        renderSearch();

                        const prompt = `
                        Actúa como un experto en ventas de "Neural Sites" (sitios web inteligentes con IA que se actualizan solos).
                        Analiza este prospecto de negocio:
                        Nombre: ${lead.name}
                        Dirección: ${lead.address}
                        Rating: ${lead.rating}
                        Sitio Web Actual: ${lead.website || 'No tiene'}

                        Instrucciones:
                        1. Determina por qué necesitan un Neural Site (si no tienen web, es obvio; si tienen, diles que está desactualizada).
                        2. Redacta un mensaje persuasivo para enviar por WhatsApp que mencione que ya les creaste un prototipo inteligente.
                        3. Genera un "Score de Venta" del 1 al 100.

                        Responde en formato JSON: {"analysis": "...", "message": "...", "score": 85 }
                        `;

                        try {
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
                            method: 'POST',
                        headers: {'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: [{parts: [{text: prompt }] }],
                        generationConfig: {responseMimeType: "application/json" }
                    })
                });

                        const data = await response.json();
                        const aiResult = JSON.parse(data.candidates[0].content.parts[0].text);

                        window.state.searchResults[index].aiAnalysis = aiResult;
                        window.state.selectedLead = window.state.searchResults[index];
            } catch (error) {
                            console.error("AI Error:", error);
                        alert("Error analizando con IA.");
            } finally {
                            window.state.isAnalyzing = false;
                        renderSearch();
                        renderDetail();
            }
        };

        // UI Rendering Functions
        const renderSearch = () => {
            const container = document.getElementById('resultsList');
                        if (window.state.isSearching) {
                            container.innerHTML = '<div class="p-8 text-center text-gray-400">Buscando negocios en el área...</div>';
                        return;
            }
                        if (window.state.searchResults.length === 0) {
                            container.innerHTML = '<div class="p-8 text-center text-gray-400 italic">No hay resultados. Inicia una búsqueda arriba.</div>';
                        return;
            }

            container.innerHTML = window.state.searchResults.map((r, i) => `
                        <div class="bg-gray-800 p-4 rounded-xl border border-gray-700 hover:border-blue-500 transition-all mb-4">
                            <div class="flex justify-between items-start">
                                <div>
                                    <h3 class="font-bold text-lg text-white">${r.name}</h3>
                                    <p class="text-sm text-gray-400">${r.address}</p>
                                    <div class="flex items-center mt-2 space-x-2">
                                        <span class="bg-yellow-900/30 text-yellow-500 text-xs px-2 py-1 rounded">⭐ ${r.rating || 'N/A'}</span>
                                        <span class="${r.website ? 'bg-green-900/30 text-green-500' : 'bg-red-900/30 text-red-500'} text-xs px-2 py-1 rounded">
                                            ${r.website ? 'Tiene Web' : 'Sin Web'}
                                        </span>
                                    </div>
                                </div>
                                <button onclick="analyzeLead(${i})" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                                    ${window.state.isAnalyzing ? 'Analizando...' : 'Analizar con IA'}
                                </button>
                            </div>
                        </div>
                        `).join('');
        };

        const renderDetail = () => {
            const detail = document.getElementById('leadDetail');
                        const lead = window.state.selectedLead;
                        if (!lead) {
                            detail.innerHTML = '<div class="h-full flex items-center justify-center text-gray-500">Selecciona un negocio para ver el análisis</div>';
                        return;
            }

                        detail.innerHTML = `
                        <div class="animate-fade-in">
                            <div class="bg-blue-900/20 border border-blue-500/30 p-4 rounded-xl mb-6">
                                <h2 class="text-2xl font-bold text-white mb-1">${lead.name}</h2>
                                <div class="flex items-center text-blue-400 text-sm mb-4">
                                    <i data-lucide="map-pin" class="w-4 h-4 mr-1"></i> ${lead.address}
                                </div>
                                <div class="grid grid-cols-2 gap-4">
                                    <div class="bg-gray-900 p-3 rounded-lg text-center">
                                        <div class="text-xs text-gray-400 uppercase">Potencial de Venta</div>
                                        <div class="text-3xl font-bold text-green-500">${lead.aiAnalysis?.score || '??'}%</div>
                                    </div>
                                    <div class="bg-gray-900 p-3 rounded-lg text-center">
                                        <div class="text-xs text-gray-400 uppercase">Status Web</div>
                                        <div class="text-sm font-medium text-white">${lead.website ? 'Obsolescencia detectada' : 'Nula / Urgente'}</div>
                                    </div>
                                </div>
                            </div>

                            <h3 class="font-semibold text-gray-300 mb-2">Diagnóstico Neural:</h3>
                            <p class="text-gray-400 text-sm mb-6 leading-relaxed bg-gray-800 p-4 rounded-lg">
                                ${lead.aiAnalysis?.analysis || 'Sin análisis disponible.'}
                            </p>

                            <h3 class="font-semibold text-gray-300 mb-2">Mensaje Persuasivo sugerido:</h3>
                            <div class="bg-gray-900 p-4 rounded-lg border border-gray-700 relative mb-6">
                                <p class="text-sm text-green-400 italic">${lead.aiAnalysis?.message || '...'}</p>
                                <button onclick="copyMsg()" class="absolute top-2 right-2 text-gray-500 hover:text-white">
                                    <i data-lucide="copy" class="w-4 h-4"></i>
                                </button>
                            </div>

                            <div class="flex gap-3">
                                <button onclick="window.saveLead(window.state.selectedLead)" class="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-xl font-bold">
                                    Guardar Lead
                                </button>
                                <a href="https://wa.me/?text=${encodeURIComponent(lead.aiAnalysis?.message || '')}" target="_blank" class="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold text-center">
                                    Enviar WhatsApp
                                </a>
                            </div>
                        </div>
                        `;
                        lucide.createIcons();
        };

        const renderLeads = () => {
            const container = document.getElementById('savedLeadsList');
            container.innerHTML = window.state.leads.map(l => `
                        <div class="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg mb-2 border-l-4 border-green-500">
                            <div>
                                <div class="text-white font-medium text-sm">${l.name}</div>
                                <div class="text-xs text-gray-500">${new Date(l.createdAt).toLocaleDateString()}</div>
                            </div>
                            <div class="text-xs font-bold text-blue-400">${l.status.toUpperCase()}</div>
                        </div>
                        `).join('');
                        if (window.state.leads.length === 0) {
                            container.innerHTML = '<p class="text-xs text-gray-500 italic">Aún no has guardado leads.</p>';
            }
        };

        window.copyMsg = () => {
            const msg = window.state.selectedLead?.aiAnalysis?.message;
                        if (msg) {
                const tempInput = document.createElement("textarea");
                        tempInput.value = msg;
                        document.body.appendChild(tempInput);
                        tempInput.select();
                        document.execCommand("copy");
                        document.body.removeChild(tempInput);
                        alert("Mensaje copiado al portapapeles");
            }
        };

        window.onload = () => {
                            lucide.createIcons();
                        document.getElementById('mapsKey').value = window.state.googleMapsKey;
                        renderSearch();
                        renderDetail();
        };
                    </script>

                    <style>
                        @keyframes fadeIn {from {opacity: 0; transform: translateY(10px); } to {opacity: 1; transform: translateY(0); } }
                        .animate-fade-in {animation: fadeIn 0.4s ease-out forwards; }
                        ::-webkit-scrollbar {width: 6px; }
                        ::-webkit-scrollbar-track {background: #1f2937; }
                        ::-webkit-scrollbar-thumb {background: #4b5563; border-radius: 10px; }
                    </style>
                </head>
                <body class="bg-gray-900 text-gray-100 min-h-screen font-sans">

                    <!-- Header -->
                    <header class="border-b border-gray-800 bg-gray-900/80 backdrop-blur-md sticky top-0 z-10">
                        <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                            <div class="flex items-center space-x-2">
                                <div class="bg-blue-600 p-1.5 rounded-lg">
                                    <i data-lucide="crosshair" class="text-white w-6 h-6"></i>
                                </div>
                                <h1 class="text-xl font-bold tracking-tight">Neural<span class="text-blue-500">Hunter</span> AI</h1>
                            </div>
                            <div class="flex items-center space-x-4">
                                <div class="hidden md:flex flex-col items-end">
                                    <span class="text-xs text-gray-500">Plan Diario: 10 Prototipos</span>
                                    <div class="w-24 h-1.5 bg-gray-700 rounded-full mt-1 overflow-hidden">
                                        <div class="bg-blue-500 h-full w-1/3"></div>
                                    </div>
                                </div>
                                <button class="p-2 text-gray-400 hover:text-white transition-colors">
                                    <i data-lucide="settings" class="w-5 h-5"></i>
                                </button>
                            </div>
                        </div>
                    </header>

                    <main class="max-w-7xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">

                        <!-- Sidebar - Search & Filters -->
                        <aside class="lg:col-span-4 space-y-6">
                            <div class="bg-gray-800 p-5 rounded-2xl border border-gray-700 shadow-xl">
                                <h2 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Configuración de Radar</h2>
                                <div class="space-y-4">
                                    <div>
                                        <label class="block text-xs font-medium text-gray-500 mb-1">Google Maps API Key (Escribe 'demo' para prueba)</label>
                                        <input type="password" id="mapsKey" placeholder="Tu API Key" class="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                                    </div>
                                    <div>
                                        <label class="block text-xs font-medium text-gray-500 mb-1">Tipo de Negocio</label>
                                        <input type="text" id="searchQuery" placeholder="Ej: Restaurante, Tienda de ropa" class="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                                    </div>
                                    <div>
                                        <label class="block text-xs font-medium text-gray-500 mb-1">Localidad / Ciudad</label>
                                        <input type="text" id="location" placeholder="Ej: Cúcuta, Colombia" class="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                                    </div>
                                    <button onclick="searchBusinesses()" class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all shadow-lg shadow-blue-500/20">
                                        <i data-lucide="search" class="w-5 h-5"></i>
                                        <span>Iniciar Cacería</span>
                                    </button>
                                </div>
                            </div>

                            <!-- Leads Guardados Recent -->
                            <div class="bg-gray-800/50 p-5 rounded-2xl border border-gray-700">
                                <h2 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Leads Recientes</h2>
                                <div id="savedLeadsList" class="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                                    <!-- Dynamic Leads -->
                                </div>
                            </div>
                        </aside>

                        <!-- Main Results Area -->
                        <section class="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">

                            <!-- List of found businesses -->
                            <div class="flex flex-col h-[700px]">
                                <div class="flex items-center justify-between mb-4">
                                    <h2 class="text-lg font-bold">Prospectos Encontrados</h2>
                                    <span class="text-xs text-gray-500" id="resultsCount">0 resultados</span>
                                </div>
                                <div id="resultsList" class="flex-1 overflow-y-auto space-y-4 pr-2">
                                    <!-- Search Results will appear here -->
                                </div>
                            </div>

                            <!-- Analysis & Sales Pitch -->
                            <div class="bg-gray-800/80 rounded-2xl border border-gray-700 p-6 flex flex-col h-[700px] overflow-y-auto shadow-2xl">
                                <div class="flex items-center space-x-2 mb-6 border-b border-gray-700 pb-4">
                                    <div class="bg-purple-600/20 p-2 rounded-lg">
                                        <i data-lucide="zap" class="text-purple-400 w-5 h-5"></i>
                                    </div>
                                    <h2 class="text-lg font-bold">Neural AI Lab</h2>
                                </div>
                                <div id="leadDetail" class="flex-1">
                                    <!-- Detail view will appear here -->
                                </div>
                            </div>

                        </section>
                    </main>

                    <!-- Footer / Disclaimer -->
                    <footer class="max-w-7xl mx-auto px-4 py-8 text-center text-gray-600 text-xs border-t border-gray-800 mt-12">
                        Neural Hunter AI utiliza tecnología de Gemini 2.5 y Google Maps.
                        Potenciado por el motor de Neural Sites &copy; 2024.
                    </footer>

                </body>
            </html>