import Connect from "@/dbConnect/connect";
import { SubjectFacultyAssignment } from "@/models/subjectFacultyAssignment.model";
import { NextRequest, NextResponse } from "next/server";
import { resolveFacultyByUsername, resolveSubjectByCode } from "@/app/api/admin/academicManagment/utils";

export async function POST(request: NextRequest) {
  try {
    await Connect();
    const body = await request.json();
    const { facultyUsername, subjectCode, semester, section, department, academicYear } = body;

    if (!facultyUsername || !subjectCode || !semester || !department || !academicYear) {
      return NextResponse.json(
        { success: false, message: "All required fields must be provided" },
        { status: 400 },
      );
    }

    const faculty = await resolveFacultyByUsername(facultyUsername);
    const subject = await resolveSubjectByCode(subjectCode);

    if (!faculty || !subject) {
      return NextResponse.json(
        { success: false, message: "Faculty or subject not found" },
        { status: 404 },
      );
    }

    const existing = await SubjectFacultyAssignment.findOne({
      facultyId: faculty._id,
      subjectId: subject._id,
      semester: String(semester),
      section: section || "ALL",
      academicYear,
    });

    if (existing) {
      return NextResponse.json(
        { success: false, message: "This faculty is already assigned to this subject" },
        { status: 409 },
      );
    }

    const assignment = await SubjectFacultyAssignment.create({
      facultyId: faculty._id,
      subjectId: subject._id,
      semester: String(semester),
      section: section || "ALL",
      department,
      academicYear,
    });

    return NextResponse.json({
      success: true,
      message: "Faculty assigned to subject successfully",
      data: assignment,
    });
  } catch (error) {
    console.error("Error assigning faculty to subject", error);
    return NextResponse.json(
      { success: false, message: "Failed to assign faculty to subject" },
      { status: 500 },
    );
  }
}
