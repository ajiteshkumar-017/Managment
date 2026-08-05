import { NextRequest, NextResponse } from "next/server";
import Connect from "@/dbConnect/connect";
import { ResultBatch } from "@/models/resultBatch.model";
import { Student } from "@/models/student.model";
import { Subject } from "@/models/subject.model";
import { Faculty } from "@/models/faculty.model";
import { User } from "@/models/user";
import { createRequestLogger } from "@/lib/requestLogger";
import { SEMESTER } from "@/constant/Constant";

type Params = { params: Promise<{ department: string }> };

type SemesterResultRow = {
  studentId?: unknown;
  semester?: number;
  passStatus?: string;
  CGPA?: number;
  SGPA?: number;
};

type PublishedBatch = {
  _id: unknown;
  department?: string;
  semester?: number;
  semesterResult?: SemesterResultRow[];
};

/** Department results page — overview + other departments + all semesters */
export async function GET(_request: NextRequest, { params }: Params) {
  const requestLogger = createRequestLogger();
  try {
    await Connect();

    const { department: rawDept } = await params;
    const department = decodeURIComponent(rawDept || "").trim();

    if (!department) {
      requestLogger.warn({}, "Department is required");
      return NextResponse.json(
        { success: false, message: "Department is required" },
        { status: 400 },
      );
    }

    const deptRegex = {
      $regex: `^${escapeRegex(department)}$`,
      $options: "i",
    };

    const published = (await ResultBatch.aggregate([
      { $match: { status: "published" } },
      {
        $lookup: {
          from: "semesterresults",
          let: { resultBatchId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and:[
                    {$eq: ["$passStatus", "Pass"]},
                    {$eq: ["$resultBatch", "$$resultBatchId"]},
                  ],
                },
              },
            },
            {
              $project: {
                _id: 1,
                studentId: 1,
                semester: 1,
                passStatus: 1,
                CGPA: 1,
                SGPA: 1,
                rank: 1,
                hadBack: 1,
                passStatusDate: 1,
              },
            },
          ],
          as: "semesterResult",
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          semester: 1,
          department: 1,
          academicYear: 1,
          examType: "$ExamType",
          status: 1,
          semesterResult: 1,
        },
      },
    ])) as PublishedBatch[];

    
    const deptBatches = published.filter((b) =>
      equalsIgnoreCase(b.department, department),
  );
  console.log("Published batches: ", published);
  console.log("Semester batches: ", published[0].semesterResult);
  console.log("Dept batches: ", deptBatches);
  
  let totalPassed = 0;
  let totalFailed = 0;
  let cgpaSum = 0;
  let cgpaCount = 0;
  
    const bySem = new Map<
      number,
      { total: number; passed: number; students: Set<string>; cgpaSum: number }
    >();

    for (const batch of deptBatches) {
      const batchSem = Number(batch.semester);
      for (const sr of batch.semesterResult || []) {
        const sem = Number(sr.semester ?? batchSem);
        if (!Number.isFinite(sem)) continue;

        const entry = bySem.get(sem) || {
          total: 0,
          passed: 0,
          students: new Set<string>(),
          cgpaSum: 0,
        };

        entry.total += 1;
        if (sr.passStatus === "Pass") {
          entry.passed += 1;
          totalPassed += 1;
        } else if (sr.passStatus === "Fail") {
          totalFailed += 1;
        }

        if (typeof sr.CGPA === "number") {
          entry.cgpaSum += sr.CGPA;
          cgpaSum += sr.CGPA;
          cgpaCount += 1;
        }

        const sid = String(sr.studentId || "");
        if (sid) entry.students.add(sid);

        bySem.set(sem, entry);
      }
    }

    const passRateDenom = totalPassed + totalFailed;
    const passRate =
      passRateDenom > 0
        ? Math.round((totalPassed / passRateDenom) * 1000) / 10
        : 0;
    const avgCgpa =
      cgpaCount > 0 ? Math.round((cgpaSum / cgpaCount) * 100) / 100 : 0;

    const students = await Student.countDocuments({
      department: deptRegex,
      status: "active",
    });

    const hod = await findHodName(department);

    const studentsBySem = await Student.aggregate([
      { $match: { department: deptRegex, status: "active" } },
      { $group: { _id: "$semester", count: { $sum: 1 } } },
    ]);
    const studentCountMap = new Map(
      studentsBySem.map((s) => [Number(s._id), s.count as number]),
    );

    const subjectsBySem = await Subject.aggregate([
      { $match: { department: deptRegex, status: { $ne: "inactive" } } },
      { $group: { _id: "$semester", count: { $sum: 1 } } },
    ]);
    const subjectCountMap = new Map(
      subjectsBySem.map((s) => [Number(s._id), s.count as number]),
    );

    const semesters = SEMESTER.map((sem) => {
      const perf = bySem.get(sem);
      const subjectCount = subjectCountMap.get(sem) ?? 0;
      const studentCount =
        studentCountMap.get(sem) ?? perf?.students.size ?? 0;

      return {
        semester: sem,
        students: studentCount,
        subjects: subjectCount,
        passRate: perf?.total
          ? Math.round((perf.passed / perf.total) * 1000) / 10
          : 0,
        avgCgpa: perf?.total
          ? Math.round((perf.cgpaSum / perf.total) * 100) / 100
          : 0,
        failed: perf ? perf.total - perf.passed : 0,
        hasResults: Boolean(perf?.total),
      };
    });

    const byDept = new Map<string, { total: number; passed: number }>();
    for (const batch of published) {
      const dept = String(batch.department || "").trim();
      if (!dept) continue;
      const entry = byDept.get(dept) || { total: 0, passed: 0 };
      for (const sr of batch.semesterResult || []) {
        entry.total += 1;
        if (sr.passStatus === "Pass") entry.passed += 1;
      }
      byDept.set(dept, entry);
    }

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

    requestLogger.info({ department }, "Department results fetched");

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          code: department,
          name: department,
          passRate,
          avgCgpa,
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
    requestLogger.error({ err: error }, "Failed to fetch department results");
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

  const username = (hodFaculty as { userId?: { username?: string } } | null)
    ?.userId?.username;
  return username || "—";
}

function equalsIgnoreCase(a?: string, b?: string) {
  return (
    String(a || "").trim().toLowerCase() === String(b || "").trim().toLowerCase()
  );
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
