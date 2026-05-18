import React from "react";

export default function TermsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Sección 1: Términos Generales */}
      <section>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent underline decoration-neon-blue/20">
          1. Términos y Condiciones de Uso
        </h2>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          Bienvenido a Neural Nexus. Al acceder a este portal, usted acepta los siguientes términos y condiciones diseñados para proteger la integridad legal, la transparencia corporativa y la propiedad intelectual de nuestro ecosistema.
        </p>
      </section>

      {/* Propiedad Intelectual */}
      <section className="rounded-2xl border bg-muted/20 p-6">
        <h3 className="text-xl font-bold text-foreground">Propiedad Intelectual</h3>
        <div className="mt-4 space-y-3 text-sm text-muted-foreground">
          <p>
            • <strong>Contenidos Generados:</strong> El análisis, resumen y archivos multimedia (videos e imágenes) generados por Beatriz AutoPublisher son propiedad de la Federación Neural Nexus, licenciados bajo una política de &quot;Fair Use&quot; para la información reportada.
          </p>
          <p>
            • <strong>Créditos:</strong> Queda estrictamente prohibido eliminar el logotipo de la mascota (Neural Nexus Mascot) o los créditos de las fuentes originales en cualquier medio de difusión.
          </p>
        </div>
      </section>

      {/* Sección 2: Términos del Plan Semilla (100 Neural Sites) */}
      <section className="p-6 border border-neon-blue/30 rounded-2xl bg-neon-blue/5">
        <h3 className="text-xl font-bold text-foreground">2. Términos y Condiciones del Plan Semilla (100 Neural Sites)</h3>
        <div className="mt-4 space-y-4 text-sm text-muted-foreground leading-relaxed">
          <p>
            • <strong>Periodo de Prueba de 30 Días:</strong> El cliente obtiene una implementación totalmente funcional de un &quot;Neural Site&quot; inteligente por un periodo de validación gratuita de 30 días naturales.
          </p>
          <p>
            • <strong>Regalo de Google Maps y GBP:</strong> Como beneficio adicional sin costo e independiente de la continuidad del servicio, Neural Nexus creará y configurará la ficha física del negocio en Google Maps y Google Business Profile de por vida.
          </p>
          <p>
            • <strong>Oferta de 1 Año de Hospedaje en la Federación:</strong> A cambio de su registro en el Portal Neural Nexus (PNN) y la validación activa del producto, el cliente recibe 1 año de hosting y soporte técnico en los subdominios de la Federación. El cliente asumirá el pago de la tarifa mensual de mantenimiento elegida por el usuario según su suscripción activa (<strong>Plan Silver: $15 USD / ~60,000 COP al mes; Plan Gold: $30 USD / ~120,000 COP al mes; Plan Platinum: $79 USD / ~316,000 COP al mes</strong>).
          </p>
          <p>
            • <strong>Setup de Implementación Bonificado (100 Primeros Cupos):</strong> 
            <br />
            1. Para los primeros 100 clientes, el **Setup Inicial Nivel 1** (cuyo costo estándar es de $100 USD, actualmente promocionado en $50 USD) se otorga de forma **100% gratuita**.
            <br />
            2. Si el cliente requiere un nivel más alto de complejidad técnica (Niveles de Implementación 2 a 5), se le concede un **50% de descuento directo** sobre el valor de dicho setup en los primeros 100 cupos adquiridos.
          </p>
          <p>
            • <strong>Estructura Post-Promoción y Ajustes Tarifarios:</strong> Una vez completado el cupo límite de los 100 planes de suscripción mensual adquiridos bajo esta campaña semilla:
            <br />
            1. Se comenzarán a facturar las tarifas de implementación y setup originales completas, las cuales oscilan entre **$100 y $500 USD** según el nivel de complejidad del sitio.
            <br />
            2. Neural Nexus se reserva el derecho absoluto de modificar, reajustar y actualizar los costos tanto de los setups de implementación como de los planes de suscripción mensual, a su libre y exclusivo consentimiento, notificando previamente a los usuarios de forma transparente antes de aplicar cualquier cambio.
          </p>
          <p>
            • <strong>Transición y Libertad de Dominio:</strong> Al cumplirse los 12 meses de servicio gratuito de hosting, el cliente tiene la libertad de:
            <br />
            1. Continuar hospedado en la Federación pagando su mantenimiento mensual según el plan de su elección.
            <br />
            2. Solicitar una transición premium con dominio propio por una tarifa única de setup de <strong>~$200 USD (~800,000 COP)</strong> que incluye correo corporativo y transferencia absoluta de propiedad de dominio y código.
            <br />
            3. Retirarse libremente de la Federación con cero cargos de salida (Filosofía de No Lock-In).
          </p>
        </div>
      </section>

      {/* Sección 3: Facturación, Cancelación y Reembolso (Exigido por Google Ads / Stripe) */}
      <section className="p-6 border border-neon-purple/30 rounded-2xl bg-neon-purple/5">
        <h3 className="text-xl font-bold text-foreground">3. Política de Facturación, Cancelación y Reembolso</h3>
        <div className="mt-4 space-y-4 text-sm text-muted-foreground leading-relaxed">
          <p>
            • <strong>Facturación Recurrente:</strong> Las tarifas mensuales correspondientes a los servicios de mantenimiento de hosting de Neural Sites se facturarán de forma automática a través de procesadores de pago seguros integrados.
          </p>
          <p>
            • <strong>Cancelación Fácil e Inmediata:</strong> Los usuarios pueden cancelar o pausar su suscripción recurrente en cualquier momento, con un solo clic desde su perfil de cuenta en el Portal o contactando al soporte oficial. No existen cláusulas de permanencia obligatoria.
          </p>
          <p>
            • <strong>Garantía de Reembolso de 14 Días:</strong> Si por alguna razón el cliente no está satisfecho con la inicialización técnica o los entregables de su Neural Site, tiene derecho a solicitar un reembolso completo del 100% de su primer pago mensual de mantenimiento dentro de los primeros 14 días posteriores al cobro.
          </p>
        </div>
      </section>

      {/* Sección 4: Moderación */}
      <section>
        <h3 className="text-xl font-bold text-foreground">4. Política de Moderación y Contenido</h3>
        <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
          Al interactuar en el portal (comentarios, foros, likes), usted acepta que cada interacción sea analizada por un Agente de Moderación IA. Se prohíbe terminantemente el uso de lenguaje abusivo, obsceno, difamatorio o discriminatorio. Neural Nexus se reserva el derecho de suspender o suspender cuentas infractoras sin previo aviso.
        </p>
      </section>

      {/* Sección 5: Transparencia Comercial e Identidad de Negocio (Cumplimiento de Google Ads) */}
      <section className="p-6 border border-white/10 rounded-2xl bg-muted/10">
        <h3 className="text-xl font-bold text-foreground">5. Transparencia Comercial y Datos del Operador</h3>
        <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
          En cumplimiento con las directivas de transparencia comercial de Google Ads y regulaciones de protección al consumidor, se detallan los datos del operador del portal:
        </p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-muted-foreground">
          <div className="space-y-1">
            <p><strong>• Nombre del Operador:</strong> Wily Col & Ecosistema Neural Nexus</p>
            <p><strong>• Correo Electrónico Oficial:</strong> portalneuralnexus@gmail.com</p>
          </div>
          <div className="space-y-1">
            <p><strong>• Teléfono de Soporte Comercial:</strong> +57 322 9067026</p>
            <p><strong>• Ubicación Física:</strong> Barrio Virgilio Barco, Cúcuta, Norte de Santander, Colombia</p>
          </div>
        </div>
      </section>

      <div className="mt-12 rounded-xl bg-orange-500/10 border border-orange-500/20 p-4 text-xs text-orange-500 text-center">
        <strong>CERTIFICACIÓN DE TRANSPARENCIA:</strong> Este documento legal ha sido actualizado el 18 de mayo de 2026 para cumplir rigurosamente con las normativas internacionales de consumo, políticas de Google Ads y directivas de la API de Meta.
      </div>
    </div>
  );
}
