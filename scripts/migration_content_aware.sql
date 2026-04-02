-- MIGRACIÓN: EVOLUCIÓN ESTRUCTURAL "CONTENT-AWARE" 🧠🧬
-- TABLA: news

-- 1. Añadir nuevos campos estructurados
ALTER TABLE news ADD COLUMN IF NOT EXISTS content_type TEXT DEFAULT 'image';
ALTER TABLE news ADD COLUMN IF NOT EXISTS cover_url TEXT;
ALTER TABLE news ADD COLUMN IF NOT EXISTS audio_url TEXT;
ALTER TABLE news ADD COLUMN IF NOT EXISTS subtitles_url TEXT;
ALTER TABLE news ADD COLUMN IF NOT EXISTS has_audio BOOLEAN DEFAULT false;
ALTER TABLE news ADD COLUMN IF NOT EXISTS has_subtitles BOOLEAN DEFAULT false;
ALTER TABLE news ADD COLUMN IF NOT EXISTS is_short BOOLEAN DEFAULT true;
ALTER TABLE news ADD COLUMN IF NOT EXISTS is_reusable BOOLEAN DEFAULT true;

-- 2. Migración de Datos Existentes (Retrocompatibilidad)
UPDATE news 
SET 
  content_type = CASE WHEN video_url IS NOT NULL THEN 'video' ELSE 'image' END,
  cover_url = image_url,
  is_short = true,
  is_reusable = true;

-- 3. Comentarios para Documentación
COMMENT ON COLUMN news.content_type IS 'image | video | carousel | analysis';
COMMENT ON COLUMN news.cover_url IS 'Imagen principal o miniatura del contenido';
COMMENT ON COLUMN news.is_reusable IS 'Indica si el contenido es apto para distribución social (TikTok/Shorts)';
