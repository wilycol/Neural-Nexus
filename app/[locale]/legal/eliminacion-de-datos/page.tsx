import React from "react";

export default function DataDeletionPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent underline decoration-neon-blue/20">
          Política de Eliminación de Datos
        </h2>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          En Neural Nexus, respetamos su derecho a la privacidad y al control de su información personal. De acuerdo con las políticas de Meta (Facebook) y otros proveedores de autenticación, proporcionamos este medio transparente para que pueda solicitar la eliminación de sus datos de nuestro ecosistema.
        </p>
      </section>

      <section className="rounded-2xl border bg-muted/20 p-6">
        <h3 className="text-xl font-bold text-foreground">Cómo Eliminar su Cuenta</h3>
        <div className="mt-4 space-y-4 text-sm text-muted-foreground">
          <p>
            Si desea desvincular sus datos de Neural Nexus y eliminar su perfil de manera permanente, tiene dos opciones industriales:
          </p>
          <div className="space-y-2">
            <p>
              <strong>Opción 1: Eliminación Automática (Recomendada)</strong>
            </p>
            <p className="pl-4 border-l-2 border-neon-blue">
              Inicie sesión en su perfil, vaya a <strong>Ajustes de Cuenta</strong> y haga clic en el botón <strong>&quot;Eliminar mi cuenta y datos&quot;</strong>. El sistema procesará la solicitud inmediatamente.
            </p>
          </div>
          <div className="space-y-2">
            <p>
              <strong>Opción 2: Solicitud Manual</strong>
            </p>
            <p className="pl-4 border-l-2 border-neon-purple">
              Envíe un correo electrónico a <a href="mailto:portalneuralnexus@gmail.com" className="text-neon-blue hover:underline">portalneuralnexus@gmail.com</a> con el asunto &quot;Solicitud de Eliminación de Datos&quot; desde la dirección de correo asociada a su cuenta. Nuestro equipo de soporte procesará la eliminación en un plazo máximo de 48 horas.
            </p>
          </div>
        </div>
      </section>

      <section className="p-4 border-l-4 border-red-500/50 bg-red-500/5">
        <h3 className="text-xl font-bold text-foreground">¿Qué Datos se Eliminan?</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Al confirmar la eliminación de su cuenta, Neural Nexus borrará de manera definitiva de sus bases de datos:
        </p>
        <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-muted-foreground">
          <li>Información de perfil (Nombre, Email, Foto de perfil).</li>
          <li>Tokens de autenticación de terceros (OAuth de Facebook, Google, GitHub).</li>
          <li>Historial de favoritos y marcadores de noticias.</li>
          <li>Preferencias de personalización y configuraciones de la interfaz.</li>
        </ul>
        <p className="mt-4 text-[10px] text-white/30 uppercase tracking-widest font-black italic">
          Nota: Esta acción es irreversible. Una vez eliminados, los datos no podrán ser recuperados.
        </p>
      </section>

      <section>
        <h3 className="text-xl font-bold text-foreground">Auditabilidad y Cumplimiento</h3>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          Neural Nexus cumple con el Reglamento General de Protección de Datos (GDPR) y las normativas de Meta Platform Inc. para asegurar que el ciclo de vida de los datos de nuestros usuarios sea seguro y esté bajo su control total. Cada proceso de eliminación queda registrado en nuestra bitácora interna de auditoría para fines de cumplimiento legal.
        </p>
      </section>
    </div>
  );
}
