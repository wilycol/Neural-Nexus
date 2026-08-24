"use client";

import React, { useState } from "react";
import {
  Zap,
  CheckCircle2,
  Flame,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

// 5 Ángulos de Conversión
const CONVERSION_ANGLES = [
  {
    number: "01",
    title: "Gancho de Dolor Emocional",
    desc: "Toca la herida más sensible de tu cliente ideal en los primeros 3 segundos, frenando el scroll compulsivo de TikTok e Instagram.",
    tag: "Hook 3s"
  },
  {
    number: "02",
    title: "Demostración de Producto Ultra-Realista",
    desc: "Visuales 4K fotorrealistas de tu producto o servicio en acción, con iluminación de cine y dinamismo comercial.",
    tag: "High Visual"
  },
  {
    number: "03",
    title: "Matador de Objecciones",
    desc: "Aborda las dudas típicas que frenan la compra (precio, calidad, confianza, garantía) y las pulveriza con lógica y estética.",
    tag: "Friction Zero"
  },
  {
    number: "04",
    title: "UGC Hiperrealista Neuronal",
    desc: "Avatares y creadores de contenido sintéticos con gestos y expresiones 100% humanas recomendando tu marca con naturalidad.",
    tag: "Social Proof"
  },
  {
    number: "05",
    title: "Oferta Irresistible & FOMO",
    desc: "Llamado a la acción con escasez y urgencia psicológica para acelerar el cierre directo de ventas y visitas al checkout.",
    tag: "Closing Offer"
  }
];

// Comparativa Tradicional vs Kitsune AI ADS
const COMPARISON_DATA = [
  {
    feature: "Costo de Producción (5 Videos)",
    traditional: "$2.500.000 - $5.000.000 COP",
    kitsune: "$400.000 COP (Ahorro > 85%)",
    highlight: true
  },
  {
    feature: "Tiempo de Entrega",
    traditional: "2 a 4 semanas",
    kitsune: "24 a 48 horas",
    highlight: true
  },
  {
    feature: "Calidad Visual & Efectos",
    traditional: "Limitada a cámaras y sets físicos",
    kitsune: "Cine 4K Ultra-Realista con IA",
    highlight: false
  },
  {
    feature: "Voz Neuronal & Locución",
    traditional: "Costo extra por locutor ($300K+)",
    kitsune: "Voz Neuronal Ultra-Humana Incluida",
    highlight: false
  },
  {
    feature: "Adaptabilidad a Tendencias",
    traditional: "Lenta y costosa de regrabar",
    kitsune: "Iteración en minutos",
    highlight: false
  }
];

export default function KitsuneAdsPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Enlaces de WhatsApp para consultas o soporte previo
  const whatsappUrl = `https://wa.me/573229067026?text=${encodeURIComponent(
    "¡Hola Beatriz! Me interesa contratar Kitsune AI ADS para mi negocio. Quiero más información sobre los videos ultra-realistas."
  )}`;

  // Enlaces de Pago Wompi Directos
  const singleAdPaymentUrl = "https://checkout.nequi.wompi.co/l/kitsune_single_100k";
  const pack5PaymentUrl = "https://checkout.nequi.wompi.co/l/kitsune_pack_400k";

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-amber-500/15 via-purple-600/15 to-cyan-500/10 blur-[150px] pointer-events-none -z-10" />

      {/* HERO SECTION */}
      <section className="container mx-auto px-4 pt-16 pb-20 md:pt-24 md:pb-28 text-center max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs md:text-sm font-orbitron font-semibold mb-6 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
        >
          <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>MOTOR DE PRODUCCIÓN PUBLICITARIA INDUSTRIAL • KITSUNE AI ADS</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="text-4xl md:text-6xl lg:text-7xl font-extrabold font-orbitron tracking-tight mb-6 leading-tight"
        >
          Videos Publicitarios <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-orange-400 to-purple-400">
            Ultra-Realistas con IA
          </span>{" "}
          que Multiplican tus Ventas
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed"
        >
          Deja de gastar millones en agencias tradicionales y semanas de grabación. Creamos anuncios en video con calidad cinematográfica 4K, ganchos psicológicos virales y voz neuronal que disparan tu CTR en Meta y TikTok Ads.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <a
            href="#precios"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-extrabold font-orbitron text-base shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all hover:scale-[1.03] active:scale-[0.98]"
          >
            <Zap className="w-5 h-5 fill-current" />
            <span>Ver Planes & Ordenar</span>
          </a>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-card/60 backdrop-blur-xl border border-border hover:border-amber-500/50 text-foreground font-semibold text-base transition-all hover:bg-card/80"
          >
            <MessageSquare className="w-5 h-5 text-emerald-400" />
            <span>Hablar con Beatriz AI</span>
            <ExternalLink className="w-4 h-4 opacity-60" />
          </a>
        </motion.div>

        {/* 🎬 REPRODUCTOR DE VIDEO SHOWCASE OFICIAL */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="relative max-w-sm mx-auto rounded-[32px] overflow-hidden border-2 border-amber-500/50 bg-black shadow-[0_0_50px_rgba(245,158,11,0.25)] p-2 mb-16 group"
        >
          <div className="relative rounded-[26px] overflow-hidden bg-zinc-950 aspect-[9/16]">
            <video
              src="/Kitsune_AI_ADS_Neural_Sites_Showcase.mp4"
              controls
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-amber-500/40 text-[10px] font-orbitron font-bold text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>SHOWCASE KITSUNE ADS 4K</span>
            </div>
          </div>
        </motion.div>

        {/* Métricas / Social Proof */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-12 border-t border-border/40">
          <div className="flex flex-col items-center">
            <span className="text-3xl md:text-4xl font-orbitron font-extrabold text-amber-400">3.4X</span>
            <span className="text-xs md:text-sm text-muted-foreground mt-1">Mayor CTR en Anuncios</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl md:text-4xl font-orbitron font-extrabold text-primary">24h</span>
            <span className="text-xs md:text-sm text-muted-foreground mt-1">Tiempo de Entrega</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl md:text-4xl font-orbitron font-extrabold text-emerald-400">-85%</span>
            <span className="text-xs md:text-sm text-muted-foreground mt-1">Menos Costo vs Agencia</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl md:text-4xl font-orbitron font-extrabold text-purple-400">4K UHD</span>
            <span className="text-xs md:text-sm text-muted-foreground mt-1">Calidad Cinematográfica</span>
          </div>
        </div>
      </section>

      {/* LOS 5 ÁNGULOS DE CONVERSIÓN */}
      <section className="py-20 bg-card/20 border-y border-border/30 backdrop-blur-xl">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="outline" className="border-amber-500/40 text-amber-400 font-orbitron mb-3">
              ESTRATEGIA CIENTÍFICA DE TRÁFICO
            </Badge>
            <h2 className="text-3xl md:text-4xl font-orbitron font-extrabold mb-4">
              El Sistema de los 5 Ángulos de Conversión
            </h2>
            <p className="text-muted-foreground text-base md:text-lg">
              No creamos videos bonitos por casualidad; diseñamos un arsenal publicitario completo para atacar cada fase psicológica de compra de tu cliente.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {CONVERSION_ANGLES.map((angle, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -6 }}
                className="flex flex-col justify-between p-6 rounded-3xl bg-card/50 border border-border hover:border-amber-500/50 transition-all shadow-[0_0_30px_rgba(0,0,0,0.2)]"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-orbitron font-extrabold text-amber-400/60">{angle.number}</span>
                    <Badge variant="secondary" className="text-[10px] uppercase font-mono">
                      {angle.tag}
                    </Badge>
                  </div>
                  <h3 className="text-base font-orbitron font-bold mb-3 text-foreground">{angle.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{angle.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARATIVA DIRECTA */}
      <section className="py-20 container mx-auto px-4 max-w-5xl">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-orbitron font-extrabold mb-4">
            Agencia Tradicional vs. Kitsune AI ADS
          </h2>
          <p className="text-muted-foreground">
            Descubre por qué las marcas inteligentes están reemplazando las costosas producciones físicas por motores neuronales.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse rounded-3xl overflow-hidden border border-border bg-card/30 backdrop-blur-xl">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-xs md:text-sm font-orbitron uppercase tracking-wider">
                <th className="p-4 md:p-6 text-foreground">Característica</th>
                <th className="p-4 md:p-6 text-muted-foreground">Agencia Tradicional</th>
                <th className="p-4 md:p-6 text-amber-400 bg-amber-500/10">Kitsune AI ADS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {COMPARISON_DATA.map((row, idx) => (
                <tr key={idx} className="hover:bg-muted/10 transition-colors">
                  <td className="p-4 md:p-6 font-medium text-foreground">{row.feature}</td>
                  <td className="p-4 md:p-6 text-muted-foreground">{row.traditional}</td>
                  <td className={`p-4 md:p-6 font-bold ${row.highlight ? "text-amber-400 bg-amber-500/5 font-orbitron" : "text-foreground bg-amber-500/5"}`}>
                    {row.kitsune}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* TABLA DE PRECIOS & ENLACES DE PAGO */}
      <section id="precios" className="py-20 bg-gradient-to-b from-card/30 to-background border-t border-border/40">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="bg-amber-500 text-black font-orbitron font-bold mb-3">
              OFERTA INDUSTRIAL DIRECTA
            </Badge>
            <h2 className="text-3xl md:text-5xl font-orbitron font-extrabold mb-4">
              Escoge tu Plan de Producción
            </h2>
            <p className="text-muted-foreground text-base md:text-lg">
              Precios transparentes en Pesos Colombianos (COP). Sin contratos ni cobros ocultos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* PLAN INDIVIDUAL */}
            <Card className="flex flex-col justify-between p-8 rounded-3xl bg-card/50 border border-border hover:border-primary/50 transition-all shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="outline" className="font-orbitron text-xs">
                    PLAN TRIPWIRE
                  </Badge>
                  <span className="text-xs text-muted-foreground font-mono">1 Video Ad</span>
                </div>

                <h3 className="text-2xl font-orbitron font-bold text-foreground mb-2">
                  Anuncio Individual Ultra-Realista
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Ideal para probar la potencia de Kitsune Ads en un producto específico o validar un nuevo ángulo de venta.
                </p>

                <div className="flex items-baseline gap-2 mb-8">
                  <span className="text-4xl md:text-5xl font-orbitron font-extrabold text-foreground">$100.000</span>
                  <span className="text-muted-foreground text-sm font-semibold">COP</span>
                </div>

                <div className="space-y-3.5 mb-8 text-sm">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>1 Video Publicitario Vertical 9:16 (Reels/TikTok)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>Guion persuasivo con Gancho de 3 segundos</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>Voz Neuronal de locución ultra-humana</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>Subtítulos dinámicos de alta retención</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>Entrega en 24 a 48 horas en calidad HD</span>
                  </div>
                </div>
              </div>

              <a
                href={singleAdPaymentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-2xl bg-card border border-primary/40 hover:border-primary text-foreground font-orbitron font-bold text-sm transition-all hover:bg-primary/10"
              >
                <span>Pagar con Nequi / Wompi ($100K)</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </Card>

            {/* PLAN PACK 5 VIDEOS (DESTACADO) */}
            <Card className="relative flex flex-col justify-between p-8 rounded-3xl bg-gradient-to-b from-amber-500/10 via-card/80 to-card border-2 border-amber-500/60 shadow-[0_0_50px_rgba(245,158,11,0.2)]">
              {/* Badge Más Popular */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-black font-orbitron font-extrabold text-[11px] uppercase tracking-wider shadow-lg">
                ★ OFERTA MÁS VENDIDA • AHORRA $100.000 COP
              </div>

              <div>
                <div className="flex items-center justify-between mb-4 mt-2">
                  <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/40 font-orbitron text-xs">
                    PACK VIRAL TESTING
                  </Badge>
                  <span className="text-xs text-amber-400 font-mono font-bold">$80.000 COP / video</span>
                </div>

                <h3 className="text-2xl font-orbitron font-bold text-foreground mb-2">
                  Pack 5 Video Ads Ultra-Realistas
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  El sistema completo de 5 ángulos para dominar la pauta en Meta y TikTok Ads sin quemar presupuesto.
                </p>

                <div className="flex items-baseline gap-2 mb-8">
                  <span className="text-4xl md:text-5xl font-orbitron font-extrabold text-amber-400">$400.000</span>
                  <span className="text-muted-foreground text-sm font-semibold">COP</span>
                  <span className="text-xs text-muted-foreground/60 line-through ml-2">$500.000 COP</span>
                </div>

                <div className="space-y-3.5 mb-8 text-sm">
                  <div className="flex items-center gap-3 font-semibold text-foreground">
                    <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                    <span>5 Videos Publicitarios (Los 5 Ángulos de Conversión)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                    <span>5 Guiones y Hooks diferenciados para A/B Testing</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                    <span>Voces Neuronales múltiples y música comercial</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                    <span>Formatos listos para Instagram, TikTok y YouTube Shorts</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                    <span>Entrega Prioritaria + Asesoría de Beatriz AI</span>
                  </div>
                </div>
              </div>

              <a
                href={pack5PaymentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-3 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-orbitron font-extrabold text-sm shadow-[0_0_25px_rgba(245,158,11,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Ordenar Pack x $400.000 COP</span>
              </a>
            </Card>
          </div>
        </div>
      </section>

      {/* PREGUNTAS FRECUENTES (FAQ) */}
      <section className="py-20 container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-orbitron font-extrabold mb-3">Preguntas Frecuentes</h2>
          <p className="text-muted-foreground">Todo lo que necesitas saber antes de ordenar tus videos.</p>
        </div>

        <div className="space-y-4">
          {[
            {
              q: "¿Qué necesito entregar para que creen mis videos?",
              a: "Solo necesitamos el nombre de tu marca, las fotos/enlaces de tu producto o servicio y el mensaje principal que deseas comunicar. Beatriz AI se encarga de estructurar el guion, generar la animación ultra-realista y ensamblar todo el video."
            },
            {
              q: "¿Puedo usar estos videos en mis campañas de Meta Ads y TikTok Ads?",
              a: "¡Totalmente! Todos los videos se entregan en formato estándar vertical (9:16) en alta definición, optimizados específicamente para cumplir las políticas de publicidad de Meta y TikTok."
            },
            {
              q: "¿Cuánto tiempo tarda la entrega?",
              a: "El tiempo de entrega promedio es de 24 a 48 horas hábiles después de que Beatriz AI confirma los datos de tu producto a través de WhatsApp."
            },
            {
              q: "¿Qué pasa si quiero hacer un ajuste?",
              a: "Incluimos una ronda de ajustes para asegurar que el tono, los colores y los textos coincidan al 100% con la identidad de tu marca."
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-border bg-card/40 backdrop-blur-lg cursor-pointer transition-all hover:border-amber-500/40"
              onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-base font-orbitron font-semibold text-foreground">{item.q}</h3>
                {openFaq === idx ? (
                  <ChevronUp className="w-5 h-5 text-amber-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
                )}
              </div>
              {openFaq === idx && (
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed pt-2 border-t border-border/40">
                  {item.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="py-16 border-t border-border/40 text-center bg-card/10">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-orbitron font-bold mb-4">
            ¿Listo para llevar tu publicidad al siguiente nivel?
          </h2>
          <p className="text-muted-foreground mb-8 text-sm md:text-base">
            Empieza hoy mismo y descubre el impacto de tener videos ultra-realistas creados por Inteligencia Artificial en tu negocio.
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-orbitron font-bold text-sm shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all hover:scale-105"
          >
            <MessageSquare className="w-5 h-5 fill-current" />
            <span>Consultar por WhatsApp (+57 322 9067026)</span>
          </a>
        </div>
      </section>
    </div>
  );
}
