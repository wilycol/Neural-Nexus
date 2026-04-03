-- 1. Tabla de Métricas Globales
CREATE TABLE IF NOT EXISTS public.site_metrics (
    id TEXT PRIMARY KEY, -- 'global_visits', etc.
    count BIGINT DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Insertar valores iniciales
INSERT INTO public.site_metrics (id, count)
VALUES ('total_site_views', 0)
ON CONFLICT (id) DO NOTHING;

-- 3. Crear columna view_count en news si no existe (por si acaso, aunque parece existir)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='news' AND column_name='view_count') THEN
        ALTER TABLE public.news ADD COLUMN view_count BIGINT DEFAULT 0;
    END IF;
END $$;

-- 4. RPC para incrementar métricas genéricas (Vistas del sitio)
CREATE OR REPLACE FUNCTION public.increment_site_metric(metric_id TEXT)
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.site_metrics (id, count, updated_at)
    VALUES (metric_id, 1, NOW())
    ON CONFLICT (id) DO UPDATE
    SET count = site_metrics.count + 1,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. RPC para incrementar vistas de contenido (Noticias/Blog)
CREATE OR REPLACE FUNCTION public.increment_item_view(item_id UUID, table_name TEXT)
RETURNS VOID AS $$
BEGIN
    IF table_name = 'news' THEN
        UPDATE public.news SET view_count = COALESCE(view_count, 0) + 1 WHERE id = item_id;
    ELSIF table_name = 'blog_posts' THEN
        UPDATE public.blog_posts SET view_count = COALESCE(view_count, 0) + 1 WHERE id = item_id;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Actualizar función de estadísticas globales para incluir visitas al sitio
CREATE OR REPLACE FUNCTION public.get_site_wide_stats()
RETURNS TABLE (
  total_views BIGINT,
  total_users BIGINT,
  total_news BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COALESCE(SUM(view_count), 0) FROM public.news) + 
    (SELECT COALESCE(SUM(view_count), 0) FROM public.blog_posts) + 
    (SELECT COALESCE(count, 0) FROM public.site_metrics WHERE id = 'total_site_views') AS total_views,
    (SELECT COUNT(*) FROM public.users) AS total_users,
    (SELECT COUNT(*) FROM public.news) AS total_news;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
