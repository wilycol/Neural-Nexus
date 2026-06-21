"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Network,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Zap,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { NewsItem } from "@/types";

// ─── Mapa de nodos de la federación ──────────────────────────────────────────
const NODE_META: Record<
  string,
  { label: string; color: string; glowColor: string; accentClass: string }
> = {
  node_top_click: {
    label: "Top Click",
    color: "#FF6B35",
    glowColor: "rgba(255,107,53,0.4)",
    accentClass: "border-orange-500/40 text-orange-400",
  },
  node_euro__arkadia: {
    label: "Euro Arkadia",
    color: "#00CED1",
    glowColor: "rgba(0,206,209,0.4)",
    accentClass: "border-cyan-500/40 text-cyan-400",
  },
  node_jarvis_easy_stock: {
    label: "Jarvis Easy Stock",
    color: "#8A2BE2",
    glowColor: "rgba(138,43,226,0.4)",
    accentClass: "border-violet-500/40 text-violet-400",
  },
  node_robotic_news: {
    label: "Robotic News",
    color: "#00FF88",
    glowColor: "rgba(0,255,136,0.4)",
    accentClass: "border-emerald-500/40 text-emerald-400",
  },
  node_asesoria_juridica: {
    label: "Asesoría Jurídica",
    color: "#FFD700",
    glowColor: "rgba(255,215,0,0.4)",
    accentClass: "border-yellow-500/40 text-yellow-400",
  },
};

function getNodeMeta(tags: string[]) {
  for (const tag of tags) {
    const key = tag.toLowerCase().replace(/-/g, "_");
    if (NODE_META[key]) return { ...NODE_META[key], tag: key };
  }
  return {
    label: "Neural Hive",
    color: "#00A3FF",
    glowColor: "rgba(0,163,255,0.4)",
    accentClass: "border-neon-blue/40 text-neon-blue",
    tag: "unknown",
  };
}

function timeAgo(dateStr: string): string {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return "ahora";
  if (diff < 3600) return `hace ${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)}h`;
  return `hace ${Math.floor(diff / 86400)}d`;
}

interface HiveNodeCarouselProps {
  className?: string;
}

