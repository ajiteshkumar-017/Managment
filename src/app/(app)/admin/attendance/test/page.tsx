"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Bar from "@/utils/Admin/Bar";

type StartResponse = {
  success: boolean;
  message: string;
  data?: {
    session: {
      id: string;
      sessionCode: number;
      sessionToken: string;
      expiryTime: string;
      status: string;
    };
    class: {
      classCode: string;
      room: string;
    };
    qrCodeDataUrl: string;
  };
};

export default function AdminAttendanceTestPage() {
  const [open, setOpen] = useState(true);
  const [className, setClassName] = useState("A101");
  const [loading, setLoading] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const [sessionInfo, setSessionInfo] = useState<StartResponse["data"] | null>(
    null,
  );

  const startSession = async () => {
    setLoading(true);
    try {
      const res = await axios.get<StartResponse>(
        `/api/admin/attendance/session/start`,
        { params: { className } },
      );

      if (!res.data.success || !res.data.data) {
        throw new Error(res.data.message || "Failed to start session");
      }

      setSessionInfo(res.data.data);
      setQrCodeDataUrl(res.data.data.qrCodeDataUrl);
      toast.success("Attendance session started");
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : err instanceof Error
          ? err.message
          : "Failed to start session";
      toast.error(message);
      setSessionInfo(null);
      setQrCodeDataUrl(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full max-w-[100vw] flex-col overflow-x-hidden bg-linear-to-br from-slate-50 via-white to-slate-50 lg:flex-row">
      <Bar open={open} setOpen={setOpen} />

      <div className="min-w-0 w-full flex-1">
        <div className="overflow-hidden bg-white p-5 text-slate-900 shadow-sm sm:p-6 md:p-7 lg:p-6">
          <div className="mx-auto max-w-3xl space-y-8">
            <div className="border-b border-slate-200 pb-6">
              <Link
                href="/admin/attendance"
                className="mb-3 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800"
              >
                <ArrowLeft size={16} />
                Back to Attendance
              </Link>
              <h1 className="font-comfortaa text-2xl font-bold text-slate-900 sm:text-3xl">
                Start attendance session
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Start a session and show this QR to students. They scan it from
                the student Attendance page.
              </p>
            </div>

            <section className="space-y-3 rounded-xl border border-slate-200 p-5">
              <h2 className="text-lg font-medium text-slate-900">
                Start session
              </h2>
              <p className="text-sm text-slate-600">
                Uses room name from seed data (e.g. <code>A101</code>). Must be
                logged in as admin or the assigned faculty.
              </p>
              <div className="flex flex-wrap items-end gap-3">
                <label className="block text-sm">
                  <span className="mb-1 block text-slate-600">Class room</span>
                  <input
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    className="rounded-md border border-slate-300 px-3 py-2"
                    placeholder="A101"
                  />
                </label>
                <button
                  type="button"
                  onClick={startSession}
                  disabled={loading}
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-500 disabled:opacity-60"
                >
                  {loading ? "Starting…" : "Start attendance"}
                </button>
              </div>

              {sessionInfo && (
                <div className="space-y-2 text-sm text-slate-700">
                  <p>
                    Class: <strong>{sessionInfo.class.classCode}</strong> (
                    {sessionInfo.class.room})
                  </p>
                  <p>
                    Session code:{" "}
                    <strong>{sessionInfo.session.sessionCode}</strong>
                  </p>
                  <p>
                    Expires:{" "}
                    <strong>
                      {new Date(
                        sessionInfo.session.expiryTime,
                      ).toLocaleTimeString()}
                    </strong>
                  </p>
                </div>
              )}

              {qrCodeDataUrl && (
                <div className="flex flex-col items-start gap-2">
                  <p className="text-sm font-medium text-slate-800">
                    Show this QR to students
                  </p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrCodeDataUrl}
                    alt="Attendance session QR"
                    className="h-56 w-56 rounded-lg border border-slate-200 bg-white p-2"
                  />
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
