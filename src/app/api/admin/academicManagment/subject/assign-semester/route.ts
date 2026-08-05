import Connect from "@/dbConnect/connect";
import { Subject } from "@/models/subject.model";
import { NextRequest, NextResponse } from "next/server";
import { resolveSubjectByCode } from "@/app/api/admin/academicManagment/utils";
import { createRequestLogger } from "@/lib/requestLogger";

export async function PATCH(request: NextRequest) {
  const requestLogger = createRequestLogger();
  try {
    await Connect();
    const body = await request.json();
    const { subjectCode, semester } = body;

    if (!subjectCode || !semester) {
      requestLogger.warn({ subjectCode, semester }, "Invalid payload");
      return NextResponse.json(
        { success: false, message: "Subject code and semester are required" },
        { status: 400 },
      );
    }

    const subject = await resolveSubjectByCode(subjectCode);
    if (!subject) {
      requestLogger.warn({ subjectCode }, "Subject not found");
      return NextResponse.json(
        { success: false, message: "Subject not found" },
        { status: 404 },
      );
    }

    const updated = await Subject.findByIdAndUpdate(
      subject._id,
      { semester: Number(semester) },
      { new: true },
    );

    if (!updated) {
      requestLogger.warn({ subjectCode }, "Subject not found after update");
      return NextResponse.json(
        { success: false, message: "Subject not found" },
        { status: 404 },
      );
    }

    requestLogger.info({ subjectCode, semester }, "Subject assigned to semester successfully");
    return NextResponse.json({
      success: true,
      message: "Subject assigned to semester successfully",
      data: updated,
    });
  } catch (error) {
    requestLogger.error({ err: error }, "Failed to assign subject to semester");
    console.error("Error assigning subject to semester", error);
    return NextResponse.json(
      { success: false, message: "Failed to assign subject to semester" },
      { status: 500 },
    );
  }
}
