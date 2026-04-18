'use client';

import React, { useEffect, useState } from 'react';
import { Check, Zap, Globe, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getUSDToCOP, formatCOP, ExchangeRate } from '@/lib/payments/rate';
import { cn } from '@/lib/utils';

interface SubscriptionCardProps {
  onSubscribe: (method: 'wompi' | 'binance') => void;
  className?: string;
}

export function SubscriptionCard({ onSubscribe, className }: SubscriptionCardProps) {
  const [exchangeRate, setExchangeRate] = useState<ExchangeRate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRate() {
      const rate = await getUSDToCOP();
      setExchangeRate(rate);
      setLoading(false);
    }
    loadRate();
  }, []);

  const priceUSD = 4.0;
  const copPriceFormatted = exchangeRate 
    ? formatCOP(priceUSD, exchangeRate.rate) 
    : 'Cargando...';

  return (
    <Card className={cn(
      "relative overflow-hidden border-primary/20 bg-card/50 backdrop-blur-xl transition-all hover:border-primary/40 group",
      "before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/10 before:to-purple-500/10 before:opacity-0 before:transition-opacity hover:before:opacity-100 before:pointer-events-none",
      className
    )}>
      {/* Badge de "Más Popular" o "Cyberpunk" */}
      <div className="absolute top-4 right-4 z-10">
        <span className="flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-foreground animate-pulse">
          <Zap className="h-3 w-3 fill-current" />
          Acceso Total
        </span>
      </div>

      <CardHeader className="text-center pb-2 relative z-10">
        <CardTitle className="font-orbitron text-2xl tracking-tight gradient-text">
          Nexus Premium
        </CardTitle>
        <CardDescription className="font-exo text-sm font-medium">
          Impulsa tu conocimiento con inteligencia industrial
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 pt-4 relative z-10">
        <div className="flex flex-col items-center justify-center space-y-1">
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-black tracking-tighter">$4.00</span>
            <span className="text-muted-foreground font-medium uppercase text-xs">USD / Mes</span>
          </div>
          
          <div className={cn(
            "text-sm font-semibold text-primary transition-opacity duration-500",
            loading ? "opacity-0" : "opacity-100"
          )}>
             ≈ {copPriceFormatted} COP
          </div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
            Tasa de cambio actualizada hoy
          </p>
        </div>

        <div className="space-y-3 pt-4">
          <FeatureItem text="Navegación sin anuncios" />
          <FeatureItem text="Contenido 'Deep-Tech' exclusivo" />
          <FeatureItem text="Acceso anticipado a Video Reels" />
          <FeatureItem text="Badge de Colaborador IA" />
          <FeatureItem text="Soporte prioritario" />
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 pt-6 relative z-10">
        <Button 
          onClick={() => onSubscribe('wompi')}
          className="w-full font-bold h-12 bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_15px_-3px_rgba(0,0,0,0.1)] transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Globe className="mr-2 h-4 w-4" />
          Pagar con Tarjeta de Crédito o Débito
        </Button>
        
        <Button 
          variant="outline"
          onClick={() => onSubscribe('binance')}
          className="w-full font-bold h-12 border-primary/20 hover:bg-primary/5 transition-all"
        >
          <ShieldCheck className="mr-2 h-4 w-4" />
          Pagar con Binance (Crypto)
        </Button>

        <p className="text-[9px] text-center text-muted-foreground uppercase tracking-tighter px-4 mt-2">
          Al suscribirte, aceptas nuestros términos de servicio. Cancelación fácil en cualquier momento.
        </p>
      </CardFooter>
    </Card>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Check className="h-3 w-3" />
      </div>
      <span className="text-sm font-medium leading-tight text-foreground/80">{text}</span>
    </div>
  );
}
