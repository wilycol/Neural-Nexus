"use client";

import React from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Crown, ArrowLeft } from "lucide-react";

export default function PremiumPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      <main className="md:ml-64 pt-16">
        <div className="container mx-auto px-4 py-6 max-w-5xl">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              Volver al inicio
            </Link>
          </Button>
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center">
                  <Crown className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold font-orbitron">Premium</h1>
                  <p className="text-muted-foreground">Sin anuncios y contenido exclusivo</p>
                </div>
              </div>
              <div className="rounded-lg border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">$4/mes</h2>
                    <p className="text-sm text-muted-foreground">Acceso completo al portal sin anuncios</p>
                  </div>
                  <Button className="bg-gradient-to-r from-neon-blue to-neon-purple text-white hover:opacity-90">
                    Próximamente
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
