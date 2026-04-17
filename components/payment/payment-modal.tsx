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
import { Loader2, AlertCircle, ChevronRight, X, Sparkles, DollarSign, CreditCard, ShieldCheck } from 'lucide-react';
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  method: 'wompi' | 'binance' | 'paypal' | null;
  amount: number;
  type?: 'subscription' | 'donation';
}

export function PaymentModal({ isOpen, onClose, method: initialMethod, amount: initialAmount, type = 'donation' }: PaymentModalProps) {
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error' | 'iframe' | 'qr' | 'selection'>('selection');
  const [selectedMethod, setSelectedMethod] = useState<'wompi' | 'binance' | 'paypal' | null>(initialMethod);
  const [amount, setAmount] = useState<number>(initialAmount);
  const [customAmount, setCustomAmount] = useState<string>(initialAmount.toString());
  const [errorMessage, setErrorMessage] = useState('');
  const [finalUrl, setFinalUrl] = useState('');
  const [{ isPending, isRejected }] = usePayPalScriptReducer();

  // Sincronizar estados cuando cambia el monto inicial o el método
  useEffect(() => {
    if (initialMethod) setSelectedMethod(initialMethod);
    setAmount(initialAmount);
    setCustomAmount(initialAmount.toString());
    
    // Si viene con método, vamos directo a 'idle' (confirmación)
    if (initialMethod) {
      setStatus('idle');
    } else {
      setStatus('selection');
    }
  }, [initialMethod, initialAmount, isOpen]);

  // Reset status when modal closes
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setStatus('selection');
        setSelectedMethod(null);
        setErrorMessage('');
        setFinalUrl('');
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleProcessPayment = async () => {
    if (!selectedMethod) return;
    
    // Si es PayPal, el flujo lo maneja PayPalButtons
    if (selectedMethod === 'paypal') return;

    console.log('[Payment] Iniciando proceso:', { method: selectedMethod, amount });
    setStatus('processing');
    
    const isPremiumSub = type === 'subscription';

    try {
      if (selectedMethod === 'binance' && isPremiumSub) {
        setTimeout(() => setStatus('qr'), 600);
        return;
      }

      if (selectedMethod === 'wompi' && isPremiumSub) {
        const url = 'https://checkout.nequi.wompi.co/l/d91R8J';
        const urlObj = new URL(url);
        if (typeof window !== 'undefined') {
          const ref = localStorage.getItem('neural_nexus_ref');
          if (ref) urlObj.searchParams.append('ref', ref);
          urlObj.searchParams.append('sku', 'NN-PRE-SUB');
        }
        setFinalUrl(urlObj.toString());
        setStatus('iframe');
        return;
      }

      const endpoint = selectedMethod === 'wompi' 
        ? '/api/payments/wompi/create-link' 
        : '/api/payments/binance/create-order';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, type })
      });
      
      const data = await response.json();
      
      if (data.url) {
        setFinalUrl(data.url);
        setStatus('iframe');
      } else {
        throw new Error(data.error || 'No se pudo establecer el enlace de pago seguro.');
      }
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : 'Falla crítica en pasarela';
      setErrorMessage(msg);
      setStatus('error');
    }
  };

  const currentAmount = type === 'donation' ? parseFloat(customAmount) || 0 : amount;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        hideClose
        className={`${
          (status === 'iframe' || status === 'qr' || (status === 'idle' && selectedMethod === 'paypal')) 
            ? 'sm:max-w-2xl h-[700px] max-h-[90vh]' 
            : 'sm:max-w-[425px]'
        } bg-[#020817]/95 backdrop-blur-3xl border-primary/20 p-0 overflow-hidden shadow-2xl transition-all duration-500`}
      >
        <div className="absolute top-4 right-4 z-[100]">
          <Button
            size="icon"
            variant="ghost"
            className="h-9 w-9 rounded-full bg-white/5 border border-white/10 hover:bg-white/20 text-white backdrop-blur-md"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 h-full flex flex-col relative z-10">
          <DialogHeader className={(status === 'iframe' || status === 'qr' || (status === 'idle' && selectedMethod === 'paypal')) ? 'hidden' : 'pb-4'}>
            <DialogTitle className="font-orbitron text-xl gradient-text flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary animate-pulse" />
              {type === 'subscription' ? 'ACTIVAR MEMBRESÍA' : 'NODO DE DONACIÓN'}
            </DialogTitle>
            <DialogDescription className="font-exo text-xs opacity-70">
              {type === 'subscription' 
                ? 'Elige tu puente de pago para desbloquear el Acceso Total.' 
                : 'Impulsa nuestra infraestructura con un aporte industrial.'}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 flex flex-col items-center justify-center w-full overflow-y-auto custom-scrollbar pt-2">
            {status === 'selection' && (
              <div className="w-full space-y-4">
                {type === 'donation' && (
                  <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 mb-4">
                    <p className="text-[10px] font-orbitron font-bold text-primary uppercase mb-2">Monto de Donación (USD)</p>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        type="number"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        className="pl-10 font-black text-lg bg-background/50"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                )}
                
                <p className="text-[10px] font-orbitron font-bold text-muted-foreground uppercase tracking-widest text-center">Selecciona Método Industrial</p>
                <div className="grid gap-3">
                  {type === 'donation' ? (
                    <MethodButton 
                      icon={<PayPalIcon />} 
                      label="PayPal / Tarjeta" 
                      onClick={() => { setSelectedMethod('paypal'); setStatus('idle'); }} 
                    />
                  ) : (
                    <>
                      <MethodButton 
                        icon={<CreditCard className="h-4 w-4" />} 
                        label="Nequi / Wompi" 
                        onClick={() => { setSelectedMethod('wompi'); setStatus('idle'); }} 
                      />
                      <MethodButton 
                        icon={<ShieldCheck className="h-4 w-4" />} 
                        label="Binance Pay" 
                        onClick={() => { setSelectedMethod('binance'); setStatus('idle'); }} 
                      />
                    </>
                  )}
                </div>
              </div>
            )}

            {status === 'idle' && selectedMethod !== 'paypal' && (
              <div className="w-full space-y-4">
                <div className="rounded-xl bg-primary/5 p-5 border border-primary/20 shadow-inner">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-orbitron font-bold text-muted-foreground uppercase tracking-[0.2em]">Inversión Total</span>
                    <span className="text-2xl font-black text-primary">${currentAmount.toFixed(2)} USD</span>
                  </div>
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent mb-4" />
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground font-exo">Método:</span>
                    <span className="font-orbitron font-bold flex items-center gap-1 text-primary text-[10px] uppercase">
                      {selectedMethod}
                      <Button variant="link" size="sm" onClick={() => setStatus('selection')} className="h-auto p-0 text-[9px] ml-2">Cambiar</Button>
                    </span>
                  </div>
                </div>
              </div>
            )}

            {status === 'idle' && selectedMethod === 'paypal' && (
              <div className="w-full h-full flex flex-col items-center pt-8">
                <div className="mb-6 text-center">
                  <p className="text-[10px] font-orbitron font-bold text-primary uppercase mb-1">Pasarela PayPal</p>
                  <p className="text-2xl font-black">${currentAmount.toFixed(2)} USD</p>
                </div>
                
                <div className="w-full max-w-sm min-h-[150px] relative flex flex-col items-center justify-center">
                  {isPending && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm z-20 rounded-xl border border-white/5">
                      <Loader2 className="h-8 w-8 text-primary animate-spin mb-3" />
                      <p className="text-[9px] font-orbitron font-black tracking-widest text-primary animate-pulse uppercase">Sincronizando Pasarela Industrial...</p>
                    </div>
                  )}

                  {isRejected && (
                    <div className="w-full p-6 rounded-xl border border-destructive/20 bg-destructive/5 flex flex-col items-center text-center">
                      <AlertCircle className="h-10 w-10 text-destructive mb-3" />
                      <p className="text-[10px] font-orbitron font-black text-destructive tracking-widest uppercase mb-1">Error de Conexión</p>
                      <p className="text-[9px] text-muted-foreground uppercase leading-tight">No se pudo materializar la interfaz de pago. Verifica tu Client ID.</p>
                    </div>
                  )}

                  {!isRejected && (
                    <PayPalButtons
                      key={`${currentAmount}-${type}`}
                      style={{ layout: 'vertical', shape: 'rect', label: type === 'subscription' ? 'subscribe' : 'donate' }}
                      createOrder={(data, actions) => {
                        if (currentAmount <= 0) {
                          toast.error('El monto debe ser mayor a 0 para utilizar PayPal.');
                          return Promise.reject(new Error('Invalid amount'));
                        }
                        return actions.order.create({
                          intent: "CAPTURE",
                          purchase_units: [{
                            amount: { currency_code: "USD", value: currentAmount.toString() },
                            description: type === 'subscription' ? 'Nexus Premium Subscription' : 'Neural Nexus Support Donation'
                          }]
                        });
                      }}
                      onError={(err) => {
                        console.error('[PayPal Error]', err);
                        toast.error('Error al cargar la pasarela de PayPal.');
                      }}
                      onApprove={async (data) => {
                        setStatus('processing');
                        try {
                          const response = await fetch('/api/payments/paypal/capture', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ orderID: data.orderID, type: type })
                          });
                          const result = await response.json();
                          if (result.status === 'success') {
                            toast.success('¡Operación Exitosa! Gracias por tu apoyo industrial.');
                            onClose();
                          } else {
                            toast.error('Error en la base de datos.');
                            setStatus('error');
                          }
                        } catch (err) {
                          console.error('[PayPal Capture Catch]', err);
                          toast.error('Fallo en sincronización.');
                          setStatus('error');
                        }
                      }}
                    />
                  )}
                </div>
                
                <Button variant="ghost" size="sm" onClick={() => setStatus('selection')} className="mt-4 text-[9px] uppercase tracking-widest font-orbitron">
                  Volver a selección
                </Button>
              </div>
            )}

            {status === 'processing' && (
              <div className="flex flex-col items-center py-10">
                <Loader2 className="h-14 w-14 text-primary animate-spin mb-4" />
                <p className="text-[10px] font-orbitron font-black tracking-widest text-primary animate-pulse">SINCRONIZANDO NODOS...</p>
              </div>
            )}

            {status === 'iframe' && (
              <div className="w-full h-full rounded-2xl overflow-hidden border border-primary/20 bg-white/90 shadow-2xl mt-4">
                <iframe src={finalUrl} className="w-full h-full" title="Payment" allow="payment" />
              </div>
            )}

            {status === 'qr' && (
               <div className="w-full h-full flex flex-col items-center justify-center space-y-8 py-10">
                 <div className="relative p-3 rounded-[2.5rem] bg-white border-4 border-yellow-500/50">
                   <div className="relative w-[300px] aspect-[3/4] rounded-[2rem] overflow-hidden">
                     <Image 
                       src="/assets/binance-premium-4usdt.jpg" 
                       alt="Binance QR" 
                       fill 
                       className="object-contain" 
                     />
                   </div>
                 </div>
                 <div className="text-center space-y-2">
                   <p className="text-yellow-500 font-orbitron text-[10px] font-black tracking-widest">BINANCE PAY ELITE</p>
                   <p className="text-lg font-black">4 USDT TRANSFER</p>
                 </div>
               </div>
            )}

            {status === 'error' && (
              <div className="flex flex-col items-center py-8 text-center">
                <AlertCircle className="h-12 w-12 text-destructive mb-4" />
                <p className="text-sm font-orbitron font-black text-destructive tracking-widest">ERROR DE ENLACE</p>
                <p className="text-[10px] text-muted-foreground uppercase mt-2">{errorMessage}</p>
                <Button onClick={() => setStatus('selection')} variant="outline" size="sm" className="mt-6">Volver</Button>
              </div>
            )}
          </div>

          <DialogFooter className={(status === 'iframe' || status === 'qr' || (status === 'idle' && selectedMethod === 'paypal')) ? 'hidden' : 'mt-8 pt-4 border-t border-primary/10'}>
            {status === 'idle' && selectedMethod !== 'paypal' && (
              <div className="grid grid-cols-2 gap-4 w-full">
                <Button variant="ghost" onClick={() => setStatus('selection')} className="font-orbitron text-[10px]">ATRÁS</Button>
                <Button onClick={handleProcessPayment} className="font-orbitron text-[10px] bg-primary shadow-lg shadow-primary/20">CONFIRMAR</Button>
              </div>
            )}
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function MethodButton({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) {
  return (
    <Button 
      variant="outline" 
      onClick={onClick}
      className="w-full h-12 justify-start gap-4 border-white/5 bg-white/5 hover:bg-white/10 hover:border-primary/20 transition-all font-exo"
    >
      <div className="p-2 bg-background/50 rounded-lg">{icon}</div>
      <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
      <ChevronRight className="h-4 w-4 ml-auto opacity-30" />
    </Button>
  );
}

function PayPalIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.0674 7.35121C20.252 8.3517 20.3444 9.42307 20.2818 10.518C20.1506 12.822 19.3406 14.6596 17.8465 16.035C16.3411 17.4194 14.1979 18.2573 11.4168 18.5273L10.3952 18.6258C10.0381 18.6603 9.76188 18.9619 9.76188 19.321V22.2514C9.76188 22.6648 9.42668 23 9.01328 23H5.74862C5.39956 23 5.10515 22.7397 5.06456 22.3929L3.06414 5.27515C3.01633 4.86598 3.33385 4.5 3.74819 4.5H10.1983C13.2096 4.5 15.3528 5.11475 16.6346 6.34421C17.2037 6.89041 17.653 7.5414 17.9822 8.28121C18.2917 8.97444 18.4419 9.71539 18.423 10.4573C18.396 11.5204 18.1065 12.4285 17.6186 13.1342" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}
