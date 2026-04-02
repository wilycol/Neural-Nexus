"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Brain, Wrench, Laugh, FileText, Drama } from "lucide-react";
import { NewsFeed } from "@/components/news-feed";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const categoryInfo: Record<string, { title: string; description: string; icon: React.ElementType }> = {
  modelos: {
    title: "Modelos de IA",
    description: "Los últimos modelos de lenguaje, visión y multimodales",
    icon: Brain,
  },
  herramientas: {
    title: "Herramientas",
    description: "Nuevas herramientas y productos impulsados por IA",
    icon: Wrench,
  },
  memes: {
    title: "Memes de IA",
    description: "Lo más divertido del mundo de la inteligencia artificial",
    icon: Laugh,
  },
  papers: {
    title: "Papers & Research",
    description: "Investigaciones y publicaciones científicas",
    icon: FileText,
  },
  drama: {
    title: "Drama & Controversias",
    description: "Las polémicas y debates del ecosistema IA",
    icon: Drama,
  },
};

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const info = categoryInfo[slug];

  if (!info) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-5xl text-center">
        <Card>
          <CardContent className="p-12">
            <h1 className="text-2xl font-bold mb-2">Categoría no encontrada</h1>
            <p className="text-muted-foreground mb-4">
              La categoría que buscas no existe
            </p>
            <Button asChild>
              <Link href="/">Volver al inicio</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const Icon = info.icon;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Back button */}
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link href="/" className="gap-1">
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio
        </Link>
      </Button>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center">
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-orbitron">{info.title}</h1>
            <p className="text-muted-foreground">{info.description}</p>
          </div>
        </div>
      </div>

      {/* News Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <NewsFeed category={slug} />
        </div>
        <div className="hidden lg:block">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Otras categorías</h3>
              <div className="space-y-2">
                {Object.entries(categoryInfo)
                  .filter(([key]) => key !== slug)
                  .map(([key, catInfo]) => {
                    const CatIcon = catInfo.icon;
                    return (
                      <Link
                        key={key}
                        href={`/categoria/${key}`}
                        className="flex items-center gap-2 p-2 rounded-md hover:bg-accent transition-colors"
                      >
                        <CatIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{catInfo.title}</span>
                      </Link>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
