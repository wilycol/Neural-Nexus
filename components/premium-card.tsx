"use client";

import React from "react";
import Link from "next/link";
import { Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PremiumCardProps {
  className?: string;
}

export function PremiumCard({ className }: PremiumCardProps) {
  return (
    <div className={cn(
      "rounded-lg bg-gradient-to-r from-neon-blue/10 to-neon-purple/10 border border-neon-blue/20 p-3",
      className
    )}>
      <div className="flex items-center gap-2 mb-2">
        <Crown className="h-4 w-4 text-neon-purple" />
        <span className="text-sm font-medium">Premium</span>
      </div>
      <p className="text-xs text-muted-foreground mb-2">
        Sin anuncios y contenido exclusivo
      </p>
      <Button 
        size="sm" 
        className="w-full text-xs bg-gradient-to-r from-neon-blue to-neon-purple text-white hover:opacity-90" 
        asChild
      >
        <Link href="/premium">$4/mes</Link>
      </Button>
    </div>
  );
}
