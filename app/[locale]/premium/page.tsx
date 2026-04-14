"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { SubscriptionCard } from "@/components/payment/subscription-card";
import { DonationBox } from "@/components/payment/donation-box";
import { HonorWall } from "@/components/payment/honor-wall";
import { PaymentModal } from "@/components/payment/payment-modal";
import { useState } from "react";

export default function PremiumPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'wompi' | 'binance' | null>(null);

  const handleSubscribe = (method: 'wompi' | 'binance') => {
    setSelectedMethod(method);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Button variant="ghost" size="sm" asChild className="mb-8 hover:bg-primary/10 transition-colors">
          <Link href="/" className="gap-2 font-orbitron text-xs">
            <ArrowLeft className="h-4 w-4" />
            VOLVER AL NEXUS
          </Link>
        </Button>

        <section className="text-center mb-16 space-y-4">
          <h1 className="text-5xl md:text-7xl font-orbitron font-bold tracking-tighter gradient-text uppercase">
            Membresía Nexus
          </h1>
          <p className="text-muted-foreground font-exo text-lg max-w-2xl mx-auto">
            Acceso ilimitado, sin anuncios y con funciones exclusivas de IA para los exploradores de la nueva era.
          </p>
        </section>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Columna Izquierda: Suscripción */}
          <div className="space-y-4">
            <h2 className="text-sm font-orbitron uppercase tracking-widest text-primary ml-1">Suscripción</h2>
            <SubscriptionCard onSubscribe={handleSubscribe} />
          </div>

          {/* Columna Central: Donación */}
          <div className="space-y-4">
            <h2 className="text-sm font-orbitron uppercase tracking-widest text-primary ml-1">Donación Única</h2>
            <DonationBox />
          </div>

          {/* Columna Derecha: Muro de Honor */}
          <div className="space-y-4">
            <h2 className="text-sm font-orbitron uppercase tracking-widest text-primary ml-1">Muro de Honor</h2>
            <HonorWall />
          </div>
        </div>

        <PaymentModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          method={selectedMethod}
          amount={4.0} // Precio fijo de la suscripción
        />
      </div>
    </div>
  );
}
