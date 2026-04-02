import { createServerClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = createServerClient();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Consultamos los tags de las noticias más recientes
    const { data, error } = await supabase
      .from("news")
      .select("tags, mention_count")
      .gte("created_at", sevenDaysAgo.toISOString())
      .limit(200);

    if (error) throw error;

    // Agregación de Tags
    const tagStats: Record<string, number> = {};
    
    (data || []).forEach((item) => {
      const tags = Array.isArray(item.tags) ? item.tags : [];
      tags.forEach((tag: string) => {
        if (!tag) return;
        const tagName = tag.trim();
        if (!tagStats[tagName]) tagStats[tagName] = 0;
        // Ponderamos por menciones (mínimo 1)
        tagStats[tagName] += Math.max(item.mention_count || 1, 1);
      });
    });

    // Convertir a array y ordenar
    const trending = Object.entries(tagStats)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8); // Top 8 Tendencias

    return NextResponse.json({
      data: trending,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("[Trending API Error]:", error);
    return NextResponse.json(
      { error: "Error al calcular tendencias" },
      { status: 500 }
    );
  }
}
