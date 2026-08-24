import { NextRequest, NextResponse } from "next/server";
import { resolveAuthUser } from "@/lib/resolveAuthUser";

type AppRole = "admin" | "faculty" | "student";

/**
 * Authn + authz using the User document role (not the JWT claim alone).
 * A stale JWT after a role change cannot pass this gate.
 */
export async function requireRole(request: NextRequest, role: AppRole) {
  const auth = await resolveAuthUser(request);
  if (auth.ok === false) return auth;

  if (auth.user.role !== role) {
    return {
      ok: false as const,
      response: NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 },
      ),
    };
  }

  return auth;
}

export async function requireAdmin(request: NextRequest) {
  return requireRole(request, "admin");
}
