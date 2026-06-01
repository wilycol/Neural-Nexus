'award_interaction_credits' function

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


'get_monetization_overview' function

DECLARE
    target_val DECIMAL(15, 2) := 30000.00; -- Meta industrial: $30K
    rev_premium DECIMAL(15, 2);
    rev_donations DECIMAL(15, 2);
    total_rev DECIMAL(15, 2);
BEGIN
    -- 1. Calcular Ingresos Premium (Suscripciones activas * $10)
    -- Se verifica existencia de tabla 'subscriptions' de la migración billing_system
    SELECT COALESCE(COUNT(*), 0) * 10 
    INTO rev_premium 
    FROM public.subscriptions 
    WHERE status = 'active';
    
    -- 2. Calcular Donaciones Reales
    SELECT COALESCE(SUM(amount), 0) 
    INTO rev_donations 
    FROM public.donations;
    
    -- 3. Calcular Total Global
    total_rev := rev_premium + rev_donations;

    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM public.monetization_events WHERE engine_id = 1)::BIGINT AS total_ads,
        (SELECT COUNT(*) FROM public.monetization_events WHERE engine_id = 2)::BIGINT AS total_affiliate,
        rev_premium AS total_premium,
        rev_donations AS total_donations,
        (SELECT COUNT(*) FROM public.partnership_leads)::BIGINT AS total_leads,
        (SELECT COALESCE(count, 0) FROM public.site_metrics WHERE id = 'api_hits' LIMIT 1)::BIGINT AS total_api_calls,
        total_rev AS total_revenue,
        (LEAST((total_rev / target_val) * 100, 100))::DECIMAL(5, 2) AS progress_percentage;
END;


'get_monthly_stats' function

BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(views_count)::BIGINT, 0::BIGINT) AS monthly_views,
    COALESCE(SUM(estimated_revenue)::DECIMAL(15, 6), 0.000000::DECIMAL(15, 6)) AS monthly_revenue
  FROM public.site_stats_daily
  WHERE date_trunc('month', day) = date_trunc('month', CURRENT_DATE);
END;


'get_news_feed_metrics' function

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


'get_site_wide_stats' function

BEGIN
  RETURN QUERY
  SELECT 
    ((SELECT COALESCE(SUM(view_count), 0) FROM public.news) + 
     (SELECT COALESCE(SUM(view_count), 0) FROM public.blog_posts) + 
     (SELECT COALESCE(SUM(views_count), 0) FROM public.site_stats_daily))::BIGINT AS total_views,
    
    (SELECT COUNT(*) FROM public.users)::BIGINT AS total_users,
    (SELECT COUNT(*) FROM public.news)::BIGINT AS total_news,
    
    (SELECT COALESCE(views_count, 0) FROM public.site_stats_daily WHERE day = CURRENT_DATE)::BIGINT AS today_views;
END;


'get_trending_news' function

BEGIN
  RETURN QUERY
  SELECT *
  FROM news
  WHERE status = 'published'
    AND published_at > NOW() - INTERVAL '24 hours'
  ORDER BY (view_count + (like_count * 5) + (comment_count * 10)) DESC
  LIMIT p_limit;
END;


'handle_new_user' function

BEGIN
  INSERT INTO public.users (id, email, nickname, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name', 
      NEW.raw_user_meta_data->>'name', 
      NEW.raw_user_meta_data->>'user_name', 
      split_part(NEW.email, '@', 1)
    ),
    NEW.raw_user_meta_data->>'avatar_url',
    'user'
  )
  ON CONFLICT (id) DO UPDATE SET
    nickname = EXCLUDED.nickname,
    avatar_url = EXCLUDED.avatar_url,
    updated_at = NOW();
  RETURN NEW;
END;


'increment_daily_views' function

BEGIN
    INSERT INTO public.site_stats_daily (day, views_count, estimated_revenue)
    VALUES (CURRENT_DATE, 1, 0.003)
    ON CONFLICT (day)
    DO UPDATE SET 
        views_count = public.site_stats_daily.views_count + 1,
        estimated_revenue = (public.site_stats_daily.views_count + 1) * 0.003,
        updated_at = NOW();
END;


'increment_item_view' function

BEGIN
    IF p_table_name = 'news' THEN
        UPDATE public.news SET view_count = COALESCE(view_count, 0) + 1 WHERE id = p_item_id;
    ELSIF p_table_name = 'blog_posts' THEN
        UPDATE public.blog_posts SET view_count = COALESCE(view_count, 0) + 1 WHERE id = p_item_id;
    END IF;
END;


'increment_site_metric' function

BEGIN
    INSERT INTO public.site_metrics (id, count, updated_at)
    VALUES (p_metric_id, 1, NOW())
    ON CONFLICT (id) DO UPDATE
    SET count = site_metrics.count + 1,
        updated_at = NOW();
END;


'increment_view_count' function

begin
  update news
  set view_count = coalesce(view_count, 0) + 1
  where id = post_id;
end;


'update_updated_at_column' function

BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;


'update_user_premium_status' function

BEGIN
  IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') THEN
    IF NEW.status = 'active' THEN
      UPDATE public.users SET is_premium = TRUE WHERE id = NEW.user_id;
    ELSE
      UPDATE public.users SET is_premium = FALSE WHERE id = NEW.user_id;
    END IF;
  END IF;
  RETURN NEW;
END;
