/* eslint-disable */
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Sparkles, 
  Clock, 
  ArrowLeft, 
  TrendingUp, 
  Calendar, 
  Heart, 
  MessageCircle, 
  Share2, 
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BlogPost } from "@/types";
import { formatDate } from "@/lib/utils";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Comments } from "@/components/comments";

export default function Top5Page() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopPosts();
  }, []);

  const fetchTopPosts = async () => {
    try {
      const response = await fetch('/api/blog/featured?limit=5');
      if (!response.ok) throw new Error('Error al cargar posts');
      const data = await response.json();
      
      let fetchedPosts = data.data || [];
      
      // 🚀 Inyección de Emergencia: Si no hay posts o falta nuestra promo, la insertamos manualmente
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const hasPromo = fetchedPosts.some((p: BlogPost) => p.title.includes("PROMO") || (p as any).video_url?.includes("promo"));
      
      if (!hasPromo) {
        const promoPost = {
          id: "promo-neural-nexus-final",
          title: "Neural Nexus: El Amanecer de la Colmena (PROMO OFICIAL)",
          excerpt: "Nuestra infraestructura ha evolucionado. Beatriz AI toma el control total de la generación de contenido. Haz clic para conocer nuestra visión técnica.",
          image_url: "/media/promo_nexus_final.mp4",
          video_url: "/media/promo_nexus_final.mp4",
          published_at: new Date().toISOString(),
          author_nickname: "Beatriz Serie X",
          read_time: 1,
          slug: "../../es/pitch",
          tags: ["Federación", "IA", "Futuro"],
          is_promo: true
        };
        fetchedPosts = [promoPost, ...fetchedPosts].slice(0, 5);
      }

      setPosts(fetchedPosts as any);
    } catch {
      // Si falla la API, al menos mostramos la promo
      setPosts([{
          id: "promo-fallback",
          title: "Neural Nexus: El Amanecer de la Colmena (PROMO OFICIAL)",
          excerpt: "Nuestra infraestructura ha evolucionado. Beatriz AI toma el control total de la generación de contenido. Haz clic para conocer nuestra visión técnica.",
          image_url: "/media/promo_nexus_final.mp4",
          video_url: "/media/promo_nexus_final.mp4",
          published_at: new Date().toISOString(),
          author_nickname: "Beatriz Serie X",
          read_time: 1,
          slug: "../../es/pitch",
          is_promo: true
      }] as any);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Back button */}
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link href="/" className="gap-1 text-muted-foreground hover:text-neon-blue">
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio
        </Link>
      </Button>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center shadow-[0_0_15px_rgba(0,163,255,0.3)]">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-orbitron tracking-tight">Top 5 del Día</h1>
            <p className="text-muted-foreground text-sm">
              Las noticias más virales analizadas por IA
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <Badge variant="secondary" className="gap-1 bg-neon-blue/10 text-neon-blue border-neon-blue/20">
            <TrendingUp className="h-3 w-3" />
            Actualizado diariamente
          </Badge>
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDate(new Date())}
          </span>
        </div>
      </div>

      {/* Posts list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="animate-pulse bg-zinc-900/50 border-white/5">
              <CardContent className="p-6">
                <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <Card className="bg-zinc-900/50 border-dashed border-white/10">
          <CardContent className="p-12 text-center">
            <Sparkles className="h-12 w-12 text-neon-blue mx-auto mb-4 opacity-50" />
            <h2 className="text-xl font-semibold mb-2 font-orbitron">
              Sincronizando Top 5...
            </h2>
            <p className="text-muted-foreground">
              Vuelve en unos segundos para la actualización de la Federación
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {posts.map((post, index) => (
            <Top5PostCard key={post.id} post={post} rank={index + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

function Top5PostCard({ post, rank }: { post: BlogPost; rank: number }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.like_count || 0);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    if (liked) {
      setLikes(prev => prev - 1);
      setLiked(false);
    } else {
      setLikes(prev => prev + 1);
      setLiked(true);
    }
  };

  return (
    <Card className="overflow-hidden bg-zinc-900/40 border-white/5 hover:border-neon-blue/30 transition-all group relative">
      <div className="flex flex-col md:flex-row">
        {/* Rank & Video Area (The Reel) */}
        <div className="relative md:w-80 h-64 md:h-auto flex-shrink-0 bg-black overflow-hidden group/video">
          {post.image_url?.endsWith('.mp4') || (post as any).video_url?.endsWith('.mp4') ? (
            <video
              src={post.image_url?.endsWith('.mp4') ? post.image_url : (post as any).video_url}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover transition-transform duration-700 group-hover/video:scale-110"
            />
          ) : post.image_url ? (
            <Image
              src={post.image_url}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-700 group-hover/video:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 flex items-center justify-center">
              <Sparkles className="h-12 w-12 text-neon-blue" />
            </div>
          )}
          
          {/* Rank badge */}
          <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple flex items-center justify-center text-white font-bold text-lg shadow-[0_0_15px_rgba(0,163,255,0.5)] z-20 font-orbitron">
            {rank}
          </div>

          {/* Overlay Actions (Reel Style) */}
          <div className="absolute right-3 bottom-3 flex flex-col gap-3 z-30 opacity-0 group-hover/video:opacity-100 transition-opacity duration-300">
            <Button 
              size="icon" 
              variant="secondary" 
              onClick={handleLike}
              className={`rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:bg-white/20 h-10 w-10 ${liked ? 'text-red-500' : 'text-white'}`}
            >
              <Heart className={`h-5 w-5 ${liked ? 'fill-current' : ''}`} />
            </Button>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  size="icon" 
                  variant="secondary" 
                  className="rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:bg-white/20 h-10 w-10 text-white"
                >
                  <MessageCircle className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-zinc-950 border-white/10 text-white sm:max-w-md p-0">
                <SheetHeader className="p-6 border-b border-white/5">
                  <SheetTitle className="text-neon-blue font-orbitron text-sm tracking-widest uppercase">Comentarios de la Colmena</SheetTitle>
                </SheetHeader>
                <div className="h-full overflow-y-auto p-6">
                  <Comments kind="news" entityId={post.id} />
                </div>
              </SheetContent>
            </Sheet>

            <Button 
              size="icon" 
              variant="secondary" 
              className="rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:bg-white/20 h-10 w-10 text-white"
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/es/top5#${post.id}`);
                alert("Enlace copiado!");
              }}
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 flex flex-col">
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
               <h2 className="text-xl font-bold font-orbitron leading-tight text-white group-hover:text-neon-blue transition-colors">
                {post.title}
              </h2>
            </div>

            <p className="text-sm text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
              {post.excerpt}
            </p>

            <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest text-muted-foreground font-orbitron mb-4">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-neon-blue" />
                {post.read_time} min
              </span>
              <span>•</span>
              <span className="text-neon-purple">@{post.author_nickname}</span>
              <span>•</span>
              <span>{formatDate(post.published_at)}</span>
            </div>

            {/* Interaction Summary (Text) */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-6">
              <span className="flex items-center gap-1">
                <Heart className={`h-3 w-3 ${liked ? 'text-red-500 fill-current' : ''}`} />
                {likes}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="h-3 w-3" />
                {post.comment_count || 0}
              </span>
            </div>
          </div>

          {/* THE CTA - Sales Pitch Redirect */}
          <div className="mt-auto pt-4 border-t border-white/5">
            <Link href={`/blog/${post.slug}`} className="block">
              <Button 
                className="w-full bg-gradient-to-r from-neon-blue to-neon-purple hover:from-neon-blue/80 hover:to-neon-purple/80 text-white font-orbitron font-bold py-6 rounded-xl shadow-[0_0_20px_rgba(0,163,255,0.2)] hover:shadow-[0_0_30px_rgba(0,163,255,0.4)] transition-all group/btn"
              >
                <span className="flex items-center gap-2">
                  { (post as any).is_promo ? "Conocer más." : "Leer noticia completa" }
                  <ChevronRight className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}
