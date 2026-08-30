-- 🛡️ Migración: Tabla de Reintentos Pendientes para Agente Seductor
CREATE TABLE IF NOT EXISTS public.seductor_pending_replies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    whatsapp_number TEXT NOT NULL,
    contact_name TEXT,
    message_text TEXT NOT NULL,
    system_prompt TEXT,
    status TEXT DEFAULT 'pending_retry', -- 'pending_retry', 'completed', 'failed'
    retry_count INT DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.seductor_pending_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir lectura y escritura de seductor_pending_replies a anon y service_role" 
ON public.seductor_pending_replies FOR ALL 
USING (true) WITH CHECK (true);

COMMENT ON TABLE public.seductor_pending_replies IS 'Tabla de persistencia para reintentos automatizados del Agente Seductor cuando el pool de APIs se agota.';
