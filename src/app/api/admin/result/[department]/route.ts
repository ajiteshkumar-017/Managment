import { NextRequest, NextResponse } from "next/server";
import Connect from "@/dbConnect/connect";
import { ExamResult } from "@/models/exam.model";
import { Student } from "@/models/student.model";
import { Subject } from "@/models/subject.model";
import { Faculty } from "@/models/faculty.model";
import { User } from "@/models/user";

type Params = { params: Promise<{ department: string }> };

const ALL_SEMESTERS = ["1", "2", "3", "4", "5", "6", "7", "8"];

/** Department results page — overview + other departments + all semesters */
export async function GET(_request: NextRequest, { params }: Params) {
  try {
    await Connect();

    const { department: rawDept } = await params;
    const department = decodeURIComponent(rawDept || "").trim();

    if (!department) {
      return NextResponse.json(
        { success: false, message: "Department is required" },
        { status: 400 },
      );
    }

    const deptRegex = {
      $regex: `^${escapeRegex(department)}$`,
      $options: "i",
    };

    const published = await ExamResult.aggregate([
      { $match: { examPublishedStatus: "published" } },
      {
        $lookup: {
          from: "students",
          localField: "studentId",
          foreignField: "_id",
          as: "studentData",
        },
      },
      { $unwind: "$studentData" },
      {
        $lookup: {
          from: "subjects",
          localField: "subjectId",
          foreignField: "_id",
          as: "subjectData",
        },
      },
      {
        $unwind: {
          path: "$subjectData",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);

    const deptRows = published.filter((r) =>
      equalsIgnoreCase(r.studentData?.department, department),
    );

    const totalPassed = deptRows.filter((r) => r.examResult === "passed").length;
    const totalFailed = deptRows.filter(
      (r) => r.examResult === "failed" || r.examResult === "back",
    ).length;
    const passRate =
      deptRows.length > 0
        ? Math.round((totalPassed / deptRows.length) * 1000) / 10
        : 0;

    const students = await Student.countDocuments({
      department: deptRegex,
      status: { $regex: /^active$/i },
    });

    const hod = await findHodName(department);

    // Performance from published results, keyed by semester
    const bySem = new Map<
      string,
      { total: number; passed: number; subjects: Set<string>; students: Set<string> }
    >();

    for (const r of deptRows) {
      const sem = String(r.studentData?.semester ?? "");
      if (!sem) continue;
      const entry = bySem.get(sem) || {
        total: 0,
        passed: 0,
        subjects: new Set<string>(),
        students: new Set<string>(),
      };
      entry.total += 1;
      if (r.examResult === "passed") entry.passed += 1;
      if (r.subjectData?.subjectCode) entry.subjects.add(r.subjectData.subjectCode);
      if (r.studentId) entry.students.add(String(r.studentId));
      bySem.set(sem, entry);
    }

    // Student counts per semester for this department
    const studentsBySem = await Student.aggregate([
      {
        $match: {
          department: deptRegex,
          status: { $regex: /^active$/i },
        },
      },
      {
        $group: {
          _id: { $toString: "$semester" },
          count: { $sum: 1 },
        },
      },
    ]);
    const studentCountMap = new Map(
      studentsBySem.map((s) => [String(s._id), s.count as number]),
    );

    // Subject counts per semester for this department
    const subjectsBySem = await Subject.aggregate([
      {
        $match: {
          department: deptRegex,
          status: { $ne: "inactive" },
        },
      },
      {
        $group: {
          _id: { $toString: "$semester" },
          count: { $sum: 1 },
        },
      },
    ]);
    const subjectCountMap = new Map(
      subjectsBySem.map((s) => [String(s._id), s.count as number]),
    );

    // Always return all 8 semesters
    const semesters = ALL_SEMESTERS.map((sem) => {
      const perf = bySem.get(sem);
      const subjectCount =
        subjectCountMap.get(sem) ?? perf?.subjects.size ?? 0;
      const studentCount =
        studentCountMap.get(sem) ?? perf?.students.size ?? 0;

      return {
        semester: sem,
        students: studentCount,
        subjects: subjectCount,
        passRate: perf?.total
          ? Math.round((perf.passed / perf.total) * 1000) / 10
          : 0,
        avgCgpa: 0,
        failed: perf ? perf.total - perf.passed : 0,
        hasResults: Boolean(perf?.total),
      };
    });

    // Other departments with pass % (for switching cards)
    const byDept = new Map<string, { total: number; passed: number }>();
    for (const r of published) {
      const dept = String(r.studentData?.department || "").trim();
      if (!dept) continue;
      const entry = byDept.get(dept) || { total: 0, passed: 0 };
      entry.total += 1;
      if (r.examResult === "passed") entry.passed += 1;
      byDept.set(dept, entry);
    }

    // Also include departments that exist in students but may have no published results yet
    const allDepts = await Student.distinct("department");
    for (const dept of allDepts) {
      const d = String(dept || "").trim();
      if (!d || byDept.has(d)) continue;
      byDept.set(d, { total: 0, passed: 0 });
    }

    const otherDepartments = Array.from(byDept.entries())
      .map(([dept, v]) => ({
        department: dept,
        passRate: v.total ? Math.round((v.passed / v.total) * 1000) / 10 : 0,
        totalExamTaken: v.total,
        isCurrent: equalsIgnoreCase(dept, department),
      }))
      .sort((a, b) => {
        if (a.isCurrent) return -1;
        if (b.isCurrent) return 1;
        return b.passRate - a.passRate;
      });

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          code: department,
          name: department,
          passRate,
          avgCgpa: 0,
          totalPassed,
          totalFailed,
          students,
          weakSemesters: semesters.filter(
            (s) => s.hasResults && s.passRate < 70,
          ).length,
          hod,
        },
        otherDepartments,
        semesters,
      },
    });
  } catch (error) {
    console.error("Error fetching department results", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch department results" },
      { status: 500 },
    );
  }
}

async function findHodName(department: string) {
  const hodFaculty = await Faculty.findOne({
    department: { $regex: `^${escapeRegex(department)}$`, $options: "i" },
    designation: { $regex: /hod|head/i },
  })
    .populate({ path: "userId", model: User, select: "username email" })
    .lean();

  if (hodFaculty && (hodFaculty as any).userId?.username) {
    return (hodFaculty as any).userId.username;
  }

  return "—";
}

function equalsIgnoreCase(a?: string, b?: string) {
  return (
    String(a || "").trim().toLowerCase() === String(b || "").trim().toLowerCase()
  );
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
