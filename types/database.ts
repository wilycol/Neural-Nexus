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
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
