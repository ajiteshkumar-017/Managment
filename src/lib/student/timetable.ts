import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { findStudentClasses } from "@/lib/student/attendance";
import { formatTimeRange12h } from "@/lib/faculty/time";
import { timeToMinutes } from "@/lib/faculty/helpers";

export const TIMETABLE_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export type TimetableEntry = {
  day: string;
  startTime: string;
  endTime: string;
  time: string;
  subject: string;
  faculty: string;
  room: string;
};

type StudentClassRow = {
  day: string;
  startTime: string;
  endTime: string;
  room?: string;
  subjectId:
    | {
        subjectName?: string;
        subjectCode?: string;
      }
    | string
    | null;
  facultyId:
    | {
        username?: string;
      }
    | string
    | null;
};

export async function getStudentTimetableEntries(student: {
  department?: string;
  semester?: number;
  section?: string;
}): Promise<TimetableEntry[]> {
  const classes = await findStudentClasses(student);

  return (classes as StudentClassRow[]).map((cls) => {
    const subject =
      cls.subjectId && typeof cls.subjectId === "object" ? cls.subjectId : null;
    const faculty =
      cls.facultyId && typeof cls.facultyId === "object" ? cls.facultyId : null;

    return {
      day: cls.day,
      startTime: cls.startTime,
      endTime: cls.endTime,
      time: formatTimeRange12h(cls.startTime, cls.endTime),
      subject: subject?.subjectName || "Subject",
      faculty: faculty?.username || "Faculty",
      room: cls.room || "—",
    };
  });
}

export function uniqueTimeSlots(entries: TimetableEntry[]) {
  const seen = new Map<string, TimetableEntry["time"]>();
  for (const entry of entries) {
    const key = `${entry.startTime}|${entry.endTime}`;
    if (!seen.has(key)) seen.set(key, entry.time);
  }

  return [...seen.entries()]
    .sort((a, b) => {
      const [startA] = a[0].split("|");
      const [startB] = b[0].split("|");
      return timeToMinutes(startA) - timeToMinutes(startB);
    })
    .map(([key, label]) => ({ key, label }));
}

export function buildStudentTimetablePdf(opts: {
  entries: TimetableEntry[];
  studentName: string;
}) {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const slots = uniqueTimeSlots(opts.entries);
  const slotLabels = slots.length
    ? slots.map((s) => s.label)
    : ["No classes scheduled"];

  const grid = new Map<string, TimetableEntry>();
  for (const entry of opts.entries) {
    grid.set(`${entry.day}|${entry.startTime}|${entry.endTime}`, entry);
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42);
  doc.text("Class Timetable", 14, 16);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(opts.studentName || "Student timetable", 14, 23);

  const body = TIMETABLE_DAYS.map((day) => [
    day,
    ...slots.map((slot) => {
      const [startTime, endTime] = slot.key.split("|");
      const cls = grid.get(`${day}|${startTime}|${endTime}`);
      return cls ? `${cls.subject}\n${cls.faculty}\n${cls.room}` : "—";
    }),
  ]);

  autoTable(doc, {
    startY: 28,
    head: [["Day", ...slotLabels]],
    body: slots.length ? body : [["No classes found"]],
    theme: "grid",
    styles: {
      fontSize: 8,
      cellPadding: 3,
      valign: "middle",
      halign: "center",
      textColor: [51, 65, 85],
      overflow: "linebreak",
    },
    headStyles: {
      fillColor: [79, 70, 229],
      textColor: 255,
      fontStyle: "bold",
      halign: "center",
    },
    columnStyles: {
      0: { fontStyle: "bold", fillColor: [248, 250, 252], halign: "left" },
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    margin: { left: 14, right: 14 },
  });

  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(
    "Generated from Orbit Student Portal",
    14,
    doc.internal.pageSize.getHeight() - 8,
  );

  return Buffer.from(doc.output("arraybuffer"));
}
