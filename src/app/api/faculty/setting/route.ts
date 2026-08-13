import { NextRequest, NextResponse } from "next/server";
import Connect from "@/dbConnect/connect";
import { verifyJwt } from "@/lib/verifyJwt";
import { createRequestLogger } from "@/lib/requestLogger";
import { User } from "@/models/user";
import { getFacultyByUserId } from "@/lib/faculty/helpers";

export async function GET(request: NextRequest) {
  const logger = createRequestLogger();

  try {
    await Connect();

    const auth = await verifyJwt(request);
    if (auth.ok === false) return auth.response;

    const { _id: userId, email, role } = auth.payload;
    if (role !== "faculty" && role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 },
      );
    }

    const user = await User.findOne(
      email ? { email } : { _id: userId },
    ).select("username email avatar role profileCompleted");

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    const faculty = userId ? await getFacultyByUserId(String(userId)) : null;

    logger.info({ userId: String(user._id) }, "Faculty settings fetched");

    return NextResponse.json({
      success: true,
      message: "Settings fetched successfully",
      data: {
        name: user.username || "Faculty",
        username: user.username || "",
        email: user.email || "",
        avatar: user.avatar || "",
        role: user.role || "faculty",
        profileCompleted: user.profileCompleted,
        designation: faculty?.designation || "",
        department: faculty?.department || "",
      },
    });
  } catch (error) {
    logger.error({ err: error }, "Faculty settings failed");
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
