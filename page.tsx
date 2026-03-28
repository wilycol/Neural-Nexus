"use client";

import React from "react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { NewsFeed } from "@/components/news-feed";
import { Top5Section } from "@/components/top5-section";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Flame, Newspaper } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />

      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="md:ml-64 pt-16">
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          {/* Hero section */}
          <section className="mb-8">
            <div className="rounded-2xl bg-gradient-to-r from-neon-blue/10 via-neon-purple/10 to-neon-blue/10 border border-neon-blue/20 p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold font-orbitron mb-2">
                    <span className="gradient-text">Neural Nexus</span>
                  </h1>
                  <p className="text-muted-foreground max-w-lg">
                    Tu fuente automática de noticias sobre Inteligencia Artificial. 
                    Resúmenes generados por IA, análisis profundos y las últimas novedades.
                  </p>
                </div>
                <Button
                  className="bg-gradient-to-r from-neon-blue to-neon-purple text-white hover:opacity-90"
                  asChild
                >
                  <Link href="/top5">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Ver Top 5
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          {/* Top 5 Section */}
          <section className="mb-8">
            <Top5Section />
          </section>

          {/* News Feed with Tabs */}
          <section>
            <Tabs defaultValue="todas" className="w-full">
              <div className="flex items-center justify-between mb-4">
                <TabsList>
                  <TabsTrigger value="todas" className="gap-1.5">
                    <Newspaper className="h-4 w-4" />
                    Todas
                  </TabsTrigger>
                  <TabsTrigger value="virales" className="gap-1.5">
                    <Flame className="h-4 w-4" />
                    Virales
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="todas" className="mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Main feed */}
                  <div className="lg:col-span-2">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Newspaper className="h-5 w-5 text-neon-blue" />
                      Últimas Noticias
                    </h2>
                    <NewsFeed />
                  </div>

                  {/* Sidebar content */}
                  <div className="hidden lg:block space-y-6">
                    {/* Trending tags */}
                    <TrendingTags />
                    
                    {/* Newsletter */}
                    <NewsletterCard />
                    
                    {/* About */}
                    <AboutCard />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="virales" className="mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Flame className="h-5 w-5 text-orange-500" />
                      Noticias Virales
                    </h2>
                    <NewsFeed />
                  </div>
                  <div className="hidden lg:block">
                    <TrendingTags />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
    </div>
  );
}

function TrendingTags() {
  const tags = [
    { name: "ChatGPT", count: 42 },
    { name: "OpenAI", count: 38 },
    { name: "Claude", count: 25 },
    { name: "Midjourney", count: 20 },
    { name: "StableDiffusion", count: 18 },
    { name: "LLM", count: 15 },
  ];

  return (
    <div className="rounded-lg border p-4">
      <h3 className="font-semibold mb-3">Tendencias</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Link
            key={tag.name}
            href={`/buscar?q=${tag.name}`}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-muted text-xs hover:bg-accent transition-colors"
          >
            #{tag.name}
            <span className="text-muted-foreground">{tag.count}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function NewsletterCard() {
  return (
    <div className="rounded-lg border p-4 bg-gradient-to-br from-neon-blue/5 to-neon-purple/5">
      <h3 className="font-semibold mb-2">Newsletter IA</h3>
      <p className="text-sm text-muted-foreground mb-3">
        Recibe las mejores noticias de IA en tu inbox cada semana.
      </p>
      <Button size="sm" className="w-full" variant="outline">
        Suscribirme
      </Button>
    </div>
  );
}

function AboutCard() {
  return (
    <div className="rounded-lg border p-4">
      <h3 className="font-semibold mb-2">Sobre Neural Nexus</h3>
      <p className="text-sm text-muted-foreground">
        Portal automatizado de noticias de IA. Usamos inteligencia artificial 
        para resumir, analizar y curar el mejor contenido del ecosistema de IA.
      </p>
    </div>
  );
}
