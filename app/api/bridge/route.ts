import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const body = await request.json();
    const { endpoint, ...data } = body;

    // La URL de tu Bridge de Beatriz
    const BRIDGE_URL = "https://claudine-tristful-moly.ngrok-free.app";

    console.log(`🛰️ [BRIDGE-PROXY] Reenviando a: ${BRIDGE_URL}${endpoint}`);

    try {
        const response = await fetch(`${BRIDGE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        return NextResponse.json(result, { status: response.status });
    } catch (error: any) {
        console.error("❌ [BRIDGE-PROXY] Error:", error.message);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
