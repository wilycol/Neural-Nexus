import { motion, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import type { TemplateData } from '@/data/templates';

interface HeroSectionProps {
  template: TemplateData;
}

const accentBorderMap: Record<string, string> = {
  cyan: 'border-neon-cyan',
  purple: 'border-neon-purple',
  green: 'border-neon-green',
  amber: 'border-neon-amber',
  red: 'border-neon-red',
  orange: 'border-neon-cyan',
};

const accentTextMap: Record<string, string> = {
  cyan: 'text-neon-cyan',
  purple: 'text-neon-purple',
  green: 'text-neon-green',
  amber: 'text-neon-amber',
  red: 'text-neon-red',
  orange: 'text-neon-cyan',
};

export function HeroSection({ template }: HeroSectionProps) {
  const shouldReduceMotion = useReducedMotion();
  const accent = template.accentColor;

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.12,
        delayChildren: shouldReduceMotion ? 0 : 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.19, 1, 0.22, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <section
      id="hero"
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden"
    >
      {/* Background Image or Gradient */}
      {template.heroImage ? (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${template.heroImage})` }}
          />
          <div className="absolute inset-0 gradient-overlay-hero" />
        </>
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 50% 30%, ${template.accentHex}15 0%, transparent 70%), #050505`,
          }}
        />
      )}

      {/* Grid Overlay */}
      <div className="absolute inset-0 grid-overlay pointer-events-none" />

      {/* Corner Brackets */}
      <div className="absolute top-24 left-8 lg:left-16">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="opacity-60">
          <path d="M0 12V0H12" stroke={template.accentHex} strokeWidth="1.5" />
        </svg>
      </div>
      <div className="absolute top-24 right-8 lg:right-16">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="opacity-60">
          <path d="M20 0H32V12" stroke={template.accentHex} strokeWidth="1.5" />
        </svg>
      </div>
      <div className="absolute bottom-24 left-8 lg:left-16">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="opacity-60">
          <path d="M0 20V32H12" stroke={template.accentHex} strokeWidth="1.5" />
        </svg>
      </div>
      <div className="absolute bottom-24 right-8 lg:right-16">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="opacity-60">
          <path d="M20 32H32V20" stroke={template.accentHex} strokeWidth="1.5" />
        </svg>
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-12 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div variants={itemVariants} className="mb-8">
          <span
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border font-mono text-xs uppercase tracking-widest ${accentBorderMap[accent]} ${accentTextMap[accent]} bg-opacity-10`}
            style={{ backgroundColor: `${template.accentHex}10` }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-neon-pulse" />
            {template.badge}
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          variants={itemVariants}
          className="font-orbitron text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-[1.1] tracking-tight max-w-[900px] mx-auto"
        >
          {template.heroTitle}
        </motion.h1>

        {/* Neon Underline */}
        <motion.div
          variants={itemVariants}
          className="mx-auto mt-6 h-[2px] w-[60px]"
          style={{ background: `linear-gradient(90deg, ${template.accentHex}, #B829F7)` }}
        />

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="mt-6 font-inter text-base sm:text-lg lg:text-xl text-text-secondary max-w-[600px] mx-auto leading-relaxed"
        >
          {template.heroSubtitle}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            className="font-orbitron text-sm font-bold uppercase tracking-wider px-8 py-4 text-void rounded-sm hover:scale-[1.02] transition-all duration-300"
            style={{
              boxShadow: `0 0 20px ${template.accentHex}50`,
              background: `linear-gradient(90deg, ${template.accentHex}, #B829F7)`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = `0 0 40px ${template.accentHex}80`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = `0 0 20px ${template.accentHex}50`;
            }}
          >
            {template.primaryCTA}
          </button>
          <button
            className={`font-orbitron text-sm font-bold uppercase tracking-wider px-8 py-4 bg-transparent rounded-sm transition-all duration-300 ${accentBorderMap[accent]} ${accentTextMap[accent]}`}
            style={{
              borderColor: template.accentHex,
              color: template.accentHex,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = `${template.accentHex}15`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            {template.secondaryCTA}
          </button>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <ChevronDown
          size={32}
          className="text-text-muted animate-bounce-chevron"
        />
      </motion.div>
    </section>
  );
}
