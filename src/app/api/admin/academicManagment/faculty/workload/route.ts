import Connect from "@/dbConnect/connect";
import { SubjectFacultyAssignment } from "@/models/subjectFacultyAssignment.model";
import { Class } from "@/models/class.model";
import { NextRequest, NextResponse } from "next/server";
import { resolveFacultyByUsername } from "@/app/api/admin/academicManagment/utils";

export async function GET(request: NextRequest) {
  try {
    await Connect();
    const { searchParams } = new URL(request.url);
    const facultyUsername = searchParams.get("facultyUsername");

    if (!facultyUsername) {
      return NextResponse.json(
        { success: false, message: "Faculty username is required" },
        { status: 400 },
      );
    }

    const faculty = await resolveFacultyByUsername(facultyUsername);
    if (!faculty) {
      return NextResponse.json(
        { success: false, message: "Faculty not found" },
        { status: 404 },
      );
    }

    const [subjectAssignments, classAssignments] = await Promise.all([
      SubjectFacultyAssignment.find({ facultyId: faculty._id }).populate("subjectId", "subjectName subjectCode"),
      Class.find({ facultyId: faculty.userId }).populate("subjectId", "subjectName subjectCode"),
    ]);

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
    console.error("Error fetching faculty workload", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch faculty workload" },
      { status: 500 },
    );
  }
}
