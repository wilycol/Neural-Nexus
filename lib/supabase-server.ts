import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";

// Cliente para Server Components (solo lectura si no se pasan opciones, 
// pero aquí lo configuramos para leer las cookies actuales)
export const createRouteHandlerSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Faltan variables de entorno de Supabase");
  }

  const cookieStore = cookies();

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      set(name: string, value: string, options: any) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch (error) {
          // Capturar errores si se intenta setear cookies en un Server Component 
          // (los Route Handlers sí permiten setearlas)
        }
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      remove(name: string, options: any) {
        try {
          cookieStore.set({ name, value: "", ...options });
        } catch (error) {
          // Capturar errores
        }
      },
    },
  });
};

// Cliente para uso directo como Service Role (Server Only)
export const createSupabaseAdmin = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Faltan variables de entorno de Supabase (Admin)");
  }

  // Importamos createClient aquí para evitar conflictos con auth-helpers en el mismo archivo
  const { createClient } = require("@supabase/supabase-js");
  return createClient(supabaseUrl, serviceRoleKey);
};
