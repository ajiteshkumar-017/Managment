import Connect from "@/dbConnect/connect";
import { User } from "@/models/user";
import { Student } from "@/models/student.model";
import { Faculty } from "@/models/faculty.model";
import { ClassEnrollement } from "@/models/classEnrollement";
import { Class } from "@/models/class.model";
import { Notification } from "@/models/notification.model";
import { NotificationAudienceModel } from "@/models/notificationAudience.model";
import NotificationReceipant from "@/models/notificationReceipant.model";
import { createNotification } from "@/services/notification/createNotification";
import type { CreateNotificationInput } from "@/services/notification/createNotification";
import type { Types } from "mongoose";

const STUDENT_EMAIL = "ajiteshk007@gmail.com";
const FACULTY_EMAIL = "maya.patel@test.edu";
const ADMIN_EMAIL = "ajiteshk017@gmail.com";

export type SeedNotificationContext = {
  studentUserId: Types.ObjectId | string;
  facultyUserId: Types.ObjectId | string;
  adminUserId: Types.ObjectId | string;
  studentProfileId: Types.ObjectId | string;
  facultyProfileId: Types.ObjectId | string;
  classId: Types.ObjectId | string;
};

function seedPayloads(
  ctx: SeedNotificationContext,
): CreateNotificationInput[] {
  return [
    {
      kind: "assignment_published",
      title: "New assignment published",
      message:
        "Data Structures Lab Assignment 3 is now available. Due this Friday.",
      link: "/assignments",
      audience: "user",
      targetId: ctx.studentUserId,
    },
    {
      kind: "assignment_due",
      title: "Assignment due tomorrow",
      message: "Submit Applied Project Assignment 2 before 11:59 PM.",
      link: "/assignments",
      audience: "class",
      targetId: ctx.classId,
    },
    {
      kind: "attendance_marked",
      title: "Attendance recorded",
      message: "You were marked present for CSE Core Concepts (Monday 09:00).",
      link: "/attendance",
      audience: "user",
      targetId: ctx.studentUserId,
    },
    {
      kind: "low_attendance",
      title: "Attendance below 75%",
      message:
        "Your attendance in CSE Laboratory Practice is 68%. Attend upcoming classes.",
      link: "/attendance",
      audience: "user",
      targetId: ctx.studentUserId,
    },
    {
      kind: "result_published",
      title: "Semester results published",
      message: "CSE Sem 5 End Sem 2025-26 results are now available.",
      link: "/result",
      audience: "student",
      targetId: ctx.studentProfileId,
    },
    {
      kind: "timetable_updated",
      title: "Timetable updated",
      message: "CSE semester 5 section A timetable changed for Thursday.",
      link: "/timetable",
      audience: "class",
      targetId: ctx.classId,
    },
    {
      kind: "notice",
      title: "Holiday notice",
      message: "The campus will remain closed on Friday for Independence Day.",
      link: "/dashboard",
      audience: "all",
      targetId: ctx.adminUserId,
    },
    {
      kind: "message",
      title: "Message from faculty",
      message: "Please bring your lab records for tomorrow's practical.",
      link: "/messages",
      audience: "user",
      targetId: ctx.studentUserId,
    },
    {
      kind: "assignment_submitted",
      title: "New submission received",
      message: "Ajitesh Kumar submitted Data Structures Lab Assignment 3.",
      link: "/faculty/assignments",
      audience: "faculty",
      targetId: ctx.facultyProfileId,
    },
    {
      kind: "attendance_session",
      title: "Attendance session started",
      message: "An attendance session is live for CSE Core Concepts, room CSE-51.",
      link: "/faculty/dashboard",
      audience: "user",
      targetId: ctx.facultyUserId,
    },
    {
      kind: "class_assigned",
      title: "New class assigned",
      message: "You have been assigned CSE Applied Project, semester 5 section A.",
      link: "/faculty/classes",
      audience: "faculty",
      targetId: ctx.facultyProfileId,
    },
    {
      kind: "enrollment",
      title: "New student enrollment",
      message: "Riya Sharma was enrolled in CSE semester 7 section B.",
      link: "/admin/dashboard",
      audience: "admin",
      targetId: ctx.adminUserId,
    },
    {
      kind: "attendance_alert",
      title: "Low attendance alert",
      message: "12 students in CSE semester 5 have attendance below 75%.",
      link: "/admin/attendance",
      audience: "admin",
      targetId: ctx.adminUserId,
    },
    {
      kind: "academic_action",
      title: "Semester activation",
      message: "CSE semester 5 (2025-2026) was marked as the active semester.",
      link: "/admin/academicManagment",
      audience: "admin",
      targetId: ctx.adminUserId,
    },
  ];
}

async function loadContextFromDb(): Promise<SeedNotificationContext> {
  const [studentUser, facultyUser, adminUser] = await Promise.all([
    User.findOne({ email: STUDENT_EMAIL }).select("_id").lean(),
    User.findOne({ email: FACULTY_EMAIL }).select("_id").lean(),
    User.findOne({ email: ADMIN_EMAIL }).select("_id").lean(),
  ]);

  if (!studentUser || !facultyUser || !adminUser) {
    throw new Error(
      "Seed users missing. Run GET /api/seed first, then seed notifications.",
    );
  }

  const [student, faculty] = await Promise.all([
    Student.findOne({ userId: studentUser._id }).select("_id").lean(),
    Faculty.findOne({ userId: facultyUser._id }).select("_id").lean(),
  ]);

  if (!student || !faculty) {
    throw new Error(
      "Seed student/faculty profiles missing. Run GET /api/seed first.",
    );
  }

  const enrollment = await ClassEnrollement.findOne({
    studentId: student._id,
    status: "enrolled",
  })
    .select("classId")
    .lean();

  const classDoc =
    enrollment ??
    (await Class.findOne({
      department: "CSE",
      semester: 5,
      section: "A",
    })
      .select("_id")
      .lean());

  const classId = enrollment?.classId ?? classDoc?._id;
  if (!classId) {
    throw new Error("No CSE class found to seed class-audience notifications.");
  }

  return {
    studentUserId: studentUser._id,
    facultyUserId: facultyUser._id,
    adminUserId: adminUser._id,
    studentProfileId: student._id,
    facultyProfileId: faculty._id,
    classId,
  };
}

export async function clearNotifications() {
  await NotificationReceipant.deleteMany({});
  await NotificationAudienceModel.deleteMany({});
  await Notification.deleteMany({});
}

export async function seedNotifications(context?: SeedNotificationContext) {
  await Connect();
  await clearNotifications();

  const ctx = context ?? (await loadContextFromDb());
  const payloads = seedPayloads(ctx);
  const created = [];

  for (const payload of payloads) {
    created.push(await createNotification(payload));
  }

  const firstStudentReceipt = await NotificationReceipant.findOne({
    userId: ctx.studentUserId,
  }).sort({ createdAt: 1 });

  if (firstStudentReceipt) {
    firstStudentReceipt.isRead = true;
    firstStudentReceipt.readAt = new Date();
    await firstStudentReceipt.save();
  }

  const [receiptCount, audienceCount] = await Promise.all([
    NotificationReceipant.countDocuments(),
    NotificationAudienceModel.countDocuments(),
  ]);

  return {
    notifications: created.map((n) => ({
      id: String(n._id),
      kind: n.kind,
      title: n.title,
    })),
    notificationCount: created.length,
    receiptCount,
    audienceCount,
    targets: {
      studentEmail: STUDENT_EMAIL,
      facultyEmail: FACULTY_EMAIL,
      adminEmail: ADMIN_EMAIL,
    },
  };
}
