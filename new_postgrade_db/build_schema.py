import os

sql_laia_path = r"c:\Users\Usuario\Documents\trae_projects\Beatriz Publisher\Portal Neural Nexus\new_postgrade_db\sql_laia.sql"
schema_final_path = r"c:\Users\Usuario\Documents\trae_projects\Beatriz Publisher\Portal Neural Nexus\new_postgrade_db\schema_final.sql"

with open(sql_laia_path, "r", encoding="utf-8") as f:
    sql_content = f.read()

# Buscamos donde empiezan los placeholders para truncar
placeholder_marker = "-- OTHER ROUTINES you pasted (bodies) without names/signatures"
if placeholder_marker in sql_content:
    sql_content = sql_content.split(placeholder_marker)[0]

functions_sql = """
-- =========================================================
-- RUTINAS COMPLETAS (Funciones y Triggers)
-- =========================================================

CREATE OR REPLACE FUNCTION public.award_interaction_credits() RETURNS trigger AS $$
DECLARE
  v_credits INTEGER;
BEGIN
  IF TG_TABLE_NAME = 'comments' THEN v_credits := 5;
  ELSIF TG_TABLE_NAME = 'likes' THEN v_credits := 2;
  ELSIF TG_TABLE_NAME = 'shares' THEN v_credits := 1;
  ELSIF TG_TABLE_NAME = 'favorites' THEN v_credits := 3;
  ELSE v_credits := 0;
  END IF;
  UPDATE public.users SET credits = coalesce(credits, 0) + v_credits WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_monetization_overview() RETURNS TABLE(total_ads bigint, total_affiliate bigint, total_premium numeric, total_donations numeric, total_leads bigint, total_api_calls bigint, total_revenue numeric, progress_percentage numeric) AS $$
DECLARE
    target_val DECIMAL(15, 2) := 30000.00;
    rev_premium DECIMAL(15, 2);
    rev_donations DECIMAL(15, 2);
    total_rev DECIMAL(15, 2);
BEGIN
    SELECT COALESCE(COUNT(*), 0) * 10 INTO rev_premium FROM public.subscriptions WHERE status = 'active';
    SELECT COALESCE(SUM(amount), 0) INTO rev_donations FROM public.donations;
    total_rev := rev_premium + rev_donations;
    RETURN QUERY SELECT 
        (SELECT COUNT(*) FROM public.monetization_events WHERE engine_id = 1)::BIGINT AS total_ads,
        (SELECT COUNT(*) FROM public.monetization_events WHERE engine_id = 2)::BIGINT AS total_affiliate,
        rev_premium AS total_premium,
        rev_donations AS total_donations,
        (SELECT COUNT(*) FROM public.partnership_leads)::BIGINT AS total_leads,
        (SELECT COALESCE(count, 0) FROM public.site_metrics WHERE id = 'api_hits' LIMIT 1)::BIGINT AS total_api_calls,
        total_rev AS total_revenue,
        (LEAST((total_rev / target_val) * 100, 100))::DECIMAL(5, 2) AS progress_percentage;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_monthly_stats() RETURNS TABLE(monthly_views bigint, monthly_revenue numeric) AS $$
BEGIN
  RETURN QUERY SELECT COALESCE(SUM(views_count)::BIGINT, 0::BIGINT) AS monthly_views, COALESCE(SUM(estimated_revenue)::DECIMAL(15, 6), 0.000000::DECIMAL(15, 6)) AS monthly_revenue FROM public.site_stats_daily WHERE date_trunc('month', day) = date_trunc('month', CURRENT_DATE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_news_feed_metrics(p_news_ids uuid[]) RETURNS TABLE(news_id uuid, like_count bigint, comment_count bigint, is_liked boolean, is_favorited boolean) AS $$
BEGIN
  RETURN QUERY SELECT n.id AS news_id, (SELECT COUNT(*) FROM likes l WHERE l.news_id = n.id) AS like_count, (SELECT COUNT(*) FROM comments c WHERE c.news_id = n.id AND c.is_moderated = false) AS comment_count, EXISTS(SELECT 1 FROM likes l WHERE l.news_id = n.id AND l.user_id = auth.uid()) AS is_liked, EXISTS(SELECT 1 FROM favorites f WHERE f.news_id = n.id AND f.user_id = auth.uid()) AS is_favorited FROM unnest(p_news_ids) AS nid JOIN news n ON n.id = nid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_site_wide_stats() RETURNS TABLE(total_views bigint, total_users bigint, total_news bigint, today_views bigint) AS $$
BEGIN
  RETURN QUERY SELECT ((SELECT COALESCE(SUM(view_count), 0) FROM public.news) + (SELECT COALESCE(SUM(view_count), 0) FROM public.blog_posts) + (SELECT COALESCE(SUM(views_count), 0) FROM public.site_stats_daily))::BIGINT AS total_views, (SELECT COUNT(*) FROM public.users)::BIGINT AS total_users, (SELECT COUNT(*) FROM public.news)::BIGINT AS total_news, (SELECT COALESCE(views_count, 0) FROM public.site_stats_daily WHERE day = CURRENT_DATE)::BIGINT AS today_views;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_trending_news(p_limit integer) RETURNS SETOF public.news AS $$
BEGIN
  RETURN QUERY SELECT * FROM news WHERE status = 'published' AND published_at > NOW() - INTERVAL '24 hours' ORDER BY (view_count + (like_count * 5) + (comment_count * 10)) DESC LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, nickname, avatar_url, role) VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'user_name', split_part(NEW.email, '@', 1)), NEW.raw_user_meta_data->>'avatar_url', 'user') ON CONFLICT (id) DO UPDATE SET nickname = EXCLUDED.nickname, avatar_url = EXCLUDED.avatar_url, updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.increment_daily_views() RETURNS void AS $$
BEGIN
    INSERT INTO public.site_stats_daily (day, views_count, estimated_revenue) VALUES (CURRENT_DATE, 1, 0.003) ON CONFLICT (day) DO UPDATE SET views_count = public.site_stats_daily.views_count + 1, estimated_revenue = (public.site_stats_daily.views_count + 1) * 0.003, updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.increment_item_view(p_table_name text, p_item_id uuid) RETURNS void AS $$
BEGIN
    IF p_table_name = 'news' THEN UPDATE public.news SET view_count = COALESCE(view_count, 0) + 1 WHERE id = p_item_id;
    ELSIF p_table_name = 'blog_posts' THEN UPDATE public.blog_posts SET view_count = COALESCE(view_count, 0) + 1 WHERE id = p_item_id;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.increment_site_metric(p_metric_id text) RETURNS void AS $$
BEGIN
    INSERT INTO public.site_metrics (id, count, updated_at) VALUES (p_metric_id, 1, NOW()) ON CONFLICT (id) DO UPDATE SET count = site_metrics.count + 1, updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.increment_view_count(post_id uuid) RETURNS void AS $$
BEGIN
  UPDATE news SET view_count = coalesce(view_count, 0) + 1 WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.update_updated_at_column() RETURNS trigger AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.update_user_premium_status() RETURNS trigger AS $$
BEGIN
  IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') THEN
    IF NEW.status = 'active' THEN UPDATE public.users SET is_premium = TRUE WHERE id = NEW.user_id;
    ELSE UPDATE public.users SET is_premium = FALSE WHERE id = NEW.user_id; END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
"""

with open(schema_final_path, "w", encoding="utf-8") as f:
    f.write(sql_content)
    f.write(functions_sql)

print("schema_final.sql generado exitosamente.")
