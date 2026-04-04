-- 🚀 Operación Independencia: Reparación de "Cables" de Métricas
-- Esta versión asegura que el "Total Histórico" coincida con la barra de progreso monetario
-- y que los nombres de los campos coincidan con lo que el Frontend espera.

CREATE OR REPLACE FUNCTION public.get_site_wide_stats()
RETURNS TABLE (
  total_views BIGINT,
  total_users BIGINT,
  total_posts BIGINT, -- Antes total_news, ahora total_posts para el Frontend
  today_views BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    -- Sumamos todas las visitas registradas en el histórico diario para que cuadre con el dinero
    (SELECT COALESCE(SUM(views_count), 0) FROM public.site_stats_daily) AS total_views,
    (SELECT COUNT(*) FROM public.users) AS total_users,
    (SELECT COUNT(*) FROM public.news) AS total_posts,
    (SELECT COALESCE(views_count, 0) FROM public.site_stats_daily WHERE day = CURRENT_DATE) AS today_views;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
