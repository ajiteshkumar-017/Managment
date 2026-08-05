"use client";

import React, { useEffect, useMemo, useState } from "react";
import Bar from "@/utils/Admin/Bar";
import AdminModal, {
  adminFieldClass,
  adminLabelClass,
  adminPrimaryBtnClass,
  adminSecondaryBtnClass,
} from "@/utils/Admin/AdminModal";
import {
  Bell,
  CalendarClock,
  Eye,
  Megaphone,
  Pen,
  PlusCircle,
  Search,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type NoticeRow = {
  title: string;
  type: string;
  audience: string;
  publishedDate: string;
  expiryDate: string;
  status: "Active" | "Expired" | "Upcoming";
  description?: string;
};

type NoticeStats = {
  total: number;
  active: number;
  expired: number;
  upcoming: number;
};

const filterOptions = [
  { key: "Topic", options: ["Academic Management", "Exam", "Fest", "Cultural", "Holiday", "Important", "General"] },
  { key: "Status", options: ["Active", "Expired", "Upcoming"] },
  { key: "Audience", options: ["All", "Students", "Faculty", "Admin"] },
];

const PAGE_SIZE = 5;

function statusClass(status: NoticeRow["status"]) {
  const map: Record<NoticeRow["status"], string> = {
    Active: "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-600/15",
    Expired: "bg-red-50 text-red-800 ring-1 ring-red-600/15",
    Upcoming: "bg-violet-50 text-violet-700 ring-1 ring-violet-600/10",
  };
  return map[status];
}

function AdminNotices() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [largeScreen, setLargeScreen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [edit, setEdit] = useState(false);
  const [view, setView] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<NoticeRow | null>(null);
  const [tableData, setTableData] = useState<NoticeRow[]>([]);
  const [stats, setStats] = useState<NoticeStats>({
    total: 0,
    active: 0,
    expired: 0,
    upcoming: 0,
  });
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: "",
    type: "Important",
    audience: "All",
    publishedDate: "",
    expiryDate: "",
    body: "",
  });

  const openAdd = () => {
    setForm({
      title: "",
      type: "Important",
      audience: "All",
      publishedDate: "",
      expiryDate: "",
      body: "",
    });
    setShowModal(true);
  };

  useEffect(() => {
    const onResize = () => setLargeScreen(window.innerWidth >= 1024);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (searchParams.get("add") !== "1") return;
    openAdd();
    router.replace(pathname, { scroll: false });
  }, [searchParams, pathname, router]);

  useEffect(() => {
    const fetchNotices = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/admin/notices");
        if (!res.data?.success) {
          toast.error(res.data?.message || "Failed to load notices");
          return;
        }
        setTableData(res.data.data || []);
        setStats(res.data.stats || { total: 0, active: 0, expired: 0, upcoming: 0 });
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to load notices");
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

  const noticeStats = useMemo(
    () => [
      { label: "Total Notices", value: String(stats.total), hint: "All time", icon: <Megaphone size={20} />, color: "bg-indigo-100 text-indigo-600" },
      { label: "Active Notices", value: String(stats.active), hint: "Currently visible", icon: <Bell size={20} />, color: "bg-emerald-100 text-emerald-600" },
      { label: "Expired", value: String(stats.expired), hint: "Past expiry date", icon: <CalendarClock size={20} />, color: "bg-amber-100 text-amber-600" },
      { label: "Upcoming", value: String(stats.upcoming), hint: "Scheduled to publish", icon: <Bell size={20} />, color: "bg-violet-100 text-violet-600" },
    ],
    [stats],
  );

  const filteredRows = useMemo(() => {
    return tableData.filter((row) => {
      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        row.title.toLowerCase().includes(query) ||
        row.type.toLowerCase().includes(query);

      const matchesDate = !dateFilter || row.publishedDate.includes(dateFilter) || row.expiryDate.includes(dateFilter);

      const matchesFilters = Object.entries(selectedFilter).every(([key, value]) => {
        if (!value) return true;
        if (key === "Topic") return row.type === value;
        if (key === "Status") return row.status === value;
        if (key === "Audience") return row.audience === value;
        return true;
      });

      return matchesSearch && matchesDate && matchesFilters;
    });
  }, [search, selectedFilter, dateFilter, tableData]);

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
    () => Object.values(selectedFilter).some(Boolean) || search.trim().length > 0 || dateFilter.length > 0,
    [selectedFilter, search, dateFilter],
  );

  const clearAllFilters = () => {
    setSelectedFilter({});
    setSearch("");
    setDateFilter("");
    setCurrentPage(1);
  };

  const populateForm = (row: NoticeRow) => {
    setForm({
      title: row.title,
      type: row.type,
      audience: row.audience,
      publishedDate: row.publishedDate,
      expiryDate: row.expiryDate,
      body: row.description || "",
    });
  };

  const openView = (row: NoticeRow) => {
    setSelectedNotice(row);
    populateForm(row);
    setView(true);
  };

  const openEdit = (row: NoticeRow) => {
    setSelectedNotice(row);
    populateForm(row);
    setEdit(true);
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

  const NoticeFormFields = ({ disabled = false }: { disabled?: boolean }) => (
    <div className="space-y-5">
      <div>
        <label className={adminLabelClass}>Notice Title</label>
        <input
          disabled={disabled}
          value={form.title}
          onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
          className={adminFieldClass}
          placeholder="Notice title"
        />
      </div>
      <div>
        <label className={adminLabelClass}>Notice Body</label>
        <textarea
          disabled={disabled}
          value={form.body}
          onChange={(e) => setForm((p) => ({ ...p, body: e.target.value }))}
          rows={4}
          className={`${adminFieldClass} resize-none`}
          placeholder="Write notice content..."
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={adminLabelClass}>Topic</label>
          <select
            disabled={disabled}
            value={form.type}
            onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
            className={adminFieldClass}
          >
            {filterOptions[0].options.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={adminLabelClass}>Audience</label>
          <select
            disabled={disabled}
            value={form.audience}
            onChange={(e) => setForm((p) => ({ ...p, audience: e.target.value }))}
            className={adminFieldClass}
          >
            {filterOptions[2].options.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={adminLabelClass}>Published Date</label>
          <input
            disabled={disabled}
            type="text"
            value={form.publishedDate}
            onChange={(e) => setForm((p) => ({ ...p, publishedDate: e.target.value }))}
            className={adminFieldClass}
            placeholder="12 May 2026"
          />
        </div>
        <div>
          <label className={adminLabelClass}>Expiry Date</label>
          <input
            disabled={disabled}
            type="text"
            value={form.expiryDate}
            onChange={(e) => setForm((p) => ({ ...p, expiryDate: e.target.value }))}
            className={adminFieldClass}
            placeholder="25 May 2026"
          />
        </div>
      </div>
    </div>
  );

  const emptyMessage =
    tableData.length === 0
      ? "No notices published yet."
      : "No notices match your filters.";

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-linear-to-br from-slate-50 via-white to-slate-50 flex flex-col lg:flex-row">
      <Bar open={open} setOpen={setOpen} />

      <div className="flex-1 min-w-0 w-full">
        <div className="overflow-hidden bg-white p-5 text-slate-900 shadow-sm sm:p-6 md:p-7 lg:p-6">
          <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between sm:pb-8">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold font-comfortaa text-slate-900 sm:text-3xl">Notices</h1>
              <p className="mt-1 text-sm text-slate-600">Publish and manage institutional announcements</p>
            </div>
            <button type="button" onClick={openAdd} className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700">
              <PlusCircle size={18} /> Add Notice
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {noticeStats.map((stat) => (
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
            <h2 className="text-lg font-bold text-slate-900">Notice Board</h2>
            <p className="mt-1 text-sm text-slate-500">Filter and search published notices</p>

            <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
              <div className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm lg:w-auto lg:min-w-[160px]">
                <input type="date" value={dateFilter} onChange={(e) => { setDateFilter(e.target.value); setCurrentPage(1); }} className="w-full bg-transparent text-sm text-slate-900 outline-none" />
              </div>
              {filterOptions.map((opt) => (
                <div key={opt.key} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm lg:w-auto lg:min-w-[160px]">
                  <select value={selectedFilter[opt.key] || ""} onChange={(e) => handleFilterChange(opt.key, e.target.value)} className="w-full bg-transparent text-sm text-slate-900 outline-none">
                    <option value="">{opt.key}</option>
                    {opt.options.map((item) => (<option key={item} value={item}>{item}</option>))}
                  </select>
                </div>
              ))}
              <div className="flex w-full gap-2 lg:max-w-md lg:flex-1">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} placeholder="Search title, topic..." className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {dateFilter && (
                  <button type="button" onClick={() => { setDateFilter(""); setCurrentPage(1); }} className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 ring-1 ring-indigo-600/10">
                    Date: {dateFilter}<X size={12} />
                  </button>
                )}
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
            <div className="grid grid-cols-[0.4fr_1.2fr_0.8fr_0.7fr_0.9fr_0.9fr_0.7fr_0.8fr] gap-3 border-b border-slate-200 bg-slate-50/90 px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
              {["#", "Title", "Type", "Audience", "Published", "Expiry", "Status", "Actions"].map((head) => (
                <div key={head} className="min-w-0 truncate text-center">{head}</div>
              ))}
            </div>
            {loading ? (
              <div className="px-4 py-12 text-center text-sm text-slate-500">Loading notices...</div>
            ) : paginatedRows.length === 0 ? (
              <div className="px-4 py-12 text-center text-sm text-slate-500">{emptyMessage}</div>
            ) : (
              paginatedRows.map((row, index) => (
                <div key={`${row.title}-${index}`} className="grid grid-cols-[0.4fr_1.2fr_0.8fr_0.7fr_0.9fr_0.9fr_0.7fr_0.8fr] items-center gap-3 border-b border-slate-100 px-4 py-3.5 text-sm transition hover:bg-slate-50/80 last:border-b-0">
                  <div className="text-center text-slate-500">{(currentPage - 1) * PAGE_SIZE + index + 1}</div>
                  <div className="truncate text-left font-medium text-slate-900">{row.title}</div>
                  <div className="truncate text-center text-slate-600">{row.type}</div>
                  <div className="text-center text-slate-600">{row.audience}</div>
                  <div className="text-center text-slate-600">{row.publishedDate}</div>
                  <div className="text-center text-slate-600">{row.expiryDate}</div>
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
              <li className="px-4 py-12 text-center text-sm text-slate-500">Loading notices...</li>
            ) : paginatedRows.length === 0 ? (
              <li className="px-4 py-12 text-center text-sm text-slate-500">{emptyMessage}</li>
            ) : (
              paginatedRows.map((row, index) => (
                <li key={`${row.title}-mobile-${index}`} className="p-3 sm:p-4">
                  <article className="overflow-hidden rounded-2xl border border-slate-200 border-l-[3px] border-l-indigo-500 bg-white p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-medium uppercase text-indigo-600">{row.type}</p>
                        <h3 className="mt-1 font-bold leading-snug text-slate-900">{row.title}</h3>
                      </div>
                      <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${statusClass(row.status)}`}>{row.status}</span>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                      <div><p className="text-xs text-slate-400">Audience</p><p className="font-medium text-slate-700">{row.audience}</p></div>
                      <div><p className="text-xs text-slate-400">Published</p><p className="font-medium text-slate-700">{row.publishedDate}</p></div>
                      <div><p className="text-xs text-slate-400">Expiry</p><p className="font-medium text-slate-700">{row.expiryDate}</p></div>
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

      <AdminModal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="Add Notice"
        description="Publish a new announcement to students and faculty."
        icon={<Megaphone size={20} />}
        footer={
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button type="button" onClick={() => setShowModal(false)} className={adminSecondaryBtnClass}>
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                toast.success("Notice published (connect API when ready)");
                setShowModal(false);
              }}
              className={adminPrimaryBtnClass}
            >
              Publish Notice
            </button>
          </div>
        }
      >
        <NoticeFormFields />
      </AdminModal>

      <AdminModal
        open={edit}
        onClose={() => setEdit(false)}
        title="Edit Notice"
        description="Update notice details and republish changes."
        icon={<Pen size={20} />}
        footer={
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button type="button" onClick={() => setEdit(false)} className={adminSecondaryBtnClass}>
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                toast.success("Notice updated (connect API when ready)");
                setEdit(false);
              }}
              className={adminPrimaryBtnClass}
            >
              Save Changes
            </button>
          </div>
        }
      >
        <NoticeFormFields />
      </AdminModal>

      <AdminModal
        open={view && Boolean(selectedNotice)}
        onClose={() => setView(false)}
        title="Notice Details"
        description="Read-only preview of the selected notice."
        icon={<Eye size={20} />}
        footer={
          <button type="button" onClick={() => setView(false)} className={adminSecondaryBtnClass}>
            Close
          </button>
        }
      >
        <NoticeFormFields disabled />
      </AdminModal>
    </div>
  );
}

export default AdminNotices;
