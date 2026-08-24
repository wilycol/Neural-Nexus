import { createBrowserClient as createSupabaseBrowserClient } from '@supabase/auth-helpers-nextjs';
import { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

export const createBrowserClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    if (typeof window !== 'undefined') {
      console.error('⚠️ Faltan variables de entorno de Supabase en el cliente');
    }
    return null;
  }

  try {
    return createSupabaseBrowserClient<Database>(supabaseUrl, supabaseAnonKey, { 
      isSingleton: true,
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
  } catch (error) {
    console.error('💥 Error al crear el cliente de Supabase:', error);
    return null;
  }
};

// Singleton para el cliente del navegador
let browserClient: SupabaseClient<Database> | null = null;

export const getSupabaseBrowserClient = () => {
  if (typeof window === 'undefined') {
    // Retornamos null en el servidor en lugar de lanzar un error
    return null;
  }

  if (!browserClient) {
    browserClient = createBrowserClient();
  }

  return browserClient;
};
