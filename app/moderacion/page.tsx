"use client";

import React, { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldAlert } from "lucide-react";
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

type ModerationItem = {
  id: string;
  user_nickname: string;
  content: string;
  toxicity_score: number | null;
  created_at: string;
};

export default function ModerationPage() {
  const [items, setItems] = useState<ModerationItem[]>([]);
  const [role, setRole] = useState<string>("user");
  const [loading, setLoading] = useState(true);
  const [reasonOpen, setReasonOpen] = useState<string | null>(null);
  const [moderationReason, setModerationReason] = useState<Record<string, string>>({});

  useEffect(() => {
    const load = async () => {
      try {
        const supabase = getSupabaseBrowserClient();
        const { data } = await supabase.auth.getUser();
        const userId = data.user?.id;
        if (!userId) {
          setRole("user");
          setItems([]);
          return;
        }
        const { data: profile } = await supabase.from("users").select("role").eq("id", userId).maybeSingle();
        setRole(profile?.role || "user");
        const { data: rows } = await supabase
          .from("comments")
          .select("id,user_nickname,content,toxicity_score,created_at")
          .eq("is_moderated", true)
          .order("created_at", { ascending: false })
          .limit(100);
        setItems(rows || []);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const approve = async (id: string) => {
    try {
      const supabase = getSupabaseBrowserClient();
      const { data } = await supabase.auth.getUser();
      const moderatorId = data.user?.id;
      const { error } = await supabase.from("comments").update({ is_moderated: false }).eq("id", id);
      if (error) {
        toast.error("No se pudo aprobar");
        return;
      }
      await fetch("/api/moderation/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment_id: id, moderator_id: moderatorId, reason: moderationReason[id] || "" }),
      }).catch(() => {});
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast.success("Comentario aprobado");
    } catch {
      toast.error("Error inesperado");
    }
  };

  if (role !== "admin" && role !== "moderator") {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Sidebar />
        <main className="md:ml-64 pt-16">
          <div className="container mx-auto px-4 py-6 max-w-5xl">
            <Card>
              <CardContent className="p-12 text-center">
                <ShieldAlert className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h1 className="text-2xl font-bold mb-2">No autorizado</h1>
                <p className="text-muted-foreground">Esta sección es solo para moderadores</p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      <main className="md:ml-64 pt-16">
        <div className="container mx-auto px-4 py-6 max-w-5xl">
          <Card>
            <CardContent className="p-6">
              <h1 className="text-2xl font-bold mb-4">Moderación de comentarios</h1>
              {loading ? (
                <p className="text-muted-foreground">Cargando...</p>
              ) : items.length === 0 ? (
                <p className="text-muted-foreground">No hay comentarios pendientes</p>
              ) : (
                <div className="space-y-3">
                  {items.map((c) => (
                    <div key={c.id} className="rounded-md border p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium">@{c.user_nickname}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(c.created_at).toLocaleString()}
                        </span>
                        {typeof c.toxicity_score === "number" ? (
                          <span className="ml-auto text-xs">Toxicidad: {c.toxicity_score.toFixed(2)}</span>
                        ) : null}
                      </div>
                      <p className="text-sm mb-3">{c.content}</p>
                      <div className="flex justify-end">
                        <Dialog open={reasonOpen === c.id} onOpenChange={(open) => setReasonOpen(open ? c.id : null)}>
                          <DialogTrigger asChild>
                            <Button className="bg-gradient-to-r from-neon-blue to-neon-purple text-white">
                              Aprobar
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Motivo de aprobación</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-3">
                              <Input
                                placeholder="Motivo o nota (opcional)"
                                value={moderationReason[c.id] || ""}
                                onChange={(e) =>
                                  setModerationReason((prev) => ({ ...prev, [c.id]: e.target.value }))
                                }
                              />
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setReasonOpen(null)}>
                                  Cancelar
                                </Button>
                                <Button
                                  onClick={() => {
                                    approve(c.id);
                                    setReasonOpen(null);
                                  }}
                                  className="bg-gradient-to-r from-neon-blue to-neon-purple text-white"
                                >
                                  Confirmar
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
