import { NextRequest, NextResponse } from "next/server";
import { User } from "@/models/user";
import { verifyJwt } from "@/lib/verifyJwt";

export async function resolveAuthUser(request: NextRequest) {
  const auth = await verifyJwt(request);
  if (auth.ok === false) return auth;

  const user =
    (auth.payload._id ? await User.findById(auth.payload._id) : null) ??
    (auth.payload.email
      ? await User.findOne({ email: auth.payload.email })
      : null);

  if (!user) {
    return {
      ok: false as const,
      response: NextResponse.json(
        { success: false, message: "User not found" },
        { status: 401 },
      ),
    };
  }

  return { ok: true as const, user, payload: auth.payload };
}
