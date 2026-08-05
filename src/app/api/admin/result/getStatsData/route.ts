import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Connect from "@/dbConnect/connect";
import { createRequestLogger } from "@/lib/requestLogger";
import { ResultBatch } from "@/models/resultBatch.model";
import { SemesterResult } from "@/models/semesterResult";

/** Main Results page only — published exams + stats + best/worst department */
export async function GET(_request: NextRequest) {
  const requestLogger = createRequestLogger();
  try {
    await Connect();

    const [publishedBatches, draftBatches] = await Promise.all([
      ResultBatch.find({ status: "published" }).lean(),
      ResultBatch.find({ status: { $in: ["draft", "unpublished"] } }).lean(),
    ]);

    const publishedBatchIds = publishedBatches.map(
      (b) => b._id as mongoose.Types.ObjectId,
    );

    const semesterResults = publishedBatchIds.length
      ? await SemesterResult.find({
          resultBatch: { $in: publishedBatchIds },
        // mongoose FilterQuery + Schema.Types.ObjectId mismatch
        } as Record<string, unknown>)
          .select("studentId resultBatch passStatus passStatusDate")
          .lean()
      : [];

    const byBatch = new Map<
      string,
      {
        total: number;
        passed: number;
        students: Set<string>;
        latestDate: Date | null;
      }
    >();

    const uniqueStudents = new Set<string>();
    let totalPassed = 0;
    let totalFailed = 0;

    for (const sr of semesterResults) {
      const batchId = String(sr.resultBatch);
      const entry = byBatch.get(batchId) || {
        total: 0,
        passed: 0,
        students: new Set<string>(),
        latestDate: null,
      };

      entry.total += 1;
      if (sr.passStatus === "Pass") {
        entry.passed += 1;
        totalPassed += 1;
      } else if (sr.passStatus === "Fail") {
        totalFailed += 1;
      }

      const sid = String(sr.studentId || "");
      if (sid) {
        entry.students.add(sid);
        uniqueStudents.add(sid);
      }

      if (sr.passStatusDate) {
        const d = new Date(sr.passStatusDate);
        if (!entry.latestDate || d > entry.latestDate) entry.latestDate = d;
      }

      byBatch.set(batchId, entry);
    }

    const overallPassPercent =
      semesterResults.length > 0
        ? Math.round((totalPassed / semesterResults.length) * 1000) / 10
        : 0;

    const byDepartment = await SemesterResult.aggregate([
      {
        $lookup: {
          from: "resultbatches",
          localField: "resultBatch",
          foreignField: "_id",
          as: "batch",
        },
      },
      { $unwind: "$batch" },
      { $match: { "batch.status": "published" } },
      {
        $group: {
          _id: "$batch.department",
          totalExamTaken: { $sum: 1 },
          passedExam: {
            $sum: { $cond: [{ $eq: ["$passStatus", "Pass"] }, 1, 0] },
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

    const data = publishedBatches
      .map((batch) => {
        const batchStats = byBatch.get(String(batch._id)) || {
          total: 0,
          passed: 0,
          students: new Set<string>(),
          latestDate: null as Date | null,
        };

        return {
          id: String(batch._id),
          examTitle: batch.title || "Result Publication",
          examType: mapExamType(batch.ExamType),
          department: batch.department || "—",
          semester: Number(batch.semester ?? "—"),
          section: "—",
          publishedDate: batchStats.latestDate
            ? formatDate(batchStats.latestDate)
            : "—",
          studentsCount: batchStats.students.size || batchStats.total,
          passRate: batchStats.total
            ? Math.round((batchStats.passed / batchStats.total) * 1000) / 10
            : 0,
          status: "Published" as const,
        };
      })
      .sort((a, b) => a.examTitle.localeCompare(b.examTitle));

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
        draft: draftBatches.length,
        studentsCovered: uniqueStudents.size,
      },
      performance: {
        overallPassPercent,
        totalPassed,
        totalFailed,
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
