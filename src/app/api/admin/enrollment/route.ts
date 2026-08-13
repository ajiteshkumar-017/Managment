import Connect from "@/dbConnect/connect";
import { ClassEnrollement } from "@/models/classEnrollement";
import { Class } from "@/models/class.model";
import { Subject } from "@/models/subject.model";
import { User } from "@/models/user";
import { Student } from "@/models/student.model";
import { NextResponse } from "next/server";
import { createRequestLogger } from "@/lib/requestLogger";

export async function GET() {
  const requestLogger = createRequestLogger();
  try {
    await Connect();

    const enrollments = await ClassEnrollement.find()
      .populate({
        path: "studentId",
        model: Student,
        populate: { path: "userId", model: User, select: "username email" },
      })
      .populate({
        path: "classId",
        model: Class,
        populate: {
          path: "subjectId",
          model: Subject,
          select: "subjectCode subjectName department semester",
        },
      })
      .sort({ enrolledAt: -1 })
      .lean();

    const data = enrollments.map((e: any) => {
      const cls = e.classId;
      const subject = cls?.subjectId;
      const student = e.studentId;
      const user = student?.userId;
      const active = e.status === "enrolled";

      return {
        _id: e._id,
        rollNo: student?.rollNumber || "—",
        studentName: user?.username || "—",
        email: user?.email || "",
        classCode: cls?.classCode || "—",
        room: cls?.room || "—",
        subjectCode: subject?.subjectCode || "—",
        subjectName: subject?.subjectName || "—",
        department: subject?.department || "—",
        semester: String(subject?.semester ?? "—"),
        enrolledAt: e.enrolledAt ? formatDate(e.enrolledAt) : "—",
        status: active ? "Active" : "Withdrawn",
      };
    });

    const stats = {
      total: data.length,
      active: data.filter((d) => d.status === "Active").length,
      withdrawn: data.filter((d) => d.status === "Withdrawn").length,
      departments: new Set(data.map((d) => d.department)).size,
    };

    requestLogger.info({ count: data.length }, "Enrollments fetched successfully");

    return NextResponse.json({ success: true, data, stats });
  } catch (error) {
    requestLogger.error({ err: error }, "Failed to fetch enrollments");
    return NextResponse.json(
      { success: false, message: "Failed to fetch enrollments" },
      { status: 500 },
    );
  }
}

function formatDate(value: Date | string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
