"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { Clock, MapPin, Play, Users } from "lucide-react";
import { formatTimeRange12h } from "@/lib/faculty/time";
import { IllustrationState } from "@/components/illustrations/IllustrationState";

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
  facultyName: string;
};

function ClassMobileCard({
  cls,
  showDay,
  action,
  onOpen,
}: {
  cls: ClassRow;
  showDay?: boolean;
  action?: ReactNode;
  onOpen: () => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <button type="button" onClick={onOpen} className="w-full text-left">
        <h3 className="text-base font-bold text-slate-900">{cls.subjectName}</h3>
        <p className="mt-0.5 text-sm font-semibold text-indigo-600">
          {cls.subjectCode}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
            {cls.department}
          </span>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
            Sem {cls.semester}
          </span>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
            Sec {cls.section}
          </span>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          {showDay && (
            <div className="col-span-2">
              <p className="text-xs text-slate-500">Day</p>
              <p className="mt-0.5 text-sm font-medium text-slate-800">{cls.day}</p>
            </div>
          )}
          <div>
            <p className="inline-flex items-center gap-1 text-xs text-slate-500">
              <Clock size={12} />
              Time
            </p>
            <p className="mt-0.5 text-sm font-medium text-slate-800">
              {formatTimeRange12h(cls.startTime, cls.endTime)}
            </p>
          </div>
          <div>
            <p className="inline-flex items-center gap-1 text-xs text-slate-500">
              <MapPin size={12} />
              Room
            </p>
            <p className="mt-0.5 text-sm font-medium text-slate-800">{cls.room}</p>
          </div>
          <div className="col-span-2">
            <p className="inline-flex items-center gap-1 text-xs text-slate-500">
              <Users size={12} />
              Students
            </p>
            <p className="mt-0.5 text-sm font-medium text-slate-800">
              {cls.studentCount}
            </p>
          </div>
        </div>
      </button>
      {action}
    </div>
  );
}

