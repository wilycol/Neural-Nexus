-- 🛡️ Neural Nexus Security Patch: Row Level Security (RLS) Fix
-- Fecha: 2026-04-10
-- Descripción: Habilita RLS y define políticas para las tablas reportadas por el Security Advisor.

--------------------------------------------------------------------------------
-- 1. Tabla: news (Asegurar Borrado Administrativo)
--------------------------------------------------------------------------------
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

-- Permitir lectura pública
DROP POLICY IF EXISTS "Allow Public Select" ON public.news;
CREATE POLICY "Allow Public Select" ON public.news 
FOR SELECT USING (true);

-- Permitir inserción desde la API (para Beatriz)
DROP POLICY IF EXISTS "Enable insert for Beatriz API" ON public.news;
CREATE POLICY "Enable insert for Beatriz API" ON public.news 
FOR INSERT WITH CHECK (true);

-- Permitir borrado solo para administradores
DROP POLICY IF EXISTS "Allow Admin Delete" ON public.news;
CREATE POLICY "Allow Admin Delete" ON public.news 
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
);

-- Permitir actualización solo para administradores
DROP POLICY IF EXISTS "Allow Admin Update" ON public.news;
CREATE POLICY "Allow Admin Update" ON public.news 
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
);

--------------------------------------------------------------------------------
-- 2. Tabla: blog_posts
--------------------------------------------------------------------------------
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow Public Select" ON public.blog_posts;
CREATE POLICY "Allow Public Select" ON public.blog_posts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow Admin All" ON public.blog_posts;
CREATE POLICY "Allow Admin All" ON public.blog_posts 
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
);

--------------------------------------------------------------------------------
-- 3. Tabla: likes
--------------------------------------------------------------------------------
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow Public Select" ON public.likes;
CREATE POLICY "Allow Public Select" ON public.likes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow Auth Insert" ON public.likes;
CREATE POLICY "Allow Auth Insert" ON public.likes FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow Owner Delete" ON public.likes;
CREATE POLICY "Allow Owner Delete" ON public.likes FOR DELETE USING (auth.uid() = user_id);

--------------------------------------------------------------------------------
-- 4. Tabla: comments
--------------------------------------------------------------------------------
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow Public Select" ON public.comments;
CREATE POLICY "Allow Public Select" ON public.comments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow Auth Insert" ON public.comments;
CREATE POLICY "Allow Auth Insert" ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow Owner/Admin Modify" ON public.comments;
CREATE POLICY "Allow Owner/Admin Modify" ON public.comments 
FOR ALL USING (
  auth.uid() = user_id OR 
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
);

--------------------------------------------------------------------------------
-- 5. Tabla: favorites
--------------------------------------------------------------------------------
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow Public Select" ON public.favorites;
CREATE POLICY "Allow Public Select" ON public.favorites FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow Owner All" ON public.favorites;
CREATE POLICY "Allow Owner All" ON public.favorites 
FOR ALL USING (auth.uid() = user_id);

--------------------------------------------------------------------------------
-- 6. Tabla: shares
--------------------------------------------------------------------------------
ALTER TABLE public.shares ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow Public Select" ON public.shares;
CREATE POLICY "Allow Public Select" ON public.shares FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow Auth Insert" ON public.shares;
CREATE POLICY "Allow Auth Insert" ON public.shares FOR INSERT WITH CHECK (auth.uid() = user_id);

--------------------------------------------------------------------------------
-- 7. Tabla: site_metrics
--------------------------------------------------------------------------------
-- Nota: Si la tabla no existe físicamente en este branch, el comando fallará silenciosamente o se puede ignorar.
-- Pero para cumplir con la advertencia de Supabase, la protegemos.
DO $$ 
BEGIN 
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'site_metrics') THEN
    ALTER TABLE public.site_metrics ENABLE ROW LEVEL SECURITY;
    
    DROP POLICY IF EXISTS "Allow Public Insert" ON public.site_metrics;
    CREATE POLICY "Allow Public Insert" ON public.site_metrics FOR INSERT WITH CHECK (true);
    
    DROP POLICY IF EXISTS "Allow Admin Read" ON public.site_metrics;
    CREATE POLICY "Allow Admin Read" ON public.site_metrics FOR SELECT USING (
      EXISTS (
        SELECT 1 FROM public.users 
        WHERE users.id = auth.uid() AND users.role = 'admin'
      )
    );
  END IF;
END $$;
