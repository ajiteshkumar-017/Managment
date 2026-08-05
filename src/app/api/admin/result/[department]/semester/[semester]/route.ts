import { NextRequest, NextResponse } from "next/server";
import Connect from "@/dbConnect/connect";
import { SubjectResult } from "@/models/subjectResult";
import { Subject } from "@/models/subject.model";
import { SubjectFacultyAssignment } from "@/models/subjectFacultyAssignment.model";
import { Faculty } from "@/models/faculty.model";
import { User } from "@/models/user";
import { createRequestLogger } from "@/lib/requestLogger";
import { SEMESTER, type SemesterType } from "@/constant/Constant";

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
    const semesterNum = Number(semester);
    const semesterTyped: SemesterType | undefined = SEMESTER.includes(
      semesterNum as SemesterType,
    )
      ? (semesterNum as SemesterType)
      : undefined;

    if (!department || !semester || semesterTyped === undefined) {
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

    const allSubjects = await Subject.find({
      department: deptRegex,
      semester: semesterTyped,
      status: { $ne: "inactive" },
    })
      .sort({ subjectCode: 1 })
      .lean();

    const rows = await SubjectResult.aggregate([
      {
        $lookup: {
          from: "semesterresults",
          localField: "semesterResultId",
          foreignField: "_id",
          as: "sr",
        },
      },
      { $unwind: "$sr" },
      {
        $lookup: {
          from: "resultbatches",
          localField: "sr.resultBatch",
          foreignField: "_id",
          as: "batch",
        },
      },
      { $unwind: "$batch" },
      {
        $match: {
          "batch.status": "published",
          "batch.department": deptRegex,
          "batch.semester": semesterTyped,
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
      { $unwind: "$subjectData" },
    ]);

    console.log("Rows: ", rows[0]);

    const bySubject = new Map<
      string,
      { total: number; passed: number; marksSum: number }
    >();

    for (const r of rows) {
      const code = r.subjectData?.subjectCode || "—";
      const entry = bySubject.get(code) || {
        total: 0,
        passed: 0,
        marksSum: 0,
      };
      entry.total += 1;
      if (r.resultStatus === "passed") entry.passed += 1;
      if (typeof r.obtainedMarks === "number") {
        entry.marksSum += r.obtainedMarks;
      }
      bySubject.set(code, entry);
    }

    const assignments = await SubjectFacultyAssignment.find({
      department: deptRegex,
      semester: semesterTyped,
    })
      .populate({
        path: "facultyId",
        model: Faculty,
        populate: { path: "userId", model: User, select: "username email" },
      })
      .populate({ path: "subjectId", model: Subject, select: "subjectCode" })
      .lean();

      console.log("Assignments: ", assignments[0]);

    const facultyByCode = new Map<
      string,
      { faculty: string; facultyEmail: string }
    >();
    for (const a of assignments) {
      const code = (a as { subjectId?: { subjectCode?: string } }).subjectId
        ?.subjectCode;
      const user = (
        a as {
          facultyId?: { userId?: { username?: string; email?: string } };
        }
      ).facultyId?.userId;
      if (!code || !user) continue;
      facultyByCode.set(code, {
        faculty: user.username || "Faculty",
        facultyEmail: user.email || "",
      });
    }

    const subjects = allSubjects.map((s) => {
      const code = s.subjectCode || "—";
      const perf = bySubject.get(code);
      const fac = facultyByCode.get(code);

      return {
        name: s.subjectName || code,
        code,
        passRate: perf?.total
          ? Math.round((perf.passed / perf.total) * 1000) / 10
          : 0,
        avgMarks: perf?.total
          ? Math.round((perf.marksSum / perf.total) * 10) / 10
          : 0,
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
