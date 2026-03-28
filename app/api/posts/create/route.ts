import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { calculateReadTime, generateSlug } from "@/lib/utils";

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function buildExcerptFromContent(content: string, maxLen: number): string {
  const text = stripHtml(content);
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen).trimEnd() + "...";
}

export async function POST(request: NextRequest) {
  try {
    const requiredKey = process.env.BEATRIZ_API_KEY;
    if (requiredKey) {
      const receivedKey = request.headers.get("x-beatriz-key") || "";
      if (!receivedKey || receivedKey !== requiredKey) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
      }
    }

    const body = await request.json().catch(() => null);
    const title = typeof body?.title === "string" ? body.title.trim() : "";
    const content = typeof body?.content === "string" ? body.content : "";
    const media = typeof body?.media === "string" ? body.media.trim() : "";
    const video_url = typeof body?.video_url === "string" ? body.video_url.trim() : "";
    const category = typeof body?.category === "string" ? body.category.trim() : "";
    const trendScore = typeof body?.trend_score === "number" ? body.trend_score : null;
    const rawTags = Array.isArray(body?.tags) ? body.tags.filter((t: unknown) => typeof t === "string") : [];
    const tags = (() => {
      const uniq = new Map<string, string>();
      for (const t of rawTags) {
        const trimmed = t.trim();
        if (!trimmed) continue;
        const key = trimmed.toLowerCase();
        if (!uniq.has(key)) uniq.set(key, trimmed);
      }
      if (category) {
        const key = category.toLowerCase();
        if (!uniq.has(key)) uniq.set(key, category);
      }
      return Array.from(uniq.values());
    })();

    if (!title || !content) {
      return NextResponse.json({ error: "title y content son requeridos" }, { status: 400 });
    }

    const supabase = createServerClient();

    const { data: existing } = await supabase
      .from("blog_posts")
      .select("id")
      .eq("title", title)
      .limit(1);

    if (existing && existing.length > 0) {
      return NextResponse.json({ error: "Post ya existe", id: existing[0].id }, { status: 409 });
    }

    const slugBase = generateSlug(title);
    const slug = `${slugBase}-${Date.now().toString(36)}`;
    const excerpt = buildExcerptFromContent(content, 180);
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from("blog_posts")
      .insert({
        title,
        slug,
        excerpt,
        content,
        image_url: media || null,
        video_url: video_url || null,
        author_id: "beatriz",
        author_nickname: "Beatriz AutoPublisher",
        published_at: now,
        read_time: calculateReadTime(stripHtml(content)),
        tags,
        related_news: [],
        featured: Boolean(trendScore !== null && trendScore >= 150),
        view_count: 0,
        like_count: 0,
        comment_count: 0,
        share_count: 0,
        created_at: now,
        updated_at: now,
      })
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: "Error al crear post" }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
