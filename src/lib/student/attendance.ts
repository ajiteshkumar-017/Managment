import mongoose from "mongoose";
import { Class } from "@/models/class.model";
import { Subject } from "@/models/subject.model";
import { User } from "@/models/user";
import { AttendanceSession } from "@/models/attendanceSession";
import { AttendanceRecord } from "@/models/attendance.model";
import { formatTimeRange12h, formatTo12Hour } from "@/lib/faculty/time";
import {
  getWeekdayName,
  isClassCompleted,
  isClassOngoing,
  timeToMinutes,
} from "@/lib/faculty/helpers";

type PopulatedSubject = {
  _id?: unknown;
  subjectName?: string;
  subjectCode?: string;
  totalClasses?: number;
} | null;

type PopulatedFaculty = {
  username?: string;
} | null;

type StudentClass = {
  _id: mongoose.Types.ObjectId;
  day: string;
  startTime: string;
  endTime: string;
  room?: string;
  department?: string;
  semester?: number;
  section?: string;
  subjectId: mongoose.Types.ObjectId | PopulatedSubject;
  facultyId: mongoose.Types.ObjectId | PopulatedFaculty;
};

export function attendancePct(present: number, total: number) {
  return total > 0 ? Math.round((present / total) * 100) : 0;
}

export function attendanceBand(percentage: number) {
  if (percentage >= 85) return "Excellent";
  if (percentage >= 75) return "Good";
  if (percentage >= 65) return "Average";
  return "Low";
}

export function recordOwnerIds(
  studentId: mongoose.Types.ObjectId | string,
  userId: mongoose.Types.ObjectId | string,
) {
  return [studentId, userId];
}

export async function findStudentClasses(student: {
  department?: string;
  semester?: number;
  section?: string;
}) {
  const filter: Record<string, unknown> = {
    department: student.department,
    semester: student.semester,
  };
  if (student.section) filter.section = student.section;

  return Class.find(filter)
    .populate({
      path: "subjectId",
      model: Subject,
      select: "subjectName subjectCode totalClasses",
    })
    .populate({ path: "facultyId", model: User, select: "username" })
    .sort({ day: 1, startTime: 1 })
    .lean<StudentClass[]>();
}

function subjectOf(cls: StudentClass) {
  const subject =
    cls.subjectId && typeof cls.subjectId === "object"
      ? (cls.subjectId as PopulatedSubject)
      : null;
  return {
    id: subject?._id ? String(subject._id) : String(cls.subjectId || ""),
    name: subject?.subjectName || "Subject",
    code: subject?.subjectCode || "—",
    totalClasses: subject?.totalClasses || 0,
  };
}

function facultyOf(cls: StudentClass) {
  const faculty =
    cls.facultyId && typeof cls.facultyId === "object"
      ? (cls.facultyId as PopulatedFaculty)
      : null;
  return faculty?.username || "Faculty";
}

function classHours(startTime: string, endTime: string) {
  const minutes = Math.max(0, timeToMinutes(endTime) - timeToMinutes(startTime));
  return Math.max(0.5, minutes / 60);
}

function startOfWeekSunday(now = new Date()) {
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay());
  start.setHours(0, 0, 0, 0);
  return start;
}

