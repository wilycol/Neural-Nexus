import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  try {
    const requiredKey = process.env.BEATRIZ_API_KEY;
    if (requiredKey) {
      const receivedKey = request.headers.get("x-beatriz-key") || "";
      if (!receivedKey || receivedKey !== requiredKey) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
      }
    }

    const supabase = createServerClient();

    // 1. Vistas por categoría (últimos 30 días)
    const { data: categoryStats, error: catError } = await supabase
      .from('news')
      .select('category, view_count, like_count, comment_count')
      .order('view_count', { ascending: false });

    if (catError) throw catError;

    const report = (categoryStats || []).reduce((acc: Record<string, { total_views: number, total_likes: number, total_comments: number, post_count: number }>, curr: any) => {
      const cat = curr.category || 'Sin Categoría';
      if (!acc[cat]) {
        acc[cat] = {
          total_views: 0,
          total_likes: 0,
          total_comments: 0,
          post_count: 0
        };
      }
      acc[cat].total_views += curr.view_count || 0;
      acc[cat].total_likes += curr.like_count || 0;
      acc[cat].total_comments += curr.comment_count || 0;
      acc[cat].post_count += 1;
      return acc;
    }, {});

    // 2. Top 5 posts más exitosos
    const { data: topPosts, error: topError } = await supabase
      .from('news')
      .select('title, category, view_count, published_at')
      .order('view_count', { ascending: false })
      .limit(5);

    if (topError) throw topError;

    // 3. Recomendaciones lógicas para Beatriz
    const recommendations = Object.entries(report)
      .map(([name, stats]) => ({
        category: name,
        vpp: stats.post_count > 0 ? stats.total_views / stats.post_count : 0, // Views Per Post
        engagement: stats.post_count > 0 ? (stats.total_likes + stats.total_comments) / stats.post_count : 0
      }))
      .sort((a, b) => b.vpp - a.vpp);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      summary: report,
      top_performing_items: topPosts,
      beatriz_insights: {
        priority_categories: recommendations.slice(0, 3).map(r => r.category),
        low_performance_categories: recommendations.slice(-2).map(r => r.category),
        suggestion: `Beatriz, el contenido de ${recommendations[0]?.category} está teniendo el mejor rendimiento. Sugerimos priorizar esta temática esta semana.`
      }
    });

  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    console.error('Report Error:', err);
    return NextResponse.json({ error: 'Error al generar reporte para Beatriz', details: errorMsg }, { status: 500 });
  }
}
