import Connect from "@/dbConnect/connect";
import { SubjectFacultyAssignment } from "@/models/subjectFacultyAssignment.model";
import { NextRequest, NextResponse } from "next/server";
import { resolveFacultyByUsername, resolveSubjectByCode } from "@/app/api/admin/academicManagment/utils";
import { createRequestLogger } from "@/lib/requestLogger";
import { AUDIT_ACTION, AUDIT_ENTITY_TYPE } from "@/constant/audit";
import { writeAuditFromRequest } from "@/lib/systemUses/audit/writeAuditFromRequest";
import { SemesterType } from "@/constant/Constant";

export async function POST(request: NextRequest) {
  const requestLogger = createRequestLogger();
  try {
    await Connect();
    const body = await request.json();
    const { facultyUsername, subjectCode, semester, section, department, academicYear } = body;

    if (!facultyUsername || !subjectCode || !semester || !department || !academicYear) {
      requestLogger.warn(
        { facultyUsername, subjectCode, semester, department, academicYear },
        "Invalid payload",
      );
      return NextResponse.json(
        { success: false, message: "All required fields must be provided" },
        { status: 400 },
      );
    }

    const faculty = await resolveFacultyByUsername(facultyUsername);
    const subject = await resolveSubjectByCode(subjectCode);

    if (!faculty || !subject) {
      requestLogger.warn({ facultyUsername, subjectCode }, "Faculty or subject not found");
      return NextResponse.json(
        { success: false, message: "Faculty or subject not found" },
        { status: 404 },
      );
    }

    const semesterNum = Number(semester) as SemesterType;

    const existing = await SubjectFacultyAssignment.findOne({
      facultyId: faculty._id,
      subjectId: subject._id,
      semester: semesterNum,
      section: section || "ALL",
      academicYear,
    });

    if (existing) {
      requestLogger.warn({ facultyUsername, subjectCode, semester, academicYear }, "Faculty already assigned to subject");
      return NextResponse.json(
        { success: false, message: "This faculty is already assigned to this subject" },
        { status: 409 },
      );
    }

    const assignment = await SubjectFacultyAssignment.create({
      facultyId: faculty._id,
      subjectId: subject._id,
      semester: semesterNum,
      section: section || "ALL",
      department,
      academicYear,
    });

    requestLogger.info(
      { facultyUsername, subjectCode, semester, department, academicYear },
      "Faculty assigned to subject successfully",
    );
    await writeAuditFromRequest(request, {
      action: AUDIT_ACTION.FACULTY_ASSIGN_SUBJECT,
      entityType: AUDIT_ENTITY_TYPE.SUBJECT_FACULTY_ASSIGNMENT,
      entityId: assignment._id,
      description: `Assigned ${facultyUsername} to subject ${subjectCode}`,
      metadata: { facultyUsername, subjectCode, semester, department, academicYear, section: section || "ALL" },
      severity: "high",
    });
    return NextResponse.json({
      success: true,
      message: "Faculty assigned to subject successfully",
      data: assignment,
    });
  } catch (error) {
    requestLogger.error({ err: error }, "Failed to assign faculty to subject");
    console.error("Error assigning faculty to subject", error);
    return NextResponse.json(
      { success: false, message: "Failed to assign faculty to subject" },
      { status: 500 },
    );
  }
}
