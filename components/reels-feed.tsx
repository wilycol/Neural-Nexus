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

  useEffect(() => {
    if (isActive && videoRef.current) {
      videoRef.current.play().catch(() => {});
    } else if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isActive]);

  return (
    <div className="relative h-[calc(100vh-4rem)] w-full bg-black flex items-center justify-center snap-start overflow-hidden border-b border-white/5">
      <video
        ref={videoRef}
        src={news.video_url}
        className="h-full w-full object-contain"
        loop
        playsInline
        muted={false}
      />
      
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
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchReels = async () => {
      const supabase = getSupabaseBrowserClient();
      const { data } = await supabase
        .from("news")
        .select("*")
        .not("video_url", "is", null)
        .order("published_at", { ascending: false });
      
      if (data) setNews(data as NewsItem[]);
    };
    fetchReels();
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollPos = e.currentTarget.scrollTop;
    const itemHeight = e.currentTarget.offsetHeight;
    const index = Math.round(scrollPos / itemHeight);
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  return (
    <div 
      ref={scrollRef}
      onScroll={handleScroll}
      className="h-[calc(100vh-4rem)] w-full overflow-y-scroll snap-y snap-mandatory scrollbar-none bg-black"
    >
      {news.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-white/40 p-8 text-center space-y-4">
           <Video className="h-12 w-12 opacity-20" />
           <p className="max-w-[200px]">Cargando los últimos Neural Reels...</p>
        </div>
      ) : (
        news.map((item, index) => (
          <React.Fragment key={item.id}>
            <ReelItem news={item} isActive={index === activeIndex} />
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
