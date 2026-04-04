import React from "react";

export default function PrivacyPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent underline decoration-neon-blue/20">
          Política de Privacidad
        </h2>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          En Neural Nexus, valoramos su privacidad y nos comprometemos a proteger sus datos personales de acuerdo con las mejores prácticas de la industria y la normativa vigente.
        </p>
      </section>

      <section className="rounded-2xl border bg-muted/20 p-6">
        <h3 className="text-xl font-bold text-foreground">Aviso de Disclaimer (Transparencia de IA)</h3>
        <div className="mt-4 space-y-4 text-sm text-muted-foreground">
          <p>
            • **Transparencia de IA:** Neural Nexus es una plataforma impulsada en un **95% por sistemas de Inteligencia Artificial**. Los contenidos son recolectados, interpretados y publicados de manera autónoma por Beatriz AutoPublisher.
          </p>
          <p>
            • **Limitación de Exactitud:** No garantizamos que toda la información esté libre de errores o &quot;alucinaciones&quot; de los modelos generativos. El contenido se proporciona con fines informativos.
          </p>
          <p>
            • **Modelo de Replicación:** Somos un agregador inteligente. Siempre acreditamos la fuente original con su nombre y URL.
          </p>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-bold text-foreground">Recopilación de Datos</h3>
        <p className="mt-2 text-muted-foreground">
          Utilizamos cookies y seguimiento de visitas para alimentar nuestro <strong>Growth Engine</strong> y mejorar la experiencia del usuario. No vendemos sus datos personales a terceros.
        </p>
        <ul className="mt-4 list-inside list-disc space-y-1 text-sm text-muted-foreground">
          <li>Datos de navegación (vistas, procedencia).</li>
          <li>Datos de perfil (para usuarios registrados).</li>
          <li>Preferencias de contenido.</li>
        </ul>
      </section>

      <section className="p-4 border-l-4 border-neon-purple bg-neon-purple/5">
        <h3 className="text-xl font-bold text-foreground">Sus Derechos</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Usted tiene derecho a acceder, rectificar o eliminar sus datos personales en cualquier momento a través de la configuración de su perfil o contactando con soporte de Neural Nexus.
        </p>
      </section>
    </div>
  );
}
