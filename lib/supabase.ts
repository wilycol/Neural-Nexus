import { createClient } from '@supabase/supabase-js';
import { createBrowserClient as createSupabaseBrowserClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/database';

// Cliente para Server Components y API Routes
export const createServerClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Faltan variables de entorno de Supabase');
  }

  return createClient<Database>(supabaseUrl, supabaseKey);
};

// Cliente para Client Components
export const createBrowserClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Faltan variables de entorno de Supabase');
  }

  return createSupabaseBrowserClient<Database>(supabaseUrl, supabaseAnonKey, { isSingleton: true });
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

// Helper para manejar errores de Supabase
export const handleSupabaseError = (error: unknown): string => {
  if (!error) return '';
  
  const err = error as { code?: string; message?: string };

  if (err.code === '23505') {
    return 'Este registro ya existe.';
  }
  if (err.code === '23503') {
    return 'Referencia no encontrada.';
  }
  if (err.code === 'PGRST116') {
    return 'No autorizado.';
  }
  if (err.code === 'PGRST301') {
    return 'Límite de rate excedido.';
  }
  
  return err.message || 'Error desconocido';
};

// Helper para paginación
export const getPagination = (page: number, limit: number) => {
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  return { from, to };
};
