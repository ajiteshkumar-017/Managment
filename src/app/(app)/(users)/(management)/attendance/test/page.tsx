"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import QRScanner from "@/components/users/attendance/QRScanner";

type SessionPayload = {
  sessionId: string;
  token: string;
  sessionCode?: number;
  classId?: string;
  room?: string;
};

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
    qrPayload: SessionPayload;
    qrCodeDataUrl: string;
  };
};

export default function AttendanceTestPage() {
  const [className, setClassName] = useState("A101");
  const [loading, setLoading] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const [sessionInfo, setSessionInfo] = useState<StartResponse["data"] | null>(
    null,
  );
  const [manualSessionId, setManualSessionId] = useState("");
  const [manualToken, setManualToken] = useState("");
  const [manualStatus, setManualStatus] = useState<string | null>(null);

  const startSession = async () => {
    setLoading(true);
    setManualStatus(null);
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
      setManualSessionId(res.data.data.qrPayload.sessionId);
      setManualToken(res.data.data.qrPayload.token);
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

  const markManually = async () => {
    setManualStatus(null);
    try {
      const res = await axios.post("/api/users/auth/attendance/session/start", {
        sessionId: manualSessionId,
        token: manualToken,
      });
      setManualStatus(res.data.message || "Attendance marked");
      toast.success(res.data.message || "Attendance marked");
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : err instanceof Error
          ? err.message
          : "Failed to mark attendance";
      setManualStatus(message);
      toast.error(message);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Attendance flow test
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Faculty/admin starts a session and shows the QR. Student opens this
          page on phone (logged in), taps Start Scanner, and points the camera
          at the QR on the faculty screen.
        </p>
      </div>

      <section className="space-y-3 rounded-xl border border-slate-200 p-5">
        <h2 className="text-lg font-medium text-slate-900">
          1. Start session (faculty / admin)
        </h2>
        <p className="text-sm text-slate-600">
          Uses room name from seed data (e.g. <code>A101</code>). Login as
          faculty <code>maya.patel@test.edu</code> or admin.
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
              Session code: <strong>{sessionInfo.session.sessionCode}</strong>
            </p>
            <p>
              Expires:{" "}
              <strong>
                {new Date(sessionInfo.session.expiryTime).toLocaleTimeString()}
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

      <section className="space-y-3 rounded-xl border border-slate-200 p-5">
        <h2 className="text-lg font-medium text-slate-900">
          2. Scan QR on website (student)
        </h2>
        <p className="text-sm text-slate-600">
          On mobile Chrome/Safari (logged in as student), open this page and
          start the scanner. The browser asks for camera permission, then you
          point at the faculty QR — same as scanning with a native app.
        </p>
        <QRScanner />
      </section>

      <section className="space-y-3 rounded-xl border border-dashed border-slate-300 p-5">
        <h2 className="text-lg font-medium text-slate-900">
          3. Same-device test (no camera)
        </h2>
        <p className="text-sm text-slate-600">
          If you cannot point a camera at the screen, paste sessionId + token
          (filled after Start) and mark present while logged in as a student.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-1 block text-slate-600">sessionId</span>
            <input
              value={manualSessionId}
              onChange={(e) => setManualSessionId(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 font-mono text-xs"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-slate-600">token</span>
            <input
              value={manualToken}
              onChange={(e) => setManualToken(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 font-mono text-xs"
            />
          </label>
        </div>
        <button
          type="button"
          onClick={markManually}
          className="rounded-md bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-500"
        >
          Mark present (manual)
        </button>
        {manualStatus && (
          <p className="text-sm text-slate-700">{manualStatus}</p>
        )}
      </section>
    </div>
  );
}
