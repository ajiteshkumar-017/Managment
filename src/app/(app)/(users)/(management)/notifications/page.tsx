"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { NotificationBell, NotificationCopy, type AppInboxItem } from "@/components/notifications/NotificationBell";
import { IllustrationState } from "@/components/illustrations/IllustrationState";
import { StudentPanelSkeleton } from "@/components/loading/GlassSkeleton";

export default function NotificationsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<AppInboxItem[]>([]);
  const [markingAll, setMarkingAll] = useState(false);

  const load = async () => {
    try {
      const res = await axios.get("/api/notification");
      if (res.data?.success) setItems(res.data.data || []);
      else toast.error(res.data?.message || "Failed to load notifications");
    } catch (err: unknown) {
      toast.error(
        axios.isAxiosError(err)
          ? err.response?.data?.message || "Failed to load notifications"
          : "Failed to load notifications",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const markAllRead = async () => {
    setMarkingAll(true);
    try {
      await axios.post("/api/notification/read-all");
      setItems((prev) => prev.map((item) => ({ ...item, isRead: true })));
    } catch {
      toast.error("Failed to mark all as read");
    } finally {
      setMarkingAll(false);
    }
  };

  const openItem = async (item: AppInboxItem) => {
    if (!item.isRead) {
      try {
        await axios.post(`/api/notification/${item.receiptId}/read`);
        setItems((prev) =>
          prev.map((row) =>
            row.receiptId === item.receiptId ? { ...row, isRead: true } : row,
          ),
        );
      } catch {
        // still allow navigation
      }
    }
    if (item.link) router.push(item.link);
  };

  return (
    <>
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:pb-8">
        <div className="min-w-0">
          <h2 className="font-comfortaa text-2xl font-bold text-slate-900 sm:text-3xl">
            Notifications
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Assignments, attendance, results, and campus notices
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={markAllRead}
            disabled={markingAll || items.every((item) => item.isRead)}
            className="w-fit rounded-lg bg-teal-600 px-3 py-2 font-poppins text-xs font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-teal-300"
          >
            {markingAll ? "Updating..." : "Mark all as read"}
          </button>
          <NotificationBell />
        </div>
      </div>

      {loading ? (
        <StudentPanelSkeleton variant="list" showHeader={false} />
      ) : items.length === 0 ? (
        <IllustrationState
          situation="empty"
          title="No notifications yet"
          description="When faculty or admin send updates, they will show up here."
        />
      ) : (
        <div className="mt-6 divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {items.map((item) => (
            <button
              key={item.receiptId}
              type="button"
              onClick={() => openItem(item)}
              className={`flex w-full flex-col gap-1.5 px-5 py-4 text-left transition hover:bg-slate-50 ${
                item.isRead ? "bg-white" : "bg-indigo-50/60"
              }`}
            >
              <NotificationCopy item={item} />
            </button>
          ))}
        </div>
      )}
    </>
  );
}
