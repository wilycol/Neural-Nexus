'use client';

import React, { useEffect, useState } from 'react';
import { Trophy, Star, Heart, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getSupabaseBrowserClient } from '@/lib/supabase-client';
import type { Database } from '@/types/database';
import type { SupabaseClient } from '@supabase/supabase-js';
import { cn } from '@/lib/utils';

interface Donation {
  id: string;
  user_id: string | null;
  donor_name: string;
  amount: number;
  currency: string;
  comment: string | null;
  created_at: string;
}

export function HonorWall() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [supabase, setSupabase] = useState<SupabaseClient<Database> | null>(null);

  useEffect(() => {
    setSupabase(getSupabaseBrowserClient());
  }, []);

  useEffect(() => {
    if (!supabase) return;
    async function fetchDonations() {
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(20);

      if (!error && data) {
        setDonations(data);
      }
      setLoading(false);
    }

    fetchDonations();

    // Suscripción en tiempo real opcional para que el muro se actualice solo
    const channel = supabase
      .channel('public_donations')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'donations' }, (payload) => {
        if (payload.new.is_public) {
          setDonations((prev) => [payload.new as Donation, ...prev].slice(0, 20));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 rounded-xl bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-orbitron font-bold tracking-tight flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Muro de Honor
          </h2>
          <p className="text-muted-foreground text-sm font-exo">
            Aquellos que impulsan la evolución de Neural Nexus
          </p>
        </div>
      </div>

      {donations.length === 0 ? (
        <Card className="border-dashed border-primary/20 bg-primary/5">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Heart className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <p className="text-lg font-medium text-muted-foreground">Sé el primero en aparecer aquí</p>
            <p className="text-sm text-muted-foreground/60">Tu apoyo hace posible nuestra misión</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {donations.map((donation, index) => (
            <DonationItem key={donation.id} donation={donation} index={index} />
          ))}
        </div>
      )}
    </section>
  );
}

function DonationItem({ donation, index }: { donation: Donation, index: number }) {
  // Animación suave basada en el índice
  const isTopDonor = index < 3;
  
  return (
    <Card className={cn(
      "relative overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98]",
      isTopDonor ? "border-primary/40 bg-primary/5" : "border-border/50 bg-card/30"
    )}>
      {isTopDonor && (
        <div className="absolute -right-2 -top-2">
           <Star className="h-12 w-12 text-yellow-500/20 rotate-12 fill-current" />
        </div>
      )}
      
      <CardHeader className="p-4 pb-0 flex flex-row items-center gap-3 space-y-0">
        <div className={cn(
          "h-10 w-10 rounded-full flex items-center justify-center border",
          isTopDonor ? "bg-primary/20 border-primary/40" : "bg-muted border-border"
        )}>
          <User className="h-5 w-5" />
        </div>
        <div className="flex flex-col">
          <CardTitle className="text-sm font-bold truncate max-w-[150px]">
            {donation.donor_name}
          </CardTitle>
          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
            {new Date(donation.created_at).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })}
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-3">
        {donation.comment && (
          <p className="text-sm italic text-foreground/70 line-clamp-2 mb-2">
            &quot;{donation.comment}&quot;
          </p>
        )}
        <div className="flex items-center justify-between mt-auto">
          <div className="text-xs font-exo font-bold text-primary px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
            {donation.amount} {donation.currency}
          </div>
          {isTopDonor && (
            <span className="text-[10px] bg-yellow-500/10 text-yellow-500 font-bold px-2 py-0.5 rounded-full">
              Pionero
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
