import Connect from "@/dbConnect/connect";
import { createRequestLogger } from "@/lib/requestLogger";
import { resolveAuthUser } from "@/lib/resolveAuthUser";
import { Notification } from "@/models";
import NotificationReceipant from "@/models/notificationReceipant.model";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const logger = createRequestLogger();
  try {
    await Connect();

    const auth = await resolveAuthUser(request);
    if (auth.ok === false) return auth.response;

    const receipts = await NotificationReceipant.find({ userId: auth.user._id })
      .sort({ createdAt: -1 })
      .populate({
        path: "notificationId",
        model: Notification,
        select: "kind title message link createdAt",
      })
      .lean();

    const notifications = receipts
      .filter((receipt) => receipt.notificationId)
      .map((receipt) => {
        const notification = receipt.notificationId as {
          _id: unknown;
          kind?: string;
          title?: string;
          message?: string;
          link?: string;
          createdAt?: Date;
        };
        return {
          id: String(notification._id),
          receiptId: String(receipt._id),
          kind: notification.kind,
          title: notification.title,
          message: notification.message,
          link: notification.link ?? null,
          isRead: receipt.isRead,
          createdAt: notification.createdAt,
        };
      });

    return NextResponse.json({
      success: true,
      message: "Notification received",
      data: notifications,
    });
  } catch (error) {
    logger.error({ err: error }, "Failed to get notification");
    return NextResponse.json(
      { success: false, message: "Failed to get notification" },
      { status: 500 },
    );
  }
}
