import { Suspense } from "react";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";
import { MascotOverlay } from "@/components/mascot-overlay";
import { StatsTracker } from "@/components/stats-tracker";
import { AffiliateTracker } from "@/components/affiliate-tracker";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import "./globals.css";

// ... generateMetadata implementation ...

export default async function RootLayout({
  children,
  params: {locale}
}: {
  children: React.ReactNode;
  params: {locale: string};
}) {
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* ... existing scripts ... */}
      </head>
      <body className="font-exo antialiased">
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <Suspense fallback={null}>
              <AffiliateTracker />
            </Suspense>
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
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
