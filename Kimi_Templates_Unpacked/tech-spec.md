# Neural Nexus — Technical Specification

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| next | ^15.1 | Framework (App Router, 16 pages) |
| react | ^19.0 | UI library |
| react-dom | ^19.0 | React DOM renderer |
| tailwindcss | ^4.0 | Utility-first CSS |
| @tailwindcss/postcss | ^4.0 | PostCSS integration for Tailwind |
| framer-motion | ^12.0 | All animations (scroll reveals, page load, hover, stagger, mobile menu) |
| lucide-react | ^0.460 | Icons (shared icon set across all templates) |
| clsx | ^2.1 | Conditional class composition |
| tailwind-merge | ^2.6 | Tailwind class conflict resolution |

## Component Inventory

### Layout (shared across all 16 templates)

| Component | Source | Notes |
|-----------|--------|-------|
| Navigation | Custom | Sticky header with scroll-triggered glassmorphism bg, mobile hamburger overlay with staggered link reveals |
| Footer | Custom | 4-column industrial footer, neon gradient top border |

### Sections (used per template, content varies)

| Component | Source | Notes |
|-----------|--------|-------|
| HeroSection | Custom | Full-viewport hero with badge, title, subtitle, CTA row, scroll chevron, decorative grid overlay + corner brackets |
| ServicesSection | Custom | Section title + responsive grid of ServiceCard instances |
| NeuralFeedSection | Custom | Section badge/title + grid of ArticleCard instances + "Ver Todo" button |

### Reusable Components

| Component | Source | Used By |
|-----------|--------|---------|
| GlassCard | Custom | ServiceCard, ArticleCard — glassmorphism card with hover border/translate/shadow transitions |
| ServiceCard | Custom | ServicesSection — GlassCard + icon + title + description + link |
| ArticleCard | Custom | NeuralFeedSection — GlassCard + category pill + title + excerpt + metadata + read link |
| PrimaryButton | Custom | Hero CTAs, nav CTA — gradient bg, glow shadow, hover intensify |
| SecondaryButton | Custom | Hero CTAs, section footers — bordered, hover fill |
| SectionBadge | Custom | HeroSection, NeuralFeedSection — pill badge with label |
| NeonDivider | Custom | Section title underlines — gradient line |
| ScrollReveal | Custom | Wrapper — framer-motion `whileInView` with default entrance preset |

## Animation Implementation

| Animation | Library | Approach | Complexity |
|-----------|---------|----------|------------|
| Page load sequence (bg → nav → title chars → subtitle/CTA → scroll indicator) | Framer Motion | Orchestrated `motion.div` with delays via `transition.delay`, hero title uses character-split with stagger | Medium |
| Scroll-triggered section reveals | Framer Motion | Reusable `ScrollReveal` wrapper: `whileInView` opacity 0→1, y 40→0, stagger children 0.08s, viewport once/0.15 | Low |
| Card hover (border glow, translateY, shadow) | CSS Transitions | Pure Tailwind `transition` + `hover:` classes on GlassCard — no JS animation needed | Low |
| Card image hover zoom | CSS Transitions | `group-hover:scale-105` with `overflow-hidden` container | Low |
| Button hover glow intensify | CSS Transitions | `hover:shadow-[...]` with larger spread value, `hover:scale-[1.02]` | Low |
| Neon pulse (decorative elements) | CSS Keyframes | `@keyframes pulse` opacity 0.4↔1.0, 2s infinite — applied via Tailwind `animate-pulse` or custom keyframe | Low |
| Navigation scroll background transition | React hook + CSS | `useScrollPosition` hook toggles class at 50px threshold; CSS `transition` on background/backdrop-filter | Low |
| Mobile menu overlay + staggered links | Framer Motion | `AnimatePresence` + `motion.div` slide-in; child links stagger via `variants` with 0.1s delay each | Medium |
| Scroll chevron bounce | CSS Keyframes | `@keyframes bounce` translateY 0→8px, 1.5s infinite | Low |

## State & Logic

### Scroll Position Hook

Custom `useScrollPosition` hook (no library needed). Returns scroll Y value. Used by Navigation to toggle glassmorphism background at 50px threshold. Implemented with `useEffect` + `scroll` event listener, throttled via `requestAnimationFrame`.

### Reduced Motion Check

All Framer Motion components wrap animations in a `useReducedMotion` check (built-in framer-motion hook). When enabled: skip entrance animations (instant visibility), disable parallax, use instant hover states.

### Character Splitting (Hero Title)

Hero title text is split into individual `motion.span` elements for per-character stagger animation. Requires React state or memoization to avoid re-splitting on renders. Character count drives stagger delay calculation (0.03s per char).

### Mobile Menu Toggle

Simple React `useState` boolean. Controls hamburger visibility and full-screen overlay. Framer Motion `AnimatePresence` handles enter/exit animations for the overlay.

## Other Key Decisions

**Routing:** Each template is a standalone Next.js App Router page at its own route (`/foundry`, `/vitalis`, `/torque`, etc.). No shared layout wrapper — each page composes Navigation + sections + Footer independently. This keeps pages self-contained and avoids prop-drilling niche-specific data.

**Data Structure:** Each template exports a configuration object (niche name, accent color, hero copy, services array, articles array) consumed by the shared section components. This avoids duplicating component code while allowing content customization per niche.

**Accent Color Strategy:** Accent colors are passed as Tailwind class names via the template config (e.g., `text-neon-amber`, `border-neon-orange`). A single `colors` extension in Tailwind config defines all 8 neon tokens. No dynamic class generation — classes are static strings resolved at build time.
