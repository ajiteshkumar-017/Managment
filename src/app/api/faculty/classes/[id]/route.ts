import { NextRequest, NextResponse } from "next/server";
import Connect from "@/dbConnect/connect";
import { verifyJwt } from "@/lib/verifyJwt";
import { createRequestLogger } from "@/lib/requestLogger";
import {
  getFacultyByUserId,
  mapClassToView,
  countStudentsForClass,
} from "@/lib/faculty/helpers";
import { Class } from "@/models/class.model";
import { Subject } from "@/models/subject.model";
import { User } from "@/models/user";
import { Student } from "@/models/student.model";
import { ClassEnrollement } from "@/models/classEnrollement";
import { AttendanceSession } from "@/models/attendanceSession";
import { AttendanceRecord } from "@/models/attendance.model";
import { Assignment } from "@/models/assignment";
import mongoose from "mongoose";
import { decodeResourceId } from "@/lib/idToken";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const logger = createRequestLogger();

  try {
    await Connect();

    const auth = await verifyJwt(request);
    if (auth.ok === false) return auth.response;

    const { _id: userId, role } = auth.payload;
    if (role !== "faculty" && role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 },
      );
    }

    const { id } = await context.params;
    const classId = await decodeResourceId(id, "class");
    if (!classId) {
      return NextResponse.json(
        { success: false, message: "Invalid class id" },
        { status: 400 },
      );
    }

    const cls = await Class.findById(classId)
      .populate({ path: "subjectId", model: Subject, select: "subjectName subjectCode" })
      .populate({ path: "facultyId", model: User, select: "username" })
      .lean();

    if (!cls) {
      return NextResponse.json(
        { success: false, message: "Class not found" },
        { status: 404 },
      );
    }

    if (role === "faculty") {
      const assignedId =
        typeof cls.facultyId === "object" && cls.facultyId && "_id" in cls.facultyId
          ? String((cls.facultyId as { _id: unknown })._id)
          : String(cls.facultyId);
      if (assignedId !== String(userId)) {
        return NextResponse.json(
          { success: false, message: "You are not assigned to this class" },
          { status: 403 },
        );
      }
    }

    const overview = await mapClassToView(cls as never);

    const enrollments = await ClassEnrollement.find({
      classId: cls._id,
      status: "enrolled",
    }).lean();
    let students: {
      id: string;
      name: string;
      rollNumber: string;
      email: string;
      status: string;
    }[] = [];

    if (enrollments.length > 0) {
      const studentIds = enrollments.map((e) => e.studentId);
      const studentRows = await Student.find({ _id: { $in: studentIds } })
        .populate({ path: "userId", model: User, select: "username email" })
        .lean();
      const studentMap = new Map(studentRows.map((s) => [String(s._id), s]));

      students = studentIds.map((sid) => {
        const s = studentMap.get(String(sid));
        const u = s?.userId as { username?: string; email?: string } | null;
        return {
          id: String(
            s?.userId && typeof s.userId === "object" && "_id" in s.userId
              ? (s.userId as { _id: unknown })._id
              : s?.userId || sid,
          ),
          name: u?.username || "Student",
          rollNumber: s?.rollNumber || "—",
          email: u?.email || "—",
          status: s?.status || "active",
        };
      });
    } else {
      const studentRows = await Student.find({
        department: cls.department,
        semester: cls.semester,
        section: cls.section,
      } as never)
        .populate({ path: "userId", model: User, select: "username email" })
        .lean();

      students = studentRows.map((s) => {
        const u = s.userId as { username?: string; email?: string; _id?: unknown } | null;
        return {
          id: String(u?._id || s.userId),
          name: u?.username || "Student",
          rollNumber: s.rollNumber || "—",
          email: u?.email || "—",
          status: s.status || "active",
        };
      });
    }

    const sessions = await AttendanceSession.find({ classId: cls._id })
      .sort({ startedAt: -1 })
      .limit(20)
      .lean();

    const sessionIds = sessions.map((s) => s._id);
    const records = sessionIds.length
      ? await AttendanceRecord.find({ sessionId: { $in: sessionIds } })
          .populate({ path: "studentId", model: User, select: "username" })
          .lean()
      : [];

    const recordsBySession = new Map<string, typeof records>();
    for (const rec of records) {
      const key = String(rec.sessionId);
      const list = recordsBySession.get(key) || [];
      list.push(rec);
      recordsBySession.set(key, list);
    }

    const presentStudentIds = records.map((r) => {
      const student = r.studentId as { _id?: unknown } | null;
      return String(student?._id || r.studentId);
    });

    const studentByUserId = new Map(
      (
        await Student.find({
          userId: { $in: presentStudentIds },
        } as never)
          .select("userId rollNumber")
          .lean()
      ).map((s) => [String(s.userId), s.rollNumber || "—"]),
    );

    const attendance = sessions.map((session) => {
      const present = (recordsBySession.get(String(session._id)) || []).map((rec) => {
        const student = rec.studentId as { username?: string; _id?: unknown } | null;
        const studentUserId = String(student?._id || rec.studentId);
        return {
          name: student?.username || "Student",
          rollNumber: studentByUserId.get(studentUserId) || "—",
          markedAt: rec.markedAt,
          method: rec.method,
        };
      });

      return {
        id: String(session._id),
        sessionCode: session.sessionCode,
        startedAt: session.startedAt,
        expiryTime: session.expiryTime,
        status: session.status,
        isActive: session.isActive,
        presentCount: present.length,
        present,
      };
    });

    const faculty = await getFacultyByUserId(String(userId));
    let assignments: {
      id: string;
      title: string;
      dueDate: Date;
      status: string;
      marks: number;
    }[] = [];

    if (faculty) {
      const subjectId =
        typeof cls.subjectId === "object" && cls.subjectId && "_id" in cls.subjectId
          ? (cls.subjectId as { _id: unknown })._id
          : cls.subjectId;

      const assignmentQuery: Record<string, unknown> = {
        facultyId: faculty._id,
        subjectId,
        department: cls.department,
        semester: cls.semester,
      };
      if (cls.batch) assignmentQuery.batch = cls.batch;
      if (cls.section) {
        assignmentQuery.$or = [
          { section: cls.section },
          { section: { $exists: false } },
          { section: null },
          { section: "" },
        ];
      }

      assignments = (
        await Assignment.find(assignmentQuery)
          .sort({ dueDate: -1 })
          .limit(20)
          .lean()
      ).map((a) => ({
        id: String(a._id),
        title: a.title,
        dueDate: a.dueDate,
        status: a.status,
        marks: a.marks,
      }));
    }

    const studentCount = await countStudentsForClass({
      _id: cls._id as mongoose.Types.ObjectId,
    });

    logger.info({ classId, students: students.length }, "Faculty class detail fetched");

    return NextResponse.json({
      success: true,
      data: {
        overview: { ...overview, studentCount },
        students,
        attendance,
        assignments,
        results: [],
      },
    });
  } catch (error) {
    logger.error({ err: error }, "Faculty class detail failed");
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
