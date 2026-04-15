"use client";

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from "@/components/ui/button";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLanguage = () => {
    const nextLocale = locale === 'es' ? 'en' : 'es';
    
    // Obtenemos los segmentos de la ruta actual
    const segments = pathname.split('/');
    
    // El primer segmento después de la barra inicial es el locale (ej: /es/monitor -> segments[1] = 'es')
    // Lo reemplazamos por el nuevo idioma
    segments[1] = nextLocale;
    
    // Reconstruimos la ruta
    const nextPathname = segments.join('/') || `/${nextLocale}`;
    
    // Redirigimos al usuario usando window.location.href para forzar una recarga completa
    // y asegurar que el middleware y el servidor detecten el nuevo locale correctamente.
    window.location.href = nextPathname;
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleLanguage}
      className="rounded-full hover:bg-neon-blue/10 border border-transparent hover:border-neon-blue/20 transition-all p-0 flex items-center justify-center h-8 w-8"
      title={locale === 'es' ? 'Switch to English' : 'Cambiar a Español'}
    >
      <div className="relative h-5 w-5 rounded-full overflow-hidden border border-white/20 shadow-[0_0_5px_rgba(255,255,255,0.2)]">
        {locale === 'es' ? (
          <Image 
            src="https://flagcdn.com/w80/co.png" 
            alt="ES" 
            fill 
            className="object-cover"
          />
        ) : (
          <Image 
            src="https://flagcdn.com/w80/us.png" 
            alt="EN" 
            fill 
            className="object-cover"
          />
        )}
      </div>
    </Button>
  );
}
