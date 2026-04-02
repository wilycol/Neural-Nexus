import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { createSupabaseAdmin } from "@/lib/supabase-server";
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
    
    // Industrial Logger: Beatriz V5 Reception
    console.log(`[Beatriz V5] Ingesting content: ${body?.title || 'Untitled'}`);
    console.log(`[Beatriz V5] Content Type: ${body?.content_type || 'image'}`);
    
    const title = typeof body?.title === "string" ? body.title.trim() : "";
    const content = typeof body?.content === "string" ? body.content : "";
    
    // Content-Aware: New Structured Payload
    const content_type = typeof body?.content_type === "string" ? body.content_type : "image";
    
    // Media Object (New) or Fallback (Old)
    const mediaObj = body?.media || {};
    const cover_url = typeof mediaObj.cover_url === "string" ? mediaObj.cover_url : (typeof body?.media === "string" ? body.media : "");
    const video_url = typeof mediaObj.video_url === "string" ? mediaObj.video_url : (typeof body?.video_url === "string" ? body.video_url : "");
    
    // Industrial Alignment: Explicit null safety for local-only assets
    const audio_url = (typeof mediaObj.audio_url === "string" && mediaObj.audio_url) ? mediaObj.audio_url : null;
    const subtitles_url = (typeof mediaObj.subtitles_url === "string" && mediaObj.subtitles_url) ? mediaObj.subtitles_url : null;

    // Flags Object (New) or Defaults (Old)
    const flagsObj = body?.flags || {};
    const has_audio = typeof flagsObj.has_audio === "boolean" ? flagsObj.has_audio : false;
    const has_subtitles = typeof flagsObj.has_subtitles === "boolean" ? flagsObj.has_subtitles : false;
    const is_short = typeof flagsObj.is_short === "boolean" ? flagsObj.is_short : true;
    const is_reusable = typeof flagsObj.is_reusable === "boolean" ? flagsObj.is_reusable : true;

    // Standard Fields
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

    const supabase = createSupabaseAdmin();

    // 1. Atribución a Beatriz (ID de Autor si fuera necesario, o simplemente el nombre de fuente que ya tenemos)
    const author_id = body?.author_id || null; // Beatriz V5 puede enviar su propio ID de sistema
    const { data: existing } = await supabase
      .from("news")
      .select("id")
      .or(`title.ilike.%${title.slice(0, 30)}%,slug.eq.${generateSlug(title)}`)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .limit(1);

    if (existing && existing.length > 0) {
      return NextResponse.json({ error: "Contenido duplicado detectado (Protección 24h)", id: existing[0].id }, { status: 409 });
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
        image_url: cover_url || null,
        video_url: video_url || null,
        source_name: "Beatriz AutoPublisher",
        source_url: finalUrl,
        published_at: now,
        created_at: customCreatedAt || now,
        category: category as string,
        tags,
        author_id, // Nuevo campo de alineación industrial
        is_top_story: Boolean(trendScore !== null && trendScore >= 150),
        ai_generated: true,
        relevance_score: aiProcessed?.relevance_score || trendScore || 0,
        mention_count: 1,
        status: status,

        // Content-Aware Fields (Phase 2)
        content_type,
        cover_url: cover_url || null,
        audio_url,
        subtitles_url,
        has_audio,
        has_subtitles,
        is_short,
        is_reusable,
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
