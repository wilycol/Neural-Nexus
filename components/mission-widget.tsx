"use client";

import React, { useEffect, useState } from "react";
import { Trophy, Target, TrendingUp, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getSupabaseBrowserClient } from "@/lib/supabase";

interface MonthlyStats {
  monthly_views: number;
  monthly_revenue: number;
}

export function MissionWidget() {
  const [stats, setStats] = useState<MonthlyStats | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const GOALS = [
    { name: "Fundacional", amount: 100 },
    { name: "Expansión", amount: 500 },
    { name: "Cluster Independencia", amount: 1000 }
  ];

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const supabase = getSupabaseBrowserClient();
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) return;

        const { data: user } = await supabase
          .from("users")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (user?.role === "admin") {
          setIsAdmin(true);
          fetchStats();
        }
      } catch {
        // Fallback silencioso
      } finally {
        setLoading(false);
      }
    };

    const fetchStats = async () => {
      try {
        const res = await fetch("/api/stats/monthly");
        const json = await res.json();
        if (json.data) setStats(json.data);
      } catch {
        // Fallback
      }
    };

    checkAdmin();
  }, []);

  if (loading || !isAdmin || !stats) return null;

  // Encontrar el objetivo actual
  const currentGoal = GOALS.find(g => stats.monthly_revenue < g.amount) || GOALS[GOALS.length - 1];
  const progress = Math.min((stats.monthly_revenue / currentGoal.amount) * 100, 100);

  return (
    <div className="px-4 py-2 space-y-4 animate-in fade-in slide-in-from-left-4 duration-700">
      <div className="flex items-center gap-2 px-2 text-neon-purple">
        <ShieldCheck className="h-4 w-4" />
        <span className="text-[10px] uppercase tracking-[0.3em] font-orbitron font-bold">Misión Crítica</span>
      </div>

      <Card className="bg-card/20 backdrop-blur-xl border-neon-purple/30 overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/5 to-transparent opacity-50" />
        
        <CardContent className="p-4 space-y-4 relative z-10">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Objetivo Actual</p>
              <h4 className="text-sm font-bold text-white font-orbitron truncate max-w-[120px]">
                {currentGoal.name}
              </h4>
            </div>
            <div className="p-2 rounded-lg bg-neon-purple/10 border border-neon-purple/20 text-neon-purple">
              <Target className="h-4 w-4" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-mono">
              <span className="text-muted-foreground">PROGRESO MENSUAL</span>
              <span className="text-neon-purple font-bold">{progress.toFixed(1)}%</span>
            </div>
            
            {/* Custom Progress Bar */}
            <div className="h-1.5 w-full bg-muted/30 rounded-full overflow-hidden border border-white/5">
              <div 
                className="h-full bg-gradient-to-r from-neon-purple via-purple-400 to-neon-blue shadow-[0_0_10px_rgba(168,85,247,0.5)] transition-all duration-1000 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex justify-between items-baseline mt-1">
              <span className="text-[10px] text-muted-foreground">META: ${currentGoal.amount}</span>
              <div className="text-right">
                <span className="text-xs font-bold text-white font-mono">${stats.monthly_revenue.toFixed(2)}</span>
                <span className="text-[8px] text-muted-foreground block">USD ESTIMADO</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="h-3 w-3 text-green-400" />
              <span className="text-[9px] text-muted-foreground uppercase tracking-tighter">Motor Beatriz Activo</span>
            </div>
            <Trophy className={`h-3 w-3 ${progress >= 100 ? 'text-yellow-400 animate-bounce' : 'text-muted-foreground opacity-30'}`} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
