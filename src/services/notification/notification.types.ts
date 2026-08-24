import type { Types } from "mongoose";

export const NOTIFICATION_ROLES = ["student", "faculty", "admin"] as const;
export type NotificationRole = (typeof NOTIFICATION_ROLES)[number];

export const STUDENT_NOTIFICATION_KINDS = [
  "assignment_published",
  "assignment_due",
  "attendance_marked",
  "low_attendance",
  "result_published",
  "notice",
  "timetable_updated",
  "message",
] as const;
export type StudentNotificationKind =
  (typeof STUDENT_NOTIFICATION_KINDS)[number];

export const FACULTY_NOTIFICATION_KINDS = [
  "assignment_submitted",
  "attendance_session",
  "class_assigned",
  "result_pending",
  "notice",
  "leave_status",
] as const;
export type FacultyNotificationKind =
  (typeof FACULTY_NOTIFICATION_KINDS)[number];

export const ADMIN_NOTIFICATION_KINDS = [
  "enrollment",
  "attendance_alert",
  "result_published",
  "notice_update",
  "faculty_leave",
  "academic_action",
] as const;
export type AdminNotificationKind = (typeof ADMIN_NOTIFICATION_KINDS)[number];

export type NotificationKind =
  | StudentNotificationKind
  | FacultyNotificationKind
  | AdminNotificationKind;

export const NOTIFICATION_AUDIENCES = [
  "user",
  "class",
  "student",
  "faculty",
  "admin",
  "all",
] as const;
export type NotificationAudience = (typeof NOTIFICATION_AUDIENCES)[number];

type NotificationBase = {
  recipientId: Types.ObjectId | string;
  title: string;
  message: string;
  link?: string;
  isRead?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export type StudentNotification = NotificationBase & {
  role: "student";
  kind: StudentNotificationKind;
};

export type FacultyNotification = NotificationBase & {
  role: "faculty";
  kind: FacultyNotificationKind;
};

export type AdminNotification = NotificationBase & {
  role: "admin";
  kind: AdminNotificationKind;
};

export type AppNotification =
  | StudentNotification
  | FacultyNotification
  | AdminNotification;
