import React, { useState, useEffect } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  CreditCard, 
  Coins, 
  X,
  Settings2,
  ChevronRight
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface NeuralCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  planId: 'silver' | 'gold' | 'platinum';
}

const PAYMENT_LINKS = {
  'monthly': {
    'silver': 'https://checkout.nequi.wompi.co/l/aJ6uiI',
    'gold': 'https://checkout.nequi.wompi.co/l/DKO2Nj',
    'platinum': 'https://checkout.nequi.wompi.co/l/fnk7p8',
  },
  'setup': {
    'low': 'https://checkout.nequi.wompi.co/l/0Vl1sg',
    'mid-low': 'https://checkout.nequi.wompi.co/l/2IVZox',
    'middle': 'https://checkout.nequi.wompi.co/l/LqwXbu',
    'mid-high': 'https://checkout.nequi.wompi.co/l/09wHHx',
    'high': 'https://checkout.nequi.wompi.co/l/MwZTZx',
  }
};

type SetupLevel = 'low' | 'mid-low' | 'middle' | 'mid-high' | 'high';

export function NeuralCheckoutModal({ isOpen, onClose, planId }: NeuralCheckoutModalProps) {
  const t = useTranslations('NeuralSites.checkout');
  const [selectedMethod, setSelectedMethod] = useState<'wompi' | 'binance' | null>(null);
  const [paymentType, setPaymentType] = useState<'monthly' | 'setup'>('monthly');
  const [setupLevel, setSetupLevel] = useState<SetupLevel>('low');
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = getSupabaseBrowserClient();

  useEffect(() => {
    const fetchUser = async () => {
      if (!supabase) return;
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    };
    if (isOpen) fetchUser();
  }, [isOpen, supabase]);

  const handleMethodSelect = (method: 'wompi' | 'binance') => {
    setIsLoading(true);
    setSelectedMethod(method);
    setTimeout(() => setIsLoading(false), 1500);
  };

  const getIframeUrl = () => {
    let baseUrl = '';
    if (paymentType === 'monthly') {
      baseUrl = PAYMENT_LINKS.monthly[planId];
    } else {
      baseUrl = PAYMENT_LINKS.setup[setupLevel];
    }
    
    if (typeof window !== 'undefined') {
      const refCode = localStorage.getItem('neural_nexus_ref');
      const params = new URLSearchParams();
      
      if (refCode) params.append('ref', refCode);
      if (userId) params.append('userId', userId);
      params.append('sku', `NS-${planId.toUpperCase()}-${paymentType === 'monthly' ? 'SUB' : 'SETUP-' + setupLevel.toUpperCase()}`);

      const separator = baseUrl.includes('?') ? '&' : '?';
      return `${baseUrl}${separator}${params.toString()}`;
    }
    
    return baseUrl;
  };

  const difficultyOptions: { id: SetupLevel; label: string; price: string }[] = [
    { id: 'low', label: t('difficulty.low'), price: '$50' },
    { id: 'mid-low', label: t('difficulty.mid_low'), price: '$100' },
    { id: 'middle', label: t('difficulty.middle'), price: '$200' },
    { id: 'mid-high', label: t('difficulty.mid_high'), price: '$400' },
    { id: 'high', label: t('difficulty.high'), price: '$800' },
  ];

  const methods = [
    { 
      id: 'wompi', 
      icon: CreditCard, 
      label: 'Tarjeta de Crédito o Débito', 
      color: 'text-cyan-400', 
      glow: 'shadow-[0_0_20px_rgba(34,211,238,0.3)]',
      border: 'hover:border-cyan-500/50'
    },
    { 
      id: 'binance', 
      icon: Coins, 
      label: 'Pagar con Cripto', 
      color: 'text-yellow-500', 
      glow: 'shadow-[0_0_20px_rgba(234,179,8,0.3)]',
      border: 'hover:border-yellow-500/50'
    },
  ] as const;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent hideClose className="sm:max-w-[500px] w-[95vw] bg-[#020817]/95 backdrop-blur-3xl border-primary/20 p-0 overflow-hidden shadow-[0_0_50px_rgba(0,163,255,0.15)] ring-1 ring-white/10 cyber-grid">
        {/* Priority Close Button */}
        <div className="absolute top-4 right-4 z-[100]">
          <Button
            size="icon"
            variant="ghost"
            className="h-9 w-9 rounded-full bg-white/5 border border-white/10 hover:bg-white/20 hover:scale-110 active:scale-95 transition-all text-white backdrop-blur-md"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <DialogHeader className="p-6 pb-2 relative z-10">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-pulse" />
          <DialogTitle className="text-xl sm:text-2xl font-orbitron font-black text-primary tracking-[0.1em] flex items-center gap-3 uppercase italic">
            <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/20 shadow-[0_0_15px_rgba(255,255,255,0.17)]">
              <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            </div>
            {t('title')}
          </DialogTitle>
          <div className="mt-2 flex items-center gap-2">
            <div className="h-px flex-1 bg-gradient-to-r from-primary/50 to-transparent" />
            <span className="text-[10px] font-orbitron font-bold text-primary/80 uppercase tracking-widest bg-primary/5 px-2 py-0.5 rounded border border-primary/20 whitespace-nowrap">
              PLAN: {planId}
            </span>
          </div>
        </DialogHeader>

        <div className="px-6 mb-4 relative z-10 w-full">
          <Tabs defaultValue="monthly" className="w-full" onValueChange={(v) => setPaymentType(v as 'monthly' | 'setup')}>
            <TabsList className="grid w-full grid-cols-2 h-11 bg-black/60 border border-primary/20 p-1 rounded-xl">
              <TabsTrigger 
                value="monthly" 
                className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-orbitron text-[10px] font-black tracking-[0.1em] transition-all uppercase"
              >
                {t('pay_monthly')}
              </TabsTrigger>
              <TabsTrigger 
                value="setup" 
                className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-orbitron text-[10px] font-black tracking-[0.1em] transition-all uppercase px-1"
              >
                <span className="truncate">{t('pay_setup')}</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="p-6 pt-0 min-h-[460px] flex flex-col relative z-10">
          <AnimatePresence mode="wait">
            {!selectedMethod ? (
              <motion.div
                key="methods"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {/* Selector de Nivel si es Setup */}
                {paymentType === 'setup' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-primary/5 border border-primary/20 rounded-2xl p-4 mb-4"
                  >
                    <div className="flex items-center gap-2 mb-3 text-[10px] font-orbitron font-bold text-primary tracking-widest uppercase">
                      <Settings2 className="w-3 h-3" />
                      Nivel de Complejidad Industrial
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {difficultyOptions.map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => setSetupLevel(opt.id)}
                          className={`flex items-center justify-between p-3 rounded-xl border transition-all text-left group ${
                            setupLevel === opt.id 
                            ? 'bg-primary border-primary text-primary-foreground shadow-[0_0_15px_rgba(0,163,255,0.3)]' 
                            : 'bg-black/40 border-primary/10 text-muted-foreground hover:border-primary/30'
                          }`}
                        >
                          <div className="flex flex-col">
                            <span className={`text-[11px] font-black tracking-tight uppercase ${setupLevel === opt.id ? 'text-white' : ''}`}>
                              {opt.label}
                            </span>
                            <span className={`text-[8px] font-mono opacity-60 ${setupLevel === opt.id ? 'text-white' : ''}`}>
                              NIVEL {opt.id.toUpperCase()}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-orbitron font-black text-sm">{opt.price}</span>
                            <ChevronRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${setupLevel === opt.id ? 'text-white' : 'text-primary'}`} />
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                <div className="grid grid-cols-1 gap-4">
                  {methods.map((method, idx) => (
                    <motion.div
                      key={method.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Button
                        variant="outline"
                        className={`w-full h-28 flex flex-col items-center justify-center gap-3 bg-black/40 backdrop-blur-md border border-primary/10 transition-all duration-300 group relative overflow-hidden rounded-2xl ${method.glow} ${method.border}`}
                        onClick={() => handleMethodSelect(method.id)}
                      >
                        <div className={`p-3 rounded-xl bg-black/60 border border-white/5 shadow-2xl group-hover:scale-110 group-hover:bg-black/80 transition-all duration-500 ${method.color}`}>
                          <method.icon className="w-8 h-8" />
                        </div>
                        
                        <span className="text-[10px] font-orbitron font-black uppercase tracking-[0.1em] text-foreground/80 group-hover:text-primary">
                          {method.label}
                        </span>

                        {/* Scanline Effect on Hover */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent -translate-y-full group-hover:animate-scan transition-all pointer-events-none" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="iframe-container"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 relative bg-black/60 rounded-2xl border border-primary/20 overflow-hidden shadow-2xl"
              >
                {isLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#020817]/90 backdrop-blur-lg z-10 font-orbitron">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full border-t-2 border-primary border-r-2 border-transparent animate-spin" />
                      <div className="absolute inset-0 w-16 h-16 rounded-full border-b-2 border-primary/30 border-l-2 border-transparent animate-spin-reverse-slow" />
                      <Sparkles className="absolute inset-0 m-auto h-6 w-6 text-primary animate-pulse" />
                    </div>
                    <p className="mt-4 text-[10px] uppercase tracking-[0.3em] font-black text-primary animate-pulse">
                      ESTABLECIENDO ENLACE NEURAL
                    </p>
                  </div>
                )}
                
                <div className="absolute top-4 right-4 z-20">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-10 w-10 rounded-full bg-white/5 border border-white/10 hover:bg-white/20 hover:scale-110 active:scale-95 transition-all text-white backdrop-blur-md"
                    onClick={() => setSelectedMethod(null)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <iframe
                  src={getIframeUrl()}
                  className="w-full h-full border-none bg-white font-sans"
                  title="Payment Gateway"
                  allow="payment"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <footer className="mt-6 flex items-center justify-center gap-3 text-[9px] font-orbitron uppercase tracking-[0.4em] text-primary/30">
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-primary/20" />
            CIFRADO BINARIO 256-BIT
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-primary/20" />
          </footer>
        </div>
      </DialogContent>
    </Dialog>
  );
}
