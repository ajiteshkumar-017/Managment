import Connect from "@/dbConnect/connect";
import { Faculty } from "@/models/faculty.model";
import { NextRequest, NextResponse } from "next/server";
import { resolveFacultyByUsername } from "@/app/api/admin/academicManagment/utils";

export async function POST(request: NextRequest) {
  try {
    await Connect();
    const body = await request.json();
    const { facultyUsername, availability } = body;

    if (!facultyUsername || !availability) {
      return NextResponse.json(
        { success: false, message: "Faculty username and availability are required" },
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
      { status: availability },
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
      message: "Faculty availability updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Error updating faculty availability", error);
    return NextResponse.json(
      { success: false, message: "Failed to update faculty availability" },
      { status: 500 },
    );
  }
}
