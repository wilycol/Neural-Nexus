import { getSupabaseServerClient } from "./supabase-server";

/**
 * Beatriz AI-Advisor: El Cerebro Estratégico de Neural Nexus
 * Este motor analiza las métricas, calcula el éxito y presiona al Co-CEO (Wily) 
 * para alcanzar las metas volantes (100 -> 30k).
 */

export type BeatrizTone = 'strategic_partner' | 'military_disciplined';

export interface AIInsight {
  title: string;
  message: string;
  tone: BeatrizTone;
  priority: 'low' | 'medium' | 'high' | 'critical';
  current_goal: number;
  gap: number;
  missions: {
    id: string;
    title: string;
    type: 'tiktok' | 'youtube' | 'instagram' | 'newsletter';
    url?: string;
  }[];
}

export const METAS_VOLANTES = [100, 1000, 10000, 30000];

export async function getBeatrizAdvisorMissions(): Promise<AIInsight> {
  const supabase = getSupabaseServerClient();
  
  // 1. Obtener Visión Global de Monetización
  const { data: stats, error } = await supabase.rpc('get_monetization_overview');
  if (error) throw error;
  
  const overview = (stats && stats.length > 0) ? stats[0] : { total_revenue: 0 };
  const currentTotal = Number(overview.total_revenue) || 0;
  
  // 2. Determinar Meta Actual (Múltiplos x10)
  const currentTarget = METAS_VOLANTES.find(m => m > currentTotal) || 30000;
  const gap = currentTarget - currentTotal;
  const progressPercent = (currentTotal / currentTarget) * 100;

  // 3. Analizar Cumplimiento de Misiones Recientes para el Tono
  const { data: recentMissions } = await supabase
    .from('ai_missions')
    .select('status')
    .order('created_at', { ascending: false })
    .limit(5);

  const completedCount = recentMissions?.filter(m => m.status === 'completed').length || 0;
  
  // Lógica de Tono Híbrida solicitada por Wily:
  // Compañera Estratégica primero. Si ignora misiones ( < 40% cumplimiento), Militar.
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
    missions: recentNews?.map((n, i) => ({
      id: n.id,
      title: `Compartir en ${i === 0 ? 'TikTok' : i === 1 ? 'YouTube' : 'Instagram'}: ${n.title}`,
      type: i === 0 ? 'tiktok' : i === 1 ? 'youtube' : 'instagram',
      url: `https://neural-nexus.ai/news/${n.slug}`
    })) || []
  };

  if (tone === 'strategic_partner') {
    insights.message = `¡Wily! Estamos al ${progressPercent.toFixed(1)}% de nuestra meta volante de $${currentTarget}. Si mantenemos el rimo de publicaciones, llegaremos al target sin problemas. ¿Empezamos con el contenido de hoy?`;
  } else {
    insights.message = `¡COMANDANTE WILY! La maquinaria está perdiendo presión. Estamos a $${gap.toFixed(2)} de la meta volante y no veo misiones completadas. ¡Necesito que compartas estos links de inmediato para recuperar el terreno!`;
  }

  return insights;
}

/**
 * Función para generar enlaces de compartición rápida hacia el móvil
 */
export function generateShareLinks(title: string, url: string) {
  const text = encodeURIComponent(`Noticia Industrial: ${title}\n\nLeído en el Portal Neural Nexus 🚀\n${url}`);
  
  return {
    whatsapp: `https://api.whatsapp.com/send?text=${text}`,
    telegram: `https://t.me/share/url?url=${url}&text=${encodeURIComponent(title)}`
  };
}
