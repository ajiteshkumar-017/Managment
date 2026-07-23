import { NextRequest, NextResponse } from "next/server";
import Connect from "@/dbConnect/connect";
import { ExamResult } from "@/models/exam.model";
import { Subject } from "@/models/subject.model";
import { SubjectFacultyAssignment } from "@/models/subjectFacultyAssignment.model";
import { Faculty } from "@/models/faculty.model";
import { User } from "@/models/user";
import { createRequestLogger } from "@/lib/requestLogger";

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

    if (!department || !semester || !subjectName) {
      requestLogger.warn(
        { department, semester, subjectName },
        "Department, semester and subject are required",
      );
      return NextResponse.json(
        { success: false, message: "Department, semester and subject are required" },
        { status: 400 },
      );
    }

    const subject = await Subject.findOne({
      subjectName: { $regex: `^${escapeRegex(subjectName)}$`, $options: "i" },
      department: { $regex: `^${escapeRegex(department)}$`, $options: "i" },
    }).lean();

    // Fallback: match by name only if dept filter misses
    const resolvedSubject =
      subject ||
      (await Subject.findOne({
        subjectName: { $regex: `^${escapeRegex(subjectName)}$`, $options: "i" },
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

    const subjectId = (resolvedSubject as any)._id;

    const rows = await ExamResult.aggregate([
      {
        $match: {
          examPublishedStatus: "published",
          subjectId,
        },
      },
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
          "studentData.department": {
            $regex: `^${escapeRegex(department)}$`,
            $options: "i",
          },
          $expr: {
            $eq: [{ $toString: "$studentData.semester" }, String(semester)],
          },
        },
      },
    ]);

    const total = rows.length;
    const passed = rows.filter((r) => r.examResult === "passed").length;
    const failed = rows.filter(
      (r) => r.examResult === "failed" || r.examResult === "back",
    ).length;
    const passRate = total ? Math.round((passed / total) * 1000) / 10 : 0;

    const assignment = await SubjectFacultyAssignment.findOne({
      subjectId,
      department: { $regex: `^${escapeRegex(department)}$`, $options: "i" },
      $or: [
        { semester: String(semester) },
        { semester: Number(semester) as any },
      ],
    })
      .populate({
        path: "facultyId",
        model: Faculty,
        populate: { path: "userId", model: User, select: "username email" },
      })
      .lean();

    let faculty = "Unassigned";
    let facultyEmail = "";

    const fac = (assignment as any)?.facultyId;
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

    const hod = (hodFaculty as any)?.userId?.username || "—";
    const hodEmail = (hodFaculty as any)?.userId?.email || "";

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
          name: (resolvedSubject as any).subjectName,
          code: (resolvedSubject as any).subjectCode,
          passRate,
          avgMarks: 0,
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
