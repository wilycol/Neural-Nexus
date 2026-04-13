import React, { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { getSupabaseBrowserClient } from '@/lib/supabase-client';

interface PitchVideo {
  id: string;
  url: string;
  title: string;
  category?: string | null;
}

const FALLBACK_VIDEOS: PitchVideo[] = [
  {
    id: 'b1',
    url: '/Beatriz/Woman_leaves_bunker_202604102351.mp4',
    title: 'Beatriz: The Origin',
  },
  {
    id: 'b2',
    url: '/Beatriz/Girl_walks_stretches_202604102347.mp4',
    title: 'Beatriz: Neural Integration',
  },
  {
    id: 'b3',
    url: '/Beatriz/Girl_walks_stretches_202604102344.mp4',
    title: 'Beatriz: Core Expansion',
  },
];

export function PitchVideoCarousel() {
  const [videos, setVideos] = useState<PitchVideo[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  useEffect(() => {
    async function fetchVideos() {
      try {
        const supabase = getSupabaseBrowserClient();
        const { data, error: fetchError } = await supabase
          .from('pitch_videos')
          .select('*')
          .order('created_at', { ascending: true });

        if (fetchError) {
          console.warn("[PitchCarousel] Usando fallback por error:", fetchError.message);
          setVideos(FALLBACK_VIDEOS);
        } else if (!data || data.length === 0) {
          console.log("[PitchCarousel] Sin videos en DB, usando fallback.");
          setVideos(FALLBACK_VIDEOS);
        } else {
          setVideos(data);
        }
      } catch (err) {
        console.error("[PitchCarousel] Error catastrófico:", err);
        setVideos(FALLBACK_VIDEOS);
      } finally {
        setLoading(false);
      }
    }

    fetchVideos();
  }, []);

  const nextVideo = () => {
    if (videos.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % videos.length);
  };

  const prevVideo = () => {
    if (videos.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + videos.length) % videos.length);
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto aspect-video rounded-3xl border border-white/5 bg-zinc-900/50 flex flex-col items-center justify-center gap-4">
        <Sparkles className="h-8 w-8 text-neon-blue animate-spin" />
        <p className="text-[10px] font-orbitron tracking-widest text-zinc-500 animate-pulse uppercase">Sincronizando Archivos de Beatriz...</p>
      </div>
    );
  }

  const currentVideo = videos[activeIndex] || FALLBACK_VIDEOS[0];

  return (
    <div className="relative w-full max-w-4xl mx-auto group">
      <Card className="relative overflow-hidden bg-black/40 border-neon-blue/20 backdrop-blur-xl rounded-3xl aspect-video shadow-[0_0_50px_rgba(0,163,255,0.15)] transition-all hover:border-neon-blue/40">
        <video
          ref={videoRef}
          key={currentVideo.url}
          className="w-full h-full object-cover opacity-80"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src={currentVideo.url} type="video/mp4" />
        </video>
        
        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40 pointer-events-none" />

        {/* Info */}
        <div className="absolute bottom-8 left-8 right-8 z-10 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-orbitron text-neon-blue tracking-widest uppercase mb-1">Nexus Vision Series</p>
            <h3 className="text-xl font-orbitron font-bold text-white drop-shadow-md">
              {currentVideo.title}
            </h3>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={prevVideo}
              className="rounded-full border-white/10 bg-black/20 hover:bg-neon-blue/20 hover:border-neon-blue/40"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextVideo}
              className="rounded-full border-white/10 bg-black/20 hover:bg-neon-blue/20 hover:border-neon-blue/40"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Indicators */}
        <div className="absolute top-8 right-8 flex gap-1.5 ring-1 ring-white/10 bg-black/20 p-2 rounded-full backdrop-blur-md">
          {videos.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 transition-all rounded-full",
                i === activeIndex ? "w-6 bg-neon-blue shadow-[0_0_8px_rgba(0,163,255,0.8)]" : "w-1.5 bg-white/20"
              )}
            />
          ))}
        </div>
      </Card>
      
      {/* Decorative Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-neon-blue to-neon-purple rounded-3xl blur opacity-10 group-hover:opacity-20 transition-all pointer-events-none" />
    </div>
  );
}
