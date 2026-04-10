"use client";

import { useState, useEffect, useCallback } from "react";
import { NewsItem } from "@/types";

interface UseInfiniteNewsOptions {
  category?: string;
  search?: string;
  limit?: number;
}

interface UseInfiniteNewsReturn {
  news: NewsItem[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
  removeNewsItem: (id: string) => void;
}

export function useInfiniteNews(options: UseInfiniteNewsOptions = {}): UseInfiniteNewsReturn {
  const { category, search, limit = 10 } = options;
  
  const [news, setNews] = useState<NewsItem[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchNews = useCallback(async (pageNum: number, append: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: limit.toString(),
      });

      if (category) params.append('category', category);
      if (search) params.append('search', search);

      const response = await fetch(`/api/news?${params}`);
      
      if (!response.ok) {
        throw new Error('Error al cargar noticias');
      }

      const data = await response.json();

      if (append) {
        setNews((prev) => [...prev, ...data.data]);
      } else {
        setNews(data.data);
      }

      setHasMore(data.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [category, search, limit]);

  // Cargar noticias iniciales
  useEffect(() => {
    setPage(1);
    fetchNews(1, false);
  }, [category, search, fetchNews]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchNews(nextPage, true);
    }
  }, [loading, hasMore, page, fetchNews]);

  const removeNewsItem = useCallback((id: string) => {
    setNews((prev) => prev.filter((item) => item.id !== id));
  }, []);

  return {
    news,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
    removeNewsItem,
  };
}
