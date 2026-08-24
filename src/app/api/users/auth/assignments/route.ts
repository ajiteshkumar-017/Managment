import { NextRequest, NextResponse } from "next/server";
import Connect from "@/dbConnect/connect";
import { getUser } from "@/lib/getUser";
import { createRequestLogger } from "@/lib/requestLogger";
import { User } from "@/models/user";
import { Student } from "@/models/student.model";
import { Faculty } from "@/models/faculty.model";
import { Subject } from "@/models/subject.model";
import { Assignment } from "@/models/assignment";
import { assignmentFilterForStudent } from "@/lib/assignmentAudience";

function dueStatus(dueDate: Date) {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfDue = new Date(
    dueDate.getFullYear(),
    dueDate.getMonth(),
    dueDate.getDate(),
  );
  if (startOfDue < startOfToday) return "overdue";
  if (startOfDue.getTime() === startOfToday.getTime()) return "due_today";
  return "upcoming";
}

export async function GET(_request: NextRequest) {
  const logger = createRequestLogger();

  try {
    await Connect();

    const { email, role } = await getUser();
    if (!email) {
      logger.warn({ reason: "missing_email" }, "Student assignments unauthorized");
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

    const filter = assignmentFilterForStudent(student);

    const assignments = await Assignment.find(filter)
      .populate({
        path: "subjectId",
        model: Subject,
        select: "subjectName subjectCode",
      })
      .populate({
        path: "facultyId",
        model: Faculty,
        select: "userId designation",
        populate: { path: "userId", model: User, select: "username" },
      })
      .sort({ dueDate: 1 })
      .lean();

    const data = assignments.map((a) => {
      const subject = a.subjectId as {
        subjectName?: string;
        subjectCode?: string;
      } | null;
      const faculty = a.facultyId as {
        designation?: string;
        userId?: { username?: string } | string | null;
      } | null;
      const facultyUser = faculty?.userId;
      const facultyName =
        typeof facultyUser === "object" && facultyUser?.username
          ? facultyUser.username
          : "Faculty";
      const attachment =
        a.attachement && a.attachement !== "—" ? a.attachement : "";

      return {
        id: String(a._id),
        title: a.title,
        description: a.description,
        dueDate: a.dueDate,
        marks: a.marks,
        department: a.department,
        semester: a.semester,
        batch: a.batch,
        section: a.section || "",
        attachement: attachment,
        subjectName: subject?.subjectName || "Subject",
        subjectCode: subject?.subjectCode || "—",
        facultyName,
        dueStatus: dueStatus(new Date(a.dueDate)),
      };
    });

    logger.info(
      { userId: user._id, count: data.length },
      "Student assignments fetched",
    );

    return NextResponse.json({ success: true, data });
  } catch (error) {
    logger.error({ err: error }, "Student assignments failed");
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