export default function FacultyClassesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [todayClasses, setTodayClasses] = useState<ClassRow[]>([]);
  const [todayName, setTodayName] = useState("");
  const [startingId, setStartingId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [allRes, todayRes] = await Promise.all([
          axios.get("/api/faculty/classes"),
          axios.get("/api/faculty/classes", { params: { today: "1" } }),
        ]);
        if (!allRes.data?.success) {
          toast.error(allRes.data?.message || "Failed to load classes");
          return;
        }
        setClasses(allRes.data.data || []);
        setTodayClasses(todayRes.data?.data || []);
        setTodayName(todayRes.data?.meta?.today || allRes.data?.meta?.today || "");
      } catch (err: unknown) {
        toast.error(
          axios.isAxiosError(err)
            ? err.response?.data?.message || "Failed to load classes"
            : "Failed to load classes",
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const startAttendance = async (cls: ClassRow, e?: React.MouseEvent) => {
    e?.stopPropagation();
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

  const startFirstToday = () => {
    if (todayClasses[0]) startAttendance(todayClasses[0]);
    else router.push("/faculty/attendance");
  };

  return (
    <div>
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-comfortaa text-2xl font-bold text-slate-900 sm:text-3xl">
            Classes
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Your assigned classes. Open a class for overview, students, and more.
          </p>
        </div>
        <button
          type="button"
          onClick={startFirstToday}
          disabled={loading || todayClasses.length === 0}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          <Play size={16} />
          Start Attendance
        </button>
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-slate-900">
          Today&apos;s classes{todayName ? ` · ${todayName}` : ""}
        </h2>

        <div className="mt-4 hidden overflow-hidden rounded-2xl border border-slate-200 lg:block">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs tracking-wide text-slate-500 uppercase">
              <tr>
                <th className="px-4 py-3 font-semibold">Subject</th>
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
                  <td colSpan={6} className="px-4 py-10 text-center text-slate-500">
                    Loading…
                  </td>
                </tr>
              ) : todayClasses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-slate-500">
                    No classes today
                  </td>
                </tr>
              ) : (
                todayClasses.map((cls) => (
                  <tr key={cls.id} className="border-t border-slate-100">
                    <td className="px-4 py-3.5">
                      <button
                        type="button"
                        onClick={() => router.push(`/faculty/classes/${encodeURIComponent(cls.id)}`)}
                        className="font-semibold text-slate-900 hover:text-indigo-600"
                      >
                        {cls.subjectName}
                      </button>
                      <p className="text-xs text-indigo-600">{cls.subjectCode}</p>
                    </td>
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
                        onClick={(e) => startAttendance(cls, e)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
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

        <div className="mt-4 grid grid-cols-1 gap-4 lg:hidden">
          {loading ? (
            <p className="text-sm text-slate-500">Loading…</p>
          ) : todayClasses.length === 0 ? (
            <p className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
              No classes today
            </p>
          ) : (
            todayClasses.map((cls) => (
              <ClassMobileCard
                key={cls.id}
                cls={cls}
                onOpen={() => router.push(`/faculty/classes/${encodeURIComponent(cls.id)}`)}
                action={
                  <button
                    type="button"
                    disabled={startingId === cls.id}
                    onClick={(e) => startAttendance(cls, e)}
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
                  >
                    <Play size={16} />
                    {startingId === cls.id ? "Starting…" : "Start Attendance"}
                  </button>
                }
              />
            ))
          )}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-slate-900">All classes</h2>

        <div className="mt-4 hidden overflow-hidden rounded-2xl border border-slate-200 lg:block">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs tracking-wide text-slate-500 uppercase">
              <tr>
                <th className="px-4 py-3 font-semibold">Subject</th>
                <th className="px-4 py-3 font-semibold">Code</th>
                <th className="px-4 py-3 font-semibold">Section</th>
                <th className="px-4 py-3 font-semibold">Day / Time</th>
                <th className="px-4 py-3 font-semibold">Room</th>
                <th className="px-4 py-3 font-semibold">Students</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6}>
                    <IllustrationState
                      situation="loading"
                      size="sm"
                      title="Loading classes"
                    />
                  </td>
                </tr>
              ) : classes.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <IllustrationState
                      situation="empty"
                      size="sm"
                      title="No classes yet"
                      description="No classes have been assigned to you."
                    />
                  </td>
                </tr>
              ) : (
                classes.map((cls) => (
                  <tr
                    key={cls.id}
                    className="cursor-pointer border-t border-slate-100 hover:bg-slate-50"
                    onClick={() => router.push(`/faculty/classes/${encodeURIComponent(cls.id)}`)}
                  >
                    <td className="px-4 py-3.5 font-semibold text-slate-900">
                      {cls.subjectName}
                    </td>
                    <td className="px-4 py-3.5 text-indigo-600">{cls.subjectCode}</td>
                    <td className="px-4 py-3.5 text-slate-600">
                      {cls.department} · Sem {cls.semester} · Sec {cls.section}
                    </td>
                    <td className="px-4 py-3.5 text-slate-600">
                      {cls.day} · {formatTimeRange12h(cls.startTime, cls.endTime)}
                    </td>
                    <td className="px-4 py-3.5 text-slate-600">{cls.room}</td>
                    <td className="px-4 py-3.5 text-slate-600">{cls.studentCount}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 lg:hidden">
          {loading ? (
            <IllustrationState
              situation="loading"
              size="sm"
              title="Loading classes"
            />
          ) : classes.length === 0 ? (
            <IllustrationState
              situation="empty"
              size="sm"
              title="No classes yet"
              description="No classes have been assigned to you."
            />
          ) : (
            classes.map((cls) => (
              <ClassMobileCard
                key={cls.id}
                cls={cls}
                showDay
                onOpen={() => router.push(`/faculty/classes/${encodeURIComponent(cls.id)}`)}
              />
            ))
          )}
        </div>
      </section>
    </div>
  );
}
