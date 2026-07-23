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
    const { subjectCode, newSubjectCode, subjectName, credits, semester, department, totalClasses } = body;

    if (!subjectCode) {
      requestLogger.warn({}, "Invalid payload: subjectCode required");
      return NextResponse.json(
        { success: false, message: "Subject code is required" },
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

    const updateData: Record<string, unknown> = {
      ...(newSubjectCode && { subjectCode: newSubjectCode }),
      ...(subjectName && { subjectName }),
      ...(credits && { credits }),
      ...(semester && { semester: String(semester) }),
      ...(department && { department }),
      ...(totalClasses !== undefined && { totalClasses }),
    };

    const updated = await Subject.findByIdAndUpdate(
      subject._id,
      updateData,
      { new: true },
    );

    if (!updated) {
      requestLogger.warn({ subjectCode }, "Subject not found after update");
      return NextResponse.json(
        { success: false, message: "Subject not found" },
        { status: 404 },
      );
    }

    requestLogger.info({ subjectCode, newSubjectCode }, "Subject updated successfully");
    return NextResponse.json({
      success: true,
      message: "Subject updated successfully",
      data: updated,
    });
  } catch (error) {
    requestLogger.error({ err: error }, "Failed to update subject");
    console.error("Error updating subject", error);
    return NextResponse.json(
      { success: false, message: "Failed to update subject" },
      { status: 500 },
    );
  }
}
