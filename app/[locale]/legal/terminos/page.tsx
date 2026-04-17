import React from "react";

export default function TermsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent underline decoration-neon-blue/20">
          1. Términos y Condiciones de Uso
        </h2>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          Bienvenido a Neural Nexus. Al acceder a este portal, usted acepta los siguientes términos y condiciones diseñados para proteger la integridad legal y la propiedad intelectual de nuestro ecosistema.
        </p>
      </section>

      <section className="rounded-2xl border bg-muted/20 p-6">
        <h3 className="text-xl font-bold text-foreground">Propiedad Intelectual</h3>
        <div className="mt-4 space-y-3 text-sm text-muted-foreground">
          <p>
            • <strong>Contenidos Generados:</strong> El análisis, resumen y archivos multimedia (videos/imágenes) generados por Beatriz AutoPublisher son propiedad de Neural Nexus, licenciados bajo una política de &quot;Fair Use&quot; para la información reportada.
          </p>
          <p>
            • <strong>Créditos:</strong> Queda estrictamente prohibido eliminar el logo de la mascota (Neural Nexus Mascot) o los créditos de las fuentes originales.
          </p>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-bold text-foreground">Política de Moderación</h3>
        <p className="mt-2 text-muted-foreground">
          Al interactuar en el portal (comentarios, likes), usted acepta que cada interacción sea analizada por un <strong>Agente de Moderación IA</strong>. Se prohíbe el lenguaje obsceno, el acoso y cualquier forma de discriminación. Neural Nexus se reserva el derecho de suspender o banear cuentas sin previo aviso.
        </p>
      </section>

      <section>
        <h3 className="text-xl font-bold text-foreground">Suscripciones y Pagos</h3>
        <p className="mt-2 text-muted-foreground">
          Al suscribirse a Nexus Premium, usted acepta los presentes términos de servicio. Las suscripciones otorgan acceso a una experiencia sin anuncios y funciones exclusivas de IA. Ofrecemos una política de <strong>cancelación fácil en cualquier momento</strong> desde su perfil de usuario o contactando a soporte.
        </p>
        <p className="mt-2 text-xs text-muted-foreground italic">
          Los pagos son gestionados por procesadores externos seguros, por lo que Neural Nexus no almacena datos bancarios ni de tarjetas directamente.
        </p>
      </section>

      <div className="mt-12 rounded-xl bg-orange-500/10 border border-orange-500/20 p-4 text-xs text-orange-500">
        <strong>AVISO IMPORTANTE:</strong> Este es un borrador generado por IA. Debe ser validado por un abogado humano antes de considerarse legalmente vinculante al 100%.
      </div>
    </div>
  );
}
