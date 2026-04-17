import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Heart, DollarSign, Wallet } from 'lucide-react';
import { PaymentModal } from './payment-modal';
import { toast } from 'sonner';

import { useRouter, useParams } from 'next/navigation';

interface DonationBoxProps {
  compact?: boolean;
}

export function DonationBox({ compact = false }: DonationBoxProps) {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const [amount, setAmount] = useState<number>(0);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [rate, setRate] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
            className="w-full h-8 text-[10px] font-black tracking-widest border-yellow-500/20 bg-yellow-500/5 hover:bg-yellow-500/20 hover:border-yellow-500/50 text-yellow-500/80 hover:text-yellow-500 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_15px_-5px_rgba(234,179,8,0.1)] hover:shadow-[0_0_20px_-3px_rgba(234,179,8,0.2)]"
            onClick={handleNavigate}
          >
            SER PREMIUM 🏆
          </Button>
          
          <Button 
            variant="outline"
            size="sm" 
            className="w-full h-8 text-[10px] font-black tracking-widest border-primary/20 bg-primary/5 hover:bg-primary/20 hover:border-primary/50 text-primary/80 hover:text-primary transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_15px_-5px_rgba(0,163,255,0.1)] hover:shadow-[0_0_20px_-3px_rgba(0,163,255,0.2)]"
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
        <CardTitle className="font-orbitron tracking-tighter text-2xl uppercase">Donaciones</CardTitle>
        <CardDescription className="font-exo">
          Impulsa Neural Nexus. Tu apoyo vía PayPal nos permite seguir innovando.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 relative z-10">
        <div className="space-y-2">
          <label className="text-[10px] font-orbitron font-bold text-muted-foreground uppercase tracking-widest ml-1">Monto a Donar (USD)</label>
          <div className="relative">
            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
            <Input
              type="number"
              placeholder="Ingresa el monto"
              className="pl-12 h-14 text-xl font-black bg-background/50 border-white/5 focus:border-primary/50 transition-all font-exo"
              value={customAmount || amount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                setAmount(parseFloat(e.target.value) || 0);
              }}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2 border p-4 rounded-2xl bg-background/30 border-white/5 hover:border-primary/20 transition-colors">
          <Checkbox 
            id="anonymous" 
            checked={isAnonymous}
            onCheckedChange={(checked) => setIsAnonymous(checked === true)}
          />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="anonymous"
              className="text-xs font-bold uppercase tracking-widest leading-none cursor-pointer"
            >
              Donación Anónima
            </label>
            <p className="text-[10px] text-muted-foreground font-exo">
              Tu identidad será protegida en el Muro de Honor.
            </p>
          </div>
        </div>

        {rate > 0 && finalAmount > 0 && (
          <div className="text-center p-3 rounded-xl bg-primary/5 border border-primary/10">
            <p className="text-[10px] font-orbitron text-muted-foreground uppercase mb-1">Impacto Local Aproximado</p>
            <span className="text-lg font-black text-primary">
              {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(amountInCOP)}
            </span>
          </div>
        )}

        <div className="pt-2">
          <Button 
            className="w-full h-14 text-sm font-orbitron font-black tracking-[0.2em] shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all gap-3 bg-primary hover:bg-primary/90"
            onClick={() => {
              if (finalAmount <= 0) {
                toast.error('Por favor, ingresa un monto válido.');
                return;
              }
              setIsModalOpen(true);
            }}
          >
            <Wallet className="h-5 w-5" />
            CONFIRMAR DONACIÓN
          </Button>
        </div>
      </CardContent>

      <PaymentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        method="paypal"
        amount={finalAmount}
        type="donation"
      />
    </Card>
  );
}
