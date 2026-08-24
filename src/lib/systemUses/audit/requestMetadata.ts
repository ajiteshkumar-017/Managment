import { NextRequest } from "next/server";

export type RequestAuditMetadata = {
  ipAddress: string;
  userAgent?: string;
};

export function getRequestMetadata(request: NextRequest): RequestAuditMetadata {
  const forwardedFor = request.headers.get("x-forwarded-for") || "";
  const ipAddress =
    forwardedFor.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const userAgent = request.headers.get("user-agent") ?? undefined;

  return {
    ipAddress,
    userAgent,
  };
}
