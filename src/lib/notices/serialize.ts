import type { NoticeAudienceUi, NoticeTopic } from "@/constant/notice";
import { toUiAudience, toUiTopic } from "@/lib/notices/audience";
import { formatNoticeDate, toIsoDate } from "@/lib/notices/parseDate";

export type NoticeStatus = "Active" | "Expired" | "Upcoming";

export type SerializedNotice = {
  _id: string;
  title: string;
  type: NoticeTopic;
  audience: NoticeAudienceUi;
  publishedDate: string;
  publishedDateIso: string;
  expiryDate: string;
  expiryDateIso: string;
  status: NoticeStatus;
  description: string;
  isImportant: boolean;
};

type NoticeDoc = {
  _id?: unknown;
  title?: string;
  type?: string;
  audience?: string;
  date?: Date | string;
  expiryDate?: Date | string | null;
  description?: string;
  IsImportant?: boolean;
};

export function noticeStatus(doc: NoticeDoc, now = new Date()): NoticeStatus {
  const expiry = doc.expiryDate ? new Date(doc.expiryDate) : null;
  const published = doc.date ? new Date(doc.date) : null;
  if (expiry && !Number.isNaN(expiry.getTime()) && expiry < now) return "Expired";
  if (published && !Number.isNaN(published.getTime()) && published > now) return "Upcoming";
  return "Active";
}

export function serializeNotice(doc: NoticeDoc, now = new Date()): SerializedNotice {
  const topic = toUiTopic(doc.type);
  return {
    _id: String(doc._id ?? ""),
    title: doc.title || "",
    type: topic,
    audience: toUiAudience(doc.audience),
    publishedDate: formatNoticeDate(doc.date),
    publishedDateIso: toIsoDate(doc.date ?? null),
    expiryDate: doc.expiryDate ? formatNoticeDate(doc.expiryDate) : "—",
    expiryDateIso: toIsoDate(doc.expiryDate ?? null),
    status: noticeStatus(doc, now),
    description: doc.description || "",
    isImportant: Boolean(doc.IsImportant) || topic === "Important",
  };
}

/** Fields a student/faculty inbox is allowed to receive. */
export function serializePublicNotice(doc: NoticeDoc, now = new Date()) {
  const notice = serializeNotice(doc, now);
  return {
    _id: notice._id,
    title: notice.title,
    type: notice.type,
    audience: notice.audience,
    publishedDate: notice.publishedDate,
    expiryDate: notice.expiryDate,
    description: notice.description,
    isImportant: notice.isImportant,
  };
}
