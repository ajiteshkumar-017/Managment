import { createRequestLogger } from "@/lib/requestLogger";
import NotificationReceipant from "@/models/notificationReceipant.model";
import mongoose, { type Types } from "mongoose";

export async function createNotificationReceipt(
  userIds: Types.ObjectId[],
  notificationId: Types.ObjectId | string,
) {
  const logger = createRequestLogger();
  try {
    if (userIds.length === 0) {
      logger.warn(
        { notificationId: String(notificationId) },
        "No recipients for notification",
      );
      return [];
    }

    const notificationObjectId =
      typeof notificationId === "string"
        ? new mongoose.Types.ObjectId(notificationId)
        : notificationId;

    const created = await NotificationReceipant.insertMany(
      userIds.map((userId) => ({
        notificationId: notificationObjectId,
        userId,
        isRead: false,
      })) as never,
    );

    logger.info(
      { notificationId: String(notificationId), count: created.length },
      "Notification receipts created",
    );
    return created;
  } catch (err) {
    logger.error(err);
    throw err;
  }
}
