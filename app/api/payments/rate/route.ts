import { getUSDToCOP } from "@/lib/payments/rate";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // 1 hora

export async function GET() {
  try {
    const rateData = await getUSDToCOP();
    return NextResponse.json(rateData);
  } catch (error) {
    console.error('API Rate Error:', error);
    return NextResponse.json({ error: 'Failed to fetch rate' }, { status: 500 });
  }
}
