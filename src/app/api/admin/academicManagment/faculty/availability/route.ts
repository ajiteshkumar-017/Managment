import Connect from "@/dbConnect/connect";
import { Faculty } from "@/models/faculty.model";
import { NextRequest, NextResponse } from "next/server";
import { resolveFacultyByUsername } from "@/app/api/admin/academicManagment/utils";
import { createRequestLogger } from "@/lib/requestLogger";
import { AUDIT_ACTION, AUDIT_ENTITY_TYPE } from "@/constant/audit";
import { writeAuditFromRequest } from "@/lib/systemUses/audit/writeAuditFromRequest";

export async function POST(request: NextRequest) {
  const requestLogger = createRequestLogger();
  try {
    await Connect();
    const body = await request.json();
    const { facultyUsername, availability } = body;

    if (!facultyUsername || !availability) {
      requestLogger.warn({ facultyUsername, availability }, "Invalid payload");
      return NextResponse.json(
        { success: false, message: "Faculty username and availability are required" },
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

    const updated = await Faculty.findByIdAndUpdate(
      faculty._id,
      { status: availability },
      { new: true },
    );

    if (!updated) {
      requestLogger.warn({ facultyUsername }, "Faculty not found after update");
      return NextResponse.json(
        { success: false, message: "Faculty not found" },
        { status: 404 },
      );
    }

    requestLogger.info({ facultyUsername, availability }, "Faculty availability updated successfully");
    await writeAuditFromRequest(request, {
      action: AUDIT_ACTION.FACULTY_UPDATE_AVAILABILITY,
      entityType: AUDIT_ENTITY_TYPE.FACULTY,
      entityId: updated._id,
      description: `Updated faculty ${facultyUsername} availability to ${availability}`,
      metadata: { facultyUsername, availability },
      severity: "medium",
    });
    return NextResponse.json({
      success: true,
      message: "Faculty availability updated successfully",
      data: updated,
    });
  } catch (error) {
    requestLogger.error({ err: error }, "Failed to update faculty availability");
    console.error("Error updating faculty availability", error);
    return NextResponse.json(
      { success: false, message: "Failed to update faculty availability" },
      { status: 500 },
    );
  }
}
