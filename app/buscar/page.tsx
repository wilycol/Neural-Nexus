import React from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { NewsFeed } from "@/components/news-feed";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Search } from "lucide-react";

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string | string[] };
}) {
  const qValue = searchParams?.q;
  const q = typeof qValue === "string" ? qValue : "";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      <main className="md:ml-64 pt-16">
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              Volver al inicio
            </Link>
          </Button>

          <div className="rounded-2xl border p-6 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Search className="h-5 w-5 text-neon-blue" />
              <h1 className="text-xl font-bold">Resultados de búsqueda</h1>
            </div>
            <p className="text-sm text-muted-foreground">Término: {q ? `"${q}"` : "—"}</p>
          </div>

          {q ? (
            <NewsFeed search={q} />
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">Escribe algo en la barra de búsqueda para comenzar</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
