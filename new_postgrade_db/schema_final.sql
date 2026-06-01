-- =========================================================
-- APPROXIMATE “SCHEMA-ONLY” RECONSTRUCTION for public schema
-- Based on inspected metadata:
--  - pg_policies (exact cmd/qual/with_check per policy name)
--  - pg_indexes (exact index definitions)
--  - pg_get_triggerdef (exact trigger statements + trigger function names)
--  - information_schema.routines (function bodies ONLY, without names/signatures)
--
-- LIMITATION:
-- information_schema.routines did NOT provide function names/signatures.
-- Therefore, for functions we ONLY can safely create those that are
-- referenced by triggers we can see by name:
--   - award_interaction_credits()
--   - update_user_premium_status()
--   - update_updated_at_column()
-- All other routine bodies are included as “commented placeholders”.
-- =========================================================

-- ---- Extensions (safe defaults; IF EXISTS ok) ----
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================================
-- TABLES (structure approximation from inspected columns)
-- =========================================================

-- public.users
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  email text,
  nickname text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  is_premium boolean DEFAULT false,
  share_count integer DEFAULT 0,
  role text DEFAULT 'user'::text,
  credits integer DEFAULT 0,
  badge_level integer DEFAULT 1,
  wompi_customer_id text,
  binance_customer_id text,
  CONSTRAINT users_role_check
    CHECK (role = ANY (ARRAY['user'::text,'admin'::text,'moderator'::text]))
);

-- public.news
CREATE TABLE IF NOT EXISTS public.news (
  id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  title text,
  summary text,
  content text,
  image_url text,
  video_url text,
  source_name text,
  source_url text,
  source_icon text,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  category text DEFAULT 'general'::text,
  tags text[] DEFAULT '{}'::text[],
  relevance_score double precision DEFAULT 0.5,
  mention_count integer DEFAULT 1,
  is_top_story boolean DEFAULT false,
  ai_generated boolean DEFAULT false,
  slug text UNIQUE,
  view_count integer DEFAULT 0,
  like_count integer DEFAULT 0,
  comment_count integer DEFAULT 0,
  share_count integer DEFAULT 0,
  status text DEFAULT 'published'::text,
  excerpt text,
  content_type text DEFAULT 'image'::text,
  cover_url text,
  audio_url text,
  subtitles_url text,
  has_audio boolean DEFAULT false,
  has_subtitles boolean DEFAULT false,
  is_short boolean DEFAULT true,
  is_reusable boolean DEFAULT true,
  author_id uuid,
  youtube_url text,
  youtube_published_at timestamptz,
  facebook_url text,
  facebook_published_at timestamptz,
  instagram_url text,
  instagram_published_at timestamptz,
  tiktok_url text,
  tiktok_published_at timestamptz
);

-- public.blog_posts
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  title text,
  slug text UNIQUE,
  excerpt text,
  content text,
  image_url text,
  video_url text,
  author_id text,
  author_nickname text,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  read_time integer DEFAULT 5,
  view_count integer DEFAULT 0,
  like_count integer DEFAULT 0,
  comment_count integer DEFAULT 0,
  share_count integer DEFAULT 0,
  tags text[] DEFAULT '{}'::text[],
  related_news uuid[] DEFAULT '{}'::uuid[],
  featured boolean DEFAULT false
);

-- public.likes
CREATE TABLE IF NOT EXISTS public.likes (
  id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  user_id uuid,
  news_id uuid,
  blog_post_id uuid,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT likes_news_id_fkey FOREIGN KEY (news_id) REFERENCES public.news(id),
  CONSTRAINT likes_blog_post_id_fkey FOREIGN KEY (blog_post_id) REFERENCES public.blog_posts(id),
  CONSTRAINT likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);

-- public.comments
CREATE TABLE IF NOT EXISTS public.comments (
  id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  user_id uuid,
  user_nickname text,
  user_avatar text,
  news_id uuid,
  blog_post_id uuid,
  content text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  parent_id uuid,
  is_moderated boolean DEFAULT false,
  toxicity_score double precision,
  CONSTRAINT comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT comments_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.comments(id),
  CONSTRAINT comments_blog_post_id_fkey FOREIGN KEY (blog_post_id) REFERENCES public.blog_posts(id),
  CONSTRAINT comments_news_id_fkey FOREIGN KEY (news_id) REFERENCES public.news(id)
);

