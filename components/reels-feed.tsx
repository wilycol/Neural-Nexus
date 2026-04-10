"use client";

import React, { useEffect, useRef, useState } from "react";
import { NewsItem } from "@/types";
import { getSupabaseBrowserClient } from "@/lib/supabase-client";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Music2, 
  Disc, 
  Video, 
  Loader2,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AdBanner } from "@/components/ad-banner";
import { useAuth } from "@/hooks/use-auth";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Comments } from "@/components/comments";
import { toast } from "sonner";

interface ReelItemProps {
  news: NewsItem;
  isActive: boolean;
  onDelete?: (id: string) => void;
}

function ReelItem({ news, isActive, onDelete }: ReelItemProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(news.mention_count || 0);
  const [isFollowing, setIsFollowing] = useState(false);
  const { user, role } = useAuth();

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

  const togglePlay = (e: React.MouseEvent) => {
    // Evitar que el click en los botones dispare el toggle de pausa
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('[role="dialog"]') || target.closest('[data-sheet-content]')) return;
    
    if (!videoRef.current) return;
    
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPaused(false);
    } else {
      videoRef.current.pause();
      setIsPaused(true);
    }
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      toast.error("Inicia sesión para dar like");
      return;
    }

    const previousLiked = isLiked;
    const previousCount = likesCount;

    // Optimistic UI
    setIsLiked(!previousLiked);
    setLikesCount(prev => previousLiked ? Math.max(0, prev - 1) : prev + 1);

    try {
      const method = previousLiked ? "DELETE" : "POST";
      const res = await fetch(`/api/news/${news.id}/like`, { method });
      if (!res.ok) throw new Error();
    } catch {
      // Rollback
      setIsLiked(previousLiked);
      setLikesCount(previousCount);
      toast.error("Error al procesar like");
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/news/${news.slug}`;
    const text = `🔥 ${news.title}\n\nVía Neural Nexus - Portal de noticias IA`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: news.title,
          text: text,
          url: url,
        });
      } catch {
        // User cancelled or error
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copiado al portapapeles");
    }
  };

  const handleFollow = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFollowing(!isFollowing);
    if (!isFollowing) {
      toast.success("¡Ahora sigues a @neuralnexus!");
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
      
      {isPaused && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-20 pointer-events-none animate-in fade-in zoom-in duration-200">
           <div className="bg-white/20 backdrop-blur-sm p-6 rounded-full border border-white/30">
              <Video className="h-12 w-12 text-white fill-white" />
           </div>
        </div>
      )}
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
      
      <div className="absolute right-4 bottom-24 flex flex-col items-center gap-6 z-10 pointer-events-auto">
        <div className="flex flex-col items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className={`h-12 w-12 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 text-white shadow-lg transition-all active:scale-125 ${isLiked ? 'text-red-500 fill-red-500' : ''}`}
            onClick={handleLike}
          >
            <Heart className={`h-6 w-6 ${isLiked ? 'fill-current' : ''}`} />
          </Button>
          <span className="text-xs font-bold text-white shadow-sm">{likesCount}</span>
        </div>
        
        <Sheet>
          <SheetTrigger asChild>
            <div className="flex flex-col items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 text-white shadow-lg"
                onClick={(e) => e.stopPropagation()}
              >
                <MessageCircle className="h-6 w-6" />
              </Button>
              <span className="text-xs font-bold text-white shadow-sm">Chat</span>
            </div>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[70vh] rounded-t-[20px] bg-zinc-950/95 border-white/10 p-0 overflow-hidden outline-none" data-sheet-content>
            <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mt-3 mb-1" />
            <SheetHeader className="p-4 border-b border-white/5">
              <SheetTitle className="text-white text-center font-orbitron text-sm uppercase tracking-widest">
                Comentarios
              </SheetTitle>
            </SheetHeader>
            <div className="h-full overflow-y-auto p-4 custom-scrollbar pb-32">
              <Comments kind="news" entityId={news.id} />
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex flex-col items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 text-white shadow-lg"
            onClick={handleShare}
          >
            <Share2 className="h-6 w-6" />
          </Button>
          <span className="text-xs font-bold text-white shadow-sm">Share</span>
        </div>

        {role === 'admin' && (
          <div className="flex flex-col items-center gap-1">
            <Button 
              variant="destructive" 
              size="icon" 
              className="h-12 w-12 rounded-full bg-red-600/80 backdrop-blur-md hover:bg-red-600 text-white shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm("¿Estás seguro de que deseas eliminar este Reel permanentemente?")) {
                  onDelete?.(news.id);
                }
              }}
            >
              <Trash2 className="h-6 w-6" />
            </Button>
            <span className="text-xs font-bold text-white shadow-sm">Borrar</span>
          </div>
        )}

        <div className="mt-4 animate-spin-slow">
          <div className="h-10 w-10 rounded-full border-4 border-white/20 bg-black flex items-center justify-center overflow-hidden">
             <Disc className="h-6 w-6 text-neon-blue" />
          </div>
        </div>
      </div>

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
          <Button 
            variant={isFollowing ? "secondary" : "outline"} 
            size="sm" 
            className={`h-7 px-3 text-[10px] transition-all ${isFollowing ? 'bg-white/20 text-white border-white/40' : 'bg-neon-blue/20 border-neon-blue/40 text-white hover:bg-neon-blue/40'}`}
            onClick={handleFollow}
          >
            {isFollowing ? "Siguiendo" : "Seguir"}
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
  const { user, isLoading: authIsLoading } = useAuth();
  
  // Trackeamos el ID del usuario para saber si ha cambiado de Anónimo a Logueado
  const lastUserId = useRef<string | null | undefined>(undefined);

  const [authTimedOut, setAuthTimedOut] = useState(false);

  useEffect(() => {
    // 1. Puente de Resiliencia: Si Auth tarda más de 1.5s, forzamos la carga
    const authBridgeTimeout = setTimeout(() => {
      if (authIsLoading) {
        console.warn("[Reels] ⚠️ Sincronización de Auth lenta. Saltando barrera.");
        setAuthTimedOut(true);
      }
    }, 1500);

    // 1. Barrera Atómica: Esperamos a Auth, a menos que haya expirado el puente
    if (authIsLoading && !authTimedOut) {
      console.log("[Reels] ⏳ Sincronizando con puente Neural Nexus...");
      return;
    }
    
    clearTimeout(authBridgeTimeout);
    
    // 2. Si el usuario no ha cambiado y ya tenemos datos, no recargamos
    // Esto evita que cambios en activeId (scroll) disparen re-fetches
    if (lastUserId.current === user?.id && news.length > 0) {
      console.log("[Reels] ✅ Datos estables, omitiendo re-sync.");
      return;
    }

    const fetchReels = async () => {
      const timestamp = new Date().toLocaleTimeString();
      const currentUser = user?.email || "Anónimo";
      
      console.log(`[Reels] [${timestamp}]🚀 Sincronización Molecular Iniciada: ${currentUser}`);
      lastUserId.current = user?.id;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
        console.error(`[Reels] [${timestamp}]❌ ERROR: Timeout de Red (10s)`);
        setLoading(false);
      }, 10000);

      try {
        setLoading(true);
        const supabase = getSupabaseBrowserClient();

        console.log(`[Reels] [${timestamp}]📡 Consultando DB industrial...`);
        const { data, error } = await supabase
          .from("news")
          .select("*")
          .eq("content_type", "video")
          .eq("is_short", true)
          .order("published_at", { ascending: false })
          .limit(20)
          .abortSignal(controller.signal);
        
        if (error) {
          console.error(`[Reels] [${timestamp}]😭 DB ERROR:`, error.message);
          throw error;
        }

        if (data && data.length > 0) {
          console.log(`[Reels] [${timestamp}]✨ Recibidos ${data.length} reels.`);
          setNews(data as NewsItem[]);
          // Inicializamos el primer Reel si no hay ninguno activo
          setActiveId(data[0].id);
        } else {
          console.log(`[Reels] [${timestamp}]ℹ️ No se encontraron reels.`);
          setNews([]);
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') {
          console.error(`[Reels] [${timestamp}]🛑 Petición cancelada.`);
        } else {
          console.error(`[Reels] [${timestamp}]💥 Error crítico de sincronización:`, err);
        }
      } finally {
        clearTimeout(timeoutId);
        setLoading(false);
        console.log(`[Reels] [${timestamp}]🏁 Sincronización Finalizada.`);
      }
    };

    fetchReels();
    // NOTA: Eliminamos news.length y activeId de las dependencias para evitar bucles.
    // Solo dependemos del estado de Auth, el ID del usuario y el timeout del puente.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authIsLoading, user?.id, authTimedOut]);

  useEffect(() => {
    if (news.length === 0) return;

    const options = {
      root: containerRef.current,
      rootMargin: "-45% 0px -45% 0px",
      threshold: 0,
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
    const elements = document.querySelectorAll(".reel-container");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [news]);

  const handleDelete = async (newsId: string) => {
    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.from('news').delete().eq('id', newsId);
      if (error) throw error;
      setNews(prev => prev.filter(item => item.id !== newsId));
      toast.success("Reel eliminado correctamente");
    } catch (err) {
      console.error("Error al borrar reel:", err);
      toast.error("No se pudo eliminar el reel");
    }
  };

  return (
    <div 
      ref={containerRef}
      className="h-[calc(100vh-4rem)] w-full overflow-y-scroll snap-y snap-mandatory scrollbar-none bg-black"
    >
      {loading ? (
        <div className="flex flex-col items-center justify-center h-full text-white/60 p-8 text-center space-y-4">
           <div className="flex items-center gap-2">
             <Loader2 className="h-6 w-6 text-neon-blue animate-spin" />
             <span className="font-orbitron tracking-widest text-sm uppercase">Sincronizando...</span>
           </div>
           <p className="text-xs text-white/40">Conectando con la red Neural Nexus</p>
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
              onDelete={handleDelete}
            />
            {(index + 1) % 3 === 0 && (
              <div className="h-[calc(100vh-4rem)] w-full bg-zinc-950 flex items-center justify-center snap-start p-4">
                <AdBanner slot={`reel-ad-${index}`} format="vertical" className="h-full border-none bg-zinc-900/10" />
              </div>
            )}
          </React.Fragment>
        ))
      )}
    </div>
  );
}
