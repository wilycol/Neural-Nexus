-- 📊 Sincronización Industrial de Métricas (Operación Independencia)
-- Unifica el conteo histórico utilizando site_stats_daily como la fuente de verdad principal para el tráfico general.

DROP FUNCTION IF EXISTS public.get_site_wide_stats();

CREATE OR REPLACE FUNCTION public.get_site_wide_stats()
RETURNS TABLE (
  total_views BIGINT,
  total_users BIGINT,
  total_news BIGINT,
  today_views BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ((SELECT COALESCE(SUM(view_count), 0) FROM public.news) + 
     (SELECT COALESCE(SUM(view_count), 0) FROM public.blog_posts) + 
     (SELECT COALESCE(SUM(views_count), 0) FROM public.site_stats_daily))::BIGINT AS total_views,
    
    (SELECT COUNT(*) FROM public.users)::BIGINT AS total_users,
    (SELECT COUNT(*) FROM public.news)::BIGINT AS total_news,
    
    (SELECT COALESCE(views_count, 0) FROM public.site_stats_daily WHERE day = CURRENT_DATE)::BIGINT AS today_views;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Eliminamos la política redundante si existiera y nos aseguramos de que site_stats_daily sea accesible
-- La tabla ya tiene RLS habilitado para lectura pública.
