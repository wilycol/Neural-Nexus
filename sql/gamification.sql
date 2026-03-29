-- 1. Tablas de Interacción (Si no existen)
CREATE TABLE IF NOT EXISTS public.likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  news_id UUID REFERENCES public.news(id) ON DELETE CASCADE,
  blog_post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, news_id),
  UNIQUE(user_id, blog_post_id)
);

CREATE TABLE IF NOT EXISTS public.shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  news_id UUID REFERENCES public.news(id) ON DELETE CASCADE,
  blog_post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  platform TEXT NOT NULL, -- 'copy', 'x', 'whatsapp', etc.
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  news_id UUID NOT NULL REFERENCES public.news(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, news_id)
);

-- 2. Actualización de tabla 'users' para gamificación
ALTER TABLE IF EXISTS public.users 
ADD COLUMN IF NOT EXISTS credits INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS badge_level INTEGER DEFAULT 1;

-- 3. Función para obtener estadísticas globales (vistas totales)
CREATE OR REPLACE FUNCTION get_site_wide_stats()
RETURNS TABLE (
  total_views BIGINT,
  total_users BIGINT,
  total_news BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COALESCE(SUM(view_count), 0) FROM news) + (SELECT COALESCE(SUM(view_count), 0) FROM blog_posts) AS total_views,
    (SELECT COUNT(*) FROM users) AS total_users,
    (SELECT COUNT(*) FROM news) AS total_news;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Algoritmo de Tendencias: "Lo más caliente de la última hora"
CREATE OR REPLACE FUNCTION get_trending_news(p_limit INTEGER DEFAULT 5)
RETURNS SETOF news AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM news
  WHERE status = 'published'
    AND published_at > NOW() - INTERVAL '24 hours'
  ORDER BY (view_count + (like_count * 5) + (comment_count * 10)) DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Función para otorgar créditos por interacción
CREATE OR REPLACE FUNCTION award_interaction_credits()
RETURNS TRIGGER AS $$
DECLARE
  v_credits INTEGER;
BEGIN
  -- Definir créditos por tipo
  IF TG_TABLE_NAME = 'comments' THEN v_credits := 5;
  ELSIF TG_TABLE_NAME = 'likes' THEN v_credits := 2;
  ELSIF TG_TABLE_NAME = 'shares' THEN v_credits := 1;
  ELSIF TG_TABLE_NAME = 'favorites' THEN v_credits := 3;
  ELSE v_credits := 0;
  END IF;

  -- Actualizar créditos del usuario
  UPDATE public.users 
  SET credits = coalesce(credits, 0) + v_credits
  WHERE id = NEW.user_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Triggers para gamificación
DROP TRIGGER IF EXISTS tr_on_comment_award ON comments;
CREATE TRIGGER tr_on_comment_award
  AFTER INSERT ON comments
  FOR EACH ROW EXECUTE FUNCTION award_interaction_credits();

DROP TRIGGER IF EXISTS tr_on_like_award ON likes;
CREATE TRIGGER tr_on_like_award
  AFTER INSERT ON likes
  FOR EACH ROW EXECUTE FUNCTION award_interaction_credits();

DROP TRIGGER IF EXISTS tr_on_share_award ON shares;
CREATE TRIGGER tr_on_share_award
  AFTER INSERT ON shares
  FOR EACH ROW EXECUTE FUNCTION award_interaction_credits();

DROP TRIGGER IF EXISTS tr_on_favorite_award ON favorites;
CREATE TRIGGER tr_on_favorite_award
  AFTER INSERT ON favorites
  FOR EACH ROW EXECUTE FUNCTION award_interaction_credits();
