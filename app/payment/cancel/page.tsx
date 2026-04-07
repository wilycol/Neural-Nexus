'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="max-w-lg w-full border-destructive/20 backdrop-blur-xl bg-card/80">
        <CardContent className="pt-12 pb-8 flex flex-col items-center text-center space-y-6">
          <div className="rounded-full bg-destructive/20 p-6">
            <XCircle className="h-16 w-16 text-destructive" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-orbitron font-bold text-destructive">Pago Cancelado</h1>
            <p className="text-muted-foreground font-exo">
              La transacción no se ha completado. Si tuviste problemas técnicos, por favor intenta con otro método de pago.
            </p>
          </div>

          <Button asChild className="w-full font-bold">
            <Link href="/portal/billing">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Volver a Intentar
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
