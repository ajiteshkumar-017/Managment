"use client";

import { Download, Search } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { IllustrationState } from "@/components/illustrations/IllustrationState";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { StudentPanelSkeleton } from "@/components/loading/GlassSkeleton";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

type TimetableEntry = {
  day: string;
  startTime: string;
  endTime: string;
  time: string;
  subject: string;
  faculty: string;
  room: string;
};

function Timetable() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [entries, setEntries] = useState<TimetableEntry[]>([]);

  const timeSlots = useMemo(() => {
    const seen = new Map<string, string>();
    for (const item of entries) {
      const key = `${item.startTime}|${item.endTime}`;
      if (!seen.has(key)) seen.set(key, item.time);
    }
    return [...seen.entries()].map(([key, label]) => ({ key, label }));
  }, [entries]);

  const timetableMap = useMemo(() => {
    const map: Record<string, Record<string, TimetableEntry>> = {};
    for (const item of entries) {
      const slotKey = `${item.startTime}|${item.endTime}`;
      if (!map[item.day]) map[item.day] = {};
      map[item.day][slotKey] = item;
    }
    return map;
  }, [entries]);

  useEffect(() => {
    const load = async () => {
      try {
        const [nameRes, tableRes] = await Promise.all([
          fetch("/api/users/getUsername").then((res) => res.json()),
          axios.get("/api/users/auth/timetable"),
        ]);
        setUsername(nameRes.username || "");
        if (!tableRes.data?.success) {
          toast.error(tableRes.data?.message || "Failed to load timetable");
          return;
        }
        setEntries(tableRes.data.data.entries || []);
      } catch (err: unknown) {
        toast.error(
          axios.isAxiosError(err)
            ? err.response?.data?.message || "Failed to load timetable"
            : "Failed to load timetable",
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const downloadTimetable = async () => {
    setDownloading(true);
    try {
      const res = await axios.get("/api/users/auth/timetable/downloadTimetable", {
        responseType: "blob",
      });

      const disposition = String(res.headers["content-disposition"] || "");
      const matched = disposition.match(/filename="([^"]+)"/);
      const filename = matched?.[1] || "timetable.pdf";

      const url = URL.createObjectURL(res.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err: unknown) {
      toast.error(
        axios.isAxiosError(err)
          ? err.response?.data?.message || "Failed to download timetable"
          : "Failed to download timetable",
      );
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:pb-8">
        <div className="min-w-0">
          <h2 className="font-comfortaa text-2xl font-bold text-slate-900 sm:text-3xl">
            Hello {username} 👋
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Your weekly class timetable
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

          <NotificationBell />
        </div>
      </div>

      <div className="mt-6 p-4 sm:mt-8 md:mt-10 lg:mt-12">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900 sm:text-xl">
            Class Timetable
          </h3>

          <button
            type="button"
            onClick={downloadTimetable}
            disabled={downloading || loading}
            className="m-4 flex shrink-0 cursor-pointer items-center justify-between gap-2 rounded-lg bg-violet-600 px-2 py-3 text-white transition-all duration-300 hover:scale-95 hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60 sm:rounded-xl"
          >
            <Download />
            <p className="text-sm font-bold tracking-wider">
              {downloading ? "Downloading…" : "Download Timetable"}
            </p>
          </button>
        </div>

        <div className="overflow-x-auto rounded-2xl shadow-lg">
          {loading ? (
            <StudentPanelSkeleton variant="timetable" showHeader={false} />
          ) : entries.length === 0 ? (
            <IllustrationState
              situation="empty"
              title="No classes found"
              description="Your timetable hasn’t been published yet."
            />
          ) : (
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border p-4">Day</th>
                  {timeSlots.map((slot) => (
                    <th key={slot.key} className="border p-4">
                      {slot.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DAYS.map((day) => (
                  <tr key={day}>
                    <td className="border bg-slate-50 p-4 font-semibold">{day}</td>
                    {timeSlots.map((slot) => {
                      const classData = timetableMap[day]?.[slot.key];
                      return (
                        <td key={slot.key} className="border p-3 text-center">
                          {classData ? (
                            <div>
                              <p className="font-semibold">{classData.subject}</p>
                              <div className="mt-1 flex items-center justify-between">
                                <p className="text-sm text-slate-500">
                                  {classData.faculty}
                                </p>
                                <p className="text-xs text-slate-400">
                                  {classData.room}
                                </p>
                              </div>
                            </div>
                          ) : (
                            "-"
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}

export default Timetable;
