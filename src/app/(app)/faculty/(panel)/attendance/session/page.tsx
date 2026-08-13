"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";
import { ArrowLeft, Clock, RefreshCw, Users } from "lucide-react";
import { Suspense } from "react";

const SESSION_STORAGE_KEY = "facultyAttendanceSession";

type SessionPayload = {
  expiryTime: string;
  qrPayload: {
    sessionId: string;
    token: string;
    sessionCode?: number;
    classId?: string;
  };
  qrCodeDataUrl: string;
  class?: {
    id: string;
    room: string;
    classCode: string;
    department: string;
    semester: number;
    section: string;
  };
};

type PresentRow = {
  id: string;
  name: string;
  rollNumber: string;
  markedAt: string;
  method: string;
};

function formatRemaining(ms: number) {
  if (ms <= 0) return "00:00";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function readStoredSession(classId: string): SessionPayload | null {
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as {
      classId: string;
      data: SessionPayload;
    };
    if (parsed.classId !== classId) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

function storeSession(classId: string, data: SessionPayload) {
  sessionStorage.setItem(
    SESSION_STORAGE_KEY,
    JSON.stringify({ classId, data }),
  );
}

function SessionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const classId = searchParams.get("classId") || "";

  const [sessionInfo, setSessionInfo] = useState<SessionPayload | null>(null);
  const [remainingMs, setRemainingMs] = useState(0);
  const [present, setPresent] = useState<PresentRow[]>([]);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [bootstrapping, setBootstrapping] = useState(true);
  const [classMeta, setClassMeta] = useState<{
    subjectName: string;
    subjectCode: string;
    department: string;
    semester: number;
    section: string;
    room: string;
    facultyName: string;
    studentCount: number;
  } | null>(null);
  const [restarting, setRestarting] = useState(false);

  useEffect(() => {
    if (!classId) {
      toast.error("Missing class");
      router.replace("/faculty/attendance");
      return;
    }

    const loadClass = async () => {
      try {
        const res = await axios.get(`/api/faculty/classes/${encodeURIComponent(classId)}`);
        if (res.data?.success) {
          const o = res.data.data.overview;
          setClassMeta({
            subjectName: o.subjectName,
            subjectCode: o.subjectCode,
            department: o.department,
            semester: o.semester,
            section: o.section,
            room: o.room,
            facultyName: o.facultyName,
            studentCount: o.studentCount,
          });
        }
      } catch {
        /* non-blocking */
      }
    };
    loadClass();

    const boot = async () => {
      const stored = readStoredSession(classId);
      if (stored?.qrCodeDataUrl && stored.qrPayload?.sessionId) {
        setSessionInfo(stored);
        setBootstrapping(false);
        return;
      }

      try {
        const res = await axios.get("/api/faculty/attendance/session/start", {
          params: { classId },
        });
        if (!res.data?.success || !res.data?.data) {
          throw new Error(res.data?.message || "Failed to start session");
        }
        storeSession(classId, res.data.data);
        setSessionInfo(res.data.data);
      } catch (err: unknown) {
        toast.error(
          axios.isAxiosError(err)
            ? err.response?.data?.message || "Failed to start session"
            : "Failed to start session",
        );
        router.replace("/faculty/attendance");
      } finally {
        setBootstrapping(false);
      }
    };
    boot();
  }, [classId, router]);

  useEffect(() => {
    if (!sessionInfo?.expiryTime) {
      setRemainingMs(0);
      return;
    }
    const expiry = new Date(sessionInfo.expiryTime).getTime();
    const tick = () => setRemainingMs(Math.max(0, expiry - Date.now()));
    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [sessionInfo?.expiryTime]);

  const fetchRecords = useCallback(async () => {
    const sessionId = sessionInfo?.qrPayload?.sessionId;
    if (!sessionId) return;
    setLoadingRecords(true);
    try {
      const res = await axios.get("/api/faculty/attendance/session/records", {
        params: { sessionId },
      });
      if (res.data?.success) {
        setPresent(res.data.data.present || []);
      }
    } catch {
      /* keep previous list */
    } finally {
      setLoadingRecords(false);
    }
  }, [sessionInfo?.qrPayload?.sessionId]);

  useEffect(() => {
    if (!sessionInfo?.qrPayload?.sessionId) return;
    fetchRecords();
    const id = window.setInterval(fetchRecords, 4000);
    return () => window.clearInterval(id);
  }, [fetchRecords, sessionInfo?.qrPayload?.sessionId]);

  const restartSession = async () => {
    if (!classId) return;
    setRestarting(true);
    try {
      const res = await axios.get("/api/faculty/attendance/session/start", {
        params: { classId },
      });
      if (!res.data?.success || !res.data?.data) {
        throw new Error(res.data?.message || "Failed to restart");
      }
      storeSession(classId, res.data.data);
      setSessionInfo(res.data.data);
      setPresent([]);
      toast.success("New attendance session started");
    } catch (err: unknown) {
      toast.error(
        axios.isAxiosError(err)
          ? err.response?.data?.message || err.message
          : "Failed to restart session",
      );
    } finally {
      setRestarting(false);
    }
  };

  const isExpired = Boolean(sessionInfo) && remainingMs <= 0;
  const isActive = Boolean(sessionInfo) && remainingMs > 0;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="border-b border-slate-200 pb-6">
        <Link
          href="/faculty/attendance"
          className="mb-3 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft size={16} />
          Back to Attendance
        </Link>
        <h1 className="font-comfortaa text-2xl font-bold text-slate-900 sm:text-3xl">
          Attendance session
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Show the QR code to students. Live present list updates automatically.
        </p>
      </div>

      {classMeta && (
        <section className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
          <h2 className="text-xl font-bold text-slate-900">
            {classMeta.subjectName}
          </h2>
          <p className="mt-0.5 text-sm font-semibold text-indigo-600">
            {classMeta.subjectCode}
          </p>
          <p className="mt-2 text-sm text-slate-600">
            {classMeta.department} · Sem {classMeta.semester} · Section{" "}
            {classMeta.section}
          </p>
          <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-600">
            <span>
              Room: <strong>{classMeta.room}</strong>
            </span>
            <span>
              Faculty: <strong>{classMeta.facultyName}</strong>
            </span>
            <span className="inline-flex items-center gap-1">
              <Users size={14} />
              Students: <strong>{classMeta.studentCount}</strong>
            </span>
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">QR Code</h3>
              {sessionInfo?.qrPayload.sessionCode != null && (
                <p className="mt-1 text-sm text-slate-600">
                  Session code:{" "}
                  <strong>{sessionInfo.qrPayload.sessionCode}</strong>
                </p>
              )}
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center">
              <div className="mb-1 flex items-center justify-center gap-1.5 text-xs text-slate-500">
                <Clock size={12} />
                Expires in
              </div>
              <p
                className={`text-2xl font-bold tracking-tight ${
                  isExpired
                    ? "text-red-600"
                    : remainingMs <= 30_000
                      ? "text-amber-600"
                      : "text-slate-900"
                }`}
              >
                {bootstrapping ? "--:--" : formatRemaining(remainingMs)}
              </p>
              <p
                className={`mt-1 text-xs font-medium ${
                  isActive ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {bootstrapping
                  ? "Starting…"
                  : isActive
                    ? "Active"
                    : sessionInfo
                      ? "Expired"
                      : "Unavailable"}
              </p>
            </div>
          </div>

          {sessionInfo?.qrCodeDataUrl ? (
            <div className="mt-5 flex flex-col items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={sessionInfo.qrCodeDataUrl}
                alt="Attendance session QR"
                className={`h-56 w-56 rounded-xl border border-slate-200 bg-white p-2 ${
                  isExpired ? "opacity-40" : ""
                }`}
              />
              {isExpired && (
                <button
                  type="button"
                  onClick={restartSession}
                  disabled={restarting}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
                >
                  <RefreshCw size={14} />
                  {restarting ? "Restarting…" : "Start new session"}
                </button>
              )}
            </div>
          ) : (
            <p className="mt-8 text-center text-sm text-slate-500">
              Preparing QR code…
            </p>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                View attendance
              </h3>
              <p className="mt-0.5 text-sm text-slate-500">
                {present.length} student{present.length === 1 ? "" : "s"} marked
                present
              </p>
            </div>
            <button
              type="button"
              onClick={fetchRecords}
              disabled={loadingRecords}
              className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 hover:bg-slate-50 disabled:opacity-60"
              title="Refresh"
            >
              <RefreshCw
                size={16}
                className={loadingRecords ? "animate-spin" : ""}
              />
            </button>
          </div>

          <div className="mt-4 max-h-96 overflow-y-auto rounded-xl border border-slate-100">
            {present.length === 0 ? (
              <p className="px-4 py-10 text-center text-sm text-slate-500">
                Waiting for students to scan…
              </p>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="sticky top-0 bg-slate-50 text-xs tracking-wide text-slate-500 uppercase">
                  <tr>
                    <th className="px-3 py-2.5 font-semibold">Roll no.</th>
                    <th className="px-3 py-2.5 font-semibold">Name</th>
                    <th className="px-3 py-2.5 font-semibold">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {present.map((row) => (
                    <tr key={row.id} className="border-t border-slate-100">
                      <td className="px-3 py-2.5 font-medium text-slate-900">
                        {row.rollNumber}
                      </td>
                      <td className="px-3 py-2.5 text-slate-700">{row.name}</td>
                      <td className="px-3 py-2.5 text-slate-500">
                        {new Date(row.markedAt).toLocaleTimeString([], {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default function FacultyAttendanceSessionPage() {
  return (
    <Suspense
      fallback={
        <p className="py-10 text-center text-sm text-slate-500">
          Loading session…
        </p>
      }
    >
      <SessionContent />
    </Suspense>
  );
}
