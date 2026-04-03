"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, ArrowLeft, Tag, CalendarDays, Heart, Bookmark, Share2 } from "lucide-react";
import { NewsItem } from "@/types";
import { formatDate, extractDomain } from "@/lib/utils";
import { toast } from "sonner";
import { Comments } from "@/components/comments";
import { AdBanner } from "@/components/ad-banner";

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
        
        // Trackeamos la vista
        if (data.data?.id) {
          fetch(`/api/news/${data.data.id}/track-view`, { method: "POST" }).catch(() => {});
        }
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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link href="/" className="gap-1 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio
        </Link>
      </Button>

      {loading ? (
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="h-6 bg-muted rounded w-3/4 mb-4" />
            <div className="h-4 bg-muted rounded w-1/2 mb-8" />
            <div className="aspect-video bg-muted rounded-lg w-full mb-6" />
          </CardContent>
        </Card>
      ) : error || !news ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">No se pudo cargar la noticia o no existe.</p>
            <Button asChild className="mt-4" variant="outline">
              <Link href="/">Volver al Inicio</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <article className="space-y-8">
          {/* Media Section (Video or Image) */}
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl ring-1 ring-white/10">
            {news.video_url ? (
              <video 
                src={news.video_url} 
                className="h-full w-full object-contain"
                playsInline
                controls
                poster={news.image_url}
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

          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-neon-blue/10 text-neon-blue border-neon-blue/20 hover:bg-neon-blue/20 transition-colors">
                {news.category}
              </Badge>
              {news.tags?.slice(0, 3).map((t) => (
                <Badge key={t} variant="secondary" className="text-xs bg-muted/50 border-muted-foreground/10">
                  <Tag className="h-3 w-3 mr-1" />
                  {t}
                </Badge>
              ))}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold font-orbitron tracking-tight text-foreground/90">
              {news.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pb-6 border-b">
              <span className="flex items-center gap-1.5">
                <ExternalLink className="h-4 w-4 text-neon-blue/70" />
                {extractDomain(news.source_url)}
              </span>
              <span className="text-muted-foreground/30">•</span>
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" />
                {formatDate(news.published_at)}
              </span>
              <span className="text-muted-foreground/30">•</span>
              <Link 
                href={news.source_url} 
                target="_blank" 
                className="text-neon-blue font-medium hover:text-neon-purple transition-all underline-offset-4 hover:underline"
              >
                Ver fuente original
              </Link>
            </div>
          </div>

          <p className="text-lg leading-relaxed text-muted-foreground font-medium border-l-4 border-neon-blue pl-6 bg-muted/20 py-4 rounded-r-lg">
            {news.summary}
          </p>

          <AdBanner slot="article-top-content" />

          {news.content && (
            <div className="prose prose-invert prose-neon max-w-none prose-headings:font-orbitron prose-a:text-neon-blue">
              <div dangerouslySetInnerHTML={{ __html: news.content }} />
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-8 pb-12 border-t">
            <Button 
              variant="outline" 
              size="lg" 
              onClick={handleLike} 
              className={`gap-2 rounded-full border-muted-foreground/20 transition-all ${isLiked ? "bg-red-500/10 border-red-500/50 text-red-500" : "hover:border-neon-blue"}`}
            >
              <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
              Me gusta
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={handleFavorite} 
              className={`gap-2 rounded-full border-muted-foreground/20 transition-all ${isFavorited ? "bg-yellow-500/10 border-yellow-500/50 text-yellow-500" : "hover:border-neon-purple"}`}
            >
              <Bookmark className={`h-5 w-5 ${isFavorited ? "fill-current" : ""}`} />
              Favorito
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => handleShare("x")}
              className="gap-2 rounded-full border-muted-foreground/20 hover:border-neon-blue transition-all"
            >
              <Share2 className="h-5 w-5" />
              Compartir
            </Button>
          </div>

          {news?.id ? (
            <div className="pt-12 border-t space-y-12">
              <AdBanner slot="article-before-comments" format="rectangle" />
              
              <div>
                <h2 className="text-2xl font-bold font-orbitron mb-8 flex items-center gap-2">
                  Diálogo Neural
                  <span className="h-1.5 w-1.5 rounded-full bg-neon-blue animate-pulse" />
                </h2>
                <Comments kind="news" entityId={news.id} />
              </div>
            </div>
          ) : null}
        </article>
      )}
    </div>
  );
}
