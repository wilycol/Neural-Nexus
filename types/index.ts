// Tipos de usuario
export interface User {
  id: string;
  email: string;
  nickname: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  is_premium: boolean;
  share_count: number;
  role: 'user' | 'admin' | 'moderator';
}

export interface UserProfile {
  id: string;
  nickname: string;
  avatar_url?: string;
  bio?: string;
  share_count: number;
  comment_count: number;
  favorite_count: number;
  joined_at: string;
}

// Tipos de noticias
export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content?: string;
  image_url?: string;
  video_url?: string;
  source_name: string;
  source_url: string;
  source_icon?: string;
  published_at: string;
  created_at: string;
  category: NewsCategory;
  tags: string[];
  relevance_score: number;
  mention_count: number;
  is_top_story: boolean;
  ai_generated: boolean;
  slug: string;
}

export type NewsCategory = 
  | 'Inteligencia Artificial' 
  | 'Software' 
  | 'Hardware' 
  | 'Robótica' 
  | 'Historia Tech' 
  | 'Futuro y Tendencias' 
  | 'Startups Tech' 
  | 'IA en la Vida Real' 
  | 'Seguridad y Ética' 
  | 'Gadgets' 
  | 'Datos Curiosos Tech' 
  | 'Rankings';

// Tipos de blog posts (Top 5)
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image_url?: string;
  video_url?: string;
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
}

// Tipos de interacciones sociales
export interface Like {
  id: string;
  user_id: string;
  news_id?: string;
  blog_post_id?: string;
  created_at: string;
}

export interface Comment {
  id: string;
  user_id: string;
  user_nickname: string;
  user_avatar?: string;
  news_id?: string;
  blog_post_id?: string;
  content: string;
  created_at: string;
  updated_at: string;
  parent_id?: string;
  is_moderated: boolean;
  toxicity_score?: number;
  replies?: Comment[];
}

export interface Favorite {
  id: string;
  user_id: string;
  news_id: string;
  created_at: string;
}

export interface Share {
  id: string;
  user_id: string;
  news_id?: string;
  blog_post_id?: string;
  platform: SharePlatform;
  created_at: string;
}

export type SharePlatform = 'copy' | 'x' | 'whatsapp' | 'telegram' | 'facebook' | 'linkedin';

// Tipos de fuentes RSS
export interface NewsSource {
  id: string;
  name: string;
  url: string;
  rss_url: string;
  icon_url?: string;
  category: string;
  is_active: boolean;
  last_fetch_at?: string;
  fetch_count: number;
  priority: number;
}

// Tipos de API
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Tipos de crawler
export interface CrawlerResult {
  source: string;
  items: RawNewsItem[];
  success: boolean;
  error?: string;
  fetch_time: number;
}

export interface RawNewsItem {
  title: string;
  link: string;
  pubDate: string;
  content?: string;
  contentSnippet?: string;
  categories?: string[];
  creator?: string;
  isoDate?: string;
}

// Tipos de IA
export interface AIProcessedNews {
  title: string;
  summary: string;
  category: NewsCategory;
  tags: string[];
  relevance_score: number;
  should_publish: boolean;
  reason?: string;
}

export interface AIGeneratedPost {
  title: string;
  excerpt: string;
  content: string;
  read_time: number;
  tags: string[];
  related_news_ids: string[];
}

// Tipos de búsqueda
export interface SearchFilters {
  category?: NewsCategory;
  dateFrom?: string;
  dateTo?: string;
  source?: string;
  tags?: string[];
}

// Tipos de notificaciones
export interface Notification {
  id: string;
  user_id: string;
  type: 'like' | 'comment' | 'reply' | 'mention' | 'featured';
  title: string;
  message: string;
  link?: string;
  is_read: boolean;
  created_at: string;
}

// Tipos de suscripción premium
export interface Subscription {
  id: string;
  user_id: string;
  status: 'active' | 'cancelled' | 'expired';
  plan: 'monthly' | 'yearly';
  started_at: string;
  expires_at: string;
  payment_method?: string;
}
