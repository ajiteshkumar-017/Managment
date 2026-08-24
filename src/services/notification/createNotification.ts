import { createRequestLogger } from "@/lib/requestLogger";
import { Notification } from "@/models/notification.model";
import type { INotification } from "@/models/notification.model";
import { createNotificationAudience } from "./createNotificationAudience";
import { resolveAudience } from "./resolveAudience";
import { createNotificationReceipt } from "./notificationReceipt";
import type { NotificationAudience } from "./notification.types";
import type { Types } from "mongoose";

export type CreateNotificationInput = {
  kind: INotification["kind"];
  title: string;
  message: string;
  link?: string;
  audience: NotificationAudience;
  targetId: Types.ObjectId | string;
  /** When set, receipts use these users instead of expanding audience. */
  recipientUserIds?: Types.ObjectId[];
};

export async function createNotification(notification: CreateNotificationInput) {
  const logger = createRequestLogger();

  try {
    const newNotification = await Notification.create({
      kind: notification.kind,
      title: notification.title,
      message: notification.message,
      link: notification.link,
    });

    const audience = await createNotificationAudience({
      notificationId: newNotification._id,
      audience: notification.audience,
      targetId: notification.targetId,
    });

    const userIds =
      notification.recipientUserIds && notification.recipientUserIds.length > 0
        ? notification.recipientUserIds
        : await resolveAudience(audience.audience, audience.targetId);
    await createNotificationReceipt(userIds, newNotification._id);

    logger.info(
      { notificationId: String(newNotification._id), recipients: userIds.length },
      "Notification created",
    );
    return newNotification;
  } catch (err) {
    logger.error(err);
    throw err;
  }
}
