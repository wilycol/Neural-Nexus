
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Faltan credenciales de Supabase en .env (URL o SERVICE_ROLE_KEY)");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function auditNewsTable() {
  console.log("🔍 [AUDITORÍA] Iniciando escaneo de la tabla 'news'...");

  // 1. Verificar conteo total
  const { count, error: countError } = await supabase
    .from("news")
    .select("*", { count: "exact", head: true });

  if (countError) {
    console.error("❌ Error al contar filas:", countError);
    return;
  }
  console.log(`📊 Conteo total de noticias: ${count}`);

  // 2. Verificar últimas 5 noticias
  const { data: lastNews, error: fetchError } = await supabase
    .from("news")
    .select("id, title, published_at, category, status, is_top_story")
    .order("published_at", { ascending: false })
    .limit(5);

  if (fetchError) {
    console.error("❌ Error al obtener últimas noticias:", fetchError);
  } else {
    console.log("📝 Últimas 5 noticias en DB:");
    console.table(lastNews);
  }

  // 3. Verificar si hay noticias con status NULL o diferente a 'published'
  const { count: draftCount } = await supabase
    .from("news")
    .select("*", { count: "exact", head: true })
    .neq("status", "published");
  
  console.log(`⚠️ Noticias con status diferente a 'published': ${draftCount}`);

  // 4. Verificar políticas RLS (Intento de lectura pública sin service role)
  const publicClient = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "");
  const { data: publicData, error: publicError } = await publicClient
    .from("news")
    .select("id")
    .limit(1);

  if (publicError) {
    console.log("🚫 RLS está BLOQUEANDO el acceso público:", publicError.message);
  } else {
    console.log("✅ RLS permite acceso público (Select OK).");
  }
}

auditNewsTable();
