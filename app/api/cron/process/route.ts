import { NextRequest, NextResponse } from 'next/server';
import Parser from 'rss-parser';
import { createServerClient } from '@/lib/supabase-server';
import { processNewsWithAI } from '@/lib/groq';
import { generateSlug } from '@/lib/utils';
import type { Database } from '@/types/database';

const rssParser = new Parser();

const asString = (value: unknown) => (typeof value === 'string' ? value : '');
const asStringArray = (value: unknown) =>
  Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string') : [];

export const dynamic = "force-dynamic";

// Handler para cron job de Vercel
export async function GET(request: NextRequest) {
  const supabase = createServerClient();
  let logId: string | null = null;
  const startedAt = new Date().toISOString();

  try {
    // 0. Autenticación Cron
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // 1. Inicializar Log en Supabase
    const { data: logData, error: logInitError } = await supabase
      .from('crawler_logs')
      .insert({
        started_at: startedAt,
        status: 'running',
        sources_processed: 0,
        items_found: 0,
        published_items: []
      })
      .select('id')
      .single();
    
    if (logInitError) {
        console.error("Error inicializando log:", logInitError);
    }
    logId = logData?.id || null;

    const results = {
      news_processed: 0,
      news_published: 0,
      published_items: [] as Array<{title: string, link: string}>,
      errors: [] as string[],
    };

    // 2. Obtener fuentes de la Base de Datos
    const { data: dbSources, error: sourcesError } = await supabase
      .from('news_sources')
      .select('*')
      .eq('is_active', true)
      .order('priority', { ascending: false });

    if (sourcesError) {
        console.error("Error obteniendo fuentes:", sourcesError);
        throw sourcesError;
    }

    const allNewsItems: Array<{
      title: string;
      link: string;
      content: string;
      pubDate: string;
      categories: string[];
      source: string;
      sourceCategory: string;
      sourceId: string;
    }> = [];

    const sourcesToProcess = dbSources || [];

    for (const source of sourcesToProcess) {
      try {
        const feed = await rssParser.parseURL(source.rss_url);
        
        for (const item of feed.items?.slice(0, 3) || []) {
          allNewsItems.push({
            title: asString(item.title),
            link: asString(item.link),
            content: asString(item.content || item["content:encoded"] || item.contentSnippet),
            pubDate: asString(item.pubDate || item.isoDate || new Date().toISOString()),
            categories: asStringArray(item.categories),
            source: source.name,
            sourceCategory: source.category || 'Inteligencia Artificial',
            sourceId: source.id
          });
        }

        // Actualizar estadísticas de la fuente
        await supabase
          .from('news_sources')
          .update({ 
            last_fetch_at: new Date().toISOString(),
            fetch_count: (source.fetch_count || 0) + 1 
          })
          .eq('id', source.id);

      } catch (error) {
        const errorMsg = `Error en ${source.name}: ${error instanceof Error ? error.message : 'Unknown'}`;
        console.error(errorMsg);
        results.errors.push(errorMsg);
      }
    }

    // 3. Procesar cada noticia con IA y Guardar
    const processedNews: Database["public"]["Tables"]["news"]["Row"][] = [];

    for (const item of allNewsItems) {
      try {
        // Verificar duplicados
        const { data: existing } = await supabase
          .from('news')
          .select('id')
          .or(`title.ilike.%${item.title.substring(0, 50)}%,source_url.eq.${item.link}`)
          .limit(1);

        if (existing && existing.length > 0) continue;

        results.news_processed++;

        // Procesar con IA
        const processed = await processNewsWithAI(item.title, item.content, item.source);

        if (processed.should_publish && processed.relevance_score >= 0.5) {
          const slug = generateSlug(processed.title);
          const imageUrl = `https://picsum.photos/seed/${slug}/800/450`;

          const { data: newsData, error: insertError } = await supabase
            .from('news')
            .insert({
              title: processed.title,
              summary: processed.summary,
              content: item.content,
              image_url: imageUrl,
              source_name: item.source,
              source_url: item.link,
              published_at: item.pubDate,
              category: processed.category || item.sourceCategory,
              tags: processed.tags,
              relevance_score: processed.relevance_score,
              is_top_story: processed.relevance_score >= 0.8,
              ai_generated: true,
              slug: `${slug}-${Date.now().toString(36)}`,
            })
            .select()
            .single();

          if (!insertError && newsData) {
            results.news_published++;
            processedNews.push(newsData);
            results.published_items.push({ title: newsData.title, link: item.link });

            // 4. ORQUESTACIÓN TOP 5 (Para Beatriz)
            if (processed.relevance_score >= 0.8) {
              const videoPrompt = `Analiza esta noticia y crea un video cortado en 3 escenas de impacto.
              TÍTULO: ${processed.title}
              RESUMEN: ${processed.summary}
              ESTILO: Informativo Neural Nexus.`;

              await supabase.from('top_5_tasks').insert({
                news_id: newsData.id,
                video_prompt: videoPrompt,
                status: 'pending',
                priority: Math.round(processed.relevance_score * 100)
              });

              // Llamada a Beatriz Bridge (Opcional)
              if (process.env.BEATRIZ_API_URL) {
                  fetch(`${process.env.BEATRIZ_API_URL}/api/orchestrator/video-from-portal`, {
                      method: 'POST',
                      headers: { 
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${process.env.BEATRIZ_API_KEY}`
                      },
                      body: JSON.stringify({ news_id: newsData.id, title: processed.title })
                  }).catch(() => console.warn("Beatriz Bridge no disponible, la tarea está en Supabase."));
              }
            }
          }
        }
      } catch (error) {
        const errorMsg = `Error procesando noticia: ${error instanceof Error ? error.message : 'Unknown'}`;
        console.error(errorMsg);
        results.errors.push(errorMsg);
      }
    }

    // 5. Finalizar Log en Supabase
    if (logId) {
      await supabase
        .from('crawler_logs')
        .update({
          finished_at: new Date().toISOString(),
          status: 'success',
          sources_processed: sourcesToProcess.length,
          items_found: results.news_processed,
          published_items: results.published_items,
          error_log: results.errors.length > 0 ? results.errors.join('\n') : null
        })
        .eq('id', logId);
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      ...results,
    });

  } catch (error) {
    console.error('Error en cron job:', error);
    if (logId) {
        await supabase
          .from('crawler_logs')
          .update({ 
            status: 'failed', 
            error_log: error instanceof Error ? error.message : 'Unknown fatal error' 
          })
          .eq('id', logId);
    }
    return NextResponse.json(
      { error: 'Error en procesamiento' },
      { status: 500 }
    );
  }
}
