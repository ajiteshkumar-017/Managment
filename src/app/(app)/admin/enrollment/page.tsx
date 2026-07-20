"use client";

import React, { useEffect, useMemo, useState } from "react";
import Bar from "@/utils/Admin/Bar";
import {
  Building2,
  CheckCircle2,
  Search,
  UserMinus,
  Users,
  X,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

type EnrollmentRow = {
  rollNo: string;
  studentName: string;
  classCode: string;
  room: string;
  subjectCode: string;
  subjectName: string;
  department: string;
  semester: string;
  enrolledAt: string;
  status: "Active" | "Withdrawn";
};

type EnrollmentStats = {
  total: number;
  active: number;
  withdrawn: number;
  departments: number;
};

const PAGE_SIZE = 8;
const formatCount = (n: number) => n.toLocaleString();

function statusClass(status: EnrollmentRow["status"]) {
  return status === "Active"
    ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-600/15"
    : "bg-red-50 text-red-800 ring-1 ring-red-600/15";
}

function Enrollment() {
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<EnrollmentRow[]>([]);
  const [stats, setStats] = useState<EnrollmentStats>({
    total: 0,
    active: 0,
    withdrawn: 0,
    departments: 0,
  });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [largeScreen, setLargeScreen] = useState(false);

  useEffect(() => {
    const onResize = () => setLargeScreen(window.innerWidth >= 1024);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/admin/enrollment");
        if (!res.data?.success) {
          throw new Error(res.data?.message || "Failed to fetch enrollments");
        }

        const data: EnrollmentRow[] = (res.data.data || []).map((e: EnrollmentRow) => ({
          rollNo: e.rollNo || "—",
          studentName: e.studentName || "—",
          classCode: e.classCode || "—",
          room: e.room || "—",
          subjectCode: e.subjectCode || "—",
          subjectName: e.subjectName || "—",
          department: e.department || "—",
          semester: String(e.semester ?? "—"),
          enrolledAt: e.enrolledAt || "—",
          status: e.status === "Withdrawn" ? "Withdrawn" : "Active",
        }));

        setRows(data);
        setStats({
          total: res.data.stats?.total ?? data.length,
          active: res.data.stats?.active ?? 0,
          withdrawn: res.data.stats?.withdrawn ?? 0,
          departments: res.data.stats?.departments ?? 0,
        });
      } catch (err: unknown) {
        const message = axios.isAxiosError(err)
          ? err.response?.data?.message || err.message
          : err instanceof Error
            ? err.message
            : "Failed to fetch enrollments";
        toast.error(message);
        setRows([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const enrollmentStats = useMemo(
    () => [
      {
        label: "Total Enrolled",
        value: formatCount(stats.total),
        hint: "Across all departments",
        icon: <Users size={20} />,
        color: "bg-indigo-100 text-indigo-600",
      },
      {
        label: "Active",
        value: formatCount(stats.active),
        hint: "Currently attending",
        icon: <CheckCircle2 size={20} />,
        color: "bg-emerald-100 text-emerald-600",
      },
      {
        label: "Withdrawn",
        value: formatCount(stats.withdrawn),
        hint: "No longer enrolled",
        icon: <UserMinus size={20} />,
        color: "bg-red-100 text-red-600",
      },
      {
        label: "Departments",
        value: formatCount(stats.departments),
        hint: "With enrollments",
        icon: <Building2 size={20} />,
        color: "bg-violet-100 text-violet-600",
      },
    ],
    [stats],
  );

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        row.studentName.toLowerCase().includes(query) ||
        row.rollNo.toLowerCase().includes(query) ||
        row.subjectName.toLowerCase().includes(query) ||
        row.subjectCode.toLowerCase().includes(query) ||
        row.classCode.toLowerCase().includes(query) ||
        row.department.toLowerCase().includes(query);

      const matchesStatus = !statusFilter || row.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [rows, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const paginatedRows = filteredRows.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const hasActiveFilters = search.trim().length > 0 || Boolean(statusFilter);

  const clearAllFilters = () => {
    setSearch("");
    setStatusFilter("");
    setCurrentPage(1);
  };

  const getPagination = (page: number, total: number) => {
    const pages: (number | string)[] = [];
    const siblingCount = largeScreen ? 2 : 1;
    const safePage = Math.max(1, Math.min(page, total));
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    pages.push(1);
    if (safePage <= 4) return [...pages, 2, 3, 4, 5, "...", total];
    if (safePage >= total - 3) {
      return [...pages, "...", total - 4, total - 3, total - 2, total - 1, total];
    }
    pages.push("...");
    for (let i = safePage - siblingCount; i <= safePage + siblingCount; i++) {
      if (i > 1 && i < total) pages.push(i);
    }
    pages.push("...", total);
    return pages;
  };

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-linear-to-br from-slate-50 via-white to-slate-50 flex flex-col lg:flex-row">
      <Bar open={open} setOpen={setOpen} />

      <div className="flex-1 min-w-0 w-full">
        <div className="overflow-hidden bg-white p-5 text-slate-900 shadow-sm sm:p-6 md:p-7 lg:p-6">
          <div className="border-b border-slate-200 pb-6 sm:pb-8">
            <h1 className="text-2xl font-bold font-comfortaa text-slate-900 sm:text-3xl">
              Enrollment
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              View student subject enrollments across departments and classes
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {enrollmentStats.map((stat) => (
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
            <h2 className="text-lg font-bold text-slate-900">Enrollment Records</h2>
            <p className="mt-1 text-sm text-slate-500">Search by student, subject, or class</p>

            <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm lg:w-auto lg:min-w-[160px]">
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-transparent text-sm text-slate-900 outline-none"
                >
                  <option value="">Status</option>
                  <option value="Active">Active</option>
                  <option value="Withdrawn">Withdrawn</option>
                </select>
              </div>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search roll no, name, subject, class..."
                  className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {hasActiveFilters && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {statusFilter && (
                  <button
                    type="button"
                    onClick={() => {
                      setStatusFilter("");
                      setCurrentPage(1);
                    }}
                    className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 ring-1 ring-indigo-600/10"
                  >
                    Status: {statusFilter}
                    <X size={12} />
                  </button>
                )}
                {search.trim() && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200">
                    Search: {search.trim()}
                  </span>
                )}
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                >
                  Clear all
                  <X size={12} />
                </button>
              </div>
            )}
          </div>

          <div className="mt-6 hidden lg:block overflow-hidden rounded-2xl border border-slate-200">
            <div className="grid grid-cols-[0.9fr_1.2fr_1.3fr_0.8fr_0.6fr_0.5fr_0.8fr_0.7fr] gap-3 border-b border-slate-200 bg-slate-50/90 px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
              {["Roll No", "Student", "Subject", "Class", "Dept", "Sem", "Enrolled", "Status"].map(
                (head) => (
                  <div key={head} className="min-w-0 truncate text-center">
                    {head}
                  </div>
                ),
              )}
            </div>
            {loading ? (
              <div className="px-4 py-12 text-center text-sm text-slate-500">Loading enrollments...</div>
            ) : paginatedRows.length === 0 ? (
              <div className="px-4 py-12 text-center text-sm text-slate-500">
                {rows.length === 0 ? "No enrollments found." : "No enrollments match your filters."}
              </div>
            ) : (
              paginatedRows.map((row) => (
                <div
                  key={`${row.rollNo}-${row.classCode}-${row.subjectCode}-${row.enrolledAt}`}
                  className="grid grid-cols-[0.9fr_1.2fr_1.3fr_0.8fr_0.6fr_0.5fr_0.8fr_0.7fr] items-center gap-3 border-b border-slate-100 px-4 py-3.5 text-sm transition hover:bg-slate-50/80 last:border-b-0"
                >
                  <div className="truncate text-center font-semibold text-indigo-700">{row.rollNo}</div>
                  <div className="truncate text-left font-medium text-slate-900">{row.studentName}</div>
                  <div className="min-w-0 text-left">
                    <p className="truncate font-medium text-slate-800">{row.subjectName}</p>
                    <p className="truncate text-xs text-slate-500">{row.subjectCode}</p>
                  </div>
                  <div className="truncate text-center text-slate-600">{row.classCode}</div>
                  <div className="text-center text-slate-600">{row.department}</div>
                  <div className="text-center text-slate-600">{row.semester}</div>
                  <div className="text-center text-slate-600">{row.enrolledAt}</div>
                  <div className="flex justify-center">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(row.status)}`}>
                      {row.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <ul className="mt-6 divide-y divide-slate-100 lg:hidden" role="list">
            {loading ? (
              <li className="p-6 text-center text-sm text-slate-500">Loading enrollments...</li>
            ) : paginatedRows.length === 0 ? (
              <li className="p-6 text-center text-sm text-slate-500">
                {rows.length === 0 ? "No enrollments found." : "No enrollments match your filters."}
              </li>
            ) : (
              paginatedRows.map((row) => (
                <li
                  key={`${row.rollNo}-${row.classCode}-mobile`}
                  className="p-3 sm:p-4"
                >
                  <article className="overflow-hidden rounded-2xl border border-slate-200 border-l-[3px] border-l-indigo-500 bg-white p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-indigo-700">{row.rollNo}</p>
                        <h3 className="mt-1 font-bold leading-snug text-slate-900">{row.studentName}</h3>
                      </div>
                      <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${statusClass(row.status)}`}>
                        {row.status}
                      </span>
                    </div>
                    <p className="mt-3 text-sm font-medium text-slate-800">{row.subjectName}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {row.subjectCode} · {row.classCode} · Room {row.room}
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                      {row.department} · Sem {row.semester} · Enrolled {row.enrolledAt}
                    </p>
                  </article>
                </li>
              ))
            )}
          </ul>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <button
              type="button"
              disabled={currentPage === 1 || loading}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 lg:w-24"
            >
              Previous
            </button>
            <div className="flex items-center gap-2">
              {getPagination(currentPage, totalPages).map((page, index) => (
                <button
                  key={`${page}-${index}`}
                  type="button"
                  disabled={page === "..." || loading}
                  onClick={() => typeof page === "number" && setCurrentPage(page)}
                  className={`min-h-[42px] min-w-[42px] rounded-xl text-sm font-semibold transition ${
                    currentPage === page
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                      : page === "..."
                        ? "cursor-default bg-transparent text-slate-400"
                        : "border border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:text-indigo-600"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              type="button"
              disabled={currentPage === totalPages || loading}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 lg:w-24"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Enrollment;
