export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          nickname: string;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
          is_premium: boolean;
          share_count: number;
          credits: number;
          role: 'user' | 'admin' | 'moderator';
          affiliate_code: string | null;
        };
        Insert: {
          id?: string;
          email: string;
          nickname: string;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
          is_premium?: boolean;
          share_count?: number;
          role?: 'user' | 'admin' | 'moderator';
          affiliate_code?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          nickname?: string;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
          is_premium?: boolean;
          share_count?: number;
          role?: 'user' | 'admin' | 'moderator';
          affiliate_code?: string | null;
        };
        Relationships: [];
      };
      news: {
        Row: {
          id: string;
          title: string;
          summary: string;
          content: string | null;
          image_url: string | null;
          source_name: string;
          source_url: string;
          source_icon: string | null;
          published_at: string;
          created_at: string;
          category: 'Inteligencia Artificial' | 'Software' | 'Hardware' | 'Robótica' | 'Historia Tech' | 'Futuro y Tendencias' | 'Startups Tech' | 'IA en la Vida Real' | 'Seguridad y Ética' | 'Gadgets' | 'Datos Curiosos Tech' | 'Rankings';
          tags: string[];
          relevance_score: number;
          mention_count: number;
          is_top_story: boolean;
          ai_generated: boolean;
          slug: string;
          video_url: string | null;
          content_type: 'image' | 'video' | 'carousel' | 'analysis';
          cover_url: string | null;
          audio_url: string | null;
          subtitles_url: string | null;
          has_audio: boolean;
          has_subtitles: boolean;
          is_short: boolean;
          is_reusable: boolean;
          view_count: number;
        };
        Insert: {
          id?: string;
          title: string;
          summary: string;
          content?: string | null;
          image_url?: string | null;
          source_name: string;
          source_url: string;
          source_icon?: string | null;
          published_at: string;
          created_at?: string;
          category?: 'Inteligencia Artificial' | 'Software' | 'Hardware' | 'Robótica' | 'Historia Tech' | 'Futuro y Tendencias' | 'Startups Tech' | 'IA en la Vida Real' | 'Seguridad y Ética' | 'Gadgets' | 'Datos Curiosos Tech' | 'Rankings';
          tags?: string[];
          relevance_score?: number;
          mention_count?: number;
          is_top_story?: boolean;
          ai_generated?: boolean;
          slug: string;
          video_url?: string | null;
          content_type?: 'image' | 'video' | 'carousel' | 'analysis';
          cover_url?: string | null;
          audio_url?: string | null;
          subtitles_url?: string | null;
          has_audio?: boolean;
          has_subtitles?: boolean;
          is_short?: boolean;
          is_reusable?: boolean;
          view_count?: number;
        };
        Update: {
          id?: string;
          title?: string;
          summary?: string;
          content?: string | null;
          image_url?: string | null;
          source_name?: string;
          source_url?: string;
          source_icon?: string | null;
          published_at?: string;
          created_at?: string;
          category?: 'modelos' | 'herramientas' | 'memes' | 'papers' | 'drama' | 'general';
          tags?: string[];
          relevance_score?: number;
          mention_count?: number;
          is_top_story?: boolean;
          ai_generated?: boolean;
          slug?: string;
          video_url?: string | null;
          content_type?: 'image' | 'video' | 'carousel' | 'analysis';
          cover_url?: string | null;
          audio_url?: string | null;
          subtitles_url?: string | null;
          has_audio?: boolean;
          has_subtitles?: boolean;
          is_short?: boolean;
          is_reusable?: boolean;
          view_count?: number;
        };
        Relationships: [];
      };
      blog_posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string;
          content: string;
          image_url: string | null;
          author_id: string;
          author_nickname: string;
          published_at: string;
          created_at: string;
          updated_at: string;
          read_time: number;
          view_count: number;
          like_count: number;
          comment_count: number;
          share_count: number;
          tags: string[];
          related_news: string[];
          featured: boolean;
          video_url: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          excerpt: string;
          content: string;
          image_url?: string | null;
          author_id: string;
          author_nickname: string;
          published_at: string;
          created_at?: string;
          updated_at?: string;
          read_time: number;
          view_count?: number;
          like_count?: number;
          comment_count?: number;
          share_count?: number;
          tags?: string[];
          related_news?: string[];
          featured?: boolean;
          video_url?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          excerpt?: string;
          content?: string;
          image_url?: string | null;
          author_id?: string;
          author_nickname?: string;
          published_at?: string;
          created_at?: string;
          updated_at?: string;
          read_time?: number;
          view_count?: number;
          like_count?: number;
          comment_count?: number;
          share_count?: number;
          tags?: string[];
          related_news?: string[];
          featured?: boolean;
          video_url?: string | null;
        };
        Relationships: [];
      };
      likes: {
        Row: {
          id: string;
          user_id: string;
          news_id: string | null;
          blog_post_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          news_id?: string | null;
          blog_post_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          news_id?: string | null;
          blog_post_id?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      comments: {
        Row: {
          id: string;
          user_id: string;
          user_nickname: string;
          user_avatar: string | null;
          news_id: string | null;
          blog_post_id: string | null;
          content: string;
          created_at: string;
          updated_at: string;
          parent_id: string | null;
          is_moderated: boolean;
          toxicity_score: number | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          user_nickname: string;
          user_avatar?: string | null;
          news_id?: string | null;
          blog_post_id?: string | null;
          content: string;
          created_at?: string;
          updated_at?: string;
          parent_id?: string | null;
          is_moderated?: boolean;
          toxicity_score?: number | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          user_nickname?: string;
          user_avatar?: string | null;
          news_id?: string | null;
          blog_post_id?: string | null;
          content?: string;
          created_at?: string;
          updated_at?: string;
          parent_id?: string | null;
          is_moderated?: boolean;
          toxicity_score?: number | null;
        };
        Relationships: [];
      };
      favorites: {
        Row: {
          id: string;
          user_id: string;
          news_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          news_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          news_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      shares: {
        Row: {
          id: string;
          user_id: string;
          news_id: string | null;
          blog_post_id: string | null;
          platform: 'copy' | 'x' | 'whatsapp' | 'telegram' | 'facebook' | 'linkedin';
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          news_id?: string | null;
          blog_post_id?: string | null;
          platform: 'copy' | 'x' | 'whatsapp' | 'telegram' | 'facebook' | 'linkedin';
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          news_id?: string | null;
          blog_post_id?: string | null;
          platform?: 'copy' | 'x' | 'whatsapp' | 'telegram' | 'facebook' | 'linkedin';
          created_at?: string;
        };
        Relationships: [];
      };
      news_sources: {
        Row: {
          id: string;
          name: string;
          url: string;
          rss_url: string;
          icon_url: string | null;
          category: string;
          is_active: boolean;
          last_fetch_at: string | null;
          fetch_count: number;
          priority: number;
        };
        Insert: {
          id?: string;
          name: string;
          url: string;
          rss_url: string;
          icon_url?: string | null;
          category: string;
          is_active?: boolean;
          last_fetch_at?: string | null;
          fetch_count?: number;
          priority?: number;
        };
        Update: {
          id?: string;
          name?: string;
          url?: string;
          rss_url?: string;
          icon_url?: string | null;
          category?: string;
          is_active?: boolean;
          last_fetch_at?: string | null;
          fetch_count?: number;
          priority?: number;
        };
        Relationships: [];
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          status: 'active' | 'cancelled' | 'expired';
          plan: 'monthly' | 'yearly';
          started_at: string;
          expires_at: string;
          payment_method: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          status: 'active' | 'cancelled' | 'expired';
          plan: 'monthly' | 'yearly';
          started_at: string;
          expires_at: string;
          payment_method?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          status?: 'active' | 'cancelled' | 'expired';
          plan?: 'monthly' | 'yearly';
          started_at?: string;
          expires_at?: string;
          payment_method?: string | null;
        };
        Relationships: [];
      };
      crawler_logs: {
        Row: {
          id: string;
          started_at: string;
          finished_at: string | null;
          status: 'running' | 'success' | 'failed';
          sources_processed: number;
          items_found: number;
          published_items: Json;
          error_log: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          started_at?: string;
          finished_at?: string | null;
          status?: 'running' | 'success' | 'failed';
          sources_processed?: number;
          items_found?: number;
          published_items?: Json;
          error_log?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          started_at?: string;
          finished_at?: string | null;
          status?: 'running' | 'success' | 'failed';
          sources_processed?: number;
          items_found?: number;
          published_items?: Json;
          error_log?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      top_5_tasks: {
        Row: {
          id: string;
          news_id: string;
          video_prompt: string;
          status: 'pending' | 'processing' | 'completed' | 'failed';
          video_url: string | null;
          priority: number;
          created_at: string;
          processed_at: string | null;
          finished_at: string | null;
          error_details: string | null;
        };
        Insert: {
          id?: string;
          news_id: string;
          video_prompt: string;
          status?: 'pending' | 'processing' | 'completed' | 'failed';
          video_url?: string | null;
          priority?: number;
          created_at?: string;
          processed_at?: string | null;
          finished_at?: string | null;
          error_details?: string | null;
        };
        Update: {
          id?: string;
          news_id?: string;
          video_prompt?: string;
          status?: 'pending' | 'processing' | 'completed' | 'failed';
          video_url?: string | null;
          priority?: number;
          created_at?: string;
          processed_at?: string | null;
          finished_at?: string | null;
          error_details?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "top_5_tasks_news_id_fkey";
            columns: ["news_id"];
            referencedRelation: "news";
            referencedColumns: ["id"];
          }
        ];
      };
      donations: {
        Row: {
          id: string;
          user_id: string | null;
          amount: number;
          currency: string;
          donor_name: string;
          comment: string | null;
          is_public: boolean;
          provider: string;
          transaction_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          amount: number;
          currency?: string;
          donor_name?: string;
          comment?: string | null;
          is_public?: boolean;
          provider: string;
          transaction_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          amount?: number;
          currency?: string;
          donor_name?: string;
          comment?: string | null;
          is_public?: boolean;
          provider?: string;
          transaction_id?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "donations_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      monetization_events: {
        Row: {
          id: string;
          event_type: string;
          engine_id: number;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_type: string;
          engine_id: number;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_type?: string;
          engine_id?: number;
          metadata?: Json;
          created_at?: string;
        };
        Relationships: [];
      };
      ai_missions: {
        Row: {
          id: string;
          type: string;
          title: string;
          description: string;
          platform: string;
          status: 'pending' | 'completed' | 'failed';
          metadata: Json;
          created_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          type: string;
          title: string;
          description: string;
          platform: string;
          status?: 'pending' | 'completed' | 'failed';
          metadata?: Json;
          created_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          type?: string;
          title?: string;
          description?: string;
          platform?: string;
          status?: 'pending' | 'completed' | 'failed';
          metadata?: Json;
          created_at?: string;
          completed_at?: string | null;
        };
        Relationships: [];
      };
      partnership_leads: {
        Row: {
          id: string;
          name: string;
          email: string;
          company: string;
          type: string;
          message: string | null;
          source: string | null;
          status: 'new' | 'contacted' | 'closed';
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          company: string;
          type: string;
          message?: string | null;
          source?: string | null;
          status?: 'new' | 'contacted' | 'closed';
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          company?: string;
          type?: string;
          message?: string | null;
          source?: string | null;
          status?: 'new' | 'contacted' | 'closed';
          created_at?: string;
        };
        Relationships: [];
      };
      site_metrics: {
        Row: {
          id: string;
          count: number;
          updated_at: string;
        };
        Insert: {
          id: string;
          count?: number;
          updated_at?: string;
        };
        Update: {
          id?: string;
          count?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      pitch_videos: {
        Row: {
          id: string;
          title: string;
          url: string;
          category: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          url: string;
          category?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          url?: string;
          category?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      client_sites: {
        Row: {
          id: string;
          owner_id: string;
          site_name: string;
          site_url: string;
          plan_type: string;
          setup_status: 'pending_onboarding' | 'in_production' | 'active' | 'suspended';
          niche: string | null;
          beatriz_config: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          site_name: string;
          site_url: string;
          plan_type: string;
          setup_status?: 'pending_onboarding' | 'in_production' | 'active' | 'suspended';
          niche?: string | null;
          beatriz_config?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          site_name?: string;
          site_url?: string;
          plan_type?: string;
          setup_status?: 'pending_onboarding' | 'in_production' | 'active' | 'suspended';
          niche?: string | null;
          beatriz_config?: Json | null;
          created_at?: string;
        };
        Relationships: [];
      };
      affiliate_referrals: {
        Row: {
          id: string;
          referrer_id: string;
          referred_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          referrer_id: string;
          referred_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          referrer_id?: string;
          referred_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_monetization_overview: {
        Args: Record<PropertyKey, never>;
        Returns: {
          total_ads: number;
          total_affiliate: number;
          total_premium: number;
          total_donations: number;
          total_leads: number;
          total_api_calls: number;
          total_revenue: number;
          progress_percentage: number;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
