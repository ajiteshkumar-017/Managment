import { SignJWT, jwtVerify } from "jose";
import mongoose from "mongoose";

export type ResourceKind = "class" | "session";

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }
  return new TextEncoder().encode(secret);
}

/** Signed opaque id for URLs/params. Same secret as login JWT. Deterministic (no iat/exp). */
export async function encodeResourceId(id: string, kind: ResourceKind) {
  const jwt = await new SignJWT({ id: String(id), kind })
    .setProtectedHeader({ alg: "HS256" })
    .sign(getSecret());
  return jwt.replace(/\./g, "~");
}

export async function decodeResourceId(
  token: string | null | undefined,
  kind: ResourceKind,
): Promise<string | null> {
  if (!token?.trim()) return null;

  let raw = token.trim();
  try {
    raw = decodeURIComponent(raw);
  } catch {
    /* already decoded */
  }

  const jwt = raw.replace(/~/g, ".");

  try {
    const { payload } = await jwtVerify(jwt, getSecret());
    if (payload.kind !== kind || typeof payload.id !== "string") return null;
    if (!mongoose.Types.ObjectId.isValid(payload.id)) return null;
    return payload.id;
  } catch {
    return null;
  }
}
