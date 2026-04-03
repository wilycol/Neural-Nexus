"use client";

import React, { useEffect, useMemo, useState } from "react";
import { NewsCard } from "@/components/news-card";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { AdBanner } from "@/components/ad-banner";
import { useInfiniteNews } from "@/hooks/use-infinite-news";
import { toast } from "sonner";
import { getSupabaseBrowserClient } from "@/lib/supabase";

interface NewsFeedProps {
  category?: string;
  search?: string;
}

export function NewsFeed({ category, search }: NewsFeedProps) {
  const { news, loading, error, hasMore, loadMore } = useInfiniteNews({
    category,
    search,
    limit: 10,
  });

  const parseMetricsRow = (raw: unknown) => {
    if (!raw || typeof raw !== "object") return null;
    const row = raw as Record<string, unknown>;
    const newsId = typeof row.news_id === "string" ? row.news_id : null;
    if (!newsId) return null;
    const likeCount = typeof row.like_count === "number" ? row.like_count : 0;
    const commentCount = typeof row.comment_count === "number" ? row.comment_count : 0;
    const isLiked = row.is_liked === true;
    const isFavorited = row.is_favorited === true;
    return { newsId, likeCount, commentCount, isLiked, isFavorited };
  };

  const [likedNews, setLikedNews] = useState<Set<string>>(new Set());
  const [favoritedNews, setFavoritedNews] = useState<Set<string>>(new Set());
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});

  const ids = useMemo(() => news.map((n) => n.id), [news]);

  useEffect(() => {
    const run = async () => {
      if (ids.length === 0) return;
      try {
        const supabase = getSupabaseBrowserClient();
        const rpcResult = await (
          supabase as unknown as {
            rpc: (
              fn: string,
              args: Record<string, unknown>
            ) => Promise<{ data: unknown[] | null; error: unknown | null }>;
          }
        ).rpc("get_news_feed_metrics", { p_news_ids: ids });
        if (!rpcResult.error && Array.isArray(rpcResult.data)) {
          const likeMap: Record<string, number> = {};
          const commentMap: Record<string, number> = {};
          const liked = new Set<string>();
          const favorited = new Set<string>();
          (rpcResult.data as unknown[]).forEach((raw) => {
            const row = parseMetricsRow(raw);
            if (!row) return;
            likeMap[row.newsId] = row.likeCount;
            commentMap[row.newsId] = row.commentCount;
            if (row.isLiked) liked.add(row.newsId);
            if (row.isFavorited) favorited.add(row.newsId);
          });
          setLikeCounts(likeMap);
          setCommentCounts(commentMap);
          setLikedNews(liked);
          setFavoritedNews(favorited);
          return;
        }

        const { data } = await supabase.auth.getUser();
        const userId = data.user?.id || null;
        if (userId) {
          const { data: userLikes } = await supabase
            .from("likes")
            .select("news_id")
            .eq("user_id", userId)
            .in("news_id", ids);
          setLikedNews(new Set((userLikes || []).map((l) => l.news_id).filter(Boolean) as string[]));
          const { data: userFavs } = await supabase
            .from("favorites")
            .select("news_id")
            .eq("user_id", userId)
            .in("news_id", ids);
          setFavoritedNews(new Set((userFavs || []).map((f) => f.news_id)));
        } else {
          setLikedNews(new Set());
          setFavoritedNews(new Set());
        }
        const { data: likesAll } = await supabase.from("likes").select("news_id").in("news_id", ids);
        const likeMap: Record<string, number> = {};
        (likesAll || []).forEach((l) => {
          const id = l.news_id as string | null;
          if (!id) return;
          likeMap[id] = (likeMap[id] || 0) + 1;
        });
        setLikeCounts(likeMap);
        const { data: commentsAll } = await supabase
          .from("comments")
          .select("news_id")
          .eq("is_moderated", false)
          .in("news_id", ids);
        const commentMap: Record<string, number> = {};
        (commentsAll || []).forEach((c) => {
          const id = c.news_id as string | null;
          if (!id) return;
          commentMap[id] = (commentMap[id] || 0) + 1;
        });
        setCommentCounts(commentMap);
      } catch {
        setLikedNews(new Set());
        setFavoritedNews(new Set());
        setLikeCounts({});
        setCommentCounts({});
      }
    };
    run();
  }, [ids]);

  const handleLike = async (newsId: string) => {
    try {
      const isLiked = likedNews.has(newsId);
      
      // Optimistic update
      setLikedNews((prev) => {
        const newSet = new Set(prev);
        if (isLiked) {
          newSet.delete(newsId);
        } else {
          newSet.add(newsId);
        }
        return newSet;
      });

      setLikeCounts((prev) => ({
        ...prev,
        [newsId]: (prev[newsId] || 0) + (isLiked ? -1 : 1),
      }));

      // API call
      const response = await fetch(`/api/news/${newsId}/like`, {
        method: isLiked ? 'DELETE' : 'POST',
      });

      if (response.status === 401) {
        setLikedNews((prev) => {
          const newSet = new Set(prev);
          if (isLiked) {
            newSet.add(newsId);
          } else {
            newSet.delete(newsId);
          }
          return newSet;
        });

        setLikeCounts((prev) => ({
          ...prev,
          [newsId]: (prev[newsId] || 0) + (isLiked ? 1 : -1),
        }));

        toast.error("Inicia sesión para dar like");
        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        throw new Error('Error al dar like');
      }

      toast.success(isLiked ? 'Like eliminado' : '¡Te gusta esta noticia!');
    } catch {
      // Revert optimistic update
      toast.error('Error al procesar like');
    }
  };

  const handleFavorite = async (newsId: string) => {
    try {
      const isFavorited = favoritedNews.has(newsId);
      
      // Optimistic update
      setFavoritedNews((prev) => {
        const newSet = new Set(prev);
        if (isFavorited) {
          newSet.delete(newsId);
        } else {
          newSet.add(newsId);
        }
        return newSet;
      });

      // API call
      const response = await fetch(`/api/news/${newsId}/favorite`, {
        method: isFavorited ? 'DELETE' : 'POST',
      });

      if (response.status === 401) {
        setFavoritedNews((prev) => {
          const newSet = new Set(prev);
          if (isFavorited) {
            newSet.add(newsId);
          } else {
            newSet.delete(newsId);
          }
          return newSet;
        });

        toast.error("Inicia sesión para guardar favoritos");
        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        throw new Error('Error al guardar favorito');
      }

      toast.success(isFavorited ? 'Eliminado de favoritos' : 'Guardado en favoritos');
    } catch {
      toast.error('Error al procesar favorito');
    }
  };

  const handleShare = async (newsId: string, platform: string) => {
    try {
      const response = await fetch(`/api/news/${newsId}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform }),
      });

      if (response.status === 401) {
        toast.error("Inicia sesión para registrar tus compartidos");
      }
    } catch (err) {
      console.error('Error al registrar share:', err);
    }
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <InfiniteScroll
      onLoadMore={loadMore}
      hasMore={hasMore}
      loading={loading}
    >
      <div className="grid gap-4">
        {news.map((item, index) => (
          <React.Fragment key={item.id}>
            <NewsCard
              news={item}
              isLiked={likedNews.has(item.id)}
              isFavorited={favoritedNews.has(item.id)}
              likeCount={likeCounts[item.id] || 0}
              commentCount={commentCounts[item.id] || 0}
              onLike={handleLike}
              onFavorite={handleFavorite}
              onShare={handleShare}
            />
            {(index + 1) % 4 === 0 && (
              <AdBanner 
                slot={`feed-slot-${Math.floor(index / 4)}`} 
                className="my-2"
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </InfiniteScroll>
  );
}
