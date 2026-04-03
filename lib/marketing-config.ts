/**
 * Lógica de Marketing de Beatriz: Alternancia de Tonos
 * Implementa la decisión del usuario de rotar entre:
 * Impacto Viral (Odd / Impar) vs Autoridad Estratégica (Even / Par)
 */

export type MarketingTone = "VIRAL_CYBERPUNK" | "AUTHORITY_STRATEGIC";

export interface MarketingGoal {
  tone: MarketingTone;
  prompt_modifier: string;
  visual_style: string;
}

export function getDailyMarketingGoal(): MarketingGoal {
  const dayOfMonth = new Date().getDate();
  const isOdd = dayOfMonth % 2 !== 0;

  if (isOdd) {
    return {
      tone: "VIRAL_CYBERPUNK",
      prompt_modifier: "Genera un copy impactante, disruptivo, lleno de energía cyberpunk. Usa muchos emojis de neón y CTAs urgentes.",
      visual_style: "Colores neón intensos, fallos visuales (glitch), ritmo rápido, estética futurista agresiva.",
    };
  }

  return {
    tone: "AUTHORITY_STRATEGIC",
    prompt_modifier: "Genera un copy informativo, con lenguaje estratégico y tono de autoridad técnica. Enfócate en el valor y los datos.",
    visual_style: "Diseño limpio, tipografía elegante, colores sobrios, transiciones suaves, estética de 'Elite Tech'.",
  };
}
