/**
 * Public proxy to backend states for a country (no auth).
 * GET /api/countries/US/states
 */
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  if (!code) {
    return NextResponse.json({ error: "Country code required" }, { status: 400 });
  }
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/countries/${encodeURIComponent(code)}/states`, {
      cache: "force-cache",
      next: { revalidate: 3600 },
    });
    const body = await res.json();
    const data = body?.success === true && Array.isArray(body?.data) ? body.data : [];
    return NextResponse.json(data, { status: res.ok ? 200 : res.status });
  } catch {
    return NextResponse.json({ error: "Failed to fetch states" }, { status: 502 });
  }
}
