'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Heart, DollarSign } from 'lucide-react';
import { PayPalButtons } from "@paypal/react-paypal-js";
import { toast } from 'sonner';

import { useRouter, useParams } from 'next/navigation';

interface DonationBoxProps {
  compact?: boolean;
}

export function DonationBox({ compact = false }: DonationBoxProps) {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const [amount, setAmount] = useState<number>(10);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [rate, setRate] = useState<number>(0);

  const presets = [5, 10, 20, 50];

  useEffect(() => {
    fetch('/api/payments/rate')
      .then(res => res.json())
      .then(data => setRate(data.rate))
      .catch(err => console.error('Error fetching rate:', err));
  }, []);

  const handleNavigate = () => {
    router.push(`/${locale}/premium`);
  };

  const finalAmount = customAmount ? parseFloat(customAmount) : amount;
  const amountInCOP = rate ? Math.round(finalAmount * rate) : 0;

  if (compact) {
    return (
      <Card className="w-full border-white/5 bg-black/20 backdrop-blur-md overflow-hidden relative group">
        <CardHeader className="p-4 pb-0 relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="h-3 w-3 text-primary" />
            <CardTitle className="font-orbitron tracking-tighter text-[10px] uppercase text-muted-foreground">Donación Nexus</CardTitle>
          </div>
          <CardDescription className="text-[11px] leading-tight font-exo text-foreground/80">
            ¿Te gusta nuestro proyecto? ¿Quieres colaborar con nosotros? Haz una donación.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4 space-y-2 relative z-10">
          <Button 
            variant="outline"
            size="sm" 
            className="w-full h-8 text-[10px] font-black tracking-widest border-white/10 bg-white/5 hover:bg-primary/10 hover:border-primary/50 text-muted-foreground transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            onClick={handleNavigate}
          >
            SER PREMIUM 🚀
          </Button>
          
          <Button 
            variant="outline"
            size="sm" 
            className="w-full h-8 text-[10px] font-black tracking-widest border-white/10 bg-white/5 hover:bg-primary/10 hover:border-primary/50 text-muted-foreground transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            onClick={handleNavigate}
          >
            DONAR AHORA ❤️
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto border-primary/20 bg-card/50 backdrop-blur-md overflow-hidden relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <CardHeader className="text-center relative z-10">
        <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
          <Heart className="h-6 w-6 text-primary animate-pulse" />
        </div>
        <CardTitle className="font-orbitron tracking-tighter text-2xl">Impulsa Neural Nexus</CardTitle>
        <CardDescription className="font-exo">
          Tu apoyo directo vía PayPal nos permite mantener la infraestructura y seguir innovando.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 relative z-10">
        <div className="grid grid-cols-4 gap-2">
          {presets.map((preset) => (
            <Button
              key={preset}
              variant={amount === preset && !customAmount ? "default" : "outline"}
              onClick={() => {
                setAmount(preset);
                setCustomAmount('');
              }}
              className="font-bold"
            >
              ${preset}
            </Button>
          ))}
        </div>

        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="number"
            placeholder="Monto personalizado (USD)"
            className="pl-10 font-exo"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2 border p-3 rounded-xl bg-background/30 border-white/5">
          <Checkbox 
            id="anonymous" 
            checked={isAnonymous}
            onCheckedChange={(checked) => setIsAnonymous(checked === true)}
          />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="anonymous"
              className="text-sm font-bold uppercase tracking-widest leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Donación Anónima
            </label>
            <p className="text-xs text-muted-foreground">
              Tu nombre no aparecerá en el Muro de Honor público.
            </p>
          </div>
        </div>

        {rate > 0 && (
          <div className="text-center text-xs text-muted-foreground font-exo">
            Aproximadamente <span className="text-primary font-bold">
              {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(amountInCOP)}
            </span>
          </div>
        )}

        <div className="pt-2">
          <PayPalButtons
            style={{ 
              layout: 'vertical',
              color: 'gold',
              shape: 'rect',
              label: 'paypal'
            }}
            createOrder={(data, actions) => {
              return actions.order.create({
                intent: "CAPTURE",
                purchase_units: [
                  {
                    amount: {
                      currency_code: "USD",
                      value: finalAmount.toString(),
                    },
                    description: `Donación a Neural Nexus${isAnonymous ? ' (Anónima)' : ''}`
                  },
                ],
              });
            }}
            onApprove={async (data) => {
              try {
                const response = await fetch('/api/payments/paypal/capture', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    orderID: data.orderID,
                    isAnonymous: isAnonymous,
                    type: 'donation'
                  })
                });
                
                const result = await response.json();
                if (result.status === 'success') {
                  toast.success('¡Inyección de capital exitosa! Gracias por tu apoyo.');
                } else {
                  toast.error('Error al registrar el pago.');
                }
              } catch (err) {
                console.error('Capture error:', err);
                toast.error('Error en el puente de pago.');
              }
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
