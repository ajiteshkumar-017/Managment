import { NextResponse, NextRequest } from "next/server";
import Connect from "@/dbConnect/connect";
import { User } from "@/models/user";
import { Subject } from "@/models/subject.model";
import { Class } from "@/models/class.model";
import { Student } from "@/models";
import { getUser } from "@/lib/getUser";
import { createRequestLogger } from "@/lib/requestLogger";

export async function GET(_request: NextRequest) {
  const requestLogger = createRequestLogger();
  try {
    await Connect();

    const { email } = await getUser();

    if (!email) {
      requestLogger.warn({ reason: "missing_email" }, "Course unauthorized");
      return NextResponse.json(
        { success: false, message: "Email not found in token" },
        { status: 401 },
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      requestLogger.warn({ reason: "user_not_found", email }, "Course user not found");
      return NextResponse.json(
        { success: false, message: "No User found." },
        { status: 404 },
      );
    }

    const student = await Student.findOne({ userId: user._id });
    if (!student) {
      requestLogger.warn(
        { reason: "student_not_found", userId: user._id },
        "Course student not found",
      );
      return NextResponse.json(
        { success: false, message: "No Student found." },
        { status: 404 },
      );
    }

    const subjects = await Subject.find({
      department: student.department,
      semester: student.semester,
      status: "active",
    }).lean();  

    const subjectIds = subjects.map((s) => s._id);

    const classes = await Class.find({ subjectId: { $in: subjectIds } })
      .populate({ path: "facultyId", model: User, select: "username" })
      .lean();

    const facultyBySubjectId = new Map<string, string>();
    for (const cls of classes) {
      const subjectKey = String(cls.subjectId);
      if (facultyBySubjectId.has(subjectKey)) continue;
      const faculty = cls.facultyId as { username?: string } | null;
      if (faculty?.username) {
        facultyBySubjectId.set(subjectKey, faculty.username);
      }
    }

    const tableData = subjects.map((subject) => ({
      subjectCode: subject.subjectCode,
      subjectName: subject.subjectName,
      faculty: facultyBySubjectId.get(String(subject._id)) || "-",
      credits: subject.credits,
      totalClasses: subject.totalClasses ?? 0,
    }));

    requestLogger.info(
      {
        email,
        userId: user._id,
        department: student.department,
        semester: student.semester,
        courseCount: tableData.length,
      },
      "Course data fetched successfully",
    );

    return NextResponse.json(
      {
        success: true,
        message: "Data Send Successfully",
        tableData,
      },
      { status: 200 },
    );
  } catch (err: unknown) {
    requestLogger.error({ err }, "Course fetch failed");
    return NextResponse.json(
      {
        success: false,
        message: "Error in Course Backend",
      },
      { status: 500 },
    );
  }
}
