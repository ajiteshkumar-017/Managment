import Connect from "@/dbConnect/connect";
import { createRequestLogger } from "@/lib/requestLogger";
import { resolveAuthUser } from "@/lib/resolveAuthUser";
import NotificationReceipant from "@/models/notificationReceipant.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const logger = createRequestLogger();

  try {
    await Connect();

    const auth = await resolveAuthUser(request);
    if (auth.ok === false) return auth.response;

    await NotificationReceipant.updateMany(
      { userId: auth.user._id, isRead: false },
      { isRead: true, readAt: new Date() },
    );

    return NextResponse.json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    logger.error({ err: error }, "Failed to mark all notifications as read");
    return NextResponse.json(
      { success: false, message: "Failed to mark all as read" },
      { status: 500 },
    );
  }
}
