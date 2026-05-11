import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { Link } from 'react-router-dom';

interface NavigationProps {
  templateId?: string;
  templateName?: string;
}

export function Navigation({ templateId, templateName }: NavigationProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const isScrolled = useScrollPosition(50);
  const shouldReduceMotion = useReducedMotion();

  const navLinks = [
    { label: 'Inicio', href: templateId ? `/template/${templateId}#hero` : '/#hero' },
    { label: 'Servicios', href: templateId ? `/template/${templateId}#services` : '/#services' },
    { label: 'Neural Feed', href: templateId ? `/template/${templateId}#neural-feed` : '/#neural-feed' },
    { label: 'Contacto', href: templateId ? `/template/${templateId}#footer` : '/#footer' },
  ];

  const scrollToSection = (href: string) => {
    setIsMobileOpen(false);
    if (href.startsWith('/template/') || href.startsWith('/#')) {
      const hash = href.split('#')[1];
      if (hash) {
        setTimeout(() => {
          const el = document.getElementById(hash);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  };

  return (
    <>
      <motion.header
        initial={shouldReduceMotion ? {} : { y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 h-[72px] transition-all duration-300 ${
          isScrolled
            ? 'bg-surface-glass backdrop-blur-xl border-b border-industrial-border'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 h-full flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="font-orbitron text-lg font-bold bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
              NEURAL NEXUS
            </span>
            {templateName && (
              <>
                <span className="text-text-muted text-sm">/</span>
                <span className="font-orbitron text-sm font-semibold text-text-secondary">
                  {templateName}
                </span>
              </>
            )}
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollToSection(link.href)}
                className="font-inter text-sm font-medium text-text-secondary hover:text-white transition-colors duration-200 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-neon-cyan transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <button
              onClick={() => scrollToSection(templateId ? `/template/${templateId}#footer` : '/#footer')}
              className="font-orbitron text-xs font-bold uppercase tracking-wider px-6 py-3 bg-gradient-to-r from-neon-cyan to-neon-purple text-void rounded-sm hover:shadow-neon-cyan-lg hover:scale-[1.02] transition-all duration-300"
            >
              Contactar
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden text-white p-2"
            aria-label="Toggle menu"
          >
            {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-void/98 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col items-center justify-center h-full gap-8 pt-[72px]">
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.label}
                  initial={shouldReduceMotion ? {} : { opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
                  onClick={() => scrollToSection(link.href)}
                  className="font-orbitron text-2xl font-semibold text-white hover:text-neon-cyan transition-colors duration-200"
                >
                  {link.label}
                </motion.button>
              ))}
              <motion.button
                initial={shouldReduceMotion ? {} : { opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
                onClick={() => {
                  setIsMobileOpen(false);
                  setTimeout(() => {
                    const el = document.getElementById('footer');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="mt-4 font-orbitron text-sm font-bold uppercase tracking-wider px-8 py-4 bg-gradient-to-r from-neon-cyan to-neon-purple text-void rounded-sm"
              >
                Contactar
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
