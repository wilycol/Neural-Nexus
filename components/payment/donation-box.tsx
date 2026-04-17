'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Heart, Coins, CreditCard, DollarSign } from 'lucide-react';
import { PaymentModal } from './payment-modal';
import { PayPalButtons } from "@paypal/react-paypal-js";
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface DonationBoxProps {
  compact?: boolean;
}

export function DonationBox({ compact = false }: DonationBoxProps) {
  const [amount, setAmount] = useState<number>(10);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [method, setMethod] = useState<'wompi' | 'binance' | 'paypal' | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rate, setRate] = useState<number>(0);

  const presets = [5, 10, 20, 50];

  useEffect(() => {
    fetch('/api/payments/rate')
      .then(res => res.json())
      .then(data => setRate(data.rate))
      .catch(err => console.error('Error fetching rate:', err));
  }, []);

  const handleDonate = (selectedMethod: 'wompi' | 'binance') => {
    setMethod(selectedMethod);
    setIsModalOpen(true);
  };

  const finalAmount = customAmount ? parseFloat(customAmount) : amount;
  const amountInCOP = rate ? Math.round(finalAmount * rate) : 0;

  if (compact) {
    return (
      <Card className="w-full border-neon-blue/20 bg-black/40 backdrop-blur-xl overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/5 to-transparent opacity-50 pointer-events-none" />
        
        <CardHeader className="p-4 pb-2 relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <Heart className="h-4 w-4 text-primary animate-pulse" />
            <CardTitle className="font-orbitron tracking-tighter text-sm uppercase">Apoyo Nexus</CardTitle>
          </div>
          <CardDescription className="text-[10px] leading-tight">
            Impulsa nuestra infraestructura de IA.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4 pt-0 space-y-3 relative z-10">
          <div className="grid grid-cols-4 gap-1">
            {presets.map((preset) => (
              <button
                key={preset}
                onClick={() => {
                  setAmount(preset);
                  setCustomAmount('');
                }}
                className={cn(
                  "py-1 rounded-md text-[10px] font-bold border transition-all",
                  amount === preset && !customAmount 
                    ? "bg-primary text-primary-foreground border-primary" 
                    : "bg-background/50 border-white/5 text-muted-foreground hover:border-white/20"
                )}
              >
                ${preset}
              </button>
            ))}
          </div>

          <div className="relative">
            <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
            <input
              type="number"
              placeholder="Otro"
              className="w-full bg-background/50 border border-white/5 rounded-md py-1 pl-6 pr-2 text-[10px] outline-none focus:border-primary/50 transition-all font-exo"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2 py-1">
            <Checkbox 
              id="anonymous-compact" 
              checked={isAnonymous}
              onCheckedChange={(checked) => setIsAnonymous(checked === true)}
              className="h-3 w-3 border-white/20"
            />
            <label
              htmlFor="anonymous-compact"
              className="text-[9px] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground uppercase tracking-widest"
            >
              Donación Anónima
            </label>
          </div>

          <div className="space-y-1 pt-1">
            <PayPalButtons
              style={{ 
                layout: 'horizontal',
                color: 'blue',
                shape: 'rect',
                label: 'donate',
                height: 32,
                tagline: false
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
              onApprove={async (data, actions) => {
                try {
                  const response = await fetch('/api/payments/paypal/capture', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      orderID: data.orderID,
                      isAnonymous: isAnonymous
                    })
                  });
                  
                  const result = await response.json();
                  if (result.status === 'success') {
                    toast.success('¡Gracias por tu apoyo industrial! Tu donación ha sido registrada.');
                    if (result.rank_upgrade) {
                      toast.info('¡Tu rango ha sido actualizado en la Sidebar!');
                    }
                  } else {
                    toast.error('Hubo un problema al registrar la donación en el búnker.');
                  }
                } catch (err) {
                  console.error('Capture error:', err);
                  toast.error('Error crítico en la comunicación con PayPal.');
                }
              }}
            />
          </div>
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
          Tu apoyo directo nos permite mantener la infraestructura y seguir innovando en IA.
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
            onApprove={async (data, actions) => {
              try {
                const response = await fetch('/api/payments/paypal/capture', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    orderID: data.orderID,
                    isAnonymous: isAnonymous
                  })
                });
                
                const result = await response.json();
                if (result.status === 'success') {
                  toast.success('¡Inyección de capital exitosa! Gracias por tu apoyo.');
                  if (result.rank_upgrade) {
                    toast.info('Tu rango ha sido actualizado en la Sidebar.');
                  }
                } else {
                  toast.error('Error al registrar el pago en la base de datos.');
                }
              } catch (err) {
                console.error('Capture error:', err);
                toast.error('Error en el puente de pago con PayPal.');
              }
            }}
          />
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 relative z-10 border-t border-white/5 bg-black/20 mt-4 py-4">
        <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest font-orbitron mb-2">
          Otras pasarelas industriales
        </p>
        <div className="w-full grid grid-cols-2 gap-3">
          <Button 
            onClick={() => handleDonate('wompi')}
            variant="outline"
            className="w-full border-white/10 hover:bg-white/5 h-10 text-xs"
            disabled={!finalAmount || finalAmount <= 0}
          >
            <CreditCard className="mr-2 h-3 w-3" />
            Nequi / PSE
          </Button>
          <Button 
            onClick={() => handleDonate('binance')}
            variant="outline"
            className="w-full border-white/10 hover:bg-white/5 h-10 text-xs"
            disabled={!finalAmount || finalAmount <= 0}
          >
            <Coins className="mr-2 h-3 w-3" />
            Binance Pay
          </Button>
        </div>
      </CardFooter>

      <PaymentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        method={method as 'wompi' | 'binance'}
        amount={finalAmount}
      />
    </Card>
  );
}
