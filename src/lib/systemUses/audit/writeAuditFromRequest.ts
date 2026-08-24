import { NextRequest } from "next/server";
import { Types } from "mongoose";
import {
  type AuditAction,
  type AuditEntityType,
  type AuditSeverity,
} from "@/constant/audit";
import { verifyJwt } from "@/lib/verifyJwt";
import { createRequestLogger } from "@/lib/requestLogger";
import { createAuditLog } from "./createAuditLog";
import { getRequestMetadata } from "./requestMetadata";

function toObjectId(id: string | Types.ObjectId): Types.ObjectId | null {
  if (id instanceof Types.ObjectId) return id;
  const raw = String(id);
  if (Types.ObjectId.isValid(raw)) return new Types.ObjectId(raw);
  return null;
}

type WriteAuditInput = {
  action: AuditAction;
  entityType: AuditEntityType;
  entityId?: string | Types.ObjectId | null;
  description: string;
  metadata?: Record<string, unknown>;
  severity?: AuditSeverity;
};

/** Best-effort audit write. Never throws; skips if the actor JWT is missing. */
export async function writeAuditFromRequest(
  request: NextRequest,
  input: WriteAuditInput,
): Promise<void> {
  const logger = createRequestLogger();
  try {
    const auth = await verifyJwt(request);
    if (auth.ok === false || !auth.payload._id) return;

    const actorId = toObjectId(String(auth.payload._id));
    if (!actorId) return;

    const entityId = input.entityId
      ? toObjectId(input.entityId as string | Types.ObjectId)
      : actorId;
    if (!entityId) return;

    const { ipAddress, userAgent } = getRequestMetadata(request);

    await createAuditLog({
      actorId,
      action: input.action,
      entityType: input.entityType,
      entityId,
      description: input.description,
      metadata: {
        ...input.metadata,
        actorRole: auth.payload.role,
        actorEmail: auth.payload.email,
      },
      ipAddress,
      userAgent,
      severity: input.severity ?? "medium",
    });
  } catch (error) {
    logger.error(
      {
        err: error,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId ? String(input.entityId) : undefined,
      },
      "Failed to write audit log from request",
    );
  }
}
