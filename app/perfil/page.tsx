"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Crown,
  Edit,
  TrendingUp,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatRelativeTime } from "@/lib/utils";
import { getSupabaseBrowserClient } from "@/lib/supabase-client";
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
import { useAuth } from "@/hooks/use-auth";

export default function ProfilePage() {
  const { user, profile, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [shareCount, setShareCount] = useState<number>(0);
  const [commentCount, setCommentCount] = useState<number>(0);
  const [favoriteCount, setFavoriteCount] = useState<number>(0);

  // Stats loading
  useEffect(() => {
    const loadStats = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const supabase = getSupabaseBrowserClient();
        
        const [favoritesRes, commentsRes, sharesRes] = await Promise.all([
          supabase.from("favorites").select("*", { count: "exact", head: true }).eq("user_id", user.id),
          supabase.from("comments").select("*", { count: "exact", head: true }).eq("user_id", user.id),
          supabase.from("shares").select("*", { count: "exact", head: true }).eq("user_id", user.id),
        ]);

        setFavoriteCount(favoritesRes.count || 0);
        setCommentCount(commentsRes.count || 0);
        setShareCount(sharesRes.count || 0);
      } catch (err) {
        console.error("[Profile] Stats error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) loadStats();
  }, [user, profile, authLoading]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Back button */}
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link href="/" className="gap-1">
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio
        </Link>
      </Button>

      {authLoading || loading ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">Cargando perfil...</p>
          </CardContent>
        </Card>
      ) : !user ? (
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
                <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
                  <AvatarImage src={profile?.avatar_url || user.user_metadata?.avatar_url} />
                  <AvatarFallback className="text-2xl bg-gradient-to-br from-neon-blue to-neon-purple text-white">
                    {(profile?.nickname || user.email?.split("@")[0] || "US").slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold">@{profile?.nickname || user.email?.split("@")[0]}</h1>
                    {profile?.is_premium && (
                      <Badge className="bg-gradient-to-r from-neon-blue to-neon-purple">
                        <Crown className="h-3 w-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Miembro desde {profile?.created_at ? formatDate(profile.created_at) : "—"}
                  </p>
                  <p className="text-muted-foreground text-sm">{user.email}</p>
                </div>
                <div className="flex gap-2">
                  {profile?.role === 'admin' && (
                    <Button variant="outline" size="sm" asChild className="border-neon-purple/30 hover:border-neon-purple">
                      <Link href="/admin/monetization">
                        <TrendingUp className="h-4 w-4 mr-1 text-neon-purple" />
                        Búnker 30K
                      </Link>
                    </Button>
                  )}
                  <EditProfileModal
                    currentNickname={profile?.nickname || user.email?.split("@")[0] || ""}
                    currentAvatarUrl={profile?.avatar_url || ""}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 rounded-lg bg-muted/50 border">
                  <Share2 className="h-5 w-5 mx-auto mb-1 text-neon-blue" />
                  <p className="text-2xl font-bold">{shareCount}</p>
                  <p className="text-xs text-muted-foreground">Shares</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/50 border">
                  <MessageCircle className="h-5 w-5 mx-auto mb-1 text-neon-purple" />
                  <p className="text-2xl font-bold">{commentCount}</p>
                  <p className="text-xs text-muted-foreground">Comentarios</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/50 border">
                  <Heart className="h-5 w-5 mx-auto mb-1 text-red-500" />
                  <p className="text-2xl font-bold">{favoriteCount}</p>
                  <p className="text-xs text-muted-foreground">Favoritos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="actividad">
            <TabsList className="mb-4 bg-muted/50 border p-1 h-auto">
              <TabsTrigger value="actividad" className="gap-1 py-1 px-4">
                <TrendingUp className="h-4 w-4" />
                Actividad
              </TabsTrigger>
              <TabsTrigger value="comentarios" className="gap-1 py-1 px-4">
                <MessageCircle className="h-4 w-4" />
                Comentarios
              </TabsTrigger>
              <TabsTrigger value="favoritos" className="gap-1 py-1 px-4">
                <Heart className="h-4 w-4" />
                Favoritos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="actividad">
              <ActivityTab userId={user.id} />
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
  );
}

interface UserActivity {
  type: 'share' | 'comment' | 'like' | 'favorite';
  text: string;
  time: Date;
}

function ActivityTab({ userId }: { userId: string }) {
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActivity = async () => {
      try {
        const supabase = getSupabaseBrowserClient();
        
        const [shares, comments, likes, favorites] = await Promise.all([
          supabase.from("shares").select("created_at, platform").eq("user_id", userId).order("created_at", { ascending: false }).limit(5),
          supabase.from("comments").select("created_at, content").eq("user_id", userId).order("created_at", { ascending: false }).limit(5),
          supabase.from("likes").select("created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(5),
          supabase.from("favorites").select("created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(5),
        ]);

        const merged: UserActivity[] = [
          ...(shares.data || []).map(s => ({ type: 'share' as const, text: `Compartió una noticia en ${s.platform}`, time: new Date(s.created_at) })),
          ...(comments.data || []).map(c => ({ type: 'comment' as const, text: `Comentó: "${c.content.substring(0, 30)}..."`, time: new Date(c.created_at) })),
          ...(likes.data || []).map(() => ({ type: 'like' as const, text: 'Le dio like a una noticia', time: new Date() })),
          ...(favorites.data || []).map(f => ({ type: 'favorite' as const, text: 'Guardó una noticia en favoritos', time: new Date(f.created_at) })),
        ].sort((a, b) => b.time.getTime() - a.time.getTime()).slice(0, 10);

        setActivities(merged);
      } catch (err) {
        console.error("Activity load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadActivity();
  }, [userId]);

  if (loading) return <CardContent><p className="text-center text-muted-foreground">Cargando actividad...</p></CardContent>;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Actividad reciente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No hay actividad reciente registrada.</p>
          ) : (
            activities.map((activity, i) => (
              <div key={i} className="flex items-start gap-3 pb-4 border-b last:border-0">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  {activity.type === 'share' && <Share2 className="h-4 w-4" />}
                  {activity.type === 'comment' && <MessageCircle className="h-4 w-4" />}
                  {activity.type === 'like' && <Heart className="h-4 w-4" />}
                  {activity.type === 'favorite' && <Heart className="h-4 w-4" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm">{activity.text}</p>
                  <p className="text-xs text-muted-foreground">
                    {activity.time instanceof Date && !isNaN(activity.time.getTime()) 
                      ? formatRelativeTime(activity.time) 
                      : "Recientemente"}
                  </p>
                </div>
              </div>
            ))
          )}
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
        const ordered = ids.map((id: string) => byId.get(id)).filter(Boolean) as unknown as NewsItem[];
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
          <div className="text-center py-8">
            <Heart className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">Sin favoritos</p>
            <Button asChild variant="outline" className="mt-3">
              <Link href="/">Explorar noticias</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-3">
            {items.map((n) => (
              <Link key={n.id} href={`/news/${n.slug}`} className="rounded-md border p-3 hover:bg-accent group transition-colors">
                <p className="text-sm font-medium group-hover:text-neon-blue">{n.title}</p>
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
  currentNickname,
  currentAvatarUrl,
}: {
  currentNickname: string;
  currentAvatarUrl: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [n, setN] = useState(currentNickname);
  const [a, setA] = useState(currentAvatarUrl || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const { data } = await supabase.auth.getUser();
      const userId = data.user?.id;
      if (!userId) return;

      const { error } = await supabase
        .from("users")
        .update({ nickname: n.trim(), avatar_url: a.trim() || null })
        .eq("id", userId);

      if (error) throw error;
      
      toast.success("Perfil actualizado");
      setOpen(false);
      window.location.reload(); // Refresh to update useAuth state
    } catch {
      toast.error("Error al actualizar perfil");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1 border-muted-foreground/30 hover:border-neon-blue">
          <Edit className="h-4 w-4" />
          Editar perfil
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md border-neon-blue/20 bg-background/95 backdrop-blur-md">
        <DialogHeader>
          <DialogTitle className="font-orbitron">Editar perfil</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nickname</label>
            <Input value={n} onChange={(e) => setN(e.target.value)} className="bg-muted/30" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Avatar URL</label>
            <Input value={a} onChange={(e) => setA(e.target.value)} placeholder="https://..." className="bg-muted/30" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-gradient-to-r from-neon-blue to-neon-purple text-white">
              {saving ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
