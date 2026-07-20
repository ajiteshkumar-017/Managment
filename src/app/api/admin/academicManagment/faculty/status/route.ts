import Connect from "@/dbConnect/connect";
import { Faculty } from "@/models/faculty.model";
import { NextRequest, NextResponse } from "next/server";
import { resolveFacultyByUsername } from "@/app/api/admin/academicManagment/utils";

export async function PATCH(request: NextRequest) {
  try {
    await Connect();
    const body = await request.json();
    const { facultyUsername, status } = body;

    if (!facultyUsername || !status) {
      return NextResponse.json(
        { success: false, message: "Faculty username and status are required" },
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

    const updated = await Faculty.findByIdAndUpdate(
      faculty._id,
      { status },
      { new: true },
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Faculty not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Faculty status updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Error updating faculty status", error);
    return NextResponse.json(
      { success: false, message: "Failed to update faculty status" },
      { status: 500 },
    );
  }
}