-- public.favorites
CREATE TABLE IF NOT EXISTS public.favorites (
  id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  user_id uuid,
  news_id uuid,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT favorites_news_id_fkey FOREIGN KEY (news_id) REFERENCES public.news(id)
);

-- public.shares
CREATE TABLE IF NOT EXISTS public.shares (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  news_id uuid,
  blog_post_id uuid,
  platform text,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT shares_news_id_fkey FOREIGN KEY (news_id) REFERENCES public.news(id),
  CONSTRAINT shares_blog_post_id_fkey FOREIGN KEY (blog_post_id) REFERENCES public.blog_posts(id),
  CONSTRAINT shares_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

-- public.news_sources
CREATE TABLE IF NOT EXISTS public.news_sources (
  id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  name text,
  rss_url text UNIQUE,
  category text DEFAULT 'Inteligencia Artificial'::text,
  is_active boolean DEFAULT true,
  priority integer DEFAULT 1,
  last_fetch_at timestamptz,
  fetch_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- public.crawler_logs
CREATE TABLE IF NOT EXISTS public.crawler_logs (
  id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  started_at timestamptz DEFAULT now(),
  finished_at timestamptz,
  status text DEFAULT 'running'::text,
  sources_processed integer DEFAULT 0,
  items_found integer DEFAULT 0,
  published_items jsonb DEFAULT '[]'::jsonb,
  error_log text,
  created_at timestamptz DEFAULT now()
);

-- public.top_5_tasks
CREATE TABLE IF NOT EXISTS public.top_5_tasks (
  id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  news_id uuid,
  video_prompt text,
  status text DEFAULT 'pending'::text,
  video_url text,
  priority integer DEFAULT 100,
  created_at timestamptz DEFAULT now(),
  processed_at timestamptz,
  finished_at timestamptz,
  error_details text,
  CONSTRAINT top_5_tasks_news_id_fkey FOREIGN KEY (news_id) REFERENCES public.news(id)
);

-- public.site_metrics
CREATE TABLE IF NOT EXISTS public.site_metrics (
  id text PRIMARY KEY,
  "count" bigint DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

-- public.site_stats_daily
CREATE TABLE IF NOT EXISTS public.site_stats_daily (
  day date PRIMARY KEY DEFAULT CURRENT_DATE,
  views_count bigint DEFAULT 0,
  unique_visitors bigint DEFAULT 0,
  estimated_revenue numeric DEFAULT 0.00,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- public.subscriptions
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  status text,
  price_id text,
  provider text,
  provider_subscription_id text UNIQUE,
  current_period_start timestamptz DEFAULT now(),
  current_period_end timestamptz,
  cancel_at_period_end boolean DEFAULT false,
  canceled_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT subscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);

-- public.donations
CREATE TABLE IF NOT EXISTS public.donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  amount numeric,
  currency text DEFAULT 'USD'::text,
  donor_name text DEFAULT 'Anónimo'::text,
  comment text,
  is_public boolean DEFAULT true,
  provider text,
  transaction_id text UNIQUE,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT donations_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);

-- public.partnership_leads
CREATE TABLE IF NOT EXISTS public.partnership_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  email text,
  company text,
  type text,
  message text,
  source text DEFAULT 'marquee'::text,
  status text DEFAULT 'pending'::text,
  created_at timestamptz DEFAULT now()
);

-- public.monetization_events
CREATE TABLE IF NOT EXISTS public.monetization_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text,
  engine_id integer,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- public.ai_missions
CREATE TABLE IF NOT EXISTS public.ai_missions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  description text,
  mission_type text,
  priority text DEFAULT 'medium'::text,
  status text DEFAULT 'pending'::text,
  metadata jsonb DEFAULT '{}'::jsonb,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- public.monetization_checklists
CREATE TABLE IF NOT EXISTS public.monetization_checklists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  motor_id text,
  step_id integer,
  is_completed boolean DEFAULT true,
  admin_id uuid,
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT monetization_checklists_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES auth.users(id)
);

-- public.factory_missions
CREATE TABLE IF NOT EXISTS public.factory_missions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  news_id uuid,
  title text,
  description text,
  content text,
  platform text DEFAULT 'tiktok'::text,
  mode text DEFAULT 'classic'::text,
  status text DEFAULT 'pending'::text,
  published_url text,
  error_log text,
  ai_metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT factory_missions_news_id_fkey FOREIGN KEY (news_id) REFERENCES public.news(id),
  CONSTRAINT factory_missions_status_check
    CHECK (status = ANY (ARRAY['pending'::text,'processing'::text,'completed'::text,'failed'::text]))
);

