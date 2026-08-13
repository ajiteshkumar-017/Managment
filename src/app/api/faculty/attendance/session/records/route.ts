import { NextRequest, NextResponse } from "next/server";
import Connect from "@/dbConnect/connect";
import { verifyJwt } from "@/lib/verifyJwt";
import { createRequestLogger } from "@/lib/requestLogger";
import { AttendanceSession } from "@/models/attendanceSession";
import { AttendanceRecord } from "@/models/attendance.model";
import { Student } from "@/models/student.model";
import { User } from "@/models/user";
import { Class } from "@/models/class.model";
import { getFacultyByUserId } from "@/lib/faculty/helpers";
import { decodeResourceId, encodeResourceId } from "@/lib/idToken";

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

    const sessionId = await decodeResourceId(
      request.nextUrl.searchParams.get("sessionId"),
      "session",
    );
    if (!sessionId) {
      return NextResponse.json(
        { success: false, message: "Valid sessionId is required" },
        { status: 400 },
      );
    }

    const session = await AttendanceSession.findById(sessionId).lean();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Session not found" },
        { status: 404 },
      );
    }

    const cls = await Class.findById(session.classId).lean();
    if (!cls) {
      return NextResponse.json(
        { success: false, message: "Class not found" },
        { status: 404 },
      );
    }

    if (role === "faculty") {
      if (String(cls.facultyId) !== String(userId)) {
        return NextResponse.json(
          { success: false, message: "You are not assigned to this class" },
          { status: 403 },
        );
      }
      const faculty = await getFacultyByUserId(String(userId));
      if (!faculty) {
        return NextResponse.json(
          { success: false, message: "Faculty profile not found" },
          { status: 404 },
        );
      }
    }

    const records = await AttendanceRecord.find({ sessionId })
      .sort({ markedAt: -1 })
      .lean();

    const studentUserIds = records.map((r) => String(r.studentId));
    const [users, students] = await Promise.all([
      User.find({ _id: { $in: studentUserIds } } as never).select("username email").lean(),
      Student.find({ userId: { $in: studentUserIds } } as never)
        .select("userId rollNumber")
        .lean(),
    ]);

    const userMap = new Map(users.map((u) => [String(u._id), u]));
    const rollMap = new Map(students.map((s) => [String(s.userId), s.rollNumber || "—"]));

    const present = records.map((rec) => {
      const user = userMap.get(String(rec.studentId));
      return {
        id: String(rec._id),
        name: user?.username || "Student",
        email: user?.email || "—",
        rollNumber: rollMap.get(String(rec.studentId)) || "—",
        markedAt: rec.markedAt,
        method: rec.method,
      };
    });

    logger.info({ sessionId, count: present.length }, "Session attendance fetched");

    return NextResponse.json({
      success: true,
      data: {
        session: {
          id: await encodeResourceId(String(session._id), "session"),
          sessionCode: session.sessionCode,
          startedAt: session.startedAt,
          expiryTime: session.expiryTime,
          isActive: session.isActive,
          status: session.status,
        },
        presentCount: present.length,
        present,
      },
    });
  } catch (error) {
    logger.error({ err: error }, "Session attendance fetch failed");
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