export async function getStudentAttendanceData(opts: {
  studentId: mongoose.Types.ObjectId | string;
  userId: mongoose.Types.ObjectId | string;
  student: {
    department?: string;
    semester?: number;
    section?: string;
  };
}) {
  const classes = await findStudentClasses(opts.student);
  const classIds = classes.map((cls) => cls._id);
  const classById = new Map(classes.map((cls) => [String(cls._id), cls]));

  const sessions = classIds.length
    ? await AttendanceSession.find({ classId: { $in: classIds } })
        .sort({ startedAt: -1 })
        .lean()
    : [];

  const now = new Date();
  const expiredIds = sessions
    .filter((s) => s.isActive && s.expiryTime < now)
    .map((s) => s._id);

  if (expiredIds.length) {
    await AttendanceSession.updateMany(
      { _id: { $in: expiredIds } },
      { $set: { isActive: false, status: "expired" } },
    );
  }

  const records = await AttendanceRecord.find({
    studentId: { $in: recordOwnerIds(opts.studentId, opts.userId) },
    sessionId: { $in: sessions.map((s) => s._id) },
  }).lean();

  const presentSessionIds = new Set(records.map((r) => String(r.sessionId)));
  const recordBySession = new Map(records.map((r) => [String(r.sessionId), r]));

  const totalSessions = sessions.length;
  const attended = sessions.filter((s) => presentSessionIds.has(String(s._id))).length;
  const absent = Math.max(0, totalSessions - attended);
  const percentage = attendancePct(attended, totalSessions);

  const subjectAgg = new Map<
    string,
    { name: string; faculty: string; held: number; present: number }
  >();

  for (const session of sessions) {
    const cls = classById.get(String(session.classId));
    if (!cls) continue;
    const subject = subjectOf(cls);
    const key = subject.id || subject.name;
    const row = subjectAgg.get(key) || {
      name: subject.name,
      faculty: facultyOf(cls),
      held: 0,
      present: 0,
    };
    row.held += 1;
    if (presentSessionIds.has(String(session._id))) row.present += 1;
    subjectAgg.set(key, row);
  }

  const subjects = Array.from(subjectAgg.values()).map((row) => {
    const attendance = attendancePct(row.present, row.held);
    return {
      subject: row.name,
      faculty: row.faculty,
      attendance: `${attendance}%`,
      percentage: attendance,
      present: row.present,
      held: row.held,
      status: attendanceBand(attendance),
    };
  });

  const todayName = getWeekdayName();
  const todayClasses = classes
    .filter((cls) => cls.day === todayName)
    .map((cls) => {
      const ongoing = isClassOngoing(cls.startTime, cls.endTime);
      const completed = isClassCompleted(cls.endTime);
      return {
        heading: subjectOf(cls).name,
        faculty: facultyOf(cls),
        time: formatTo12Hour(cls.startTime),
        status: ongoing ? "ongoing" : completed ? "completed" : "upcoming",
      };
    });

  const recordsTable = sessions.slice(0, 20).map((session) => {
    const cls = classById.get(String(session.classId));
    const rec = recordBySession.get(String(session._id));
    const present = Boolean(rec);
    const when = rec?.markedAt || session.startedAt;
    return {
      date: new Date(when).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      subject: cls ? subjectOf(cls).name : "Class",
      faculty: cls ? facultyOf(cls) : "Faculty",
      status: present ? "present" : "absent",
      method: present
        ? rec?.method === "qr"
          ? "QR Code"
          : "Code"
        : "—",
      time: new Date(when).toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
      }),
    };
  });

  const live = sessions.find(
    (s) =>
      (s.status === "active" || s.isActive) &&
      s.expiryTime >= now &&
      !presentSessionIds.has(String(s._id)),
  );
  const liveClass = live ? classById.get(String(live.classId)) : null;
  const liveSession = live && liveClass
    ? {
        subjectName: subjectOf(liveClass).name,
        facultyName: facultyOf(liveClass),
        timeRange: formatTimeRange12h(liveClass.startTime, liveClass.endTime),
        expiryTime: live.expiryTime,
        sessionCode: live.sessionCode,
      }
    : null;

  const lowest = [...subjects].sort((a, b) => a.percentage - b.percentage)[0];
  const lowAttendance =
    lowest && lowest.percentage < 75
      ? { label: lowest.subject, percentage: lowest.percentage }
      : percentage < 75 && totalSessions > 0
        ? { label: opts.student.department || "this semester", percentage }
        : null;

  const uniqueSubjects = new Map<string, number>();
  for (const cls of classes) {
    const subject = subjectOf(cls);
    if (!uniqueSubjects.has(subject.id || subject.name)) {
      uniqueSubjects.set(subject.id || subject.name, subject.totalClasses);
    }
  }
  const planned = Array.from(uniqueSubjects.values()).reduce((sum, n) => sum + n, 0);
  const courseProgress =
    planned > 0 ? Math.min(100, Math.round((totalSessions / planned) * 100)) : 0;

  const weekStart = startOfWeekSunday(now);
  const weekdayHours = [
    { day: "S", hours: 0 },
    { day: "M", hours: 0 },
    { day: "T", hours: 0 },
    { day: "W", hours: 0 },
    { day: "T", hours: 0 },
    { day: "F", hours: 0 },
    { day: "S", hours: 0 },
  ];
  for (const session of sessions) {
    if (!presentSessionIds.has(String(session._id))) continue;
    const started = new Date(session.startedAt);
    if (started < weekStart) continue;
    const cls = classById.get(String(session.classId));
    const hours = cls ? classHours(cls.startTime, cls.endTime) : 1;
    weekdayHours[started.getDay()].hours += Number(hours.toFixed(1));
  }
  weekdayHours.forEach((row) => {
    row.hours = Number(row.hours.toFixed(1));
  });

  return {
    summary: {
      totalSessions,
      attended,
      absent,
      percentage,
    },
    pie: [
      {
        name: "Present",
        value: attended,
        percentage: `${percentage}%`,
        color: "#6366F1",
      },
      {
        name: "Absent",
        value: absent,
        percentage: `${attendancePct(absent, totalSessions)}%`,
        color: "#F59E0B",
      },
    ],
    subjects,
    todayClasses,
    records: recordsTable,
    liveSession,
    lowAttendance,
    weekdayHours,
    courseProgress,
    subjectCount: uniqueSubjects.size,
    completedToday: todayClasses.filter((c) => c.status === "completed").length,
    classesToday: todayClasses.length,
  };
}
