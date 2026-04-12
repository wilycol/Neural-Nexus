import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Globe, 
  Terminal, 
  Zap, 
  Database,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';

export default function DevelopersPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-neon-blue/30">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[center_top] pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-neon-blue/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-neon-blue/10 text-neon-blue border-neon-blue/20 px-4 py-1 font-orbitron text-[10px] tracking-[0.2em] uppercase">
              Neural Connect v1.0
            </Badge>
            <h1 className="text-5xl md:text-7xl font-orbitron font-bold tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
              INFRAESTRUCTURA DE NOTICIAS IA <br /> PARA LA ERA INDUSTRIAL
            </h1>
            <p className="text-xl text-zinc-400 mb-10 leading-relaxed font-light font-sans max-w-2xl mx-auto">
              Integra el cerebro de Neural Nexus en tus propias aplicaciones. Distribución masiva de contenido generado por IA mediante API y Widgets White-Label.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="bg-neon-blue hover:bg-neon-blue/80 text-black font-bold font-orbitron tracking-wider px-8 h-14 w-full sm:w-auto">
                <Link href="/under-construction">SOLICITAR API KEY</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/10 hover:bg-white/5 font-bold font-orbitron tracking-wider px-8 h-14 w-full sm:w-auto">
                <Link href="/under-construction">VER DOCUMENTACIÓN</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Three-Column API Feature Section */}
      <section className="py-24 border-b border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            {/* Left: Concepts */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="p-3 w-fit rounded-lg bg-neon-blue/10 border border-neon-blue/20">
                  <Terminal className="h-6 w-6 text-neon-blue" />
                </div>
                <h3 className="text-2xl font-orbitron font-bold">Neural Connect API</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Accede a nuestro flujo de noticias procesadas y enriquecidas por Beatriz. Datos estructurados en JSON listos para alimentar tus dashboards industriales.
                </p>
              </div>
              
              <ul className="space-y-4">
                {[
                  { icon: Database, text: "Noticias en tiempo real" },
                  { icon: ShieldCheck, text: "Autenticación segura JWT" },
                  { icon: Zap, text: "Latencia ultra-baja" },
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-zinc-300">
                    <item.icon className="h-4 w-4 text-neon-blue" />
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>

            {/* Middle: The Code Sandbox Mockup */}
            <div className="lg:col-span-2 relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-neon-blue/20 to-purple-500/20 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative bg-zinc-900/50 border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm shadow-2xl">
                <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                  </div>
                  <div className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">GET /api/v1/news</div>
                </div>
                <div className="p-6 font-mono text-sm overflow-x-auto">
                  <div className="flex gap-4">
                    <span className="text-neon-blue select-none">1</span>
                    <span className="text-zinc-500">fetch</span>
                    <span className="text-white">(&apos;https://api.neuralnexus.ai/v1/news&apos;, {'{'}</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-neon-blue select-none">2</span>
                    <span className="text-white ml-8">headers: {'{'}</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-neon-blue select-none">3</span>
                    <span className="text-purple-400 ml-16">&apos;Authorization&apos;:</span>
                    <span className="text-green-400">&apos;Bearer YOUR_API_KEY&apos;</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-neon-blue select-none">4</span>
                    <span className="text-white ml-8">{'}'}</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-neon-blue select-none">5</span>
                    <span className="text-white">{'}'})</span>
                  </div>
                  <div className="flex gap-4 mt-4">
                    <span className="text-neon-blue select-none">6</span>
                    <span className="text-zinc-500">.then</span>
                    <span className="text-white">(res =&gt; res.json())</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-neon-blue select-none">7</span>
                    <span className="text-zinc-500">.then</span>
                    <span className="text-white">(data =&gt; console.log(data));</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Widget Section (Minimalist focus) */}
      <section className="py-24 bg-zinc-950/50 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-orbitron font-bold mb-4">NEURAL EMBED</h2>
            <p className="text-zinc-400">
              Lleva la curación industrial de Neural Nexus a tu portal con nuestro widget minimalista. 
              Zero-config, CSS-injectable y listo para producción.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="p-6 rounded-xl border border-white/5 bg-white/[0.02]">
                <h4 className="text-neon-blue font-bold mb-2">Instalación</h4>
                <div className="bg-black p-4 rounded-lg font-mono text-xs text-zinc-400 border border-white/5">
                  &lt;script src=&quot;https://nexus.ai/sdk.js&quot;&gt;&lt;/script&gt;<br />
                  &lt;div id=&quot;nexus-widget&quot; data-key=&quot;DEV_KEY&quot;&gt;&lt;/div&gt;
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 border-l-2 border-neon-blue bg-neon-blue/5">
                <Zap className="h-5 w-5 text-neon-blue" />
                <span className="text-sm font-light">Carga asíncrona que no afecta el SEO ni el performance de tu sitio.</span>
              </div>
            </div>

            <div className="relative p-8 bg-zinc-900 border border-white/10 rounded-2xl">
              <div className="absolute top-0 right-0 p-2 opacity-20">
                <Globe className="h-24 w-24 text-neon-blue" />
              </div>
              <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mb-4">Neural News Widget (Preview)</div>
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="pb-4 border-b border-white/5 last:border-0">
                    <Badge variant="outline" className="text-[8px] mb-2 border-neon-blue/30 text-neon-blue">SOFTWARE</Badge>
                    <h5 className="text-sm font-bold truncate">NVIDIA lanza Blackwell: El futuro de la inferencia IA</h5>
                    <div className="flex justify-between items-center mt-2">
                       <span className="text-[10px] text-zinc-500">neuralnexus.ai</span>
                       <span className="text-[10px] text-neon-blue font-bold tracking-tighter">VER MÁS</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SaaS Pricing Mockup Section */}
      <section className="py-24 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-orbitron font-bold mb-4">PLANES SAAS API</h2>
            <p className="text-zinc-400">Escala tu distribución de contenido con el modelo que mejor se adapte a tu volumen.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Dev / Free", price: "$0", features: ["1,000 requests/mo", "Widget básico", "Soporte comunitario"] },
              { name: "SaaS Pro", price: "$99", features: ["100,000 requests/mo", "Widget customizable", "Webhooks", "Soporte 24/7"], primary: true },
              { name: "Enterprise", price: "Custom", features: ["Unlimited requests", "Full White Label", "SLA garantizado", "Consultoría IA"] },
            ].map((plan, i) => (
              <div key={i} className={`p-8 rounded-2xl border ${plan.primary ? 'border-neon-blue bg-neon-blue/5 shadow-[0_0_30px_rgba(0,243,255,0.1)]' : 'border-white/10 bg-zinc-900/50'} relative overflow-hidden`}>
                {plan.primary && <div className="absolute top-4 right-4"><Zap className="h-6 w-6 text-neon-blue fill-neon-blue" /></div>}
                <div className="text-xl font-orbitron font-bold mb-2">{plan.name}</div>
                <div className="text-4xl font-bold mb-6">{plan.price}<span className="text-sm text-zinc-500 font-normal">/mes</span></div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-zinc-400">
                      <div className="h-1.5 w-1.5 rounded-full bg-neon-blue" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button className={`w-full ${plan.primary ? 'bg-neon-blue text-black' : 'bg-white/5 hover:bg-white/10 text-white border-white/10'} font-bold font-orbitron`}>
                  SELECCIONAR PLAN
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Footer CTA */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-orbitron font-bold mb-8 italic text-zinc-400">&quot;El único límite es tu capacidad de integración.&quot;</h2>
          <Link href="/">
             <Button variant="link" className="text-zinc-500 hover:text-neon-blue transition-colors">
               Volver al Portal Neural Nexus
             </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
