"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  Download,
  Search,
} from "lucide-react";
import AdminNavbar from "@/utils/AdminNavbar";
import {
  academicTerms,
  buildMonthGrid,
  dateToIso,
  eventTypeStyles,
  getEventsForDate,
  type AcademicCalendarItem,
  type AcademicEventType,
} from "@/data/academicCalendar";
import { downloadAcademicCalendarPdf } from "@/lib/academicCalendarPdf";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function CalendarPage() {
  const [username, setUsername] = useState("");
  const [currentMonth, setCurrentMonth] = useState(() => new Date(2025, 6, 1));
  const [selectedDate, setSelectedDate] = useState(() => new Date(2025, 6, 21));
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const res = await fetch("/api/users/getUsername");
        const data = await res.json();
        setUsername(data.username ?? "");
      } catch (err) {
        console.log(err);
      }
    };
    fetchUsername();
  }, []);

  const year = currentMonth.getFullYear();
  const monthIndex = currentMonth.getMonth();
  const grid = useMemo(
    () => buildMonthGrid(year, monthIndex),
    [year, monthIndex],
  );

  const selectedIso = dateToIso(selectedDate);
  const selectedEvents = getEventsForDate(selectedIso);

  const monthLabel = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const changeMonth = (delta: number) => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  };

  const goToToday = () => {
    const now = new Date();
    setCurrentMonth(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelectedDate(now);
  };

  const handleDownload = () => {
    try {
      setDownloading(true);
      downloadAcademicCalendarPdf("Orbit-Academic-Calendar-2025-26.pdf");
    } finally {
      setDownloading(false);
    }
  };

  const isSameMonth = (date: Date) =>
    date.getFullYear() === year && date.getMonth() === monthIndex;

  const isSelected = (date: Date) => dateToIso(date) === selectedIso;

  const isToday = (date: Date) => {
    const now = new Date();
    return (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate()
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-50 p-3 sm:p-4 md:p-5 lg:p-6">
      <div className="flex flex-col gap-4 sm:gap-5 md:gap-6 lg:flex-row">
        <AdminNavbar />

        <div className="w-full rounded-2xl bg-white p-5 text-slate-900 shadow-sm transition-all duration-300 sm:rounded-3xl sm:p-6 md:p-7 lg:p-8">
          {/* Header */}
          <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:pb-8">
            <div className="min-w-0">
              <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl md:text-4xl">
                Hello {username || "Student"} 👋
              </h2>
              <p className="mt-1 text-xs text-slate-600 sm:mt-2 sm:text-sm">
                Academic calendar · exams, holidays & key dates
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-2 sm:gap-3 md:gap-4">
              <div className="relative w-full flex-1 sm:w-auto sm:flex-none">
                <Search
                  className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400 sm:left-4"
                  size={18}
                />
                <input
                  className="w-full rounded-lg border border-slate-200 py-2.5 pr-3 pl-10 text-sm text-slate-900 placeholder-slate-500 transition-all focus:border-transparent focus:ring-2 focus:ring-indigo-500 focus:outline-none sm:w-52 sm:rounded-xl sm:py-3 sm:pr-4 sm:pl-11 md:w-60 lg:w-64"
                  placeholder="Search..."
                />
              </div>
              <button
                type="button"
                className="flex shrink-0 items-center justify-center rounded-lg bg-indigo-600 p-2.5 text-white transition-all hover:bg-indigo-700 sm:rounded-xl sm:p-3"
              >
                <Bell size={18} />
              </button>
            </div>
          </div>

          {/* Title + download */}
          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center sm:justify-between md:mt-10">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 sm:text-xl">
                Academic Calendar
              </h3>
              <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                Browse by month or download the full year schedule
              </p>
            </div>
            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
            >
              <Download size={16} />
              {downloading ? "Downloading..." : "Download Calendar"}
            </button>
          </div>

          {/* Legend */}
          <div className="mt-5 flex flex-wrap gap-2">
            {(
              Object.entries(eventTypeStyles) as [
                AcademicEventType,
                (typeof eventTypeStyles)[AcademicEventType],
              ][]
            )
              .filter(([key]) => key !== "other" && key !== "holiday")
              .map(([key, style]) => (
                <span
                  key={key}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium ${style.bg} ${style.text}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                  {style.label}
                </span>
              ))}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
            {/* Month grid */}
            <div className="overflow-hidden rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-3 sm:px-5">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => changeMonth(-1)}
                    className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm transition hover:bg-slate-100"
                    aria-label="Previous month"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => changeMonth(1)}
                    className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm transition hover:bg-slate-100"
                    aria-label="Next month"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
                <h4 className="text-sm font-bold text-slate-800 sm:text-base">
                  {monthLabel}
                </h4>
                <button
                  type="button"
                  onClick={goToToday}
                  className="rounded-lg px-2.5 py-1 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-50"
                >
                  Today
                </button>
              </div>

              <div className="grid grid-cols-7 border-b border-slate-100 bg-white">
                {WEEKDAYS.map((day) => (
                  <div
                    key={day}
                    className="px-1 py-2 text-center text-[10px] font-semibold tracking-wide text-slate-400 uppercase sm:text-xs"
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 bg-white">
                {grid.map((date) => {
                  const iso = dateToIso(date);
                  const dayEvents = getEventsForDate(iso);
                  const inMonth = isSameMonth(date);
                  const selected = isSelected(date);
                  const today = isToday(date);
                  const primaryType = dayEvents[0]?.type;

                  return (
                    <button
                      key={iso}
                      type="button"
                      onClick={() => setSelectedDate(new Date(date))}
                      className={`
                        relative min-h-[72px] border-r border-b border-slate-50 p-1.5 text-left transition
                        sm:min-h-[88px] sm:p-2
                        ${selected ? "bg-indigo-50" : "hover:bg-slate-50"}
                        ${!inMonth ? "bg-slate-50/60" : ""}
                      `}
                    >
                      <span
                        className={`
                          inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold
                          ${selected ? "bg-indigo-600 text-white" : ""}
                          ${!selected && today ? "bg-indigo-100 text-indigo-700" : ""}
                          ${!selected && !today && inMonth ? "text-slate-700" : ""}
                          ${!selected && !today && !inMonth ? "text-slate-300" : ""}
                        `}
                      >
                        {date.getDate()}
                      </span>

                      {dayEvents.length > 0 && (
                        <div className="mt-1 space-y-0.5">
                          {dayEvents.slice(0, 2).map((ev) => {
                            const style = eventTypeStyles[ev.type];
                            return (
                              <p
                                key={ev.event + ev.startDate}
                                className={`truncate rounded px-1 py-0.5 text-[9px] font-medium leading-tight sm:text-[10px] ${style.bg} ${style.text}`}
                              >
                                {ev.event}
                              </p>
                            );
                          })}
                          {dayEvents.length > 2 && (
                            <p className="px-1 text-[9px] text-slate-400">
                              +{dayEvents.length - 2} more
                            </p>
                          )}
                        </div>
                      )}

                      {dayEvents.length > 0 && !selected && (
                        <span
                          className={`absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full ${
                            primaryType
                              ? eventTypeStyles[primaryType].dot
                              : "bg-slate-400"
                          }`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Side panel */}
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-100 p-4 sm:p-5">
                <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                  Selected day
                </p>
                <h4 className="mt-1 text-base font-bold text-slate-900">
                  {selectedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </h4>

                <div className="mt-4 space-y-2">
                  {selectedEvents.length === 0 ? (
                    <p className="rounded-xl bg-slate-50 px-3 py-4 text-sm text-slate-500">
                      No scheduled academic events on this day.
                    </p>
                  ) : (
                    selectedEvents.map((ev) => <EventRow key={ev.date + ev.event} item={ev} />)
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-100 p-4 sm:p-5">
                <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                  Term overview
                </p>
                <div className="mt-3 space-y-4">
                  {academicTerms.map((term) => (
                    <div key={term.term}>
                      <h5 className="text-sm font-bold text-slate-800">{term.term}</h5>
                      <p className="text-xs text-slate-500">{term.period}</p>
                      <ul className="mt-2 space-y-1.5">
                        {term.items.map((item) => (
                          <li
                            key={item.date + item.event}
                            className="flex items-start gap-2 text-xs text-slate-600"
                          >
                            <span
                              className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${eventTypeStyles[item.type].dot}`}
                            />
                            <span>
                              <span className="font-semibold text-slate-700">
                                {item.date}
                              </span>
                              {" · "}
                              {item.event}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <p className="mt-6 text-xs text-slate-500 sm:text-sm">
            Dates are indicative and may be updated by the Academic Office. Check
            Messages for official notices.
          </p>
        </div>
      </div>
    </div>
  );
}

function EventRow({ item }: { item: AcademicCalendarItem }) {
  const style = eventTypeStyles[item.type];
  return (
    <div className={`rounded-xl px-3 py-2.5 ${style.bg}`}>
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${style.dot}`} />
        <span className={`text-[10px] font-bold tracking-wide uppercase ${style.text}`}>
          {style.label}
        </span>
      </div>
      <p className={`mt-1 text-sm font-semibold ${style.text}`}>{item.event}</p>
      <p className="mt-0.5 text-xs text-slate-500">{item.date}</p>
    </div>
  );
}

export default CalendarPage;
