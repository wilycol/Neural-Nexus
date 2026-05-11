import { ArrowRight, BrainCircuit, Clock, Calendar } from 'lucide-react';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/ScrollReveal';
import type { TemplateData } from '@/data/templates';

interface NeuralFeedSectionProps {
  template: TemplateData;
}

const categoryColorMap: Record<string, string> = {
  Guia: '#00F0FF',
  Tecnica: '#B829F7',
  Tendencias: '#39FF14',
  Salud: '#39FF14',
  Farmacia: '#00F0FF',
  Bienestar: '#B829F7',
  Mantenimiento: '#FF6B35',
  Seguridad: '#FF2D55',
  Ortodoncia: '#00F0FF',
  Higiene: '#39FF14',
  Implantes: '#B829F7',
  Entrenamiento: '#FF2D55',
  Nutricion: '#39FF14',
  Vinos: '#FFB800',
  Cultura: '#B829F7',
  Cafe: '#FFB800',
  Panaderia: '#FFB800',
  Recetas: '#FF6B35',
  Estilo: '#B829F7',
  Inversion: '#00F0FF',
  Fiscal: '#B829F7',
  Legal: '#00F0FF',
  Tecnologia: '#39FF14',
  Belleza: '#B829F7',
  Cuidado: '#00F0FF',
  Coloracion: '#B829F7',
  Hardware: '#39FF14',
  Perifericos: '#00F0FF',
  Destinos: '#00F0FF',
  Tips: '#FFB800',
  Tramites: '#B829F7',
  Negocios: '#B829F7',
  Productividad: '#39FF14',
};

export function NeuralFeedSection({ template }: NeuralFeedSectionProps) {
  return (
    <section
      id="neural-feed"
      className="relative py-24 lg:py-32"
      style={{
        background: `radial-gradient(ellipse at 50% 50%, rgba(184, 41, 247, 0.05) 0%, transparent 60%), #050505`,
      }}
    >
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <ScrollReveal className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neon-cyan/30 text-neon-cyan font-mono text-xs uppercase tracking-widest bg-neon-cyan/5">
            <BrainCircuit size={14} />
            // NEURAL FEED
          </span>
          <h2 className="mt-6 font-orbitron text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            Contenido Generado por IA
          </h2>
          <p className="mt-4 font-inter text-base text-text-secondary max-w-[500px] mx-auto">
            Inteligencia artificial aplicada a tu industria
          </p>
          <div className="mx-auto mt-4 neon-divider" />
        </ScrollReveal>

        {/* Articles Grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.1}>
          {template.articles.map((article) => {
            const catColor = categoryColorMap[article.category] || '#00F0FF';
            return (
              <StaggerItem key={article.title}>
                <article className="glass-card p-6 h-full flex flex-col group cursor-pointer">
                  {/* Category Badge */}
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-[10px] uppercase tracking-wider w-fit mb-4"
                    style={{
                      backgroundColor: `${catColor}15`,
                      border: `1px solid ${catColor}40`,
                      color: catColor,
                    }}
                  >
                    <span className="w-1 h-1 rounded-full bg-current" />
                    {article.category}
                  </span>

                  {/* Title */}
                  <h3 className="font-inter text-lg font-semibold text-white mb-3 group-hover:text-neon-cyan transition-colors duration-200 line-clamp-2">
                    {article.title}
                  </h3>

                  {/* Meta */}
                  <div className="flex items-center gap-4 mt-auto pt-4 border-t border-industrial-border">
                    <span className="flex items-center gap-1.5 font-mono text-xs text-text-muted">
                      <Calendar size={12} />
                      11 May 2025
                    </span>
                    <span className="flex items-center gap-1.5 font-mono text-xs text-text-muted">
                      <Clock size={12} />
                      {article.readTime}
                    </span>
                  </div>

                  {/* Read More */}
                  <div className="flex items-center gap-2 mt-4 font-inter text-sm font-medium text-neon-cyan group-hover:gap-3 transition-all duration-200">
                    <span>Leer mas</span>
                    <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </article>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        {/* View All Button */}
        <ScrollReveal className="text-center mt-12" delay={0.3}>
          <button className="font-orbitron text-sm font-bold uppercase tracking-wider px-8 py-4 bg-transparent border border-neon-cyan text-neon-cyan rounded-sm hover:bg-neon-cyan/10 transition-all duration-300">
            Ver Todo el Contenido
          </button>
        </ScrollReveal>
      </div>
    </section>
  );
}
