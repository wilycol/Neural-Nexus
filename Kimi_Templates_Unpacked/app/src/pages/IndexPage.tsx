import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { templates } from '@/data/templates';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/ScrollReveal';
import { ArrowRight, Sparkles } from 'lucide-react';

export function IndexPage() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="bg-void min-h-screen">
      <Navigation />

      {/* Hero */}
      <section id="hero" className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 50% 30%, rgba(0, 240, 255, 0.08) 0%, rgba(184, 41, 247, 0.05) 50%, transparent 70%), #050505`,
          }}
        />
        <div className="absolute inset-0 grid-overlay pointer-events-none" />

        <motion.div
          className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-12 text-center"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: shouldReduceMotion ? 0 : 0.12,
                delayChildren: 0.2,
              },
            },
          }}
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.19, 1, 0.22, 1] as const } },
            }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neon-cyan/30 text-neon-cyan font-mono text-xs uppercase tracking-widest bg-neon-cyan/5">
              <Sparkles size={14} />
              // EL ECOSISTEMA NEURAL
            </span>
          </motion.div>

          <motion.h1
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.19, 1, 0.22, 1] as const } },
            }}
            className="mt-8 font-orbitron text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight"
          >
            16 Plantillas.
            <br />
            <span className="bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
              Un Solo Ecosistema.
            </span>
          </motion.h1>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.19, 1, 0.22, 1] as const } },
            }}
            className="mx-auto mt-6 neon-underline"
          />

          <motion.p
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.19, 1, 0.22, 1] as const } },
            }}
            className="mt-6 font-inter text-base sm:text-lg lg:text-xl text-text-secondary max-w-[650px] mx-auto leading-relaxed"
          >
            Sistema de diseno Neural Nexus para Next.js. Dark Mode, Glassmorphism, Neones y animaciones cinematicas. Elige tu nicho y despliega en minutos.
          </motion.p>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.19, 1, 0.22, 1] as const } },
            }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <a
              href="#templates"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('templates')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="font-orbitron text-sm font-bold uppercase tracking-wider px-8 py-4 bg-gradient-to-r from-neon-cyan to-neon-purple text-void rounded-sm hover:shadow-neon-cyan-lg hover:scale-[1.02] transition-all duration-300"
            >
              Explorar Plantillas
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* Templates Grid */}
      <section id="templates" className="py-24 lg:py-32 bg-surface">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          <ScrollReveal className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neon-purple/30 text-neon-purple font-mono text-xs uppercase tracking-widest bg-neon-purple/5">
              // 16 NICHOS
            </span>
            <h2 className="mt-6 font-orbitron text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
              Selecciona tu Plantilla
            </h2>
            <p className="mt-4 font-inter text-base text-text-secondary max-w-[500px] mx-auto">
              Cada plantilla esta optimizada para su nicho con contenido especifico y diseno adaptado
            </p>
            <div className="mx-auto mt-4 neon-divider" />
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" staggerDelay={0.06}>
            {templates.map((template) => (
              <StaggerItem key={template.id}>
                <Link
                  to={`/template/${template.id}`}
                  className="block glass-card p-6 group relative overflow-hidden"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = `${template.accentHex}50`;
                    e.currentTarget.style.boxShadow = `0 8px 32px ${template.accentHex}15`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Accent glow on hover */}
                  <div
                    className="absolute -top-10 -right-10 w-20 h-20 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-2xl"
                    style={{ backgroundColor: template.accentHex }}
                  />

                  {/* Template Number */}
                  <span
                    className="font-mono text-xs uppercase tracking-wider"
                    style={{ color: template.accentHex }}
                  >
                    // {String(templates.indexOf(template) + 1).padStart(2, '0')}
                  </span>

                  {/* Template Name */}
                  <h3 className="mt-3 font-orbitron text-xl font-bold text-white group-hover:text-neon-cyan transition-colors duration-200">
                    {template.name}
                  </h3>

                  {/* Niche */}
                  <p className="mt-1 font-inter text-sm text-text-secondary">
                    {template.niche}
                  </p>

                  {/* Accent Line */}
                  <div
                    className="mt-4 h-[2px] w-8 rounded-full transition-all duration-300 group-hover:w-16"
                    style={{ backgroundColor: template.accentHex }}
                  />

                  {/* View Template */}
                  <div className="mt-4 flex items-center gap-2 font-inter text-sm font-medium text-text-muted group-hover:text-neon-cyan transition-all duration-200">
                    <span>Ver Plantilla</span>
                    <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 lg:py-32 bg-void">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          <ScrollReveal className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neon-green/30 text-neon-green font-mono text-xs uppercase tracking-widest bg-neon-green/5">
              // CARACTERISTICAS
            </span>
            <h2 className="mt-6 font-orbitron text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
              Por que Neural Nexus
            </h2>
            <div className="mx-auto mt-4 neon-divider" />
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Dark Mode Premium',
                desc: 'Fondo #050505 con contrastes cuidadosamente calibrados para una experiencia visual inmersiva sin fatiga ocular.',
                color: '#00F0FF',
              },
              {
                title: 'Glassmorphism Real',
                desc: 'Tarjetas con backdrop-blur, bordes translucidos y profundidad visual que crea capas de informacion flotantes.',
                color: '#B829F7',
              },
              {
                title: 'Neon Accents',
                desc: 'Sistema de acentos en cyan, purpura, verde y ambar que se adapta al nicho de cada plantilla.',
                color: '#39FF14',
              },
              {
                title: 'Animaciones Cinematograficas',
                desc: 'Framer Motion con stagger reveals, parallax suave y transiciones fluidas que dan vida a cada interaccion.',
                color: '#FFB800',
              },
              {
                title: '100% Responsive',
                desc: 'Diseño mobile-first que se adapta perfectamente desde smartphones hasta monitores 4K.',
                color: '#FF2D55',
              },
              {
                title: 'Listo para Next.js',
                desc: 'Codigo modular TypeScript con Tailwind CSS. Solo copia, pega y despliega a produccion.',
                color: '#00F0FF',
              },
            ].map((feature, i) => (
              <ScrollReveal key={feature.title} delay={i * 0.1}>
                <div className="glass-card p-8 h-full">
                  <div
                    className="w-3 h-3 rounded-full mb-4"
                    style={{ backgroundColor: feature.color, boxShadow: `0 0 12px ${feature.color}` }}
                  />
                  <h3 className="font-inter text-lg font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="font-inter text-sm text-text-secondary leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
