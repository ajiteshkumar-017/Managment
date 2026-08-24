import { Types } from "mongoose";
import { createRequestLogger } from "@/lib/requestLogger";
import { Student } from "@/models/student.model";
import { Class } from "@/models/class.model";
import { User } from "@/models/user";
import { createNotification } from "./createNotification";
import { resolveClassStudentUserIds } from "./resolveAudience";
import type { NoticeAudienceDb } from "@/constant/notice";
import { notificationRolesForAudience } from "@/lib/notices/audience";
import type { StudentNotificationKind } from "./notification.types";
import type { AdminNotificationKind, FacultyNotificationKind } from "@/types/notification";

type IdLike = Types.ObjectId | string;

function uniqueUserIds(ids: Array<IdLike | null | undefined>) {
  const seen = new Set<string>();
  const result: Types.ObjectId[] = [];
  for (const id of ids) {
    if (!id) continue;
    const key = String(id);
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(typeof id === "string" ? new Types.ObjectId(id) : id);
  }
  return result;
}

function formatDue(dueDate: Date) {
  return dueDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

async function studentUserIdsByCohort(opts: {
  department: string;
  semester: number | string;
  batch?: string;
  section?: string;
}) {
  const filter: Record<string, unknown> = {
    department: opts.department,
    semester: Number(opts.semester),
  };
  if (opts.batch) filter.batch = opts.batch;
  if (opts.section) filter.section = opts.section;

  const students = await Student.find(filter).select("userId").lean();
  return uniqueUserIds(students.map((s) => s.userId));
}

/**
 * Create an inbox item without failing the calling API.
 */
async function safeNotify(input: Parameters<typeof createNotification>[0]) {
  const logger = createRequestLogger();
  try {
    await createNotification(input);
  } catch (err) {
    logger.error({ err, kind: input.kind }, "Failed to emit notification");
  }
}

export async function notifyAssignmentPublished(opts: {
  classId?: IdLike;
  department: string;
  semester: number | string;
  batch?: string;
  section?: string;
  title: string;
  dueDate: Date;
}) {
  const userIds =
    opts.classId && Types.ObjectId.isValid(String(opts.classId))
      ? await resolveClassStudentUserIds(opts.classId)
      : await studentUserIdsByCohort(opts);
  if (userIds.length === 0) return;

  const classId =
    opts.classId && Types.ObjectId.isValid(String(opts.classId))
      ? opts.classId
      : (await Class.findOne({
          department: opts.department,
          semester: Number(opts.semester),
          ...(opts.batch ? { batch: opts.batch } : {}),
          ...(opts.section ? { section: opts.section } : {}),
        })
          .select("_id")
          .lean())?._id;

  await safeNotify({
    kind: "assignment_published" satisfies StudentNotificationKind,
    title: "New assignment published",
    message: `${opts.title} is now available. Due ${formatDue(opts.dueDate)}.`,
    link: "/assignments",
    audience: classId ? "class" : "user",
    targetId: classId ?? userIds[0],
    recipientUserIds: userIds,
  });
}

export async function notifyAttendanceMarked(opts: {
  userId: IdLike;
  classCode?: string;
  room?: string;
}) {
  const label = opts.classCode || opts.room || "class";
  await safeNotify({
    kind: "attendance_marked" satisfies StudentNotificationKind,
    title: "Attendance recorded",
    message: `You were marked present for ${label}.`,
    link: "/attendance",
    audience: "user",
    targetId: opts.userId,
  });
}

export async function notifyResultPublished(opts: {
  classId?: IdLike;
  department: string;
  semester: number | string;
  batch?: string;
  exam?: string;
  subjectCode?: string;
}) {
  const userIds = await studentUserIdsByCohort(opts);
  if (userIds.length === 0) return;

  const examLabel = [opts.department, `Sem ${opts.semester}`, opts.subjectCode, opts.exam]
    .filter(Boolean)
    .join(" ");

  const classId =
    opts.classId && Types.ObjectId.isValid(String(opts.classId))
      ? opts.classId
      : (await Class.findOne({
          department: opts.department,
          semester: Number(opts.semester),
          ...(opts.batch ? { batch: opts.batch } : {}),
        })
          .select("_id")
          .lean())?._id;

  await safeNotify({
    kind: "result_published" satisfies StudentNotificationKind,
    title: "Results published",
    message: `${examLabel} results are now available.`,
    link: "/result",
    audience: classId ? "class" : "user",
    targetId: classId ?? userIds[0],
    recipientUserIds: userIds,
  });
}

/**
 * Fan out a notice only to the selected audience roles.
 * Recipients are resolved from User.role in the database — never from the client.
 */
export async function notifyNoticePublished(opts: {
  title: string;
  description: string;
  audience: NoticeAudienceDb;
}) {
  const logger = createRequestLogger();
  try {
    const roles = notificationRolesForAudience(opts.audience);
    const message =
      opts.description.length > 180
        ? `${opts.description.slice(0, 177).trimEnd()}...`
        : opts.description;

    for (const role of roles) {
      const users = await User.find({ role }).select("_id").lean();
      const recipientUserIds = uniqueUserIds(users.map((user) => user._id));
      if (recipientUserIds.length === 0) continue;

      const kind =
        role === "admin"
          ? ("notice_update" satisfies AdminNotificationKind)
          : ("notice" satisfies StudentNotificationKind | FacultyNotificationKind);

      const link =
        role === "student"
          ? "/messages"
          : role === "faculty"
            ? "/faculty/dashboard"
            : "/admin/notices";

      await safeNotify({
        kind,
        title: opts.title,
        message,
        link,
        audience: role,
        targetId: recipientUserIds[0],
        recipientUserIds,
      });
    }
  } catch (err) {
    logger.error({ err, audience: opts.audience }, "Failed to notify notice audience");
  }
}
