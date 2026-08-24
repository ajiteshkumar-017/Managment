import { NOTICE_TOPICS, type NoticeAudienceDb } from "@/constant/notice";
import { parseNoticeTopic, toDbAudience, toDbTopic } from "@/lib/notices/audience";
import { parseNoticeDate } from "@/lib/notices/parseDate";

const TITLE_MAX = 200;
const BODY_MAX = 10_000;

export type ParsedNoticePayload = {
  title: string;
  description: string;
  type: string;
  audience: NoticeAudienceDb;
  publishedDate: Date;
  expiryDate: Date | null;
  isImportant: boolean;
};

export function parseNoticePayload(
  body: unknown,
): { ok: true; data: ParsedNoticePayload } | { ok: false; message: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, message: "Invalid payload" };
  }

  const input = body as Record<string, unknown>;
  const title = typeof input.title === "string" ? input.title.trim() : "";
  const descriptionRaw = input.body ?? input.description;
  const description =
    typeof descriptionRaw === "string" ? descriptionRaw.trim() : "";

  if (!title) return { ok: false, message: "Title is required" };
  if (title.length > TITLE_MAX) {
    return { ok: false, message: `Title must be at most ${TITLE_MAX} characters` };
  }
  if (!description) return { ok: false, message: "Notice body is required" };
  if (description.length > BODY_MAX) {
    return { ok: false, message: `Notice body must be at most ${BODY_MAX} characters` };
  }

  const type = parseNoticeTopic(input.type);
  if (!type || !(NOTICE_TOPICS as readonly string[]).includes(type)) {
    return { ok: false, message: "Invalid notice topic" };
  }

  const audience = toDbAudience(input.audience);
  if (!audience) {
    return { ok: false, message: "Invalid audience" };
  }

  const publishedDate = parseNoticeDate(input.publishedDate) ?? new Date();
  const expiryDate = parseNoticeDate(input.expiryDate, true);

  if (expiryDate && expiryDate < publishedDate) {
    return { ok: false, message: "Expiry date must be on or after the published date" };
  }

  return {
    ok: true,
    data: {
      title,
      description,
      type: toDbTopic(type),
      audience,
      publishedDate,
      expiryDate,
      isImportant: type === "Important" || Boolean(input.isImportant),
    },
  };
}
