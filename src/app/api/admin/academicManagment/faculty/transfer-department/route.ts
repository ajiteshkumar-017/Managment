import Connect from "@/dbConnect/connect";
import { Faculty } from "@/models/faculty.model";
import { NextRequest, NextResponse } from "next/server";
import { resolveFacultyByUsername } from "@/app/api/admin/academicManagment/utils";
import { createRequestLogger } from "@/lib/requestLogger";

export async function POST(request: NextRequest) {
  const requestLogger = createRequestLogger();
  try {
    await Connect();
    const body = await request.json();
    const { facultyUsername, newDepartment } = body;

    if (!facultyUsername || !newDepartment) {
      requestLogger.warn({ facultyUsername, newDepartment }, "Invalid payload");
      return NextResponse.json(
        { success: false, message: "Faculty username and new department are required" },
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
      { department: newDepartment },
      { new: true },
    );

    if (!updated) {
      requestLogger.warn({ facultyUsername }, "Faculty not found after update");
      return NextResponse.json(
        { success: false, message: "Faculty not found" },
        { status: 404 },
      );
    }

    requestLogger.info({ facultyUsername, newDepartment }, "Faculty department transferred successfully");
    return NextResponse.json({
      success: true,
      message: "Faculty department updated successfully",
      data: updated,
    });
  } catch (error) {
    requestLogger.error({ err: error }, "Failed to transfer faculty department");
    console.error("Error transferring faculty department", error);
    return NextResponse.json(
      { success: false, message: "Failed to transfer department" },
      { status: 500 },
    );
  }
}
