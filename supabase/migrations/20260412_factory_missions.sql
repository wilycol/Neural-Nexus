-- Protocolo Alpha: Tabla de Misiones para Beatriz Factoría
-- Esta tabla actúa como el puente asíncrono entre el Portal y la Factoría.

CREATE TABLE IF NOT EXISTS public.factory_missions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    news_id UUID REFERENCES public.news(id) ON DELETE SET NULL, -- ID de la noticia original en el portal
    title TEXT NOT NULL,          -- Título mutado por Gemini (optimizado para Video)
    description TEXT,             -- Descripción mutada por Gemini
    content TEXT,                 -- Contenido bruto para el guion
    platform TEXT DEFAULT 'tiktok', -- tiktok, reels, youtube_shorts
    mode TEXT DEFAULT 'classic',    -- classic, ttv, cat, tti
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    published_url TEXT,           -- URL del video/reel final una vez publicado
    error_log TEXT,               -- En caso de fallo
    ai_metadata JSONB DEFAULT '{}'::jsonb, -- Metadatos adicionales de la mutación
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para optimizar el polling de la factoría
CREATE INDEX IF NOT EXISTS idx_factory_missions_status ON public.factory_missions(status);
CREATE INDEX IF NOT EXISTS idx_factory_missions_created_at ON public.factory_missions(created_at);

-- Función para actualizar el timestamp de updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_factory_missions_updated_at
    BEFORE UPDATE ON public.factory_missions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comentarios de documentación técnica
COMMENT ON TABLE public.factory_missions IS 'Cola de producción industrial para Beatriz AutoPublisher (Protocolo Alpha)';
COMMENT ON COLUMN public.factory_missions.news_id IS 'Vinculación con la noticia origen en Portal Neural Nexus';
COMMENT ON COLUMN public.factory_missions.title IS 'Título reescrito por IA para evitar redundancia y aumentar CTR radical comercial';
