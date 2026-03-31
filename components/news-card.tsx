"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, MessageCircle, Share2, Star, ExternalLink } from "lucide-react";
import { NewsItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatRelativeTime, extractDomain } from "@/lib/utils";
import { toast } from "sonner";
import { Comments } from "@/components/comments";

interface NewsCardProps {
  news: NewsItem;
  isLiked?: boolean;
  isFavorited?: boolean;
  likeCount?: number;
  commentCount?: number;
  onLike?: (newsId: string) => void;
  onFavorite?: (newsId: string) => void;
  onShare?: (newsId: string, platform: string) => void;
}

export function NewsCard({
  news,
  isLiked = false,
  isFavorited = false,
  likeCount = 0,
  commentCount = 0,
  onLike,
  onFavorite,
  onShare,
}: NewsCardProps) {
  const [showComments, setShowComments] = useState(false);

  const handleShare = async (platform: string) => {
    const url = `${window.location.origin}/news/${news.slug}`;
    const text = `🔥 ${news.title}\n\nVía Neural Nexus - Portal de noticias IA`;

    switch (platform) {
      case 'copy':
        await navigator.clipboard.writeText(url);
        toast.success("Link copiado al portapapeles");
        break;
      case 'x':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + '\n' + url)}`, '_blank');
        break;
      case 'telegram':
        window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
    }

    onShare?.(news.id, platform);
  };

  const categoryColors: Record<string, string> = {
    'Inteligencia Artificial': "bg-blue-500/10 text-blue-500 border-blue-500/20",
    'Software': "bg-green-500/10 text-green-500 border-green-500/20",
    'Hardware': "bg-orange-500/10 text-orange-500 border-orange-500/20",
    'Robótica': "bg-purple-500/10 text-purple-500 border-purple-500/20",
    'Historia Tech': "bg-amber-500/10 text-amber-500 border-amber-500/20",
    'Futuro y Tendencias': "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
    'Startups Tech': "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    'IA en la Vida Real': "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
    'Seguridad y Ética': "bg-red-500/10 text-red-500 border-red-500/20",
    'Gadgets': "bg-pink-500/10 text-pink-500 border-pink-500/20",
    'Datos Curiosos Tech': "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    'Rankings': "bg-violet-500/10 text-violet-500 border-violet-500/20",
    'general': "bg-gray-500/10 text-gray-500 border-gray-500/20",
  };

  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    if (!videoRef.current || !news.video_url) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting && videoRef.current) {
            videoRef.current.pause();
          }
        });
      },
      { threshold: 0.2 } // Pausa cuando menos del 20% es visible
    );

    observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, [news.video_url]);

  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-all duration-300 ${isFavorited ? 'border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.1)]' : ''}`}>
      {/* Media (Video or Image) */}
      <div className="relative aspect-video overflow-hidden group/media">
        {news.content_type === 'video' && news.video_url ? (
          <div className="relative h-full w-full bg-black flex items-center justify-center">
            <video 
              ref={videoRef}
              src={news.video_url} 
              className="h-full w-full object-contain"
              playsInline
              controls
              poster={news.cover_url || news.image_url}
              crossOrigin="anonymous"
            />
            {!(news.cover_url || news.image_url) && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover/media:bg-black/20 transition-all pointer-events-none">
                <div className="h-12 w-12 rounded-full bg-neon-blue/80 flex items-center justify-center text-white shadow-lg shadow-neon-blue/20">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 ml-1">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        ) : (news.cover_url || news.image_url) && (
          <Image
            src={news.cover_url || news.image_url || ''}
            alt={news.title}
            fill
            className="object-cover transition-transform hover:scale-105"
          />
        )}
        <div className="absolute top-2 left-2 z-10">
          <Badge
            variant="outline"
            className={`${categoryColors[news.category] || categoryColors.general} text-[10px] font-bold uppercase tracking-wider bg-background/80 backdrop-blur-sm shadow-sm`}
          >
            {news.content_type === 'video' && <span className="mr-1.5 inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
            {news.category}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-3">
        <Link
          href={`/news/${news.slug}`}
          className="group"
        >
          <h3 className="text-lg font-semibold leading-tight group-hover:text-neon-blue transition-colors line-clamp-2">
            {news.title}
          </h3>
        </Link>
      </CardHeader>

      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {news.summary}
        </p>

        {/* Source & Date */}
        <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <ExternalLink className="h-3 w-3" />
            {extractDomain(news.source_url)}
          </span>
          <span>•</span>
          <span>{formatRelativeTime(news.published_at)}</span>
        </div>

        {/* Tags */}
        {news.tags && news.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {news.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-[10px] uppercase">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0 flex items-center justify-between">
        {/* Social actions */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className={`gap-1.5 ${isLiked ? 'text-red-500' : ''}`}
            onClick={() => onLike?.(news.id)}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-xs">{likeCount}</span>
          </Button>

          <Dialog open={showComments} onOpenChange={setShowComments}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1.5">
                <MessageCircle className="h-4 w-4" />
                <span className="text-xs">{commentCount}</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Comentarios</DialogTitle>
              </DialogHeader>
              <div className="py-2">
                <Comments kind="news" entityId={news.id} />
              </div>
            </DialogContent>
          </Dialog>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1.5">
                <Share2 className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleShare('copy')}>
                Copiar link
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleShare('x')}>
                Compartir en X
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleShare('whatsapp')}>
                WhatsApp
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleShare('telegram')}>
                Telegram
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleShare('facebook')}>
                Facebook
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Favorite */}
        <Button
          variant="ghost"
          size="sm"
          className={`${isFavorited ? 'text-yellow-500 scale-110 active:scale-125' : 'hover:text-yellow-500/70'} transition-all`}
          onClick={() => onFavorite?.(news.id)}
        >
          <Star className={`h-4 w-4 ${isFavorited ? 'fill-current drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]' : ''}`} />
        </Button>
      </CardFooter>
    </Card>
);
}
