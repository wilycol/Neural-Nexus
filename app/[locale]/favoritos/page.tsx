"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, ArrowLeft, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getSupabaseBrowserClient } from "@/lib/supabase-client";
import { toast } from "sonner";
import { NewsCard } from "@/components/news-card";
import type { NewsItem } from "@/types";
import { useAuth } from "@/hooks/use-auth";

export default function FavoritesPage() {
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [favoritedNews, setFavoritedNews] = useState<Set<string>>(new Set());
  const { user } = useAuth();

  useEffect(() => {
    const load = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const supabase = getSupabaseBrowserClient();
        if (!supabase) return;
        
        const { data: favorites, error: favoritesError } = await supabase
          .from("favorites")
          .select("news_id, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (favoritesError) throw favoritesError;

        const ids = (favorites || []).map(f => f.news_id);
        setFavoritedNews(new Set(ids));

        if (ids.length === 0) {
          setNews([]);
          return;
        }

        const { data: newsRows, error: newsError } = await supabase
          .from("news")
          .select("*")
          .in("id", ids);

        if (newsError) throw newsError;

        const byId = new Map(
          (newsRows || []).map(n => [n.id, n as unknown as NewsItem])
        );
        const ordered = ids
          .map(id => byId.get(id))
          .filter(Boolean) as NewsItem[];
        setNews(ordered);
      } catch (err: unknown) {
        console.error("[Favoritos] Error:", err);
        toast.error("No se pudieron cargar tus favoritos");
      } finally {
        setLoading(false);
      }
    };

    if (user || !loading) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleFavorite = async (newsId: string) => {
    const wasFavorited = favoritedNews.has(newsId);
    if (!wasFavorited) return;

    setFavoritedNews((prev) => {
      const next = new Set(prev);
      next.delete(newsId);
      return next;
    });
    setNews((prev) => prev.filter((n) => n.id !== newsId));

    try {
      const response = await fetch(`/api/news/${newsId}/favorite`, {
        method: "DELETE",
      });

      if (response.status === 401) {
        toast.error("Inicia sesión para gestionar tus favoritos");
        window.location.href = "/login";
        return;
      }

      if (!response.ok) throw new Error("Error");
      toast.success("Eliminado de favoritos");
    } catch {
      toast.error("Error al eliminar favorito");
      setFavoritedNews((prev) => new Set(prev).add(newsId));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Back button */}
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link href="/" className="gap-1">
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio
        </Link>
      </Button>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-orbitron">Mis Favoritos</h1>
            <p className="text-muted-foreground">
              Las noticias que has guardado para leer después
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">Cargando favoritos...</p>
          </CardContent>
        </Card>
      ) : !user ? (
        <Card>
          <CardContent className="p-12 text-center">
            <h2 className="text-xl font-semibold mb-2">Inicia sesión</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Necesitas una cuenta para ver tus favoritos.
            </p>
            <Button asChild className="bg-gradient-to-r from-neon-blue to-neon-purple text-white">
              <Link href="/login">Entrar</Link>
            </Button>
          </CardContent>
        </Card>
      ) : news.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No tienes favoritos aún</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Cuando encuentres noticias interesantes, guárdalas aquí haciendo clic en el ícono de favorito.
            </p>
            <Button asChild className="bg-gradient-to-r from-neon-blue to-neon-purple text-white">
              <Link href="/" className="gap-2">
                <Newspaper className="h-4 w-4" />
                Explorar noticias
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {news.map((item) => (
            <NewsCard
              key={item.id}
              news={item}
              isFavorited={favoritedNews.has(item.id)}
              isLiked={false}
              likeCount={0}
              commentCount={0}
              onFavorite={handleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}
