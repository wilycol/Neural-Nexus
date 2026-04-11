/**
 * Beatriz AI Shared: Constantes y Tipos seguros para el cliente y servidor.
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
