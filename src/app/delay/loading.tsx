"use client";

import { BookOpen, GraduationCap, NotebookPen, PencilRuler, Calculator } from "lucide-react";
import { useEffect, useState } from "react";

const items = [
  { icon: BookOpen, text: "Loading study materials" },
  { icon: GraduationCap, text: "Preparing your classes" },
  { icon: NotebookPen, text: "Syncing attendance records" },
  { icon: PencilRuler, text: "Setting up assignments" },
  { icon: Calculator, text: "Organizing academic data" },
];

export default function DelayLoading() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  const CurrentIcon = items[index].icon;

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#f6f7fb] p-6">
      <div className="flex w-full max-w-md flex-col items-center gap-6 rounded-[32px]   px-8 py-10 ">
        <div className="relative flex h-28 w-28 items-center justify-center">
          <div className="absolute h-32 w-32 rounded-full  animate-spin" />
          <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-slate-50 shadow-lg transition-all duration-500">
            <CurrentIcon size={48} strokeWidth={2.2} className="text-slate-900" />
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Please wait</p>
          <p key={index} className="mt-3 text-lg font-semibold text-slate-900">
            {items[index].text}
          </p>
        </div>

        <div className="flex gap-2">
          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-slate-500 [animation-delay:-0.15s]" />
          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-slate-700" />
        </div>
      </div>
    </div>
  );
}