-- public.pitch_videos
CREATE TABLE IF NOT EXISTS public.pitch_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  url text,
  category text,
  created_at timestamptz DEFAULT now()
);

-- public.admin_alerts
CREATE TABLE IF NOT EXISTS public.admin_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text,
  title text,
  message text,
  target_id text,
  status text DEFAULT 'pending'::text,
  severity text DEFAULT 'info'::text,
  created_at timestamptz DEFAULT now(),
  metadata jsonb
);

-- =========================================================
-- INDEXES (exact from pg_indexes output)
-- =========================================================
-- Note: safe with IF NOT EXISTS is not always supported for indexdef as-is.
-- We re-emit as-is; you can rerun after drop or ensure clean DB.

CREATE UNIQUE INDEX IF NOT EXISTS blog_posts_pkey ON public.blog_posts USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS blog_posts_slug_key ON public.blog_posts USING btree (slug);

CREATE UNIQUE INDEX IF NOT EXISTS likes_pkey ON public.likes USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS likes_user_id_news_id_key ON public.likes USING btree (user_id, news_id);
CREATE UNIQUE INDEX IF NOT EXISTS likes_user_id_blog_post_id_key ON public.likes USING btree (user_id, blog_post_id);

CREATE UNIQUE INDEX IF NOT EXISTS users_pkey ON public.users USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS users_email_key ON public.users USING btree (email);
CREATE UNIQUE INDEX IF NOT EXISTS users_nickname_key ON public.users USING btree (nickname);

CREATE UNIQUE INDEX IF NOT EXISTS comments_pkey ON public.comments USING btree (id);

CREATE UNIQUE INDEX IF NOT EXISTS site_stats_daily_pkey ON public.site_stats_daily USING btree (day);

CREATE UNIQUE INDEX IF NOT EXISTS shares_pkey ON public.shares USING btree (id);

CREATE UNIQUE INDEX IF NOT EXISTS news_sources_pkey ON public.news_sources USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS news_sources_rss_url_key ON public.news_sources USING btree (rss_url);

CREATE UNIQUE INDEX IF NOT EXISTS crawler_logs_pkey ON public.crawler_logs USING btree (id);

CREATE UNIQUE INDEX IF NOT EXISTS top_5_tasks_pkey ON public.top_5_tasks USING btree (id);

CREATE UNIQUE INDEX IF NOT EXISTS partnership_leads_pkey ON public.partnership_leads USING btree (id);

CREATE UNIQUE INDEX IF NOT EXISTS monetization_events_pkey ON public.monetization_events USING btree (id);

CREATE UNIQUE INDEX IF NOT EXISTS ai_missions_pkey ON public.ai_missions USING btree (id);

CREATE UNIQUE INDEX IF NOT EXISTS factory_missions_pkey ON public.factory_missions USING btree (id);
CREATE INDEX IF NOT EXISTS idx_factory_missions_status ON public.factory_missions USING btree (status);
CREATE INDEX IF NOT EXISTS idx_factory_missions_created_at ON public.factory_missions USING btree (created_at);

CREATE UNIQUE INDEX IF NOT EXISTS favorites_pkey ON public.favorites USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS favorites_user_id_news_id_key ON public.favorites USING btree (user_id, news_id);

CREATE UNIQUE INDEX IF NOT EXISTS monetization_checklists_pkey ON public.monetization_checklists USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS monetization_checklists_motor_id_step_id_admin_id_key
  ON public.monetization_checklists USING btree (motor_id, step_id, admin_id);

CREATE UNIQUE INDEX IF NOT EXISTS site_metrics_pkey ON public.site_metrics USING btree (id);

CREATE UNIQUE INDEX IF NOT EXISTS pitch_videos_pkey ON public.pitch_videos USING btree (id);

CREATE UNIQUE INDEX IF NOT EXISTS news_pkey ON public.news USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS news_slug_key ON public.news USING btree (slug);

CREATE UNIQUE INDEX IF NOT EXISTS subscriptions_pkey ON public.subscriptions USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS subscriptions_provider_subscription_id_key
  ON public.subscriptions USING btree (provider_subscription_id);

