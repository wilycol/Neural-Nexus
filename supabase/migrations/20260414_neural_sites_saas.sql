-- 🚀 Migración: Neural Sites SaaS & Affiliate System (Fase 1)
-- Objetivo: Habilitar el modelo SaaS bilingüe con sistema de afiliados limitados.

-- 1. Extender tabla de usuarios con campos de afiliación
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS affiliate_code TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES public.users(id),
ADD COLUMN IF NOT EXISTS affiliate_earnings DECIMAL(15, 2) DEFAULT 0.00;

-- 2. Crear tabla de referidos (Control de 3 referidos y comisiones)
CREATE TABLE IF NOT EXISTS public.affiliate_referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES public.users(id) NOT NULL,
  referred_id UUID REFERENCES public.users(id) UNIQUE NOT NULL,
  setup_commission_paid BOOLEAN DEFAULT FALSE,
  mrr_commissions_count INT DEFAULT 0 CHECK (mrr_commissions_count <= 6),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Crear tabla de configuración de sitios de clientes (Neural Sites)
CREATE TABLE IF NOT EXISTS public.client_sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  site_url TEXT UNIQUE,
  site_name TEXT NOT NULL,
  niche TEXT,
  language TEXT DEFAULT 'es', -- 'es', 'en'
  plan_type TEXT NOT NULL DEFAULT 'silver', -- 'silver', 'gold', 'platinum'
  setup_status TEXT DEFAULT 'pending_onboarding', -- 'pending_setup_payment', 'in_production', 'live'
  beatriz_config JSONB DEFAULT '{}', -- Parámetros específicos para Beatriz
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Función Trigger para blindar el "Límite de 3 Referidos"
CREATE OR REPLACE FUNCTION public.check_referral_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM public.affiliate_referrals WHERE referrer_id = NEW.referrer_id) >= 3 THEN
    RAISE EXCEPTION 'Límite de 3 referidos alcanzado para este afiliado industrial.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_check_referral_limit
BEFORE INSERT ON public.affiliate_referrals
FOR EACH ROW EXECUTE FUNCTION public.check_referral_limit();

-- 5. Habilitar RLS (Row Level Security)
ALTER TABLE public.affiliate_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_sites ENABLE ROW LEVEL SECURITY;

-- Los usuarios ven sus propios referidos
CREATE POLICY "Users view own referrals" ON public.affiliate_referrals
FOR SELECT USING (auth.uid() = referrer_id);

-- Los dueños ven sus propios sitios
CREATE POLICY "Owners view own sites" ON public.client_sites
FOR SELECT USING (auth.uid() = owner_id);

-- 6. Comentarios Industriales
COMMENT ON TABLE public.affiliate_referrals IS 'Rastreo de comisiones y límite de 3 socios de élite.';
COMMENT ON TABLE public.client_sites IS 'Configuración y estado de los sitios satélites generados por Beatriz.';
