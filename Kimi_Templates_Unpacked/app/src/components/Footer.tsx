import { Github, Twitter, Linkedin, Instagram } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';
import { Link } from 'react-router-dom';

const footerLinks = {
  navigation: [
    { label: 'Inicio', href: '#hero' },
    { label: 'Servicios', href: '#services' },
    { label: 'Neural Feed', href: '#neural-feed' },
    { label: 'Contacto', href: '#footer' },
  ],
  services: [
    'Desarrollo Web',
    'Automatizacion IA',
    'Marketing Digital',
    'Estrategia SEO',
  ],
  social: [
    { icon: Github, label: 'GitHub', href: '#' },
    { icon: Twitter, label: 'Twitter', href: '#' },
    { icon: Linkedin, label: 'LinkedIn', href: '#' },
    { icon: Instagram, label: 'Instagram', href: '#' },
  ],
};

export function Footer() {
  return (
    <footer id="footer" className="relative bg-surface border-t border-industrial-border">
      {/* Animated neon top line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-neon-cyan to-transparent animate-gradient-shift" />

      <div className="max-w-[1280px] mx-auto px-6 lg:px-12 pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Column */}
          <ScrollReveal delay={0}>
            <div>
              <Link to="/" className="inline-block">
                <h3 className="font-orbitron text-xl font-bold bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent mb-3">
                  NEURAL NEXUS
                </h3>
              </Link>
              <p className="font-inter text-sm text-text-secondary mb-6">
                El Ecosistema Digital
              </p>
              <div className="flex gap-4">
                {footerLinks.social.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="text-text-muted hover:text-neon-cyan transition-colors duration-200"
                  >
                    <s.icon size={20} />
                  </a>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Navigation Column */}
          <ScrollReveal delay={0.1}>
            <div>
              <h4 className="font-mono text-xs uppercase tracking-widest text-text-muted mb-4">
                NAVEGACION
              </h4>
              <ul className="space-y-3">
                {footerLinks.navigation.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById(link.href.slice(1))?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="font-inter text-sm text-text-secondary hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          {/* Services Column */}
          <ScrollReveal delay={0.2}>
            <div>
              <h4 className="font-mono text-xs uppercase tracking-widest text-text-muted mb-4">
                SERVICIOS
              </h4>
              <ul className="space-y-3">
                {footerLinks.services.map((service) => (
                  <li key={service}>
                    <span className="font-inter text-sm text-text-secondary hover:text-white transition-colors duration-200 cursor-default">
                      {service}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          {/* Contact Column */}
          <ScrollReveal delay={0.3}>
            <div>
              <h4 className="font-mono text-xs uppercase tracking-widest text-text-muted mb-4">
                CONTACTO
              </h4>
              <div className="space-y-3">
                <p className="font-inter text-sm text-text-secondary">
                  hola@neuralnexus.dev
                </p>
                <p className="font-inter text-sm text-text-secondary">
                  +52 55 1234 5678
                </p>
                <p className="font-inter text-sm text-text-secondary">
                  Ciudad de Mexico
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-6 border-t border-industrial-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-inter text-xs text-text-muted">
            &copy; 2025 Neural Nexus. Todos los derechos reservados.
          </p>
          <p className="font-inter text-xs text-text-muted">
            Hecho con cafe y neuralink
          </p>
        </div>
      </div>
    </footer>
  );
}
