"use client";

import React, { useEffect, useMemo, useState } from "react";
import Bar from "@/utils/Admin/Bar";
import {
  Building2,
  Eye,
  Monitor,
  Pen,
  PlusCircle,
  Search,
  School,
  Wrench,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

type ClassRow = {
  classNo: string;
  room: string;
  department: string;
  subjectCode: string;
  subjectName: string;
  faculty: string;
  capacity: number;
  size: string;
  amenities: string;
  status: "Active" | "Maintenance" | "Inactive";
};

type ClassStats = {
  total: number;
  active: number;
  maintenance: number;
  smartEquipped: number;
};

const filterOptions = [
  { key: "Department", options: ["CSE", "ME", "CE", "AE"] },
  { key: "Status", options: ["Active", "Maintenance", "Inactive"] },
];

const PAGE_SIZE = 5;

function statusClass(status: ClassRow["status"]) {
  const map: Record<ClassRow["status"], string> = {
    Active: "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-600/15",
    Maintenance: "bg-amber-50 text-amber-800 ring-1 ring-amber-600/15",
    Inactive: "bg-red-50 text-red-800 ring-1 ring-red-600/15",
  };
  return map[status];
}

function AdminClasses() {
  const [open, setOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [largeScreen, setLargeScreen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [edit, setEdit] = useState(false);
  const [view, setView] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassRow | null>(null);
  const [tableData, setTableData] = useState<ClassRow[]>([]);
  const [stats, setStats] = useState<ClassStats>({
    total: 0,
    active: 0,
    maintenance: 0,
    smartEquipped: 0,
  });
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    classNo: "",
    room: "",
    department: "CSE",
    subjectCode: "",
    subjectName: "",
    faculty: "",
    capacity: "0",
    status: "Active" as ClassRow["status"],
  });

  useEffect(() => {
    const onResize = () => setLargeScreen(window.innerWidth >= 1024);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/admin/classes");
        if (!res.data?.success) {
          toast.error(res.data?.message || "Failed to load classes");
          return;
        }
        setTableData(res.data.data || []);
        setStats(res.data.stats || { total: 0, active: 0, maintenance: 0, smartEquipped: 0 });
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to load classes");
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  const classStats = useMemo(
    () => [
      { label: "Total Classes", value: String(stats.total), hint: "Teaching sections", icon: <School size={20} />, color: "bg-indigo-100 text-indigo-600" },
      { label: "Active", value: String(stats.active), hint: "Ready for use", icon: <Building2 size={20} />, color: "bg-emerald-100 text-emerald-600" },
      { label: "On Maintenance", value: String(stats.maintenance), hint: "Under repair", icon: <Wrench size={20} />, color: "bg-amber-100 text-amber-600" },
      { label: "Smart Equipped", value: String(stats.smartEquipped), hint: "AC or smart board", icon: <Monitor size={20} />, color: "bg-cyan-100 text-cyan-600" },
    ],
    [stats],
  );

  const departmentOptions = useMemo(() => {
    const fromData = Array.from(new Set(tableData.map((r) => r.department).filter((d) => d && d !== "—")));
    return fromData.length > 0 ? fromData : filterOptions[0].options;
  }, [tableData]);

  const filteredRows = useMemo(() => {
    return tableData.filter((row) => {
      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        row.classNo.toLowerCase().includes(query) ||
        row.department.toLowerCase().includes(query) ||
        row.subjectName.toLowerCase().includes(query) ||
        row.subjectCode.toLowerCase().includes(query) ||
        row.faculty.toLowerCase().includes(query) ||
        row.room.toLowerCase().includes(query);

      const matchesFilters = Object.entries(selectedFilter).every(([key, value]) => {
        if (!value) return true;
        if (key === "Department") return row.department === value;
        if (key === "Status") return row.status === value;
        return true;
      });

      return matchesSearch && matchesFilters;
    });
  }, [search, selectedFilter, tableData]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const paginatedRows = filteredRows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

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

  const hasActiveFilters = useMemo(
    () => Object.values(selectedFilter).some(Boolean) || search.trim().length > 0,
    [selectedFilter, search],
  );

  const clearAllFilters = () => {
    setSelectedFilter({});
    setSearch("");
    setCurrentPage(1);
  };

  const populateForm = (row: ClassRow) => {
    setForm({
      classNo: row.classNo,
      room: row.room,
      department: row.department,
      subjectCode: row.subjectCode,
      subjectName: row.subjectName,
      faculty: row.faculty,
      capacity: String(row.capacity),
      status: row.status,
    });
  };

  const openView = (row: ClassRow) => {
    setSelectedClass(row);
    populateForm(row);
    setView(true);
  };

  const openEdit = (row: ClassRow) => {
    setSelectedClass(row);
    populateForm(row);
    setEdit(true);
  };

  const openAdd = () => {
    setForm({
      classNo: "",
      room: "",
      department: "CSE",
      subjectCode: "",
      subjectName: "",
      faculty: "",
      capacity: "0",
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
    if (safePage >= total - 3) return [...pages, "...", total - 4, total - 3, total - 2, total - 1, total];
    pages.push("...");
    for (let i = safePage - siblingCount; i <= safePage + siblingCount; i++) {
      if (i > 1 && i < total) pages.push(i);
    }
    pages.push("...", total);
    return pages;
  };

  const ClassFormFields = ({ disabled = false }: { disabled?: boolean }) => (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Class Code</label>
        <input disabled={disabled} value={form.classNo} onChange={(e) => setForm((p) => ({ ...p, classNo: e.target.value }))} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 disabled:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="CSE-102" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Room</label>
        <input disabled={disabled} value={form.room} onChange={(e) => setForm((p) => ({ ...p, room: e.target.value }))} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 disabled:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="A-101" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Department</label>
        <select disabled={disabled} value={form.department} onChange={(e) => setForm((p) => ({ ...p, department: e.target.value }))} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 disabled:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          {departmentOptions.map((d) => (<option key={d} value={d}>{d}</option>))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Subject</label>
        <input disabled={disabled} value={form.subjectName} onChange={(e) => setForm((p) => ({ ...p, subjectName: e.target.value }))} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 disabled:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Data Structures" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Faculty</label>
        <input disabled={disabled} value={form.faculty} onChange={(e) => setForm((p) => ({ ...p, faculty: e.target.value }))} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 disabled:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Faculty name" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Enrolled</label>
        <input disabled={disabled} type="number" min={0} value={form.capacity} onChange={(e) => setForm((p) => ({ ...p, capacity: e.target.value }))} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 disabled:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Status</label>
        <select disabled={disabled} value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as ClassRow["status"] }))} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 disabled:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          {filterOptions[1].options.map((s) => (<option key={s} value={s}>{s}</option>))}
        </select>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-linear-to-br from-slate-50 via-white to-slate-50 flex flex-col lg:flex-row">
      <Bar open={open} setOpen={setOpen} />

      <div className="flex-1 min-w-0 w-full">
        <div className="overflow-hidden bg-white p-5 text-slate-900 shadow-sm sm:p-6 md:p-7 lg:p-6">
          <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between sm:pb-8">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold font-comfortaa text-slate-900 sm:text-3xl">Classes</h1>
              <p className="mt-1 text-sm text-slate-600">Manage teaching sections, rooms, and faculty assignments</p>
            </div>
            <button type="button" onClick={openAdd} className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700">
              <PlusCircle size={18} /> Add Class
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {classStats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{stat.label}</p>
                    <h3 className="mt-2 text-2xl font-bold text-slate-900">{loading ? "—" : stat.value}</h3>
                    <p className="mt-1 text-xs text-slate-500">{stat.hint}</p>
                  </div>
                  <span className={`rounded-xl p-2.5 ${stat.color}`}>{stat.icon}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-bold text-slate-900">Class Directory</h2>
            <p className="mt-1 text-sm text-slate-500">Filter and search teaching sections</p>

            <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
              <div className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm lg:w-auto lg:min-w-[160px]">
                <select value={selectedFilter.Department || ""} onChange={(e) => handleFilterChange("Department", e.target.value)} className="w-full bg-transparent text-sm text-slate-900 outline-none">
                  <option value="">Department</option>
                  {departmentOptions.map((item) => (<option key={item} value={item}>{item}</option>))}
                </select>
              </div>
              <div className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm lg:w-auto lg:min-w-[160px]">
                <select value={selectedFilter.Status || ""} onChange={(e) => handleFilterChange("Status", e.target.value)} className="w-full bg-transparent text-sm text-slate-900 outline-none">
                  <option value="">Status</option>
                  {filterOptions[1].options.map((item) => (<option key={item} value={item}>{item}</option>))}
                </select>
              </div>
              <div className="flex w-full gap-2 lg:max-w-md lg:flex-1">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} placeholder="Search class, subject, faculty..." className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {Object.entries(selectedFilter).map(([key, value]) =>
                  value ? (
                    <button key={key} type="button" onClick={() => clearFilter(key)} className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 ring-1 ring-indigo-600/10">
                      {key}: {value}<X size={12} />
                    </button>
                  ) : null,
                )}
                {search.trim() && <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200">Search: {search.trim()}</span>}
                <button type="button" onClick={clearAllFilters} className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700">Clear all<X size={12} /></button>
              </div>
            )}
          </div>

          <div className="mt-6 hidden lg:block overflow-hidden rounded-2xl border border-slate-200">
            <div className="grid grid-cols-[0.35fr_0.85fr_0.6fr_0.7fr_1.1fr_0.9fr_0.6fr_0.7fr_0.7fr] gap-3 border-b border-slate-200 bg-slate-50/90 px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
              {["#", "Class Code", "Room", "Dept", "Subject", "Faculty", "Enrolled", "Status", "Actions"].map((head) => (
                <div key={head} className="min-w-0 truncate text-center">{head}</div>
              ))}
            </div>
            {loading ? (
              <div className="px-4 py-12 text-center text-sm text-slate-500">Loading classes...</div>
            ) : paginatedRows.length === 0 ? (
              <div className="px-4 py-12 text-center text-sm text-slate-500">
                {tableData.length === 0 ? "No classes found." : "No classes match your filters."}
              </div>
            ) : (
              paginatedRows.map((row, index) => (
                <div key={`${row.classNo}-${index}`} className="grid grid-cols-[0.35fr_0.85fr_0.6fr_0.7fr_1.1fr_0.9fr_0.6fr_0.7fr_0.7fr] items-center gap-3 border-b border-slate-100 px-4 py-3.5 text-sm transition hover:bg-slate-50/80 last:border-b-0">
                  <div className="text-center text-slate-500">{(currentPage - 1) * PAGE_SIZE + index + 1}</div>
                  <div className="truncate text-center font-semibold text-indigo-700">{row.classNo}</div>
                  <div className="truncate text-center text-slate-600">{row.room}</div>
                  <div className="text-center text-slate-600">{row.department}</div>
                  <div className="min-w-0 truncate text-center text-slate-700" title={`${row.subjectCode} — ${row.subjectName}`}>
                    <span className="font-medium">{row.subjectCode}</span>
                    {row.subjectName && row.subjectName !== "—" ? (
                      <span className="text-slate-500"> · {row.subjectName}</span>
                    ) : null}
                  </div>
                  <div className="truncate text-center text-slate-600">{row.faculty}</div>
                  <div className="text-center font-medium text-slate-700">{row.capacity}</div>
                  <div className="flex justify-center">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(row.status)}`}>{row.status}</span>
                  </div>
                  <div className="flex justify-center gap-2">
                    <button type="button" onClick={() => openView(row)} className="rounded-lg bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200" title="View"><Eye size={16} /></button>
                    <button type="button" onClick={() => openEdit(row)} className="rounded-lg bg-indigo-50 p-2 text-indigo-600 transition hover:bg-indigo-100" title="Edit"><Pen size={16} /></button>
                  </div>
                </div>
              ))
            )}
          </div>

          <ul className="mt-6 divide-y divide-slate-100 lg:hidden" role="list">
            {loading ? (
              <li className="px-4 py-12 text-center text-sm text-slate-500">Loading classes...</li>
            ) : paginatedRows.length === 0 ? (
              <li className="px-4 py-12 text-center text-sm text-slate-500">
                {tableData.length === 0 ? "No classes found." : "No classes match your filters."}
              </li>
            ) : (
              paginatedRows.map((row, index) => (
                <li key={`${row.classNo}-mobile-${index}`} className="p-3 sm:p-4">
                  <article className="overflow-hidden rounded-2xl border border-slate-200 border-l-[3px] border-l-indigo-500 bg-white p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-indigo-700">{row.classNo}</p>
                        <h3 className="mt-1 font-bold leading-snug text-slate-900">{row.subjectName !== "—" ? row.subjectName : row.department}</h3>
                        <p className="mt-0.5 text-xs text-slate-500">{row.department} · Room {row.room}</p>
                      </div>
                      <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${statusClass(row.status)}`}>{row.status}</span>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                      <div><p className="text-xs text-slate-400">Faculty</p><p className="font-medium text-slate-700">{row.faculty}</p></div>
                      <div><p className="text-xs text-slate-400">Enrolled</p><p className="font-medium text-slate-700">{row.capacity}</p></div>
                      <div><p className="text-xs text-slate-400">Subject Code</p><p className="font-medium text-slate-700">{row.subjectCode}</p></div>
                    </div>
                    <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4">
                      <button type="button" onClick={() => openView(row)} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-100 py-2.5 text-sm font-medium text-slate-700"><Eye size={16} /> View</button>
                      <button type="button" onClick={() => openEdit(row)} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-50 py-2.5 text-sm font-medium text-indigo-700"><Pen size={16} /> Edit</button>
                    </div>
                  </article>
                </li>
              ))
            )}
          </ul>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <button type="button" disabled={currentPage === 1 || loading} onClick={() => setCurrentPage((p) => p - 1)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 lg:w-24">Previous</button>
            <div className="flex items-center gap-2">
              {getPagination(currentPage, totalPages).map((page, index) => (
                <button key={`${page}-${index}`} type="button" disabled={page === "..." || loading} onClick={() => typeof page === "number" && setCurrentPage(page)} className={`min-h-[42px] min-w-[42px] rounded-xl text-sm font-semibold transition ${currentPage === page ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : page === "..." ? "cursor-default bg-transparent text-slate-400" : "border border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:text-indigo-600"}`}>{page}</button>
              ))}
            </div>
            <button type="button" disabled={currentPage === totalPages || loading} onClick={() => setCurrentPage((p) => p + 1)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 lg:w-24">Next</button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold font-comfortaa text-slate-900">Add Class</h3>
              <button type="button" onClick={() => setShowModal(false)} className="rounded-full p-2 hover:bg-slate-100 text-slate-900"><X size={22} /></button>
            </div>
            <ClassFormFields />
            <button type="button" onClick={() => { toast.success("Class added (connect API when ready)"); setShowModal(false); }} className="mt-6 w-full rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white transition hover:bg-indigo-700">Submit</button>
          </div>
        </div>
      )}

      {edit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold font-comfortaa text-slate-900">Edit Class</h3>
              <button type="button" onClick={() => setEdit(false)} className="rounded-full p-2 hover:bg-slate-100"><X size={22} /></button>
            </div>
            <ClassFormFields />
            <button type="button" onClick={() => { toast.success("Class updated (connect API when ready)"); setEdit(false); }} className="mt-6 w-full rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white transition hover:bg-indigo-700">Save Changes</button>
          </div>
        </div>
      )}

      {view && selectedClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold font-comfortaa text-slate-900">Class Details</h3>
              <button type="button" onClick={() => setView(false)} className="rounded-full p-2 hover:bg-slate-100"><X size={22} /></button>
            </div>
            <ClassFormFields disabled />
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminClasses;
