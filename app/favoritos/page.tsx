"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Heart, ArrowLeft, Newspaper } from "lucide-react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { toast } from "sonner";
import { NewsCard } from "@/components/news-card";
import type { NewsItem } from "@/types";
import type { Database } from "@/types/database";

export default function FavoritesPage() {
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [nickname, setNickname] = useState<string>("usuario");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [favoritedNews, setFavoritedNews] = useState<Set<string>>(new Set());

  const sidebarUser = useMemo(
    () =>
      userId
        ? {
            nickname,
            avatar_url: avatarUrl || undefined,
            is_premium: isPremium,
          }
        : null,
    [avatarUrl, isPremium, nickname, userId]
  );

  useEffect(() => {
    const load = async () => {
      try {
        const supabase = getSupabaseBrowserClient();
        const { data } = await supabase.auth.getUser();
        const authUser = data.user;

        if (!authUser) {
          setUserId(null);
          return;
        }

        setUserId(authUser.id);

        const { data: profile } = await supabase
          .from("users")
          .select("nickname, avatar_url, is_premium")
          .eq("id", authUser.id)
          .maybeSingle();

        setNickname(profile?.nickname || authUser.user_metadata?.nickname || authUser.email?.split("@")[0] || "usuario");
        setAvatarUrl(profile?.avatar_url || authUser.user_metadata?.avatar_url || null);
        setIsPremium(Boolean(profile?.is_premium));

        const { data: favorites, error: favoritesError } = await supabase
          .from("favorites")
          .select("news_id, created_at")
          .eq("user_id", authUser.id)
          .order("created_at", { ascending: false });

        if (favoritesError) {
          throw favoritesError;
        }

        const ids = (favorites || []).map(
          (f: Pick<Database["public"]["Tables"]["favorites"]["Row"], "news_id">) => f.news_id
        );
        setFavoritedNews(new Set(ids));

        if (ids.length === 0) {
          setNews([]);
          return;
        }

        const { data: newsRows, error: newsError } = await supabase
          .from("news")
          .select("*")
          .in("id", ids);

        if (newsError) {
          throw newsError;
        }

        const byId = new Map(
          (newsRows || []).map((n: Pick<Database["public"]["Tables"]["news"]["Row"], "id"> & Record<string, unknown>) => [
            n.id,
            n as unknown as NewsItem,
          ])
        );
        const ordered = ids
          .map((id: string) => byId.get(id))
          .filter(Boolean) as NewsItem[];
        setNews(ordered);
      } catch {
        toast.error("No se pudieron cargar tus favoritos");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleLogout = async () => {
    try {
      const supabase = getSupabaseBrowserClient();
      await supabase.auth.signOut();
      toast.success("Sesión cerrada");
      window.location.href = "/";
    } catch {
      toast.error("No se pudo cerrar la sesión");
    }
  };

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

      if (!response.ok) {
        throw new Error("Error");
      }

      toast.success("Eliminado de favoritos");
    } catch {
      toast.error("Error al eliminar favorito");
      setFavoritedNews((prev) => new Set(prev).add(newsId));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar isLoggedIn={Boolean(userId)} user={sidebarUser} onLogout={handleLogout} />

      <main className="md:ml-64 pt-16">
        <div className="container mx-auto px-4 py-6 max-w-5xl">
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
          ) : !userId ? (
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
      </main>
    </div>
  );
}
