"use client";

import Bar from "@/utils/Admin/Bar";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import {
  ArrowLeft,
  ArrowRightCircle,
  BookOpen,
  Download,
  Percent,
  UserX,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  getDepartmentOverview,
  getPerformanceLevel,
  getSubjectsForSemester,
  performanceBadgeClass,
  performanceLabel,
  performanceNameClass,
  performanceRowClass,
} from "../../../_data/departmentPerformance";
import { exportSemesterReport } from "../../../_data/exportReport";

function SemesterSubjectsPage() {
  const [open, setOpen] = useState(true);
  const [exporting, setExporting] = useState(false);
  const params = useParams();

  const rawDept = params?.department;
  const department = Array.isArray(rawDept)
    ? decodeURIComponent(rawDept[0] || "")
    : rawDept
      ? decodeURIComponent(rawDept)
      : "AE";

  const rawSem = params?.semester;
  const semester = Array.isArray(rawSem)
    ? decodeURIComponent(rawSem[0] || "")
    : rawSem
      ? decodeURIComponent(rawSem)
      : "1";

  const overview = getDepartmentOverview(department);
  const subjects = getSubjectsForSemester(department, semester);
  const poorCount = subjects.filter((s) => getPerformanceLevel(s.passRate) === "poor").length;
  const warningCount = subjects.filter((s) => getPerformanceLevel(s.passRate) === "warning").length;
  const avgPass =
    subjects.length > 0
      ? Math.round((subjects.reduce((sum, s) => sum + s.passRate, 0) / subjects.length) * 10) / 10
      : 0;

  const handleExport = () => {
    setExporting(true);
    try {
      exportSemesterReport(department, semester);
      toast.success("Semester PDF report downloaded");
    } catch {
      toast.error("Failed to export report");
    } finally {
      setExporting(false);
    }
  };

  const stats = [
    { label: "Subjects", value: String(subjects.length), hint: `Semester ${semester}`, icon: <BookOpen size={20} />, color: "bg-indigo-100 text-indigo-600" },
    { label: "Avg Pass %", value: `${avgPass}%`, hint: "Across subjects", icon: <Percent size={20} />, color: "bg-cyan-100 text-cyan-600" },
    { label: "Poor Subjects", value: String(poorCount), hint: "Below 70% pass", icon: <UserX size={20} />, color: "bg-red-100 text-red-600" },
    { label: "Needs Attention", value: String(warningCount), hint: "70–79% pass", icon: <Users size={20} />, color: "bg-amber-100 text-amber-600" },
  ];

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-linear-to-br from-slate-50 via-white to-slate-50 flex flex-col lg:flex-row">
      <Bar open={open} setOpen={setOpen} />

      <div className="flex-1 min-w-0 w-full">
        <div className="overflow-hidden bg-white p-5 text-slate-900 shadow-sm sm:p-6 md:p-7 lg:p-6">
          <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-start sm:justify-between sm:pb-8">
            <div className="min-w-0">
              <Link
                href={`/admin/results/${encodeURIComponent(department)}`}
                className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 transition hover:text-indigo-800"
              >
                <ArrowLeft size={16} />
                Back to {overview.code}
              </Link>
              <h1 className="text-2xl font-bold font-comfortaa text-slate-900 sm:text-3xl">
                {overview.code} · Semester {semester}
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Subject-wise performance · poor subjects highlighted in red
              </p>
            </div>
            <button
              type="button"
              onClick={handleExport}
              disabled={exporting}
              className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Download size={18} />
              {exporting ? "Exporting..." : "Export"}
            </button>
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
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Subjects</h2>
                  {/* <p className="mt-1 text-sm text-slate-500">
                    Same color coding as department semester table — click a subject for faculty actions
                  </p> */}
              </div>
              <div className="flex flex-wrap gap-2 text-xs font-medium">
                <span className="rounded-full bg-red-100 px-2.5 py-1 text-red-800">Poor (&lt;70%)</span>
                <span className="rounded-full bg-amber-100 px-2.5 py-1 text-amber-800">Needs Attention (70–79%)</span>
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-emerald-800">Healthy (≥80%)</span>
              </div>
            </div>

            <div className="mt-4 hidden lg:block overflow-hidden rounded-2xl border border-slate-200">
              <div className="grid grid-cols-[1.4fr_0.7fr_0.8fr_0.7fr_0.7fr_1.2fr_0.9fr] gap-3 border-b border-slate-200 bg-slate-50/90 px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                {["Subject", "Code", "Pass %", "Avg Marks", "Failed", "Faculty", "Details"].map((head) => (
                  <div key={head} className="min-w-0 truncate text-center">{head}</div>
                ))}
              </div>
              {subjects.map((row) => {
                const level = getPerformanceLevel(row.passRate);
                return (
                  <div
                    key={row.code}
                    className={`grid grid-cols-[1.4fr_0.7fr_0.8fr_0.7fr_0.7fr_1.2fr_0.9fr] items-center gap-3 border-b border-slate-100 px-4 py-3.5 text-sm last:border-b-0 ${performanceRowClass(level)}`}
                  >
                    <div className={`truncate text-left font-semibold ${performanceNameClass(level)}`} title={row.name}>
                      {row.name}
                    </div>
                    <div className="text-center text-slate-600">{row.code}</div>
                    <div className="flex justify-center">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${performanceBadgeClass(level)}`}>
                        {row.passRate}% · {performanceLabel(level)}
                      </span>
                    </div>
                    <div className="text-center text-slate-700">{row.avgMarks}</div>
                    <div className="text-center font-medium text-slate-700">{row.failed}</div>
                    <div className="truncate text-center text-slate-600" title={row.faculty}>{row.faculty}</div>
                    <div className="flex justify-center">
                      <Link
                        href={`/admin/results/${encodeURIComponent(department)}/semester/${encodeURIComponent(semester)}/subject/${encodeURIComponent(row.name)}`}
                        className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100"
                      >
                        Open
                        <ArrowRightCircle size={14} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            <ul className="mt-4 divide-y divide-slate-100 lg:hidden" role="list">
              {subjects.map((row) => {
                const level = getPerformanceLevel(row.passRate);
                return (
                  <li key={`${row.code}-m`} className="p-3 sm:p-4">
                    <article className={`overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm ${performanceRowClass(level)}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className={`font-bold leading-snug ${performanceNameClass(level)}`}>{row.name}</h3>
                          <p className="mt-1 text-xs text-slate-500">{row.code}</p>
                        </div>
                        <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${performanceBadgeClass(level)}`}>
                          {row.passRate}%
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-slate-600">
                        Avg {row.avgMarks} · {row.failed} failed · {performanceLabel(level)}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">Faculty: {row.faculty}</p>
                      <Link
                        href={`/admin/results/${encodeURIComponent(department)}/semester/${encodeURIComponent(semester)}/subject/${encodeURIComponent(row.name)}`}
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                      >
                        View Faculty & Actions
                        <ArrowRightCircle size={16} />
                      </Link>
                    </article>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SemesterSubjectsPage;
