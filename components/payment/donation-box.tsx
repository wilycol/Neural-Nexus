'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heart, Coins, CreditCard, DollarSign } from 'lucide-react';
import { PaymentModal } from './payment-modal';

export function DonationBox() {
  const [amount, setAmount] = useState<number>(10);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [method, setMethod] = useState<'wompi' | 'binance' | null>(null);
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

  return (
    <Card className="w-full max-w-md mx-auto border-primary/20 bg-card/50 backdrop-blur-md overflow-hidden relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <CardHeader className="text-center">
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

        {rate > 0 && (
          <div className="text-center text-xs text-muted-foreground font-exo">
            Aproximadamente <span className="text-primary font-bold">
              {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(amountInCOP)}
            </span>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col gap-3 relative z-10">
        <div className="w-full grid grid-cols-2 gap-3">
          <Button 
            onClick={() => handleDonate('wompi')}
            className="w-full bg-[#2D2D2D] hover:bg-[#3D3D3D] text-white border-none h-12 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
            disabled={!finalAmount || finalAmount <= 0}
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Nequi / PSE
          </Button>
          <Button 
            onClick={() => handleDonate('binance')}
            className="w-full bg-[#f3ba2f] hover:bg-[#e2aa27] text-black border-none h-12 shadow-[0_0_15px_rgba(243,186,47,0.2)]"
            disabled={!finalAmount || finalAmount <= 0}
          >
            <Coins className="mr-2 h-4 w-4" />
            Binance Pay
          </Button>
        </div>
        <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest font-orbitron opacity-50">
          Pagos seguros y encriptados
        </p>
      </CardFooter>

      <PaymentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        method={method}
        amount={finalAmount}
      />
    </Card>
  );
}
