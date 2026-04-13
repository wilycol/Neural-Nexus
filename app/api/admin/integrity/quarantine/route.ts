
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

export const dynamic = "force-dynamic";

/**
 * API Administrador: Cuarentena de Activos 🛡️
 * Mueve un archivo de su bucket original al bucket de 'quarantine'.
 */
export async function POST(request: NextRequest) {
  const supabase = createServerClient();

  try {
    // 1. Verificar Autenticación (Solo Admin)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { fileName, sourceBucket } = await request.json();

    if (!fileName || !sourceBucket) {
      return NextResponse.json({ error: 'Faltan parámetros: fileName o sourceBucket' }, { status: 400 });
    }

    // 2. Ejecutar Movimiento (Copia + Borrado)
    // Nota: El bucket 'quarantine' debe existir en Supabase
    const { error: copyError } = await supabase
      .storage
      .from(sourceBucket)
      .copy(fileName, `${sourceBucket}/${fileName}`, { 
        destinationBucket: 'quarantine' 
      });

    if (copyError) {
      // Si el error es que el bucket no existe, avisamos
      if (copyError.message.includes('bucket not found')) {
        return NextResponse.json({ 
          error: 'Búnker de Cuarentena no inicializado. Por favor, crea el bucket "quarantine" en el dashboard de Supabase.' 
        }, { status: 412 });
      }
      return NextResponse.json({ error: `Error al copiar: ${copyError.message}` }, { status: 500 });
    }

    // 3. Borrar del origen (Limpieza)
    const { error: deleteError } = await supabase
      .storage
      .from(sourceBucket)
      .remove([fileName]);

    if (deleteError) {
      return NextResponse.json({ 
        message: 'Archivo copiado a cuarentena, pero falló la limpieza en origen.',
        error: deleteError.message 
      }, { status: 207 });
    }

    return NextResponse.json({
      success: true,
      message: `Archivo ${fileName} asegurado en Cuarentena. Sistema purgado.`
    });

  } catch (error) {
    console.error('❌ Error en Operación de Cuarentena:', error);
    return NextResponse.json(
      { error: 'Falla crítica en el sistema de transporte de activos.' },
      { status: 500 }
    );
  }
}
