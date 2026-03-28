import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types/database";
import { createServerClient as createServiceClient } from "@/lib/supabase";
import { moderateComment } from "@/lib/groq";

export const dynamic = "force-dynamic";

const createSupabaseRouteClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase no está configurado");
  }
  const cookieStore = cookies();
  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll().map(({ name, value }) => ({ name, value }));
      },
    },
  });
};

const tryIncrementBlogPostCommentCount = async (blogPostId: string) => {
  const supabase = (() => {
    try {
      return createServiceClient();
    } catch {
      return null;
    }
  })();
  if (!supabase) return;

  const rpcResult = await (supabase as unknown as { rpc: (fn: string, args?: unknown) => Promise<{ error: unknown | null }> }).rpc(
    "increment_blog_post_comment_count",
    {
      p_blog_post_id: blogPostId,
    }
  );
  if (!rpcResult.error) return;

  const { data: post } = await supabase.from("blog_posts").select("comment_count").eq("id", blogPostId).maybeSingle();
  if (!post) return;

  await supabase
    .from("blog_posts")
    .update({
      comment_count: (post.comment_count || 0) + 1,
      updated_at: new Date().toISOString(),
    })
    .eq("id", blogPostId);
};

const tryIncrementNewsCommentCount = async (newsId: string) => {
  const supabase = (() => {
    try {
      return createServiceClient();
    } catch {
      return null;
    }
  })();
  if (!supabase) return;

  const rpcResult = await (supabase as unknown as { rpc: (fn: string, args?: unknown) => Promise<{ error: unknown | null }> }).rpc(
    "increment_news_comment_count",
    {
      p_news_id: newsId,
    }
  );
  if (!rpcResult.error) return;

  const { data: news } = await supabase.from("news").select("comment_count").eq("id", newsId).maybeSingle();
  if (!news || typeof (news as { comment_count?: number }).comment_count !== "number") return;

  return;
};

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const blogPostId = url.searchParams.get("blog_post_id");
    const newsId = url.searchParams.get("news_id");
    const includeModerated = url.searchParams.get("include_moderated") === "true";
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "20", 10);
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    if (!blogPostId && !newsId) {
      return NextResponse.json({ error: "Falta identificador" }, { status: 400 });
    }
    const supabase = createSupabaseRouteClient();
    let q = supabase
      .from("comments")
      .select("id,user_id,user_nickname,user_avatar,content,created_at,updated_at,parent_id")
      .order("created_at", { ascending: true })
      .range(from, to);
    if (blogPostId) q = q.eq("blog_post_id", blogPostId);
    if (newsId) q = q.eq("news_id", newsId);
    if (!includeModerated) q = q.eq("is_moderated", false);
    const { data, error, count } = await q;
    if (error) {
      return NextResponse.json({ error: "Error al cargar comentarios" }, { status: 500 });
    }
    const hasMore = typeof count === "number" ? to + 1 < count : (data?.length || 0) === limit;
    return NextResponse.json({ data, page, limit, hasMore });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseRouteClient();
    const { data: auth } = await supabase.auth.getUser();
    const user = auth.user;
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const body = await request.json().catch(() => null);
    const content = typeof body?.content === "string" ? body.content.trim() : "";
    const blogPostId = typeof body?.blog_post_id === "string" ? body.blog_post_id : null;
    const newsId = typeof body?.news_id === "string" ? body.news_id : null;
    const parentId = typeof body?.parent_id === "string" ? body.parent_id : null;
    if (!content || (!blogPostId && !newsId)) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }
    const now = new Date().toISOString();
    const { data: profile } = await supabase
      .from("users")
      .select("nickname, avatar_url")
      .eq("id", user.id)
      .maybeSingle();
    const nickname = profile?.nickname || user.user_metadata?.nickname || user.email?.split("@")[0] || "usuario";
    const avatar = profile?.avatar_url || user.user_metadata?.avatar_url || null;

    const moderation = await moderateComment(content);
    const isModerated = !moderation.approved;
    const toxicityScore = typeof moderation.toxicity_score === "number" ? moderation.toxicity_score : null;

    const { data, error } = await supabase
      .from("comments")
      .insert({
        user_id: user.id,
        user_nickname: nickname,
        user_avatar: avatar,
        blog_post_id: blogPostId,
        news_id: newsId,
        content,
        created_at: now,
        updated_at: now,
        parent_id: parentId,
        is_moderated: isModerated,
        toxicity_score: toxicityScore,
      })
      .select("id,user_id,user_nickname,user_avatar,content,created_at")
      .single();
    if (error) {
      return NextResponse.json({ error: "Error al crear comentario" }, { status: 500 });
    }

    if (moderation.approved) {
      if (blogPostId) {
        await tryIncrementBlogPostCommentCount(blogPostId);
      } else if (newsId) {
        await tryIncrementNewsCommentCount(newsId);
      }
      return NextResponse.json({ data }, { status: 201 });
    }

    return NextResponse.json(
      {
        pending: true,
        reason: moderation.reason || "Comentario marcado para revisión",
        toxicity_score: toxicityScore,
      },
      { status: 202 }
    );
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = createSupabaseRouteClient();
    const { data: auth } = await supabase.auth.getUser();
    const user = auth.user;
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const body = await request.json().catch(() => null);
    const id = typeof body?.id === "string" ? body.id : null;
    const content = typeof body?.content === "string" ? body.content.trim() : "";
    if (!id || !content) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }
    const { data: existing } = await supabase.from("comments").select("user_id").eq("id", id).maybeSingle();
    if (!existing || existing.user_id !== user.id) {
      return NextResponse.json({ error: "Prohibido" }, { status: 403 });
    }
    const { data, error } = await supabase
      .from("comments")
      .update({ content, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select("id,user_id,user_nickname,user_avatar,content,created_at,updated_at,parent_id")
      .single();
    if (error) {
      return NextResponse.json({ error: "Error al actualizar comentario" }, { status: 500 });
    }
    return NextResponse.json({ data }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createSupabaseRouteClient();
    const { data: auth } = await supabase.auth.getUser();
    const user = auth.user;
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Falta id" }, { status: 400 });
    }
    const { data: existing } = await supabase.from("comments").select("user_id").eq("id", id).maybeSingle();
    if (!existing || existing.user_id !== user.id) {
      return NextResponse.json({ error: "Prohibido" }, { status: 403 });
    }
    const { error } = await supabase.from("comments").delete().eq("id", id);
    if (error) {
      return NextResponse.json({ error: "Error al eliminar comentario" }, { status: 500 });
    }
    return NextResponse.json({ status: "ok" }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
