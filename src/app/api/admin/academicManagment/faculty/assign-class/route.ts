import Connect from "@/dbConnect/connect";
import { Class } from "@/models/class.model";
import { NextRequest, NextResponse } from "next/server";
import { resolveFacultyByUsername, resolveSubjectByCode } from "@/app/api/admin/academicManagment/utils";

export async function POST(request: NextRequest) {
  try {
    await Connect();
    const body = await request.json();
    const { facultyUsername, subjectCode, classCode, room } = body;

    if (!facultyUsername || !subjectCode || !classCode) {
      return NextResponse.json(
        { success: false, message: "Faculty username, subject code and class code are required" },
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

    const subject = await resolveSubjectByCode(subjectCode);
    if (!subject) {
      return NextResponse.json(
        { success: false, message: "Subject not found" },
        { status: 404 },
      );
    }

    const existing = await Class.findOne({ classCode });
    if (existing) {
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

    return NextResponse.json({
      success: true,
      message: "Faculty assigned to class successfully",
      data: classRecord,
    });
  } catch (error) {
    console.error("Error assigning faculty to class", error);
    return NextResponse.json(
      { success: false, message: "Failed to assign faculty to class" },
      { status: 500 },
    );
  }
}
