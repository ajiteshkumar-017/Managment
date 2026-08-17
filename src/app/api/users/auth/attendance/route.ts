import { NextRequest, NextResponse } from "next/server";
import Connect from "@/dbConnect/connect";
import { getUser } from "@/lib/getUser";
import { createRequestLogger } from "@/lib/requestLogger";
import { User } from "@/models/user";
import { Student } from "@/models/student.model";
import { AttendanceRecord } from "@/models/attendance.model";
import { AttendanceSession } from "@/models/attendanceSession";
import { getStudentAttendanceData, findStudentClasses } from "@/lib/student/attendance";

export async function GET(_request: NextRequest) {
  const logger = createRequestLogger();

  try {
    await Connect();

    const { email, role } = await getUser();
    if (!email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }
    if (role && role !== "student") {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 },
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "No user found" },
        { status: 404 },
      );
    }

    const student = await Student.findOne({ userId: user._id });
    if (!student) {
      return NextResponse.json(
        { success: false, message: "Student profile not found" },
        { status: 404 },
      );
    }

    const data = await getStudentAttendanceData({
      studentId: student._id,
      userId: user._id,
      student,
    });

    logger.info(
      { userId: user._id, sessions: data.summary.totalSessions },
      "Student attendance fetched",
    );

    return NextResponse.json({ success: true, data });
  } catch (error) {
    logger.error({ err: error }, "Student attendance failed");
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const logger = createRequestLogger();

  try {
    await Connect();

    const { email, role } = await getUser();
    if (!email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }
    if (role && role !== "student") {
      return NextResponse.json(
        { success: false, message: "Only students can mark attendance" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const sessionCode = Number(String(body.sessionCode || "").trim());
    if (!Number.isInteger(sessionCode) || sessionCode < 100000 || sessionCode > 999999) {
      return NextResponse.json(
        { success: false, message: "Enter a valid 6-digit attendance code" },
        { status: 400 },
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "No user found" },
        { status: 404 },
      );
    }

    const student = await Student.findOne({ userId: user._id });
    if (!student) {
      return NextResponse.json(
        { success: false, message: "Student profile not found" },
        { status: 404 },
      );
    }

    const classes = await findStudentClasses(student);
    const classIds = classes.map((cls) => cls._id);
    if (!classIds.length) {
      return NextResponse.json(
        { success: false, message: "No classes found for your profile" },
        { status: 404 },
      );
    }

    const session = await AttendanceSession.findOne({
      sessionCode,
      classId: { $in: classIds },
    }).sort({ startedAt: -1 });

    if (!session) {
      return NextResponse.json(
        { success: false, message: "No matching attendance session for this code" },
        { status: 404 },
      );
    }

    if (session.expiryTime < new Date()) {
      session.isActive = false;
      session.status = "expired";
      await session.save();
      return NextResponse.json(
        { success: false, message: "Session has expired" },
        { status: 400 },
      );
    }

    if (session.status !== "active" || !session.isActive) {
      return NextResponse.json(
        { success: false, message: "Session is not active" },
        { status: 400 },
      );
    }

    const existing = await AttendanceRecord.findOne({
      studentId: { $in: [student._id, user._id] },
      sessionId: session._id,
    });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Attendance already marked" },
        { status: 400 },
      );
    }

    await AttendanceRecord.create({
      studentId: student._id,
      sessionId: session._id,
      markedAt: new Date(),
      method: "code",
    });

    logger.info(
      { studentId: student._id, sessionId: session._id },
      "Attendance marked via code",
    );

    return NextResponse.json({
      success: true,
      message: "Attendance marked",
    });
  } catch (error) {
    logger.error({ err: error }, "Student attendance code mark failed");
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
