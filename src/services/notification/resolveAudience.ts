import mongoose, { Types } from "mongoose";
import { createRequestLogger } from "@/lib/requestLogger";
import { User } from "@/models/user";
import { Student } from "@/models/student.model";
import { Faculty } from "@/models/faculty.model";
import { Class } from "@/models/class.model";
import { ClassEnrollement } from "@/models/classEnrollement";
import type { NotificationAudience } from "./notification.types";

type IdLike = Types.ObjectId | string;

function toObjectId(id: IdLike) {
  return typeof id === "string" ? new Types.ObjectId(id) : id;
}

function uniqueUserIds(ids: Array<IdLike | null | undefined>) {
  const seen = new Set<string>();
  const result: Types.ObjectId[] = [];
  for (const id of ids) {
    if (!id) continue;
    const key = String(id);
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(toObjectId(id));
  }
  return result;
}

async function userIdsByRole(role: "student" | "faculty" | "admin") {
  const users = await User.find({ role }).select("_id").lean();
  return uniqueUserIds(users.map((u) => u._id));
}

/** Students of this class only (not faculty). Uses enrollments, else dept/sem/section/batch. */
export async function resolveClassStudentUserIds(classId: IdLike) {
  const id = toObjectId(classId);
  const cls = await Class.findById(id)
    .select("facultyId department semester section batch")
    .lean();
  if (!cls) return [];

  const enrollments = await ClassEnrollement.find({
    classId: id,
    status: "enrolled",
  })
    .select("studentId")
    .lean();

  const studentDocs =
    enrollments.length > 0
      ? await Student.find({
          _id: { $in: enrollments.map((e) => e.studentId) },
        })
          .select("userId")
          .lean()
      : await Student.find({
          department: cls.department,
          semester: cls.semester,
          section: cls.section,
          ...(cls.batch ? { batch: cls.batch } : {}),
        } as Record<string, unknown>)
          .select("userId")
          .lean();

  return uniqueUserIds(studentDocs.map((s) => s.userId));
}

async function resolveClassUserIds(classId: Types.ObjectId) {
  const cls = await Class.findById(classId).select("facultyId").lean();
  const studentIds = await resolveClassStudentUserIds(classId);
  return uniqueUserIds([cls?.facultyId, ...studentIds]);
}

/**
 * Expand an audience + target into User ids for notification receipts.
 * - user: targetId is a User _id
 * - class: targetId is a Class _id (enrolled students + class faculty)
 * - student / faculty: targetId is that profile _id; falls back to every user in the role
 * - admin: targetId is a User _id if that user is admin; otherwise every admin
 * - all: every user (targetId ignored)
 */
export async function resolveAudience(
  audienceType: NotificationAudience,
  targetId: IdLike,
) {
  const logger = createRequestLogger({ audienceType, targetId: String(targetId) });

  try {
    if (!mongoose.isValidObjectId(targetId) && audienceType !== "all") {
      logger.warn("Invalid targetId for audience resolution");
      return [];
    }

    const id = audienceType === "all" ? null : toObjectId(targetId);
    let userIds: Types.ObjectId[] = [];

    switch (audienceType) {
      case "user": {
        userIds = uniqueUserIds([id]);
        break;
      }
      case "class": {
        userIds = await resolveClassUserIds(id!);
        break;
      }
      case "student": {
        const student = await Student.findById(id).select("userId").lean();
        userIds = student?.userId
          ? uniqueUserIds([student.userId])
          : await userIdsByRole("student");
        break;
      }
      case "faculty": {
        const faculty = await Faculty.findById(id).select("userId").lean();
        userIds = faculty?.userId
          ? uniqueUserIds([faculty.userId])
          : await userIdsByRole("faculty");
        break;
      }
      case "admin": {
        const admin = await User.findOne({ _id: id, role: "admin" })
          .select("_id")
          .lean();
        userIds = admin?._id
          ? uniqueUserIds([admin._id])
          : await userIdsByRole("admin");
        break;
      }
      case "all": {
        const users = await User.find().select("_id").lean();
        userIds = uniqueUserIds(users.map((u) => u._id));
        break;
      }
      default: {
        logger.warn({ audienceType }, "Unknown audience type");
        return [];
      }
    }

    logger.info({ count: userIds.length }, "Resolved notification audience");
    return userIds;
  } catch (err) {
    logger.error({ err }, "Failed to resolve notification audience");
    throw err;
  }
}
