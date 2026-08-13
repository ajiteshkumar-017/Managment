"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import QRScanner from "@/components/users/attendance/QRScanner";

export default function AttendanceTestPage() {
  const [manualSessionId, setManualSessionId] = useState("");
  const [manualToken, setManualToken] = useState("");
  const [manualStatus, setManualStatus] = useState<string | null>(null);

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
          Attendance scan test
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Faculty starts a session from the faculty panel and shows the QR.
          Student opens this page (logged in), taps Start Scanner, and points
          the camera at the QR.
        </p>
      </div>

      <section className="space-y-3 rounded-xl border border-slate-200 p-5">
        <h2 className="text-lg font-medium text-slate-900">
          1. Scan QR (student)
        </h2>
        <p className="text-sm text-slate-600">
          On mobile Chrome/Safari (logged in as student), start the scanner and
          point at the faculty QR.
        </p>
        <QRScanner />
      </section>

      <section className="space-y-3 rounded-xl border border-dashed border-slate-300 p-5">
        <h2 className="text-lg font-medium text-slate-900">
          2. Same-device test (no camera)
        </h2>
        <p className="text-sm text-slate-600">
          Paste sessionId + token from the faculty session QR payload and mark
          present while logged in as a student.
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
