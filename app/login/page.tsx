"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Github, Loader2 } from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { getSupabaseBrowserClient } from "@/lib/supabase-client";
import { useAuth } from "@/hooks/use-auth";

export default function LoginPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      setRedirecting(true);
      router.push("/");
    }
  }, [user, authLoading, router]);

  const handleGoogleLogin = async () => {
    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        toast.error(error.message);
      }
    } catch {
      toast.error("Error al iniciar sesión con Google");
    }
  };

  const handleGithubLogin = async () => {
    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        toast.error(error.message);
      }
    } catch {
      toast.error("Error al iniciar sesión con GitHub");
    }
  };

  // Pantalla de carga inteligente si ya hay sesión
  if (authLoading || redirecting) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Logo size={80} className="animate-pulse mb-8" />
        <div className="flex items-center gap-3 text-neon-blue">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="font-orbitron tracking-widest text-sm uppercase">Reconociendo identidad...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/">
            <Logo size={60} />
          </Link>
        </div>

        <Card className="border-neon-blue/20 shadow-2xl shadow-neon-blue/5">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-orbitron">Bienvenido de vuelta</CardTitle>
            <CardDescription>
              Inicia sesión para acceder a tu feed personalizado
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Social login */}
            <div className="grid grid-cols-1 gap-3">
              <Button
                variant="outline"
                onClick={handleGoogleLogin}
                className="w-full h-12 text-base font-orbitron hover:border-neon-blue/40 hover:bg-neon-blue/5 transition-all group"
              >
                <svg className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continuar con Google
              </Button>
              <Button
                variant="outline"
                onClick={handleGithubLogin}
                className="w-full h-12 text-base font-orbitron hover:border-neon-purple/40 hover:bg-neon-purple/5 transition-all group"
              >
                <Github className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" />
                Continuar con GitHub
              </Button>
            </div>

            <div className="pt-4 text-center">
              <p className="text-[10px] text-muted-foreground bg-muted/20 py-3 px-4 rounded-lg border border-border/50 uppercase tracking-widest font-orbitron">
                Autenticación Segura vía OAuth 2.0
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <div className="text-sm text-center text-muted-foreground">
              ¿No tienes cuenta?{" "}
              <Link
                href="/registro"
                className="text-neon-blue hover:underline font-bold"
              >
                Únete a Neural Nexus
              </Link>
            </div>
            <Link
              href="/"
              className="text-sm text-center text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Volver al inicio
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
