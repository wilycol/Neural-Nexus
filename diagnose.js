const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

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

  console.log('--- DIAGNÓSTICO DE NOTICIAS (JS) ---');
  
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

  // 3. Inspección de datos (Admin)
  const { data: news, error: fetchError } = await admin
    .from('news')
    .select('id, title, category, status, published_at, created_at')
    .order('published_at', { ascending: false })
    .limit(30);

  if (fetchError) {
    console.error('Error al obtener noticias:', fetchError);
    return;
  }

  console.log('\n--- ÚLTIMAS 30 NOTICIAS (ADMIN VIEW) ---');
  console.table(news?.map(n => ({
    id: n.id?.substring(0, 8),
    title: n.title?.substring(0, 30),
    cat: n.category,
    status: n.status,
    pub_at: n.published_at,
    created: n.created_at
  })));
}

diagnose();
