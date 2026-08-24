import Connect from "@/dbConnect/connect";
import { createRequestLogger } from "@/lib/requestLogger";
import { User } from "@/models";
import bcrypt from "bcryptjs";
import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const logger = createRequestLogger();

  try {
    await Connect();

    const body = await request.json();
    const token = String(body?.token ?? "").trim();
    const password = String(body?.password ?? "");

    if (!token || !password) {
      return NextResponse.json(
        { success: false, message: "Token and password are required" },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 6 characters" },
        { status: 400 },
      );
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      logger.error("JWT_SECRET is not configured");
      return NextResponse.json(
        { success: false, message: "Failed to reset password" },
        { status: 500 },
      );
    }

    let userId: string | undefined;
    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(secret),
      );
      if (payload.purpose !== "password_reset") {
        return NextResponse.json(
          { success: false, message: "Invalid or expired reset link" },
          { status: 401 },
        );
      }
      userId = typeof payload._id === "string" ? payload._id : undefined;
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid or expired reset link" },
        { status: 401 },
      );
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired reset link" },
        { status: 401 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const updated = await User.findByIdAndUpdate(userId, {
      password: hashedPassword,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    logger.info({ userId }, "Password reset completed");
    return NextResponse.json({
      success: true,
      message: "Password updated. You can sign in now.",
    });
  } catch (error) {
    logger.error({ err: error }, "Failed to reset password");
    return NextResponse.json(
      { success: false, message: "Failed to reset password" },
      { status: 500 },
    );
  }
}
