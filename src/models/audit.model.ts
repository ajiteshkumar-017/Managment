import mongoose, { Document, Schema, model, models } from "mongoose";
import {
  ALL_AUDIT_ACTIONS,
  AUDIT_ENTITY_TYPES,
  AUDIT_SEVERITY,
  AUDIT_STATUS,
  type AuditAction,
  type AuditEntityType,
  type AuditSeverity,
  type AuditStatus,
} from "@/constant/audit";

export interface IAudit extends Document {
  actorId: mongoose.Types.ObjectId;
  action: AuditAction;
  entityType: AuditEntityType;
  entityId: mongoose.Types.ObjectId;
  description: string;
  metadata?: Record<string, unknown>;
  ipAddress: string;
  userAgent?: string;
  severity: AuditSeverity;
  status: AuditStatus;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const auditSchema = new Schema<IAudit>(
  {
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    action: {
      type: String,
      enum: ALL_AUDIT_ACTIONS,
      required: true,
      index: true,
    },
    entityType: {
      type: String,
      enum: AUDIT_ENTITY_TYPES,
      required: true,
      index: true,
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    ipAddress: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
      required: false,
    },
    severity: {
      type: String,
      enum: AUDIT_SEVERITY,
      default: "medium",
    },
    status: {
      type: String,
      enum: AUDIT_STATUS,
      default: "success",
    },
    errorMessage: {
      type: String,
    },
  },
  { timestamps: true },
);

auditSchema.index({ entityType: 1, entityId: 1, createdAt: -1 });
auditSchema.index({ actorId: 1, createdAt: -1 });
auditSchema.index({ action: 1, createdAt: -1 });

export const Audit =
  (models.Audit as mongoose.Model<IAudit>) || model<IAudit>("Audit", auditSchema);
