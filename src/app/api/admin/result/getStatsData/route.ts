import { NextRequest, NextResponse } from "next/server";
import Connect from "@/dbConnect/connect";
import { ExamResult } from "@/models/exam.model";
import { Student } from "@/models/student.model";
import { Subject } from "@/models/subject.model";
import { createRequestLogger } from "@/lib/requestLogger";

/** Main Results page only — published exams + stats + best/worst department */
export async function GET(_request: NextRequest) {
  const requestLogger = createRequestLogger();
  try {
    await Connect();

    const results = await ExamResult.find()
      .populate({
        path: "studentId",
        model: Student,
        select: "department semester section rollNumber",
      })
      .populate({
        path: "subjectId",
        model: Subject,
        select: "subjectCode subjectName department",
      })
      .sort({ examResultDate: -1 })
      .lean();

    const published = results.filter(
      (r: any) => r.examPublishedStatus === "published",
    );
    const draft = results.filter(
      (r: any) => r.examPublishedStatus === "pending",
    );
    const passed = published.filter((r: any) => r.examResult === "passed");
    const failed = published.filter(
      (r: any) => r.examResult === "failed" || r.examResult === "back",
    );

    const uniqueStudents = new Set(
      results
        .map((r: any) => String(r.studentId?._id || r.studentId || ""))
        .filter(Boolean),
    );

    const overallPassPercent =
      published.length > 0
        ? Math.round((passed.length / published.length) * 1000) / 10
        : 0;

    const byDepartment = await ExamResult.aggregate([
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
        $group: {
          _id: "$studentData.department",
          totalExamTaken: { $sum: 1 },
          passedExam: {
            $sum: { $cond: [{ $eq: ["$examResult", "passed"] }, 1, 0] },
          },
        },
      },
      {
        $project: {
          _id: 0,
          department: "$_id",
          totalExamTaken: 1,
          passPercentage: {
            $cond: [
              { $eq: ["$totalExamTaken", 0] },
              0,
              {
                $round: [
                  {
                    $multiply: [
                      { $divide: ["$passedExam", "$totalExamTaken"] },
                      100,
                    ],
                  },
                  1,
                ],
              },
            ],
          },
        },
      },
      { $sort: { passPercentage: -1 } },
    ]);

    // Published exams table — one row per subject + exam type + dept + semester
    const examMap = new Map<
      string,
      {
        id: string;
        examTitle: string;
        examType: string;
        department: string;
        semester: string;
        section: string;
        publishedDate: Date | null;
        subjectCode: string;
        total: number;
        passed: number;
        students: Set<string>;
      }
    >();

    for (const r of published as any[]) {
      const student = r.studentId as any;
      const subject = r.subjectId as any;
      const department = student?.department || subject?.department || "—";
      const semester = String(student?.semester ?? "—");
      const examType = mapExamType(r.examType);
      const subjectCode = subject?.subjectCode || "—";
      const examTitle = subject?.subjectName || r.examType || "Exam";
      const key = `${subjectCode}|${examType}|${department}|${semester}`.toLowerCase();

      const entry = examMap.get(key) || {
        id: String(r._id),
        examTitle,
        examType,
        department,
        semester,
        section: student?.section || "—",
        publishedDate: r.examResultDate ? new Date(r.examResultDate) : null,
        subjectCode,
        total: 0,
        passed: 0,
        students: new Set<string>(),
      };

      entry.total += 1;
      if (r.examResult === "passed") entry.passed += 1;
      const sid = String(student?._id || r.studentId || "");
      if (sid) entry.students.add(sid);

      if (r.examResultDate) {
        const d = new Date(r.examResultDate);
        if (!entry.publishedDate || d > entry.publishedDate) {
          entry.publishedDate = d;
        }
      }

      examMap.set(key, entry);
    }

    const data = Array.from(examMap.values())
      .map((e) => ({
        id: e.id,
        examTitle: e.examTitle,
        examType: e.examType,
        department: e.department,
        semester: e.semester,
        section: e.section,
        publishedDate: e.publishedDate ? formatDate(e.publishedDate) : "—",
        studentsCount: e.students.size || e.total,
        passRate: e.total ? Math.round((e.passed / e.total) * 1000) / 10 : 0,
        status: "Published",
        subjectCode: e.subjectCode,
      }))
      .sort((a, b) => {
        // Newest published first (string date is en-GB — fall back to title)
        return a.examTitle.localeCompare(b.examTitle);
      });

    requestLogger.info(
      {
        totalDeclarations: data.length,
        studentsCovered: uniqueStudents.size,
        overallPassPercent,
      },
      "Results stats fetched",
    );

    return NextResponse.json({
      success: true,
      message: "Results fetched successfully",
      data,
      stats: {
        totalDeclarations: data.length,
        published: data.length,
        draft: draft.length,
        studentsCovered: uniqueStudents.size,
      },
      performance: {
        overallPassPercent,
        totalPassed: passed.length,
        totalFailed: failed.length,
        bestDepartment: byDepartment[0] || null,
        worstDepartment: byDepartment[byDepartment.length - 1] || null,
      },
    });
  } catch (error) {
    requestLogger.error({ err: error }, "Failed to fetch results");
    return NextResponse.json(
      { success: false, message: "Failed to fetch results" },
      { status: 500 },
    );
  }
}

function mapExamType(type?: string) {
  const allowed = ["Mid Sem", "End Sem", "Internal", "Supplementary"];
  if (type && allowed.includes(type)) return type;
  return "—";
}

function formatDate(value: Date | string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
