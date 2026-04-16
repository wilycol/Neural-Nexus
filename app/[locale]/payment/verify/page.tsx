'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function PaymentVerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('payment.verify');
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');

  useEffect(() => {
    // Simulamos la verificación del pago con Wompi
    // En producción, aquí haríamos un fetch a nuestro backend con el id de transacción
    const timer = setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        router.push('/payment/success');
      }, 2000);
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-[#020817] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] animate-pulse delay-700" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-slate-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-3xl text-center relative z-10"
      >
        {status === 'verifying' && (
          <div className="space-y-6">
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse" />
              <Loader2 className="w-24 h-24 text-blue-500 animate-spin relative z-10" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
               Neural Verification
            </h1>
            <p className="text-slate-400 text-lg">
              Sincronizando con la red de pagos...
            </p>
            
            <div className="flex items-center justify-center gap-2 text-xs text-blue-400/60 uppercase tracking-widest font-mono">
              <ShieldCheck className="w-4 h-4" />
              <span>Protocolo Seguro SSL-256</span>
            </div>
          </div>
        )}

        {status === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl" />
              <CheckCircle2 className="w-24 h-24 text-green-400 relative z-10" />
            </div>
            <h1 className="text-3xl font-bold text-white">
              ¡Pago Confirmado!
            </h1>
            <p className="text-slate-400">
              Tu acceso a Neural Sites SaaS se ha activado exitosamente. Recalibrando interfaz...
            </p>
            <div className="flex items-center justify-center gap-2 text-green-400/80">
              <Zap className="w-5 h-5 animate-pulse" />
              <span className="font-mono text-sm tracking-tighter">RED NEURAL OPTIMIZADA</span>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Grid Pattern Background */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] grayscale invert bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
    </div>
  );
}
