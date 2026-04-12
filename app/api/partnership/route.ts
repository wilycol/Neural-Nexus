import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

/**
 * API para capturar Leads de Alianzas y API Keys (Protocolo Alpha)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, company, message, type = 'api' } = body;

    // 1. Validación básica
    if (!name || !email || !company) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios (nombre, email, empresa)' },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // 2. Insertar Lead en partnership_leads
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await supabase
      .from('partnership_leads' as any)
      .insert({
        name,
        email,
        company,
        message,
        type,
        status: 'pending',
        source: 'under-construction-page'
      })
      .select()
      .single();

    if (error) {
      console.error('❌ [Partnership API] Error saving lead:', error);
      return NextResponse.json(
        { error: 'Error al procesar la solicitud', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        status: 'success', 
        message: 'Solicitud recibida. Nuestro equipo (o Beatriz) se pondrá en contacto pronto.',
        data 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('❌ [Partnership API] Critical error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
