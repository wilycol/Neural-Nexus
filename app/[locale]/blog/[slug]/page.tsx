"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowLeft, Clock, CalendarDays } from "lucide-react";
import { BlogPost } from "@/types";
import { formatDate } from "@/lib/utils";
import { Comments } from "@/components/comments";

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/blog/${slug}`);
        if (!res.ok) throw new Error("No encontrado");
        const data = await res.json();
        setPost(data.data);
      } catch {
        setError("No se pudo cargar el post");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link href="/top5" className="gap-1">
          <ArrowLeft className="h-4 w-4" />
          Volver a Top 5
        </Link>
      </Button>

      {loading ? (
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="h-6 bg-muted rounded w-3/4 mb-2" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </CardContent>
        </Card>
      ) : error || !post ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">No se pudo cargar el post</p>
          </CardContent>
        </Card>
      ) : (
        <article className="space-y-6">
          {post.image_url ? (
            <div className="relative w-full aspect-video rounded-lg overflow-hidden">
              <Image src={post.image_url} alt={post.title} fill className="object-cover" />
            </div>
          ) : (
            <div className="w-full aspect-video rounded-lg bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 flex items-center justify-center">
              <Sparkles className="h-12 w-12 text-neon-blue" />
            </div>
          )}

          <div className="flex items-center gap-2">
            {post.tags?.slice(0, 4).map((t) => (
              <Badge key={t} variant="secondary" className="text-xs">
                #{t}
              </Badge>
            ))}
          </div>

          <h1 className="text-3xl font-bold">{post.title}</h1>

          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="text-neon-purple">@{post.author_nickname}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {post.read_time} min lectura
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <CalendarDays className="h-4 w-4" />
              {formatDate(post.published_at)}
            </span>
          </div>

          <p className="text-lg text-muted-foreground">{post.excerpt}</p>

          <div className="prose prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>

          <Comments kind="blog" entityId={post.id} />
        </article>
      )}
    </div>
  );
}
