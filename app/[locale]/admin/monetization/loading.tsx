import { ShieldAlert } from "lucide-react";

export default function MonetizationLoading() {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
      <div className="text-center space-y-6">
        <div className="relative">
          <div className="h-24 w-24 rounded-full border-4 border-neon-blue/20 border-t-neon-blue animate-spin mx-auto" />
          <ShieldAlert className="h-8 w-8 text-neon-blue absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-orbitron font-bold text-white tracking-[0.3em] uppercase">
            Accediendo al Búnker
          </h1>
          <p className="text-zinc-500 text-[10px] tracking-widest uppercase animate-pulse">
            Sincronizando Inteligencia Industrial de Beatriz...
          </p>
        </div>
      </div>
    </div>
  );
}
