import Connect from "@/dbConnect/connect";
import { Subject } from "@/models/subject.model";
import { NextRequest, NextResponse } from "next/server";
import { resolveSubjectByCode } from "@/app/api/admin/academicManagment/utils";
import { createRequestLogger } from "@/lib/requestLogger";
import { AUDIT_ACTION, AUDIT_ENTITY_TYPE } from "@/constant/audit";
import { writeAuditFromRequest } from "@/lib/systemUses/audit/writeAuditFromRequest";

export async function PATCH(request: NextRequest) {
  const requestLogger = createRequestLogger();
  try {
    await Connect();
    const body = await request.json();
    const { subjectCode, status } = body;

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

    const updated = await Subject.findByIdAndUpdate(
      subject._id,
      { status: status || "active" },
      { new: true },
    );

    if (!updated) {
      requestLogger.warn({ subjectCode }, "Subject not found after update");
      return NextResponse.json(
        { success: false, message: "Subject not found" },
        { status: 404 },
      );
    }

    requestLogger.info({ subjectCode, status: status || "active" }, "Subject activated successfully");
    const nextStatus = status || "active";
    await writeAuditFromRequest(request, {
      action: nextStatus === "inactive" ? AUDIT_ACTION.SUBJECT_DEACTIVATE : AUDIT_ACTION.SUBJECT_ACTIVATE,
      entityType: AUDIT_ENTITY_TYPE.SUBJECT,
      entityId: updated._id,
      description: `Set subject ${subjectCode} status to ${nextStatus}`,
      metadata: { subjectCode, status: nextStatus },
      severity: "high",
    });
    return NextResponse.json({
      success: true,
      message: "Subject activated successfully",
      data: updated,
    });
  } catch (error) {
    requestLogger.error({ err: error }, "Failed to activate subject");
    console.error("Error activating subject", error);
    return NextResponse.json(
      { success: false, message: "Failed to activate subject" },
      { status: 500 },
    );
  }
}
