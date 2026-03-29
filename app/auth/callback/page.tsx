"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { getSupabaseBrowserClient } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("Procesando autenticación...");

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      console.error('Auth Callback Error (from route):', errorParam);
      setMessage(`Error de inicio de sesión: ${errorParam}`);
      return;
    }

    const run = async () => {
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");

        if (!code) {
          // Si no hay código ni error, tal vez ya se procesó en el servidor
          // Esperamos un momento y redirigimos al home
          const timeout = setTimeout(() => router.replace("/"), 2000);
          return () => clearTimeout(timeout);
        }

        console.log('Intercambiando código en el cliente (fallback)...');
        const supabase = getSupabaseBrowserClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          console.error('Auth Exchange Fallback Error:', error);
          setMessage(`No se pudo completar el inicio de sesión: ${error.message}`);
          return;
        }

        router.replace("/");
      } catch (err) {
        console.error('Auth Callback Unexpected Error:', err);
        setMessage("Error inesperado procesando la autenticación.");
      }
    };

    run();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md border-neon-blue/20 bg-card/50 backdrop-blur-xl">
        <CardContent className="p-8 text-center flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-neon-blue border-t-transparent"></div>
          <p className="text-muted-foreground font-orbitron">{message}</p>
        </CardContent>
      </Card>
    </div>
  );
}

