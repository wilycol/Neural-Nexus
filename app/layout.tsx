import type { Metadata } from "next";
import { Suspense } from "react";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";
import { MascotOverlay } from "@/components/mascot-overlay";
import { StatsTracker } from "@/components/stats-tracker";
import "./globals.css";

export const metadata: Metadata = {
  title: "Neural Nexus - Portal de Noticias de IA",
  description: "Portal inteligente de contenido automatizado enfocado en IA, robótica y tecnología emergente.",
  keywords: ["IA", "inteligencia artificial", "noticias", "AI", "machine learning", "deep learning", "OpenAI", "ChatGPT"],
  authors: [{ name: "Neural Nexus" }],
  icons: {
    icon: [{ url: "/brand.png", type: "image/png" }],
    apple: [{ url: "/brand.png", type: "image/png" }],
  },
  openGraph: {
    title: "Neural Nexus - Portal de Noticias de IA",
    description: "Portal inteligente de contenido automatizado enfocado en IA, robótica y tecnología emergente.",
    type: "website",
    locale: "es_ES",
  },
  twitter: {
    card: "summary_large_image",
    title: "Neural Nexus - Portal de Noticias de IA",
    description: "Portal inteligente de contenido automatizado enfocado en IA, robótica y tecnología emergente.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const originalError = console.error;
                console.error = function() {
                  const msg = arguments[0] ? arguments[0].toString() : '';
                  if (msg.includes('toolbar.js') || msg.includes('Receiving end does not exist')) {
                    return;
                  }
                  originalError.apply(console, arguments);
                };
              })();
            `,
          }}
        />
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1327982622260280"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className="font-exo antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <StatsTracker />
          <div className="flex min-h-screen bg-background text-foreground">
            {/* Sidebar persistente wrapped in Suspense for useSearchParams fix */}
            <Suspense fallback={<div className="hidden h-[calc(100vh-4rem)] w-64 border-r bg-background md:flex" />}>
              <Sidebar />
            </Suspense>
            
            {/* Contenedor principal con Header y Contenido */}
            <div className="flex-1 flex flex-col md:ml-64 relative min-w-0">
              <Header />
              <main className="flex-1 w-full overflow-x-hidden">
                {children}
              </main>
            </div>
          </div>
          
          <MascotOverlay />
          <Toaster position="bottom-right" richColors />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
