import {
  Faculty,
  Student,
  Notice,
  AttendanceSession,
  AttendanceRecord,
  Class,
  ClassEnrollement,
  Subject,
} from "@/models/index";
import { NextResponse, NextRequest } from "next/server";
import Connect from "@/dbConnect/connect";
import { ResultBatch } from "@/models/resultBatch.model";
import { createRequestLogger } from "@/lib/requestLogger";

async function recentActivity() {
  const [students, notices, results] = await Promise.all([
    Student.find().sort({ createdAt: -1 }).limit(3).lean(),
    Notice.find().sort({ createdAt: -1 }).limit(2).lean(),
    ResultBatch.find().sort({ createdAt: -1 }).limit(2).lean(),
  ]);

  const activities: string[] = [];

  for (const s of students) {
    activities.push(`New student enrolled (${s.rollNumber || "student"})`);
  }
  for (const n of notices) {
    activities.push(`Notice published: ${n.title}`);
  }
  for (const r of results) {
    activities.push(`Result ${r.title || "updated"} (${r.ExamType || "exam"})`);
  }

  return activities.slice(0, 6);
}

async function getAttendaneofToday() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const sessions = await AttendanceSession.find({
    createdAt: { $gte: start, $lte: end },
  }).lean();

  if (sessions.length === 0) {
    return { rate: 0, present: 0, absent: 0 };
  }

  const sessionIds = sessions.map((s) => s._id);
  const classIds = sessions.map((s: any) => s.classId);

  const present = await AttendanceRecord.countDocuments({
    sessionId: { $in: sessionIds },
  });

  const totalEnrolled = await ClassEnrollement.countDocuments({
    classId: { $in: classIds },
    status: "enrolled",
  });

  const absent = Math.max(totalEnrolled - present, 0);
  const rate = totalEnrolled > 0 ? Math.round((present / totalEnrolled) * 100) : 0;

  return { rate, present, absent };
}

async function attendanceOverview() {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const trend: { day: string; attendance: number }[] = [];

  for (let i = 6; i >= 0; i--) {
    const dayStart = new Date();
    dayStart.setDate(dayStart.getDate() - i);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(dayStart);
    dayEnd.setHours(23, 59, 59, 999);

    const sessions = await AttendanceSession.find({
      createdAt: { $gte: dayStart, $lte: dayEnd },
    }).lean();

    let attendance = 0;

    if (sessions.length > 0) {
      const sessionIds = sessions.map((s) => s._id);
      const classIds = sessions.map((s: any) => s.classId);

      const present = await AttendanceRecord.countDocuments({
        sessionId: { $in: sessionIds },
      });

      const enrolled = await ClassEnrollement.countDocuments({
        classId: { $in: classIds },
        status: "enrolled",
      });

      attendance = enrolled > 0 ? Math.round((present / enrolled) * 100) : 0;
    }

    trend.push({ day: days[dayStart.getDay()], attendance });
  }

  return trend;
}

export async function GET(_request: NextRequest) {
  const requestLogger = createRequestLogger();
  try {
    await Connect();

    const [
      totalStudent,
      totalFaculty,
      totalSubject,
      totalClasses,
      todayAttendance,
      totalActiveNotice,
      recentActivities,
      attendanceTrend,
    ] = await Promise.all([
      Student.countDocuments(),
      Faculty.countDocuments(),
      Subject.countDocuments(),
      Class.countDocuments(),
      getAttendaneofToday(),
      Notice.countDocuments({
        $or: [{ expiryDate: null }, { expiryDate: { $gte: new Date() } }],
      }),
      recentActivity(),
      attendanceOverview(),
    ]);

    requestLogger.info(
      {
        totalStudents: totalStudent,
        totalFaculty,
        totalSubjects: totalSubject,
        totalClasses,
      },
      "Dashboard data fetched successfully",
    );

    return NextResponse.json({
      success: true,
      message: "Dashboard Data",
      data: {
        stats: {
          totalStudents: totalStudent,
          totalFaculty,
          totalSubjects: totalSubject,
          totalClasses,
          attendanceToday: todayAttendance.rate,
          presentToday: todayAttendance.present,
          absentToday: todayAttendance.absent,
          activeNotices: totalActiveNotice,
        },
        recentActivities,
        attendanceTrend,
      },
    });
  } catch (error) {
    requestLogger.error({ err: error }, "Failed to fetch dashboard data");
    return NextResponse.json(
      { success: false, error: "Failed to fetch dashboard data" },
      { status: 500 },
    );
  }
}
