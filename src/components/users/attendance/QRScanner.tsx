"use client";

import axios from "axios";
import { Html5Qrcode } from "html5-qrcode";
import { useRef, useState } from "react";

type MarkResult = {
  ok: boolean;
  message: string;
};

export default function QRScanner({ onMarked }: { onMarked?: () => void }) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scanningRef = useRef(false);
  const [status, setStatus] = useState<string>("Idle");
  const [result, setResult] = useState<MarkResult | null>(null);

  const stopScanner = async () => {
    const scanner = scannerRef.current;
    if (!scanner) return;
    try {
      if (scanner.isScanning) {
        await scanner.stop();
      }
      await scanner.clear();
    } catch {
      // ignore stop/clear race
    } finally {
      scannerRef.current = null;
      scanningRef.current = false;
    }
  };

  const markPresent = async (sessionId: string, token: string) => {
    const res = await axios.post("/api/users/auth/attendance/session/start", {
      sessionId,
      token,
    });
    return res.data;
  };

  const startScanner = async () => {
    setResult(null);
    setStatus("Starting camera…");

    if (scannerRef.current?.isScanning) {
      await stopScanner();
    }

    const scanner = new Html5Qrcode("reader");
    scannerRef.current = scanner;
    scanningRef.current = true;

    try {
      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        async (decodedText) => {
          if (!scanningRef.current) return;
          scanningRef.current = false;

          try {
            setStatus("QR detected — marking present…");
            const qrData = JSON.parse(decodedText);
            const sessionId = qrData.sessionId;
            const token = qrData.token ?? qrData.sessionToken;

            if (!sessionId || !token) {
              throw new Error("QR missing sessionId or token");
            }

            await stopScanner();
            const data = await markPresent(sessionId, token);
            setResult({ ok: true, message: data.message || "Attendance marked" });
            setStatus("Done");
            onMarked?.();
          } catch (err: unknown) {
            await stopScanner();
            const message = axios.isAxiosError(err)
              ? err.response?.data?.message || err.message
              : err instanceof Error
                ? err.message
                : "Failed to mark attendance";
            setResult({ ok: false, message });
            setStatus("Failed");
          }
        },
        () => {
          // frame with no QR — ignore
        },
      );
      setStatus("Point camera at the faculty QR code");
    } catch (err: unknown) {
      scanningRef.current = false;
      const message =
        err instanceof Error ? err.message : "Could not start camera";
      setStatus(message);
      setResult({ ok: false, message });
    }
  };

  return (
    <div className="space-y-3">
      <div
        id="reader"
        className="mx-auto w-full max-w-sm overflow-hidden rounded-lg bg-slate-100"
      />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={startScanner}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800"
        >
          Start Scanner
        </button>
        <button
          type="button"
          onClick={() => {
            void stopScanner();
            setStatus("Stopped");
          }}
          className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
        >
          Stop
        </button>
      </div>

      <p className="text-sm text-slate-600">{status}</p>
      {result && (
        <p
          className={`text-sm font-medium ${
            result.ok ? "text-emerald-700" : "text-red-600"
          }`}
        >
          {result.message}
        </p>
      )}
    </div>
  );
}
