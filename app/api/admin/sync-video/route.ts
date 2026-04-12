import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { createClient } from "@supabase/supabase-js";

/**
 * HAPPY BRIDGE API 🚀🔗
 * Endpoint para que Beatriz actualice los videos en tiempo real.
 */
export async function POST(req: Request) {
  try {
    const { title, slug, video_url, image_url, secret } = await req.json();
    
    // 1. Validar Token de Seguridad (Industrial Bridge)
    const adminKey = process.env.ADMIN_SYNC_KEY || "nexus_super_secret_bridge_2026";
    if (secret !== adminKey) {
      console.warn(`[Bridge] Intento de acceso no autorizado con secret incorrecto`);
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    console.log(`[Bridge] Petición de sincronización para slug: "${slug}" o título: "${title}"`);

    if ((!video_url && !image_url) || (!title && !slug)) {
      return NextResponse.json({ error: "Faltan datos (slug/title o video_url/image_url)" }, { status: 400 });
    }

    // 2. Conectar a Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 3. Buscar noticia (Estrategia: Slug Exacto -> Título Exacto -> Título Parcial)
    let newsItem = null;

    // Intento 0: Slug (El método más robusto de V5)
    if (slug) {
      console.log(`[Bridge] Buscando por slug: "${slug}"`);
      const { data: slugItem } = await supabase
        .from("news")
        .select("id, title")
        .eq("slug", slug)
        .maybeSingle();
      newsItem = slugItem;
    }

    // Intento 1: Coincidencia Exacta de Título
    if (!newsItem && title) {
      console.log(`[Bridge] Buscando coincidencia exacta de título: "${title}"`);
      const { data: exactItem } = await supabase
        .from("news")
        .select("id, title")
        .eq("title", title)
        .maybeSingle();
      newsItem = exactItem;
    }

    // Intento 2: Coincidencia Parcial (ILIKE)
    if (!newsItem && title) {
      console.log(`[Bridge] Intentando coincidencia parcial (ILIKE)...`);
      const { data: fuzzyItem } = await supabase
        .from("news")
        .select("id, title")
        .ilike("title", `%${title}%`)
        .limit(1)
        .maybeSingle();
      newsItem = fuzzyItem;
    }

    if (!newsItem) {
      return NextResponse.json({ 
        error: "Noticia no encontrada", 
        detail: `No se encontró ninguna noticia que coincida con slug "${slug}" o título "${title}"` 
      }, { status: 404 });
    }

    // 4. Actualizar noticia (video y/o imagen)
    const updates: Record<string, string> = {};
    if (video_url) {
        updates.video_url = video_url;
        updates.content_type = 'video';
    }
    if (image_url) updates.image_url = image_url;

    const { error: updateError } = await supabase
      .from("news")
      .update(updates)
      .eq("id", newsItem.id);

    if (updateError) {
      return NextResponse.json({ error: "Error al actualizar", detail: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "¡Puente cruzado con éxito!", 
      news_id: newsItem.id,
      matched_title: newsItem.title,
      updates
    });

  } catch (err) {
    return NextResponse.json({ error: "Error interno", detail: String(err) }, { status: 500 });
  }
}
