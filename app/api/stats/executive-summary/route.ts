import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase-server";

/**
 * Resumen Ejecutivo para el móvil del Co-CEO
 * Solo accesible para usuarios con el rol 'admin'
 */
export async function GET() {
  try {
    const supabase = getSupabaseServerClient();

    // 1. Verificar Sesión y Rol
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (userData?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 });
    }

    // 2. Obtener estadísticas de monetización reales
    const { data: overview, error } = await supabase.rpc('get_monetization_overview');
    if (error) throw error;

    const stats = overview[0];

    // 3. Obtener visitas globales
    const { data: siteViews } = await supabase
      .from("site_metrics")
      .select("count")
      .eq("id", "total_site_views")
      .single();

    // 4. Formatear reporte industrial para el móvil
    const report = {
      timestamp: new Date().toISOString(),
      executive_summary: {
        total_visits: siteViews?.count || 0,
        total_clicks: Number(stats.engine_1_clicks) + Number(stats.engine_2_clicks),
        active_revenue: `$${Number(stats.engine_3_revenue).toLocaleString('en-US')}`,
        barbie_goal_progress: `${stats.progress_percent}%`,
      },
      engines: {
        ads: stats.engine_1_clicks,
        affiliates: stats.engine_2_clicks,
        subscriptions: stats.engine_3_revenue,
        newsletter_leads: stats.engine_4_subs,
        partnership_leads: stats.engine_5_leads,
        api_usage: stats.engine_6_usage
      },
      status: "MISSION_ACTIVE"
    };

    return NextResponse.json(report);

  } catch (error) {
    console.error("Executive Summary Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
