import { NextRequest, NextResponse } from "next/server";
import Connect from "@/dbConnect/connect";
import { ExamResult } from "@/models/exam.model";
import { Subject } from "@/models/subject.model";
import { SubjectFacultyAssignment } from "@/models/subjectFacultyAssignment.model";
import { Faculty } from "@/models/faculty.model";
import { User } from "@/models/user";
import { createRequestLogger } from "@/lib/requestLogger";

type Params = {
  params: Promise<{ department: string; semester: string }>;
};

/** Semester results page — all subjects for department + semester */
export async function GET(_request: NextRequest, { params }: Params) {
  const requestLogger = createRequestLogger();
  try {
    await Connect();

    const { department: rawDept, semester: rawSem } = await params;
    const department = decodeURIComponent(rawDept || "").trim();
    const semester = decodeURIComponent(rawSem || "").trim();

    if (!department || !semester) {
      requestLogger.warn(
        { department, semester },
        "Department and semester are required",
      );
      return NextResponse.json(
        { success: false, message: "Department and semester are required" },
        { status: 400 },
      );
    }

    const deptRegex = {
      $regex: `^${escapeRegex(department)}$`,
      $options: "i",
    };

    // All subjects for this department + semester
    const allSubjects = await Subject.find({
      department: deptRegex,
      $or: [
        { semester: String(semester) },
        { semester: Number(semester) as any },
      ],
      status: { $ne: "inactive" },
    })
      .sort({ subjectCode: 1 })
      .lean();

    // Published performance for these subjects
    const rows = await ExamResult.aggregate([
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
        $match: {
          "studentData.department": deptRegex,
          $expr: {
            $eq: [{ $toString: "$studentData.semester" }, String(semester)],
          },
        },
      },
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

    const bySubject = new Map<
      string,
      { total: number; passed: number }
    >();

    for (const r of rows) {
      const code = r.subjectData?.subjectCode || "—";
      const entry = bySubject.get(code) || { total: 0, passed: 0 };
      entry.total += 1;
      if (r.examResult === "passed") entry.passed += 1;
      bySubject.set(code, entry);
    }

    const assignments = await SubjectFacultyAssignment.find({
      department: deptRegex,
      $or: [{ semester: String(semester) }, { semester: Number(semester) as any }],
    })
      .populate({
        path: "facultyId",
        model: Faculty,
        populate: { path: "userId", model: User, select: "username email" },
      })
      .populate({ path: "subjectId", model: Subject, select: "subjectCode" })
      .lean();

    const facultyByCode = new Map<string, { faculty: string; facultyEmail: string }>();
    for (const a of assignments) {
      const code = (a as any).subjectId?.subjectCode;
      const user = (a as any).facultyId?.userId;
      if (!code || !user) continue;
      facultyByCode.set(code, {
        faculty: user.username || "Faculty",
        facultyEmail: user.email || "",
      });
    }

    const subjects = allSubjects.map((s: any) => {
      const code = s.subjectCode || "—";
      const perf = bySubject.get(code);
      const fac = facultyByCode.get(code);

      return {
        name: s.subjectName || code,
        code,
        passRate: perf?.total
          ? Math.round((perf.passed / perf.total) * 1000) / 10
          : 0,
        avgMarks: 0,
        students: perf?.total || 0,
        failed: perf ? perf.total - perf.passed : 0,
        faculty: fac?.faculty || "—",
        facultyEmail: fac?.facultyEmail || "",
        hasResults: Boolean(perf?.total),
      };
    });

    requestLogger.info(
      { department, semester, subjectCount: subjects.length },
      "Semester results fetched",
    );

    return NextResponse.json({
      success: true,
      data: {
        department,
        semester,
        subjects,
      },
    });
  } catch (error) {
    requestLogger.error({ err: error }, "Failed to fetch semester results");
    return NextResponse.json(
      { success: false, message: "Failed to fetch semester results" },
      { status: 500 },
    );
  }
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
