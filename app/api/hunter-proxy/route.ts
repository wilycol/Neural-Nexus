import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const backendUrl = searchParams.get("backendUrl");

    if (!backendUrl) {
        return new NextResponse("Missing backendUrl parameter", { status: 400 });
    }

    try {
        const response = await fetch(`${backendUrl}/hunter-ui`, {
            headers: {
                "ngrok-skip-browser-warning": "true"
            }
        });

        if (!response.ok) {
            return new NextResponse(`Error fetching from backend: ${response.status}`, { status: response.status });
        }

        let html = await response.text();

        // Inject window.BACKEND_URL to allow the frontend to use the proxy
        html = html.replace("<head>", `<head>\n    <script>window.BACKEND_URL = "${backendUrl}";</script>`);

        return new NextResponse(html, {
            headers: {
                "Content-Type": "text/html"
            }
        });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return new NextResponse(`Proxy Error: ${errorMessage}`, { status: 500 });
    }
}
