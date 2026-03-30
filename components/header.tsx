"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, Menu, X, User, Heart, LogOut } from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
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

interface HeaderProps {
  onMenuClick?: () => void;
  showSidebarToggle?: boolean;
}

export function Header({ showSidebarToggle = true }: HeaderProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const { user: authUser, profile } = useAuth();
  
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
            <SheetContent side="left" className="w-72">
              <div className="flex flex-col gap-6 py-4">
                <Link href="/" className="flex items-center gap-2">
                  <Logo size={32} />
                </Link>
                <nav className="flex flex-col gap-2">
                  <NavLinks />
                </nav>
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
  const links = [
    { href: "/", label: "Inicio" },
    { href: "/categoria/modelos", label: "Modelos" },
    { href: "/categoria/herramientas", label: "Herramientas" },
    { href: "/categoria/memes", label: "Memes" },
    { href: "/categoria/papers", label: "Papers" },
    { href: "/categoria/drama", label: "Drama" },
    { href: "/top5", label: "Top 5" },
  ];

  return (
    <>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-accent transition-colors"
        >
          {link.label}
        </Link>
      ))}
    </>
  );
}
