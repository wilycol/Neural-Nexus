-- 🛡️ Motor 7: IA Strategy Bunker & Monetization Controller
-- 1. Tabla para Leads de Alianzas (Motor 5)
CREATE TABLE IF NOT EXISTS public.partnership_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT NOT NULL,
    type TEXT NOT NULL, -- 'slot', 'integration', 'featured', 'api'
    message TEXT,
    source TEXT DEFAULT 'marquee',
    status TEXT DEFAULT 'pending', -- 'pending', 'contacted', 'partnered', 'rejected'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabla para Eventos de Monetización (Motor 1 & 2)
CREATE TABLE IF NOT EXISTS public.monetization_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL, -- 'ad_click', 'affiliate_click'
    engine_id INTEGER NOT NULL, -- 1 o 2
    metadata JSONB DEFAULT '{}'::jsonb, -- info del producto/ad
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabla para Misiones de Beatriz (Asesoría Co-CEO)
CREATE TABLE IF NOT EXISTS public.ai_missions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    mission_type TEXT NOT NULL, -- 'tiktok', 'youtube', 'instagram', 'newsletter'
    priority TEXT DEFAULT 'medium',
    status TEXT DEFAULT 'pending', -- 'pending', 'completed', 'skipped'
    metadata JSONB DEFAULT '{}'::jsonb, -- links de compartición, etc.
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Habilitar RLS
ALTER TABLE public.partnership_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monetization_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_missions ENABLE ROW LEVEL SECURITY;

-- Solo Admins ven los leads y misiones
CREATE POLICY "Admins can manage partnership leads" ON public.partnership_leads FOR ALL 
USING (auth.jwt() ->> 'email' IN (SELECT email FROM public.users WHERE role = 'admin'));

CREATE POLICY "Admins can manage AI missions" ON public.ai_missions FOR ALL 
USING (auth.jwt() ->> 'email' IN (SELECT email FROM public.users WHERE role = 'admin'));

-- Cualquiera puede insertar leads y eventos
CREATE POLICY "Public can insert partnership leads" ON public.partnership_leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can insert monetization events" ON public.monetization_events FOR INSERT WITH CHECK (true);

-- 5. RPC Maestro: get_monetization_overview
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
