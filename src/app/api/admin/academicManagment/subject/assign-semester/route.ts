import Connect from "@/dbConnect/connect";
import { Subject } from "@/models/subject.model";
import { NextRequest, NextResponse } from "next/server";
import { resolveSubjectByCode } from "@/app/api/admin/academicManagment/utils";

export async function PATCH(request: NextRequest) {
  try {
    await Connect();
    const body = await request.json();
    const { subjectCode, semester } = body;

    if (!subjectCode || !semester) {
      return NextResponse.json(
        { success: false, message: "Subject code and semester are required" },
        { status: 400 },
      );
    }

    const subject = await resolveSubjectByCode(subjectCode);
    if (!subject) {
      return NextResponse.json(
        { success: false, message: "Subject not found" },
        { status: 404 },
      );
    }

    const updated = await Subject.findByIdAndUpdate(
      subject._id,
      { semester: String(semester) },
      { new: true },
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Subject not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Subject assigned to semester successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Error assigning subject to semester", error);
    return NextResponse.json(
      { success: false, message: "Failed to assign subject to semester" },
      { status: 500 },
    );
  }
}
