"use client";

import type { ReactNode } from "react";

function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

export function GlassBone({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg bg-slate-200/55",
        className,
      )}
      aria-hidden
    >
      <div className="absolute inset-0">
        <div className="h-full w-1/3 animate-shimmer bg-linear-to-r from-transparent via-white/85 to-transparent opacity-90" />
      </div>
    </div>
  );
}

export function GlassPanel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/70 bg-white/45 shadow-sm ring-1 ring-slate-200/50 backdrop-blur-xl",
        className,
      )}
    >
      {children}
    </div>
  );
}

function HeaderSkeleton() {
  return (
    <div className="flex flex-col gap-4 border-b border-slate-200/80 pb-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:pb-8">
      <div className="min-w-0 space-y-3">
        <GlassBone className="h-8 w-52 sm:h-9 sm:w-72" />
        <GlassBone className="h-4 w-40 sm:w-56" />
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <GlassBone className="h-11 w-full rounded-xl sm:w-60" />
        <GlassBone className="h-11 w-11 shrink-0 rounded-xl" />
      </div>
    </div>
  );
}

function StatCardsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <GlassPanel key={i} className="flex min-h-44 flex-col justify-between p-5">
          <div className="flex items-center gap-3">
            <GlassBone className="h-11 w-11 rounded-xl" />
            <GlassBone className="h-4 w-24" />
          </div>
          <GlassBone className="h-8 w-16" />
          <GlassBone className="h-2 w-full rounded-full" />
        </GlassPanel>
      ))}
    </div>
  );
}

function ChartSkeleton() {
  return (
    <GlassPanel className="p-5">
      <div className="mb-5 flex items-center justify-between">
        <GlassBone className="h-5 w-32" />
        <GlassBone className="h-8 w-24 rounded-xl" />
      </div>
      <GlassBone className="h-64 w-full rounded-xl sm:h-72" />
    </GlassPanel>
  );
}

export function TableRowsSkeleton({
  rows = 6,
  cols = 5,
}: {
  rows?: number;
  cols?: number;
}) {
  return (
    <GlassPanel className="overflow-hidden">
      <div
        className="hidden gap-3 border-b border-slate-200/70 bg-white/30 px-4 py-3.5 lg:grid"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: cols }).map((_, i) => (
          <GlassBone key={i} className="h-3 w-16 mx-auto" />
        ))}
      </div>
      <div className="hidden divide-y divide-slate-100/80 lg:block">
        {Array.from({ length: rows }).map((_, row) => (
          <div
            key={row}
            className="grid items-center gap-3 px-4 py-4"
            style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: cols }).map((_, col) => (
              <GlassBone
                key={col}
                className={cn("h-4", col === 0 ? "w-3/4" : "w-1/2 mx-auto")}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="space-y-3 p-3 lg:hidden">
        {Array.from({ length: Math.min(rows, 4) }).map((_, i) => (
          <GlassPanel key={i} className="space-y-3 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <GlassBone className="h-11 w-11 rounded-2xl" />
                <div className="space-y-2">
                  <GlassBone className="h-4 w-36" />
                  <GlassBone className="h-3 w-24" />
                </div>
              </div>
              <GlassBone className="h-6 w-16 rounded-full" />
            </div>
            <GlassBone className="h-3 w-full" />
            <GlassBone className="h-3 w-2/3" />
          </GlassPanel>
        ))}
      </div>
    </GlassPanel>
  );
}

export function ListRowsSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <GlassPanel className="divide-y divide-slate-100/80 overflow-hidden">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-start gap-3 px-5 py-4">
          <GlassBone className="mt-0.5 h-10 w-10 shrink-0 rounded-xl" />
          <div className="min-w-0 flex-1 space-y-2">
            <GlassBone className="h-4 w-2/3" />
            <GlassBone className="h-3 w-full" />
            <GlassBone className="h-3 w-1/3" />
          </div>
        </div>
      ))}
    </GlassPanel>
  );
}

function DashboardBody() {
  return (
    <>
      <div className="mt-8">
        <GlassBone className="mb-5 h-5 w-28" />
        <StatCardsSkeleton />
      </div>
      <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
      <div className="mt-6">
        <GlassBone className="mb-4 h-6 w-40" />
        <TableRowsSkeleton rows={3} cols={4} />
      </div>
    </>
  );
}

function TimetableBody() {
  return (
    <div className="mt-2">
      <GlassPanel className="overflow-hidden p-2">
        <div className="grid grid-cols-5 gap-2 sm:grid-cols-6">
          {Array.from({ length: 36 }).map((_, i) => (
            <GlassBone
              key={i}
              className={cn("h-16 rounded-xl", i < 6 && "h-10")}
            />
          ))}
        </div>
      </GlassPanel>
    </div>
  );
}

