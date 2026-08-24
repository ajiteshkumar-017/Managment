"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Bell } from "lucide-react";

export type AppInboxItem = {
  id: string;
  receiptId: string;
  kind?: string;
  title: string;
  message: string;
  link: string | null;
  isRead: boolean;
  createdAt?: string;
};

export function formatNotificationTime(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const day = date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const time = date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });
  return { day, time };
}

export function NotificationCopy({
  item,
  compact = false,
}: {
  item: AppInboxItem;
  compact?: boolean;
}) {
  const stamped = formatNotificationTime(item.createdAt);

  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <p
          className={`font-poppins font-bold tracking-tight text-slate-900 ${
            compact ? "text-sm" : "text-[15px] sm:text-base"
          }`}
        >
          {item.title}
        </p>
        {!item.isRead ? (
          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-indigo-600" />
        ) : null}
      </div>
      <p
        className={`font-lato leading-relaxed text-slate-600 ${
          compact ? "line-clamp-2 text-xs" : "text-sm"
        }`}
      >
        {item.message}
      </p>
      {stamped ? (
        <p className="font-mono text-[11px] tracking-wide text-slate-400">
          <span>{stamped.day}</span>
          <span className="mx-1.5 text-slate-300">·</span>
          <span>{stamped.time}</span>
        </p>
      ) : null}
    </>
  );
}

export function NotificationBell() {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const [items, setItems] = useState<AppInboxItem[]>([]);

  const loadUnread = async () => {
    try {
      const res = await axios.get("/api/notification/un-readCount");
      if (res.data?.success) setUnread(Number(res.data.data?.count ?? 0));
    } catch {
      setUnread(0);
    }
  };

  const loadInbox = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/notification");
      if (res.data?.success) {
        const next = (res.data.data || []) as AppInboxItem[];
        setItems(next.slice(0, 8));
        setUnread(next.filter((item) => !item.isRead).length);
      }
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUnread();
  }, []);

  useEffect(() => {
    if (open) loadInbox();
  }, [open]);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  const openItem = async (item: AppInboxItem) => {
    if (!item.isRead) {
      try {
        await axios.post(`/api/notification/${item.receiptId}/read`);
        setItems((prev) =>
          prev.map((row) =>
            row.receiptId === item.receiptId ? { ...row, isRead: true } : row,
          ),
        );
        setUnread((count) => Math.max(0, count - 1));
      } catch {
        // still allow navigation
      }
    }
    setOpen(false);
    if (item.link) router.push(item.link);
    else router.push("/notifications");
  };

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label="Notifications"
        className="relative flex items-center justify-center rounded-lg bg-indigo-600 p-2.5 text-white transition-all hover:bg-indigo-700 sm:rounded-xl sm:p-3"
      >
        <Bell size={18} />
        {unread > 0 ? (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <p className="text-sm font-semibold text-slate-900">Notifications</p>
            <Link
              href="/notifications"
              onClick={() => setOpen(false)}
              className="text-xs font-semibold text-indigo-600 hover:underline"
            >
              View all
            </Link>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <p className="px-4 py-8 text-center text-sm text-slate-500">
                Loading...
              </p>
            ) : items.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-slate-500">
                No notifications yet
              </p>
            ) : (
              items.map((item) => (
                <button
                  key={item.receiptId}
                  type="button"
                  onClick={() => openItem(item)}
                  className={`flex w-full flex-col gap-0.5 border-b border-slate-100 px-4 py-3 text-left last:border-b-0 hover:bg-slate-50 ${
                    item.isRead ? "bg-white" : "bg-indigo-50/70"
                  }`}
                >
                  <NotificationCopy item={item} compact />
                </button>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
