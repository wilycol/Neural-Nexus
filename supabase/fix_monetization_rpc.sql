-- 🛡️ Motor Beatriz: Sincronización del Búnker de Monetización
-- Ejecuta este script íntegro en el SQL Editor de Supabase para activar el mando central.

CREATE OR REPLACE FUNCTION public.get_monetization_overview()
RETURNS TABLE (
    total_ads BIGINT,
    total_affiliate BIGINT,
    total_premium DECIMAL(15, 2),
    total_donations DECIMAL(15, 2),
    total_leads BIGINT,
    total_api_calls BIGINT,
    total_revenue DECIMAL(15, 2),
    progress_percentage DECIMAL(5, 2)
) AS $$
DECLARE
    target_val DECIMAL(15, 2) := 30000.00; -- Meta industrial: $30K
    rev_premium DECIMAL(15, 2);
    rev_donations DECIMAL(15, 2);
    total_rev DECIMAL(15, 2);
BEGIN
    -- 1. Calcular Ingresos Premium (Suscripciones activas * $10)
    -- Se verifica existencia de tabla 'subscriptions' de la migración billing_system
    SELECT COALESCE(COUNT(*), 0) * 10 
    INTO rev_premium 
    FROM public.subscriptions 
    WHERE status = 'active';
    
    -- 2. Calcular Donaciones Reales
    SELECT COALESCE(SUM(amount), 0) 
    INTO rev_donations 
    FROM public.donations;
    
    -- 3. Calcular Total Global
    total_rev := rev_premium + rev_donations;

    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM public.monetization_events WHERE engine_id = 1)::BIGINT AS total_ads,
        (SELECT COUNT(*) FROM public.monetization_events WHERE engine_id = 2)::BIGINT AS total_affiliate,
        rev_premium AS total_premium,
        rev_donations AS total_donations,
        (SELECT COUNT(*) FROM public.partnership_leads)::BIGINT AS total_leads,
        (SELECT COALESCE(count, 0) FROM public.site_metrics WHERE id = 'api_hits' LIMIT 1)::BIGINT AS total_api_calls,
        total_rev AS total_revenue,
        (LEAST((total_rev / target_val) * 100, 100))::DECIMAL(5, 2) AS progress_percentage;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
