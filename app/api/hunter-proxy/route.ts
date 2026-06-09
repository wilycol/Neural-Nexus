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

        // Inject <base> tag to fix relative links and API calls to point to ngrok
        html = html.replace("<head>", `<head>\n    <base href="${backendUrl}/">`);

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
