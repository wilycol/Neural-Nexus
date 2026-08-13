import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';
import { getPagination } from '@/lib/supabase';
import type { Database } from '@/types/database';
import { mutateNewsForVideo } from '@/lib/groq';

const NEWS_CATEGORIES: Array<Database["public"]["Tables"]["news"]["Row"]["category"]> = [
  "Inteligencia Artificial",
  "Software",
  "Hardware",
  "Robótica",
  "Historia Tech",
  "Futuro y Tendencias",
  "Startups Tech",
  "IA en la Vida Real",
  "Seguridad y Ética",
  "Gadgets",
  "Datos Curiosos Tech",
  "Rankings",
];
const NEWS_CATEGORY_SET = new Set(NEWS_CATEGORIES);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const isTopStory = searchParams.get('top') === 'true';
    // 'nodes' → solo noticias de la federación (Neural Ad Engine)
    // 'portal' (default) → excluye noticias de nodos de la federación
    const source = searchParams.get('source') || 'portal';
    
    const supabase = (() => {
      try {
        return createServerClient();
      } catch {
        return null;
      }
    })();
    if (!supabase) {
      return NextResponse.json({
        data: [],
        total: 0,
        page,
        limit,
        hasMore: false,
        warning: 'Supabase no está configurado',
      });
    }
    const { from, to } = getPagination(page, limit);

    let query = supabase
      .from('news')
      .select('*', { count: 'exact' });

    // ── FILTRO NEURAL HIVE ────────────────────────────────────────────────────
    // Las noticias de los nodos federados tienen source_url que apunta a
    // dominios *.vercel.app de los nodos (nodetopclick.vercel.app, etc.)
    // y sus tags contienen el prefijo 'node_'.
    // El feed principal del portal NO debe mostrarlas; solo el Neural Ad Engine.
    if (source === 'nodes') {
      // Neural Ad Engine: traer SOLO noticias de nodos federados
      query = query.or('source_name.eq.Auto-Publisher Autónomo,source_url.ilike.%node%.vercel.app%,tags.cs.{node_top_click},tags.cs.{node_euro__arkadia},tags.cs.{node_euro___arkadia},tags.cs.{node_jarvis_easy_stock},tags.cs.{node_robotic_news},tags.cs.{node_asesoria_juridica},tags.cs.{node_ferreteria_la_21},tags.cs.{node_miguel_lara_abogados},tags.cs.{node_secretos_de_mujer},tags.cs.{node_burger_queen_medellin},tags.cs.{node_cafeter_a_la_rosa},tags.cs.{node_estanco_el_desmadre},tags.cs.{node_helader_a_boquitas},tags.cs.{node_jm_tecnologia___accesorios},tags.cs.{node_la_principal_de_licores},tags.cs.{node_v2_taller_torque_proof},tags.cs.{node_wily},tags.cs.{node_wily_col__prueba_}');
    } else {
      // Feed principal del portal: EXCLUIR noticias de nodos federados
      // Excluir por source_name, por coincidencia de url y por cada una de las etiquetas del nodo
      query = query
        .not('source_name', 'eq', 'Auto-Publisher Autónomo')
        .not('source_url', 'ilike', '%node%.vercel.app%')
        .not('tags', 'cs', '{node_top_click}')
        .not('tags', 'cs', '{node_euro__arkadia}')
        .not('tags', 'cs', '{node_euro___arkadia}')
        .not('tags', 'cs', '{node_jarvis_easy_stock}')
        .not('tags', 'cs', '{node_robotic_news}')
        .not('tags', 'cs', '{node_asesoria_juridica}')
        .not('tags', 'cs', '{node_ferreteria_la_21}')
        .not('tags', 'cs', '{node_miguel_lara_abogados}')
        .not('tags', 'cs', '{node_secretos_de_mujer}')
        .not('tags', 'cs', '{node_burger_queen_medellin}')
        .not('tags', 'cs', '{node_cafeter_a_la_rosa}')
        .not('tags', 'cs', '{node_estanco_el_desmadre}')
        .not('tags', 'cs', '{node_helader_a_boquitas}')
        .not('tags', 'cs', '{node_jm_tecnologia___accesorios}')
        .not('tags', 'cs', '{node_la_principal_de_licores}')
        .not('tags', 'cs', '{node_v2_taller_torque_proof}')
        .not('tags', 'cs', '{node_wily}')
        .not('tags', 'cs', '{node_wily_col__prueba_}');
    }
    // ─────────────────────────────────────────────────────────────────────────

    // Aplicar filtros
    const categoryFilter = category && NEWS_CATEGORY_SET.has(category as Database["public"]["Tables"]["news"]["Row"]["category"])
      ? (category as Database["public"]["Tables"]["news"]["Row"]["category"])
      : null;
    if (categoryFilter) {
      query = query.eq('category', categoryFilter);
    }

    if (isTopStory) {
      query = query.eq('is_top_story', true);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,summary.ilike.%${search}%,tags.cs.{${search}}`);
    }

    // Ordenar por fecha de publicación
    query = query.order('published_at', { ascending: false });

    // Paginación
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching news:', error);
      return NextResponse.json(
        { error: 'Error al obtener noticias' },
        { status: 500 }
      );
    }

    const totalCount = count || 0;
    const hasMore = from + data.length < totalCount;

    return NextResponse.json({
      data: data || [],
      total: totalCount,
      page,
      limit,
      hasMore,
    });
  } catch (error) {
    console.error('Error in news API:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST - Crear nueva noticia (para el crawler)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = createServerClient();

    // Verificar si ya existe una noticia similar (Certificación Industrial)
    // Solo bloqueamos si la URL de origen es exactamente la misma para evitar spam real
    const { data: existing } = await supabase
      .from('news')
      .select('id')
      .eq('source_url', body.source_url)
      .limit(1);

    if (existing && existing.length > 0) {
      return NextResponse.json(
        { error: 'Noticia ya existe (URL duplicada)', id: existing[0].id },
        { status: 409 }
      );
    }

    // Fallback: Generar slug si no viene en el body
    const slug = body.slug || body.title.toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    // --- BLINDAJE INDUSTRIAL: Upsert basado en slug o source_url ---
    const { data, error } = await supabase
      .from('news')
      .upsert({
        ...body,
        slug,
        created_at: body.created_at || new Date().toISOString(),
        published_at: body.published_at || new Date().toISOString(),
      }, {
        onConflict: 'slug',
        ignoreDuplicates: false // Actualizar si hay cambios
      })
      .select()
      .single();

    if (error) {
      console.error('❌ [Portal API] Error creating news:', error);
      return NextResponse.json(
        { 
          error: 'Error al crear noticia', 
          details: error.message,
          hint: error.hint,
          code: error.code 
        },
        { status: 500 }
      );
    }

    // --- PROTOCOLO ALPHA: Gatillo Automático de Misión Industrial ---
    // Si la noticia es inyectada por Beatriz y es de tipo texto/imagen
    if (data && body.source_name === 'Beatriz AutoPublisher' && body.content_type !== 'video') {
       try {
           console.log(`🚀 [Protocol Alpha] Analizando potencial viral para: ${data.title}`);
           
           // 1. Mutar el contenido para Reel usando Gemini/Groq
           const mutation = await mutateNewsForVideo(data.title, data.summary || '', data.content || '');
           
           // 2. Encolar misión en factory_missions
           const { error: missionError } = await supabase
             // eslint-disable-next-line @typescript-eslint/no-explicit-any
             .from('factory_missions' as any)
             .insert({
                news_id: data.id,
                title: mutation.video_title,
                description: mutation.video_description,
                content: `${mutation.video_hook}\n\n${data.content}`,
                platform: 'tiktok',
                mode: 'classic',
                status: 'pending',
                ai_metadata: {
                   original_title: data.title,
                   hook: mutation.video_hook
                }
             });

           if (missionError) {
             console.error('⚠️ [Protocol Alpha] Error encolando misión:', missionError);
           } else {
             console.log(`✅ [Protocol Alpha] Misión encolada con éxito para: ${mutation.video_title}`);
           }
       } catch (ptrErr) {
           console.error('❌ [Protocol Alpha] Error en el gatillo industrial:', ptrErr);
       }
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('Error in POST news:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
