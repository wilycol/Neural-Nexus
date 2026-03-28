"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Crown,
  Edit,
  TrendingUp
} from "lucide-react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { NewsItem } from "@/types";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [nickname, setNickname] = useState<string>("usuario");
  const [email, setEmail] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [joinedAt, setJoinedAt] = useState<string | null>(null);
  const [shareCount, setShareCount] = useState<number>(0);
  const [commentCount, setCommentCount] = useState<number>(0);
  const [favoriteCount, setFavoriteCount] = useState<number>(0);

  const sidebarUser = useMemo(
    () =>
      userId
        ? {
            nickname,
            avatar_url: avatarUrl || undefined,
            is_premium: isPremium,
          }
        : null,
    [avatarUrl, isPremium, nickname, userId]
  );

  useEffect(() => {
    const load = async () => {
      try {
        const supabase = getSupabaseBrowserClient();
        const { data } = await supabase.auth.getUser();
        const authUser = data.user;

        if (!authUser) {
          setUserId(null);
          return;
        }

        setUserId(authUser.id);
        setEmail(authUser.email || "");

        const { data: profile } = await supabase
          .from("users")
          .select("nickname, avatar_url, is_premium, share_count, created_at")
          .eq("id", authUser.id)
          .maybeSingle();

        setNickname(profile?.nickname || authUser.user_metadata?.nickname || authUser.email?.split("@")[0] || "usuario");
        setAvatarUrl(profile?.avatar_url || authUser.user_metadata?.avatar_url || null);
        setIsPremium(Boolean(profile?.is_premium));
        setShareCount(profile?.share_count || 0);
        setJoinedAt(profile?.created_at || authUser.created_at || null);

        const [favoritesRes, commentsRes] = await Promise.all([
          supabase.from("favorites").select("*", { count: "exact", head: true }).eq("user_id", authUser.id),
          supabase.from("comments").select("*", { count: "exact", head: true }).eq("user_id", authUser.id),
        ]);

        setFavoriteCount(favoritesRes.count || 0);
        setCommentCount(commentsRes.count || 0);
      } catch {
        toast.error("No se pudo cargar tu perfil");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleLogout = async () => {
    try {
      const supabase = getSupabaseBrowserClient();
      await supabase.auth.signOut();
      toast.success("Sesión cerrada");
      window.location.href = "/";
    } catch {
      toast.error("No se pudo cerrar la sesión");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar isLoggedIn={Boolean(userId)} user={sidebarUser} onLogout={handleLogout} />

      <main className="md:ml-64 pt-16">
        <div className="container mx-auto px-4 py-6 max-w-5xl">
          {loading ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">Cargando perfil...</p>
              </CardContent>
            </Card>
          ) : !userId ? (
            <Card>
              <CardContent className="p-12 text-center">
                <h1 className="text-2xl font-bold mb-2">Inicia sesión</h1>
                <p className="text-muted-foreground mb-6">Necesitas una cuenta para ver tu perfil.</p>
                <Button asChild className="bg-gradient-to-r from-neon-blue to-neon-purple text-white">
                  <Link href="/login">Entrar</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card className="mb-6 overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-neon-blue/30 to-neon-purple/30" />
                <CardContent className="relative pt-0">
                  <div className="flex flex-col md:flex-row items-start md:items-end -mt-12 mb-4 gap-4">
                    <Avatar className="h-24 w-24 border-4 border-background">
                      <AvatarImage src={avatarUrl || undefined} />
                      <AvatarFallback className="text-2xl bg-gradient-to-br from-neon-blue to-neon-purple text-white">
                        {nickname.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold">@{nickname}</h1>
                        {isPremium && (
                          <Badge className="bg-gradient-to-r from-neon-blue to-neon-purple">
                            <Crown className="h-3 w-3 mr-1" />
                            Premium
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground text-sm">
                        Miembro desde {joinedAt ? new Date(joinedAt).toLocaleDateString("es-ES") : "—"}
                      </p>
                      {email ? <p className="text-muted-foreground text-sm">{email}</p> : null}
                    </div>
                    <EditProfileModal
                      nickname={nickname}
                      avatarUrl={avatarUrl}
                      onSaved={(n, a) => {
                        setNickname(n);
                        setAvatarUrl(a);
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 rounded-lg bg-muted">
                      <Share2 className="h-5 w-5 mx-auto mb-1 text-neon-blue" />
                      <p className="text-2xl font-bold">{shareCount}</p>
                      <p className="text-xs text-muted-foreground">Shares</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted">
                      <MessageCircle className="h-5 w-5 mx-auto mb-1 text-neon-purple" />
                      <p className="text-2xl font-bold">{commentCount}</p>
                      <p className="text-xs text-muted-foreground">Comentarios</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted">
                      <Heart className="h-5 w-5 mx-auto mb-1 text-red-500" />
                      <p className="text-2xl font-bold">{favoriteCount}</p>
                      <p className="text-xs text-muted-foreground">Favoritos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Tabs defaultValue="actividad">
                <TabsList className="mb-4">
                  <TabsTrigger value="actividad" className="gap-1">
                    <TrendingUp className="h-4 w-4" />
                    Actividad
                  </TabsTrigger>
                  <TabsTrigger value="comentarios" className="gap-1">
                    <MessageCircle className="h-4 w-4" />
                    Comentarios
                  </TabsTrigger>
                  <TabsTrigger value="favoritos" className="gap-1">
                    <Heart className="h-4 w-4" />
                    Favoritos
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="actividad">
                  <ActivityTab />
                </TabsContent>

                <TabsContent value="comentarios">
                  <CommentsTab />
                </TabsContent>

                <TabsContent value="favoritos">
                  <FavoritesTab />
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function ActivityTab() {
  const activities = [
    { type: 'share', text: 'Compartió una noticia sobre ChatGPT', time: 'hace 2 horas' },
    { type: 'comment', text: 'Comentó en "Nuevo modelo de OpenAI"', time: 'hace 5 horas' },
    { type: 'like', text: 'Le dio like a 3 noticias', time: 'hace 1 día' },
    { type: 'favorite', text: 'Guardó en favoritos', time: 'hace 2 días' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Actividad reciente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, i) => (
            <div key={i} className="flex items-start gap-3 pb-4 border-b last:border-0">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                {activity.type === 'share' && <Share2 className="h-4 w-4" />}
                {activity.type === 'comment' && <MessageCircle className="h-4 w-4" />}
                {activity.type === 'like' && <Heart className="h-4 w-4" />}
                {activity.type === 'favorite' && <Heart className="h-4 w-4" />}
              </div>
              <div className="flex-1">
                <p className="text-sm">{activity.text}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function CommentsTab() {
  const [items, setItems] = useState<Array<{ id: string; content: string; created_at: string }>>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const load = async () => {
      try {
        const supabase = getSupabaseBrowserClient();
        const { data } = await supabase.auth.getUser();
        const userId = data.user?.id;
        if (!userId) {
          setItems([]);
          return;
        }
        const { data: rows } = await supabase
          .from("comments")
          .select("id,content,created_at")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(50);
        setItems(rows || []);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);
  return (
    <Card>
      <CardContent className="p-4">
        {loading ? (
          <p className="text-center text-muted-foreground">Cargando...</p>
        ) : items.length === 0 ? (
          <p className="text-center text-muted-foreground">Aún no has comentado</p>
        ) : (
          <div className="space-y-3">
            {items.map((c) => (
              <div key={c.id} className="rounded-md border p-3">
                <div className="text-xs text-muted-foreground">{new Date(c.created_at).toLocaleString()}</div>
                <p className="text-sm">{c.content}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function FavoritesTab() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const load = async () => {
      try {
        const supabase = getSupabaseBrowserClient();
        const { data } = await supabase.auth.getUser();
        const userId = data.user?.id;
        if (!userId) {
          setItems([]);
          return;
        }
        const { data: favs } = await supabase
          .from("favorites")
          .select("news_id,created_at")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(50);
        const ids = (favs || []).map((f) => f.news_id).filter(Boolean);
        if (ids.length === 0) {
          setItems([]);
          return;
        }
        const { data: news } = await supabase.from("news").select("*").in("id", ids);
        const byId = new Map((news || []).map((n) => [n.id, n]));
        const ordered = ids.map((id: string) => byId.get(id)).filter(Boolean) as NewsItem[];
        setItems(ordered);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);
  return (
    <Card>
      <CardContent className="p-4">
        {loading ? (
          <p className="text-center text-muted-foreground">Cargando...</p>
        ) : items.length === 0 ? (
          <div className="text-center">
            <Heart className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">Sin favoritos</p>
            <Button asChild variant="outline" className="mt-3">
              <Link href="/">Explorar noticias</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-3">
            {items.map((n) => (
              <Link key={n.id} href={`/noticia/${n.slug}`} className="rounded-md border p-3 hover:bg-accent">
                <p className="text-sm font-medium">{n.title}</p>
                <p className="text-xs text-muted-foreground">{new Date(n.published_at).toLocaleDateString("es-ES")}</p>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function EditProfileModal({
  nickname,
  avatarUrl,
  onSaved,
}: {
  nickname: string;
  avatarUrl: string | null;
  onSaved: (nickname: string, avatarUrl: string | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const [n, setN] = useState(nickname);
  const [a, setA] = useState(avatarUrl || "");
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    setN(nickname);
    setA(avatarUrl || "");
  }, [nickname, avatarUrl]);
  const handleSave = async () => {
    setSaving(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const { data } = await supabase.auth.getUser();
      const userId = data.user?.id;
      if (!userId) {
        toast.error("Inicia sesión");
        return;
      }
      const { error } = await supabase
        .from("users")
        .update({ nickname: n.trim() || nickname, avatar_url: a.trim() || null })
        .eq("id", userId);
      if (error) {
        toast.error("No se pudo guardar");
        return;
      }
      onSaved(n.trim() || nickname, a.trim() || null);
      toast.success("Perfil actualizado");
      setOpen(false);
    } catch {
      toast.error("Error inesperado");
    } finally {
      setSaving(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <Edit className="h-4 w-4" />
          Editar perfil
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar perfil</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-2">
            <label className="text-sm">Nickname</label>
            <Input value={n} onChange={(e) => setN(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm">Avatar URL</label>
            <Input value={a} onChange={(e) => setA(e.target.value)} placeholder="https://..." />
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving}>
              Guardar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
