import mongoose, { Document, Schema, models, model } from "mongoose";
import {
  NOTIFICATION_AUDIENCES,
  type NotificationAudience,
} from "@/types/notification";

export interface INotificationAudience extends Document {
  notificationId: mongoose.Types.ObjectId;
  audience: NotificationAudience;
  targetId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const notificationAudienceSchema = new Schema<INotificationAudience>(
  {
    notificationId: {
      type: Schema.Types.ObjectId,
      ref: "Notification",
      required: true,
      index: true,
    },
    audience: {
      type: String,
      enum: NOTIFICATION_AUDIENCES,
      required: true,
      index: true,
    },
    targetId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

export const NotificationAudienceModel =
  (models.NotificationAudience as mongoose.Model<INotificationAudience>) ||
  model<INotificationAudience>("NotificationAudience", notificationAudienceSchema);
