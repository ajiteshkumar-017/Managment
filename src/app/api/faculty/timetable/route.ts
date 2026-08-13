import { NextRequest, NextResponse } from "next/server";
import Connect from "@/dbConnect/connect";
import { verifyJwt } from "@/lib/verifyJwt";
import { createRequestLogger } from "@/lib/requestLogger";
import { getFacultyByUserId, getFacultyClasses } from "@/lib/faculty/helpers";

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

    if (role === "faculty") {
      const faculty = await getFacultyByUserId(String(userId));
      if (!faculty) {
        return NextResponse.json(
          { success: false, message: "Faculty profile not found" },
          { status: 404 },
        );
      }
    }

    const classes = await getFacultyClasses(String(userId));
    const byDay: Record<string, typeof classes> = {};
    for (const cls of classes) {
      if (!byDay[cls.day]) byDay[cls.day] = [];
      byDay[cls.day].push(cls);
    }

    logger.info({ userId, count: classes.length }, "Faculty timetable fetched");

    return NextResponse.json({
      success: true,
      data: { classes, byDay },
    });
  } catch (error) {
    logger.error({ err: error }, "Faculty timetable failed");
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