CREATE UNIQUE INDEX IF NOT EXISTS donations_pkey ON public.donations USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS donations_transaction_id_key ON public.donations USING btree (transaction_id);

CREATE UNIQUE INDEX IF NOT EXISTS admin_alerts_pkey ON public.admin_alerts USING btree (id);

-- =========================================================
-- ENABLE ROW LEVEL SECURITY (from rls_enabled metadata)
-- =========================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crawler_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.top_5_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_stats_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partnership_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monetization_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monetization_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pitch_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_alerts ENABLE ROW LEVEL SECURITY;

-- =========================================================
-- CREATE POLICIES (exactly from your pg_policies output)
-- =========================================================

-- public.news
DROP POLICY IF EXISTS "Enable public read access for news" ON public.news;
CREATE POLICY "Enable public read access for news" ON public.news
  AS PERMISSIVE FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Allow Public Select" ON public.news;
CREATE POLICY "Allow Public Select" ON public.news
  AS PERMISSIVE FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Enable insert for Beatriz API" ON public.news;
CREATE POLICY "Enable insert for Beatriz API" ON public.news
  AS PERMISSIVE FOR INSERT
  TO public
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow Admin Delete" ON public.news;
CREATE POLICY "Allow Admin Delete" ON public.news
  AS PERMISSIVE FOR DELETE
  TO public
  USING (
    EXISTS (
      SELECT 1
      FROM users
      WHERE ((users.id = auth.uid()) AND (users.role = 'admin'::text))
    )
  );

DROP POLICY IF EXISTS "Allow Admin Update" ON public.news;
CREATE POLICY "Allow Admin Update" ON public.news
  AS PERMISSIVE FOR UPDATE
  TO public
  USING (
    EXISTS (
      SELECT 1
      FROM users
      WHERE ((users.id = auth.uid()) AND (users.role = 'admin'::text))
    )
  );

-- public.users
DROP POLICY IF EXISTS "Users can view own profile data" ON public.users;
CREATE POLICY "Users can view own profile data" ON public.users
  AS PERMISSIVE FOR SELECT
  TO public
  USING (auth.uid() = id);

-- public.news_sources
DROP POLICY IF EXISTS "Public Read Sources" ON public.news_sources;
CREATE POLICY "Public Read Sources" ON public.news_sources
  AS PERMISSIVE FOR SELECT
  TO public
  USING (true);

-- public.crawler_logs
DROP POLICY IF EXISTS "Public Read Crawler Logs" ON public.crawler_logs;
CREATE POLICY "Public Read Crawler Logs" ON public.crawler_logs
  AS PERMISSIVE FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Service Insert Logs" ON public.crawler_logs;
CREATE POLICY "Service Insert Logs" ON public.crawler_logs
  AS PERMISSIVE FOR INSERT
  TO public
  WITH CHECK (true);

DROP POLICY IF EXISTS "Service Update Logs" ON public.crawler_logs;
CREATE POLICY "Service Update Logs" ON public.crawler_logs
  AS PERMISSIVE FOR UPDATE
  TO public
  USING (true);

-- public.top_5_tasks
DROP POLICY IF EXISTS "Public Read Top 5 Tasks" ON public.top_5_tasks;
CREATE POLICY "Public Read Top 5 Tasks" ON public.top_5_tasks
  AS PERMISSIVE FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Service Insert Top 5" ON public.top_5_tasks;
CREATE POLICY "Service Insert Top 5" ON public.top_5_tasks
  AS PERMISSIVE FOR INSERT
  TO public
  WITH CHECK (true);

DROP POLICY IF EXISTS "Service Update Top 5" ON public.top_5_tasks;
CREATE POLICY "Service Update Top 5" ON public.top_5_tasks
  AS PERMISSIVE FOR UPDATE
  TO public
  USING (true);

-- public.site_stats_daily
DROP POLICY IF EXISTS "Lectura pública de estadísticas diarias" ON public.site_stats_daily;
CREATE POLICY "Lectura pública de estadísticas diarias" ON public.site_stats_daily
  AS PERMISSIVE FOR SELECT
  TO public
  USING (true);

-- public.subscriptions
DROP POLICY IF EXISTS "Users can view own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions
  AS PERMISSIVE FOR SELECT
  TO public
  USING (auth.uid() = user_id);

-- public.donations
DROP POLICY IF EXISTS "Public can view public donations" ON public.donations;
CREATE POLICY "Public can view public donations" ON public.donations
  AS PERMISSIVE FOR SELECT
  TO public
  USING (is_public = true);

