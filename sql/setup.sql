-- 1. Asegurar que la tabla 'news' tiene los campos necesarios para alineación con Beatriz
ALTER TABLE IF EXISTS news 
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS like_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS comment_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS share_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published',
ADD COLUMN IF NOT EXISTS excerpt TEXT;

-- 2. Crear función para incrementar vistas
create or replace function increment_view_count(post_id uuid)
returns void as $$
begin
  update news
  set view_count = coalesce(view_count, 0) + 1
  where id = post_id;
end;
$$ language plpgsql security definer;

-- 3. Crear función para el feed de métricas (si no existe)
create or replace function get_news_feed_metrics(p_news_ids uuid[])
returns table (
  news_id uuid,
  like_count bigint,
  comment_count bigint,
  is_liked boolean,
  is_favorited boolean
) as $$
begin
  return query
  select 
    n.id as news_id,
    (select count(*) from likes l where l.news_id = n.id) as like_count,
    (select count(*) from comments c where c.news_id = n.id and c.is_moderated = false) as comment_count,
    exists(select 1 from likes l where l.news_id = n.id and l.user_id = auth.uid()) as is_liked,
    exists(select 1 from favorites f where f.news_id = n.id and f.user_id = auth.uid()) as is_favorited
  from unnest(p_news_ids) as nid
  join news n on n.id = nid;
end;
$$ language plpgsql security definer;
