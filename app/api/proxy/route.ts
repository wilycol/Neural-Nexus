import { NextResponse } from "next/server";

async function handleProxy(request: Request) {
    const { searchParams } = new URL(request.url);
    const backendUrl = searchParams.get("backendUrl");
    const path = searchParams.get("path");

    if (!backendUrl || !path) {
        return new NextResponse("Missing backendUrl or path parameter", { status: 400 });
    }

    try {
        const fetchOptions: RequestInit = {
            method: request.method,
            headers: {
                "ngrok-skip-browser-warning": "true",
                "Content-Type": request.headers.get("content-type") || "application/json"
            },
        };

        if (request.method !== 'GET' && request.method !== 'HEAD') {
            fetchOptions.body = await request.text();
        }

        const response = await fetch(`${backendUrl}${path}`, fetchOptions);

        let body;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            body = JSON.stringify(await response.json());
        } else {
            body = await response.text();
        }

        return new NextResponse(body, {
            status: response.status,
            headers: {
                "Content-Type": contentType || "application/json"
            }
        });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return new NextResponse(`Proxy Error: ${errorMessage}`, { status: 500 });
    }
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const DELETE = handleProxy;
export const PATCH = handleProxy;
export const OPTIONS = handleProxy;
