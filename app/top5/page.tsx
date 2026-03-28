"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, Clock, ArrowLeft, TrendingUp, Calendar } from "lucide-react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BlogPost } from "@/types";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

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
      setPosts(data.data || []);
    } catch {
      toast.error('Error al cargar los Top 5');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />

      <main className="md:ml-64 pt-16">
        <div className="container mx-auto px-4 py-6 max-w-5xl">
          {/* Back button */}
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              Volver al inicio
            </Link>
          </Button>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold font-orbitron">Top 5 del Día</h1>
                <p className="text-muted-foreground">
                  Las noticias más virales analizadas por IA
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Badge variant="secondary" className="gap-1">
                <TrendingUp className="h-3 w-3" />
                Actualizado diariamente
              </Badge>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(new Date())}
              </span>
            </div>
          </div>

          {/* Posts list */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Sparkles className="h-12 w-12 text-neon-blue mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">
                  Los Top 5 están en preparación
                </h2>
                <p className="text-muted-foreground">
                  Vuelve más tarde para ver los posts destacados del día
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
      </main>
    </div>
  );
}

function Top5PostCard({ post, rank }: { post: BlogPost; rank: number }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all group">
      <Link href={`/blog/${post.slug}`}>
        <div className="flex flex-col md:flex-row">
          {/* Rank & Image */}
          <div className="relative md:w-64 h-48 md:h-auto flex-shrink-0">
            {post.image_url ? (
              <Image
                src={post.image_url}
                alt={post.title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 flex items-center justify-center">
                <Sparkles className="h-12 w-12 text-neon-blue" />
              </div>
            )}
            {/* Rank badge */}
            <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {rank}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            <h2 className="text-xl font-semibold mb-3 group-hover:text-neon-blue transition-colors line-clamp-2">
              {post.title}
            </h2>

            <p className="text-muted-foreground mb-4 line-clamp-3">
              {post.excerpt}
            </p>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {post.read_time} min lectura
              </span>
              <span>•</span>
              <span>{formatDate(post.published_at)}</span>
              <span>•</span>
              <span className="text-neon-purple">@{post.author_nickname}</span>
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center gap-4 mt-4 pt-4 border-t text-sm text-muted-foreground">
              <span>{post.like_count || 0} likes</span>
              <span>{post.comment_count || 0} comentarios</span>
              <span>{post.share_count || 0} shares</span>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
}
