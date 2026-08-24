import { createRequestLogger } from "@/lib/requestLogger";
import { NotificationAudienceModel } from "@/models/notificationAudience.model";
import type { NotificationAudience } from "./notification.types";
import type { Types } from "mongoose";

type CreateAudienceInput = {
  notificationId: Types.ObjectId;
  audience: NotificationAudience;
  targetId: Types.ObjectId | string;
};

export async function createNotificationAudience(input: CreateAudienceInput) {
  const logger = createRequestLogger();
  try {
    const newNotificationAudience = await NotificationAudienceModel.create(input);
    logger.info(
      { id: String(newNotificationAudience._id) },
      "Notification audience created",
    );
    return newNotificationAudience;
  } catch (err) {
    logger.error(err);
    throw err;
  }
}
