"use client";

import Bar from "@/utils/Admin/Bar";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ArrowLeft,
  Bell,
  BookOpen,
  Download,
  Mail,
  MessageSquareWarning,
  Percent,
  UserX,
  Users,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  getPerformanceLevel,
  performanceBadgeClass,
  performanceLabel,
  performanceNameClass,
} from "../../../../../_data/departmentPerformance";
import { exportSubjectReport } from "../../../../../_data/exportReport";

type ConfirmAction = "faculty" | "reason" | "hod" | "both" | null;

type SubjectMeta = {
  name: string;
  code: string;
  passRate: number;
  avgMarks: number;
  students: number;
  failed: number;
  faculty: string;
  facultyEmail: string;
  hasResults?: boolean;
};

function SubjectPerformanceDetailPage() {
  const [open, setOpen] = useState(true);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reasonNote, setReasonNote] = useState("");
  const [hod, setHod] = useState("—");
  const [meta, setMeta] = useState<SubjectMeta>({
    name: "Subject",
    code: "—",
    passRate: 0,
    avgMarks: 0,
    students: 0,
    failed: 0,
    faculty: "Unassigned",
    facultyEmail: "",
  });
  const params = useParams();

  const rawDept = params?.department;
  const department = Array.isArray(rawDept)
    ? decodeURIComponent(rawDept[0] || "")
    : rawDept
      ? decodeURIComponent(rawDept)
      : "";

  const rawSem = params?.semester;
  const semester = Array.isArray(rawSem)
    ? decodeURIComponent(rawSem[0] || "")
    : rawSem
      ? decodeURIComponent(rawSem)
      : "";

  const rawName = params?.name;
  const subjectName = Array.isArray(rawName)
    ? decodeURIComponent(rawName[0] || "")
    : rawName
      ? decodeURIComponent(rawName)
      : "Subject";

  useEffect(() => {
    if (!department || !semester || !subjectName) return;

    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const res = await axios.get(
          `/api/admin/result/${encodeURIComponent(department)}/semester/${encodeURIComponent(semester)}/subject/${encodeURIComponent(subjectName)}`,
        );
        if (!res.data?.success) {
          toast.error(res.data?.message || "Failed to fetch subject details");
          return;
        }
        if (cancelled) return;

        const s = res.data.data?.subject;
        setMeta({
          name: s?.name || subjectName,
          code: s?.code || "—",
          passRate: s?.passRate ?? 0,
          avgMarks: s?.avgMarks ?? 0,
          students: s?.students ?? 0,
          failed: s?.failed ?? 0,
          faculty: s?.faculty || "Unassigned",
          facultyEmail: s?.facultyEmail || "",
          hasResults: Boolean(s?.hasResults),
        });
        setHod(res.data.data?.hod || "—");
      } catch (err: any) {
        if (!cancelled) {
          toast.error(
            err?.response?.data?.message || "Failed to fetch subject details",
          );
          setMeta((prev) => ({ ...prev, name: subjectName }));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [department, semester, subjectName]);

  const level = getPerformanceLevel(meta.passRate, Boolean(meta.hasResults));

  const stats = [
    { label: "Pass %", value: `${meta.passRate}%`, hint: performanceLabel(level), icon: <Percent size={20} />, color: "bg-orange-100 text-orange-600" },
    { label: "Avg Marks", value: String(meta.avgMarks), hint: "Out of 100", icon: <BookOpen size={20} />, color: "bg-indigo-100 text-indigo-600" },
    { label: "Students", value: String(meta.students), hint: "Exam records", icon: <Users size={20} />, color: "bg-cyan-100 text-cyan-600" },
    { label: "Failed", value: String(meta.failed), hint: "Below pass mark", icon: <UserX size={20} />, color: "bg-red-100 text-red-600" },
  ];

  const handleExport = () => {
    setExporting(true);
    try {
      exportSubjectReport({
        department,
        semester,
        hod,
        subject: {
          name: meta.name,
          code: meta.code,
          passRate: meta.passRate,
          avgMarks: meta.avgMarks,
          students: meta.students,
          failed: meta.failed,
          faculty: meta.faculty,
          facultyEmail: meta.facultyEmail,
          hasResults: meta.hasResults,
        },
      });
      toast.success("Subject PDF report downloaded");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to export report";
      toast.error(message);
    } finally {
      setExporting(false);
    }
  };

  const runAction = async (type: Exclude<ConfirmAction, null>) => {
    setConfirmAction(null);
    setActionLoading(type);
    const toastId = toast.loading("Sending sample notification...");
    try {
      await new Promise((r) => setTimeout(r, 800));

      if (type === "faculty") {
        toast.success(
          `Sample: Informed ${meta.faculty} about ${meta.name} (${meta.passRate}% pass).`,
          { id: toastId },
        );
      } else if (type === "reason") {
        toast.success(
          `Sample: Asked ${meta.faculty} for a reason${reasonNote.trim() ? ` (note attached)` : ""}.`,
          { id: toastId },
        );
        setReasonNote("");
      } else if (type === "hod") {
        toast.success(
          `Sample: Notified HOD (${hod}) about ${meta.name}.`,
          { id: toastId },
        );
      } else {
        toast.success(
          `Sample: Asked ${meta.faculty} for a reason and informed HOD (${hod}).`,
          { id: toastId },
        );
        setReasonNote("");
      }
    } catch {
      toast.error("Action failed", { id: toastId });
    } finally {
      setActionLoading(null);
    }
  };

  const actions = [
    {
      id: "faculty" as const,
      icon: Bell,
      label: "Inform Faculty",
      sub: "Send performance alert",
      color: "bg-indigo-100 text-indigo-600",
      onClick: () => setConfirmAction("faculty"),
    },
    {
      id: "reason" as const,
      icon: MessageSquareWarning,
      label: "Ask Faculty for Reason",
      sub: "Request explanation",
      color: "bg-amber-100 text-amber-600",
      onClick: () => setConfirmAction("reason"),
    },
    {
      id: "hod" as const,
      icon: Mail,
      label: "Notify HOD",
      sub: `Escalate to ${hod}`,
      color: "bg-red-100 text-red-600",
      onClick: () => setConfirmAction("hod"),
    },
    {
      id: "both" as const,
      icon: Users,
      label: "Reason + Inform HOD",
      sub: "Ask faculty and escalate",
      color: "bg-violet-100 text-violet-600",
      onClick: () => setConfirmAction("both"),
    },
  ];

  const confirmTitle =
    confirmAction === "faculty"
      ? "Inform Faculty"
      : confirmAction === "reason"
        ? "Ask Faculty for Reason"
        : confirmAction === "hod"
          ? "Notify HOD"
          : "Ask Reason & Inform HOD";

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-linear-to-br from-slate-50 via-white to-slate-50 flex flex-col lg:flex-row">
      <Bar open={open} setOpen={setOpen} />

      <div className="flex-1 min-w-0 w-full">
        <div className="overflow-hidden bg-white p-5 text-slate-900 shadow-sm sm:p-6 md:p-7 lg:p-6">
          <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-start sm:justify-between sm:pb-8">
            <div className="min-w-0">
              <Link
                href={`/admin/results/${encodeURIComponent(department)}/semester/${encodeURIComponent(semester)}`}
                className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 transition hover:text-indigo-800"
              >
                <ArrowLeft size={16} />
                Back to Semester {semester}
              </Link>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className={`text-2xl font-bold font-comfortaa sm:text-3xl ${performanceNameClass(level)}`}>
                  {meta.name}
                </h1>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${performanceBadgeClass(level)}`}>
                  {performanceLabel(level)} · {meta.passRate}%
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-600">
                {department} · Semester {semester} · {meta.code}
              </p>
            </div>
            <button
              type="button"
              onClick={handleExport}
              disabled={exporting}
              className="inline-flex w-full items-center justify-center gap-2 self-stretch rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:self-start"
            >
              <Download size={18} />
              {exporting ? "Exporting..." : "Export"}
            </button>
          </div>

          {loading ? (
            <p className="mt-8 text-sm text-slate-500">Loading subject details…</p>
          ) : (
            <>
              <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
                  <span className="rounded-xl bg-indigo-100 p-2.5 text-indigo-600">
                    <Users size={20} />
                  </span>
                  <div>
                    <h2 className="font-bold text-slate-900">Faculty Details</h2>
                    <p className="text-sm text-slate-500">Assigned instructor for this subject</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-px bg-slate-100 sm:grid-cols-3">
                  {[
                    { label: "Faculty", value: meta.faculty },
                    { label: "Email", value: meta.facultyEmail || "—" },
                    { label: "Department HOD", value: hod },
                  ].map((item) => (
                    <div key={item.label} className="bg-white px-5 py-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{item.label}</p>
                      <p className="mt-1 font-semibold text-slate-900 break-all">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{stat.label}</p>
                        <h3 className="mt-2 text-2xl font-bold text-slate-900">{stat.value}</h3>
                        <p className="mt-1 text-xs text-slate-500">{stat.hint}</p>
                      </div>
                      <span className={`rounded-xl p-2.5 ${stat.color}`}>{stat.icon}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <h2 className="text-lg font-bold text-slate-900">Admin Actions</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Sample notifications for now — email system comes later
                </p>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {actions.map((action) => (
                    <button
                      key={action.id}
                      type="button"
                      disabled={actionLoading !== null}
                      onClick={action.onClick}
                      className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50/30 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <span className={`rounded-xl p-3 ${action.color}`}>
                        <action.icon size={22} />
                      </span>
                      <div className="text-center">
                        <p className="font-semibold text-slate-900">
                          {actionLoading === action.id ? "Processing..." : action.label}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-500">{action.sub}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold font-comfortaa text-slate-900">{confirmTitle}</h3>
              <button type="button" onClick={() => setConfirmAction(null)} className="rounded-full p-2 hover:bg-slate-100">
                <X size={22} />
              </button>
            </div>
            <p className="text-sm text-slate-600">
              {confirmAction === "faculty" &&
                `Send a sample performance alert to ${meta.faculty} for ${meta.name}?`}
              {confirmAction === "reason" &&
                `Request ${meta.faculty} to explain the pass rate (${meta.passRate}%) in ${meta.name}?`}
              {confirmAction === "hod" &&
                `Escalate poor performance in ${meta.name} (${meta.passRate}% pass) to HOD (${hod})?`}
              {confirmAction === "both" &&
                `Ask ${meta.faculty} for a reason and also inform HOD (${hod}) about ${meta.name}?`}
            </p>
            {(confirmAction === "reason" || confirmAction === "both") && (
              <textarea
                value={reasonNote}
                onChange={(e) => setReasonNote(e.target.value)}
                placeholder="Optional note for faculty..."
                rows={3}
                className="mt-4 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            )}
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmAction(null)}
                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => runAction(confirmAction)}
                className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SubjectPerformanceDetailPage;
