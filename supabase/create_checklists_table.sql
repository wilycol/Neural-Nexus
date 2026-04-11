-- 🛠️ Checklist Persistence: Infraestructura para el Búnker 180K
-- Este script habilita el guardado del progreso de los 6 motores de monetización.

-- 1. Tabla para el progreso de los pasos (checklists)
CREATE TABLE IF NOT EXISTS public.monetization_checklists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    motor_id TEXT NOT NULL, -- 'ads', 'affiliates', 'premium', 'donations', 'leads', 'api'
    step_id INTEGER NOT NULL,
    is_completed BOOLEAN DEFAULT TRUE,
    admin_id UUID REFERENCES auth.users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(motor_id, step_id, admin_id)
);

-- 2. Habilitar RLS
ALTER TABLE public.monetization_checklists ENABLE ROW LEVEL SECURITY;

-- 3. Política de Acceso: Solo Admins pueden ver/editar su progreso
CREATE POLICY "Admins manage their own checklists" ON public.monetization_checklists
    FOR ALL
    USING (auth.jwt() ->> 'email' IN (SELECT email FROM public.users WHERE role = 'admin'))
    WITH CHECK (auth.jwt() ->> 'email' IN (SELECT email FROM public.users WHERE role = 'admin'));

-- 4. Notificaciones de Beatriz (Opcional para triggers futuros)
COMMENT ON TABLE public.monetization_checklists IS 'Almacena el progreso de las tareas industriales de los 6 motores de monetización.';