function AttendanceBody() {
  return (
    <div className="mt-8 space-y-6">
      <div className="flex w-full flex-col gap-6 xl:flex-row">
        <GlassPanel className="w-full space-y-5 p-5 xl:w-3/5">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <GlassBone className="h-6 w-48" />
              <GlassBone className="h-3 w-56" />
            </div>
            <GlassBone className="h-7 w-16 rounded-full" />
          </div>
          <GlassBone className="h-36 w-full rounded-3xl" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 rounded-2xl p-3">
                <GlassBone className="h-12 w-12 rounded-2xl" />
                <div className="flex-1 space-y-2">
                  <GlassBone className="h-4 w-40" />
                  <GlassBone className="h-3 w-28" />
                </div>
                <GlassBone className="h-6 w-20 rounded-full" />
              </div>
            ))}
          </div>
        </GlassPanel>
        <GlassPanel className="w-full space-y-4 p-5 xl:w-2/5">
          <GlassBone className="h-5 w-36" />
          <GlassBone className="mx-auto h-48 w-48 rounded-full" />
          <div className="grid grid-cols-2 gap-3">
            <GlassBone className="h-16 rounded-xl" />
            <GlassBone className="h-16 rounded-xl" />
          </div>
        </GlassPanel>
      </div>
      <TableRowsSkeleton rows={5} cols={6} />
    </div>
  );
}

function ResultBody() {
  return (
    <div className="mt-8 space-y-10">
      <GlassBone className="h-6 w-24" />
      <GlassPanel className="p-6 sm:p-8">
        <div className="flex justify-between">
          <GlassBone className="h-4 w-36" />
          <GlassBone className="h-4 w-40" />
        </div>
        <GlassBone className="mt-4 h-8 w-56" />
        <GlassBone className="mt-3 h-4 w-72" />
        <div className="mt-8 grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <GlassPanel key={i} className="space-y-3 p-5">
              <GlassBone className="h-3 w-16" />
              <GlassBone className="h-8 w-20" />
            </GlassPanel>
          ))}
        </div>
      </GlassPanel>
      <div>
        <GlassBone className="mb-6 h-6 w-56" />
        <TableRowsSkeleton rows={5} cols={7} />
      </div>
    </div>
  );
}

function SettingsBody() {
  return (
    <GlassPanel className="mt-4 p-6">
      <div className="flex items-center gap-4">
        <GlassBone className="h-12 w-12 rounded-2xl" />
        <div className="space-y-2">
          <GlassBone className="h-6 w-44" />
          <GlassBone className="h-3 w-64" />
        </div>
      </div>
      <div className="mt-8 flex flex-col items-center gap-4 md:flex-row md:items-start">
        <GlassBone className="h-32 w-32 rounded-full" />
        <div className="space-y-3">
          <GlassBone className="h-4 w-48" />
          <GlassBone className="h-10 w-36 rounded-xl" />
        </div>
      </div>
      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <GlassBone className="h-4 w-24" />
            <GlassBone className="h-11 w-full rounded-xl" />
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}

function CalendarBody() {
  return (
    <div className="mt-8 space-y-5">
      <div className="flex items-center justify-between">
        <GlassBone className="h-6 w-44" />
        <GlassBone className="h-10 w-40 rounded-xl" />
      </div>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <GlassBone key={i} className="h-7 w-24 rounded-lg" />
        ))}
      </div>
      <GlassPanel className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <GlassBone className="h-8 w-8 rounded-lg" />
          <GlassBone className="h-5 w-36" />
          <GlassBone className="h-8 w-8 rounded-lg" />
        </div>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 35 }).map((_, i) => (
            <GlassBone key={i} className="h-16 rounded-xl sm:h-20" />
          ))}
        </div>
      </GlassPanel>
    </div>
  );
}

function MessagesBody() {
  return (
    <div className="mt-8">
      <GlassBone className="mb-4 h-7 w-64" />
      <GlassPanel className="space-y-5 p-5">
        <GlassBone className="h-5 w-40" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <GlassBone className="h-4 w-48" />
            <GlassBone className="h-3 w-full" />
          </div>
        ))}
      </GlassPanel>
    </div>
  );
}

export type StudentSkeletonVariant =
  | "default"
  | "dashboard"
  | "table"
  | "list"
  | "timetable"
  | "attendance"
  | "result"
  | "settings"
  | "calendar"
  | "messages";

export function StudentPanelSkeleton({
  variant = "default",
  showHeader = true,
}: {
  variant?: StudentSkeletonVariant;
  showHeader?: boolean;
}) {
  return (
    <div className="w-full" role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">Loading content</span>
      {showHeader ? <HeaderSkeleton /> : null}
      {variant === "dashboard" || variant === "default" ? <DashboardBody /> : null}
      {variant === "table" ? (
        <div className="mt-6">
          <TableRowsSkeleton />
        </div>
      ) : null}
      {variant === "list" ? (
        <div className="mt-6">
          <ListRowsSkeleton />
        </div>
      ) : null}
      {variant === "timetable" ? <TimetableBody /> : null}
      {variant === "attendance" ? <AttendanceBody /> : null}
      {variant === "result" ? <ResultBody /> : null}
      {variant === "settings" ? <SettingsBody /> : null}
      {variant === "calendar" ? <CalendarBody /> : null}
      {variant === "messages" ? <MessagesBody /> : null}
    </div>
  );
}

export function GlassScreenLoading() {
  return (
    <div
      className="relative min-h-[60vh] w-full overflow-hidden rounded-2xl"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <StudentPanelSkeleton variant="default" />
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/35 backdrop-blur-md">
        <GlassPanel className="flex flex-col items-center gap-4 px-8 py-7">
          <div className="flex gap-2">
            <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-indigo-400 [animation-delay:-0.3s]" />
            <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-indigo-500 [animation-delay:-0.15s]" />
            <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-indigo-700" />
          </div>
          <p className="text-sm font-medium tracking-wide text-slate-600">
            Loading your workspace
          </p>
        </GlassPanel>
      </div>
    </div>
  );
}
