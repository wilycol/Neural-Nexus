import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";
import { MascotOverlay } from "@/components/mascot-overlay";
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
      <body className="font-exo antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <MascotOverlay />
          <Toaster position="bottom-right" richColors />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
