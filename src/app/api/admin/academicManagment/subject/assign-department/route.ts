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
    const { subjectCode, department } = body;

    if (!subjectCode || !department) {
      requestLogger.warn({ subjectCode, department }, "Invalid payload");
      return NextResponse.json(
        { success: false, message: "Subject code and department are required" },
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
      { department },
      { new: true },
    );

    if (!updated) {
      requestLogger.warn({ subjectCode }, "Subject not found after update");
      return NextResponse.json(
        { success: false, message: "Subject not found" },
        { status: 404 },
      );
    }

    requestLogger.info({ subjectCode, department }, "Subject assigned to department successfully");
    return NextResponse.json({
      success: true,
      message: "Subject assigned to department successfully",
      data: updated,
    });
  } catch (error) {
    requestLogger.error({ err: error }, "Failed to assign subject to department");
    console.error("Error assigning subject to department", error);
    return NextResponse.json(
      { success: false, message: "Failed to assign subject to department" },
      { status: 500 },
    );
  }
}
