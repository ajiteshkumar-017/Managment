import { NextRequest, NextResponse } from "next/server";
import Connect from "@/dbConnect/connect";
import { User } from "@/models/user";
import { Student } from "@/models/student.model";
import { Assignment } from "@/models/assignment";
import { SemesterResult } from "@/models/semesterResult";
import { getUser } from "@/lib/getUser";
import { createRequestLogger } from "@/lib/requestLogger";
import { getStudentAttendanceData } from "@/lib/student/attendance";

export async function GET(_request: NextRequest) {
  const requestLogger = createRequestLogger();
  try {
    await Connect();

    const { email, role } = await getUser();
    if (!email) {
      requestLogger.warn({ reason: "unauthorized" }, "Dashboard unauthorized");
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
      requestLogger.warn({ reason: "user_not_found", email }, "Dashboard user not found");
      return NextResponse.json(
        { success: false, message: "No User found." },
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

    const attendance = await getStudentAttendanceData({
      studentId: student._id,
      userId: user._id,
      student,
    });

    const assignmentFilter: Record<string, unknown> = {
      department: student.department,
      semester: student.semester,
      status: "uploaded",
      dueDate: { $gte: new Date() },
    };
    if (student.batch) assignmentFilter.batch = student.batch;

    const [pendingAssignments, semesterResults] = await Promise.all([
      Assignment.countDocuments(assignmentFilter),
      SemesterResult.find({ studentId: student._id })
        .select("semester SGPA CGPA")
        .sort({ semester: 1 })
        .lean(),
    ]);

    const performance = semesterResults.map((sem) => ({
      month: `Sem ${sem.semester}`,
      score: Number(sem.SGPA ?? 0),
    }));

    requestLogger.info(
      {
        email,
        userId: user._id,
        subjectCount: attendance.subjectCount,
        attendance: attendance.summary.percentage,
      },
      "Dashboard data fetched successfully",
    );

    return NextResponse.json(
      {
        success: true,
        message: "Dashboard Data fetched successfully",
        data: {
          name: user.username,
          email: user.email,
          cards: {
            courseProgress: attendance.courseProgress,
            subjectCount: attendance.subjectCount,
            completedToday: attendance.completedToday,
            classesToday: attendance.classesToday,
            pendingAssignments,
            attendanceThisSem: attendance.summary.percentage,
          },
          activeHours: attendance.weekdayHours,
          performance,
        },
      },
      { status: 200 },
    );
  } catch (err) {
    requestLogger.error({ err }, "Dashboard fetch failed");
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 },
    );
  }
}
