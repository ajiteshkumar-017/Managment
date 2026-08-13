import { NextRequest, NextResponse } from "next/server";
import Connect from "@/dbConnect/connect";
import { verifyJwt } from "@/lib/verifyJwt";
import { createRequestLogger } from "@/lib/requestLogger";
import {
  getFacultyByUserId,
  getFacultyClasses,
  getWeekdayName,
} from "@/lib/faculty/helpers";

export async function GET(request: NextRequest) {
  const logger = createRequestLogger();

  try {
    await Connect();

    const auth = await verifyJwt(request);
    if (auth.ok === false) return auth.response;

    const { _id: userId, role } = auth.payload;
    if (role !== "faculty" && role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 },
      );
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Invalid token payload" },
        { status: 401 },
      );
    }

    if (role === "faculty") {
      const faculty = await getFacultyByUserId(String(userId));
      if (!faculty) {
        return NextResponse.json(
          { success: false, message: "Faculty profile not found" },
          { status: 404 },
        );
      }
    }

    const todayOnly = request.nextUrl.searchParams.get("today") === "1";
    const classes = await getFacultyClasses(String(userId));
    const todayName = getWeekdayName();
    const data = todayOnly
      ? classes.filter((c) => c.day === todayName)
      : classes;

    logger.info({ userId, count: data.length }, "Faculty classes fetched");

    return NextResponse.json({
      success: true,
      data,
      meta: { today: todayName, total: classes.length },
    });
  } catch (error) {
    logger.error({ err: error }, "Faculty classes list failed");
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
