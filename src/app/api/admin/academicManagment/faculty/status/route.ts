import Connect from "@/dbConnect/connect";
import { Faculty } from "@/models/faculty.model";
import { NextRequest, NextResponse } from "next/server";
import { resolveFacultyByUsername } from "@/app/api/admin/academicManagment/utils";
import { createRequestLogger } from "@/lib/requestLogger";

export async function PATCH(request: NextRequest) {
  const requestLogger = createRequestLogger();
  try {
    await Connect();
    const body = await request.json();
    const { facultyUsername, status } = body;

    if (!facultyUsername || !status) {
      requestLogger.warn({ facultyUsername, status }, "Invalid payload");
      return NextResponse.json(
        { success: false, message: "Faculty username and status are required" },
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
      { status },
      { new: true },
    );

    if (!updated) {
      requestLogger.warn({ facultyUsername }, "Faculty not found after update");
      return NextResponse.json(
        { success: false, message: "Faculty not found" },
        { status: 404 },
      );
    }

    requestLogger.info({ facultyUsername, status }, "Faculty status updated successfully");
    return NextResponse.json({
      success: true,
      message: "Faculty status updated successfully",
      data: updated,
    });
  } catch (error) {
    requestLogger.error({ err: error }, "Failed to update faculty status");
    console.error("Error updating faculty status", error);
    return NextResponse.json(
      { success: false, message: "Failed to update faculty status" },
      { status: 500 },
    );
  }
}
