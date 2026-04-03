-- 🛡️ POLÍTICA DE PRIVACIDAD Y ACCESO: TABLA USERS
-- Objetivo: Permitir que cada usuario lea sus propios metadatos (créditos, rol, premium)

-- 1. Habilitar RLS en la tabla de usuarios industriales
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 2. Eliminar políticas antiguas para evitar conflictos
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Permitir lectura propia" ON users;

-- 3. Crear política de Auto-Lectura (Self-Read)
CREATE POLICY "Users can view own profile data" 
ON users 
FOR SELECT 
USING (auth.uid() = id);

-- 4. Comentario industrial
COMMENT ON POLICY "Users can view own profile data" ON users IS 'Permite que cada usuario autenticado lea exclusivamente sus propios metadatos de perfil.';
