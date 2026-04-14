"use client";

import React from "react";
import { ChevronLeft, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background p-6 md:p-12 lg:p-24 selection:bg-neon-blue/30">
      <div className="mx-auto max-w-4xl space-y-12">
        {/* Back Navigation */}
        <button 
          onClick={() => router.back()}
          className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground bg-transparent border-none cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Atrás
        </button>

        <div className="flex items-center gap-4 border-b pb-8">
          <div className="rounded-xl bg-neon-blue/10 p-3 text-neon-blue">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tighter sm:text-5xl">
              Centro de <span className="text-muted-foreground">Gobernanza</span>
            </h1>
            <p className="mt-2 text-muted-foreground">Transparencia, ética e integridad en Neural Nexus.</p>
          </div>
        </div>

        <div className="prose prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-neon-blue hover:prose-a:underline">
          {children}
        </div>

        <footer className="mt-24 border-t pt-12 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Neural Nexus. Todos los derechos reservados.</p>
          <p className="mt-2 italic">Protegido por Beatriz AI Law Enforcement System.</p>
        </footer>
      </div>
    </div>
  );
}
