'use client';

import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, ChevronRight, X, Sparkles, Coins } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  method: 'wompi' | 'binance' | null;
  amount: number;
}

export function PaymentModal({ isOpen, onClose, method, amount }: PaymentModalProps) {
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error' | 'iframe' | 'qr'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [finalUrl, setFinalUrl] = useState('');

  // Reset status when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setStatus('idle');
        setErrorMessage('');
        setFinalUrl('');
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleProcessPayment = async () => {
    setStatus('processing');
    
    // Si es suscripción de 4 USD usamos fallbacks directos por confiabilidad
    const isPremiumSub = amount === 4;

    try {
      // Especial para Binance 4 USDT (Mostrar QR en lugar de redirigir)
      if (method === 'binance' && isPremiumSub) {
        setTimeout(() => setStatus('qr'), 1000);
        return;
      }

      const endpoint = method === 'wompi' 
        ? '/api/payments/wompi/create-link' 
        : '/api/payments/binance/create-order';

      let data: { url?: string; error?: string } = {};
      
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount, type: 'subscription' })
        });
        
        if (response.ok) {
          data = await response.json();
        }
      } catch (e) {
        console.warn("API Error, attempting static connection...", e);
      }

      let url = data.url;
      
      // Fallback para Wompi 4 USD (Referencia directa según Beatriz)
      if (method === 'wompi' && !url && isPremiumSub) {
        url = 'https://checkout.nequi.wompi.co/l/d91R8J';
      }

      if (url) {
        const urlObj = new URL(url);
        if (typeof window !== 'undefined') {
          const ref = localStorage.getItem('neural_nexus_ref');
          if (ref) urlObj.searchParams.append('ref', ref);
          urlObj.searchParams.append('sku', isPremiumSub ? 'NN-PRE-SUB' : 'NN-DON-POR');
        }
        setFinalUrl(urlObj.toString());
        setStatus('iframe');
      } else {
        // Cobertura final para Wompi Premium en modo búnker
        if (isPremiumSub && method === 'wompi') {
           setFinalUrl('https://checkout.nequi.wompi.co/l/d91R8J');
           setStatus('iframe');
        } else {
           throw new Error('No se pudo establecer el enlace de pago seguro.');
        }
      }
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : 'Falla crítica en pasarela';
      setErrorMessage(msg);
      setStatus('error');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        className={`${
          (status === 'iframe' || status === 'qr') 
            ? 'sm:max-w-2xl h-[700px] max-h-[90vh]' 
            : 'sm:max-w-[425px]'
        } bg-[#020817]/95 backdrop-blur-3xl border-primary/20 p-0 overflow-hidden shadow-2xl transition-all duration-500`}
      >
        {/* Botón de cierre superior para modos expansivos */}
        {(status === 'iframe' || status === 'qr') && (
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
        )}

        <div className="p-6 h-full flex flex-col relative z-10">
          {/* Header (Oculto en iframe/qr para maximizar espacio) */}
          <DialogHeader className={status === 'iframe' || status === 'qr' ? 'hidden' : 'pb-4'}>
            <DialogTitle className="font-orbitron text-xl gradient-text flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary animate-pulse" />
              CONFIRMAR SUSCRIPCIÓN
            </DialogTitle>
            <DialogDescription className="font-exo text-xs opacity-70">
              {method === 'wompi' 
                ? 'Conectando con el ecosistema de pagos seguro de Nequi.' 
                : 'Configurando transceptor para pagos con activos digitales.'}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 flex flex-col items-center justify-center w-full">
            {status === 'idle' && (
              <div className="w-full space-y-4">
                <div className="rounded-xl bg-primary/5 p-5 border border-primary/20 shadow-inner">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-orbitron font-bold text-muted-foreground uppercase tracking-[0.2em]">Total Inversión</span>
                    <span className="text-2xl font-black text-primary">${amount.toFixed(2)} USD</span>
                  </div>
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent mb-4" />
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground font-exo">Método de Enlace:</span>
                    <span className="font-orbitron font-bold flex items-center gap-1 text-primary text-[10px]">
                      {method === 'wompi' ? 'NEQUI / WOMPI' : 'BINANCE PAY'}
                      <ChevronRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </div>
            )}

            {status === 'processing' && (
              <div className="flex flex-col items-center py-10 scale-110">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-150 animate-pulse" />
                  <Loader2 className="h-14 w-14 text-primary animate-spin relative z-10" />
                  <Sparkles className="absolute inset-0 m-auto h-6 w-6 text-primary animate-pulse relative z-20" />
                </div>
                <p className="text-[10px] font-orbitron font-black tracking-[0.3em] text-primary animate-pulse">
                  SINCRONIZANDO NODOS DE PAGO...
                </p>
              </div>
            )}

            {status === 'iframe' && (
              <div className="w-full h-full rounded-2xl overflow-hidden border border-primary/20 bg-white/90 backdrop-blur-md shadow-2xl mt-4">
                <iframe
                  src={finalUrl}
                  className="w-full h-full"
                  title="Wompi Payment"
                  allow="payment"
                />
              </div>
            )}

            {status === 'qr' && (
              <div className="w-full h-full flex flex-col items-center justify-center space-y-8 py-10">
                <div className="relative group">
                  <div className="absolute -inset-4 bg-yellow-500/20 blur-3xl rounded-full group-hover:bg-yellow-500/30 transition-all duration-500" />
                  <div className="relative p-3 rounded-[2.5rem] bg-white border-4 border-yellow-500/50 shadow-[0_0_50px_rgba(234,179,8,0.3)] hover:scale-105 transition-transform duration-500">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/assets/binance-premium-4usdt.jpg" 
                      alt="Binance QR" 
                      className="w-[300px] h-auto rounded-[2rem]"
                    />
                  </div>
                </div>
                <div className="text-center space-y-3 max-w-[280px]">
                  <div className="flex items-center justify-center gap-2 text-yellow-500 font-orbitron text-[10px] font-black tracking-[0.2em]">
                    <Coins className="h-4 w-4" />
                    BINANCE PAY ELITE
                  </div>
                  <h3 className="text-lg font-black tracking-tight">ESCANEADO DE 4 USDT</h3>
                  <p className="text-[10px] text-muted-foreground font-exo leading-relaxed uppercase tracking-tighter opacity-80">
                    Transfiere exactamente 4 USDT vía Binance Pay. El acceso Premium se sincronizará automáticamente tras la confirmación.
                  </p>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="flex flex-col items-center py-8 text-center animate-in fade-in zoom-in-95 duration-300">
                <div className="p-4 rounded-full bg-destructive/10 border border-destructive/20 mb-4">
                  <AlertCircle className="h-12 w-12 text-destructive" />
                </div>
                <p className="text-sm font-orbitron font-black text-destructive tracking-widest mb-2">ERROR DE ENLACE</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-tight max-w-[240px] leading-relaxed">
                  {errorMessage}. Por favor contacta con soporte si el problema persiste.
                </p>
              </div>
            )}
          </div>

          <DialogFooter className={status === 'iframe' || status === 'qr' ? 'hidden' : 'mt-8 pt-4 border-t border-primary/10'}>
            {status === 'idle' && (
              <div className="grid grid-cols-2 gap-4 w-full">
                <Button 
                  variant="ghost" 
                  onClick={onClose} 
                  className="font-orbitron text-[10px] font-black tracking-widest border border-white/5 hover:bg-white/5"
                >
                  CANCELAR
                </Button>
                <Button 
                  onClick={handleProcessPayment} 
                  className="font-orbitron text-[10px] font-black tracking-widest bg-primary hover:bg-primary/80 text-white shadow-[0_0_15px_rgba(0,163,255,0.4)]"
                >
                  ESTABLECER CONEXIÓN
                </Button>
              </div>
            )}
            {status === 'error' && (
              <Button 
                onClick={() => setStatus('idle')} 
                className="w-full font-orbitron text-[10px] font-black tracking-widest rounded-xl"
              >
                REINTENTAR CONEXIÓN
              </Button>
            )}
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
