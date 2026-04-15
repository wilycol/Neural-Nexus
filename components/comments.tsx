"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { getBadgeInfo } from "@/lib/utils";

type Comment = {
  id: string;
  user_id: string;
  user_nickname: string;
  user_avatar: string | null;
  content: string;
  created_at: string;
  updated_at?: string;
  parent_id?: string | null;
  users?: { credits: number };
};

type CommentsProps = {
  kind: "blog" | "news";
  entityId: string;
};

export function Comments({ kind, entityId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [userNickname, setUserNickname] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>("");

  const queryParam = useMemo(() => {
    return kind === "blog" ? `blog_post_id=${encodeURIComponent(entityId)}` : `news_id=${encodeURIComponent(entityId)}`;
  }, [kind, entityId]);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch(`/api/comments?${queryParam}&page=${page}&limit=20`);
        const data = await res.json();
        const rows = (data.data || []) as Comment[];
        setHasMore(!!data.hasMore);
        setComments((prev) => (page === 1 ? rows : [...prev, ...rows]));
      } catch {
        setComments([]);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [queryParam, page]);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const supabase = getSupabaseBrowserClient();
        if (!supabase) return;
        const { data } = await supabase.auth.getUser();
        const authUser = data.user;
        if (authUser) {
          const { data: profile } = await supabase
            .from("users")
            .select("nickname, avatar_url")
            .eq("id", authUser.id)
            .maybeSingle();
          setUserNickname(profile?.nickname || authUser.user_metadata?.nickname || authUser.email?.split("@")[0] || "usuario");
          setUserId(authUser.id);
        } else {
          setUserNickname(null);
          setUserId(null);
        }
      } catch {
        setUserNickname(null);
        setUserId(null);
      }
    };
    loadUser();
  }, []);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setSubmitting(true);
    try {
      const body =
        kind === "blog"
          ? { blog_post_id: entityId, content: text }
          : { news_id: entityId, content: text };
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.status === 202) {
        const data = await res.json().catch(() => null);
        toast.message(data?.reason || "Tu comentario quedó pendiente de moderación");
        setText("");
        return;
      }
      if (!res.ok) {
        if (res.status === 401) {
          toast.error("Inicia sesión para comentar");
        } else {
          toast.error("No se pudo publicar el comentario");
        }
        return;
      }
      const data = await res.json();
      const created = data.data as Comment;
      setComments((prev) => [...prev, created]);
      setText("");
    } catch {
      toast.error("Error inesperado");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = async () => {
    if (!replyTo || !replyText.trim()) return;
    try {
      const body =
        kind === "blog"
          ? { blog_post_id: entityId, content: replyText, parent_id: replyTo }
          : { news_id: entityId, content: replyText, parent_id: replyTo };
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.status === 202) {
        const data = await res.json().catch(() => null);
        toast.message(data?.reason || "Tu respuesta quedó pendiente de moderación");
        setReplyText("");
        setReplyTo(null);
        return;
      }
      if (!res.ok) {
        toast.error("No se pudo publicar la respuesta");
        return;
      }
      const data = await res.json();
      const created = data.data as Comment;
      setComments((prev) => [...prev, created]);
      setReplyText("");
      setReplyTo(null);
    } catch {
      toast.error("Error inesperado");
    }
  };

  const handleEdit = async () => {
    if (!editingId || !editText.trim()) return;
    try {
      const res = await fetch("/api/comments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingId, content: editText }),
      });
      if (!res.ok) {
        toast.error("No se pudo editar");
        return;
      }
      const data = await res.json();
      const updated = data.data as Comment;
      setComments((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      setEditingId(null);
      setEditText("");
    } catch {
      toast.error("Error inesperado");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/comments?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        toast.error("No se pudo eliminar");
        return;
      }
      setComments((prev) => prev.filter((c) => c.id !== id));
    } catch {
      toast.error("Error inesperado");
    }
  };

  const tree = useMemo(() => {
    const byParent: Record<string, Comment[]> = {};
    comments.forEach((c) => {
      const p = (c.parent_id as string | null) || null;
      const key = p || "root";
      (byParent[key] = byParent[key] || []).push(c);
    });
    return byParent;
  }, [comments]);

  const renderComment = (c: Comment) => {
    const replies = tree[c.id] || [];
    const isOwner = userId === c.user_id;
    const badge = getBadgeInfo(c.users?.credits || 0);

    return (
      <div key={c.id} className="rounded-md border p-3 bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-7 w-7 rounded-full bg-muted overflow-hidden border border-border">
            {c.user_avatar ? (
              <Image src={c.user_avatar} alt={c.user_nickname} width={28} height={28} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-[10px] font-bold">
                {c.user_nickname.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex flex-col -space-y-0.5">
            <span className="text-sm font-bold">@{c.user_nickname}</span>
            <span className={`text-[9px] uppercase tracking-tighter font-black ${badge.color}`}>
              {badge.name}
            </span>
          </div>
          <span className="text-[10px] text-muted-foreground ml-auto">{new Date(c.created_at).toLocaleDateString()}</span>
        </div>
        {editingId === c.id ? (
          <div className="space-y-2">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full rounded-md border bg-background p-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              rows={3}
            />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => { setEditingId(null); setEditText(""); }}>
                Cancelar
              </Button>
              <Button size="sm" onClick={handleEdit} className="bg-gradient-to-r from-neon-blue to-neon-purple text-white">
                Guardar
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm">{c.content}</p>
        )}
        <div className="flex gap-2 mt-2">
          <Button variant="ghost" size="sm" onClick={() => setReplyTo(c.id)}>
            Responder
          </Button>
          {isOwner && editingId !== c.id && (
            <>
              <Button variant="ghost" size="sm" onClick={() => { setEditingId(c.id); setEditText(c.content); }}>
                Editar
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(c.id)}>
                Eliminar
              </Button>
            </>
          )}
        </div>
        {replyTo === c.id && (
          <div className="mt-2 space-y-2">
            <Input
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Tu respuesta..."
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleReply} className="bg-gradient-to-r from-neon-blue to-neon-purple text-white">
                Publicar respuesta
              </Button>
              <Button size="sm" variant="outline" onClick={() => { setReplyTo(null); setReplyText(""); }}>
                Cancelar
              </Button>
            </div>
          </div>
        )}
        {replies.length > 0 && (
          <div className="mt-3 border-l pl-3 space-y-3">
            {replies.map((r) => renderComment(r))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4 space-y-3">
          <h3 className="text-lg font-semibold">Comentarios</h3>
          {loading ? (
            <p className="text-sm text-muted-foreground">Cargando...</p>
          ) : comments.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sé el primero en comentar</p>
          ) : (
            <div className="space-y-3">
              {(tree["root"] || []).map((c) => renderComment(c))}
              {hasMore && (
                <div className="flex justify-center">
                  <Button variant="outline" size="sm" onClick={() => setPage((p) => p + 1)}>
                    Ver más
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-3">
          <h4 className="text-sm font-medium">Agregar comentario</h4>
          {!userNickname ? (
            <p className="text-sm text-muted-foreground">Inicia sesión para comentar</p>
          ) : (
            <>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Escribe tu comentario..."
                className="w-full rounded-md border bg-background p-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                rows={3}
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleSubmit}
                  disabled={submitting || !text.trim()}
                  className="bg-gradient-to-r from-neon-blue to-neon-purple text-white hover:opacity-90"
                >
                  Publicar
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
