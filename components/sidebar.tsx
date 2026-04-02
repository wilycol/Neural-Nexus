"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Home,
  Brain,
  Wrench,
  Laugh,
  FileText,
  Drama,
  Crown,
  Heart,
  User,
  LogOut,
  Sparkles,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { getSupabaseBrowserClient } from "@/lib/supabase-client";

interface SidebarProps {
  isLoggedIn?: boolean;
  user?: {
    nickname: string;
    avatar_url?: string;
    is_premium?: boolean;
  } | null;
  onLogout?: () => void;
}

const menuItems = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/reels", label: "Reels", icon: Video },
  { href: "/categoria/modelos", label: "Modelos", icon: Brain },
  { href: "/categoria/herramientas", label: "Herramientas", icon: Wrench },
  { href: "/categoria/memes", label: "Memes", icon: Laugh },
  { href: "/categoria/papers", label: "Papers", icon: FileText },
  { href: "/categoria/drama", label: "Drama", icon: Drama },
];

export function Sidebar({ isLoggedIn: manualIsLoggedIn, user: manualUser, onLogout: manualOnLogout }: SidebarProps) {
  const pathname = usePathname();
  const { user: authUser, profile, isLoggedIn: authIsLoggedIn, isPremium: authIsPremium } = useAuth();

  const isLoggedIn = manualIsLoggedIn !== undefined ? manualIsLoggedIn : authIsLoggedIn;
  
  const user = manualUser || (isLoggedIn ? { 
    nickname: profile?.nickname || authUser?.user_metadata?.nickname || authUser?.email?.split("@")[0] || "usuario", 
    avatar_url: profile?.avatar_url || authUser?.user_metadata?.avatar_url || undefined, 
    is_premium: authIsPremium 
  } : null);
  
  const handleLogout = async () => {
    if (manualOnLogout) {
      manualOnLogout();
    } else {
      const supabase = getSupabaseBrowserClient();
      await supabase.auth.signOut();
      window.location.href = "/";
    }
  };

  return (
    <aside className="fixed left-0 top-16 z-40 hidden h-[calc(100vh-4rem)] w-64 flex-col border-r bg-background md:flex">
      {/* Navigation */}
      <nav className="flex-1 overflow-auto py-4 px-3">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Top 5 section */}
        <div className="mt-6">
          <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Destacados
          </p>
          <Link
            href="/top5"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
              pathname === "/top5"
                ? "bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 text-foreground border border-neon-blue/30"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            <Sparkles className="h-4 w-4 text-neon-blue" />
            Top 5 del Día
          </Link>
        </div>

        {/* Favorites (solo si está logueado) */}
        {isLoggedIn && (
          <div className="mt-6">
            <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Mi cuenta
            </p>
            <Link
              href="/favoritos"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                pathname === "/favoritos"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <Heart className="h-4 w-4" />
              Mis Favoritos
            </Link>
            <Link
              href="/perfil"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all mt-1",
                pathname === "/perfil"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <User className="h-4 w-4" />
              Mi Perfil
            </Link>
          </div>
        )}

        {/* Administración (Solo para Admins) */}
        {profile?.role === "admin" && (
          <div className="mt-6">
            <p className="px-3 text-xs font-semibold text-neon-blue uppercase tracking-wider mb-2 flex items-center gap-2">
              <Wrench className="h-3 w-3" />
              Administración
            </p>
            <Link
              href="/api/admin/debug-latest-post"
              target="_blank"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <FileText className="h-4 w-4" />
              Log de Recepción
            </Link>
            <Link
              href="/api/admin/debug-latest-post?limit=10"
              target="_blank"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <Video className="h-4 w-4" />
              Depurar Reels
            </Link>
          </div>
        )}
      </nav>

      <Separator />

      {/* Bottom section */}
      <div className="p-4 space-y-4">
        {/* Premium button */}
        {!user?.is_premium && (
          <div className="rounded-lg bg-gradient-to-r from-neon-blue/10 to-neon-purple/10 border border-neon-blue/20 p-3">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="h-4 w-4 text-neon-purple" />
              <span className="text-sm font-medium">Premium</span>
            </div>
            <p className="text-xs text-muted-foreground mb-2">
              Sin anuncios y contenido exclusivo
            </p>
            <Button size="sm" className="w-full text-xs bg-gradient-to-r from-neon-blue to-neon-purple text-white hover:opacity-90" asChild>
              <Link href="/premium">$4/mes</Link>
            </Button>
          </div>
        )}

        {/* User section */}
        {isLoggedIn && user ? (
          <div className="flex items-center gap-3 rounded-lg border p-3">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center text-white text-xs font-bold overflow-hidden shrink-0">
              {user.avatar_url ? (
                <Image 
                  src={user.avatar_url} 
                  alt={user.nickname} 
                  width={32} 
                  height={32} 
                  className="h-full w-full object-cover" 
                />
              ) : (
                user.nickname.slice(0, 2).toUpperCase()
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.nickname}</p>
              {user.is_premium && (
                <p className="text-xs text-neon-purple flex items-center gap-1">
                  <Crown className="h-3 w-3" />
                  Premium
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full"
              asChild
            >
              <Link href="/login">Iniciar sesión</Link>
            </Button>
            <Button
              className="w-full bg-gradient-to-r from-neon-blue to-neon-purple text-white hover:opacity-90"
              asChild
            >
              <Link href="/registro">Crear cuenta</Link>
            </Button>
          </div>
        )}
      </div>
    </aside>
  );
}
