-- 🛠️ Infraestructura de Datos: Tablas Maestras de Monetización
-- Ejecuta este script íntegro en el SQL Editor de Supabase para activar el almacenamiento del búnker.

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

-- 4. Motor de Seguridad (RLS)
ALTER TABLE public.partnership_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monetization_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_missions ENABLE ROW LEVEL SECURITY;

-- Políticas para Administradores (Basado en el email del usuario)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins manage leads') THEN
        CREATE POLICY "Admins manage leads" ON public.partnership_leads FOR ALL 
        USING (auth.jwt() ->> 'email' IN (SELECT email FROM public.users WHERE role = 'admin'));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins manage missions') THEN
        CREATE POLICY "Admins manage missions" ON public.ai_missions FOR ALL 
        USING (auth.jwt() ->> 'email' IN (SELECT email FROM public.users WHERE role = 'admin'));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public insert leads') THEN
        CREATE POLICY "Public insert leads" ON public.partnership_leads FOR INSERT WITH CHECK (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public insert events') THEN
        CREATE POLICY "Public insert events" ON public.monetization_events FOR INSERT WITH CHECK (true);
    END IF;
END $$;
