-- 🚀 Migración: Federación Pioneros Media (Muro de la Fama)
-- Objetivo: Crear la estructura para los testimonios del Programa Pionero

-- 1. Crear tabla de testimonios
CREATE TABLE IF NOT EXISTS public.testimonios_federacion (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID,
  video_url TEXT NOT NULL,
  transcription TEXT,
  social_link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Crear Bucket Público en Storage (Muro de la Fama)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('federacion-pioneros-media', 'federacion-pioneros-media', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Habilitar RLS en la tabla
ALTER TABLE public.testimonios_federacion ENABLE ROW LEVEL SECURITY;

-- 4. Políticas de Tabla (Testimonios)
-- Lectura pública universal
CREATE POLICY "Lectura pública de testimonios" 
ON public.testimonios_federacion FOR SELECT 
USING (true);

-- Escritura solo para usuarios autenticados (El Documentador/Sistema)
CREATE POLICY "Escritura autenticada de testimonios" 
ON public.testimonios_federacion FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- 5. Políticas de Storage (Media)
-- Lectura pública universal para videos del Muro de la Fama
CREATE POLICY "Lectura pública de media pioneros"
ON storage.objects FOR SELECT
USING (bucket_id = 'federacion-pioneros-media');

-- Escritura solo para usuarios autenticados (El Documentador subiendo videos)
CREATE POLICY "Escritura autenticada en media pioneros"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'federacion-pioneros-media' AND auth.role() = 'authenticated');

-- 6. Comentarios Industriales
COMMENT ON TABLE public.testimonios_federacion IS 'Tabla que alimenta el Muro de la Fama 3D con testimonios en video de los pioneros.';