DROP POLICY IF EXISTS "Users can view own donations" ON public.donations;
CREATE POLICY "Users can view own donations" ON public.donations
  AS PERMISSIVE FOR SELECT
  TO public
  USING (auth.uid() = user_id);

-- public.blog_posts
DROP POLICY IF EXISTS "Allow Public Select" ON public.blog_posts;
CREATE POLICY "Allow Public Select" ON public.blog_posts
  AS PERMISSIVE FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Allow Admin All" ON public.blog_posts;
CREATE POLICY "Allow Admin All" ON public.blog_posts
  AS PERMISSIVE FOR ALL
  TO public
  USING (
    EXISTS (
      SELECT 1
      FROM users
      WHERE ((users.id = auth.uid()) AND (users.role = 'admin'::text))
    )
  );

-- public.likes
DROP POLICY IF EXISTS "Allow Public Select" ON public.likes;
CREATE POLICY "Allow Public Select" ON public.likes
  AS PERMISSIVE FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Allow Auth Insert" ON public.likes;
CREATE POLICY "Allow Auth Insert" ON public.likes
  AS PERMISSIVE FOR INSERT
  TO public
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow Owner Delete" ON public.likes;
CREATE POLICY "Allow Owner Delete" ON public.likes
  AS PERMISSIVE FOR DELETE
  TO public
  USING (auth.uid() = user_id);

-- public.comments
DROP POLICY IF EXISTS "Allow Public Select" ON public.comments;
CREATE POLICY "Allow Public Select" ON public.comments
  AS PERMISSIVE FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Allow Auth Insert" ON public.comments;
CREATE POLICY "Allow Auth Insert" ON public.comments
  AS PERMISSIVE FOR INSERT
  TO public
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow Owner/Admin Modify" ON public.comments;
CREATE POLICY "Allow Owner/Admin Modify" ON public.comments
  AS PERMISSIVE FOR ALL
  TO public
  USING (
    (auth.uid() = user_id)
    OR
    EXISTS (
      SELECT 1
      FROM users
      WHERE ((users.id = auth.uid()) AND (users.role = 'admin'::text))
    )
  );

-- public.favorites
DROP POLICY IF EXISTS "Allow Public Select" ON public.favorites;
CREATE POLICY "Allow Public Select" ON public.favorites
  AS PERMISSIVE FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Allow Owner All" ON public.favorites;
CREATE POLICY "Allow Owner All" ON public.favorites
  AS PERMISSIVE FOR ALL
  TO public
  USING (auth.uid() = user_id);

-- public.shares
DROP POLICY IF EXISTS "Allow Public Select" ON public.shares;
CREATE POLICY "Allow Public Select" ON public.shares
  AS PERMISSIVE FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Allow Auth Insert" ON public.shares;
CREATE POLICY "Allow Auth Insert" ON public.shares
  AS PERMISSIVE FOR INSERT
  TO public
  WITH CHECK (auth.uid() = user_id);

-- public.site_metrics
DROP POLICY IF EXISTS "Allow Public Insert" ON public.site_metrics;
CREATE POLICY "Allow Public Insert" ON public.site_metrics
  AS PERMISSIVE FOR INSERT
  TO public
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow Admin Read" ON public.site_metrics;
CREATE POLICY "Allow Admin Read" ON public.site_metrics
  AS PERMISSIVE FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1
      FROM users
      WHERE ((users.id = auth.uid()) AND (users.role = 'admin'::text))
    )
  );

-- public.partnership_leads
DROP POLICY IF EXISTS "Admins manage leads" ON public.partnership_leads;
CREATE POLICY "Admins manage leads" ON public.partnership_leads
  AS PERMISSIVE FOR ALL
  TO public
  USING (
    (auth.jwt() ->> 'email'::text) IN (
      SELECT users.email
      FROM users
      WHERE (users.role = 'admin'::text)
    )
  );

DROP POLICY IF EXISTS "Public insert leads" ON public.partnership_leads;
CREATE POLICY "Public insert leads" ON public.partnership_leads
  AS PERMISSIVE FOR INSERT
  TO public
  WITH CHECK (true);

