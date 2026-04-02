"use client";

import React, { useEffect, useRef, useState } from "react";
import { NewsItem } from "@/types";
import { getSupabaseBrowserClient } from "@/lib/supabase-client";
import { Heart, MessageCircle, Share2, Music2, Disc, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AdBanner } from "@/components/ad-banner";

interface ReelItemProps {
  news: NewsItem;
  isActive: boolean;
}

function ReelItem({ news, isActive }: ReelItemProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isActive && videoRef.current) {
      setIsPaused(false);
      videoRef.current.play().catch(() => {
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play().catch(() => {});
        }
      });
    } else if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isActive]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPaused(false);
    } else {
      videoRef.current.pause();
      setIsPaused(true);
    }
  };

  return (
    <div 
      className="relative h-[calc(100vh-4rem)] w-full bg-black flex items-center justify-center snap-start overflow-hidden border-b border-white/5 reel-container cursor-pointer"
      data-news-id={news.id}
      onClick={togglePlay}
    >
      <video
        ref={videoRef}
        src={news.video_url}
        className="h-full w-full object-contain"
        loop
        playsInline
        muted={!isActive}
        crossOrigin="anonymous"
        preload="auto"
        poster={news.cover_url || news.image_url}
      />
      
      {/* Play Icon Overlay (Solo visible cuando está pausado) */}
      {isPaused && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-20 pointer-events-none animate-in fade-in zoom-in duration-200">
           <div className="bg-white/20 backdrop-blur-sm p-6 rounded-full border border-white/30">
              <Video className="h-12 w-12 text-white fill-white" />
           </div>
        </div>
      )}
      
      {/* Overlay Info */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
      
      {/* Right Side Actions */}
      <div className="absolute right-4 bottom-24 flex flex-col items-center gap-6 z-10 pointer-events-auto">
        <div className="flex flex-col items-center gap-1">
          <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 text-white shadow-lg">
            <Heart className="h-6 w-6" />
          </Button>
          <span className="text-xs font-bold text-white shadow-sm">{news.mention_count || 0}</span>
        </div>
        
        <div className="flex flex-col items-center gap-1">
          <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 text-white shadow-lg">
            <MessageCircle className="h-6 w-6" />
          </Button>
          <span className="text-xs font-bold text-white shadow-sm">...</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 text-white shadow-lg">
            <Share2 className="h-6 w-6" />
          </Button>
          <span className="text-xs font-bold text-white shadow-sm">Share</span>
        </div>

        <div className="mt-4 animate-spin-slow">
          <div className="h-10 w-10 rounded-full border-4 border-white/20 bg-black flex items-center justify-center overflow-hidden">
             <Disc className="h-6 w-6 text-neon-blue" />
          </div>
        </div>
      </div>

      {/* Bottom Info */}
      <div className="absolute bottom-6 left-4 right-16 z-10 pointer-events-auto">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-10 w-10 border border-white/20">
            <AvatarImage src="/brand.png" />
            <AvatarFallback>NN</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-bold text-white text-sm shadow-sm">@neuralnexus</span>
            <span className="text-[10px] text-neon-blue font-bold tracking-widest uppercase">Portal IA Oficial</span>
          </div>
          <Button variant="outline" size="sm" className="h-7 px-3 text-[10px] bg-neon-blue/20 border-neon-blue/40 text-white hover:bg-neon-blue/40">
            Seguir
          </Button>
        </div>
        
        <h3 className="text-white font-medium text-sm mb-2 line-clamp-2 drop-shadow-md">
          {news.title}
        </h3>
        
        <div className="flex items-center gap-2 text-white/80 overflow-hidden group/music">
          <Music2 className="h-3 w-3 animate-pulse" />
          <span className="text-xs whitespace-nowrap animate-marquee">Audio Original • Neural Nexus Synthesis</span>
        </div>
      </div>
    </div>
  );
}

export function ReelsFeed() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchReels = async () => {
      try {
        setLoading(true);
        const supabase = getSupabaseBrowserClient();
        
        const { data, error } = await supabase
          .from("news")
          .select("*")
          .eq("content_type", "video")
          .eq("is_short", true)
          .order("published_at", { ascending: false });
        
        if (error) {
          console.error("[Reels] Error en la consulta Supabase:", error);
          throw error;
        }

        if (data) {
          setNews(data as NewsItem[]);
          if (data.length > 0) setActiveId(data[0].id);
        }
      } catch (err) {
        console.error("[Reels] Fallo crítico al cargar Reels:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReels();
  }, []);

  useEffect(() => {
    const options = {
      root: containerRef.current,
      rootMargin: "-45% 0px -45% 0px", // Zona "láser" en el centro exacto de la pantalla
      threshold: 0, // Se dispara en cuanto cruza la línea central
    };

    const callback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("data-news-id");
          if (id) setActiveId(id);
        }
      });
    };

    const observer = new IntersectionObserver(callback, options);
    
    // Observar todos los contenedores de reel
    const elements = document.querySelectorAll(".reel-container");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [news]);

  return (
    <div 
      ref={containerRef}
      className="h-[calc(100vh-4rem)] w-full overflow-y-scroll snap-y snap-mandatory scrollbar-none bg-black"
    >
      {loading ? (
        <div className="flex flex-col items-center justify-center h-full text-white/40 p-8 text-center space-y-4">
           <div className="h-8 w-8 border-2 border-neon-blue/30 border-t-neon-blue rounded-full animate-spin" />
           <p className="max-w-[200px]">Cargando los últimos Neural Reels...</p>
        </div>
      ) : news.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-white/40 p-8 text-center space-y-4">
           <Video className="h-12 w-12 opacity-20" />
           <p className="max-w-[200px]">No hay reels disponibles en este momento.</p>
        </div>
      ) : (
        news.map((item, index) => (
          <React.Fragment key={item.id}>
            <ReelItem 
              news={item} 
              isActive={item.id === activeId} 
            />
            {/* Insertar anuncio cada 3 reels */}
            {(index + 1) % 3 === 0 && (
              <div className="h-[calc(100vh-4rem)] w-full bg-black flex items-center justify-center snap-start p-4">
                <AdBanner slot={`reel-ad-${index}`} format="vertical" className="h-full border-none bg-zinc-900/50" />
              </div>
            )}
          </React.Fragment>
        ))
      )}
    </div>
  );
}
