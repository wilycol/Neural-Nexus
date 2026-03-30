import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

async function diagnose() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('ERROR: Faltan variables de entorno (URL o Service Key)');
    return;
  }

  const admin = createClient(supabaseUrl, supabaseServiceKey);
  const anon = createClient(supabaseUrl, supabaseAnonKey);

  console.log('--- DIAGNÓSTICO DE NOTICIAS ---');
  
  // 1. Conteo Admin
  const { count: adminCount, error: adminError } = await admin
    .from('news')
    .select('*', { count: 'exact', head: true });
  
  console.log('Conteo (Admin/Service Role):', adminCount, adminError || '');

  // 2. Conteo Público (Anon)
  const { count: anonCount, error: anonError } = await anon
    .from('news')
    .select('*', { count: 'exact', head: true });
  
  console.log('Conteo (Público/Anon):', anonCount, anonError || '');

  if (adminCount !== anonCount) {
    console.error('!!! DISCREPANCIA DETECTADA: RLS está bloqueando el acceso público.');
  }

  // 3. Inspección de primeras 25 noticias (Admin)
  const { data: news, error: fetchError } = await admin
    .from('news')
    .select('id, title, category, status, published_at, created_at')
    .order('published_at', { ascending: false })
    .limit(25);

  if (fetchError) {
    console.error('Error al obtener noticias:', fetchError);
    return;
  }

  console.log('\n--- ÚLTIMAS 25 NOTICIAS (ADMIN VIEW) ---');
  console.table(news?.map(n => ({
    id: n.id?.substring(0, 8),
    title: n.title?.substring(0, 30) + '...',
    cat: n.category,
    status: n.status,
    pub_at: n.published_at,
    created: n.created_at
  })));

  // 4. Verificar RLS en Postgres
  const { data: rlsCheck } = await admin.rpc('get_table_rls_info', { table_name: 'news' }).catch(() => ({ data: null }));
  if (rlsCheck) {
    console.log('\nRLS Info:', rlsCheck);
  }
}

diagnose().catch(console.error);
