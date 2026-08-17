import { NextRequest, NextResponse } from "next/server";
import Connect from "@/dbConnect/connect";
import { verifyJwt } from "@/lib/verifyJwt";
import { createRequestLogger } from "@/lib/requestLogger";
import { User } from "@/models/user";
import { Student } from "@/models/student.model";
import {
  buildStudentTimetablePdf,
  getStudentTimetableEntries,
} from "@/lib/student/timetable";

export async function GET(request: NextRequest) {
  const logger = createRequestLogger();

  try {
    await Connect();

    const auth = await verifyJwt(request);
    if (auth.ok === false) return auth.response;

    const { _id: userId, role } = auth.payload;
    if (role !== "student") {
      return NextResponse.json(
        { success: false, message: "Only students can download this timetable" },
        { status: 403 },
      );
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Invalid token payload" },
        { status: 401 },
      );
    }

    const user = await User.findById(userId).select("username").lean();
    const student = await Student.findOne({ userId });
    if (!student) {
      return NextResponse.json(
        { success: false, message: "Student profile not found" },
        { status: 404 },
      );
    }

    const entries = await getStudentTimetableEntries(student);
    const buffer = buildStudentTimetablePdf({
      entries,
      studentName: user?.username || "Student",
    });

    const filename = "timetable.pdf";

    logger.info(
      { userId, classes: entries.length, filename },
      "Student timetable downloaded",
    );

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    logger.error({ err: error }, "Student timetable download failed");
    return NextResponse.json(
      { success: false, message: "Failed to generate timetable" },
      { status: 500 },
    );
  }
}
