"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { MapPin } from "lucide-react";
import { formatTimeRange12h } from "@/lib/faculty/time";

type ClassRow = {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  subjectName: string;
  subjectCode: string;
  room: string;
  department: string;
  semester: number;
  section: string;
};

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

const DAY_SHORT: Record<(typeof DAYS)[number], string> = {
  Monday: "Mon",
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri",
  Saturday: "Sat",
};

function padTime(time: string) {
  const match = time.trim().match(/^(\d{1,2}):(\d{2})/);
  if (!match) return time;
  return `${match[1].padStart(2, "0")}:${match[2]}`;
}

function slotKey(cls: Pick<ClassRow, "startTime" | "endTime">) {
  return `${padTime(cls.startTime)}-${padTime(cls.endTime)}`;
}

function formatSlotLabel(startTime: string, endTime: string) {
  return formatTimeRange12h(startTime, endTime);
}

export default function FacultyTimetablePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [selectedDay, setSelectedDay] = useState<(typeof DAYS)[number] | "">("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get("/api/faculty/timetable");
        if (!res.data?.success) {
          toast.error(res.data?.message || "Failed to load timetable");
          return;
        }
        const rows: ClassRow[] = res.data.data.classes || [];
        setClasses(rows);
        const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
        const todayInWeek = DAYS.find((d) => d === today);
        const firstWithClass = DAYS.find((d) => rows.some((c) => c.day === d));
        setSelectedDay(todayInWeek || firstWithClass || "Monday");
      } catch (err: unknown) {
        toast.error(
          axios.isAxiosError(err)
            ? err.response?.data?.message || "Failed to load timetable"
            : "Failed to load timetable",
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const todayName = useMemo(
    () => new Date().toLocaleDateString("en-US", { weekday: "long" }),
    [],
  );

  const timeSlots = useMemo(() => {
    const seen = new Map<string, { startTime: string; endTime: string }>();
    for (const cls of classes) {
      const key = slotKey(cls);
      if (!seen.has(key)) {
        seen.set(key, { startTime: padTime(cls.startTime), endTime: padTime(cls.endTime) });
      }
    }
    return Array.from(seen.values()).sort((a, b) => {
      const byStart = a.startTime.localeCompare(b.startTime);
      if (byStart !== 0) return byStart;
      return a.endTime.localeCompare(b.endTime);
    });
  }, [classes]);

  const grid = useMemo(() => {
    const map: Record<string, Record<string, ClassRow[]>> = {};
    for (const day of DAYS) map[day] = {};
    for (const cls of classes) {
      const key = slotKey(cls);
      if (!map[cls.day]) map[cls.day] = {};
      if (!map[cls.day][key]) map[cls.day][key] = [];
      map[cls.day][key].push(cls);
    }
    return map;
  }, [classes]);

  const activeDay = selectedDay || todayName;
  const mobileDayClasses = useMemo(() => {
    return classes
      .filter((cls) => cls.day === activeDay)
      .sort((a, b) => padTime(a.startTime).localeCompare(padTime(b.startTime)));
  }, [classes, activeDay]);

  return (
    <div>
      <div className="border-b border-slate-200 pb-6">
        <h1 className="font-comfortaa text-2xl font-bold text-slate-900 sm:text-3xl">
          Timetable
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Weekly schedule for your assigned classes
        </p>
      </div>

      {loading ? (
        <p className="mt-8 text-sm text-slate-500">Loading timetable…</p>
      ) : classes.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
          No classes in your timetable yet
        </p>
      ) : (
        <>
        <div className="mt-6 lg:hidden">
          <div className="grid grid-cols-6 gap-1.5">
            {DAYS.map((day) => {
              const isActive = day === activeDay;
              const isToday = day === todayName;
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelectedDay(day)}
                  className={`rounded-xl px-1 py-2 text-center text-xs font-semibold transition ${
                    isActive
                      ? "bg-indigo-600 text-white"
                      : "border border-slate-200 bg-white text-slate-600"
                  }`}
                >
                  {DAY_SHORT[day]}
                  {isToday && (
                    <span
                      className={`mx-auto mt-1 block h-1.5 w-1.5 rounded-full ${
                        isActive ? "bg-white" : "bg-indigo-500"
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-4 space-y-3">
            {mobileDayClasses.length === 0 ? (
              <p className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                No classes on {activeDay}
              </p>
            ) : (
              mobileDayClasses.map((cls) => (
                <button
                  key={cls.id}
                  type="button"
                  onClick={() =>
                    router.push(`/faculty/classes/${encodeURIComponent(cls.id)}`)
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm"
                >
                  <p className="text-xs font-semibold tracking-wide text-indigo-600 uppercase">
                    {formatSlotLabel(cls.startTime, cls.endTime)}
                  </p>
                  <p className="mt-1 text-base font-bold text-slate-900">
                    {cls.subjectName}
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-indigo-600">
                    {cls.subjectCode}
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-xs text-slate-500">Class</p>
                      <p className="font-medium text-slate-800">
                        {cls.department} · Sem {cls.semester}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Section</p>
                      <p className="font-medium text-slate-800">{cls.section}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="inline-flex items-center gap-1 text-xs text-slate-500">
                        <MapPin size={12} />
                        Room {cls.room}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="mt-6 hidden overflow-x-auto rounded-2xl border border-slate-200 shadow-sm lg:block">
          <table className="min-w-full border-collapse bg-white text-sm">
            <thead>
              <tr className="bg-slate-50">
                <th className="sticky left-0 z-10 min-w-28 border-b border-r border-slate-200 bg-slate-50 px-3 py-3 text-left text-xs font-semibold tracking-wide text-slate-500 uppercase">
                  Day
                </th>
                {timeSlots.map((slot) => (
                  <th
                    key={`${slot.startTime}-${slot.endTime}`}
                    className="min-w-44 border-b border-slate-200 px-3 py-3 text-center text-xs font-semibold tracking-wide text-slate-500 uppercase"
                  >
                    {formatSlotLabel(slot.startTime, slot.endTime)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DAYS.map((day) => {
                const isToday = day === todayName;
                return (
                  <tr
                    key={day}
                    className={isToday ? "bg-indigo-50/40" : "hover:bg-slate-50/70"}
                  >
                    <td
                      className={`sticky left-0 z-10 border-r border-b border-slate-200 px-3 py-3 font-semibold ${
                        isToday
                          ? "bg-indigo-50 text-indigo-700"
                          : "bg-white text-slate-800"
                      }`}
                    >
                      {day}
                      {isToday && (
                        <span className="mt-0.5 block text-[10px] font-medium tracking-wide text-indigo-500 uppercase">
                          Today
                        </span>
                      )}
                    </td>
                    {timeSlots.map((slot) => {
                      const key = `${slot.startTime}-${slot.endTime}`;
                      const items = grid[day]?.[key] || [];
                      return (
                        <td
                          key={`${day}-${key}`}
                          className="border-b border-slate-100 px-2 py-2 align-top"
                        >
                          {items.length === 0 ? (
                            <p className="py-4 text-center text-slate-300">—</p>
                          ) : (
                            <div className="flex flex-col gap-2">
                              {items.map((cls) => (
                                <button
                                  key={cls.id}
                                  type="button"
                                  onClick={() =>
                                    router.push(`/faculty/classes/${encodeURIComponent(cls.id)}`)
                                  }
                                  className="w-full rounded-xl border border-indigo-100 bg-indigo-50/80 px-3 py-2.5 text-left transition hover:border-indigo-200 hover:bg-indigo-100"
                                >
                                  <p className="font-semibold text-slate-900">
                                    {cls.subjectName}
                                  </p>
                                  <p className="mt-0.5 text-xs font-semibold text-indigo-600">
                                    {cls.subjectCode}
                                  </p>
                                  <p className="mt-1.5 text-xs text-slate-600">
                                    {cls.department} · Sem {cls.semester} · Sec{" "}
                                    {cls.section}
                                  </p>
                                  <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-slate-500">
                                    <MapPin size={11} />
                                    Room {cls.room}
                                  </p>
                                </button>
                              ))}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        </>
      )}
    </div>
  );
}
