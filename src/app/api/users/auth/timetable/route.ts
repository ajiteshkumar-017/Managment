import { NextRequest, NextResponse } from "next/server";
import Connect from "@/dbConnect/connect";
import { getUser } from "@/lib/getUser";
import { createRequestLogger } from "@/lib/requestLogger";
import { User } from "@/models/user";
import { Student } from "@/models/student.model";
import { getStudentTimetableEntries } from "@/lib/student/timetable";

export async function GET(_request: NextRequest) {
  const logger = createRequestLogger();

  try {
    await Connect();

    const { email, role } = await getUser();
    if (!email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }
    if (role && role !== "student") {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 },
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "No user found" },
        { status: 404 },
      );
    }

    const student = await Student.findOne({ userId: user._id });
    if (!student) {
      return NextResponse.json(
        { success: false, message: "Student profile not found" },
        { status: 404 },
      );
    }

    const entries = await getStudentTimetableEntries(student);

    logger.info(
      { userId: user._id, count: entries.length },
      "Student timetable fetched",
    );

    return NextResponse.json({
      success: true,
      data: { entries },
    });
  } catch (error) {
    logger.error({ err: error }, "Student timetable failed");
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
