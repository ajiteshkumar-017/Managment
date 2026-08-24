"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Bell,
  CalendarDays,
  Clock3,
  Megaphone,
  Pin,
  Search,
  Sparkles,
} from "lucide-react";
import { IllustrationState } from "@/components/illustrations/IllustrationState";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { StudentPanelSkeleton } from "@/components/loading/GlassSkeleton";
import type { NoticeTopic } from "@/constant/notice";

type StudentNotice = {
  _id: string;
  title: string;
  type: NoticeTopic | string;
  audience: string;
  publishedDate: string;
  expiryDate: string;
  description: string;
  isImportant: boolean;
};

const TOPIC_STYLE: Record<string, string> = {
  "Academic Management": "bg-indigo-50 text-indigo-700 ring-indigo-600/15",
  Exam: "bg-rose-50 text-rose-700 ring-rose-600/15",
  Fest: "bg-violet-50 text-violet-700 ring-violet-600/15",
  Cultural: "bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-600/15",
  Holiday: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
  Important: "bg-amber-50 text-amber-800 ring-amber-600/20",
  General: "bg-slate-100 text-slate-700 ring-slate-600/10",
};

function topicClass(type: string) {
  return TOPIC_STYLE[type] ?? TOPIC_STYLE.General;
}

function Messages() {
  const [username, setUsername] = useState("Student");
  const [loading, setLoading] = useState(true);
  const [notices, setNotices] = useState<StudentNotice[]>([]);
  const [search, setSearch] = useState("");
  const [topic, setTopic] = useState("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/users/auth/message");
        if (!response.data?.success) {
          toast.error(response.data?.message || "Failed to load notices");
          return;
        }
        const next: StudentNotice[] = response.data.notices || [];
        setUsername(response.data.username || "Student");
        setNotices(next);
        setSelectedId((current) => {
          if (current && next.some((item) => item._id === current)) return current;
          return next.find((item) => item.isImportant)?._id ?? next[0]?._id ?? null;
        });
      } catch (err) {
        console.error("Error fetching notices:", err);
        toast.error("Failed to load notices");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const topics = useMemo(() => {
    const unique = [...new Set(notices.map((item) => item.type).filter(Boolean))];
    return ["All", ...unique];
  }, [notices]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return notices.filter((item) => {
      const matchesTopic = topic === "All" || item.type === topic;
      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.type.toLowerCase().includes(query);
      return matchesTopic && matchesSearch;
    });
  }, [notices, search, topic]);

  const selected =
    filtered.find((item) => item._id === selectedId) ?? filtered[0] ?? null;

  const importantCount = notices.filter((item) => item.isImportant).length;

  return (
    <>
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:pb-8">
        <div className="min-w-0">
          <h2 className="font-comfortaa text-2xl font-bold text-slate-900 sm:text-3xl">
            Hello {username} 👋
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Campus notices selected for your role
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:gap-3">
          <div className="relative w-full flex-1 sm:w-auto sm:flex-none">
            <Search
              className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400 sm:left-4"
              size={18}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 py-2.5 pr-3 pl-10 text-sm text-slate-900 placeholder-slate-500 transition-all focus:border-transparent focus:ring-2 focus:ring-indigo-500 focus:outline-none sm:w-52 sm:py-3 sm:pr-4 sm:pl-11 md:w-64"
              placeholder="Search notices..."
            />
          </div>
          <NotificationBell />
        </div>
      </div>

      {loading ? (
        <div className="mt-8">
          <StudentPanelSkeleton variant="list" showHeader={false} />
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200/80 bg-linear-to-br from-white to-slate-50 p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-600/10">
                  <Megaphone size={18} />
                </span>
                <div>
                  <p className="text-xs font-medium tracking-wide text-slate-500 uppercase">
                    Visible to you
                  </p>
                  <p className="text-xl font-bold text-slate-900">{notices.length}</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-linear-to-br from-white to-amber-50/40 p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700 ring-1 ring-amber-600/15">
                  <Pin size={18} />
                </span>
                <div>
                  <p className="text-xs font-medium tracking-wide text-slate-500 uppercase">
                    Important
                  </p>
                  <p className="text-xl font-bold text-slate-900">{importantCount}</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-linear-to-br from-white to-violet-50/40 p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 ring-1 ring-violet-600/10">
                  <Sparkles size={18} />
                </span>
                <div>
                  <p className="text-xs font-medium tracking-wide text-slate-500 uppercase">
                    Topics
                  </p>
                  <p className="text-xl font-bold text-slate-900">{Math.max(topics.length - 1, 0)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="font-comfortaa text-xl font-bold text-slate-900 sm:text-2xl">
                  Notice board
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Only announcements published for students
                </p>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {topics.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setTopic(item)}
                    className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold ring-1 transition ${
                      topic === item
                        ? "bg-indigo-600 text-white ring-indigo-600"
                        : "bg-white text-slate-600 ring-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="mt-6 rounded-3xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-10">
                <IllustrationState
                  situation="empty"
                  size="sm"
                  title={notices.length === 0 ? "No notices yet" : "No matching notices"}
                  description={
                    notices.length === 0
                      ? "When admin publishes a notice for students, it will appear here."
                      : "Try another topic or clear the search."
                  }
                />
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.92fr)]">
                <ul className="space-y-3">
                  {filtered.map((notice) => {
                    const active = selected?._id === notice._id;
                    return (
                      <li key={notice._id}>
                        <button
                          type="button"
                          onClick={() => setSelectedId(notice._id)}
                          className={`w-full rounded-2xl border p-4 text-left shadow-sm transition ${
                            active
                              ? "border-indigo-200 bg-indigo-50/50 ring-1 ring-indigo-600/10"
                              : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span
                                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ${topicClass(notice.type)}`}
                                >
                                  {notice.type}
                                </span>
                                {notice.isImportant ? (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-800 ring-1 ring-amber-600/15">
                                    <Pin size={11} /> Pinned
                                  </span>
                                ) : null}
                              </div>
                              <h4 className="mt-2 truncate font-bold text-slate-900">
                                {notice.title}
                              </h4>
                              <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-slate-500">
                                {notice.description}
                              </p>
                            </div>
                            <span className="shrink-0 text-xs font-medium text-slate-400">
                              {notice.publishedDate}
                            </span>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>

                {selected ? (
                  <article className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                    <div className="h-1.5 w-full bg-linear-to-r from-indigo-500 via-violet-500 to-indigo-400" />
                    <div className="p-5 sm:p-6">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${topicClass(selected.type)}`}
                        >
                          {selected.type}
                        </span>
                        {selected.isImportant ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 ring-1 ring-amber-600/15">
                            <Pin size={12} /> Important
                          </span>
                        ) : null}
                      </div>
                      <h3 className="mt-4 font-comfortaa text-2xl font-bold tracking-tight text-slate-900">
                        {selected.title}
                      </h3>
                      <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDays size={15} className="text-indigo-500" />
                          Published {selected.publishedDate}
                        </span>
                        {selected.expiryDate && selected.expiryDate !== "—" ? (
                          <span className="inline-flex items-center gap-1.5">
                            <Clock3 size={15} className="text-amber-600" />
                            Expires {selected.expiryDate}
                          </span>
                        ) : null}
                        <span className="inline-flex items-center gap-1.5">
                          <Bell size={15} className="text-slate-400" />
                          {selected.audience}
                        </span>
                      </div>
                      <div className="mt-6 rounded-2xl bg-slate-50 p-4 sm:p-5">
                        <p className="text-sm leading-7 whitespace-pre-wrap text-slate-700">
                          {selected.description}
                        </p>
                      </div>
                    </div>
                  </article>
                ) : null}
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default Messages;
