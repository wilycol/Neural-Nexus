import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { generateSlug } from "@/lib/utils";
import { processNewsWithAI } from "@/lib/groq";

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function buildExcerptFromContent(content: string, maxLen: number): string {
  const text = stripHtml(content);
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen).trimEnd() + "...";
}

const MASTER_CATEGORIES = [
  'Inteligencia Artificial', 'Software', 'Hardware', 'Robótica', 
  'Historia Tech', 'Futuro y Tendencias', 'Startups Tech', 
  'IA en la Vida Real', 'Seguridad y Ética', 'Gadgets', 
  'Datos Curiosos Tech', 'Rankings'
];

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
    let category = typeof body?.category === "string" ? body.category.trim() : "";
    const trendScore = typeof body?.trend_score === "number" ? body.trend_score : null;
    const status = typeof body?.status === "string" ? body.status : "published";
    const rawTags = Array.isArray(body?.tags) ? body.tags.filter((t: unknown) => typeof t === "string") : [];
    const customCreatedAt = typeof body?.created_at === "string" ? body.created_at : null;

    if (!title || !content) {
      return NextResponse.json({ error: "title y content son requeridos" }, { status: 400 });
    }

    // Categorización Inteligente por IA
    let aiProcessed = null;
    const needsAI = !category || !MASTER_CATEGORIES.includes(category);
    
    if (needsAI) {
      aiProcessed = await processNewsWithAI(title, content, "Beatriz AutoPublisher");
      category = aiProcessed.category;
    }

    const tags = (() => {
      const uniq = new Map<string, string>();
      const combinedTags = [...rawTags, ...(aiProcessed?.tags || [])];
      
      for (const t of combinedTags) {
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

    const supabase = createServerClient();

    // Buscar si ya existe por título
    const { data: existing } = await supabase
      .from("news")
      .select("id")
      .eq("title", title)
      .limit(1);

    if (existing && existing.length > 0) {
      return NextResponse.json({ error: "Noticia ya existe", id: existing[0].id }, { status: 409 });
    }

    const slugBase = generateSlug(aiProcessed?.title || title);
    const slug = `${slugBase}-${Date.now().toString(36)}`;
    const summary = aiProcessed?.summary || buildExcerptFromContent(content, 180);
    const now = new Date().toISOString();
    
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://neural-nexus-inky.vercel.app";
    const finalUrl = `${baseUrl}/news/${slug}`;

    const { data, error } = await supabase
      .from("news")
      .insert({
        title: aiProcessed?.title || title,
        slug,
        summary,
        content,
        image_url: media || null,
        video_url: video_url || null,
        source_name: "Beatriz AutoPublisher",
        source_url: finalUrl,
        published_at: now,
        created_at: customCreatedAt || now,
        category: category as string,
        tags,
        is_top_story: Boolean(trendScore !== null && trendScore >= 150),
        ai_generated: true,
        relevance_score: aiProcessed?.relevance_score || trendScore || 0,
        mention_count: 1,
        status: status,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any)
      .select("*")
      .single();

    if (error) {
      console.error("Error creating news:", error);
      return NextResponse.json({ error: "Error al crear noticia", details: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true,
      data, 
      final_url: finalUrl,
      slug: slug,
      ai_categorized: needsAI
    }, { status: 201 });
  } catch (error) {
    console.error("Internal Error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
