/**
 * Public proxy to backend countries list (no auth).
 * GET /api/countries?region=Europe
 */
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000";

export async function GET(request: NextRequest) {
  const url = new URL("/api/v1/countries", BACKEND_URL);
  request.nextUrl.searchParams.forEach((value, key) => {
    url.searchParams.set(key, value);
  });
  try {
    const res = await fetch(url.toString(), {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    const text = await res.text();
    let data: unknown;
    try {
      const parsed = text ? JSON.parse(text) : {};
      data = parsed?.success === true && Array.isArray(parsed?.data) ? parsed.data : [];
    } catch {
      data = [];
    }
    return NextResponse.json(data, { status: res.ok ? 200 : res.status });
  } catch {
    return NextResponse.json({ error: "Backend unreachable" }, { status: 502 });
  }
}
