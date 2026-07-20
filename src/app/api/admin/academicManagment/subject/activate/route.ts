import Connect from "@/dbConnect/connect";
import { Subject } from "@/models/subject.model";
import { NextRequest, NextResponse } from "next/server";
import { resolveSubjectByCode } from "@/app/api/admin/academicManagment/utils";

export async function PATCH(request: NextRequest) {
  try {
    await Connect();
    const body = await request.json();
    const { subjectCode, status } = body;

    if (!subjectCode) {
      return NextResponse.json(
        { success: false, message: "Subject code is required" },
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
      { status: status || "active" },
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
      message: "Subject activated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Error activating subject", error);
    return NextResponse.json(
      { success: false, message: "Failed to activate subject" },
      { status: 500 },
    );
  }
}
