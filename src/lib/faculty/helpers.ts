import { Faculty } from "@/models/faculty.model";
import { Class } from "@/models/class.model";
import { Subject } from "@/models/subject.model";
import { User } from "@/models/user";
import mongoose from "mongoose";
import { ClassEnrollement } from "@/models/classEnrollement";
import { encodeResourceId } from "@/lib/idToken";

export type FacultyClassView = {
  id: string;
  classCode: string;
  room: string;
  day: string;
  startTime: string;
  endTime: string;
  department: string;
  semester: number;
  section: string;
  batch: string;
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  studentCount: number;
  facultyName: string;
};

export function getWeekdayName(date = new Date()) {
  return date.toLocaleDateString("en-US", { weekday: "long" });
}

/** Parse "HH:mm" or "HH:mm AM/PM" into minutes since midnight. */
export function timeToMinutes(time: string) {
  const raw = time.trim();
  const ampm = raw.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (ampm) {
    let hours = Number(ampm[1]);
    const minutes = Number(ampm[2]);
    const period = ampm[3].toUpperCase();
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
    return hours * 60 + minutes;
  }

  const parts = raw.split(":");
  const hours = Number(parts[0]);
  const minutes = Number(parts[1] || 0);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return 0;
  return hours * 60 + minutes;
}

export function formatTimeRange(startTime: string, endTime: string) {
  return `${startTime} – ${endTime}`;
}

export function isClassCompleted(endTime: string, now = new Date()) {
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  return nowMinutes >= timeToMinutes(endTime);
}

export function isClassOngoing(startTime: string, endTime: string, now = new Date()) {
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);
  return nowMinutes >= start && nowMinutes < end;
}

export async function getFacultyByUserId(userId: string) {
  return Faculty.findOne({ userId });
}

export async function countStudentsForClass(cls: {
  _id: mongoose.Types.ObjectId;
}) {
  return ClassEnrollement.countDocuments({
    classId: cls._id,
    status: "enrolled",
  });
}

type PopulatedSubject = {
  subjectName?: string;
  subjectCode?: string;
} | null;

type PopulatedUser = {
  username?: string;
} | null;

export async function mapClassToView(
  cls: {
    _id: mongoose.Types.ObjectId;
    classCode: string;
    room?: string;
    day: string;
    startTime: string;
    endTime: string;
    department: string;
    semester: number;
    section: string;
    batch: string;
    subjectId: mongoose.Types.ObjectId | PopulatedSubject;
    facultyId: mongoose.Types.ObjectId | PopulatedUser;
  },
  facultyNameFallback = "Faculty",
): Promise<FacultyClassView> {
  const subject =
    cls.subjectId && typeof cls.subjectId === "object" && "subjectName" in cls.subjectId
      ? (cls.subjectId as PopulatedSubject)
      : null;

  let subjectName = subject?.subjectName || "Subject";
  let subjectCode = subject?.subjectCode || cls.classCode;

  if (!subject) {
    const sub = await Subject.findById(cls.subjectId)
      .select("subjectName subjectCode")
      .lean();
    if (sub) {
      subjectName = sub.subjectName;
      subjectCode = sub.subjectCode;
    }
  }

  const facultyUser =
    cls.facultyId && typeof cls.facultyId === "object" && "username" in cls.facultyId
      ? (cls.facultyId as PopulatedUser)
      : null;

  let facultyName = facultyUser?.username || facultyNameFallback;
  if (!facultyUser) {
    const user = await User.findById(cls.facultyId).select("username").lean();
    if (user?.username) facultyName = user.username;
  }

  const studentCount = await countStudentsForClass({
    _id: cls._id,
  });

  const subjectId =
    cls.subjectId && typeof cls.subjectId === "object" && "_id" in cls.subjectId
      ? String((cls.subjectId as { _id: unknown })._id)
      : String(cls.subjectId || "");

  return {
    id: await encodeResourceId(String(cls._id), "class"),
    classCode: cls.classCode,
    room: cls.room || "—",
    day: cls.day,
    startTime: cls.startTime,
    endTime: cls.endTime,
    department: cls.department,
    semester: cls.semester,
    section: cls.section,
    batch: cls.batch,
    subjectId,
    subjectName,
    subjectCode,
    studentCount,
    facultyName,
  };
}

export async function getFacultyClasses(userId: string) {
  const classes = await Class.find({ facultyId: userId })
    .populate({ path: "subjectId", model: Subject, select: "subjectName subjectCode" })
    .populate({ path: "facultyId", model: User, select: "username" })
    .sort({ day: 1, startTime: 1 })
    .lean();

  const user = await User.findById(userId).select("username").lean();
  const fallback = user?.username || "Faculty";

  return Promise.all(classes.map((cls) => mapClassToView(cls as never, fallback)));
}
