import Connect from "@/dbConnect/connect";
import { createRequestLogger } from "@/lib/requestLogger";
import { resolveAuthUser } from "@/lib/resolveAuthUser";
import NotificationReceipant from "@/models/notificationReceipant.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const logger = createRequestLogger();

  try {
    await Connect();

    const auth = await resolveAuthUser(request);
    if (auth.ok === false) return auth.response;

    const { id } = await context.params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid notification" },
        { status: 400 },
      );
    }

    const receipt = await NotificationReceipant.findOneAndUpdate(
      { _id: id, userId: auth.user._id },
      { isRead: true, readAt: new Date() },
      { new: true },
    );

    if (!receipt) {
      return NextResponse.json(
        { success: false, message: "Notification not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Notification marked as read",
    });
  } catch (error) {
    logger.error({ err: error }, "Failed to mark notification as read");
    return NextResponse.json(
      { success: false, message: "Failed to mark as read" },
      { status: 500 },
    );
  }
}
