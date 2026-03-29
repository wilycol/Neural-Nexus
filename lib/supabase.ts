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

// Re-exportar para compatibilidad básica si es necesario, 
// pero se recomienda usar -client o -server directamente.
export * from './supabase-client';
