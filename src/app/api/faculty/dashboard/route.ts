import { NextRequest, NextResponse } from "next/server";
import Connect from "@/dbConnect/connect";
import { verifyJwt } from "@/lib/verifyJwt";
import { createRequestLogger } from "@/lib/requestLogger";
import { User } from "@/models/user";
import {
  getFacultyByUserId,
  getFacultyClasses,
  getWeekdayName,
  isClassCompleted,
} from "@/lib/faculty/helpers";
import { AttendanceSession } from "@/models/attendanceSession";
import { Assignment } from "@/models/assignment";
import { Class } from "@/models/class.model";

export async function GET(request: NextRequest) {
  const logger = createRequestLogger();

  try {
    await Connect();

    const auth = await verifyJwt(request);
    if (auth.ok === false) return auth.response;

    const { _id: userId, role } = auth.payload;
    if (role !== "faculty" && role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Only faculty can access this dashboard" },
        { status: 403 },
      );
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Invalid token payload" },
        { status: 401 },
      );
    }

    const faculty = await getFacultyByUserId(String(userId));
    if (!faculty && role === "faculty") {
      return NextResponse.json(
        { success: false, message: "Faculty profile not found" },
        { status: 404 },
      );
    }

    const user = await User.findById(userId).select("username").lean();
    const classes = await getFacultyClasses(String(userId));
    const todayName = getWeekdayName();
    const todayClasses = classes.filter((c) => c.day === todayName);
    const completedToday = todayClasses.filter((c) =>
      isClassCompleted(c.endTime),
    ).length;

    let pendingAssignments = 0;
    if (faculty) {
      pendingAssignments = await Assignment.countDocuments({
        facultyId: faculty._id,
        status: { $in: ["draft", "uploaded"] },
        dueDate: { $gte: new Date() },
      });
    }

    const classIds = await Class.find({ facultyId: userId }).distinct("_id");
    const attendanceSessions = classIds.length
      ? await AttendanceSession.countDocuments({
          classId: { $in: classIds },
          startedAt: {
            $gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        })
      : 0;

    logger.info({ userId, today: todayClasses.length }, "Faculty dashboard fetched");

    return NextResponse.json({
      success: true,
      data: {
        facultyName: user?.username || "Faculty",
        stats: {
          todaysClasses: todayClasses.length,
          classesCompleted: completedToday,
          pendingAssignments,
          attendanceSessions,
        },
        todayClasses,
      },
    });
  } catch (error) {
    logger.error({ err: error }, "Faculty dashboard failed");
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
