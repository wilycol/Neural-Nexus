import React, { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { getSupabaseBrowserClient } from '@/lib/supabase-client';
import { Badge } from './ui/badge';

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
      <div className="w-full max-w-4xl mx-auto h-[500px] rounded-[40px] border border-white/5 bg-zinc-900/50 flex flex-col items-center justify-center gap-4">
        <Sparkles className="h-10 w-10 text-neon-blue animate-spin" />
        <p className="text-[10px] font-orbitron tracking-[0.4em] text-zinc-500 animate-pulse uppercase">Sincronizando Archivos de Beatriz...</p>
      </div>
    );
  }

  const currentVideo = videos[activeIndex] || FALLBACK_VIDEOS[0];

  return (
    <div className="relative w-full max-w-4xl mx-auto group">
      <Card className="relative overflow-hidden bg-black/60 border-white/5 backdrop-blur-3xl rounded-[40px] h-[600px] shadow-[0_0_80px_rgba(0,0,0,0.5)] transition-all hover:border-neon-blue/20">
        {/* Background Blur Effect for 9:16 videos */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video
            key={`bg-${currentVideo.url}`}
            className="w-full h-full object-cover scale-150 blur-3xl opacity-30"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src={currentVideo.url} type="video/mp4" />
          </video>
        </div>

        {/* Main Video (9:16 centered) */}
        <div className="relative z-10 h-full w-full flex items-center justify-center p-4">
          <video
            ref={videoRef}
            key={currentVideo.url}
            className="h-full rounded-2xl shadow-2xl border border-white/10"
            autoPlay
            muted
            onEnded={nextVideo}
            playsInline
          >
            <source src={currentVideo.url} type="video/mp4" />
          </video>
        </div>
        
        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/20 pointer-events-none z-20" />

        {/* Info & Navigation */}
        <div className="absolute bottom-10 left-10 right-10 z-30 flex items-end justify-between">
          <div className="max-w-[70%]">
            <Badge className="bg-neon-blue/20 text-neon-blue border-neon-blue/30 px-3 py-1 mb-3">NEURAL VISION SERIES</Badge>
            <h3 className="text-3xl font-orbitron font-bold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] italic">
              {currentVideo.title}
            </h3>
            <p className="text-sm text-zinc-400 mt-2 font-light tracking-wide">{currentVideo.category || 'Industrial Media'}</p>
          </div>
          
          <div className="flex gap-3 mb-2">
            <Button
              variant="outline"
              size="icon"
              onClick={prevVideo}
              className="h-12 w-12 rounded-2xl border-white/10 bg-black/40 backdrop-blur-md hover:bg-neon-blue/20 hover:border-neon-blue/40 transition-all"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextVideo}
              className="h-12 w-12 rounded-2xl border-white/10 bg-black/40 backdrop-blur-md hover:bg-neon-blue/20 hover:border-neon-blue/40 transition-all"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Indicators */}
        <div className="absolute top-10 right-10 z-30 flex gap-2 ring-1 ring-white/10 bg-black/40 p-2.5 rounded-2xl backdrop-blur-md">
          {videos.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-2 transition-all rounded-full",
                i === activeIndex ? "w-8 bg-neon-blue shadow-[0_0_12px_rgba(0,163,255,0.8)]" : "w-2 bg-white/20"
              )}
            />
          ))}
        </div>
      </Card>
      
      {/* Decorative Outer Glow */}
      <div className="absolute -inset-2 bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 rounded-[45px] blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none" />
    </div>
  );
}