export function HiveNodeCarousel({ className }: HiveNodeCarouselProps) {
  const [nodes, setNodes] = useState<NewsItem[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [paused, setPaused] = useState(false);

  // ── Fetch noticias de los nodos federados ──────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/news?source=nodes&limit=12&page=1");
        const json = await res.json();
        const items: NewsItem[] = (json?.data || []).filter(
          (n: NewsItem) => Boolean(n?.id)
        );
        setNodes(items);
      } catch {
        setNodes([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ── Auto-avance cada 5 segundos ────────────────────────────────────────────
  useEffect(() => {
    if (paused || nodes.length < 2) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % nodes.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [nodes.length, paused]);

  const prev = useCallback(() => {
    setCurrent((p) => (p - 1 + nodes.length) % nodes.length);
  }, [nodes.length]);

  const next = useCallback(() => {
    setCurrent((p) => (p + 1) % nodes.length);
  }, [nodes.length]);

  // ── Loading skeleton ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-xl border border-neon-blue/20 bg-[#020817]/80 backdrop-blur-xl min-h-[280px] flex flex-col items-center justify-center animate-pulse",
          className
        )}
      >
        <Network className="h-8 w-8 text-neon-blue/30 mb-3 animate-spin" />
        <p className="text-xs text-muted-foreground font-orbitron tracking-widest">
          CONECTANDO CON LA HIVE...
        </p>
      </div>
    );
  }

  // ── Sin nodos: fallback estático ───────────────────────────────────────────
  if (nodes.length === 0) {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-xl border border-neon-blue/20 bg-[#020817]/80 backdrop-blur-xl p-6 min-h-[280px] flex flex-col items-center justify-center text-center",
          className
        )}
      >
        <div className="p-3 rounded-2xl border border-neon-blue/30 bg-neon-blue/10 mb-4">
          <Network className="h-7 w-7 text-neon-blue" />
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-orbitron uppercase tracking-widest mb-3 border border-neon-blue/30 text-neon-blue bg-black/60">
          <Zap className="h-3 w-3" /> Espacio Publicitario
        </div>
        <h3 className="text-xl font-bold font-orbitron text-white mb-2">
          Neural Ad Engine
        </h3>
        <p className="text-sm text-gray-400 italic max-w-xs">
          "Posiciona tu marca en la Red Nexus Hive. Segmentación IA de alta
          precisión."
        </p>
        <Button
          asChild
          className="mt-4 rounded-full px-6 h-9 font-orbitron text-[10px] tracking-widest uppercase bg-neon-blue hover:bg-neon-blue/80 text-white"
        >
          <Link href="/hive">Unirse a la Federación</Link>
        </Button>
      </div>
    );
  }

  const item = nodes[current];
  const meta = getNodeMeta(item.tags || []);
  const img = item.image_url || item.cover_url;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border bg-[#020817]/90 backdrop-blur-xl min-h-[280px] transition-all duration-700",
        className
      )}
      style={{
        borderColor: meta.color + "40",
        boxShadow: `0 0 30px ${meta.glowColor}, inset 0 0 30px rgba(0,0,0,0.5)`,
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Badge superior ─────────────────────────────────────────────────── */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
        <div
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-orbitron uppercase tracking-widest border bg-black/70 backdrop-blur-sm"
          style={{ borderColor: meta.color + "60", color: meta.color }}
        >
          <Network className="h-2.5 w-2.5" />
          {meta.label}
        </div>
        <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-mono border border-white/10 text-white/40 bg-black/60">
          <Clock className="h-2.5 w-2.5" />
          {timeAgo(item.published_at)}
        </div>
      </div>

      {/* ── Indicador LIVE ──────────────────────────────────────────────────── */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/70 border border-white/10">
        <span
          className="h-1.5 w-1.5 rounded-full animate-ping"
          style={{ backgroundColor: meta.color }}
        />
        <span className="text-[8px] font-mono text-white/50 uppercase">Live</span>
      </div>

      {/* ── Background image animada ────────────────────────────────────────── */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          {img && (
            <motion.div
              key={item.id + "_bg"}
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Image
                src={img}
                alt={item.title}
                fill
                className="object-cover opacity-25"
                unoptimized
              />
            </motion.div>
          )}
        </AnimatePresence>
        {/* Gradiente de profundidad */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#020817] via-[#020817]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#020817]/40 via-transparent to-[#020817]/40" />
      </div>

      {/* ── Contenido principal ─────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col justify-end h-full min-h-[280px] p-5 pt-14">
        <AnimatePresence mode="wait">
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-col gap-3"
          >
            {/* Título */}
            <h3 className="text-base font-bold text-white leading-snug line-clamp-2 drop-shadow-md">
              {item.title}
            </h3>

            {/* Resumen */}
            {item.summary && (
              <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                {item.summary}
              </p>
            )}

            {/* CTA */}
            <div className="flex items-center justify-between mt-1">
              <Button
                asChild
                size="sm"
                className="rounded-full h-8 px-4 font-orbitron text-[9px] tracking-widest uppercase transition-all hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: meta.color,
                  color: "#000",
                  boxShadow: `0 0 16px ${meta.glowColor}`,
                }}
              >
                <Link href={`/news/${item.slug}`}>
                  Ver Publicación
                  <ExternalLink className="ml-1.5 h-3 w-3" />
                </Link>
              </Button>

              {/* Nodo origin link */}
              <a
                href={item.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[9px] font-mono text-white/30 hover:text-white/60 transition-colors flex items-center gap-1"
              >
                <ExternalLink className="h-2.5 w-2.5" />
                {item.source_name}
              </a>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Controles de navegación ──────────────────────────────────────────── */}
      {nodes.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-1.5 rounded-full bg-black/50 border border-white/10 hover:bg-black/80 hover:border-white/30 transition-all backdrop-blur-sm"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-3.5 w-3.5 text-white/70" />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-1.5 rounded-full bg-black/50 border border-white/10 hover:bg-black/80 hover:border-white/30 transition-all backdrop-blur-sm"
            aria-label="Siguiente"
          >
            <ChevronRight className="h-3.5 w-3.5 text-white/70" />
          </button>
        </>
      )}

      {/* ── Progress dots ────────────────────────────────────────────────────── */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 items-center">
        {nodes.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={cn(
              "h-1 rounded-full transition-all duration-500",
              i === current ? "w-6" : "w-1.5 opacity-30 hover:opacity-60"
            )}
            style={{
              backgroundColor: i === current ? meta.color : "#fff",
            }}
            aria-label={`Ir a publicación ${i + 1}`}
          />
        ))}
      </div>

      {/* ── Progress bar animada ─────────────────────────────────────────────── */}
      {!paused && (
        <motion.div
          key={current + "_progress"}
          className="absolute bottom-0 left-0 h-[2px] z-20"
          style={{ backgroundColor: meta.color }}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 5, ease: "linear" }}
        />
      )}
    </div>
  );
}
