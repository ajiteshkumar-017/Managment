import {
  NOTICE_TOPICS,
  NOTICE_TOPIC_LEGACY_MAP,
  type NoticeAudienceDb,
  type NoticeAudienceUi,
  type NoticeTopic,
} from "@/constant/notice";

const TOPIC_BY_LOWER = new Map(
  NOTICE_TOPICS.map((topic) => [topic.toLowerCase(), topic] as const),
);

function normalizeMatch(value: string) {
  return value.trim().toLowerCase();
}

/**
 * Canonical DB audience from UI, DB, or role-like strings.
 * Returns null for anything unknown so callers can reject it.
 */
export function toDbAudience(input: unknown): NoticeAudienceDb | null {
  if (typeof input !== "string") return null;
  const value = normalizeMatch(input);
  if (!value) return null;

  if (value === "all") return "All";
  if (value === "students" || value === "student only" || value === "student") {
    return "Student Only";
  }
  if (value === "faculty" || value === "faculty only") {
    return "Faculty Only";
  }
  if (value === "admin" || value === "admin only") {
    return "Admin Only";
  }
  return null;
}

export function toUiAudience(input: unknown): NoticeAudienceUi {
  const db = toDbAudience(input) ?? "All";
  if (db === "Student Only") return "Students";
  if (db === "Faculty Only") return "Faculty";
  if (db === "Admin Only") return "Admin";
  return "All";
}

export function toUiTopic(input: unknown): NoticeTopic {
  if (typeof input !== "string" || !input.trim()) return "General";
  const value = normalizeMatch(input);
  return TOPIC_BY_LOWER.get(value) ?? NOTICE_TOPIC_LEGACY_MAP[value] ?? "General";
}

export function parseNoticeTopic(input: unknown): NoticeTopic | null {
  if (typeof input !== "string") return null;
  const value = normalizeMatch(input);
  if (!value) return null;
  return TOPIC_BY_LOWER.get(value) ?? NOTICE_TOPIC_LEGACY_MAP[value] ?? null;
}

/** Store the UI topic in lowercase. Display labels stay unchanged. */
export function toDbTopic(topic: NoticeTopic): string {
  return topic.trim().toLowerCase();
}

/**
 * Audiences this role may read. Derived only from the authenticated user —
 * never from query params or request body.
 */
export function visibleAudiencesForRole(role: unknown): NoticeAudienceDb[] {
  switch (role) {
    case "student":
      return ["All", "Student Only"];
    case "faculty":
      return ["All", "Faculty Only"];
    case "admin":
      return ["All", "Admin Only"];
    default:
      return [];
  }
}

type NoticeVisibilityMode = "inbox" | "manage";

/**
 * Mongo filter for notices the caller is allowed to see.
 * `inbox`: only current, published notices for that role's audience.
 * `manage`: every notice (admin board only).
 */
export function noticeVisibilityFilter(
  role: unknown,
  mode: NoticeVisibilityMode,
  now = new Date(),
) {
  if (mode === "manage") {
    if (role !== "admin") return { _id: { $in: [] } };
    return {};
  }

  const audiences = visibleAudiencesForRole(role);
  if (audiences.length === 0) return { _id: { $in: [] } };

  const audienceClause: Record<string, unknown>[] = [
    { audience: { $in: audiences } },
  ];
  if (audiences.includes("All")) {
    audienceClause.push({ audience: { $exists: false } }, { audience: null });
  }

  return {
    $and: [
      { $or: audienceClause },
      { $or: [{ date: { $lte: now } }, { date: { $exists: false } }, { date: null }] },
      {
        $or: [
          { expiryDate: { $gte: now } },
          { expiryDate: { $exists: false } },
          { expiryDate: null },
        ],
      },
    ],
  };
}

export function notificationRolesForAudience(
  audience: NoticeAudienceDb,
): Array<"student" | "faculty" | "admin"> {
  switch (audience) {
    case "Student Only":
      return ["student"];
    case "Faculty Only":
      return ["faculty"];
    case "Admin Only":
      return ["admin"];
    default:
      return ["student", "faculty", "admin"];
  }
}
