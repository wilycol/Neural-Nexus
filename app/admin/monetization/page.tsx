import React from 'react';
import { getSupabaseServerClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { 
  getBeatrizAdvisorMissions, 
  generateShareLinks, 
  METAS_VOLANTES 
} from "@/lib/ai-advisor";
import { 
  Zap, 
  Target, 
  TrendingUp, 
  MousePointer2, 
  Users, 
  DollarSign, 
  ShieldAlert, 
  CheckCircle2, 
  Send,
  Smartphone,
  Trophy,
  History,
  LayoutDashboard
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export default async function MonetizationAdminPage() {
  const supabase = getSupabaseServerClient();

  // 1. Seguridad: Solo Admins
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/perfil");

  const { data: userData } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (userData?.role !== "admin") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <ShieldAlert className="h-16 w-16 text-red-500 mx-auto animate-pulse" />
          <h1 className="text-2xl font-orbitron font-bold text-white tracking-widest">ACCESO RESTRINGIDO</h1>
          <p className="text-zinc-500 uppercase text-xs tracking-tighter">Solo personal autorizado por Beatriz</p>
        </div>
      </div>
    );
  }

  // 2. Obtener Datos del Búnker
  const { data: overviewData } = await supabase.rpc('get_monetization_overview');
  const stats = overviewData[0];
  const advisor = await getBeatrizAdvisorMissions();
  
  const currentTotal = Number(stats.engine_3_revenue) || 0;
  const currentGoal = advisor.current_goal;
  const progressPercent = (currentTotal / currentGoal) * 100;

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-8 font-sans selection:bg-neon-blue/30">
      {/* Header Central de Mando */}
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 mb-12 border-b border-white/5 pb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-neon-blue/10 rounded-xl border border-neon-blue/20">
            <LayoutDashboard className="h-8 w-8 text-neon-blue" />
          </div>
          <div>
            <h1 className="text-3xl font-orbitron font-bold tracking-tighter">BEATRIZ STRATEGY BUNKER</h1>
            <p className="text-xs text-zinc-500 font-bold tracking-[0.3em] uppercase">Sector de Inteligencia Industrial / Admin Panel</p>
          </div>
        </div>
        <div className="flex gap-4">
           <Badge variant="outline" className="px-4 py-2 border-neon-blue/20 text-neon-blue bg-neon-blue/5">
              ESTADO: {advisor.tone === 'strategic_partner' ? 'ESTRATÉGICO' : 'DISCIPLINA MILITAR'}
           </Badge>
           <Badge variant="outline" className="px-4 py-2 border-green-500/20 text-green-500 bg-green-500/5">
              NET REVENUE: ${currentTotal.toLocaleString()} USD
           </Badge>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUMNA IZQUIERDA: THE BARBIE TRACKER (Metas Volantes) */}
        <div className="lg:col-span-2 space-y-8">
          
          <Card className="bg-zinc-900/50 border-white/10 overflow-hidden relative shadow-2xl">
            <div className="absolute top-0 right-0 p-4 opacity-5">
               <Trophy className="h-32 w-32 text-neon-blue" />
            </div>
            <CardHeader>
              <CardTitle className="font-orbitron text-xl flex items-center gap-3">
                <Target className="h-5 w-5 text-neon-blue" />
                EL CAMINO A LA VICTORIA ($30K)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-10">
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                   <div className="space-y-1">
                      <span className="text-[10px] font-bold text-zinc-500 tracking-[0.2em] uppercase">Meta Actual</span>
                      <h3 className="text-4xl font-bold font-orbitron">${currentGoal.toLocaleString()}</h3>
                   </div>
                   <div className="text-right">
                      <span className="text-[10px] font-bold text-zinc-500 tracking-[0.2em] uppercase">Progreso</span>
                      <h3 className="text-2xl font-bold text-neon-blue">{progressPercent.toFixed(1)}%</h3>
                   </div>
                </div>
                <Progress value={progressPercent} className="h-4 bg-white/5 border border-white/10" />
              </div>

              {/* Hitos x10 */}
              <div className="grid grid-cols-4 gap-4">
                 {METAS_VOLANTES.map((milestone) => (
                   <div key={milestone} className={`text-center space-y-2 p-3 rounded-lg border transition-all ${currentTotal >= milestone ? 'bg-neon-blue/10 border-neon-blue/40' : 'bg-white/5 border-white/5 opacity-50'}`}>
                      <div className="text-[10px] font-bold tracking-tighter uppercase">${milestone.toLocaleString()}</div>
                      {currentTotal >= milestone ? <CheckCircle2 className="h-4 w-4 text-neon-blue mx-auto" /> : <div className="h-4 w-4" />}
                   </div>
                 ))}
              </div>
            </CardContent>
          </Card>

          {/* Grid de los 6 Motores */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: "Motor 1: Ads", value: stats.engine_1_clicks, icon: MousePointer2, color: "text-blue-400" },
              { label: "Motor 2: Afiliados", value: stats.engine_2_clicks, icon: TrendingUp, color: "text-green-400" },
              { label: "Motor 3: Premium", value: `$${stats.engine_3_revenue}`, icon: DollarSign, color: "text-purple-400" },
              { label: "Motor 4: Leads", value: stats.engine_4_subs, icon: Users, color: "text-orange-400" },
              { label: "Motor 5: Partners", value: stats.engine_5_leads, icon: Zap, color: "text-yellow-400" },
              { label: "Motor 6: API Hits", value: stats.engine_6_usage, icon: Smartphone, color: "text-pink-400" },
            ].map((engine, idx) => (
              <Card key={idx} className="bg-zinc-900/50 border-white/5 hover:border-white/10 transition-colors">
                <CardContent className="p-6">
                   <div className="flex items-center gap-3 mb-3">
                      <engine.icon className={`h-4 w-4 ${engine.color}`} />
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none">{engine.label}</span>
                   </div>
                   <div className="text-2xl font-bold font-orbitron">{engine.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* COLUMNA DERECHA: ASESORÍA DE BEATRIZ Y MISIONES */}
        <div className="space-y-8">
          
          {/* Beatriz Insights */}
          <Card className={`border-none shadow-2xl relative overflow-hidden ${advisor.tone === 'strategic_partner' ? 'bg-gradient-to-br from-neon-blue/20 to-black' : 'bg-gradient-to-br from-red-500/20 to-black'}`}>
             <div className="absolute inset-0 bg-grid-white/[0.05] pointer-events-none" />
             <CardHeader className="relative">
                <CardTitle className={`text-sm font-orbitron font-bold tracking-[0.2em] flex items-center gap-2 ${advisor.tone === 'strategic_partner' ? 'text-neon-blue' : 'text-red-500'}`}>
                   <ShieldAlert className="h-4 w-4" />
                    {advisor.title}
                </CardTitle>
             </CardHeader>
             <CardContent className="relative space-y-6">
                <p className="text-lg leading-relaxed font-light italic text-white/90">
                  {advisor.message}
                </p>
                <div className="flex items-center gap-4 border-t border-white/10 pt-6">
                   <div className={`h-2 w-2 rounded-full animate-pulse ${advisor.priority === 'critical' ? 'bg-red-500' : 'bg-neon-blue'}`} />
                   <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Nivel de Urgencia: {advisor.priority}</span>
                </div>
             </CardContent>
          </Card>

          {/* Misiones de Combate */}
          <Card className="bg-zinc-900 border-white/10 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-sm font-orbitron flex items-center gap-2">
                 <Zap className="h-4 w-4 text-neon-blue" />
                 MISIONES DE COMBATE ACTUALES
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {advisor.missions.map((mission) => (
                <div key={mission.id} className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-4 group">
                  <div className="flex justify-between items-start gap-4">
                    <h5 className="text-sm font-bold leading-tight group-hover:text-neon-blue transition-colors">
                      {mission.title}
                    </h5>
                    <Badge className="text-[8px] bg-white/10 text-zinc-400 border-none">{mission.type}</Badge>
                  </div>
                  
                  {/* Messaging Bridge */}
                  <div className="grid grid-cols-2 gap-2">
                     <Button 
                       variant="outline" 
                       size="sm" 
                       className="text-[10px] h-8 border-white/5 hover:bg-green-500/20 hover:text-green-500"
                       asChild
                     >
                        <a href={generateShareLinks(mission.title, mission.url || '').whatsapp} target="_blank">
                          <Send className="h-3 w-3 mr-2" />
                          WHATSAPP
                        </a>
                     </Button>
                     <Button 
                       variant="outline" 
                       size="sm" 
                       className="text-[10px] h-8 border-white/5 hover:bg-blue-500/20 hover:text-blue-500"
                       asChild
                     >
                        <a href={generateShareLinks(mission.title, mission.url || '').telegram} target="_blank">
                          <Send className="h-3 w-3 mr-2" />
                          TELEGRAM
                        </a>
                     </Button>
                  </div>
                </div>
              ))}
              <Button className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-zinc-400 font-orbitron text-[10px] tracking-widest uppercase">
                 <History className="h-3 w-3 mr-2" />
                 VER HISTORIAL DE MISIONES
              </Button>
            </CardContent>
          </Card>

        </div>
      </main>
      
      {/* Footer Industrial */}
      <footer className="max-w-7xl mx-auto mt-20 text-center opacity-20 hover:opacity-100 transition-opacity">
        <p className="text-[10px] font-orbitron tracking-[0.5em] text-zinc-600">BEATRIZ CO-CEO OPERATING SYSTEM v2.0 // NEURAL NEXUS</p>
      </footer>
    </div>
  );
}
