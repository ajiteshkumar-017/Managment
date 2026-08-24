import mongoose, { Document, Schema, models, model } from "mongoose";

export interface INotificationReceipant extends Document {
  notificationId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const notificationReceipantSchema = new Schema<INotificationReceipant>(
  {
    notificationId: {
      type: Schema.Types.ObjectId,
      ref: "Notification",
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    readAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

const NotificationReceipant =
  (models.NotificationReceipant as mongoose.Model<INotificationReceipant>) ||
  model<INotificationReceipant>("NotificationReceipant", notificationReceipantSchema);

export default NotificationReceipant;
