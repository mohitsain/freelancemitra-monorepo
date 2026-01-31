/**
 * Public proxy to backend regions list (no auth).
 * GET /api/countries/regions
 */
import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000";

export async function GET() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/countries/regions`, {
      cache: "force-cache",
      next: { revalidate: 3600 },
    });
    const body = await res.json();
    const data = body?.success === true && Array.isArray(body?.data) ? body.data : [];
    return NextResponse.json(data, { status: res.ok ? 200 : res.status });
  } catch {
    return NextResponse.json({ error: "Failed to fetch regions" }, { status: 502 });
  }
}
