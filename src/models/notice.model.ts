import mongoose, { Document, Schema, models, model } from "mongoose";
import { NOTICE_AUDIENCE_DB } from "@/constant/notice";

export interface INotice extends Document {
  title: string;
  description: string;
  date: Date;
  type: string;
  createdBy: mongoose.Types.ObjectId;
  IsImportant: boolean;
  expiryDate: Date | null;
  attachment?: boolean;
  audience: (typeof NOTICE_AUDIENCE_DB)[number];
}

const NoticeSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      maxlength: 10000,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    type: {
      type: String,
      required: true,
      default: "general",
      lowercase: true,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    IsImportant: {
      type: Boolean,
      default: false,
    },
    expiryDate: {
      type: Date,
      default: null,
      required: false,
    },
    attachment: {
      type: Boolean,
      required: false,
    },
    audience: {
      type: String,
      enum: NOTICE_AUDIENCE_DB,
      default: "All",
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

NoticeSchema.index({ audience: 1, date: -1, expiryDate: 1 });

export const Notice =
  (models.Notice as mongoose.Model<INotice>) ||
  model<INotice>("Notice", NoticeSchema);

/**
 * Next.js keeps the first compiled Notice model in memory. That copy still
 * has the old type enum (`general`, not `General`). App code already
 * allowlists topics; drop the stale mongoose enum so saves match the form.
 */
const typePath = Notice.schema.path("type");
if (typePath) {
  typePath.validators = typePath.validators.filter((validator) => {
    const meta = validator as { type?: string; kind?: string };
    return meta.type !== "enum" && meta.kind !== "enum";
  });
  if ("enumValues" in typePath) {
    (typePath as { enumValues: unknown[] }).enumValues = [];
  }
}
