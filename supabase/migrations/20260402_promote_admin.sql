-- ELEVACIÓN DE ROL: ADMINISTRADOR INDUSTRIAL 👑
-- Usuario: wilycol1492@gmail.com

-- 0. Asegurar que existe la columna de rol (por si acaso)
ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- 1. Promover al usuario a Admin
UPDATE users 
SET role = 'admin' 
WHERE email = 'wilycol1492@gmail.com';

-- 2. Verificar el cambio
SELECT id, email, nickname, role FROM users WHERE email = 'wilycol1492@gmail.com';
