import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";
import { homeForRole } from "@/lib/authHome";

export async function getSessionFromCookies() {
  const token = (await cookies()).get("token")?.value;
  if (!token) return null;

  const secret = process.env.JWT_SECRET;
  if (!secret) return null;

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    const role = typeof payload.role === "string" ? payload.role : "";
    if (!role) return null;
    return { role, home: homeForRole(role) };
  } catch {
    return null;
  }
}

/** Send signed-in users to their panel. No-ops when there is no valid cookie. */
export async function redirectIfAuthenticated() {
  const session = await getSessionFromCookies();
  if (session) redirect(session.home);
}
