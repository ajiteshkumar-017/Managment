import Connect from "@/dbConnect/connect";
import { User } from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { createRequestLogger } from "@/lib/requestLogger";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function GET(request: NextRequest) {
  const requestLogger = createRequestLogger();
  try {
    await Connect();

    const token =
      request.cookies.get("token")?.value ||
      request.headers.get("authorization")?.replace("Bearer ", "") ||
      null;

    if (!token) {
      requestLogger.warn("Unauthorized: missing token");
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { payload } = await jwtVerify(token, secret);
    const email = payload.email as string | undefined;
    const userId = payload._id as string | undefined;

    if (!email && !userId) {
      requestLogger.warn("Invalid token payload");
      return NextResponse.json(
        { success: false, message: "Invalid token payload" },
        { status: 401 },
      );
    }

    const user = await User.findOne(
      email ? { email } : { _id: userId },
    ).select("username email avatar role profileCompleted");

    if (!user) {
      requestLogger.warn({ userId }, "User not found");
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    requestLogger.info({ userId: String(user._id) }, "Settings fetched successfully");

    return NextResponse.json({
      success: true,
      message: "Settings fetched successfully",
      data: {
        name: user.username || "Admin",
        username: user.username || "",
        email: user.email || "",
        phone: "",
        avatar: user.avatar || "",
        role: user.role || "",
        profileCompleted: Boolean(user.profileCompleted),
      },
    });
  } catch (error) {
    requestLogger.error({ err: error }, "Failed to fetch settings");
    return NextResponse.json(
      { success: false, message: "Failed to fetch settings" },
      { status: 500 },
    );
  }
}
