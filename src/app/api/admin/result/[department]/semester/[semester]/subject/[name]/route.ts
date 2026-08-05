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
  params: Promise<{ department: string; semester: string; name: string }>;
};

/** Subject detail page — performance + faculty + HOD */
export async function GET(_request: NextRequest, { params }: Params) {
  const requestLogger = createRequestLogger();
  try {
    await Connect();

    const {
      department: rawDept,
      semester: rawSem,
      name: rawName,
    } = await params;

    const department = decodeURIComponent(rawDept || "").trim();
    const semester = decodeURIComponent(rawSem || "").trim();
    const subjectName = decodeURIComponent(rawName || "").trim();
    const semesterNum = Number(semester);
    const semesterTyped: SemesterType | undefined = SEMESTER.includes(
      semesterNum as SemesterType,
    )
      ? (semesterNum as SemesterType)
      : undefined;

    if (!department || !semester || !subjectName || semesterTyped === undefined) {
      requestLogger.warn(
        { department, semester, subjectName },
        "Department, semester and subject are required",
      );
      return NextResponse.json(
        {
          success: false,
          message: "Department, semester and subject are required",
        },
        { status: 400 },
      );
    }

    const subject = await Subject.findOne({
      subjectName: { $regex: `^${escapeRegex(subjectName)}$`, $options: "i" },
      department: { $regex: `^${escapeRegex(department)}$`, $options: "i" },
    }).lean();

    const resolvedSubject =
      subject ||
      (await Subject.findOne({
        subjectName: {
          $regex: `^${escapeRegex(subjectName)}$`,
          $options: "i",
        },
      }).lean());

    if (!resolvedSubject) {
      requestLogger.warn(
        { department, semester, subjectName },
        "Subject not found",
      );
      return NextResponse.json(
        { success: false, message: "Subject not found" },
        { status: 404 },
      );
    }

    const subjectId = resolvedSubject._id;

    const rows = await SubjectResult.aggregate([
      { $match: { subjectId } },
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
          "batch.department": {
            $regex: `^${escapeRegex(department)}$`,
            $options: "i",
          },
          "batch.semester": semesterNum,
        },
      },
    ]);

    const total = rows.length;
    const passed = rows.filter((r) => r.resultStatus === "passed").length;
    const failed = rows.filter(
      (r) => r.resultStatus === "failed" || r.resultStatus === "back",
    ).length;
    const passRate = total ? Math.round((passed / total) * 1000) / 10 : 0;
    const marksSum = rows.reduce(
      (sum, r) => sum + (typeof r.obtainedMarks === "number" ? r.obtainedMarks : 0),
      0,
    );
    const avgMarks = total ? Math.round((marksSum / total) * 10) / 10 : 0;

    const assignment = await SubjectFacultyAssignment.findOne({
      subjectId,
      department: { $regex: `^${escapeRegex(department)}$`, $options: "i" },
      semester: semesterTyped,
    })
      .populate({
        path: "facultyId",
        model: Faculty,
        populate: { path: "userId", model: User, select: "username email" },
      })
      .lean();

    let faculty = "Unassigned";
    let facultyEmail = "";

    const fac = (
      assignment as {
        facultyId?: { userId?: { username?: string; email?: string } };
      } | null
    )?.facultyId;
    if (fac?.userId) {
      faculty = fac.userId.username || "Faculty";
      facultyEmail = fac.userId.email || "";
    }

    const hodFaculty = await Faculty.findOne({
      department: { $regex: `^${escapeRegex(department)}$`, $options: "i" },
      designation: { $regex: /hod|head/i },
    })
      .populate({ path: "userId", model: User, select: "username email" })
      .lean();

    const hodUser = (
      hodFaculty as { userId?: { username?: string; email?: string } } | null
    )?.userId;
    const hod = hodUser?.username || "—";
    const hodEmail = hodUser?.email || "";

    requestLogger.info(
      { department, semester, subjectName, passRate, students: total },
      "Subject results fetched",
    );

    return NextResponse.json({
      success: true,
      data: {
        department,
        semester,
        subject: {
          name: resolvedSubject.subjectName,
          code: resolvedSubject.subjectCode,
          passRate,
          avgMarks,
          students: total,
          failed,
          faculty,
          facultyEmail,
          hasResults: total > 0,
        },
        hod,
        hodEmail,
      },
    });
  } catch (error) {
    requestLogger.error({ err: error }, "Failed to fetch subject results");
    return NextResponse.json(
      { success: false, message: "Failed to fetch subject results" },
      { status: 500 },
    );
  }
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
