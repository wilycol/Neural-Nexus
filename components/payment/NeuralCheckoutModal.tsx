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
  Smartphone, 
  Globe, 
  Coins, 
  X 
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
    'silver': 'https://checkout.nequi.wompi.co/l/0Vl1sg', // Setup Low
    'gold': 'https://checkout.nequi.wompi.co/l/LqwXbu',   // Setup Mid
    'platinum': 'https://checkout.nequi.wompi.co/l/MwZTZx', // Setup Enterprise
  }
};

export function NeuralCheckoutModal({ isOpen, onClose, planId }: NeuralCheckoutModalProps) {
  const t = useTranslations('NeuralSites.checkout');
  const [selectedMethod, setSelectedMethod] = useState<'wompi' | 'nequi' | 'paypal' | 'binance' | null>(null);
  const [paymentType, setPaymentType] = useState<'monthly' | 'setup'>('monthly');
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

  const handleMethodSelect = (method: 'wompi' | 'nequi' | 'paypal' | 'binance') => {
    setIsLoading(true);
    setSelectedMethod(method);
    setTimeout(() => setIsLoading(false), 1500);
  };

  const getIframeUrl = () => {
    const baseUrl = PAYMENT_LINKS[paymentType][planId] || PAYMENT_LINKS['monthly']['silver'];
    
    if (typeof window !== 'undefined') {
      const refCode = localStorage.getItem('neural_nexus_ref');
      const params = new URLSearchParams();
      
      if (refCode) params.append('ref', refCode);
      if (userId) params.append('userId', userId);
      params.append('sku', `NS-${planId.toUpperCase()}-${paymentType.toUpperCase()}`);

      const separator = baseUrl.includes('?') ? '&' : '?';
      return `${baseUrl}${separator}${params.toString()}`;
    }
    
    return baseUrl;
  };

  const methods = [
    { id: 'wompi', icon: CreditCard, label: t('method_credit'), color: 'text-cyan-400', glow: 'shadow-cyan-500/20' },
    { id: 'nequi', icon: Smartphone, label: t('method_debit'), color: 'text-fuchsia-500', glow: 'shadow-fuchsia-600/20' },
    { id: 'paypal', icon: Globe, label: 'PayPal', color: 'text-blue-500', glow: 'shadow-blue-600/20' },
    { id: 'binance', icon: Coins, label: 'Binance Pay', color: 'text-yellow-500', glow: 'shadow-yellow-600/20' },
  ] as const;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[580px] bg-background/40 backdrop-blur-3xl border-primary/20 p-0 overflow-hidden shadow-[0_0_50px_rgba(0,163,255,0.1)] scanline cyber-grid">
        <DialogHeader className="p-6 pb-2 relative z-10">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-pulse" />
          <DialogTitle className="text-2xl font-orbitron font-black text-primary tracking-[0.1em] flex items-center gap-4 uppercase italic">
            <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/20 shadow-[0_0_15px_rgba(255,255,255,0.17)]">
              <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            </div>
            {t('title')}
          </DialogTitle>
          <div className="mt-2 flex items-center gap-2">
            <div className="h-px flex-1 bg-gradient-to-r from-primary/50 to-transparent" />
            <span className="text-[9px] font-orbitron font-bold text-muted-foreground uppercase tracking-widest bg-muted/30 px-2 py-0.5 rounded border border-border/50">
              {planId} TIER / SECTOR: {paymentType === 'monthly' ? 'DURABILIDAD' : 'CONSTRUCCIÓN'}
            </span>
          </div>
        </DialogHeader>

        <div className="px-6 mb-4 relative z-10">
          <Tabs defaultValue="monthly" className="w-full" onValueChange={(v) => setPaymentType(v as 'monthly' | 'setup')}>
            <TabsList className="grid w-full grid-cols-2 h-10 bg-black/40 border border-primary/20 p-1 rounded-xl">
              <TabsTrigger 
                value="monthly" 
                className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-orbitron text-[9px] font-black tracking-[0.1em] transition-all uppercase"
              >
                {t('pay_monthly')}
              </TabsTrigger>
              <TabsTrigger 
                value="setup" 
                className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-orbitron text-[9px] font-black tracking-[0.05em] transition-all uppercase relative overflow-hidden group px-1"
              >
                <div className="flex items-center gap-1">
                  <span className="relative z-10 truncate">{t('pay_setup')}</span>
                  <span className="shrink-0 text-[7px] bg-red-500/20 text-red-500 px-1 rounded animate-pulse border border-red-500/30">
                    50% OFF
                  </span>
                </div>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="p-6 pt-0 min-h-[420px] flex flex-col relative z-10">
          <AnimatePresence mode="wait">
            {!selectedMethod ? (
              <motion.div
                key="methods"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                className="grid grid-cols-2 gap-4"
              >
                {methods.map((method, idx) => (
                  <motion.div
                    key={method.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Button
                      variant="outline"
                      className={`w-full h-28 flex flex-col items-center justify-center gap-3 bg-black/20 backdrop-blur-sm border-primary/10 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 group relative overflow-hidden rounded-2xl ${method.glow}`}
                      onClick={() => handleMethodSelect(method.id)}
                    >
                      <div className="absolute top-0 right-0 p-1.5 opacity-5 scale-125 rotate-12 group-hover:opacity-15 transition-all">
                        <method.icon className="w-10 h-10" />
                      </div>
                      
                      <div className={`p-2.5 rounded-xl bg-black/40 border border-white/5 shadow-xl group-hover:scale-110 group-hover:bg-black/60 transition-all duration-500 ${method.color}`}>
                        <method.icon className="w-7 h-7" />
                      </div>
                      
                      <div className="flex flex-col items-center gap-0.5">
                        <span className="text-[9px] font-orbitron font-black uppercase tracking-[0.15em] text-foreground/90 group-hover:text-primary transition-colors">
                          {method.label}
                        </span>
                        <div className="h-px w-0 bg-primary group-hover:w-full transition-all duration-500" />
                      </div>

                      {/* Laser edge detail */}
                      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-primary/40 opacity-0 group-hover:opacity-100 transition-all" />
                      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-primary/40 opacity-0 group-hover:opacity-100 transition-all" />
                    </Button>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="iframe-container"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 relative bg-black/40 rounded-2xl border border-primary/20 overflow-hidden shadow-2xl"
              >
                {isLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-md z-10 font-orbitron">
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
                  className="w-full h-full border-none bg-white/95"
                  title="Payment Gateway"
                  allow="payment"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <footer className="mt-6 flex items-center justify-center gap-2 text-[8px] font-orbitron uppercase tracking-[0.3em] text-muted-foreground/40">
            <div className="h-px w-8 bg-muted-foreground/20" />
            CONEXIÓN SEGURA BINARIA 256-BIT
            <div className="h-px w-8 bg-muted-foreground/20" />
          </footer>
        </div>
      </DialogContent>
    </Dialog>
  );
}
