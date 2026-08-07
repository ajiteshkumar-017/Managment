export type AcademicEventType =
  | "registration"
  | "classes"
  | "exam"
  | "break"
  | "holiday"
  | "other";

export type AcademicCalendarItem = {
  /** Human-readable date label shown in lists / PDF */
  date: string;
  /** Inclusive range start (YYYY-MM-DD) for month grid placement */
  startDate: string;
  /** Inclusive range end; omit for single-day events */
  endDate?: string;
  event: string;
  type: AcademicEventType;
};

export type AcademicTerm = {
  term: string;
  period: string;
  items: AcademicCalendarItem[];
};

export const academicTerms: AcademicTerm[] = [
  {
    term: "Odd Semester 2025–26",
    period: "Jul 2025 – Dec 2025",
    items: [
      {
        date: "21 Jul 2025",
        startDate: "2025-07-21",
        event: "Registration & orientation",
        type: "registration",
      },
      {
        date: "28 Jul 2025",
        startDate: "2025-07-28",
        event: "Classes commence",
        type: "classes",
      },
      {
        date: "15–22 Sep 2025",
        startDate: "2025-09-15",
        endDate: "2025-09-22",
        event: "Mid-semester examinations",
        type: "exam",
      },
      {
        date: "10–20 Nov 2025",
        startDate: "2025-11-10",
        endDate: "2025-11-20",
        event: "End-semester examinations",
        type: "exam",
      },
      {
        date: "25 Nov 2025",
        startDate: "2025-11-25",
        event: "Winter break begins",
        type: "break",
      },
    ],
  },
  {
    term: "Even Semester 2025–26",
    period: "Jan 2026 – May 2026",
    items: [
      {
        date: "06 Jan 2026",
        startDate: "2026-01-06",
        event: "Registration",
        type: "registration",
      },
      {
        date: "08 Jan 2026",
        startDate: "2026-01-08",
        event: "Classes commence",
        type: "classes",
      },
      {
        date: "02–08 Mar 2026",
        startDate: "2026-03-02",
        endDate: "2026-03-08",
        event: "Mid-semester examinations",
        type: "exam",
      },
      {
        date: "20–30 Apr 2026",
        startDate: "2026-04-20",
        endDate: "2026-04-30",
        event: "End-semester examinations",
        type: "exam",
      },
      {
        date: "05 May 2026",
        startDate: "2026-05-05",
        event: "Summer break begins",
        type: "break",
      },
    ],
  },
];

export const eventTypeStyles: Record<
  AcademicEventType,
  { label: string; dot: string; bg: string; text: string }
> = {
  registration: {
    label: "Registration",
    dot: "bg-sky-500",
    bg: "bg-sky-50",
    text: "text-sky-700",
  },
  classes: {
    label: "Classes",
    dot: "bg-emerald-500",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
  },
  exam: {
    label: "Exam",
    dot: "bg-rose-500",
    bg: "bg-rose-50",
    text: "text-rose-700",
  },
  break: {
    label: "Break",
    dot: "bg-amber-500",
    bg: "bg-amber-50",
    text: "text-amber-700",
  },
  holiday: {
    label: "Holiday",
    dot: "bg-violet-500",
    bg: "bg-violet-50",
    text: "text-violet-700",
  },
  other: {
    label: "Event",
    dot: "bg-slate-500",
    bg: "bg-slate-50",
    text: "text-slate-700",
  },
};

/** Flat list of all academic events across terms. */
export function getAllAcademicEvents(): AcademicCalendarItem[] {
  return academicTerms.flatMap((term) => term.items);
}

/** Parse YYYY-MM-DD as a local calendar day (avoids UTC off-by-one). */
export function parseIsoDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function dateToIso(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Events that fall on a given calendar day (inclusive range). */
export function getEventsForDate(
  isoDate: string,
  events: AcademicCalendarItem[] = getAllAcademicEvents(),
): AcademicCalendarItem[] {
  const day = parseIsoDate(isoDate).getTime();
  return events.filter((item) => {
    const start = parseIsoDate(item.startDate).getTime();
    const end = parseIsoDate(item.endDate ?? item.startDate).getTime();
    return day >= start && day <= end;
  });
}

/** Build a month grid (Sun–Sat), padded with adjacent-month days. */
export function buildMonthGrid(year: number, monthIndex: number): Date[] {
  const first = new Date(year, monthIndex, 1);
  const startOffset = first.getDay();
  const gridStart = new Date(year, monthIndex, 1 - startOffset);

  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    return d;
  });
}
