-- 💳 Sistema de Facturación Neural Nexus (Fase 1: Estructura)

-- 1. Actualizar tabla de usuarios con campos de membresía
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS wompi_customer_id TEXT,
ADD COLUMN IF NOT EXISTS binance_customer_id TEXT;

-- 2. Crear tabla de suscripciones
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL, -- 'active', 'trialing', 'past_due', 'canceled', 'incomplete'
  price_id TEXT, -- ID del precio en la pasarela
  provider TEXT NOT NULL, -- 'wompi', 'binance'
  provider_subscription_id TEXT UNIQUE,
  current_period_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  canceled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Crear tabla de donantes (Muro de Honor)
CREATE TABLE IF NOT EXISTS public.donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL, -- Opcional
  amount DECIMAL(15, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  donor_name TEXT NOT NULL DEFAULT 'Anónimo',
  comment TEXT,
  is_public BOOLEAN DEFAULT TRUE,
  provider TEXT NOT NULL,
  transaction_id TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Habilitar RLS (Row Level Security)
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- 5. Políticas de Seguridad para Subscripciones
-- Los usuarios pueden ver sus propias suscripciones
CREATE POLICY "Users can view own subscriptions" 
ON public.subscriptions FOR SELECT 
USING (auth.uid() = user_id);

-- 6. Políticas de Seguridad para Donaciones
-- Cualquiera puede ver las donaciones públicas (para el Muro de Honor)
CREATE POLICY "Public can view public donations" 
ON public.donations FOR SELECT 
USING (is_public = TRUE);

-- Los usuarios pueden ver sus propias donaciones (aunque sean privadas)
CREATE POLICY "Users can view own donations" 
ON public.donations FOR SELECT 
USING (auth.uid() = user_id);

-- 7. Función para actualizar el estado Premium automáticamente
CREATE OR REPLACE FUNCTION public.update_user_premium_status()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') THEN
    IF NEW.status = 'active' THEN
      UPDATE public.users SET is_premium = TRUE WHERE id = NEW.user_id;
    ELSE
      UPDATE public.users SET is_premium = FALSE WHERE id = NEW.user_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_subscription_change
AFTER INSERT OR UPDATE ON public.subscriptions
FOR EACH ROW EXECUTE FUNCTION public.update_user_premium_status();

-- 8. Comentarios de tabla
COMMENT ON TABLE public.subscriptions IS 'Rastreo de membresías premium activas y su estado.';
COMMENT ON TABLE public.donations IS 'Registro de contribuciones para el Muro de Honor.';
