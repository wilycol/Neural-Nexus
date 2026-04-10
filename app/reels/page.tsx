"use client";

import React, { Suspense } from "react";
import { ReelsFeed } from "@/components/reels-feed";
import { Loader2 } from "lucide-react";

export default function ReelsPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] bg-black text-white/60">
        <Loader2 className="h-8 w-8 text-neon-blue animate-spin mb-4" />
        <span className="font-orbitron tracking-widest text-sm uppercase">Sincronizando Reels...</span>
      </div>
    }>
      <ReelsFeed />
    </Suspense>
  );
}