-- public.ai_missions
DROP POLICY IF EXISTS "Admins manage missions" ON public.ai_missions;
CREATE POLICY "Admins manage missions" ON public.ai_missions
  AS PERMISSIVE FOR ALL
  TO public
  USING (
    (auth.jwt() ->> 'email'::text) IN (
      SELECT users.email
      FROM users
      WHERE (users.role = 'admin'::text)
    )
  );

-- public.monetization_events
DROP POLICY IF EXISTS "Public insert events" ON public.monetization_events;
CREATE POLICY "Public insert events" ON public.monetization_events
  AS PERMISSIVE FOR INSERT
  TO public
  WITH CHECK (true);

-- public.monetization_checklists
DROP POLICY IF EXISTS "Admins manage their own checklists" ON public.monetization_checklists;
CREATE POLICY "Admins manage their own checklists" ON public.monetization_checklists
  AS PERMISSIVE FOR ALL
  TO public
  USING (
    (auth.jwt() ->> 'email'::text) IN (
      SELECT users.email
      FROM users
      WHERE (users.role = 'admin'::text)
    )
  )
  WITH CHECK (
    (auth.jwt() ->> 'email'::text) IN (
      SELECT users.email
      FROM users
      WHERE (users.role = 'admin'::text)
    )
  );

-- public.pitch_videos
DROP POLICY IF EXISTS "Permitir lectura pública de videos del Pitch" ON public.pitch_videos;
CREATE POLICY "Permitir lectura pública de videos del Pitch" ON public.pitch_videos
  AS PERMISSIVE FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Permitir gestión industrial solo a Beatriz" ON public.pitch_videos;
CREATE POLICY "Permitir gestión industrial solo a Beatriz" ON public.pitch_videos
  AS PERMISSIVE FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- public.admin_alerts
DROP POLICY IF EXISTS "Beatriz can insert alerts" ON public.admin_alerts;
CREATE POLICY "Beatriz can insert alerts" ON public.admin_alerts
  AS PERMISSIVE FOR INSERT
  TO public
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admin can manage alerts" ON public.admin_alerts;
CREATE POLICY "Admin can manage alerts" ON public.admin_alerts
  AS PERMISSIVE FOR ALL
  TO public
  USING (true);

-- =========================================================
-- FUNCTIONS referenced by triggers (we can name them from triggerdef)
-- =========================================================

-- update_updated_at_column()
-- (Routine body you provided: NEW.updated_at = NOW(); RETURN NEW;)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- update_user_premium_status()
-- (Routine body you provided: IF TG_OP ... NEW.status = 'active' THEN ... is_premium ...)
CREATE OR REPLACE FUNCTION public.update_user_premium_status()
RETURNS trigger
LANGUAGE plpgsql
AS $$
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
$$;

-- award_interaction_credits()
-- (Routine body you provided: credits per TG_TABLE_NAME for comments/likes/shares/favorites)
CREATE OR REPLACE FUNCTION public.award_interaction_credits()
RETURNS trigger
LANGUAGE plpgsql
AS $$
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
$$;

-- =========================================================
-- TRIGGERS (exact from your pg_get_triggerdef output)
-- Note: Many RI_ConstraintTrigger_* are created automatically by FK constraints.
-- Since we re-created FKs, those RI triggers will exist.
-- We DO include the non-RI triggers that were explicitly present:
--   - tr_on_comment_award
--   - tr_on_like_award
--   - tr_on_share_award
--   - tr_on_favorite_award
--   - on_subscription_change
--   - update_factory_missions_updated_at
-- =========================================================

CREATE TRIGGER tr_on_comment_award
AFTER INSERT ON public.comments
FOR EACH ROW
EXECUTE FUNCTION award_interaction_credits();

CREATE TRIGGER tr_on_like_award
AFTER INSERT ON public.likes
FOR EACH ROW
EXECUTE FUNCTION award_interaction_credits();

CREATE TRIGGER tr_on_share_award
AFTER INSERT ON public.shares
FOR EACH ROW
EXECUTE FUNCTION award_interaction_credits();

CREATE TRIGGER tr_on_favorite_award
AFTER INSERT ON public.favorites
FOR EACH ROW
EXECUTE FUNCTION award_interaction_credits();

CREATE TRIGGER on_subscription_change
AFTER INSERT OR UPDATE ON public.subscriptions
FOR EACH ROW
EXECUTE FUNCTION update_user_premium_status();

CREATE TRIGGER update_factory_missions_updated_at
BEFORE UPDATE ON public.factory_missions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- =========================================================

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
