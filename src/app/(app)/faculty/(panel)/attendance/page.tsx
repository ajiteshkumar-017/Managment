"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { Play, Users } from "lucide-react";
import { formatTimeRange12h } from "@/lib/faculty/time";

type ClassRow = {
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

export default function FacultyAttendancePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [todayName, setTodayName] = useState("");
  const [startingId, setStartingId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get("/api/faculty/classes", {
          params: { today: "1" },
        });
        if (!res.data?.success) {
          toast.error(res.data?.message || "Failed to load classes");
          return;
        }
        setClasses(res.data.data || []);
        setTodayName(res.data.meta?.today || "");
      } catch (err: unknown) {
        toast.error(
          axios.isAxiosError(err)
            ? err.response?.data?.message || "Failed to load attendance"
            : "Failed to load attendance",
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const startAttendance = async (cls: ClassRow) => {
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

  return (
    <div>
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-comfortaa text-2xl font-bold text-slate-900 sm:text-3xl">
            Attendance
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Today&apos;s classes{todayName ? ` · ${todayName}` : ""}. Start a QR
            session for students to mark present.
          </p>
        </div>
        <button
          type="button"
          disabled={loading || classes.length === 0 || Boolean(startingId)}
          onClick={() => classes[0] && startAttendance(classes[0])}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          <Play size={16} />
          Start Attendance
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {loading ? (
          <p className="text-sm text-slate-500">Loading today&apos;s classes…</p>
        ) : classes.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500 md:col-span-2">
            No classes scheduled for today
          </div>
        ) : (
          classes.map((cls) => (
            <div
              key={cls.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {cls.subjectName}
                  </h2>
                  <p className="mt-0.5 text-sm font-semibold text-indigo-600">
                    {cls.subjectCode}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    {cls.department} · Sem {cls.semester} · Section {cls.section}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {formatTimeRange12h(cls.startTime, cls.endTime)} · Room {cls.room}
                  </p>
                  <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-slate-500">
                    <Users size={14} />
                    {cls.studentCount} students
                  </p>
                </div>
              </div>
              <button
                type="button"
                disabled={startingId === cls.id}
                onClick={() => startAttendance(cls)}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
              >
                <Play size={16} />
                {startingId === cls.id ? "Starting…" : "Start Attendance"}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
