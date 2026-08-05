import Connect from "@/dbConnect/connect";
import { Student } from "@/models/student.model";
import { NextRequest, NextResponse } from "next/server";
import { createRequestLogger } from "@/lib/requestLogger";
import { SEMESTER, type SemesterType } from "@/constant/Constant";

export async function POST(request: NextRequest) {
  const requestLogger = createRequestLogger();
  try {
    await Connect();
    const body = await request.json();
    const rollNumber = String(body.rollNumber || "").trim();

    if (!rollNumber) {
      return NextResponse.json(
        { success: false, message: "Roll number is required" },
        { status: 400 },
      );
    }

    const student = await Student.findOne({
      rollNumber: { $regex: `^${rollNumber.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" },
    });

    if (!student) {
      return NextResponse.json(
        { success: false, message: "Student not found" },
        { status: 404 },
      );
    }

    if (String(student.status || "").toLowerCase() !== "active") {
      return NextResponse.json(
        { success: false, message: "Only active students can be promoted" },
        { status: 400 },
      );
    }

    const currentSemester = Number(student.semester);
    if (!SEMESTER.includes(currentSemester as SemesterType)) {
      return NextResponse.json(
        { success: false, message: "Invalid student semester" },
        { status: 400 },
      );
    }

    if (currentSemester >= 8) {
      return NextResponse.json(
        { success: false, message: "Student is already in the final semester" },
        { status: 400 },
      );
    }

    student.semester = (currentSemester + 1) as SemesterType;
    student.lastPromoted = new Date();
    await student.save();

    requestLogger.info(
      { rollNumber, from: currentSemester, to: student.semester },
      "Student promoted successfully",
    );

    return NextResponse.json({
      success: true,
      message: `Promoted ${rollNumber} to semester ${student.semester}`,
      data: {
        rollNumber: student.rollNumber,
        semester: student.semester,
      },
    });
  } catch (error) {
    requestLogger.error({ err: error }, "Failed to promote student");
    return NextResponse.json(
      { success: false, message: "Failed to promote student" },
      { status: 500 },
    );
  }
}
