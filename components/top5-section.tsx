"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, Clock, ArrowRight, TrendingUp } from "lucide-react";
import { BlogPost } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

export function Top5Section() {
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

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-neon-blue" />
          <h2 className="text-xl font-bold">Top 5 del Día</h2>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-neon-blue" />
          <h2 className="text-xl font-bold">Top 5 del Día</h2>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">
              Los posts destacados aparecerán aquí pronto
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-neon-blue" />
          <h2 className="text-xl font-bold">Top 5 del Día</h2>
          <Badge variant="secondary" className="ml-2">
            <TrendingUp className="h-3 w-3 mr-1" />
            Viral
          </Badge>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/top5" className="gap-1">
            Ver todos
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {posts.map((post, index) => (
          <Top5Card key={post.id} post={post} rank={index + 1} />
        ))}
      </div>
    </div>
  );
}

function Top5Card({ post, rank }: { post: BlogPost; rank: number }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all group">
      <Link href={`/blog/${post.slug}`}>
        <div className="flex flex-col sm:flex-row">
          {/* Rank & Image */}
          <div className="relative sm:w-48 h-32 sm:h-auto flex-shrink-0">
            {post.image_url ? (
              <Image
                src={post.image_url}
                alt={post.title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-neon-blue" />
              </div>
            )}
            {/* Rank badge */}
            <div className="absolute top-2 left-2 w-8 h-8 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple flex items-center justify-center text-white font-bold text-sm">
              {rank}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-4">
            <CardHeader className="p-0 pb-2">
              <h3 className="text-lg font-semibold leading-tight group-hover:text-neon-blue transition-colors line-clamp-2">
                {post.title}
              </h3>
            </CardHeader>

            <CardContent className="p-0">
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {post.excerpt}
              </p>

              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {post.read_time} min lectura
                </span>
                <span>•</span>
                <span>{formatDate(post.published_at)}</span>
                <span>•</span>
                <span className="text-neon-purple">@{post.author_nickname}</span>
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {post.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </div>
        </div>
      </Link>
    </Card>
  );
}
