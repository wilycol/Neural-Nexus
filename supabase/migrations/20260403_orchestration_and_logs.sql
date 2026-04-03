-- 1. TABLA DE FUENTES DE NOTICIAS (news_sources)
-- Esta tabla ya podría existir, nos aseguramos de que tenga las columnas necesarias.
CREATE TABLE IF NOT EXISTS news_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    rss_url TEXT UNIQUE NOT NULL,
    category TEXT DEFAULT 'Inteligencia Artificial',
    is_active BOOLEAN DEFAULT TRUE,
    priority INTEGER DEFAULT 1,
    last_fetch_at TIMESTAMP WITH TIME ZONE,
    fetch_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TABLA DE LOGS DEL CRAWLER (crawler_logs)
-- Para que Beatriz pueda ver qué hizo el portal.
CREATE TABLE IF NOT EXISTS crawler_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    finished_at TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'running', -- 'success', 'failed', 'running'
    sources_processed INTEGER DEFAULT 0,
    items_found INTEGER DEFAULT 0,
    published_items JSONB DEFAULT '[]', -- Títulos y Enlaces inyectados
    error_log TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABLA DE TAREAS TOP 5 (top_5_tasks)
-- El buzón de tareas para Beatriz.
CREATE TABLE IF NOT EXISTS top_5_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    news_id UUID REFERENCES news(id) ON DELETE CASCADE,
    video_prompt TEXT NOT NULL, -- El prompt ya enriquecido para Beatriz
    status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
    video_url TEXT, -- Beatriz lo llenará al terminar
    priority INTEGER DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    finished_at TIMESTAMP WITH TIME ZONE,
    error_details TEXT
);

-- Habilitar RLS (Seguridad)
ALTER TABLE news_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE crawler_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE top_5_tasks ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura para autenticados
CREATE POLICY "Public Read Sources" ON news_sources FOR SELECT USING (true);
CREATE POLICY "Public Read Crawler Logs" ON crawler_logs FOR SELECT USING (true);
CREATE POLICY "Public Read Top 5 Tasks" ON top_5_tasks FOR SELECT USING (true);

-- Políticas de escritura (Solo Sevice Role para Crawler/Beatriz)
-- Nota: En un entorno real, usaríamos roles más específicos.
CREATE POLICY "Service Insert Logs" ON crawler_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Service Update Logs" ON crawler_logs FOR UPDATE USING (true);
CREATE POLICY "Service Insert Top 5" ON top_5_tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "Service Update Top 5" ON top_5_tasks FOR UPDATE USING (true);

-- Semilla de Fuentes Iniciales
INSERT INTO news_sources (name, rss_url, category, priority)
VALUES 
('TechCrunch AI', 'https://techcrunch.com/category/artificial-intelligence/feed/', 'Inteligencia Artificial', 10),
('Wired AI', 'https://www.wired.com/tag/artificial-intelligence/rss', 'Inteligencia Artificial', 9),
('Hugging Face Blog', 'https://huggingface.co/blog/feed.xml', 'Software', 8),
('OpenAI Blog', 'https://openai.com/blog/rss.xml', 'Software', 10),
('Google AI Blog', 'https://ai.googleblog.com/feeds/posts/default', 'Software', 7),
('Anthropic', 'https://www.anthropic.com/blog/rss.xml', 'Software', 9),
('MIT Technology Review', 'https://www.technologyreview.com/topic/artificial-intelligence/feed', 'Futuro y Tendencias', 8),
('VentureBeat AI', 'https://venturebeat.com/category/ai/feed/', 'Inteligencia Artificial', 7)
ON CONFLICT (rss_url) DO NOTHING;
