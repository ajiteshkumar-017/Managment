"use client";

import { GraduationCap, BookOpenCheck, Shield } from "lucide-react";

export type PanelRole = "student" | "faculty" | "admin";

const PANELS = {
  student: {
    label: "Student",
    Icon: GraduationCap,
    wrap: "rounded-full border-sky-200 bg-linear-to-r from-sky-50 to-indigo-50 text-sky-800",
    iconWrap: "rounded-full bg-sky-600 text-white",
    compact: "rounded-full bg-sky-600 text-white",
    hint: "Student panel",
  },
  faculty: {
    label: "Faculty",
    Icon: BookOpenCheck,
    wrap: "rounded-xl border-emerald-200 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-100",
    iconWrap: "rounded-lg bg-emerald-600 text-white",
    compact: "rounded-lg bg-emerald-600 text-white",
    hint: "Faculty panel",
  },
  admin: {
    label: "Administrator",
    Icon: Shield,
    wrap: "rounded-md border-l-4 border-amber-400 border-y border-r border-amber-200 bg-amber-50 text-amber-950",
    iconWrap: "rounded-sm bg-amber-500 text-white",
    compact: "rounded-sm bg-amber-500 text-white",
    hint: "Administrator panel",
  },
} as const;

export function PanelIdentity({
  role,
  compact = false,
}: {
  role: PanelRole;
  compact?: boolean;
}) {
  const panel = PANELS[role];
  const Icon = panel.Icon;

  if (compact) {
    return (
      <div
        title={panel.hint}
        className={`flex h-8 w-8 items-center justify-center rounded-lg ${panel.compact}`}
      >
        <Icon size={15} strokeWidth={2.25} />
        <span className="sr-only">{panel.label}</span>
      </div>
    );
  }

  return (
    <div
      className={`flex w-full items-center gap-2.5 border px-2.5 py-2 ${panel.wrap}`}
      title={panel.hint}
    >
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center ${panel.iconWrap}`}
      >
        <Icon size={14} strokeWidth={2.4} />
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-medium tracking-wide text-current/60 uppercase">
          Signed in as
        </p>
        <p className="font-comfortaa text-xs font-bold tracking-wide">
          {panel.label}
        </p>
      </div>
    </div>
  );
}
