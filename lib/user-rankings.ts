/**
 * 🏆 Sistema de Rangos y Títulos de Neural Nexus
 * Diseñado por Beatriz para incentivar la participación industrial.
 */

export interface UserRank {
  title: string;
  color: string;
  className: string;
  icon?: string;
}

export function calculateUserRank(
  isPremium: boolean = false,
  shareCount: number = 0,
  totalDonated: number = 0
): UserRank {
  // 1. El Mecenas Élite (Máxima distinción)
  if (totalDonated >= 50) {
    return {
      title: "Mecenas Élite",
      color: "#FFD700", // Gold
      className: "text-[#FFD700] drop-shadow-[0_0_8px_rgba(255,215,0,0.5)] font-black uppercase italic"
    };
  }

  // 2. Mecenas Nexus (Al menos una donación)
  if (totalDonated > 0) {
    return {
      title: "Mecenas Nexus",
      color: "#A855F7", // Purple Neón
      className: "text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)] font-bold uppercase"
    };
  }

  // 3. Suscriptor Premium
  if (isPremium) {
    return {
      title: "Explorador Élite",
      color: "#00A3FF", // Neon Blue
      className: "text-neon-blue font-bold uppercase"
    };
  }

  // 4. Difusor Neural (Mucha interacción)
  if (shareCount >= 10) {
    return {
      title: "Difusor Neural",
      color: "#10B981", // Emerald
      className: "text-emerald-400 font-medium uppercase"
    };
  }

  // 5. Rango Base: Novato IA
  return {
    title: "Novato IA",
    color: "#64748B", // Slate
    className: "text-slate-500 font-medium uppercase text-[10px]"
  };
}
