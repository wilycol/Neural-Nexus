-- 1. Asegurar que las columnas de Beatriz V5 permiten nulos (audio_url y subtitles_url)
ALTER TABLE news 
ALTER COLUMN audio_url DROP NOT NULL,
ALTER COLUMN subtitles_url DROP NOT NULL;

-- 2. Agregar author_id a la tabla news si no existe
-- Usamos 'Beatriz AutoPublisher' como referencia para la atribución industrial
ALTER TABLE news 
ADD COLUMN IF NOT EXISTS author_id UUID;

-- 3. Crear política RLS para permitir inserciones desde la API (rol anon o authenticated)
-- Esta política permite que Beatriz V5 inyecte contenido validando la API KEY en la ruta
-- El acceso de lectura público ya existe (Allow Public Select)
DROP POLICY IF EXISTS "Enable insert for Beatriz API" ON news;
CREATE POLICY "Enable insert for Beatriz API" ON news 
FOR INSERT WITH CHECK (true);

-- 4. Comentario industrial para trazabilidad
COMMENT ON COLUMN news.author_id IS 'Atribución del post. Valor por defecto: Beatriz AutoPublisher AI';
