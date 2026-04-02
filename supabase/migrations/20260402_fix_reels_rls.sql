-- 🛡️ POLÍTICA DE ACCESO PÚBLICO: REELS Y NOTICIAS
-- Objetivo: Asegurar que el contenido sea visible para todos (Anónimos y Logueados)

-- 1. Habilitar RLS (si no lo está ya)
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- 2. Eliminar políticas de lectura existentes para evitar duplicados/conflictos
DROP POLICY IF EXISTS "Allow Public Select" ON news;
DROP POLICY IF EXISTS "Enable read access for all users" ON news;

-- 3. Crear política industrial de Lectura Pública
-- Esto cubre tanto a usuarios 'anon' como 'authenticated'
CREATE POLICY "Enable public read access for news" 
ON news 
FOR SELECT 
USING (true);

-- 4. Comentario industrial para trazabilidad
COMMENT ON POLICY "Enable public read access for news" ON news IS 'Permite que cualquier visitante (incluyendo Beatriz y usuarios logueados) lea las noticias y reels.';
