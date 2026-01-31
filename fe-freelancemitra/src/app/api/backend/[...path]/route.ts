/**
 * Proxy to be-freelancemitra API.
 *
 * Session: NextAuth manages session on the frontend; /api/auth/session validates the
 * cookie (next-auth.session-token) and returns the session. No extra validation needed.
 *
 * Backend calls: When the app calls /api/backend/* (e.g. onboarding), we extract the
 * same next-auth.session-token from the request cookie (via getToken) and send it as
 * Authorization: Bearer <token> so the backend can verify the user.
 */
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxy(request, await params, "GET");
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxy(request, await params, "POST");
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxy(request, await params, "PATCH");
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxy(request, await params, "PUT");
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxy(request, await params, "DELETE");
}

async function proxy(
  request: NextRequest,
  params: { path: string[] },
  method: string
) {
  // Extract next-auth.session-token (signed JWT) from cookie and forward as Bearer
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    raw: true,
  });
  if (!token || typeof token !== "string") {
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: { code: "UNAUTHORIZED", message: "Sign in to continue" },
      },
      { status: 401 }
    );
  }

  const path = params.path?.join("/") || "";
  const url = new URL(`/api/v1/${path}`, BACKEND_URL);
  request.nextUrl.searchParams.forEach((value, key) => url.searchParams.set(key, value));

  const headers = new Headers(request.headers);
  headers.set("Authorization", `Bearer ${token}`);
  headers.set("Host", url.host);

  const body = method !== "GET" && method !== "HEAD" ? await request.text() : undefined;
  let res: Response;
  try {
    res = await fetch(url.toString(), {
      method,
      headers,
      body: body || undefined,
    });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: {
          code: "SERVICE_UNAVAILABLE",
          message: "Backend unreachable. Start the backend (e.g. uvicorn app.main:app --port 8000).",
        },
      },
      { status: 503 }
    );
  }

  const text = await res.text();
  let data: unknown;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    return new NextResponse(text, { status: res.status, headers: res.headers });
  }
  return NextResponse.json(data, { status: res.status });
}
