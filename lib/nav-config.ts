import {
  Home,
  Brain,
  Wrench,
  Laugh,
  FileText,
  Drama,
  Sparkles,
  Video,
  Heart,
  User,
  Info,
  Scale,
  Shield,
  Cookie,
  Code2,
  Presentation,
  Zap,
  Trash2,
  Trophy,
} from "lucide-react";

export const primaryMenuItems = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/reels", label: "Reels", icon: Video },
  { href: "/categoria/modelos", label: "Modelos", icon: Brain },
  { href: "/categoria/herramientas", label: "Herramientas", icon: Wrench },
  { href: "/categoria/memes", label: "Memes", icon: Laugh },
  { href: "/categoria/papers", label: "Papers", icon: FileText },
  { href: "/categoria/drama", label: "Drama", icon: Drama },
  { href: "/creditos", label: "Créditos", icon: Info },
  { href: "/developers", label: "Desarrolladores", icon: Code2 },
];

export const destacadosItems = [
  { href: "/muro-de-la-fama", label: "Muro de la Fama", icon: Trophy, color: "text-amber-500" },
  { href: "/top5", label: "Top 5 del Día", icon: Sparkles, color: "text-neon-blue" },
  { href: "/kitsune-ads", label: "Kitsune AI ADS", icon: Video, color: "text-amber-400" },
  { href: "/pitch", label: "Pitch Técnico", icon: Presentation, color: "text-neon-purple" },
  { href: "/neural-sites", label: "Neural Sites SaaS", icon: Zap, color: "text-neon-blue" },
];

export const userMenuItems = [
  { href: "/favoritos", label: "Mis Favoritos", icon: Heart },
  { href: "/perfil", label: "Mi Perfil", icon: User },
];

export const legalMenuItems = [
  { href: "/legal/terminos", label: "Términos", icon: Scale },
  { href: "/legal/privacidad", label: "Privacidad", icon: Shield },
  { href: "/legal/cookies", label: "Cookies", icon: Cookie },
  { href: "/legal/eliminacion-de-datos", label: "Eliminar Datos", icon: Trash2 },
];
