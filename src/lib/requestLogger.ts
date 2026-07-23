import logger from "@/lib/logger";

/** Child logger with a unique requestId for tracing one API call. */
export function createRequestLogger(extra: Record<string, unknown> = {}) {
  return logger.child({
    requestId: crypto.randomUUID(),
    ...extra,
  });
}
