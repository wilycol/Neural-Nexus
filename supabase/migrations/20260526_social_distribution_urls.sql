-- ============================================================
-- MIGRACIÓN: Columnas de Distribución Social en tabla `news`
-- Portal Neural Nexus — Happy Bridge v2.0
-- Fecha: 2026-05-26
-- Autor: Beatriz AI (Serie X Elite)
-- ============================================================
-- Agrega columnas para registrar las URLs de distribución
-- en cada plataforma social. NULL = aún no publicado en esa red.

-- 🎬 YouTube
ALTER TABLE public.news 
ADD COLUMN IF NOT EXISTS youtube_url TEXT DEFAULT NULL;

ALTER TABLE public.news 
ADD COLUMN IF NOT EXISTS youtube_published_at TIMESTAMPTZ DEFAULT NULL;

-- 📘 Facebook
ALTER TABLE public.news 
ADD COLUMN IF NOT EXISTS facebook_url TEXT DEFAULT NULL;

ALTER TABLE public.news 
ADD COLUMN IF NOT EXISTS facebook_published_at TIMESTAMPTZ DEFAULT NULL;

-- 📸 Instagram
ALTER TABLE public.news 
ADD COLUMN IF NOT EXISTS instagram_url TEXT DEFAULT NULL;

ALTER TABLE public.news 
ADD COLUMN IF NOT EXISTS instagram_published_at TIMESTAMPTZ DEFAULT NULL;

-- 🎵 TikTok
ALTER TABLE public.news 
ADD COLUMN IF NOT EXISTS tiktok_url TEXT DEFAULT NULL;

ALTER TABLE public.news 
ADD COLUMN IF NOT EXISTS tiktok_published_at TIMESTAMPTZ DEFAULT NULL;

-- ============================================================
-- Comentarios descriptivos para cada columna
-- ============================================================
COMMENT ON COLUMN public.news.youtube_url IS 
  'URL del video publicado en YouTube. NULL = no publicado en YouTube aún.';
COMMENT ON COLUMN public.news.youtube_published_at IS 
  'Timestamp de cuando fue publicado en YouTube.';

COMMENT ON COLUMN public.news.facebook_url IS 
  'URL del post/video publicado en Facebook. NULL = no publicado en Facebook aún.';
COMMENT ON COLUMN public.news.facebook_published_at IS 
  'Timestamp de cuando fue publicado en Facebook.';

COMMENT ON COLUMN public.news.instagram_url IS 
  'URL del post/reel publicado en Instagram. NULL = no publicado en Instagram aún.';
COMMENT ON COLUMN public.news.instagram_published_at IS 
  'Timestamp de cuando fue publicado en Instagram.';

COMMENT ON COLUMN public.news.tiktok_url IS 
  'URL del video publicado en TikTok. NULL = no publicado en TikTok aún.';
COMMENT ON COLUMN public.news.tiktok_published_at IS 
  'Timestamp de cuando fue publicado en TikTok.';

-- ============================================================
-- Vista de conveniencia: publicaciones con distribución social
-- ============================================================
CREATE OR REPLACE VIEW public.social_distribution_status AS
SELECT 
  id,
  title,
  slug,
  published_at,
  video_url,
  -- YouTube
  youtube_url,
  youtube_published_at,
  CASE WHEN youtube_url IS NOT NULL THEN true ELSE false END AS on_youtube,
  -- Facebook
  facebook_url,
  facebook_published_at,
  CASE WHEN facebook_url IS NOT NULL THEN true ELSE false END AS on_facebook,
  -- Instagram
  instagram_url,
  instagram_published_at,
  CASE WHEN instagram_url IS NOT NULL THEN true ELSE false END AS on_instagram,
  -- TikTok
  tiktok_url,
  tiktok_published_at,
  CASE WHEN tiktok_url IS NOT NULL THEN true ELSE false END AS on_tiktok,
  -- Resumen: cuántas redes
  (
    CASE WHEN youtube_url IS NOT NULL THEN 1 ELSE 0 END +
    CASE WHEN facebook_url IS NOT NULL THEN 1 ELSE 0 END +
    CASE WHEN instagram_url IS NOT NULL THEN 1 ELSE 0 END +
    CASE WHEN tiktok_url IS NOT NULL THEN 1 ELSE 0 END
  ) AS platforms_count
FROM public.news
ORDER BY published_at DESC;

-- ============================================================
-- Comentario de la vista
-- ============================================================
COMMENT ON VIEW public.social_distribution_status IS 
  'Vista de trazabilidad: muestra qué publicaciones han sido distribuidas en cada red social.';
