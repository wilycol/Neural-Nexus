"use client";

import React, { useEffect, useMemo, useState } from "react";
import { NewsFeed } from "@/components/news-feed";
import { Top5Section } from "@/components/top5-section";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Flame, Newspaper, Users, BarChart, Zap } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { toast } from "sonner";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <section className="mb-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-neon-blue/10 via-neon-purple/10 to-neon-blue/10 border border-neon-blue/20 p-6 md:p-8">
          <HeroTop5Background />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold font-orbitron mb-2">
                <span className="gradient-text">Neural Nexus</span>
              </h1>
              <p className="text-muted-foreground max-w-lg">
                Portal inteligente de contenido automatizado enfocado en IA, robótica y tecnología emergente.
              </p>
            </div>
            <Button
              className="bg-gradient-to-r from-neon-blue to-neon-purple text-white hover:opacity-90"
              asChild
            >
              <Link href="/top5">
                <Sparkles className="h-4 w-4 mr-2" />
                Ver Top 5
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <Top5Section />
      </section>

      <section className="mb-12">
        <GrowthStats />
      </section>

      <section>
        <Tabs defaultValue="todas" className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="todas" className="gap-1.5">
                <Newspaper className="h-4 w-4" />
                Todas
              </TabsTrigger>
              <TabsTrigger value="virales" className="gap-1.5">
                <Flame className="h-4 w-4" />
                Virales
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="todas" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Newspaper className="h-5 w-5 text-neon-blue" />
                  Últimas Noticias
                </h2>
                <NewsFeed />
              </div>

              <div className="hidden lg:block space-y-6">
                <TrendingTags />
                <NewsletterCard />
                <AboutCard />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="virales" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-500" />
                  Noticias Virales
                </h2>
                <NewsFeed />
              </div>
              <div className="hidden lg:block">
                <TrendingTags />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}

type HeroNewsItem = {
  id: string;
  title: string;
  image_url: string | null;
  published_at: string;
  relevance_score: number | null;
  mention_count: number | null;
  is_top_story: boolean | null;
};

