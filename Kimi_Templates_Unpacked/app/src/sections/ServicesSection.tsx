import { ArrowRight } from 'lucide-react';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/ScrollReveal';
import type { TemplateData } from '@/data/templates';

interface ServicesSectionProps {
  template: TemplateData;
}

const accentTextMap: Record<string, string> = {
  cyan: 'text-neon-cyan',
  purple: 'text-neon-purple',
  green: 'text-neon-green',
  amber: 'text-neon-amber',
  red: 'text-neon-red',
  orange: 'text-neon-cyan',
};

const accentBorderMap: Record<string, string> = {
  cyan: 'border-neon-cyan',
  purple: 'border-neon-purple',
  green: 'border-neon-green',
  amber: 'border-neon-amber',
  red: 'border-neon-red',
  orange: 'border-neon-cyan',
};

export function ServicesSection({ template }: ServicesSectionProps) {
  const accent = template.accentColor;
  const gridCols = template.services.length >= 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3';

  return (
    <section id="services" className="relative py-24 lg:py-32 bg-surface">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <ScrollReveal className="text-center mb-16">
          <span
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border font-mono text-xs uppercase tracking-widest ${accentBorderMap[accent]} ${accentTextMap[accent]}`}
            style={{ backgroundColor: `${template.accentHex}10`, borderColor: template.accentHex + '40' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            // SERVICIOS
          </span>
          <h2 className="mt-6 font-orbitron text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            {template.servicesTitle}
          </h2>
          <div className="mx-auto mt-4 neon-divider" />
        </ScrollReveal>

        {/* Services Grid */}
        <StaggerContainer className={`grid grid-cols-1 md:grid-cols-2 ${gridCols} gap-6`} staggerDelay={0.1}>
          {template.services.map((service) => {
            const Icon = service.icon;
            return (
              <StaggerItem key={service.title}>
                <div
                  className="glass-card p-8 h-full flex flex-col group cursor-pointer"
                  style={{ '--accent-color': template.accentHex } as React.CSSProperties}
                >
                  {/* Icon */}
                  <div
                    className="w-14 h-14 rounded-lg flex items-center justify-center mb-6 transition-all duration-300"
                    style={{
                      backgroundColor: `${template.accentHex}15`,
                      border: `1px solid ${template.accentHex}30`,
                    }}
                  >
                    <Icon size={28} style={{ color: template.accentHex }} />
                  </div>

                  {/* Title */}
                  <h3 className="font-inter text-xl font-semibold text-white mb-3">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="font-inter text-sm text-text-secondary leading-relaxed flex-grow mb-4">
                    {service.description}
                  </p>

                  {/* Link */}
                  <div className="flex items-center gap-2 font-inter text-sm font-medium transition-all duration-200 group-hover:gap-3" style={{ color: template.accentHex }}>
                    <span>Ver Productos</span>
                    <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
