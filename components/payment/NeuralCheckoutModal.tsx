import React, { useState, useEffect } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  Loader2, 
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] bg-background/95 backdrop-blur-xl border-primary/20 p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-2xl font-orbitron font-bold text-primary tracking-tight flex items-center gap-3">
            <Sparkles className="h-6 w-6" /> {t('title')}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {planId.toUpperCase()} Tier - Elige el componente a financiar
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 mb-4">
          <Tabs defaultValue="monthly" className="w-full" onValueChange={(v) => setPaymentType(v as 'monthly' | 'setup')}>
            <TabsList className="grid w-full grid-cols-2 bg-primary/10 border border-primary/20">
              <TabsTrigger value="monthly" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground uppercase text-[10px] font-bold tracking-widest">
                {t('pay_monthly')}
              </TabsTrigger>
              <TabsTrigger value="setup" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground uppercase text-[10px] font-bold tracking-widest">
                {t('pay_setup')} (50% OFF)
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="p-6 pt-2 h-[450px] flex flex-col">
          <AnimatePresence mode="wait">
            {!selectedMethod ? (
              <motion.div
                key="methods"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-2 gap-4"
              >
                <Button
                  variant="outline"
                  className="h-24 flex flex-col gap-2 border-primary/20 hover:border-primary hover:bg-primary/5 group relative overflow-hidden"
                  onClick={() => handleMethodSelect('wompi')}
                >
                  <CreditCard className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-semibold uppercase">{t('method_credit')}</span>
                </Button>

                <Button
                  variant="outline"
                  className="h-24 flex flex-col gap-2 border-primary/20 hover:border-primary hover:bg-primary/5 group"
                  onClick={() => handleMethodSelect('nequi')}
                >
                  <Smartphone className="w-8 h-8 text-[#E6007E] group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-semibold uppercase">{t('method_debit')}</span>
                </Button>

                <Button
                  variant="outline"
                  className="h-24 flex flex-col gap-2 border-primary/20 hover:border-primary hover:bg-primary/5 group"
                  onClick={() => handleMethodSelect('paypal')}
                >
                  <Globe className="w-8 h-8 text-[#0070BA] group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-semibold uppercase">PayPal</span>
                </Button>

                <Button
                  variant="outline"
                  className="h-24 flex flex-col gap-2 border-primary/20 hover:border-primary hover:bg-primary/5 group"
                  onClick={() => handleMethodSelect('binance')}
                >
                  <Coins className="w-8 h-8 text-[#F3BA2F] group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-semibold uppercase">Binance Pay</span>
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="iframe-container"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 relative bg-black/5 rounded-lg border border-primary/10 overflow-hidden"
              >
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                  </div>
                )}
                
                <div className="absolute top-2 right-2 z-20">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20"
                    onClick={() => setSelectedMethod(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <iframe
                  src={getIframeUrl()}
                  className="w-full h-full border-none bg-white"
                  title="Payment Gateway"
                  allow="payment"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
