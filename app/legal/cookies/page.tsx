import React from "react";

export default function CookiesPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent underline decoration-neon-blue/20">
          Política de Cookies
        </h2>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          En Neural Nexus utilizamos cookies y tecnologías de seguimiento para mejorar el rendimiento del portal y alimentar nuestro **Growth Engine**.
        </p>
      </section>

      <section className="rounded-2xl border bg-muted/20 p-6">
        <h3 className="text-xl font-bold text-foreground">¿Qué son las cookies?</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Las cookies son pequeños archivos de texto que se almacenan en su dispositivo para recordar sus preferencias y comportamiento de navegación.
        </p>
      </section>

      <section className="space-y-12">
        <div className="border-l-2 border-muted-foreground/20 pl-6">
          <h4 className="font-bold text-foreground uppercase tracking-widest text-xs">Cookies Técnicas (Estrictamente necesarias)</h4>
          <p className="mt-2 text-sm text-muted-foreground">Utilizadas para el inicio de sesión, la seguridad de la cuenta y el funcionamiento básico del portal.</p>
        </div>

        <div className="border-l-2 border-neon-blue pl-6">
          <h4 className="font-bold text-neon-blue uppercase tracking-widest text-xs">Cookies de Análisis (Growth Engine)</h4>
          <p className="mt-2 text-sm text-muted-foreground">Ayudan a Beatriz a entender qué noticias son tendencia y a calcular el tráfico diario necesario para alcanzar metas de monetización.</p>
        </div>

        <div className="border-l-2 border-neon-purple pl-6">
          <h4 className="font-bold text-neon-purple uppercase tracking-widest text-xs">Cookies Publicitarias (Google AdSense)</h4>
          <p className="mt-2 text-sm text-muted-foreground">Utilizadas por Google para mostrar anuncios relevantes basados en sus intereses.</p>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-bold text-foreground">Gestión de Cookies</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Puede gestionar sus preferencias a través del **CMP de Google** (el mensaje de consentimiento que aparece al entrar) o directamente en la configuración de su navegador.
        </p>
      </section>
    </div>
  );
}
