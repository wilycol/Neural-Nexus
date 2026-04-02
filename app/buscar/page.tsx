import React from "react";
import Link from "next/link";
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
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link href="/" className="gap-1 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio
        </Link>
      </Button>

      <div className="rounded-2xl border bg-muted/20 p-6 mb-8 backdrop-blur-sm shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Search className="h-6 w-6 text-neon-blue" />
          <h1 className="text-2xl font-bold font-orbitron tracking-tight">Resultados de búsqueda</h1>
        </div>
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          Término buscado: <span className="text-neon-purple font-semibold">{q ? `"${q}"` : "Ninguno"}</span>
        </p>
      </div>

      {q ? (
        <NewsFeed search={q} />
      ) : (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center">
            <Search className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">Escribe algo en la barra de búsqueda para comenzar la exploración espacial</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
