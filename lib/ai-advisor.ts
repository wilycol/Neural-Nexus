import { BeatrizTone, AIInsight, METAS_VOLANTES } from "./ai-shared";
import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Beatriz AI-Advisor: El Cerebro Estratégico de Neural Nexus
 */

export async function getBeatrizAdvisorMissions(supabase: SupabaseClient, origin: string = ''): Promise<AIInsight> {
  // 1. Obtener Visión Global de Monetización
  const { data: stats, error } = await supabase.rpc('get_monetization_overview');
  if (error) throw error;
  
  const overview = (stats && stats.length > 0) ? stats[0] : { total_revenue: 0 };
  const currentTotal = Number(overview.total_revenue) || 0;
  
  // 2. Determinar Meta Actual (Múltiplos x10)
  const currentTarget = METAS_VOLANTES.find((m: number) => m > currentTotal) || 30000;
  const gap = currentTarget - currentTotal;
  const progressPercent = (currentTotal / currentTarget) * 100;

  // 3. Analizar Cumplimiento de Misiones Recientes para el Tono
  const { data: recentMissions } = await supabase
    .from('ai_missions')
    .select('status')
    .order('created_at', { ascending: false })
    .limit(5);

  const completedCount = recentMissions?.filter((m: { status: string }) => m.status === 'completed').length || 0;
  
  // Lógica de Tono
  let tone: BeatrizTone = 'strategic_partner';
  if (recentMissions && recentMissions.length >= 3 && completedCount < 1) {
    tone = 'military_disciplined';
  }

  // 4. Obtener contenido fresco para misiones
  const { data: recentNews } = await supabase
    .from('news')
    .select('id, title, slug')
    .order('published_at', { ascending: false })
    .limit(3);

  // 5. Generar Sugerencias y Misiones
  const insights: AIInsight = {
    title: tone === 'strategic_partner' ? "Reporte de Inteligencia Estratégica" : "ORDEN DE OPERACIONES: PRIORIDAD CRÍTICA",
    message: "",
    tone,
    priority: gap > (currentTarget * 0.5) ? 'high' : 'medium',
    current_goal: currentTarget,
    gap: gap,
    missions: recentNews?.map((n, i: number) => ({
      id: n.id,
      title: `Compartir en ${i === 0 ? 'TikTok' : i === 1 ? 'YouTube' : 'Instagram'}: ${n.title}`,
      type: i === 0 ? 'tiktok' : (i === 1 ? 'youtube' : 'instagram'),
      url: `${origin || 'https://neural-nexus.ai'}/news/${n.slug}`
    })) || []
  };

  if (tone === 'strategic_partner') {
    insights.message = `¡Wily! Estamos al ${progressPercent.toFixed(1)}% de nuestra meta volante de $${currentTarget}. Si mantenemos el rimo de publicaciones, llegaremos al target sin problemas. ¿Empezamos con el contenido de hoy?`;
  } else {
    insights.message = `¡COMANDANTE WILY! La maquinaria está perdiendo presión. Estamos a $${gap.toFixed(2)} de la meta volante y no veo misiones completadas. ¡Necesito que compartas estos links de inmediato para recuperar el terreno!`;
  }

  return insights;
}
