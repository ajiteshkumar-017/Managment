import Connect from "@/dbConnect/connect";
import { createRequestLogger } from "@/lib/requestLogger";
import { resolveAuthUser } from "@/lib/resolveAuthUser";
import NotificationReceipant from "@/models/notificationReceipant.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const logger = createRequestLogger();

  try {
    await Connect();

    const auth = await resolveAuthUser(request);
    if (auth.ok === false) return auth.response;

    const count = await NotificationReceipant.countDocuments({
      userId: auth.user._id,
      isRead: false,
    });

    return NextResponse.json({
      success: true,
      data: { count },
    });
  } catch (error) {
    logger.error({ err: error }, "Failed to get unread notification count");
    return NextResponse.json(
      { success: false, message: "Failed to get unread count" },
      { status: 500 },
    );
  }
}
