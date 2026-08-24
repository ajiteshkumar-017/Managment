import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from "@/lib/verifyJwt";
import { homeForRole } from "@/lib/authHome";

/** Lightweight cookie check for client-side guest guards. */
export async function GET(request: NextRequest) {
  const auth = await verifyJwt(request);
  if (!auth.ok) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    role: auth.payload.role,
    home: homeForRole(auth.payload.role),
  });
}
