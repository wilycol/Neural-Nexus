-- 📈 Operación Independencia: Registro de Estadísticas Diarias
-- Esta tabla permite a Beatriz monitorear el crecimiento del portal y activar misiones.

CREATE TABLE IF NOT EXISTS public.site_stats_daily (
    day DATE PRIMARY KEY DEFAULT CURRENT_DATE,
    views_count BIGINT DEFAULT 0,
    unique_visitors BIGINT DEFAULT 0,
    estimated_revenue DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.site_stats_daily ENABLE ROW LEVEL SECURITY;

-- Política: Lectura pública (para el dashboard)
CREATE POLICY "Lectura pública de estadísticas diarias"
ON public.site_stats_daily FOR SELECT
USING (true);

-- Función para incrementar vistas (RPC)
-- Se encarga de hacer el upsert automáticamente para el día actual
CREATE OR REPLACE FUNCTION public.increment_daily_views()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_views BIGINT;
BEGIN
    INSERT INTO public.site_stats_daily (day, views_count, estimated_revenue)
    VALUES (CURRENT_DATE, 1, 0.003) -- $3.00 / 1000 = $0.003 por visita
    ON CONFLICT (day)
    DO UPDATE SET 
        views_count = public.site_stats_daily.views_count + 1,
        -- Recalcular ingreso: (vistas + 1) * 0.003
        estimated_revenue = (public.site_stats_daily.views_count + 1) * 0.003,
        updated_at = NOW();
END;
$$;
