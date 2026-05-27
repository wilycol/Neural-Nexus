-- 🚀 Migración: Tabla de Prospectos Prioritarios (Hunter & Seductor)
-- Objetivo: Almacenar la prospección de negocios filtrada por el Agente Hunter
-- Clasificación: P1 (Restaurantes/Salud), P2 (Técnicos/Moda), etc.

CREATE TABLE IF NOT EXISTS public.prospectos_prioritarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_name TEXT NOT NULL,
    niche TEXT NOT NULL,
    priority_level TEXT NOT NULL CHECK (priority_level IN ('P1', 'P2', 'P3', 'P4')),
    digital_pain_score INTEGER DEFAULT 0,
    contact_status TEXT DEFAULT 'pending' CHECK (contact_status IN ('pending', 'ready_to_contact', 'contacting', 'contacted', 'converted', 'rejected')),
    last_interaction TIMESTAMPTZ,
    place_id TEXT UNIQUE, -- Google Place ID u otro identificador único
    metadata JSONB DEFAULT '{}', -- Para guardar si tiene IG, seguidores, web vieja, etc.
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.prospectos_prioritarios ENABLE ROW LEVEL SECURITY;

-- Políticas de Seguridad
-- Solo usuarios autenticados (o roles de servicio) pueden leer y escribir
CREATE POLICY "Acceso autenticado para leer prospectos" 
ON public.prospectos_prioritarios FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Acceso autenticado para insertar prospectos" 
ON public.prospectos_prioritarios FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Acceso autenticado para actualizar prospectos" 
ON public.prospectos_prioritarios FOR UPDATE 
USING (auth.role() = 'authenticated');

-- Comentario Industrial
COMMENT ON TABLE public.prospectos_prioritarios IS 'Tabla maestra de prospección. El Agente Hunter inyecta aquí sus presas clasificadas por prioridad (P1-P4) y el Agente Seductor ataca los ready_to_contact.';
