"use client";

import { BookOpen } from "lucide-react";
import { useState } from "react";

export default function NotFound() {
  const [state, setState] = useState("idle");
  // idle | checking | foundNothing

  const runCheck = () => {
    setState("checking");

    setTimeout(() => {
      setState("foundNothing");
    }, 1200);
  };

  const reset = () => setState("idle");

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">

      <div className="text-center max-w-md">

        {/* ICON STATE */}
        <div
          onClick={runCheck}
          className="mx-auto w-fit rounded-2xl border border-slate-200 bg-white/70 backdrop-blur-md p-5 cursor-pointer active:scale-95 transition"
        >
          <BookOpen
            size={42}
            className="text-indigo-600"
          />
        </div>

        {/* TITLE */}
        <h1 className="mt-6 text-5xl font-semibold text-slate-800">
          404
        </h1>

        {/* DYNAMIC SYSTEM RESPONSE */}
        <div className="mt-3 text-sm text-slate-600 min-h-[24px]">
          {state === "idle" && "Click icon to search system"}
          {state === "checking" && "Searching curriculum..."}
          {state === "foundNothing" && "No matching page found"}
        </div>

        {/* ACTION BUTTONS */}
        <div className="mt-6 flex justify-center gap-3">

          {state === "idle" && (
            <button
              onClick={runCheck}
              className="rounded-xl bg-indigo-600 px-5 py-2 text-white text-sm"
            >
              Run check
            </button>
          )}

          {state === "checking" && (
            <button
              disabled
              className="rounded-xl bg-slate-300 px-5 py-2 text-white text-sm"
            >
              Checking...
            </button>
          )}

          {state === "foundNothing" && (
            <>
              <button
                onClick={reset}
                className="rounded-xl bg-slate-200 px-5 py-2 text-slate-700 text-sm"
              >
                Retry
              </button>

              <a
                href="/landingPage"
                className="rounded-xl bg-indigo-600 px-5 py-2 text-white text-sm"
              >
                Go home
              </a>
            </>
          )}

        </div>

      </div>
    </div>
  );
}