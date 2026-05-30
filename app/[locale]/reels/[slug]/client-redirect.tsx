"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export function ClientRedirect({ newsId }: { newsId: string }) {
  const router = useRouter();

  useEffect(() => {
    // Redirige instantáneamente al visor de reels con el ID específico
    router.replace(`/reels?id=${newsId}`);
  }, [newsId, router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white/60">
      <Loader2 className="h-10 w-10 text-neon-blue animate-spin mb-4" />
      <span className="font-orbitron tracking-widest text-sm uppercase text-white/80">
        Iniciando Sincronización Neural...
      </span>
    </div>
  );
}
