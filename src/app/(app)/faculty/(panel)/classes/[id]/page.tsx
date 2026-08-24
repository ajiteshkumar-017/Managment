"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";
import { ArrowLeft, Play, Plus, Upload, Users } from "lucide-react";
import { formatTimeRange12h } from "@/lib/faculty/time";
import { IllustrationState } from "@/components/illustrations/IllustrationState";

type TabId = "overview" | "students" | "attendance" | "assignments" | "results";

const tabs: { id: TabId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "students", label: "Students" },
  { id: "attendance", label: "Attendance" },
  { id: "assignments", label: "Assignments" },
  { id: "results", label: "Results" },
];

type Overview = {
  id: string;
  subjectName: string;
  subjectCode: string;
  department: string;
  semester: number;
  section: string;
  batch: string;
  room: string;
  day: string;
  startTime: string;
  endTime: string;
  facultyName: string;
  studentCount: number;
  classCode: string;
};

type StudentRow = {
  id: string;
  name: string;
  rollNumber: string;
  email: string;
  status: string;
};

type AttendanceSession = {
  id: string;
  sessionCode: number;
  startedAt: string;
  status: string;
  presentCount: number;
  present: { name: string; rollNumber: string; markedAt: string }[];
};

type AssignmentRow = {
  id: string;
  title: string;
  dueDate: string;
  status: string;
  marks: number;
};

