import { createBrowserClient as createSupabaseBrowserClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/database';

// Cliente para Client Components
export const createBrowserClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Faltan variables de entorno de Supabase');
  }

  return createSupabaseBrowserClient<Database>(supabaseUrl, supabaseAnonKey, { 
    isSingleton: true
  });
};

// Singleton para el cliente del navegador
let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export const getSupabaseBrowserClient = () => {
  if (typeof window === 'undefined') {
    throw new Error('getSupabaseBrowserClient solo debe usarse en el cliente');
  }

  if (!browserClient) {
    browserClient = createBrowserClient();
  }

  return browserClient;
};
