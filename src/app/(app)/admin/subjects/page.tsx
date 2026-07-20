"use client";

import React, { useEffect, useMemo, useState } from "react";
import Bar from "@/utils/Admin/Bar";
import {
  BookOpenCheck,
  Building2,
  Eye,
  Layers3,
  Pen,
  PlusCircle,
  Search,
  X,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

type SubjectRow = {
  subjectCode: string;
  subjectName: string;
  semester: string;
  department: string;
  status: "Active" | "Inactive";
  type: "Core" | "Elective";
  credits: number;
};

type SubjectStats = {
  total: number;
  active: number;
  inactive: number;
  departments: number;
};

const filterOptions = [
  {
    key: "Department",
    options: ["CSE", "ME", "CE", "AE"],
  },
  {
    key: "Type",
    options: ["Core", "Elective"],
  },
  {
    key: "Status",
    options: ["Active", "Inactive"],
  },
  {
    key: "Semester",
    options: ["1", "2", "3", "4", "5", "6", "7", "8"],
  },
];

const PAGE_SIZE = 5;

const formatCount = (n: number) => n.toLocaleString();

function normalizeSubjectType(type?: string): SubjectRow["type"] {
  return type?.toLowerCase() === "elective" ? "Elective" : "Core";
}

function statusClass(status: SubjectRow["status"]) {
  return status === "Active"
    ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-600/15"
    : "bg-red-50 text-red-800 ring-1 ring-red-600/15";
}

function typeClass(type: SubjectRow["type"]) {
  return type === "Core"
    ? "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600/10"
    : "bg-violet-50 text-violet-700 ring-1 ring-violet-600/10";
}

function AdminSubjects() {
  const [open, setOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [largeScreen, setLargeScreen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [edit, setEdit] = useState(false);
  const [view, setView] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<SubjectRow | null>(null);
  const [rows, setRows] = useState<SubjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<SubjectStats>({
    total: 0,
    active: 0,
    inactive: 0,
    departments: 0,
  });
  const [form, setForm] = useState({
    subjectCode: "",
    subjectName: "",
    type: "Core" as SubjectRow["type"],
    department: "CSE",
    semester: "1",
    credits: "4",
    status: "Active" as SubjectRow["status"],
  });

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
        const res = await axios.get("/api/admin/subjects");
        if (!res.data?.success) {
          throw new Error(res.data?.message || "Failed to fetch subjects");
        }
        const data: SubjectRow[] = (res.data.data || []).map(
          (s: {
            code?: string;
            name?: string;
            subjectCode?: string;
            subjectName?: string;
            semester?: string | number;
            department?: string;
            credits?: number;
            status?: string;
            type?: string;
          }) => ({
            subjectCode: s.code || s.subjectCode || "—",
            subjectName: s.name || s.subjectName || "—",
            semester: String(s.semester ?? ""),
            department: s.department || "—",
            credits: s.credits ?? 0,
            status: s.status === "Inactive" ? "Inactive" : "Active",
            type: normalizeSubjectType(s.type),
          }),
        );
        setRows(data);
        setStats({
          total: res.data.stats?.total ?? data.length,
          active: res.data.stats?.active ?? 0,
          inactive: res.data.stats?.inactive ?? 0,
          departments: res.data.stats?.departments ?? 0,
        });
      } catch (err: unknown) {
        const message =
          axios.isAxiosError(err)
            ? err.response?.data?.message || err.message
            : err instanceof Error
              ? err.message
              : "Failed to fetch subjects";
        toast.error(message);
        setRows([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const subjectStats = useMemo(
    () => [
      {
        label: "Total Subjects",
        value: formatCount(stats.total),
        hint: "All departments",
        icon: <BookOpenCheck size={20} />,
        color: "bg-indigo-100 text-indigo-600",
      },
      {
        label: "Active Subjects",
        value: formatCount(stats.active),
        hint: "Currently offered",
        icon: <BookOpenCheck size={20} />,
        color: "bg-emerald-100 text-emerald-600",
      },
      {
        label: "Inactive Subjects",
        value: formatCount(stats.inactive),
        hint: "Not currently offered",
        icon: <Layers3 size={20} />,
        color: "bg-red-100 text-red-600",
      },
      {
        label: "Departments",
        value: formatCount(stats.departments),
        hint: "With assigned subjects",
        icon: <Building2 size={20} />,
        color: "bg-cyan-100 text-cyan-600",
      },
    ],
    [stats],
  );

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        row.subjectName.toLowerCase().includes(query) ||
        row.subjectCode.toLowerCase().includes(query) ||
        row.department.toLowerCase().includes(query);

      const matchesFilters = Object.entries(selectedFilter).every(([key, value]) => {
        if (!value) return true;
        if (key === "Department") return row.department === value;
        if (key === "Type") return row.type === value;
        if (key === "Status") return row.status === value;
        if (key === "Semester") return row.semester === value;
        return true;
      });

      return matchesSearch && matchesFilters;
    });
  }, [rows, search, selectedFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const paginatedRows = filteredRows.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  ); //like Skipping the no the page and showing the res

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const handleFilterChange = (filterName: string, value: string) => {
    setSelectedFilter((prev) => ({ ...prev, [filterName]: value }));
    setCurrentPage(1);
  };

  const clearFilter = (key: string) => {
    setSelectedFilter((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    setCurrentPage(1);
  };

  const hasActiveFilters = useMemo(() => {
    return Object.values(selectedFilter).some(Boolean) || search.trim().length > 0;
  }, [selectedFilter, search]);

  const clearAllFilters = () => {
    setSelectedFilter({});
    setSearch("");
    setCurrentPage(1);
  };

  const openView = (row: SubjectRow) => {
    setSelectedSubject(row);
    setForm({
      subjectCode: row.subjectCode,
      subjectName: row.subjectName,
      type: row.type,
      department: row.department,
      semester: row.semester,
      credits: String(row.credits),
      status: row.status,
    });
    setView(true);
  };

  const openEdit = (row: SubjectRow) => {
    setSelectedSubject(row);
    setForm({
      subjectCode: row.subjectCode,
      subjectName: row.subjectName,
      type: row.type,
      department: row.department,
      semester: row.semester,
      credits: String(row.credits),
      status: row.status,
    });
    setEdit(true);
  };

  const openAdd = () => {
    setForm({
      subjectCode: "",
      subjectName: "",
      type: "Core",
      department: "CSE",
      semester: "1",
      credits: "4",
      status: "Active",
    });
    setShowModal(true);
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

  const SubjectFormFields = ({ disabled = false }: { disabled?: boolean }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Subject Code</label>
          <input
            disabled={disabled}
            value={form.subjectCode}
            onChange={(e) => setForm((p) => ({ ...p, subjectCode: e.target.value }))}
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 disabled:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="CSE301"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Subject Name</label>
          <input
            disabled={disabled}
            value={form.subjectName}
            onChange={(e) => setForm((p) => ({ ...p, subjectName: e.target.value }))}
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 disabled:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Database Management Systems"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Type</label>
          <select
            disabled={disabled}
            value={form.type}
            onChange={(e) => setForm((p) => ({ ...p, type: e.target.value as SubjectRow["type"] }))}
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 disabled:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Core">Core</option>
            <option value="Elective">Elective</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Department</label>
          <select
            disabled={disabled}
            value={form.department}
            onChange={(e) => setForm((p) => ({ ...p, department: e.target.value }))}
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 disabled:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {["CSE", "ME", "CE", "AE"].map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Semester</label>
          <select
            disabled={disabled}
            value={form.semester}
            onChange={(e) => setForm((p) => ({ ...p, semester: e.target.value }))}
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 disabled:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <option key={n} value={String(n)}>{n}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Credits</label>
          <input
            disabled={disabled}
            type="number"
            min={1}
            max={10}
            value={form.credits}
            onChange={(e) => setForm((p) => ({ ...p, credits: e.target.value }))}
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 disabled:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-linear-to-br from-slate-50 via-white to-slate-50 flex flex-col lg:flex-row">
      <Bar open={open} setOpen={setOpen} />

      <div className="flex-1 min-w-0 w-full">
        <div className="overflow-hidden  bg-white p-5 text-slate-900 shadow-sm  sm:p-6 md:p-7 lg:p-6">
          {/* Header */}
          <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between sm:pb-8">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold font-comfortaa text-slate-900 sm:text-3xl">
                Subjects
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Manage curriculum subjects, credits, and department assignments
              </p>
            </div>
            <button
              type="button"
              onClick={openAdd}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
            >
              <PlusCircle size={18} />
              Add Subject
            </button>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {subjectStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      {stat.label}
                    </p>
                    <h3 className="mt-2 text-2xl font-bold text-slate-900">{stat.value}</h3>
                    <p className="mt-1 text-xs text-slate-500">{stat.hint}</p>
                  </div>
                  <span className={`rounded-xl p-2.5 ${stat.color}`}>{stat.icon}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="mt-8">
            <h2 className="text-lg font-bold text-slate-900">Subject Directory</h2>
            <p className="mt-1 text-sm text-slate-500">Filter and search the subject catalog</p>

            <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
              {filterOptions.map((opt) => (
                <div
                  key={opt.key}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm lg:w-auto lg:min-w-[160px]"
                >
                  <select
                    value={selectedFilter[opt.key] || ""}
                    onChange={(e) => handleFilterChange(opt.key, e.target.value)}
                    className="w-full bg-transparent text-sm text-slate-900 outline-none"
                  >
                    <option value="">{opt.key}</option>
                    {opt.options.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>
              ))}

              <div className="flex w-full gap-2 lg:max-w-md lg:flex-1">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search code, name, department..."
                    className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {Object.entries(selectedFilter).map(([key, value]) =>
                  value ? (
                    <button
                      key={key}
                      type="button"
                      onClick={() => clearFilter(key)}
                      className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 ring-1 ring-indigo-600/10"
                    >
                      {key}: {value}
                      <X size={12} />
                    </button>
                  ) : null,
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

          {/* Desktop table */}
          <div className="mt-6 hidden lg:block overflow-hidden rounded-2xl border border-slate-200">
            <div className="grid grid-cols-[0.5fr_0.9fr_1.4fr_0.7fr_0.6fr_0.7fr_0.6fr_0.7fr_0.8fr] gap-3 border-b border-slate-200 bg-slate-50/90 px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
              {["#", "Code", "Name", "Dept", "Sem", "Type", "Credits", "Status", "Actions"].map(
                (head) => (
                  <div key={head} className="min-w-0 truncate text-center">{head}</div>
                ),
              )}
            </div>
            {loading ? (
              <div className="px-4 py-12 text-center text-sm text-slate-500">
                Loading subjects...
              </div>
            ) : paginatedRows.length === 0 ? (
              <div className="px-4 py-12 text-center text-sm text-slate-500">
                {rows.length === 0 ? "No subjects found." : "No subjects match your filters."}
              </div>
            ) : (
              paginatedRows.map((row, index) => (
                <div
                  key={row.subjectCode}
                  className="grid grid-cols-[0.5fr_0.9fr_1.4fr_0.7fr_0.6fr_0.7fr_0.6fr_0.7fr_0.8fr] items-center gap-3 border-b border-slate-100 px-4 py-3.5 text-sm transition hover:bg-slate-50/80 last:border-b-0"
                >
                  <div className="text-center text-slate-500">
                    {(currentPage - 1) * PAGE_SIZE + index + 1}
                  </div>
                  <div className="truncate text-center font-semibold text-indigo-700">
                    {row.subjectCode}
                  </div>
                  <div className="truncate text-left font-medium text-slate-900" title={row.subjectName}>
                    {row.subjectName}
                  </div>
                  <div className="text-center text-slate-600">{row.department}</div>
                  <div className="text-center text-slate-600">{row.semester}</div>
                  <div className="flex justify-center">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${typeClass(row.type)}`}>
                      {row.type}
                    </span>
                  </div>
                  <div className="text-center font-medium text-slate-700">{row.credits}</div>
                  <div className="flex justify-center">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(row.status)}`}>
                      {row.status}
                    </span>
                  </div>
                  <div className="flex justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => openView(row)}
                      className="rounded-lg bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200"
                      title="View"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => openEdit(row)}
                      className="rounded-lg bg-indigo-50 p-2 text-indigo-600 transition hover:bg-indigo-100"
                      title="Edit"
                    >
                      <Pen size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Mobile cards */}
          <ul className="mt-6 divide-y divide-slate-100 lg:hidden" role="list">
            {loading ? (
              <li className="p-6 text-center text-sm text-slate-500">Loading subjects...</li>
            ) : paginatedRows.length === 0 ? (
              <li className="p-6 text-center text-sm text-slate-500">
                {rows.length === 0 ? "No subjects found." : "No subjects match your filters."}
              </li>
            ) : (
              paginatedRows.map((row) => (
                <li key={`${row.subjectCode}-mobile`} className="p-3 sm:p-4">
                  <article className="overflow-hidden rounded-2xl border border-slate-200 border-l-[3px] border-l-indigo-500 bg-white p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-indigo-700">{row.subjectCode}</p>
                        <h3 className="mt-1 font-bold leading-snug text-slate-900">{row.subjectName}</h3>
                      </div>
                      <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${statusClass(row.status)}`}>
                        {row.status}
                      </span>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-slate-400">Department</p>
                        <p className="font-medium text-slate-700">{row.department}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Semester</p>
                        <p className="font-medium text-slate-700">{row.semester}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Type</p>
                        <p className="font-medium text-slate-700">{row.type}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Credits</p>
                        <p className="font-medium text-slate-700">{row.credits}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4">
                      <button
                        type="button"
                        onClick={() => openView(row)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-100 py-2.5 text-sm font-medium text-slate-700"
                      >
                        <Eye size={16} /> View
                      </button>
                      <button
                        type="button"
                        onClick={() => openEdit(row)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-50 py-2.5 text-sm font-medium text-indigo-700"
                      >
                        <Pen size={16} /> Edit
                      </button>
                    </div>
                  </article>
                </li>
              ))
            )}
          </ul>

          {/* Pagination */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <button
              type="button"
              disabled={currentPage === 1}
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
                  disabled={page === "..."}
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
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 lg:w-24"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Add modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold font-comfortaa text-slate-900">Add Subject</h3>
              <button type="button" onClick={() => setShowModal(false)} className="rounded-full p-2 hover:bg-slate-100 text-black">
                <X size={22} />
              </button>
            </div>
            <SubjectFormFields />
            <button
              type="button"
              onClick={() => {
                toast.success("Subject added (connect API when ready)");
                setShowModal(false);
              }}
              className="mt-6 w-full rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
            >
              Submit
            </button>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {edit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold font-comfortaa text-slate-900">Edit Subject</h3>
              <button type="button" onClick={() => setEdit(false)} className="rounded-full p-2 hover:bg-slate-100">
                <X size={22} />
              </button>
            </div>
            <SubjectFormFields />
            <button
              type="button"
              onClick={() => {
                toast.success("Subject updated (connect API when ready)");
                setEdit(false);
              }}
              className="mt-6 w-full rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* View modal */}
      {view && selectedSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold font-comfortaa text-slate-900">Subject Details</h3>
              <button type="button" onClick={() => setView(false)} className="rounded-full p-2 hover:bg-slate-100">
                <X size={22} />
              </button>
            </div>
            <SubjectFormFields disabled />
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminSubjects;
