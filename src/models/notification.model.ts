import mongoose, { Document, Schema, models, model } from "mongoose";
import {
  ADMIN_NOTIFICATION_KINDS,
  FACULTY_NOTIFICATION_KINDS,
  NOTIFICATION_ROLES,
  STUDENT_NOTIFICATION_KINDS,
  type AdminNotificationKind,
  type FacultyNotificationKind,
  type NotificationRole,
  type StudentNotificationKind,
} from "@/types/notification";

export interface INotification extends Document {
  kind: StudentNotificationKind | FacultyNotificationKind | AdminNotificationKind;
  title: string;
  message: string;
  link?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ALL_NOTIFICATION_KINDS = [
  ...new Set([
    ...STUDENT_NOTIFICATION_KINDS,
    ...FACULTY_NOTIFICATION_KINDS,
    ...ADMIN_NOTIFICATION_KINDS,
  ]),
];

const notificationSchema = new Schema<INotification>(
  {
    kind: {
      type: String,
      enum: ALL_NOTIFICATION_KINDS,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: false,
    },
    createdAt:{
        type: Date,
        default: Date.now,
    },
    updatedAt:{
        type: Date,
        default: Date.now,
    },
  },
  { timestamps: true },
);

notificationSchema.index({ recipientId: 1, createdAt: -1 });

export const Notification =
  (models.Notification as mongoose.Model<INotification>) ||
  model<INotification>("Notification", notificationSchema);
