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
} from "lucide-react";

export const primaryMenuItems = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/reels", label: "Reels", icon: Video },
  { href: "/categoria/modelos", label: "Modelos", icon: Brain },
  { href: "/categoria/herramientas", label: "Herramientas", icon: Wrench },
  { href: "/categoria/memes", label: "Memes", icon: Laugh },
  { href: "/categoria/papers", label: "Papers", icon: FileText },
  { href: "/categoria/drama", label: "Drama", icon: Drama },
];

export const destacadosItems = [
  { href: "/top5", label: "Top 5 del Día", icon: Sparkles, color: "text-neon-blue" },
];

export const userMenuItems = [
  { href: "/favoritos", label: "Mis Favoritos", icon: Heart },
  { href: "/perfil", label: "Mi Perfil", icon: User },
];
