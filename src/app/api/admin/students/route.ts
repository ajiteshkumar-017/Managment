import Connect from "@/dbConnect/connect";
import { Enrollment } from "@/models";
import { Student } from "@/models/student.model";
import { User } from "@/models/user";
import { NextResponse, NextRequest } from "next/server";
import { createRequestLogger } from "@/lib/requestLogger";

/** Students page — full table list + stats */
export async function GET(_request: NextRequest) {
  const requestLogger = createRequestLogger();
  try {
    await Connect();

    const [
      students,
      totalStudent,
      activeStudent,
      graduatedStudents,
      newEnrollement,
    ] = await Promise.all([
      Student.find({})
        .populate({ path: "userId", model: User, select: "username email avatar" })
        .sort({ createdAt: -1 })
        .lean(),
      Student.countDocuments(),
      Student.countDocuments({ status: { $regex: /^active$/i } }),
      Student.countDocuments({ status: { $regex: /^graduated$/i } }),
      Enrollment.countDocuments(),
    ]);

    const data = students.map((s: any) => ({
      id: String(s._id),
      rollNumber: s.rollNumber || "—",
      name: s.userId?.username || "—",
      email: s.userId?.email || "",
      department: s.department || "—",
      semester: String(s.semester ?? "—"),
      section: s.section || "—",
      status: s.status || "active",
      batch: s.batch || "—",
      admissionYear: s.admissionYear || "—",
    }));

    requestLogger.info({ count: data.length }, "Students fetched successfully");

    return NextResponse.json(
      {
        success: true,
        message: "Student data fetched",
        data,
        stats: {
          totalStudent,
          activeStudent,
          graduated: graduatedStudents,
          newEnrollement,
        },
      },
      { status: 200 },
    );
  } catch (error: any) {
    requestLogger.error({ err: error }, "Failed to fetch students");
    return NextResponse.json(
      {
        success: false,
        message: "Error in fetching the data",
      },
      { status: 500 },
    );
  }
}
