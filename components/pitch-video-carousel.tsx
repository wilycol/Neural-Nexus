import React from 'react';
import { Card } from './ui/card';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

const BEATRIZ_VIDEOS = [
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
  const [activeIndex, setActiveIndex] = React.useState(0);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const nextVideo = () => {
    setActiveIndex((prev) => (prev + 1) % BEATRIZ_VIDEOS.length);
  };

  const prevVideo = () => {
    setActiveIndex((prev) => (prev - 1 + BEATRIZ_VIDEOS.length) % BEATRIZ_VIDEOS.length);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto group">
      <Card className="relative overflow-hidden bg-black/40 border-neon-blue/20 backdrop-blur-xl rounded-3xl aspect-video shadow-[0_0_50px_rgba(0,163,255,0.15)] transition-all hover:border-neon-blue/40">
        <video
          ref={videoRef}
          key={BEATRIZ_VIDEOS[activeIndex].url}
          className="w-full h-full object-cover opacity-80"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src={BEATRIZ_VIDEOS[activeIndex].url} type="video/mp4" />
        </video>
        
        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40 pointer-events-none" />

        {/* Info */}
        <div className="absolute bottom-8 left-8 right-8 z-10 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-orbitron text-neon-blue tracking-widest uppercase mb-1">Nexus Vision Series</p>
            <h3 className="text-xl font-orbitron font-bold text-white drop-shadow-md">
              {BEATRIZ_VIDEOS[activeIndex].title}
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
          {BEATRIZ_VIDEOS.map((_, i) => (
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
