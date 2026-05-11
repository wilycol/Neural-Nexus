import { useState, useEffect, useRef } from 'react';

export function useScrollPosition(threshold: number = 50): boolean {
  const [isScrolled, setIsScrolled] = useState(false);
  const rafRef = useRef<number | null>(null);
  const lastScrollRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) return;
      
      rafRef.current = requestAnimationFrame(() => {
        const currentScroll = window.scrollY;
        if (currentScroll !== lastScrollRef.current) {
          lastScrollRef.current = currentScroll;
          setIsScrolled(currentScroll > threshold);
        }
        rafRef.current = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [threshold]);

  return isScrolled;
}
