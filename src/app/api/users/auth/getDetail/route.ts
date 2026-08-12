import Connect from "@/dbConnect/connect";
import { getUser } from "@/lib/getUser";
import { Student } from "@/models/student.model";
import { User } from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import { createRequestLogger } from "@/lib/requestLogger";
import { DEPARTMENT, SEMESTER } from "@/constant/Constant";

export async function POST(req: NextRequest) {
  const requestLogger = createRequestLogger();
  try {
    await Connect();

    const body = await req.json();
    const { semester, department, section } = body;

    if (
      !semester ||
      !department ||
      !section ||
      semester === "default" ||
      department === "default" ||
      section === "default"
    ) {
      requestLogger.warn({ reason: "missing_fields" }, "getDetail validation failed");
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required",
        },
        { status: 400 },
      );
    }

    const semesterNumber = Number(semester);
    if (
      !DEPARTMENT.includes(department) ||
      !SEMESTER.includes(semesterNumber as (typeof SEMESTER)[number])
    ) {
      requestLogger.warn(
        { reason: "invalid_fields", department, semester },
        "getDetail invalid department or semester",
      );
      return NextResponse.json(
        {
          success: false,
          message: "Invalid department or semester",
        },
        { status: 400 },
      );
    }

    const getuser = await getUser();
    const email = getuser.email;
    if (!email) {
      requestLogger.warn({ reason: "missing_email" }, "getDetail email not found");
      return NextResponse.json(
        {
          success: false,
          message: "Error in Email",
        },
        { status: 404 },
      );
    }

    const user = await User.findOneAndUpdate(
      { email },
      { profileCompleted: true },
      { new: true },
    );

    if (!user) {
      requestLogger.warn({ reason: "user_not_found", email }, "getDetail user not found");
      return NextResponse.json(
        {
          success: false,
          message: "Error in User",
        },
        { status: 404 },
      );
    }

    const updatedStudent = await Student.findOneAndUpdate(
      { userId: user._id },
      {
        $set: {
          semester: semesterNumber,
          department,
          section,
        },
      },
      { new: true },
    );

    if (!updatedStudent) {
      requestLogger.warn(
        { reason: "student_update_failed", userId: user._id },
        "getDetail student update failed",
      );
      return NextResponse.json(
        {
          success: false,
          message: "Error in Updating User",
        },
        { status: 404 },
      );
    }

    requestLogger.info(
      {
        email,
        userId: user._id,
        studentId: updatedStudent._id,
        semester: semesterNumber,
        department,
        section,
      },
      "Profile details updated successfully",
    );

    return NextResponse.json(
      {
        success: true,
        message: "Updated the User Successfully",
      },
      { status: 200 },
    );
  } catch (err: unknown) {
    requestLogger.error({ err }, "getDetail profile setup failed");
    return NextResponse.json(
      {
        success: false,
        message: "Error in SettingUp Profile. Please Try Again !",
      },
      { status: 500 },
    );
  }
}