export default function FacultyClassDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id || "");

  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabId>("overview");
  const [overview, setOverview] = useState<Overview | null>(null);
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [attendance, setAttendance] = useState<AttendanceSession[]>([]);
  const [assignments, setAssignments] = useState<AssignmentRow[]>([]);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/faculty/classes/${encodeURIComponent(id)}`);
        if (!res.data?.success) {
          toast.error(res.data?.message || "Failed to load class");
          router.replace("/faculty/classes");
          return;
        }
        setOverview(res.data.data.overview);
        setStudents(res.data.data.students || []);
        setAttendance(res.data.data.attendance || []);
        setAssignments(res.data.data.assignments || []);
      } catch (err: unknown) {
        toast.error(
          axios.isAxiosError(err)
            ? err.response?.data?.message || "Failed to load class"
            : "Failed to load class",
        );
        router.replace("/faculty/classes");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, router]);

  const startAttendance = async () => {
    if (!overview) return;
    setStarting(true);
    try {
      const res = await axios.get("/api/faculty/attendance/session/start", {
        params: { classId: overview.id },
      });
      if (!res.data?.success || !res.data?.data) {
        throw new Error(res.data?.message || "Failed to start session");
      }
      sessionStorage.setItem(
        "facultyAttendanceSession",
        JSON.stringify({ classId: overview.id, data: res.data.data }),
      );
      router.push(`/faculty/attendance/session?classId=${encodeURIComponent(overview.id)}`);
    } catch (err: unknown) {
      toast.error(
        axios.isAxiosError(err)
          ? err.response?.data?.message || err.message
          : "Failed to start attendance",
      );
    } finally {
      setStarting(false);
    }
  };

  if (loading || !overview) {
    return (
      <IllustrationState
        situation="loading"
        title="Loading class"
        description="Fetching this class and its students."
      />
    );
  }

  return (
    <div>
      <Link
        href="/faculty/classes"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800"
      >
        <ArrowLeft size={16} />
        Back to Classes
      </Link>

      <div className="border-b border-slate-200 pb-6">
        <h1 className="font-comfortaa text-2xl font-bold text-slate-900 sm:text-3xl">
          {overview.subjectName}
        </h1>
        <p className="mt-1 text-base font-semibold text-indigo-600">
          {overview.subjectCode}
        </p>
        <p className="mt-2 text-sm text-slate-600">
          {overview.department} · Sem {overview.semester} · Section{" "}
          {overview.section}
        </p>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-600">
          <span>
            Faculty: <strong>{overview.facultyName}</strong>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users size={14} />
            Students: <strong>{overview.studentCount}</strong>
          </span>
        </div>

        <button
          type="button"
          onClick={startAttendance}
          disabled={starting}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          <Play size={16} />
          {starting ? "Starting…" : "Start Attendance"}
        </button>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => router.push("/faculty/assignments?add=1")}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Plus size={16} />
            Add Assignment
          </button>
          <button
            type="button"
            onClick={() => router.push("/faculty/results")}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Upload size={16} />
            Publish Result
          </button>
        </div>
      </div>

      <div className="mt-6 flex gap-1 overflow-x-auto border-b border-slate-200">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`shrink-0 border-b-2 px-4 py-2.5 text-sm font-semibold transition ${
              tab === t.id
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "overview" && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              { label: "Class code", value: overview.classCode },
              { label: "Room", value: overview.room },
              { label: "Schedule", value: `${overview.day} · ${formatTimeRange12h(overview.startTime, overview.endTime)}` },
              { label: "Batch", value: overview.batch },
              { label: "Department", value: overview.department },
              { label: "Semester / Section", value: `Sem ${overview.semester} · Sec ${overview.section}` },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-slate-200 bg-white p-4"
              >
                <p className="text-xs font-medium tracking-wide text-slate-500 uppercase">
                  {item.label}
                </p>
                <p className="mt-1.5 text-sm font-semibold text-slate-900">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        )}

        {tab === "students" && (
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            {students.length === 0 ? (
              <IllustrationState
                situation="empty"
                size="sm"
                title="No students found"
                description="This class doesn’t have enrolled students yet."
              />
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs tracking-wide text-slate-500 uppercase">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Roll no.</th>
                    <th className="px-4 py-3 font-semibold">Name</th>
                    <th className="hidden px-4 py-3 font-semibold sm:table-cell">
                      Email
                    </th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => (
                    <tr key={s.id} className="border-t border-slate-100">
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {s.rollNumber}
                      </td>
                      <td className="px-4 py-3 text-slate-700">{s.name}</td>
                      <td className="hidden px-4 py-3 text-slate-500 sm:table-cell">
                        {s.email}
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-800 ring-1 ring-emerald-600/15">
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {tab === "attendance" && (
          <div className="space-y-4">
            {attendance.length === 0 ? (
              <IllustrationState
                situation="empty"
                size="sm"
                title="No sessions yet"
                description="Attendance sessions for this class will show up here."
              />
            ) : (
              attendance.map((session) => (
                <div
                  key={session.id}
                  className="rounded-2xl border border-slate-200 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold text-slate-900">
                        Session {session.sessionCode}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {new Date(session.startedAt).toLocaleString()} ·{" "}
                        {session.presentCount} present · {session.status}
                      </p>
                    </div>
                  </div>
                  {session.present.length > 0 && (
                    <div className="mt-3 overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="text-xs text-slate-500 uppercase">
                          <tr>
                            <th className="py-1 pr-3 font-semibold">Roll no.</th>
                            <th className="py-1 pr-3 font-semibold">Name</th>
                            <th className="py-1 font-semibold">Marked at</th>
                          </tr>
                        </thead>
                        <tbody>
                          {session.present.map((p, i) => (
                            <tr key={`${session.id}-${i}`} className="border-t border-slate-50">
                              <td className="py-1.5 pr-3 font-medium">
                                {p.rollNumber}
                              </td>
                              <td className="py-1.5 pr-3">{p.name}</td>
                              <td className="py-1.5 text-slate-500">
                                {new Date(p.markedAt).toLocaleTimeString([], {
                                  hour: "numeric",
                                  minute: "2-digit",
                                  hour12: true,
                                })}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {tab === "assignments" && (
          <div>
            <div className="mb-4 flex justify-end">
              <button
                type="button"
                onClick={() => router.push("/faculty/assignments?add=1")}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                <Plus size={16} />
                Add Assignment
              </button>
            </div>
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              {assignments.length === 0 ? (
                <IllustrationState
                  situation="empty"
                  size="sm"
                  title="No assignments yet"
                  description="This class doesn’t have any published assignments."
                />
              ) : (
                <ul className="divide-y divide-slate-100">
                  {assignments.map((a) => (
                    <li key={a.id} className="px-4 py-4">
                      <p className="font-semibold text-slate-900">{a.title}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        Due {new Date(a.dueDate).toLocaleDateString()} · {a.marks}{" "}
                        marks · {a.status === "uploaded" ? "published" : a.status}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {tab === "results" && (
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-8 text-center">
            <p className="text-sm font-medium text-slate-700">
              Publish this class from the Results page
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Exam results for this subject appear after you publish a result batch.
            </p>
            <button
              type="button"
              onClick={() => router.push("/faculty/results")}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              <Upload size={16} />
              Publish Result
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
