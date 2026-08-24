import {
  type AuditAction,
  type AuditEntityType,
  type AuditSeverity,
  type AuditStatus,
} from "@/constant/audit";
import Connect from "@/dbConnect/connect";
import { createRequestLogger } from "@/lib/requestLogger";
import { Audit } from "@/models/audit.model";
import { Types } from "mongoose";

export interface CreateAuditLogInput {
  actorId: Types.ObjectId;
  action: AuditAction;
  entityType: AuditEntityType;
  entityId: Types.ObjectId;
  description: string;
  metadata?: Record<string, unknown>;
  ipAddress: string;
  userAgent?: string;
  severity?: AuditSeverity;
  status?: AuditStatus;
  errorMessage?: string;
}

export async function createAuditLog({
  actorId,
  action,
  entityType,
  entityId,
  description,
  metadata,
  ipAddress,
  userAgent,
  severity = "medium",
  status = "success",
  errorMessage,
}: CreateAuditLogInput): Promise<void> {
  const logger = createRequestLogger();
  try {
    await Connect();

    const auditLog = await Audit.create({
      actorId,
      action,
      entityType,
      entityId,
      description,
      metadata,
      ipAddress,
      userAgent,
      severity,
      status,
      errorMessage,
    });

    logger.info(
      { auditId: String(auditLog._id), action, entityType, status },
      "Audit log created",
    );
  } catch (error) {
    logger.error({ err: error, action, entityType }, "Error creating audit log");
  }
}
