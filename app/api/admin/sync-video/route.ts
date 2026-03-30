import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * HAPPY BRIDGE API 🚀🔗
 * Endpoint para que Beatriz actualice los videos en tiempo real.
 */
export async function POST(req: Request) {
  try {
    const { title, video_url, secret } = await req.json();

    // 1. Validar Token de Seguridad
    const adminKey = process.env.ADMIN_SYNC_KEY || "nexus_super_secret_bridge_2026";
    if (secret !== adminKey) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    if (!title || !video_url) {
      return NextResponse.json({ error: "Faltan datos (title o video_url)" }, { status: 400 });
    }

    // 2. Conectar a Supabase (Service Role para bypass RLS de actualización)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 3. Buscar noticia por título (Estrategia: Exacto -> Parcial)
    console.log(`[Bridge] Buscando noticia: "${title}"`);
    
    // Intento 1: Coincidencia Exacta
    let { data: newsItem, error: exactError } = await supabase
      .from("news")
      .select("id, title")
      .eq("title", title)
      .maybeSingle();

    // Intento 2: Coincidencia Parcial (ILIKE) si falló la exacta
    if (!newsItem) {
      console.log(`[Bridge] No hubo coincidencia exacta. Intentando parcial...`);
      let { data: fuzzyItem } = await supabase
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
        detail: `No se encontró ninguna noticia que coincida con: ${title}` 
      }, { status: 404 });
    }

    // 4. Actualizar video_url
    const { error: updateError } = await supabase
      .from("news")
      .update({ video_url })
      .eq("id", newsItem.id);

    if (updateError) {
      return NextResponse.json({ error: "Error al actualizar", detail: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "¡Puente cruzado con éxito!", 
      news_id: newsItem.id,
      matched_title: newsItem.title 
    });

  } catch (err) {
    return NextResponse.json({ error: "Error interno", detail: String(err) }, { status: 500 });
  }
}
