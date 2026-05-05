"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Wrench,
  FileText,
  LogOut,
  Video,
  Zap,
  Handshake,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { getSupabaseBrowserClient } from "@/lib/supabase-client";
import { primaryMenuItems, destacadosItems, userMenuItems, legalMenuItems } from "@/lib/nav-config";
import { MissionWidget } from "@/components/mission-widget";
import { DonationBox } from "@/components/payment/donation-box";
import { calculateUserRank } from "@/lib/user-rankings";

interface SidebarProps {
  isLoggedIn?: boolean;
  user?: {
    nickname: string;
    avatar_url?: string;
    is_premium?: boolean;
    share_count?: number;
  } | null;
  onLogout?: () => void;
}


export function Sidebar({ isLoggedIn: manualIsLoggedIn, user: manualUser, onLogout: manualOnLogout }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');
  const { user: authUser, profile, isLoggedIn: authIsLoggedIn, isPremium: authIsPremium } = useAuth();

  const isLoggedIn = manualIsLoggedIn !== undefined ? manualIsLoggedIn : authIsLoggedIn;
  
  const user = manualUser || (isLoggedIn ? { 
    nickname: profile?.nickname || authUser?.user_metadata?.nickname || authUser?.email?.split("@")[0] || "usuario", 
    avatar_url: profile?.avatar_url || authUser?.user_metadata?.avatar_url || undefined, 
    is_premium: authIsPremium,
    share_count: profile?.share_count || 0
  } : null);

  // Calcular rango industrial
  const userRank = calculateUserRank(
    user?.is_premium,
    user?.share_count,
    0 // TODO: Integrar totalDonated real en el futuro
  );
  
  const handleLogout = async () => {
    if (manualOnLogout) {
      manualOnLogout();
    } else {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) return;
      await supabase.auth.signOut();
      window.location.href = "/";
    }
  };

  return (
    <aside className="fixed left-0 top-16 z-40 hidden h-[calc(100vh-4rem)] w-64 flex-col border-r bg-background md:flex">
      {/* Navigation */}
      <nav className="flex-1 overflow-auto py-4 px-3">
        <div className="space-y-1">
          {primaryMenuItems.map((item) => {
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
          {destacadosItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  isActive
                    ? "bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 text-foreground border border-neon-blue/30"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <Icon className={cn("h-4 w-4", item.color)} />
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Favorites (solo si está logueado) */}
        {isLoggedIn && (
          <div className="mt-6">
            <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Mi cuenta
            </p>
            {userMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all mb-1 last:mb-0",
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
        )}

        {/* Gobernanza */}
        <div className="mt-6">
          <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Gobernanza
          </p>
          {legalMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

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

        {/* Administración (Solo para Admins) */}
        {profile?.role === "admin" && (
          <div className="mt-6">
            <p className="px-3 text-xs font-semibold text-neon-blue uppercase tracking-wider mb-2 flex items-center gap-2">
              <Wrench className="h-3 w-3" />
              Administración
            </p>
            <Link
              href="/admin/missions"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all mb-1",
                pathname === "/admin/missions"
                  ? "bg-neon-blue/20 text-neon-blue border border-neon-blue/30"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <Zap className="h-4 w-4" />
              Control de Misiones 💋
            </Link>
            <Link
              href="/admin/leads"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all mb-1",
                pathname === "/admin/leads"
                  ? "bg-neon-blue/20 text-neon-blue border border-neon-blue/30"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <Handshake className="h-4 w-4" />
              Vigilancia de Alianzas 🤝
            </Link>
            <Link
              href="/admin/hunter"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all mb-1",
                pathname === "/admin/hunter"
                  ? "bg-neon-blue/20 text-neon-blue border border-neon-blue/30"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <Target className="h-4 w-4" />
              Cacería de Campo 🎯
            </Link>
            <Link
              href="/admin/monitor?tab=reception"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all mb-1",
                pathname === "/admin/monitor" && tab !== "reels"
                  ? "bg-neon-blue/20 text-neon-blue border border-neon-blue/30"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <FileText className="h-4 w-4" />
              Log de Recepción 📡
            </Link>
            <Link
              href="/admin/monitor?tab=reels"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                pathname === "/admin/monitor" && tab === "reels"
                  ? "bg-neon-purple/20 text-neon-purple border border-neon-purple/30"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <Video className="h-4 w-4" />
              Depurar Reels 🎬
            </Link>
          </div>
        )}

        <MissionWidget />
      </nav>

      <Separator />

      {/* Bottom section */}
      <div className="p-4 space-y-4">
        {/* DonationBox (Compacta por Beatriz) */}
        {!user?.is_premium ? (
          <DonationBox compact />
        ) : (
          <div className="p-3 rounded-lg bg-neon-purple/5 border border-neon-purple/20">
            <p className="text-[10px] text-neon-purple uppercase font-black tracking-widest text-center">
              🚀 Portal de Élite Activo
            </p>
          </div>
        )}

        {/* User section */}
        {isLoggedIn && user && (
          <div className="flex items-center gap-3 rounded-lg border p-3 bg-secondary/20">
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
              <p className={cn("text-[9px] tracking-tighter", userRank.className)}>
                {userRank.title}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:text-destructive transition-colors"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </aside>
  );
}
