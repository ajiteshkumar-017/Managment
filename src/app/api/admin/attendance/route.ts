import Connect from "@/dbConnect/connect";
import { AttendanceRecord } from "@/models/attendance.model";
import { AttendanceSession } from "@/models/attendanceSession";
import { Class } from "@/models/class.model";
import { Enrollment } from "@/models/enrollement.model";
import { Subject } from "@/models/subject.model";
import { Student } from "@/models/student.model";
import { User } from "@/models/user";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await Connect();

    const sessions = await AttendanceSession.find()
      .populate({
        path: "classId",
        model: Class,
        populate: {
          path: "subjectId",
          model: Subject,
          select: "subjectCode subjectName department semester",
        },
      })
      .sort({ createdAt: -1 })
      .lean();

    const records = await AttendanceRecord.find().lean();
    const enrollments = await Enrollment.find().lean();
    const students = await Student.find({ status: { $regex: /^active$/i } }).lean();

    const presentBySession = new Map<string, number>();
    for (const r of records) {
      const key = String(r.sessionId);
      presentBySession.set(key, (presentBySession.get(key) || 0) + 1);
    }

    const enrolledByClass = new Map<string, number>();
    for (const e of enrollments) {
      const key = String(e.classId);
      enrolledByClass.set(key, (enrolledByClass.get(key) || 0) + 1);
    }

    // Department averages
    const deptAgg = new Map<string, { present: number; expected: number }>();
    const semAgg = new Map<string, { present: number; expected: number }>();
    const subjectAgg = new Map<
      string,
      { present: number; expected: number; faculty: string; sessions: number }
    >();

    for (const session of sessions as any[]) {
      const cls = session.classId;
      if (!cls || typeof cls !== "object") continue;
      const subject = cls.subjectId;
      if (!subject) continue;

      const present = presentBySession.get(String(session._id)) || 0;
      const expected = enrolledByClass.get(String(cls._id)) || 0;
      const dept = subject.department || "Unknown";
      const sem = String(subject.semester || "?");
      const subjectKey = subject.subjectName || subject.subjectCode;

      const d = deptAgg.get(dept) || { present: 0, expected: 0 };
      d.present += present;
      d.expected += expected;
      deptAgg.set(dept, d);

      const s = semAgg.get(sem) || { present: 0, expected: 0 };
      s.present += present;
      s.expected += expected;
      semAgg.set(sem, s);

      const sub = subjectAgg.get(subjectKey) || {
        present: 0,
        expected: 0,
        faculty: "",
        sessions: 0,
      };
      sub.present += present;
      sub.expected += expected;
      sub.sessions += 1;
      subjectAgg.set(subjectKey, sub);
    }

    const departmentSummary = Array.from(deptAgg.entries()).map(([name, v]) => ({
      name,
      number: v.expected > 0 ? Math.round((v.present / v.expected) * 100) : 0,
    }));

    const semesterSummary = Array.from(semAgg.entries())
      .sort((a, b) => Number(a[0]) - Number(b[0]))
      .map(([sem, v]) => ({
        semName: `Semester ${sem}`,
        number: v.expected > 0 ? Math.round((v.present / v.expected) * 100) : 0,
      }));

    const subjectAlerts = Array.from(subjectAgg.entries())
      .map(([subjectName, v]) => {
        const attendance =
          v.expected > 0 ? Math.round((v.present / v.expected) * 100) : 0;
        let issue = "Low Attendance";
        if (v.sessions === 0) issue = "Not Recorded";
        else if (attendance >= 75) issue = "Needs Review";
        return {
          subjectName,
          issue: attendance < 75 ? issue : "Within Range",
          attendance,
          faculty: v.faculty || "—",
        };
      })
      .filter((s) => s.attendance < 75)
      .sort((a, b) => a.attendance - b.attendance)
      .slice(0, 10);

    const overallExpected = Array.from(deptAgg.values()).reduce(
      (sum, v) => sum + v.expected,
      0,
    );
    const overallPresent = Array.from(deptAgg.values()).reduce(
      (sum, v) => sum + v.present,
      0,
    );
    const overallRate =
      overallExpected > 0
        ? Math.round((overallPresent / overallExpected) * 100)
        : 0;

    const below75Students = await estimateBelowThreshold(students, records, enrollments);

    const bestDept = [...departmentSummary].sort((a, b) => b.number - a.number)[0];
    const worstDept = [...departmentSummary].sort((a, b) => a.number - b.number)[0];
    const bestSem = [...semesterSummary].sort((a, b) => b.number - a.number)[0];
    const worstSem = [...semesterSummary].sort((a, b) => a.number - b.number)[0];

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const sessionsThisMonth = await AttendanceSession.countDocuments({
      createdAt: { $gte: monthStart },
    });

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          overallAttendance: `${overallRate}%`,
          below75: below75Students,
          deptBelow75: departmentSummary.filter((d) => d.number < 75).length,
          sessionsThisMonth,
          bestDepartment: bestDept?.name || "—",
          worstDepartment: worstDept?.name || "—",
          bestSemester: bestSem?.semName || "—",
          worstSemester: worstSem?.semName || "—",
        },
        departmentSummary,
        semesterSummary,
        subjectAlerts,
      },
    });
  } catch (error) {
    console.error("Error fetching attendance stats", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch attendance data" },
      { status: 500 },
    );
  }
}

async function estimateBelowThreshold(
  students: any[],
  records: any[],
  enrollments: any[],
) {
  // Approximate: students with enrollments but low mark ratio
  const marksByStudent = new Map<string, number>();
  for (const r of records) {
    const id = String(r.studentId);
    marksByStudent.set(id, (marksByStudent.get(id) || 0) + 1);
  }

  const enrollByStudent = new Map<string, number>();
  for (const e of enrollments) {
    const id = String(e.studentId);
    enrollByStudent.set(id, (enrollByStudent.get(id) || 0) + 1);
  }

  let below = 0;
  for (const [studentId, enrolled] of enrollByStudent) {
    const marked = marksByStudent.get(studentId) || 0;
    // rough: if sessions exist and mark rate < 75% of enrollments * sessions proxy
    if (enrolled > 0 && marked / Math.max(enrolled, 1) < 0.75) below++;
  }

  // Fallback when no attendance data
  if (records.length === 0) return 0;
  return below;
}
