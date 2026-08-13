"use client";

import React, { useEffect, useMemo, useState } from "react";
import Bar from "@/utils/Admin/Bar";
import {
  ArrowRightCircle,
  Award,
  Building2,
  CalendarDays,
  GraduationCap,
  Percent,
  TrendingDown,
  UserX,
} from "lucide-react";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";

type OverviewData = {
  overallAttendance: string;
  below75: number;
  deptBelow75: number;
  sessionsThisMonth: number;
  bestDepartment: string;
  worstDepartment: string;
  bestSemester: string;
  worstSemester: string;
};

type DeptSummary = { name: string; number: number };
type SemSummary = { semName: string; number: number };
type SubjectAlert = {
  subjectName: string;
  issue: string;
  attendance: number;
  faculty: string;
};

function issueClass(issue: string) {
  if (issue.includes("Not Recorded")) return "bg-red-50 text-red-800 ring-1 ring-red-600/15";
  if (issue.includes("Low")) return "bg-amber-50 text-amber-800 ring-1 ring-amber-600/15";
  return "bg-orange-50 text-orange-800 ring-1 ring-orange-600/15";
}

function AdminAttendance() {
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<OverviewData>({
    overallAttendance: "—",
    below75: 0,
    deptBelow75: 0,
    sessionsThisMonth: 0,
    bestDepartment: "—",
    worstDepartment: "—",
    bestSemester: "—",
    worstSemester: "—",
  });
  const [departmentSummary, setDepartmentSummary] = useState<DeptSummary[]>([]);
  const [semesterSummary, setSemesterSummary] = useState<SemSummary[]>([]);
  const [subjectAlerts, setSubjectAlerts] = useState<SubjectAlert[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/admin/attendance");
        if (!res.data?.success) {
          throw new Error(res.data?.message || "Failed to fetch attendance");
        }
        const data = res.data.data || {};
        setOverview({
          overallAttendance: data.overview?.overallAttendance ?? "—",
          below75: data.overview?.below75 ?? 0,
          deptBelow75: data.overview?.deptBelow75 ?? 0,
          sessionsThisMonth: data.overview?.sessionsThisMonth ?? 0,
          bestDepartment: data.overview?.bestDepartment || "—",
          worstDepartment: data.overview?.worstDepartment || "—",
          bestSemester: data.overview?.bestSemester || "—",
          worstSemester: data.overview?.worstSemester || "—",
        });
        setDepartmentSummary(data.departmentSummary || []);
        setSemesterSummary(data.semesterSummary || []);
        setSubjectAlerts(data.subjectAlerts || []);
      } catch (err: unknown) {
        const message = axios.isAxiosError(err)
          ? err.response?.data?.message || err.message
          : err instanceof Error
            ? err.message
            : "Failed to fetch attendance";
        toast.error(message);
        setDepartmentSummary([]);
        setSemesterSummary([]);
        setSubjectAlerts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const overviewStats = useMemo(
    () => [
      {
        label: "Overall Attendance",
        value: overview.overallAttendance,
        hint: "Institution average",
        icon: <Percent size={20} />,
        color: "bg-indigo-100 text-indigo-600",
      },
      {
        label: "Below 75%",
        value: String(overview.below75),
        hint: "Students at risk",
        icon: <UserX size={20} />,
        color: "bg-red-100 text-red-600",
      },
      {
        label: "Dept Below 75%",
        value: String(overview.deptBelow75),
        hint: "Departments flagged",
        icon: <Building2 size={20} />,
        color: "bg-amber-100 text-amber-600",
      },
      {
        label: "Sessions This Month",
        value: String(overview.sessionsThisMonth),
        hint: "Recorded sessions",
        icon: <CalendarDays size={20} />,
        color: "bg-cyan-100 text-cyan-600",
      },
      {
        label: "Best Department",
        value: overview.bestDepartment,
        hint: "Highest average",
        icon: <Award size={20} />,
        color: "bg-emerald-100 text-emerald-600",
      },
      {
        label: "Worst Department",
        value: overview.worstDepartment,
        hint: "Needs attention",
        icon: <TrendingDown size={20} />,
        color: "bg-orange-100 text-orange-600",
      },
      {
        label: "Best Semester",
        value: overview.bestSemester,
        hint: "Top performing",
        icon: <GraduationCap size={20} />,
        color: "bg-violet-100 text-violet-600",
      },
      {
        label: "Worst Semester",
        value: overview.worstSemester,
        hint: "Lowest average",
        icon: <TrendingDown size={20} />,
        color: "bg-rose-100 text-rose-600",
      },
    ],
    [overview],
  );

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-linear-to-br from-slate-50 via-white to-slate-50 flex flex-col lg:flex-row">
      <Bar open={open} setOpen={setOpen} />

      <div className="flex-1 min-w-0 w-full">
        <div className="overflow-hidden bg-white p-5 text-slate-900 shadow-sm sm:p-6 md:p-7 lg:p-6">
          <div className="border-b border-slate-200 pb-6 sm:pb-8">
            <h1 className="text-2xl font-bold font-comfortaa text-slate-900 sm:text-3xl">Attendance</h1>
            <p className="mt-1 text-sm text-slate-600">
              Monitor attendance performance across departments, semesters, and subjects
            </p>
          </div>

          {loading ? (
            <div className="mt-10 py-16 text-center text-sm text-slate-500">Loading attendance data...</div>
          ) : (
            <>
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {overviewStats.map((stat) => (
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
                <h2 className="text-lg font-bold text-slate-900">Department Summary</h2>
                <p className="mt-1 text-sm text-slate-500">Average attendance by department</p>
                {departmentSummary.length === 0 ? (
                  <p className="mt-4 text-sm text-slate-500">No department attendance data yet.</p>
                ) : (
                  <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
                    {departmentSummary.map((item) => (
                      <div key={item.name} className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{item.name}</p>
                        <p className="mt-2 text-3xl font-bold text-slate-900">{item.number}%</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-10">
                <h2 className="text-lg font-bold text-slate-900">Semester Summary</h2>
                <p className="mt-1 text-sm text-slate-500">Average attendance by semester</p>
                {semesterSummary.length === 0 ? (
                  <p className="mt-4 text-sm text-slate-500">No semester attendance data yet.</p>
                ) : (
                  <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
                    {semesterSummary.map((item) => (
                      <div key={item.semName} className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm">
                        <p className="text-xs font-medium text-slate-500">{item.semName}</p>
                        <p className="mt-2 text-2xl font-bold text-slate-900">{item.number}%</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-10">
                <h2 className="text-lg font-bold text-slate-900">Attendance Alerts</h2>
                <p className="mt-1 text-sm text-slate-500">Subjects requiring administrative attention</p>

                <div className="mt-4 hidden lg:block overflow-hidden rounded-2xl border border-slate-200">
                  <div className="grid grid-cols-[1.4fr_1.2fr_0.6fr_1fr_0.8fr] gap-3 border-b border-slate-200 bg-slate-50/90 px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                    {["Subject", "Issue", "Attendance", "Faculty", "Actions"].map((head) => (
                      <div key={head} className="min-w-0 truncate text-center">{head}</div>
                    ))}
                  </div>
                  {subjectAlerts.length === 0 ? (
                    <div className="px-4 py-12 text-center text-sm text-slate-500">No attendance alerts.</div>
                  ) : (
                    subjectAlerts.map((item) => (
                      <div
                        key={item.subjectName}
                        className="grid grid-cols-[1.4fr_1.2fr_0.6fr_1fr_0.8fr] items-center gap-3 border-b border-slate-100 px-4 py-3.5 text-sm transition hover:bg-slate-50/80 last:border-b-0"
                      >
                        <div className="truncate text-left font-medium text-slate-900">{item.subjectName}</div>
                        <div className="flex justify-center">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${issueClass(item.issue)}`}>
                            {item.issue}
                          </span>
                        </div>
                        <div className="text-center font-semibold text-slate-700">{item.attendance}%</div>
                        <div className="truncate text-center text-slate-600">{item.faculty}</div>
                        <div className="flex justify-center">
                          <Link
                            href={`/admin/attendance/subject/${encodeURIComponent(item.subjectName)}`}
                            className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100"
                          >
                            Details
                            <ArrowRightCircle size={14} />
                          </Link>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <ul className="mt-4 divide-y divide-slate-100 lg:hidden" role="list">
                  {subjectAlerts.length === 0 ? (
                    <li className="p-6 text-center text-sm text-slate-500">No attendance alerts.</li>
                  ) : (
                    subjectAlerts.map((item) => (
                      <li key={`${item.subjectName}-mobile`} className="p-3 sm:p-4">
                        <article className="overflow-hidden rounded-2xl border border-slate-200 border-l-[3px] border-l-amber-500 bg-white p-4 shadow-sm">
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="font-bold leading-snug text-slate-900">{item.subjectName}</h3>
                            <span
                              className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${issueClass(item.issue)}`}
                            >
                              {item.attendance}%
                            </span>
                          </div>
                          <p className="mt-2 text-sm text-slate-600">{item.issue}</p>
                          <p className="mt-1 text-xs text-slate-400">Faculty: {item.faculty}</p>
                          <Link
                            href={`/admin/attendance/subject/${encodeURIComponent(item.subjectName)}`}
                            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                          >
                            View Details
                            <ArrowRightCircle size={16} />
                          </Link>
                        </article>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminAttendance;
