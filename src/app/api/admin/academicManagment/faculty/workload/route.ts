import Connect from "@/dbConnect/connect";
import { SubjectFacultyAssignment } from "@/models/subjectFacultyAssignment.model";
import { Class } from "@/models/class.model";
import { NextRequest, NextResponse } from "next/server";
import { resolveFacultyByUsername } from "@/app/api/admin/academicManagment/utils";
import { createRequestLogger } from "@/lib/requestLogger";

export async function GET(request: NextRequest) {
  const requestLogger = createRequestLogger();
  try {
    await Connect();
    const { searchParams } = new URL(request.url);
    const facultyUsername = searchParams.get("facultyUsername");

    if (!facultyUsername) {
      requestLogger.warn({}, "Invalid payload: facultyUsername required");
      return NextResponse.json(
        { success: false, message: "Faculty username is required" },
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

    const [subjectAssignments, classAssignments] = await Promise.all([
      SubjectFacultyAssignment.find({ facultyId: faculty._id }).populate("subjectId", "subjectName subjectCode"),
      Class.find({ facultyId: faculty.userId }).populate("subjectId", "subjectName subjectCode"),
    ]);

    requestLogger.info(
      {
        facultyUsername,
        subjectAssignments: subjectAssignments.length,
        classAssignments: classAssignments.length,
      },
      "Faculty workload fetched successfully",
    );
    return NextResponse.json({
      success: true,
      data: {
        subjectAssignments: subjectAssignments.length,
        classAssignments: classAssignments.length,
        totalLoad: subjectAssignments.length + classAssignments.length,
        subjects: subjectAssignments,
        classes: classAssignments,
      },
    });
  } catch (error) {
    requestLogger.error({ err: error }, "Failed to fetch faculty workload");
    console.error("Error fetching faculty workload", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch faculty workload" },
      { status: 500 },
    );
  }
}
