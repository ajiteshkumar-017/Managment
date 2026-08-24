import Connect from "@/dbConnect/connect";
import { Class } from "@/models/class.model";
import { NextRequest, NextResponse } from "next/server";
import { resolveFacultyByUsername, resolveSubjectByCode } from "@/app/api/admin/academicManagment/utils";
import { createRequestLogger } from "@/lib/requestLogger";
import { AUDIT_ACTION, AUDIT_ENTITY_TYPE } from "@/constant/audit";
import { writeAuditFromRequest } from "@/lib/systemUses/audit/writeAuditFromRequest";

export async function POST(request: NextRequest) {
  const requestLogger = createRequestLogger();
  try {
    await Connect();
    const body = await request.json();
    const { facultyUsername, subjectCode, classCode, room } = body;

    if (!facultyUsername || !subjectCode || !classCode) {
      requestLogger.warn({ facultyUsername, subjectCode, classCode }, "Invalid payload");
      return NextResponse.json(
        { success: false, message: "Faculty username, subject code and class code are required" },
        { status: 400 },
      );
    }

    const faculty = await resolveFacultyByUsername(facultyUsername);
    if (!faculty) {
      requestLogger.warn({ facultyUsername }, "Faculty not found");
      return NextResponse.json(
        { success: false, message: "Faculty not found" },
        { status: 404 },
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

    const existing = await Class.findOne({ classCode });
    if (existing) {
      requestLogger.warn({ classCode }, "Class code already exists");
      return NextResponse.json(
        { success: false, message: "Class code already exists" },
        { status: 409 },
      );
    }

    const classRecord = await Class.create({
      facultyId: faculty.userId,
      subjectId: subject._id,
      classCode,
      room: room || "",
    });

    requestLogger.info({ facultyUsername, subjectCode, classCode }, "Faculty assigned to class successfully");
    await writeAuditFromRequest(request, {
      action: AUDIT_ACTION.FACULTY_ASSIGN_CLASS,
      entityType: AUDIT_ENTITY_TYPE.CLASS,
      entityId: classRecord._id,
      description: `Assigned ${facultyUsername} to class ${classCode}`,
      metadata: { facultyUsername, subjectCode, classCode, room: room || "" },
      severity: "high",
    });
    return NextResponse.json({
      success: true,
      message: "Faculty assigned to class successfully",
      data: classRecord,
    });
  } catch (error) {
    requestLogger.error({ err: error }, "Failed to assign faculty to class");
    console.error("Error assigning faculty to class", error);
    return NextResponse.json(
      { success: false, message: "Failed to assign faculty to class" },
      { status: 500 },
    );
  }
}
