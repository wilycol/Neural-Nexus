import React from 'react';
import Link from 'next/link';
import { 
  Cpu, 
  Brain, 
  Code2, 
  Video, 
  Image as ImageIcon, 
  Zap, 
  Heart,
  ChevronLeft,
  Crown
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CreditCardProps {
  title: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  svgLogo?: React.ReactNode;
}

const CreditCard = ({ title, name, description, icon: Icon, color, svgLogo }: CreditCardProps) => (
  <div className="relative group overflow-hidden rounded-2xl border bg-background/50 p-6 backdrop-blur-xl transition-all hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10">
    <div className={`absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-10 blur-2xl transition-all group-hover:opacity-20 ${color}`} />
    
    <div className="relative flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className={`rounded-xl p-3 bg-opacity-10 ${color}`}>
          {svgLogo ? (
            <div className="h-6 w-6">
              {svgLogo}
            </div>
          ) : (
            <Icon className={`h-6 w-6 ${color.replace('bg-', 'text-')}`} />
          )}
        </div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-50">
          {title}
        </div>
      </div>
      
      <div>
        <h3 className="text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
          {name}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  </div>
);

const SectionTitle = ({ children, subtitle }: { children: React.ReactNode, subtitle?: string }) => (
  <div className="mb-12 text-center md:text-left">
    <h2 className="text-4xl font-extrabold tracking-tighter sm:text-5xl">
      <span className="bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent">
        {children}
      </span>
    </h2>
    {subtitle && (
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        {subtitle}
      </p>
    )}
  </div>
);

export default function CreditsPage() {
  return (
    <div className="min-h-screen bg-background selection:bg-neon-blue/30">
      <div className="container relative mx-auto px-4 py-16 md:py-24">
        {/* Abstract Background Effects */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-1/4 -top-1/4 h-[800px] w-[800px] rounded-full bg-neon-blue/5 blur-[120px]" />
          <div className="absolute -right-1/4 bottom-0 h-[600px] w-[600px] rounded-full bg-neon-purple/5 blur-[120px]" />
        </div>

        {/* Back Navigation */}
        <Link href="/" className="group mb-12 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
          <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Volver al portal
        </Link>

        {/* Hero Section */}
        <div className="mb-32 space-y-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-neon-purple/20 bg-neon-purple/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-neon-purple animate-pulse">
                🤝 Alianza Estratégica
            </div>
          <h1 className="text-5xl font-black tracking-tighter sm:text-7xl">
            Créditos y <br />
            <span className="bg-gradient-to-b from-foreground to-foreground/50 bg-clip-text text-transparent">Colaboradores</span>
          </h1>
          <p className="mx-auto max-w-3xl text-xl text-muted-foreground md:text-2xl leading-relaxed">
            Neural Nexus no es el resultado de un solo individuo, sino el fruto de la perfecta sincronía entre el ingenio humano y la potencia computacional más avanzada del siglo XXI.
          </p>
        </div>

        {/* Human Leadership */}
        <section className="mb-40">
          <SectionTitle subtitle="Visionario, orquestador y arquitecto jefe del ecosistema Neural Nexus.">
            Liderazgo Humano
          </SectionTitle>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="relative overflow-hidden rounded-3xl border border-neon-blue/20 bg-gradient-to-br from-neon-blue/10 via-background to-background p-8 lg:p-12">
              <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-neon-blue/10 to-transparent opacity-50" />
              <div className="relative flex flex-col md:flex-row items-center gap-8">
                <div className="h-32 w-32 shrink-0 rounded-2xl bg-gradient-to-br from-neon-blue to-neon-purple p-1 shadow-2xl shadow-neon-blue/20">
                  <div className="flex h-full w-full items-center justify-center rounded-xl bg-background text-4xl font-black">
                    W
                  </div>
                </div>
                <div className="text-center md:text-left">
                  <div className="mb-2 flex items-center justify-center md:justify-start gap-2 text-xs font-bold uppercase tracking-widest text-neon-blue">
                    <Crown className="h-3 w-3" /> Fundador
                  </div>
                  <h3 className="text-3xl font-extrabold tracking-tight md:text-4xl">WilyCol</h3>
                  <p className="mt-2 text-xl font-medium text-muted-foreground">WilyDevs Architecture</p>
                  <p className="mt-6 max-w-md text-muted-foreground leading-relaxed">
                    Responsable de la visión estratégica, la dirección creativa y la integración técnica final que da vida a este portal independiente.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI Brains & Orchestrators */}
        <section className="mb-32">
          <SectionTitle subtitle="Los modelos fundacionales que procesan la realidad y la convierten en inteligencia compartida.">
            Cerebros y Orquestadores
          </SectionTitle>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <CreditCard 
              title="Razonamiento Central"
              name="OpenAI (GPT-5)"
              description="Nuestra base de conocimiento y orquestador de lógica gramatical y estructural de alto nivel."
              icon={Brain}
              color="bg-emerald-500"
              svgLogo={<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M22.282 9.821a5.984 5.984 0 0 0-.51-4.915 6.046 6.046 0 0 0-4.131-2.733 6.11 6.11 0 0 0-4.663 1.205 6.128 6.128 0 0 0-2.316-1.123 6.069 6.069 0 0 0-4.613.91 6.006 6.006 0 0 0-2.734 4.14 6.05 6.05 0 0 0 1.258 4.709 5.969 5.969 0 0 0 .51 4.915 6.051 6.051 0 0 0 4.131 2.733 6.11 6.11 0 0 0 4.663-1.205 6.128 6.128 0 0 0 2.316 1.123 6.069 6.069 0 0 0 4.613-.91 6.006 6.006 0 0 0 2.734-4.14 6.05 6.05 0 0 0-1.258-4.709zm-9.394 6.79l-2.892-1.67V11.6l2.892-1.67 2.892 1.67v3.341l-2.892 1.67zm-6.23-2.39L3.766 12.56l2.892-5.01 2.892 1.67-2.892 5.002v.001zm0-7.39l-2.892 5.01-2.892-1.67L3.766 7.55l2.892-1.67.001.002zm6.23-.74l-2.892 1.67V4.22l2.892-1.67 2.892 1.67V6.09l-2.892-1.671zm6.23 2.39L20.234 11.4l-2.892 5.01-2.892-1.67 2.892-5.01-.001-.001zm0 7.39l2.892-5.01 2.892 1.67-2.892 5.01-2.892-1.67v-.001z"/></svg>}
            />
            <CreditCard 
              title="Visión de Ecosistema"
              name="Grok AI"
              description="Analista de tendencias en tiempo real y pieza clave en la construcción del ecosistema Neural Nexus."
              icon={Zap}
              color="bg-blue-400"
              svgLogo={<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>}
            />
            <CreditCard 
              title="Arquitectura Agente"
              name="Antigravity (Google)"
              description="Colaborador principal en la codificación agente y optimización de flujos de trabajo inteligentes."
              icon={Code2}
              color="bg-neon-blue"
            />
          </div>
        </section>

        {/* Development & IDEs */}
        <section className="mb-32">
          <SectionTitle subtitle="Las herramientas que nos permiten materializar el código a la velocidad del pensamiento.">
            Infraestructura de Desarrollo
          </SectionTitle>
          <div className="grid gap-6 sm:grid-cols-2">
            <CreditCard 
              title="Entorno Inteligente"
              name="Trae IDE"
              description="Orquestador de desarrollo y acelerador de procesos de ingeniería para la industrialización del portal."
              icon={Code2}
              color="bg-neon-purple"
            />
            <CreditCard 
              title="Diseño y UX"
              name="Shadcn/UI & Tailwind"
              description="La base visual sobre la cual se erige nuestra estética Cyberpunk y experiencia de usuario fluida."
              icon={Heart}
              color="bg-sky-400"
            />
          </div>
        </section>

        {/* Resources & Processing */}
        <section className="mb-32">
          <SectionTitle subtitle="Los engranajes que procesan datos masivos y generan arte en microsegundos.">
            Suministro de Recursos
          </SectionTitle>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <CreditCard 
              title="LPU Inference"
              name="Groq"
              description="Potencia de procesamiento de texto líder en la industria."
              icon={Zap}
              color="bg-orange-500"
            />
            <CreditCard 
              title="Generación de Arte"
              name="Pollinations.ai"
              description="El motor creativo detrás de cada imagen única."
              icon={ImageIcon}
              color="bg-neon-pink"
            />
            <CreditCard 
              title="Voz e Inteligencia"
              name="AssemblyAI"
              description="Expertos en procesamiento de audio y transcripción industrial."
              icon={Cpu}
              color="bg-purple-500"
            />
             <CreditCard 
              title="Visión Creativa"
              name="Imagine by Grok"
              description="Suministro de activos visuales disruptivos para la narrativa del portal."
              icon={Brain}
              color="bg-indigo-400"
            />
          </div>
        </section>

        {/* Video Producers */}
        <section className="mb-32">
          <SectionTitle subtitle="La vanguardia cinematográfica de la IA aplicada a contenido vertical y dinámico.">
            Producción Audiovisual
          </SectionTitle>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <CreditCard 
              title="Next-Gen Video"
              name="Alibaba Wanx (Wan)"
              description="Generación de video fotorrealista y dinámico."
              icon={Video}
              color="bg-red-500"
            />
            <CreditCard 
              title="Transformación"
              name="Kaiber"
              description="Animación y morphing de video para Reels estéticos."
              icon={Video}
              color="bg-yellow-400"
            />
            <CreditCard 
              title="Cinemática"
              name="Luma Dream Machine"
              description="Relatos visuales de alta coherencia."
              icon={Video}
              color="bg-violet-400"
            />
             <CreditCard 
              title="Cine IA"
              name="Pika Labs"
              description="Especialista en movimiento y atmósfera cinematográfica."
              icon={Video}
              color="bg-background"
            />
          </div>
        </section>

        {/* Closing Quote */}
        <div className="relative mt-40 rounded-3xl border border-neon-blue/20 bg-muted/30 p-12 text-center md:p-24 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink" />
            <SectionTitle subtitle="">
                El Futuro es Colaborativo
            </SectionTitle>
            <p className="mx-auto max-w-2xl text-xl italic text-muted-foreground">
                &quot;Este portal no solo publica noticias sobre Inteligencia Artificial; es una demostración viva de su poder cuando se une al liderazgo humano de WilyCol. Esto es Neural Nexus.&quot;
            </p>
            <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
                <Button className="bg-neon-blue text-white" asChild>
                    <Link href="/">Ir al Inicio</Link>
                </Button>
                <Button variant="outline" className="border-neon-purple/50 text-neon-purple" asChild>
                    <Link href="/premium">Pásate a Premium</Link>
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
}
