"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Bar from "@/utils/Admin/Bar";
import {
  ArrowRightCircle,
  Award,
  ClipboardList,
  Download,
  Eye,
  FileSpreadsheet,
  FileText,
  Paperclip,
  Pen,
  Percent,
  PlusCircle,
  Search,
  Send,
  TrendingDown,
  Upload,
  UserCheck,
  UserX,
  Users,
  X,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { exportPublishedExamsReport } from "./_data/exportReport";

type ExamType = "Mid Sem" | "End Sem" | "Internal" | "Supplementary";
type ResultStatus = "Published" | "Draft" | "Scheduled";

type ResultRow = {
  id: string;
  examTitle: string;
  examType: ExamType;
  department: string;
  semester: string;
  section: string;
  publishedDate: string;
  studentsCount: number;
  passRate: number;
  status: ResultStatus;
  documentFileName?: string;
  result?: string;
  subjectCode?: string;
  studentName?: string;
};

type DeptPerformance = {
  department: string;
  totalExamTaken: number;
  passPercentage: number;
};

type ResultStats = {
  totalDeclarations: number;
  published: number;
  draft: number;
  studentsCovered: number;
};

type PerformanceData = {
  overallPassPercent: number;
  totalPassed: number;
  totalFailed: number;
  bestDepartment: DeptPerformance | null;
  worstDepartment: DeptPerformance | null;
};

type ModalMode = "create" | "edit" | "view" | null;

type StoredDocument = {
  fileName: string;
  objectUrl: string;
};

const ACCEPTED_FILE_TYPES = ".csv,.xlsx,.xls,.pdf";
const ACCEPTED_MIME_HINT = "CSV, Excel (.xlsx, .xls), or PDF";

const formatCount = (n: number) => n.toLocaleString();

const EXAM_TYPES: ExamType[] = ["Mid Sem", "End Sem", "Internal", "Supplementary"];
const RESULT_STATUSES: ResultStatus[] = ["Published", "Draft", "Scheduled"];

function normalizeExamType(value?: string): ExamType {
  if (value && EXAM_TYPES.includes(value as ExamType)) return value as ExamType;
  // Do not treat Core/Elective (subject categories) as exam types
  return "End Sem";
}

function normalizeStatus(value?: string): ResultStatus {
  if (value && RESULT_STATUSES.includes(value as ResultStatus)) return value as ResultStatus;
  return "Draft";
}

const filterOptions = [
  { key: "Department", options: ["CSE", "ME", "CE", "AE"] },
  { key: "Semester", options: ["1", "2", "3", "4", "5", "6", "7", "8"] },
  { key: "Exam Type", options: ["Mid Sem", "End Sem", "Internal", "Supplementary"] },
];

const resultOperations = [
  { title: "Bulk Marks Upload", icon: <Upload size={16} />, color: "bg-indigo-100 text-indigo-600", opensFormModal: true },
  { title: "Publish All Drafts", icon: <Send size={16} />, color: "bg-emerald-100 text-emerald-600", opensFormModal: false },
  { title: "Download Template", icon: <FileSpreadsheet size={16} />, color: "bg-violet-100 text-violet-600", opensFormModal: false },
];

const PAGE_SIZE = 5;

const defaultForm = {
  examTitle: "",
  examType: "End Sem" as ResultRow["examType"],
  department: "CSE",
  semester: "3",
  section: "A",
  publishedDate: "",
  status: "Draft" as ResultRow["status"],
};

type ResultFormState = typeof defaultForm;

function ResultFormFields({
  disabled = false,
  form,
  setForm,
}: {
  disabled?: boolean;
  form: ResultFormState;
  setForm: React.Dispatch<React.SetStateAction<ResultFormState>>;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div className="lg:col-span-2">
        <label className="mb-1 block text-sm font-medium text-slate-700">Exam Title</label>
        <input
          disabled={disabled}
          value={form.examTitle}
          onChange={(e) => setForm((p) => ({ ...p, examTitle: e.target.value }))}
          className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 disabled:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="End Semester Examination 2026"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Exam Type</label>
        <select
          disabled={disabled}
          value={form.examType}
          onChange={(e) => setForm((p) => ({ ...p, examType: e.target.value as ResultRow["examType"] }))}
          className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 disabled:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {filterOptions[2].options.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Status</label>
        <select
          disabled={disabled}
          value={form.status}
          onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as ResultRow["status"] }))}
          className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 disabled:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {filterOptions[3].options.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
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
          {filterOptions[0].options.map((d) => (
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
          {filterOptions[1].options.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Section</label>
        <select
          disabled={disabled}
          value={form.section}
          onChange={(e) => setForm((p) => ({ ...p, section: e.target.value }))}
          className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 disabled:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {["A", "B", "C", "D"].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Publish Date</label>
        <input
          disabled={disabled}
          type="date"
          value={form.publishedDate}
          onChange={(e) => setForm((p) => ({ ...p, publishedDate: e.target.value }))}
          className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 disabled:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="15 Jun 2026"
        />
      </div>
    </div>
  );
}

function DocumentSection({
  modalMode,
  currentDocument,
  selectedResult,
  attachedFile,
  fileInputRef,
  onFileSelect,
  onResetAttachedFile,
  onViewDocument,
  onDownloadDocument,
}: {
  modalMode: ModalMode;
  currentDocument: StoredDocument | null;
  selectedResult: ResultRow | null;
  attachedFile: File | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileSelect: (fileList: FileList | null) => void;
  onResetAttachedFile: () => void;
  onViewDocument: (row: ResultRow) => void;
  onDownloadDocument: (row: ResultRow) => void;
}) {
  if (modalMode === "view") {
    return (
      <div className=" mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center gap-2">
          <Paperclip size={18} className="text-slate-500" />
          <h4 className="text-sm font-semibold text-slate-900">Attached Document</h4>
        </div>
        {currentDocument ? (
          <div className=" mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <span className="rounded-lg bg-indigo-100 p-2 text-indigo-600">
                <FileText size={18} />
              </span>
              <p className="truncate text-sm font-medium text-slate-800">{currentDocument.fileName}</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => selectedResult && onViewDocument(selectedResult)}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                <Eye size={16} /> View File
              </button>
              <button
                type="button"
                onClick={() => selectedResult && onDownloadDocument(selectedResult)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Download size={16} /> Download
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-500">No document attached to this result.</p>
        )}
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50/80 p-4">
      <div className="flex items-center gap-2">
        <Paperclip size={18} className="text-slate-500" />
        <h4 className="text-sm font-semibold text-slate-900">
          {modalMode === "edit" ? "Replace Document" : "Attach Document"}
        </h4>
      </div>
      <p className="mt-1 text-xs text-slate-500">{ACCEPTED_MIME_HINT}</p>

      {modalMode === "edit" && currentDocument && !attachedFile && (
        <div className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2">
          <div className="flex min-w-0 items-center gap-2">
            <FileText size={16} className="shrink-0 text-indigo-600" />
            <span className="truncate text-sm text-slate-700">Current: {currentDocument.fileName}</span>
          </div>
          <button
            type="button"
            onClick={() => selectedResult && onViewDocument(selectedResult)}
            className="shrink-0 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
          >
            View current
          </button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_FILE_TYPES}
        className="hidden"
        onChange={(e) => onFileSelect(e.target.files)}
      />

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:border-indigo-300 hover:text-indigo-700"
        >
          <Upload size={16} />
          {modalMode === "edit" ? "Choose New File" : "Choose File"}
        </button>
        {attachedFile && (
          <div className="flex flex-1 items-center justify-between gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2">
            <span className="truncate text-sm font-medium text-emerald-800">{attachedFile.name}</span>
            <button
              type="button"
              onClick={onResetAttachedFile}
              className="shrink-0 rounded-full p-1 text-emerald-700 hover:bg-emerald-100"
              aria-label="Remove file"
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function statusClass(status: ResultRow["status"]) {
  const map: Record<ResultRow["status"], string> = {
    Published: "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-600/15",
    Draft: "bg-amber-50 text-amber-800 ring-1 ring-amber-600/15",
    Scheduled: "bg-violet-50 text-violet-700 ring-1 ring-violet-600/10",
  };
  return map[status];
}

function examTypeClass(type: ResultRow["examType"]) {
  const map: Record<ResultRow["examType"], string> = {
    "End Sem": "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600/10",
    "Mid Sem": "bg-cyan-50 text-cyan-700 ring-1 ring-cyan-600/10",
    Internal: "bg-orange-50 text-orange-700 ring-1 ring-orange-600/10",
    Supplementary: "bg-rose-50 text-rose-700 ring-1 ring-rose-600/10",
  };
  return map[type];
}

function createMockDocumentUrl(row: ResultRow) {
  const content = [
    "Result Document (Preview)",
    "",
    `Result ID: ${row.id}`,
    `Exam: ${row.examTitle}`,
    `Department: ${row.department}`,
    `Semester: ${row.semester}`,
    `Section: ${row.section}`,
    "",
    "This is a placeholder preview until the file is uploaded via the admin panel.",
  ].join("\n");
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  return URL.createObjectURL(blob);
}

// function sheetCoverter(){

// }

// function downloadFile(filename: string, content: string){
//   const blob = new Blob([content],{ type: "text/plain;charset=utf-8" });
//   const url = URL.createObjectURL(blob);
//   const link = document.createElement("a");
//   link.href = url;
//   link.download = filename;
//   link.click();
//   URL.revokeObjectURL(url);
// }

function AdminResults() {
  const [open, setOpen] = useState(true);
  const [rows, setRows] = useState<ResultRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ResultStats>({
    totalDeclarations: 0,
    published: 0,
    draft: 0,
    studentsCovered: 0,
  });
  const [performance, setPerformance] = useState<PerformanceData>({
    overallPassPercent: 0,
    totalPassed: 0,
    totalFailed: 0,
    bestDepartment: null,
    worstDepartment: null,
  });
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [largeScreen, setLargeScreen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedResult, setSelectedResult] = useState<ResultRow | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [documentsById, setDocumentsById] = useState<Record<string, StoredDocument>>({});
  const [exporting, setExporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        const res = await axios.get("/api/admin/result/getStatsData");
        if (!res.data?.success) {
          throw new Error(res.data?.message || "Failed to fetch results");
        }

        const data: ResultRow[] = (res.data.data || []).map((r: ResultRow) => ({
          id: String(r.id),
          examTitle: r.examTitle || "Exam",
          examType: normalizeExamType(r.examType),
          department: r.department || "—",
          semester: String(r.semester ?? "—"),
          section: r.section || "—",
          publishedDate: r.publishedDate || "—",
          studentsCount: Number(r.studentsCount) || 0,
          passRate: Number(r.passRate) || 0,
          status: normalizeStatus(r.status),
          result: r.result,
          subjectCode: r.subjectCode,
          studentName: r.studentName,
        }));

        setRows(data);
        setStats({
          totalDeclarations: res.data.stats?.totalDeclarations ?? data.length,
          published: res.data.stats?.published ?? 0,
          draft: res.data.stats?.draft ?? 0,
          studentsCovered: res.data.stats?.studentsCovered ?? 0,
        });
        setPerformance({
          overallPassPercent: res.data.performance?.overallPassPercent ?? 0,
          totalPassed: res.data.performance?.totalPassed ?? 0,
          totalFailed: res.data.performance?.totalFailed ?? 0,
          bestDepartment: res.data.performance?.bestDepartment || null,
          worstDepartment: res.data.performance?.worstDepartment || null,
        });
      } catch (err: unknown) {
        const message = axios.isAxiosError(err)
          ? err.response?.data?.message || err.message
          : err instanceof Error
            ? err.message
            : "Failed to fetch results";
        toast.error(message);
        setRows([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    return () => {
      Object.values(documentsById).forEach((doc) => URL.revokeObjectURL(doc.objectUrl));
    };
  }, [documentsById]);

  const resultStats = useMemo(
    () => [
      {
        label: "Published Exams",
        value: formatCount(stats.published),
        hint: "Exam results released",
        icon: <Send size={20} />,
        color: "bg-emerald-100 text-emerald-600",
      },
      {
        label: "Pending Drafts",
        value: formatCount(stats.draft),
        hint: "Not yet published",
        icon: <FileSpreadsheet size={20} />,
        color: "bg-amber-100 text-amber-600",
      },
      {
        label: "Students Covered",
        value: formatCount(stats.studentsCovered),
        hint: "Across all results",
        icon: <Users size={20} />,
        color: "bg-violet-100 text-violet-600",
      },
      {
        label: "Exam Groups",
        value: formatCount(stats.totalDeclarations),
        hint: "Published exam batches",
        icon: <ClipboardList size={20} />,
        color: "bg-indigo-100 text-indigo-600",
      },
    ],
    [stats],
  );

  const bestDept = performance.bestDepartment;
  const worstDept = performance.worstDepartment;

  const performanceStats = useMemo(() => {
    const cards: {
      label: string;
      value: string;
      hint: string;
      icon: React.ReactNode;
      color: string;
      href?: string;
    }[] = [
      {
        label: "Overall Pass %",
        value: `${performance.overallPassPercent}%`,
        hint: "Institution-wide average",
        icon: <Percent size={20} />,
        color: "bg-emerald-100 text-emerald-600",
      },
      {
        label: "Total Passed",
        value: formatCount(performance.totalPassed),
        hint: "Students cleared exams",
        icon: <UserCheck size={20} />,
        color: "bg-cyan-100 text-cyan-600",
      },
      {
        label: "Total Failed",
        value: formatCount(performance.totalFailed),
        hint: "Students below pass mark",
        icon: <UserX size={20} />,
        color: "bg-red-100 text-red-600",
      },
    ];

    if (bestDept) {
      cards.push({
        label: "Highest Performing Dept",
        value: bestDept.department,
        hint: `${bestDept.passPercentage}% pass rate · click to open`,
        icon: <Award size={20} />,
        color: "bg-violet-100 text-violet-600",
        href: `/admin/results/${encodeURIComponent(bestDept.department)}`,
      });
    }

    if (worstDept && worstDept.department !== bestDept?.department) {
      cards.push({
        label: "Lowest Performing Dept",
        value: worstDept.department,
        hint: `${worstDept.passPercentage}% pass rate · click to drill down`,
        icon: <TrendingDown size={20} />,
        color: "bg-orange-100 text-orange-600",
        href: `/admin/results/${encodeURIComponent(worstDept.department)}`,
      });
    }

    return cards;
  }, [performance, bestDept, worstDept]);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        row.examTitle.toLowerCase().includes(query) ||
        row.department.toLowerCase().includes(query) ||
        (row.subjectCode || "").toLowerCase().includes(query) ||
        row.examType.toLowerCase().includes(query);

      const matchesFilters = Object.entries(selectedFilter).every(([key, value]) => {
        if (!value) return true;
        if (key === "Department") return row.department === value;
        if (key === "Semester") return row.semester === value;
        if (key === "Exam Type") return row.examType === value;
        return true;
      });

      return matchesSearch && matchesFilters;
    });
  }, [rows, search, selectedFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const paginatedRows = filteredRows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const getDocumentForRow = (row: ResultRow): StoredDocument | null => {
    if (documentsById[row.id]) return documentsById[row.id];
    if (!row.documentFileName) return null;
    return { fileName: row.documentFileName, objectUrl: createMockDocumentUrl(row) };
  };

  const resetAttachedFile = () => {
    setAttachedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const closeModal = () => {
    resetAttachedFile();
    setModalMode(null);
    setSelectedResult(null);
  };

  const populateForm = (row: ResultRow) => {
    setForm({
      examTitle: row.examTitle,
      examType: row.examType,
      department: row.department,
      semester: row.semester,
      section: row.section,
      publishedDate: row.publishedDate === "—" ? "" : row.publishedDate,
      status: row.status,
    });
  };

  const openCreateModal = () => {
    setForm(defaultForm);
    resetAttachedFile();
    setSelectedResult(null);
    setModalMode("create");
  };

  const openView = (row: ResultRow) => {
    setSelectedResult(row);
    populateForm(row);
    resetAttachedFile();
    setModalMode("view");
  };

  const openEdit = (row: ResultRow) => {
    setSelectedResult(row);
    populateForm(row);
    resetAttachedFile();
    setModalMode("edit");
  };

  const handleFileSelect = (fileList: FileList | null) => {
    const file = fileList?.[0];
    if (!file) return;

    const allowed = [".csv", ".xlsx", ".xls", ".pdf"];
    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    if (!allowed.includes(ext)) {
      toast.error(`Please upload ${ACCEPTED_MIME_HINT}`);
      return;
    }

    setAttachedFile(file);
    toast.success(`"${file.name}" attached`);
  };

  const storeDocument = (resultId: string, file: File) => {
    const objectUrl = URL.createObjectURL(file);
    setDocumentsById((prev) => {
      const existing = prev[resultId];
      if (existing) URL.revokeObjectURL(existing.objectUrl);
      return { ...prev, [resultId]: { fileName: file.name, objectUrl } };
    });
    setRows((prev) =>
      prev.map((row) => (row.id === resultId ? { ...row, documentFileName: file.name } : row)),
    );
  };

  const viewDocument = (row: ResultRow) => {
    const doc = getDocumentForRow(row);
    if (!doc) {
      toast.error("No document attached to this result");
      return;
    }
    window.open(doc.objectUrl, "_blank", "noopener,noreferrer");
  };

  const downloadDocument = (row: ResultRow) => {
    const doc = getDocumentForRow(row);
    if (!doc) {
      toast.error("No document attached to this result");
      return;
    }
    const link = document.createElement("a");
    link.href = doc.objectUrl;
    link.download = doc.fileName;
    link.click();
  };

  const handleSubmit = () => {
    if (!form.examTitle.trim()) {
      toast.error("Exam title is required");
      return;
    }

    if (modalMode === "create" && !attachedFile) {
      toast.error("Please attach a result document");
      return;
    }

    if (modalMode === "create") {
      const newId = `RES-${String(rows.length + 1).padStart(3, "0")}`;
      const newRow: ResultRow = {
        id: newId,
        examTitle: form.examTitle,
        examType: form.examType,
        department: form.department,
        semester: form.semester,
        section: form.section,
        publishedDate: form.publishedDate || "—",
        studentsCount: 0,
        passRate: 0,
        status: form.status,
        documentFileName: attachedFile?.name,
      };
      setRows((prev) => [newRow, ...prev]);
      if (attachedFile) storeDocument(newId, attachedFile);
      toast.success("Result declaration saved with document");
      closeModal();
      return;
    }

    if (modalMode === "edit" && selectedResult) {
      setRows((prev) =>
        prev.map((row) =>
          row.id === selectedResult.id
            ? {
                ...row,
                examTitle: form.examTitle,
                examType: form.examType,
                department: form.department,
                semester: form.semester,
                section: form.section,
                publishedDate: form.publishedDate || "—",
                status: form.status,
                documentFileName: attachedFile?.name ?? row.documentFileName,
              }
            : row,
        ),
      );
      if (attachedFile) storeDocument(selectedResult.id, attachedFile);
      toast.success(attachedFile ? "Result updated with new document" : "Result updated");
      closeModal();
    }
  };

  const handleOperation = (title: string, opensFormModal?: boolean) => {
    if (opensFormModal) {
      openCreateModal();
      return;
    }
    if (title === "Download Template") {
      const csv =
        "examTitle,examType,department,semester,section,studentRoll,result\nData Structures,End Sem,CSE,3,A,CSE2021001,passed\n";
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "result_upload_template.csv";
      link.click();
      URL.revokeObjectURL(url);
      toast.success("Template downloaded");
      return;
    }
    toast(`${title} — connect API when ready`, { icon: "ℹ️" });
  };

  const handleExportPublished = () => {
    setExporting(true);
    try {
      const source = filteredRows.length > 0 ? filteredRows : rows;
      exportPublishedExamsReport(source);
      toast.success("Published exams PDF downloaded");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to export report";
      toast.error(message);
    } finally {
      setExporting(false);
    }
  };

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

  const modalTitle =
    modalMode === "create"
      ? "Add / Upload Result"
      : modalMode === "edit"
        ? "Edit Result"
        : "Result Details";

  const currentDocument =
    modalMode === "view" || modalMode === "edit"
      ? selectedResult
        ? getDocumentForRow(selectedResult)
        : null
      : null;

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-linear-to-br from-slate-50 via-white to-slate-50 flex flex-col lg:flex-row">
      <Bar open={open} setOpen={setOpen} />

      <div className="flex-1 min-w-0 w-full">
        <div className="overflow-hidden bg-white p-5 text-slate-900 shadow-sm sm:p-6 md:p-7 lg:p-6">
          <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between sm:pb-8">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold font-comfortaa text-slate-900 sm:text-3xl">Results</h1>
              <p className="mt-1 text-sm text-slate-600">
                Publish exam results, manage marks, and track student performance
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 self-start">
              <button
                type="button"
                onClick={handleExportPublished}
                disabled={exporting || loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50/40 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Download size={18} />
                {exporting ? "Exporting..." : "Export"}
              </button>
              <button
                type="button"
                onClick={openCreateModal}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
              >
                <PlusCircle size={18} />
                Publish Result
              </button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {resultStats.map((stat) => (
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

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {performanceStats.map((stat) => {
              const card = (
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{stat.label}</p>
                    <h3 className="mt-2 text-2xl font-bold text-slate-900">{stat.value}</h3>
                    <p className="mt-1 text-xs text-slate-500">{stat.hint}</p>
                  </div>
                  <span className={`rounded-xl p-2.5 ${stat.color}`}>{stat.icon}</span>
                </div>
              );

              if (stat.href) {
                return (
                  <Link
                    key={stat.label}
                    href={stat.href}
                    className="block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-orange-300 hover:bg-orange-50/40 hover:shadow-md"
                  >
                    {card}
                  </Link>
                );
              }

              return (
                <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  {card}
                </div>
              );
            })}
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-bold text-slate-900">Result Operations</h2>
            <p className="mt-1 text-sm text-slate-500">Bulk upload and publish tools</p>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {resultOperations.map((op) => (
                <button
                  key={op.title}
                  type="button"
                  onClick={() => handleOperation(op.title, op.opensFormModal)}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50/30"
                >
                  <span className={`rounded-lg p-2.5 ${op.color}`}>{op.icon}</span>
                  <span className="text-sm font-semibold text-slate-900">{op.title}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-lg font-bold text-slate-900">Published Exam Results</h2>
            <p className="mt-1 text-sm text-slate-500">
              Exams with published results — filter by department, semester, or exam type
            </p>

            <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
              {filterOptions.map((opt) => (
                <div key={opt.key} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm lg:w-auto lg:min-w-[160px]">
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
                    onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                    placeholder="Search exam, subject code, department..."
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

          <div className="mt-6 hidden lg:block overflow-hidden rounded-2xl border border-slate-200">
            <div className="grid grid-cols-[1.4fr_0.8fr_0.6fr_0.5fr_0.9fr_0.7fr_0.7fr_0.8fr_0.9fr] gap-3 border-b border-slate-200 bg-slate-50/90 px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
              {["Exam", "Type", "Dept", "Sem", "Published", "Students", "Pass %", "Status", "Open"].map((head) => (
                <div key={head} className="min-w-0 truncate text-center">{head}</div>
              ))}
            </div>
            {loading ? (
              <div className="px-4 py-12 text-center text-sm text-slate-500">Loading published exams...</div>
            ) : paginatedRows.length === 0 ? (
              <div className="px-4 py-12 text-center text-sm text-slate-500">
                {rows.length === 0 ? "No published exam results found." : "No exams match your filters."}
              </div>
            ) : (
              paginatedRows.map((row) => (
                <div
                  key={`${row.subjectCode}-${row.examType}-${row.department}-${row.semester}`}
                  className="grid grid-cols-[1.4fr_0.8fr_0.6fr_0.5fr_0.9fr_0.7fr_0.7fr_0.8fr_0.9fr] items-center gap-3 border-b border-slate-100 px-4 py-3.5 text-sm transition hover:bg-slate-50/80 last:border-b-0"
                >
                  <div className="min-w-0 text-left">
                    <p className="truncate font-medium text-slate-900" title={row.examTitle}>{row.examTitle}</p>
                    <p className="truncate text-xs text-slate-500">{row.subjectCode}</p>
                  </div>
                  <div className="flex justify-center">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${examTypeClass(row.examType)}`}>{row.examType}</span>
                  </div>
                  <div className="text-center text-slate-600">{row.department}</div>
                  <div className="text-center text-slate-600">{row.semester}</div>
                  <div className="text-center text-slate-600">{row.publishedDate}</div>
                  <div className="text-center font-medium text-slate-700">{row.studentsCount}</div>
                  <div className="text-center font-medium text-slate-700">{row.passRate}%</div>
                  <div className="flex justify-center">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(row.status)}`}>{row.status}</span>
                  </div>
                  <div className="flex justify-center">
                    <Link
                      href={`/admin/results/${encodeURIComponent(row.department)}`}
                      className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100"
                    >
                      Department
                      <ArrowRightCircle size={14} />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>

          <ul className="mt-6 divide-y divide-slate-100 lg:hidden" role="list">
            {loading ? (
              <li className="p-6 text-center text-sm text-slate-500">Loading published exams...</li>
            ) : paginatedRows.length === 0 ? (
              <li className="p-6 text-center text-sm text-slate-500">
                {rows.length === 0 ? "No published exam results found." : "No exams match your filters."}
              </li>
            ) : (
              paginatedRows.map((row) => (
              <li key={`${row.subjectCode}-${row.examType}-${row.department}-${row.semester}-m`} className="p-3 sm:p-4">
                <article className="overflow-hidden rounded-2xl border border-slate-200 border-l-[3px] border-l-emerald-500 bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-bold leading-snug text-slate-900">{row.examTitle}</h3>
                      <p className="mt-1 text-xs text-slate-500">{row.subjectCode}</p>
                    </div>
                    <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${statusClass(row.status)}`}>{row.status}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${examTypeClass(row.examType)}`}>{row.examType}</span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                      {row.department} · Sem {row.semester}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-slate-600">
                    {row.studentsCount} students · {row.passRate}% pass · {row.publishedDate}
                  </p>
                  <Link
                    href={`/admin/results/${encodeURIComponent(row.department)}`}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                  >
                    Open Department
                    <ArrowRightCircle size={16} />
                  </Link>
                </article>
              </li>
            ))
            )}
          </ul>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <button type="button" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 lg:w-24">Previous</button>
            <div className="flex items-center gap-2">
              {getPagination(currentPage, totalPages).map((page, index) => (
                <button key={`${page}-${index}`} type="button" disabled={page === "..."} onClick={() => typeof page === "number" && setCurrentPage(page)} className={`min-h-[42px] min-w-[42px] rounded-xl text-sm font-semibold transition ${currentPage === page ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : page === "..." ? "cursor-default bg-transparent text-slate-400" : "border border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:text-indigo-600"}`}>{page}</button>
              ))}
            </div>
            <button type="button" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 lg:w-24">Next</button>
          </div>
        </div>
      </div>

      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold font-comfortaa text-slate-900">{modalTitle}</h3>
              <button type="button" onClick={closeModal} className="rounded-full p-2 hover:bg-slate-100 text-slate-900">
                <X size={22} />
              </button>
            </div>

            {modalMode === "view" && selectedResult && (
              <div className="mb-4 rounded-xl bg-slate-50 p-4 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div><p className="text-slate-500">Result ID</p><p className="font-semibold text-indigo-700">{selectedResult.id}</p></div>
                  <div><p className="text-slate-500">Students</p><p className="font-semibold text-slate-900">{selectedResult.studentsCount}</p></div>
                  <div><p className="text-slate-500">Pass Rate</p><p className="font-semibold text-slate-900">{selectedResult.passRate > 0 ? `${selectedResult.passRate}%` : "Not published"}</p></div>
                  <div><p className="text-slate-500">Published</p><p className="font-semibold text-slate-900">{selectedResult.publishedDate}</p></div>
                </div>
              </div>
            )}

            <ResultFormFields disabled={modalMode === "view"} form={form} setForm={setForm} />
            <DocumentSection
              modalMode={modalMode}
              currentDocument={currentDocument}
              selectedResult={selectedResult}
              attachedFile={attachedFile}
              fileInputRef={fileInputRef}
              onFileSelect={handleFileSelect}
              onResetAttachedFile={resetAttachedFile}
              onViewDocument={viewDocument}
              onDownloadDocument={downloadDocument}
            />

            {modalMode !== "view" && (
              <button
                type="button"
                onClick={handleSubmit}
                className="mt-6 w-full rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
              >
                {modalMode === "create" ? "Save & Upload" : "Save Changes"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminResults;
