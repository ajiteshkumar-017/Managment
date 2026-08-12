import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, type JWTPayload } from "jose";

export type AuthPayload = JWTPayload & {
  _id?: string;
  email?: string;
  role?: string;
};

export type VerifyJwtSuccess = {
  ok: true;
  payload: AuthPayload;
  token: string;
};

export type VerifyJwtFailure = {
  ok: false;
  response: NextResponse;
};

export type VerifyJwtResult = VerifyJwtSuccess | VerifyJwtFailure;

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }
  return new TextEncoder().encode(secret);
}

/** Read JWT from cookie `token` or `Authorization: Bearer <token>`. */
export function getTokenFromRequest(request: NextRequest): string | null {
  const cookieToken = request.cookies.get("token")?.value;
  if (cookieToken) return cookieToken;

  const authHeader = request.headers.get("authorization");
  if (!authHeader) return null;

  if (authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7).trim() || null;
  }

  return authHeader.trim() || null;
}

function unauthorized(message: string) {
  return NextResponse.json({ success: false, message }, { status: 401 });
}

/**
 * Verify JWT from the request.
 * Returns `{ ok: false, response }` when missing/invalid so routes can `return` it directly.
 */
export async function verifyJwt(request: NextRequest): Promise<VerifyJwtResult> {
  const token = getTokenFromRequest(request);

  if (!token) {
    return {
      ok: false,
      response: unauthorized("Unauthorized: token not found"),
    };
  }

  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    const authPayload = payload as AuthPayload;

    if (!authPayload._id && !authPayload.email) {
      return {
        ok: false,
        response: unauthorized("Unauthorized: invalid token payload"),
      };
    }

    return {
      ok: true,
      payload: authPayload,
      token,
    };
  } catch {
    return {
      ok: false,
      response: unauthorized("Unauthorized: invalid or expired token"),
    };
  }
}
