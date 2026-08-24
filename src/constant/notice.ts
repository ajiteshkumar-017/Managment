export const NOTICE_TOPICS = [
  "Academic Management",
  "Exam",
  "Fest",
  "Cultural",
  "Holiday",
  "Important",
  "General",
] as const;

export type NoticeTopic = (typeof NOTICE_TOPICS)[number];

export const NOTICE_AUDIENCE_UI = ["All", "Students", "Faculty", "Admin"] as const;
export type NoticeAudienceUi = (typeof NOTICE_AUDIENCE_UI)[number];

export const NOTICE_AUDIENCE_DB = [
  "All",
  "Student Only",
  "Faculty Only",
  "Admin Only",
] as const;

export type NoticeAudienceDb = (typeof NOTICE_AUDIENCE_DB)[number];

/** Older `type` values stored before the admin notice topics existed. */
export const NOTICE_TOPIC_LEGACY_MAP: Record<string, NoticeTopic> = {
  assignment: "Academic Management",
  announcement: "General",
  event: "Fest",
  placement: "Academic Management",
  general: "General",
  holiday: "Holiday",
};

/** Stored `type` values: UI topics in lowercase, plus legacy enum values. */
export const NOTICE_TYPE_ENUM = [
  ...new Set([
    ...NOTICE_TOPICS.map((topic) => topic.toLowerCase()),
    "assignment",
    "announcement",
    "event",
    "placement",
    "general",
    "holiday",
  ]),
] as const;
