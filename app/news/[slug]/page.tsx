"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, ArrowLeft, Tag, CalendarDays, Heart, Bookmark, Share2 } from "lucide-react";
import { NewsItem } from "@/types";
import { formatDate, extractDomain } from "@/lib/utils";
import { toast } from "sonner";
import { Comments } from "@/components/comments";

export default function NewsDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(`/api/news/by-slug/${slug}`);
        if (!res.ok) throw new Error("No encontrado");
        const data = await res.json();
        setNews(data.data);
      } catch {
        setError("No se pudo cargar la noticia");
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [slug]);

  const handleLike = async () => {
    if (!news) return;
    try {
      setIsLiked((prev) => !prev);
      const method = isLiked ? "DELETE" : "POST";
      const res = await fetch(`/api/news/${news.id}/like`, { method });
      if (res.status === 401) {
        toast.error("Inicia sesión para dar like");
        setIsLiked((prev) => !prev);
        window.location.href = "/login";
        return;
      }
      if (!res.ok) throw new Error("Error");
      toast.success(isLiked ? "Like eliminado" : "¡Te gusta esta noticia!");
    } catch {
      toast.error("Error al procesar like");
      setIsLiked((prev) => !prev);
    }
  };

  const handleFavorite = async () => {
    if (!news) return;
    try {
      setIsFavorited((prev) => !prev);
      const method = isFavorited ? "DELETE" : "POST";
      const res = await fetch(`/api/news/${news.id}/favorite`, { method });
      if (res.status === 401) {
        toast.error("Inicia sesión para guardar favoritos");
        setIsFavorited((prev) => !prev);
        window.location.href = "/login";
        return;
      }
      if (!res.ok) throw new Error("Error");
      toast.success(isFavorited ? "Eliminado de favoritos" : "Guardado en favoritos");
    } catch {
      toast.error("Error al procesar favorito");
      setIsFavorited((prev) => !prev);
    }
  };

  const handleShare = async (platform: string) => {
    if (!news) return;
    try {
      const res = await fetch(`/api/news/${news.id}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform }),
      });
      if (res.status === 401) {
        toast.error("Inicia sesión para registrar tus compartidos");
      }
    } catch {}
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      <main className="md:ml-64 pt-16">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              Volver al inicio
            </Link>
          </Button>

          {loading ? (
            <Card className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </CardContent>
            </Card>
          ) : error || !news ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">No se pudo cargar la noticia</p>
              </CardContent>
            </Card>
          ) : (
            <article className="space-y-6">
              {/* Media Section (Video or Image) */}
              <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black shadow-2xl">
                {news.video_url ? (
                  <video 
                    src={news.video_url} 
                    className="h-full w-full object-contain"
                    playsInline
                    controls
                    poster={news.image_url}
                    crossOrigin="anonymous"
                  />
                ) : news.image_url && (
                  <Image 
                    src={news.image_url} 
                    alt={news.title} 
                    fill 
                    className="object-cover" 
                    priority
                  />
                )}
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="outline">{news.category}</Badge>
                {news.tags?.slice(0, 3).map((t) => (
                  <Badge key={t} variant="secondary" className="text-xs">
                    <Tag className="h-3 w-3 mr-1" />
                    {t}
                  </Badge>
                ))}
              </div>

              <h1 className="text-3xl font-bold">{news.title}</h1>

              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <ExternalLink className="h-4 w-4" />
                  {extractDomain(news.source_url)}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <CalendarDays className="h-4 w-4" />
                  {formatDate(news.published_at)}
                </span>
                <span>•</span>
                <Link href={news.source_url} target="_blank" className="text-neon-blue hover:underline">
                  Ver fuente
                </Link>
              </div>

              <p className="text-lg text-muted-foreground">{news.summary}</p>

              {news.content && (
                <div className="prose prose-invert max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: news.content }} />
                </div>
              )}

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleLike} className={isLiked ? "text-red-500" : ""}>
                  <Heart className="h-4 w-4 mr-1" />
                  Me gusta
                </Button>
                <Button variant="outline" size="sm" onClick={handleFavorite} className={isFavorited ? "text-yellow-500" : ""}>
                  <Bookmark className="h-4 w-4 mr-1" />
                  Favorito
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleShare("x")}>
                  <Share2 className="h-4 w-4 mr-1" />
                  Compartir en X
                </Button>
              </div>

              {news?.id ? <Comments kind="news" entityId={news.id} /> : null}
            </article>
          )}
        </div>
      </main>
    </div>
  );
}
