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
BEGIN
    INSERT INTO public.site_stats_daily (day, views_count)
    VALUES (CURRENT_DATE, 1)
    ON CONFLICT (day)
    DO UPDATE SET 
        views_count = public.site_stats_daily.views_count + 1,
        updated_at = NOW();
END;
$$;
