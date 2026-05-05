"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, Menu, X, User, Heart, LogOut, Wrench, Zap, Handshake, Target, FileText } from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { getBadgeInfo } from "@/lib/utils";

import { useAuth } from "@/hooks/use-auth";
import { primaryMenuItems, destacadosItems, userMenuItems } from "@/lib/nav-config";
import { PremiumCard } from "@/components/premium-card";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface HeaderProps {
  onMenuClick?: () => void;
  showSidebarToggle?: boolean;
}

export function Header({ showSidebarToggle = true }: HeaderProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const { user: authUser, profile, role } = useAuth();
  
  const userNickname = profile?.nickname || authUser?.user_metadata?.nickname || authUser?.email?.split("@")[0] || null;
  const userAvatar = profile?.avatar_url || authUser?.user_metadata?.avatar_url || null;
  const badge = getBadgeInfo(profile?.credits || 0);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/buscar?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 font-orbitron">
      <div className="flex h-16 items-center gap-4 px-4 md:px-6">
        {/* Sidebar toggle (mobile) */}
        {showSidebarToggle && (
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 flex flex-col">
              <div className="flex items-center gap-2 py-4 border-b">
                <Logo size={32} />
                <span className="font-orbitron font-bold text-lg tracking-tighter bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
                  NEURAL NEXUS
                </span>
              </div>
              
              <div className="flex-1 overflow-y-auto py-6">
                <nav className="flex flex-col gap-4">
                  <div className="space-y-1">
                    <p className="px-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 mb-2">
                      Navegación
                    </p>
                    <NavLinks />
                  </div>

                  {!profile?.is_premium && (
                    <div className="px-2 mt-4">
                      <PremiumCard />
                    </div>
                  )}

                  {userNickname && (
                    <div className="mt-6 space-y-1">
                      <p className="px-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 mb-2">
                        Mi Cuenta
                      </p>
                      {userMenuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md hover:bg-accent transition-colors"
                          >
                            <Icon className="h-4 w-4 text-muted-foreground" />
                            {item.label}
                          </Link>
                        );
                      })}
                      <Link
                        href="/chat"
                        className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md bg-neon-purple/10 text-neon-purple border border-neon-purple/20 hover:bg-neon-purple/20 transition-colors"
                      >
                        <Heart className="h-4 w-4 fill-neon-purple" />
                        Hablar con Beatriz 💋
                      </Link>
                      <button
                        onClick={async () => {
                          const supabase = getSupabaseBrowserClient();
                          if (!supabase) return;
                          await supabase.auth.signOut();
                          window.location.href = "/";
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md text-red-500 hover:bg-red-500/10 transition-colors mt-2"
                      >
                        <LogOut className="h-4 w-4" />
                        Cerrar sesión
                      </button>
                    </div>
                  )}

                  {(role === "admin" || profile?.role === "admin" || userNickname?.toLowerCase().includes("wily") || authUser?.email?.toLowerCase().includes("wilycol")) && (
                    <div className="mt-6 space-y-1">
                      <p className="px-3 text-[10px] font-black uppercase tracking-widest text-neon-blue mb-2 flex items-center gap-2">
                        <Wrench className="h-3 w-3" /> Administración
                      </p>
                      <Link href="/admin/missions" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md hover:bg-accent transition-colors">
                        <Zap className="h-4 w-4 text-neon-blue" /> Control de Misiones 💋
                      </Link>
                      <Link href="/admin/hunter" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md hover:bg-accent transition-colors">
                        <Target className="h-4 w-4 text-neon-blue" /> Cacería de Campo 🎯
                      </Link>
                      <Link href="/admin/leads" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md hover:bg-accent transition-colors">
                        <Handshake className="h-4 w-4 text-neon-blue" /> Vigilancia de Alianzas 🤝
                      </Link>
                      <Link href="/admin/monitor?tab=reception" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md hover:bg-accent transition-colors">
                        <FileText className="h-4 w-4 text-neon-blue" /> Log de Recepción 📡
                      </Link>
                    </div>
                  )}

                  {!userNickname && (
                    <div className="mt-8 px-2 flex flex-col gap-2">
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/login">Iniciar Sesión</Link>
                      </Button>
                      <Button className="w-full bg-gradient-to-r from-neon-blue to-neon-purple text-white" asChild>
                        <Link href="/registro">Crear Cuenta</Link>
                      </Button>
                    </div>
                  )}
                </nav>
              </div>

              <div className="mt-auto pt-4 border-t pb-4 text-center">
                <p className="text-[10px] text-muted-foreground/40 uppercase tracking-[0.2em] font-orbitron">
                  Neural Nexus v2.0
                </p>
              </div>
            </SheetContent>
          </Sheet>
        )}

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Logo size={36} />
        </Link>

        {/* Search bar (desktop) */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 max-w-md mx-auto font-sans"
        >
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar noticias..."
              className="w-full pl-10 bg-muted"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>

        {/* Right section */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Mobile search toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            {isSearchOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Search className="h-5 w-5" />
            )}
            <span className="sr-only">Buscar</span>
          </Button>

          {/* Theme toggle */}
          <ThemeToggle />

          {/* Language Switcher */}
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>

          {/* Identity Alignment Badge (Subtle) */}
          <div className="hidden lg:flex items-center gap-2 px-2 py-1 rounded-full bg-neon-blue/5 border border-neon-blue/20 animate-pulse-slow">
            <div className="h-1.5 w-1.5 rounded-full bg-neon-blue shadow-[0_0_5px_rgba(0,243,255,0.8)]" />
            <span className="text-[9px] font-black uppercase tracking-tighter text-neon-blue/70">
              Elite Protocol: Active
            </span>
          </div>

          {userNickname ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 px-3 py-1.5 h-auto">
                  <div className="h-7 w-7 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center text-white text-xs border border-white/20 shadow-sm overflow-hidden">
                    {userAvatar ? (
                      <Image 
                        src={userAvatar} 
                        alt={userNickname} 
                        width={28} 
                        height={28} 
                        className="h-full w-full object-cover" 
                      />
                    ) : (
                      userNickname.slice(0, 2).toUpperCase()
                    )}
                  </div>
                  <div className="flex flex-col items-start leading-none">
                    <span className="text-sm font-bold truncate max-w-[100px]">@{userNickname}</span>
                    <span className={`text-[9px] uppercase tracking-tighter font-black ${badge.color}`}>
                      {badge.name}
                    </span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/perfil" className="gap-2">
                    <User className="h-4 w-4" />
                    Mi perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/favoritos" className="gap-2">
                    <Heart className="h-4 w-4" />
                    Favoritos
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={async () => {
                    try {
                      const supabase = getSupabaseBrowserClient();
                      if (!supabase) return;
                      await supabase.auth.signOut();
                      window.location.href = "/";
                    } catch {}
                  }}
                  className="gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="default"
              size="sm"
              className="hidden sm:inline-flex bg-gradient-to-r from-neon-blue to-neon-purple text-white hover:opacity-90"
              asChild
            >
              <Link href="/login">Entrar</Link>
            </Button>
          )}
        </div>
      </div>

      {/* Mobile search bar */}
      {isSearchOpen && (
        <div className="md:hidden border-t px-4 py-3">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar noticias..."
              className="w-full pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </form>
        </div>
      )}
    </header>
  );
}

function NavLinks() {
  return (
    <>
      {primaryMenuItems.map((link) => {
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md hover:bg-accent transition-colors"
          >
            <Icon className="h-4 w-4 text-muted-foreground" />
            {link.label}
          </Link>
        );
      })}
      
      <div className="my-3 px-3">
        <Separator className="opacity-20" />
      </div>

      {destacadosItems.map((link) => {
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md hover:bg-accent transition-colors"
          >
            <Icon className={cn("h-4 w-4", link.color)} />
            {link.label}
          </Link>
        );
      })}
    </>
  );
}
