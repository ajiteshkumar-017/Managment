import Connect from "@/dbConnect/connect";
import { Faculty } from "@/models/faculty.model";
import { NextRequest, NextResponse } from "next/server";
import { resolveFacultyByUsername } from "@/app/api/admin/academicManagment/utils";

export async function POST(request: NextRequest) {
  try {
    await Connect();
    const body = await request.json();
    const { facultyUsername, newDepartment } = body;

    if (!facultyUsername || !newDepartment) {
      return NextResponse.json(
        { success: false, message: "Faculty username and new department are required" },
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
      { department: newDepartment },
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
      message: "Faculty department updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Error transferring faculty department", error);
    return NextResponse.json(
      { success: false, message: "Failed to transfer department" },
      { status: 500 },
    );
  }
}
