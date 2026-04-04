-- 🚀 Operación Independencia: Refinamiento de Precisión y Estabilidad (Fase 3.1)

-- 1. Mejorar precisión de la tabla para capturar $0.003 correctamente
ALTER TABLE public.site_stats_daily 
ALTER COLUMN estimated_revenue TYPE DECIMAL(15, 6);

-- 2. Limpiar funciones anteriores para evitar conflictos de firma
DROP FUNCTION IF EXISTS public.get_site_wide_stats();
DROP FUNCTION IF EXISTS public.get_monthly_stats();
DROP FUNCTION IF EXISTS public.increment_daily_views();

-- 3. Versión Robusta de Estadísticas Generales
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
    (SELECT COALESCE(SUM(views_count), 0) FROM public.site_stats_daily WHERE day = CURRENT_DATE) AS today_views;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Versión Robusta de Estadísticas Mensuales (Fix Error 500)
CREATE OR REPLACE FUNCTION public.get_monthly_stats()
RETURNS TABLE (
  monthly_views BIGINT,
  monthly_revenue DECIMAL(15, 6)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(views_count)::BIGINT, 0::BIGINT) AS monthly_views,
    COALESCE(SUM(estimated_revenue)::DECIMAL(15, 6), 0.000000::DECIMAL(15, 6)) AS monthly_revenue
  FROM public.site_stats_daily
  WHERE date_trunc('month', day) = date_trunc('month', CURRENT_DATE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Función de Incremento (Mejorada para precisión)
CREATE OR REPLACE FUNCTION public.increment_daily_views()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.site_stats_daily (day, views_count, estimated_revenue)
    VALUES (CURRENT_DATE, 1, 0.003)
    ON CONFLICT (day)
    DO UPDATE SET 
        views_count = public.site_stats_daily.views_count + 1,
        estimated_revenue = (public.site_stats_daily.views_count + 1) * 0.003,
        updated_at = NOW();
END;
$$;
