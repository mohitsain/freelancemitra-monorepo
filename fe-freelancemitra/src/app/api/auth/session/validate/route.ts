/**
 * Session validation for the backend.
 * FastAPI calls this endpoint with Authorization: Bearer <next-auth.session-token>
 * to validate the token instead of decoding the JWT itself.
 */
import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

function secretBytes(secret: string): Uint8Array {
  return new TextEncoder().encode(secret);
}

export async function GET(request: NextRequest) {
  return validateToken(request);
}

export async function POST(request: NextRequest) {
  return validateToken(request);
}

async function validateToken(request: NextRequest) {
  const auth = request.headers.get("Authorization");
  const token =
    auth?.startsWith("Bearer ") ? auth.slice(7).trim() : null;

  if (!token) {
    return NextResponse.json(
      { error: "Missing Authorization: Bearer <token>" },
      { status: 401 }
    );
  }

  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "Server misconfiguration" },
      { status: 503 }
    );
  }

  try {
    const { payload } = await jwtVerify(token, secretBytes(secret));
    return NextResponse.json({
      sub: payload.sub ?? "",
      email: payload.email ?? null,
      name: payload.name ?? null,
      picture: payload.picture ?? null,
      id: payload.id ?? null,
      provider: payload.provider ?? null,
      iat: payload.iat ?? null,
      exp: payload.exp ?? null,
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }
}
