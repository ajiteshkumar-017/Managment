import Connect from "@/dbConnect/connect";
import { Enrollment } from "@/models/enrollement.model";
import { Class } from "@/models/class.model";
import { Subject } from "@/models/subject.model";
import { User } from "@/models/user";
import { Student } from "@/models/student.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await Connect();

    const enrollments = await Enrollment.find()
      .populate({ path: "studentId", model: User, select: "username email" })
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

    const students = await Student.find().lean();
    const rollByUserId = new Map(
      students.map((s: any) => [String(s.userId), s.rollNumber || "—"]),
    );

    const now = new Date();
    const data = enrollments.map((e: any) => {
      const cls = e.classId;
      const subject = cls?.subjectId;
      const exited = e.exitedAt ? new Date(e.exitedAt) : null;
      const active = !exited || exited > now;

      return {
        _id: e._id,
        rollNo: rollByUserId.get(String(e.studentId?._id || e.studentId)) || "—",
        studentName: e.studentId?.username || "—",
        email: e.studentId?.email || "",
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

    return NextResponse.json({ success: true, data, stats });
  } catch (error) {
    console.error("Error fetching enrollments", error);
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
