'use client';

import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/card'; // Asumiendo que Dialog está en components/ui
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// Nota: He usado components/ui/card como placeholder porque list_dir mostró dialog.tsx
// pero usualmente shadcn usa un conjunto de componentes. 
import {
  Dialog as ShadcnDialog,
  DialogContent as ShadcnContent,
  DialogHeader as ShadcnHeader,
  DialogTitle as ShadcnTitle,
  DialogDescription as ShadcnDescription,
} from "@/components/ui/dialog";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  method: 'wompi' | 'binance' | null;
  amount: number;
}

export function PaymentModal({ isOpen, onClose, method, amount }: PaymentModalProps) {
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleProcessPayment = async () => {
    setStatus('processing');
    try {
      const endpoint = method === 'wompi' 
        ? '/api/payments/wompi/create-link' 
        : '/api/payments/binance/create-order';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, type: 'subscription' })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Error al procesar el pago');

      // Redirigir a la pasarela
      if (data.url) {
        window.location.href = data.url;
      } else {
        setStatus('success');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message);
      setStatus('error');
    }
  };

  return (
    <ShadcnDialog open={isOpen} onOpenChange={onClose}>
      <ShadcnContent className="sm:max-w-[425px] bg-card border-primary/20 backdrop-blur-2xl">
        <ShadcnHeader>
          <ShadcnTitle className="font-orbitron text-xl gradient-text">
            {status === 'success' ? '¡Todo listo!' : 'Confirmar Suscripción'}
          </ShadcnTitle>
          <ShadcnDescription className="font-exo">
            {method === 'wompi' 
              ? 'Serás redirigido de forma segura a Wompi para completar el pago con Tarjeta o Nequi.' 
              : 'Preparando tu orden segura en Binance Pay para el pago con Criptomonedas.'}
          </ShadcnDescription>
        </ShadcnHeader>

        <div className="py-6 flex flex-col items-center justify-center space-y-4">
          {status === 'idle' && (
            <div className="w-full space-y-4">
              <div className="rounded-lg bg-primary/5 p-4 border border-primary/10">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Total a pagar</span>
                  <span className="text-xl font-bold">${amount.toFixed(2)} USD</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Método:</span>
                  <span className="font-bold flex items-center gap-1">
                    {method === 'wompi' ? 'Wompi (Nequi/Tarjetas)' : 'Binance Pay'}
                    <ChevronRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </div>
          )}

          {status === 'processing' && (
            <div className="flex flex-col items-center py-4">
              <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
              <p className="text-sm font-medium animate-pulse">Conectando con la pasarela segura...</p>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center py-4 text-center">
              <AlertCircle className="h-12 w-12 text-destructive mb-4" />
              <p className="text-sm font-bold text-destructive">Ocurrió un error</p>
              <p className="text-xs text-muted-foreground mt-1">{errorMessage}</p>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center py-4 text-center">
              <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
              <p className="text-sm font-bold">¡Redirección exitosa!</p>
              <p className="text-xs text-muted-foreground mt-1">Si no eres redirigido automáticamente, haz clic abajo.</p>
            </div>
          )}
        </div>

        <DialogFooter>
          {status === 'idle' && (
            <>
              <Button variant="ghost" onClick={onClose} className="font-bold">Cancelar</Button>
              <Button onClick={handleProcessPayment} className="font-bold">Ir a pagar</Button>
            </>
          )}
          {status === 'error' && (
            <Button onClick={() => setStatus('idle')} className="w-full font-bold">Reintentar</Button>
          )}
          {status === 'success' && (
            <Button onClick={onClose} className="w-full font-bold">Cerrar</Button>
          )}
        </DialogFooter>
      </ShadcnContent>
    </ShadcnDialog>
  );
}