function HeroTop5Background() {
  const [items, setItems] = useState<HeroNewsItem[]>([]);
  const [index, setIndex] = useState(0);
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/news?top=true&limit=30");
        const json = await res.json().catch(() => null);
        const raw = (json?.data || []) as HeroNewsItem[];
        const ranked = raw
          .filter((n) => Boolean(n?.id))
          .sort((a, b) => {
            const aScore = a.relevance_score ?? 0;
            const bScore = b.relevance_score ?? 0;
            if (bScore !== aScore) return bScore - aScore;

            const aMentions = a.mention_count ?? 0;
            const bMentions = b.mention_count ?? 0;
            if (bMentions !== aMentions) return bMentions - aMentions;

            const aDate = new Date(a.published_at).getTime() || 0;
            const bDate = new Date(b.published_at).getTime() || 0;
            return bDate - aDate;
          })
          .slice(0, 5);
        setItems(ranked);
      } catch {
        setItems([]);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;
    if (items.length < 2) return;
    const intervalId = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, 5000);
    return () => window.clearInterval(intervalId);
  }, [items.length, prefersReducedMotion]);

  if (items.length === 0) return null;

  const safeIndex = Math.min(index, items.length - 1);
  const current = items[safeIndex];

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="h-full w-full flex transition-transform duration-1000 ease-out"
          style={{ transform: `translateX(-${safeIndex * 100}%)` }}
        >
          {items.map((n) => (
            <div key={n.id} className="h-full w-full flex-none">
              <div
                className="h-full w-full bg-center bg-cover opacity-40"
                style={{
                  backgroundImage: n.image_url ? `url(${n.image_url})` : undefined,
                }}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-background/70 to-background/85" />
      {current?.title ? (
        <div className="absolute bottom-3 right-4 max-w-[70%] text-right text-xs text-muted-foreground">
          Top 5: {current.title}
        </div>
      ) : null}
    </div>
  );
}

function GrowthStats() {
  const [stats, setStats] = useState<{ total_views: number; total_users: number; total_news: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("/api/stats/site")
      .then((res) => res.json())
      .then((json) => {
        if (json.data) setStats(json.data);
      })
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-muted/20 border border-muted-foreground/10 rounded-xl"></div>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-card/30 backdrop-blur-sm border border-neon-blue/20 rounded-xl p-6 flex items-center gap-4 hover:border-neon-blue/60 transition-all group relative overflow-hidden">
        <div className="absolute top-0 right-0 p-2 opacity-10">
          <BarChart className="h-16 w-16" />
        </div>
        <div className="p-3 rounded-lg bg-neon-blue/10 text-neon-blue shadow-[0_0_15px_rgba(0,163,255,0.3)]">
          <BarChart className="h-6 w-6" />
        </div>
        <div className="relative z-10">
          <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-orbitron mb-1">Vistas Totales</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold font-orbitron text-neon-blue drop-shadow-[0_0_8px_rgba(0,163,255,0.5)]">
              {stats.total_views.toLocaleString()}
            </h3>
            <span className="text-[10px] text-green-500 animate-[pulse_1s_infinite] font-mono tracking-tighter shadow-green-500/50">LIVE</span>
          </div>
        </div>
      </div>

      <div className="bg-card/30 backdrop-blur-sm border border-green-500/20 rounded-xl p-6 flex items-center gap-4 hover:border-green-500/60 transition-all group relative overflow-hidden">
        <div className="absolute top-0 right-0 p-2 opacity-10">
          <Users className="h-16 w-16" />
        </div>
        <div className="p-3 rounded-lg bg-green-500/10 text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
          <Users className="h-6 w-6" />
        </div>
        <div className="relative z-10">
          <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-orbitron mb-1">Comunidad Neural</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold font-orbitron text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]">
              {stats.total_users.toLocaleString()}
            </h3>
            <span className="text-[10px] text-neon-blue animate-pulse font-mono tracking-tighter">Nexus+</span>
          </div>
        </div>
      </div>

      <div className="bg-card/30 backdrop-blur-sm border border-neon-purple/20 rounded-xl p-6 flex items-center gap-4 hover:border-neon-purple/60 transition-all group relative overflow-hidden">
        <div className="absolute top-0 right-0 p-2 opacity-10">
          <Zap className="h-16 w-16" />
        </div>
        <div className="p-3 rounded-lg bg-neon-purple/10 text-neon-purple shadow-[0_0_15px_rgba(168,85,247,0.3)]">
          <Zap className="h-6 w-6" />
        </div>
        <div className="relative z-10">
          <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-orbitron mb-1">Nexus News</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold font-orbitron text-neon-purple drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]">
              {stats.total_news.toLocaleString()}
            </h3>
            <span className="text-[10px] text-neon-purple animate-pulse font-mono">IA</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function TrendingTags() {
  const [tags, setTags] = useState<{ name: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/stats/trending-tags");
        const json = await res.json();
        if (json.data) setTags(json.data);
      } catch (err) {
        console.error("Error fetching trending:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTags();
  }, []);

  return (
    <div className="rounded-lg border border-neon-blue/10 bg-card/20 backdrop-blur-sm p-4 overflow-hidden relative">
      <div className="absolute top-0 right-0 p-3 opacity-10">
        <Sparkles className="h-10 w-10 text-neon-blue" />
      </div>
      <h3 className="text-sm font-semibold mb-4 flex items-center gap-2 uppercase tracking-widest font-orbitron">
        <Flame className="h-4 w-4 text-orange-500" />
        Tendencias
      </h3>
      
      {loading ? (
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-7 w-20 bg-muted/20 animate-pulse rounded-md" />
          ))}
        </div>
      ) : tags.length === 0 ? (
        <p className="text-xs text-muted-foreground italic">Monitoreando ecosistema IA...</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Link
              key={tag.name}
              href={`/buscar?q=${tag.name}`}
              className="group inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-muted/30 border border-border/50 text-xs hover:bg-neon-blue/10 hover:border-neon-blue/30 transition-all"
            >
              <span className="text-neon-blue font-bold opacity-70">#</span>
              <span className="font-medium group-hover:text-neon-blue">{tag.name}</span>
              <span className="text-[10px] bg-background/50 px-1 rounded font-mono text-muted-foreground group-hover:text-neon-blue/60 group-hover:bg-neon-blue/5">
                {tag.count}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function NewsletterCard() {
  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState("");
  return (
    <div className="rounded-lg border p-4 bg-gradient-to-br from-neon-blue/5 to-neon-purple/5">
      <h3 className="font-semibold mb-2">Newsletter IA</h3>
      <p className="text-sm text-muted-foreground mb-3">
        Recibe las mejores noticias de IA en tu inbox cada semana.
      </p>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm" className="w-full" variant="outline">
            Suscribirme
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Suscribirme al newsletter</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              onClick={async () => {
                try {
                  const supabase = getSupabaseBrowserClient();
                  const { data } = await supabase.auth.getUser();
                  const userId = data.user?.id;
                  if (!userId) {
                    toast.error("Inicia sesión para suscribirte");
                    return;
                  }
                  const expires = new Date();
                  expires.setMonth(expires.getMonth() + 1);
                  const { error } = await supabase.from("subscriptions").insert({
                    user_id: userId,
                    plan: "monthly",
                    status: "active",
                    started_at: new Date().toISOString(),
                    expires_at: expires.toISOString(),
                    payment_method: "newsletter",
                  });
                  if (error) {
                    toast.error("No se pudo suscribir");
                    return;
                  }
                  toast.success("Suscripción registrada");
                  setOpen(false);
                } catch {
                  toast.error("Error inesperado");
                }
              }}
            >
              Confirmar suscripción
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AboutCard() {
  return (
    <div className="rounded-lg border p-4">
      <h3 className="font-semibold mb-2">Sobre Neural Nexus</h3>
      <p className="text-sm text-muted-foreground">
        Portal automatizado de contenido. Usamos inteligencia artificial para resumir, analizar y curar contenido del
        ecosistema IA.
      </p>
    </div>
  );
}
