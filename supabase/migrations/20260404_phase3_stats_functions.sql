-- 🚀 Operación Independencia: Funciones de Estadísticas Avanzadas (Fase 3)

-- 1. Actualizar get_site_wide_stats para incluir hoy
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
    (SELECT COALESCE(SUM(view_count), 0) FROM public.news) + 
    (SELECT COALESCE(SUM(view_count), 0) FROM public.blog_posts) + 
    (SELECT COALESCE(count, 0) FROM public.site_metrics WHERE id = 'total_site_views') AS total_views,
    (SELECT COUNT(*) FROM public.users) AS total_users,
    (SELECT COUNT(*) FROM public.news) AS total_news,
    (SELECT COALESCE(views_count, 0) FROM public.site_stats_daily WHERE day = CURRENT_DATE) AS today_views;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Función para estadísticas mensuales (Admin Only / Mission Progress)
CREATE OR REPLACE FUNCTION public.get_monthly_stats()
RETURNS TABLE (
  monthly_views BIGINT,
  monthly_revenue DECIMAL(10, 2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(views_count), 0) AS monthly_views,
    COALESCE(SUM(estimated_revenue), 0.00) AS monthly_revenue
  FROM public.site_stats_daily
  WHERE date_trunc('month', day) = date_trunc('month', CURRENT_DATE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
