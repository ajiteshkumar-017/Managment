"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { ClipboardList, Download, Search } from "lucide-react";
import { IllustrationState } from "@/components/illustrations/IllustrationState";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { StudentPanelSkeleton } from "@/components/loading/GlassSkeleton";

type AssignmentRow = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  marks: number;
  department: string;
  semester: number;
  batch: string;
  attachement: string;
  subjectName: string;
  subjectCode: string;
  facultyName: string;
  dueStatus: "upcoming" | "due_today" | "overdue";
};

function statusLabel(status: AssignmentRow["dueStatus"]) {
  if (status === "overdue") return "Overdue";
  if (status === "due_today") return "Due today";
  return "Upcoming";
}

function statusClass(status: AssignmentRow["dueStatus"]) {
  if (status === "overdue")
    return "bg-orange-100 text-orange-600 ring-1 ring-orange-600/10";
  if (status === "due_today")
    return "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600/15";
  return "bg-purple-100 text-purple-600 ring-1 ring-purple-600/10";
}

function formatDue(dueDate: string) {
  return new Date(dueDate).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function StudentAssignmentsPage() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState<AssignmentRow[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [nameRes, assignRes] = await Promise.all([
          fetch("/api/users/getUsername").then((res) => res.json()),
          axios.get("/api/users/auth/assignments"),
        ]);
        setUsername(nameRes.username || "");
        if (!assignRes.data?.success) {
          toast.error(assignRes.data?.message || "Failed to load assignments");
          return;
        }
        setAssignments(assignRes.data.data || []);
      } catch (err: unknown) {
        toast.error(
          axios.isAxiosError(err)
            ? err.response?.data?.message || "Failed to load assignments"
            : "Failed to load assignments",
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <>
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:pb-8">
        <div className="min-w-0 text-left">
          <h2 className="font-comfortaa text-2xl font-bold text-slate-900 sm:text-3xl">
            My Assignments
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            {username
              ? `Assignments published by faculty for you, ${username}`
              : "Assignments published by your faculty"}
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:gap-3">
          <div className="relative w-full flex-1 sm:w-auto sm:flex-none">
            <Search
              className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400 sm:left-4"
              size={18}
            />
            <input
              className="w-full rounded-xl border border-slate-200 py-2.5 pr-3 pl-10 text-sm text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none sm:w-52 sm:py-3 sm:pr-4 sm:pl-11 md:w-60 lg:w-64"
              placeholder="Search..."
            />
          </div>
          <NotificationBell />
        </div>
      </div>

      {loading ? (
        <StudentPanelSkeleton variant="table" showHeader={false} />
      ) : assignments.length === 0 ? (
        <IllustrationState
          situation="empty"
          title="No assignments yet"
          description="Nothing has been published for your class yet."
        />
      ) : (
        <>
          <div className="mt-6 hidden overflow-hidden rounded-2xl border border-slate-200 lg:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs tracking-wide text-slate-500 uppercase">
                <tr>
                  <th className="px-4 py-3 font-semibold">Task</th>
                  <th className="px-4 py-3 font-semibold">Subject</th>
                  <th className="px-4 py-3 font-semibold">Due</th>
                  <th className="px-4 py-3 font-semibold">Marks</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">File</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((a) => (
                  <tr key={a.id} className="border-t border-slate-100">
                    <td className="px-4 py-3.5">
                      <p className="font-semibold text-slate-900">{a.title}</p>
                      <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">
                        {a.description}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {a.facultyName}
                      </p>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600">
                      {a.subjectName} · {a.subjectCode}
                    </td>
                    <td className="px-4 py-3.5 text-slate-600">
                      {formatDue(a.dueDate)}
                    </td>
                    <td className="px-4 py-3.5 text-slate-600">{a.marks}</td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClass(a.dueStatus)}`}
                      >
                        {statusLabel(a.dueStatus)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      {a.attachement ? (
                        <a
                          href={a.attachement}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                        >
                          <Download size={14} />
                          Download
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400">None</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 lg:hidden">
            {assignments.map((a) => (
              <div
                key={a.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700">
                      <ClipboardList size={18} />
                    </span>
                    <div>
                      <p className="font-semibold text-slate-900">{a.title}</p>
                      <p className="mt-0.5 text-sm text-indigo-600">
                        {a.subjectName} · {a.subjectCode}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClass(a.dueStatus)}`}
                  >
                    {statusLabel(a.dueStatus)}
                  </span>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                  {a.description}
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  Due {formatDue(a.dueDate)} · {a.marks} marks · {a.facultyName}
                </p>
                {a.attachement && (
                  <a
                    href={a.attachement}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                  >
                    <Download size={14} />
                    Download attachment
                  </a>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
