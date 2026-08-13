"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import {
  BookOpenCheck,
  CalendarCheck2,
  ClipboardList,
  Play,
  Plus,
  QrCode,
} from "lucide-react";
import { formatTimeRange12h } from "@/lib/faculty/time";

type TodayClass = {
  id: string;
  classCode: string;
  room: string;
  day: string;
  startTime: string;
  endTime: string;
  department: string;
  semester: number;
  section: string;
  subjectName: string;
  subjectCode: string;
  studentCount: number;
};

type Stats = {
  todaysClasses: number;
  classesCompleted: number;
  pendingAssignments: number;
  attendanceSessions: number;
};

export default function FacultyDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [facultyName, setFacultyName] = useState("Faculty");
  const [stats, setStats] = useState<Stats>({
    todaysClasses: 0,
    classesCompleted: 0,
    pendingAssignments: 0,
    attendanceSessions: 0,
  });
  const [todayClasses, setTodayClasses] = useState<TodayClass[]>([]);
  const [startingId, setStartingId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get("/api/faculty/dashboard");
        if (!res.data?.success) {
          toast.error(res.data?.message || "Failed to load dashboard");
          return;
        }
        setFacultyName(res.data.data.facultyName || "Faculty");
        setStats(res.data.data.stats);
        setTodayClasses(res.data.data.todayClasses || []);
      } catch (err: unknown) {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          router.replace("/landingPage");
          return;
        }
        toast.error(
          axios.isAxiosError(err)
            ? err.response?.data?.message || "Failed to load dashboard"
            : "Failed to load dashboard",
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [router]);

  const startAttendance = async (cls: TodayClass) => {
    setStartingId(cls.id);
    try {
      const res = await axios.get("/api/faculty/attendance/session/start", {
        params: { classId: cls.id },
      });
      if (!res.data?.success || !res.data?.data) {
        throw new Error(res.data?.message || "Failed to start session");
      }
      sessionStorage.setItem(
        "facultyAttendanceSession",
        JSON.stringify({ classId: cls.id, data: res.data.data }),
      );
      router.push(`/faculty/attendance/session?classId=${encodeURIComponent(cls.id)}`);
    } catch (err: unknown) {
      toast.error(
        axios.isAxiosError(err)
          ? err.response?.data?.message || err.message
          : err instanceof Error
            ? err.message
            : "Failed to start attendance",
      );
    } finally {
      setStartingId(null);
    }
  };

  const cards = [
    {
      label: "Today's Classes",
      value: stats.todaysClasses,
      hint: "Scheduled today",
      icon: <BookOpenCheck size={20} />,
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      label: "Classes Completed",
      value: stats.classesCompleted,
      hint: "Finished today",
      icon: <CalendarCheck2 size={20} />,
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      label: "Pending Assignments",
      value: stats.pendingAssignments,
      hint: "Upcoming due dates",
      icon: <ClipboardList size={20} />,
      color: "bg-amber-100 text-amber-600",
    },
    {
      label: "Attendance Sessions",
      value: stats.attendanceSessions,
      hint: "Started today",
      icon: <QrCode size={20} />,
      color: "bg-cyan-100 text-cyan-600",
    },
  ];

  return (
    <div>
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between sm:pb-8">
        <div>
          <h1 className="font-comfortaa text-2xl font-bold text-slate-900 sm:text-3xl">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Welcome back{facultyName ? `, ${facultyName}` : ""}. Manage today&apos;s
            classes and attendance.
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push("/faculty/assignments?add=1")}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          <Plus size={16} />
          Add Assignment
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium tracking-wide text-slate-500 uppercase">
                  {card.label}
                </p>
                <h3 className="mt-2 text-2xl font-bold text-slate-900">
                  {loading ? "—" : card.value}
                </h3>
                <p className="mt-1 text-xs text-slate-500">{card.hint}</p>
              </div>
              <span className={`rounded-xl p-2.5 ${card.color}`}>{card.icon}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Today&apos;s Classes</h2>
            <p className="mt-1 text-sm text-slate-500">
              Start attendance for any scheduled class
            </p>
          </div>
        </div>

        {/* Desktop table */}
        <div className="mt-4 hidden overflow-hidden rounded-2xl border border-slate-200 lg:block">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs tracking-wide text-slate-500 uppercase">
              <tr>
                <th className="px-4 py-3 font-semibold">Subject</th>
                <th className="px-4 py-3 font-semibold">Code</th>
                <th className="px-4 py-3 font-semibold">Section</th>
                <th className="px-4 py-3 font-semibold">Time</th>
                <th className="px-4 py-3 font-semibold">Room</th>
                <th className="px-4 py-3 font-semibold">Students</th>
                <th className="px-4 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-slate-500">
                    Loading classes…
                  </td>
                </tr>
              ) : todayClasses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-slate-500">
                    No classes scheduled for today
                  </td>
                </tr>
              ) : (
                todayClasses.map((cls) => (
                  <tr
                    key={cls.id}
                    className="border-t border-slate-100 hover:bg-slate-50/80"
                  >
                    <td className="px-4 py-3.5">
                      <button
                        type="button"
                        onClick={() => router.push(`/faculty/classes/${encodeURIComponent(cls.id)}`)}
                        className="font-semibold text-slate-900 hover:text-indigo-600"
                      >
                        {cls.subjectName}
                      </button>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600">{cls.subjectCode}</td>
                    <td className="px-4 py-3.5 text-slate-600">
                      {cls.department} · Sem {cls.semester} · Sec {cls.section}
                    </td>
                    <td className="px-4 py-3.5 text-slate-600">
                      {formatTimeRange12h(cls.startTime, cls.endTime)}
                    </td>
                    <td className="px-4 py-3.5 text-slate-600">{cls.room}</td>
                    <td className="px-4 py-3.5 text-slate-600">{cls.studentCount}</td>
                    <td className="px-4 py-3.5">
                      <button
                        type="button"
                        disabled={startingId === cls.id}
                        onClick={() => startAttendance(cls)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60"
                      >
                        <Play size={14} />
                        {startingId === cls.id ? "Starting…" : "Start Attendance"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile list */}
        <div className="mt-4 divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 lg:hidden">
          {loading ? (
            <p className="px-4 py-8 text-center text-sm text-slate-500">Loading…</p>
          ) : todayClasses.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-slate-500">
              No classes scheduled for today
            </p>
          ) : (
            todayClasses.map((cls) => (
              <div key={cls.id} className="space-y-3 px-4 py-4">
                <button
                  type="button"
                  onClick={() => router.push(`/faculty/classes/${encodeURIComponent(cls.id)}`)}
                  className="text-left"
                >
                  <p className="font-semibold text-slate-900">{cls.subjectName}</p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {cls.subjectCode} · {cls.department} · Sem {cls.semester} · Sec{" "}
                    {cls.section}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {formatTimeRange12h(cls.startTime, cls.endTime)} · Room {cls.room} ·{" "}
                    {cls.studentCount} students
                  </p>
                </button>
                <button
                  type="button"
                  disabled={startingId === cls.id}
                  onClick={() => startAttendance(cls)}
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
                >
                  <Play size={14} />
                  {startingId === cls.id ? "Starting…" : "Start Attendance"}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
