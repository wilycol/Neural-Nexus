import React from "react";
import Link from "next/link";
import { ArrowRight, Briefcase, Building2, CheckCircle2, ShieldCheck, Sparkles, UserCheck } from "lucide-react";

export default function CareersHubPage({ params }: { params: { locale: string } }) {
  const locale = params.locale || "es";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header Hero */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Neural Nexus Talent Hub
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-cyan-200 to-cyan-500 bg-clip-text text-transparent">
            Centro de Reclutamiento & Atracción de Talento
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Únete a la Federación Neural Nexus. Diseñamos la nueva generación de infraestructura multi-agente, inteligencia artificial autónoma y nodos web de alto impacto.
          </p>
        </div>

        {/* Featured Open Vacancies */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
              <Briefcase className="w-6 h-6 text-cyan-400" /> Vacantes Destacadas (Activas)
            </h2>
            <span className="text-xs text-slate-400">Proceso de Selección Automatizado ATS</span>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Vacante 1: Principal AI Systems Architect */}
            <div className="bg-slate-900/90 border border-cyan-500/40 rounded-2xl p-6 sm:p-8 hover:border-cyan-400 transition-all shadow-xl shadow-cyan-950/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 px-4 py-1.5 bg-gradient-to-l from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs rounded-bl-xl tracking-wide uppercase">
                Prioridad Alta (Score Match &gt; 90%)
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/30">
                    <Building2 className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                      Principal AI Systems Architect & Lead Autonomous Agent Engineer
                    </h3>
                    <p className="text-xs text-cyan-400 font-mono">Neural Nexus Global Core | Remoto / Bogotá, Colombia</p>
                  </div>
                </div>

                <p className="text-slate-300 text-sm leading-relaxed">
                  Buscamos a un Arquitecto de Sistemas de IA Senior para liderar el desarrollo y despliegue de agentes autónomos de alta precisión, sistemas distribuidos en TypeScript/Python, infraestructuras anti-detección y arquitecturas multi-modelo (Groq, Zhipu, Wan 2.2, OpenAI, Gemini).
                </p>

                <div className="flex flex-wrap gap-2 text-xs font-mono">
                  <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">TypeScript / Python</span>
                  <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">Multi-Agent Systems</span>
                  <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">Anti-Detección & Stealth Automation</span>
                  <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">QA & Resiliencia</span>
                  <span className="px-2.5 py-1 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-500/40">$90K - $140K USD/Año</span>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> Verificación ATS y Telemetría Fénix Activa
                  </div>

                  <Link
                    href={`/${locale}/careers/ai-lead-architect`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all hover:scale-105"
                  >
                    Ver Vacante & Postularse <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-800">
          <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 space-y-2">
            <UserCheck className="w-6 h-6 text-cyan-400" />
            <h4 className="font-semibold text-white">Evaluación Directa ATS</h4>
            <p className="text-xs text-slate-400">Revisión automatizada e inmediatez de respuesta impulsada por la Serie X Elite de Beatriz AI.</p>
          </div>
          <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 space-y-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            <h4 className="font-semibold text-white">Trabajo 100% Remoto</h4>
            <p className="text-xs text-slate-400">Opera desde cualquier lugar del mundo con sincronización asíncrona mediante el Búnker Neural.</p>
          </div>
          <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 space-y-2">
            <Sparkles className="w-6 h-6 text-purple-400" />
            <h4 className="font-semibold text-white">Compensación Competitiva</h4>
            <p className="text-xs text-slate-400">Tarifas en USD por hora o salario anual garantizado con incentivos de equidad tecnológica.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
