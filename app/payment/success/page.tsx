'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ChevronLeft, Share2 } from 'lucide-react';
import Link from 'next/link';

import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const [reference, setReference] = useState<string | null>(null);

  useEffect(() => {
    const ref = searchParams.get('id') || searchParams.get('reference');
    if (ref) setReference(ref);
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="max-w-lg w-full border-primary/20 backdrop-blur-xl bg-card/80">
        <CardContent className="pt-12 pb-8 flex flex-col items-center text-center space-y-6">
          <div className="rounded-full bg-green-500/20 p-6">
            <CheckCircle2 className="h-16 w-16 text-green-500 animate-bounce" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-orbitron font-bold gradient-text">¡Pago Exitoso!</h1>
            <p className="text-muted-foreground font-exo">
              Tu contribución está siendo procesada. Tu estatus premium se actualizará en unos instantes.
            </p>
          </div>

          {reference && (
            <div className="w-full p-4 rounded-lg bg-primary/5 border border-primary/10">
              <p className="text-[10px] text-muted-foreground uppercase font-orbitron tracking-widest mb-1">Referencia de Transacción</p>
              <p className="text-sm font-mono font-bold break-all">{reference}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 w-full">
            <Button asChild variant="outline" className="font-bold">
              <Link href="/">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Ir al Portal
              </Link>
            </Button>
            <Button className="font-bold">
              <Share2 className="mr-2 h-4 w-4" />
              Compartir
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
