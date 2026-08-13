"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { FileSpreadsheet, FileText, Plus, Upload, X } from "lucide-react";
import { Suspense } from "react";
import AdminModal, {
  adminFieldClass,
  adminFormGridClass,
  adminLabelClass,
  adminPrimaryBtnClass,
  adminSecondaryBtnClass,
} from "@/utils/Admin/AdminModal";

type AssignmentRow = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: string;
  marks: number;
  department: string;
  semester: number;
  batch: string;
  subjectName: string;
  subjectCode: string;
};

type ClassOption = {
  id: string;
  subjectName: string;
  subjectCode: string;
  department: string;
  semester: number;
  section: string;
  batch: string;
};

const FILE_ACCEPT =
  ".pdf,.doc,.docx,.xls,.xlsx,.csv,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fileKind(name: string) {
  const ext = name.split(".").pop()?.toLowerCase() || "";
  if (ext === "pdf") return "pdf";
  if (ext === "csv") return "csv";
  if (ext === "xls" || ext === "xlsx") return "sheet";
  if (ext === "doc" || ext === "docx") return "doc";
  return "file";
}

function statusClass(status: string) {
  if (status === "uploaded")
    return "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-600/15";
  if (status === "unpublished")
    return "bg-amber-50 text-amber-800 ring-1 ring-amber-600/15";
  return "bg-slate-100 text-slate-700 ring-1 ring-slate-600/10";
}

function AssignmentsContent() {
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState<AssignmentRow[]>([]);
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [csvPreview, setCsvPreview] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    marks: "10",
    classId: "",
  });

  const load = async () => {
    try {
      const [assignRes, classRes] = await Promise.all([
        axios.get("/api/faculty/assignments"),
        axios.get("/api/faculty/classes"),
      ]);
      if (!assignRes.data?.success) {
        toast.error(assignRes.data?.message || "Failed to load assignments");
        return;
      }
      setAssignments(assignRes.data.data || []);
      setClasses(classRes.data?.data || []);
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

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (searchParams.get("add") === "1") setModalOpen(true);
  }, [searchParams]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const clearFile = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl("");
    setCsvPreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const attachFile = (next: File | undefined) => {
    if (!next) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(next);
    setCsvPreview("");
    const kind = fileKind(next.name);
    if (kind === "pdf") {
      setPreviewUrl(URL.createObjectURL(next));
    } else {
      setPreviewUrl("");
    }
    if (kind === "csv") {
      const reader = new FileReader();
      reader.onload = () => {
        const text = String(reader.result || "");
        setCsvPreview(text.split(/\r?\n/).slice(0, 8).join("\n"));
      };
      reader.readAsText(next);
    }
  };

  const openAdd = () => {
    clearFile();
    setForm({
      title: "",
      description: "",
      dueDate: "",
      marks: "10",
      classId: classes[0]?.id || "",
    });
    setModalOpen(true);
  };

  const submit = async (publish: boolean) => {
    if (!form.title.trim() || !form.description.trim() || !form.dueDate || !form.classId) {
      toast.error("Fill title, description, due date and class");
      return;
    }
    setSubmitting(true);
    try {
      const payload = new FormData();
      payload.append("title", form.title);
      payload.append("description", form.description);
      payload.append("dueDate", form.dueDate);
      payload.append("marks", form.marks);
      payload.append("classId", form.classId);
      payload.append("publish", String(publish));
      if (file) payload.append("file", file);

      const res = await axios.post("/api/faculty/assignments", payload);
      if (!res.data?.success) {
        throw new Error(res.data?.message || "Failed to save assignment");
      }
      toast.success(res.data.message || "Assignment saved");
      setModalOpen(false);
      await load();
    } catch (err: unknown) {
      toast.error(
        axios.isAxiosError(err)
          ? err.response?.data?.message || err.message
          : "Failed to save assignment",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const publishExisting = async (id: string) => {
    setPublishingId(id);
    try {
      const res = await axios.patch("/api/faculty/assignments", {
        assignmentId: id,
      });
      if (!res.data?.success) {
        throw new Error(res.data?.message || "Failed to publish");
      }
      toast.success(res.data.message || "Assignment published");
      await load();
    } catch (err: unknown) {
      toast.error(
        axios.isAxiosError(err)
          ? err.response?.data?.message || err.message
          : "Failed to publish assignment",
      );
    } finally {
      setPublishingId(null);
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-comfortaa text-2xl font-bold text-slate-900 sm:text-3xl">
            Assignments
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Create and publish assignments for your classes
          </p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          <Plus size={16} />
          Add Assignment
        </button>
      </div>

      {loading ? (
        <p className="mt-8 text-center text-sm text-slate-500">Loading assignments…</p>
      ) : assignments.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
          No assignments yet
        </p>
      ) : (
        <>
          <div className="mt-6 hidden overflow-hidden rounded-2xl border border-slate-200 lg:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs tracking-wide text-slate-500 uppercase">
                <tr>
                  <th className="px-4 py-3 font-semibold">Title</th>
                  <th className="px-4 py-3 font-semibold">Subject</th>
                  <th className="px-4 py-3 font-semibold">Due</th>
                  <th className="px-4 py-3 font-semibold">Marks</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Action</th>
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
                    </td>
                    <td className="px-4 py-3.5 text-slate-600">
                      {a.subjectName} · {a.subjectCode}
                      <p className="text-xs text-slate-400">
                        {a.department} Sem {a.semester}
                      </p>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600">
                      {new Date(a.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3.5 text-slate-600">{a.marks}</td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusClass(a.status)}`}
                      >
                        {a.status === "uploaded" ? "published" : a.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      {a.status !== "uploaded" ? (
                        <button
                          type="button"
                          disabled={publishingId === a.id}
                          onClick={() => publishExisting(a.id)}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
                        >
                          <Upload size={12} />
                          {publishingId === a.id ? "Publishing…" : "Publish"}
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400">Live</span>
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
                  <div>
                    <p className="font-semibold text-slate-900">{a.title}</p>
                    <p className="mt-0.5 text-sm text-indigo-600">
                      {a.subjectName} · {a.subjectCode}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusClass(a.status)}`}
                  >
                    {a.status === "uploaded" ? "published" : a.status}
                  </span>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                  {a.description}
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  Due {new Date(a.dueDate).toLocaleDateString()} · {a.marks} marks ·{" "}
                  {a.department} Sem {a.semester}
                </p>
                {a.status !== "uploaded" && (
                  <button
                    type="button"
                    disabled={publishingId === a.id}
                    onClick={() => publishExisting(a.id)}
                    className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
                  >
                    <Upload size={14} />
                    {publishingId === a.id ? "Publishing…" : "Publish"}
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      <AdminModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          clearFile();
        }}
        title="Add Assignment"
        description="Create an assignment for one of your classes."
        footer={
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              className={adminSecondaryBtnClass}
              disabled={submitting}
              onClick={() => submit(false)}
            >
              Save draft
            </button>
            <button
              type="button"
              className={adminPrimaryBtnClass}
              disabled={submitting}
              onClick={() => submit(true)}
            >
              {submitting ? "Publishing…" : "Publish assignment"}
            </button>
          </div>
        }
      >
        <div className={adminFormGridClass}>
          <label className="lg:col-span-2">
            <span className={adminLabelClass}>Title</span>
            <input
              className={adminFieldClass}
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Unit 3 problem set"
            />
          </label>
          <label className="lg:col-span-2">
            <span className={adminLabelClass}>Description</span>
            <textarea
              className={`${adminFieldClass} min-h-24`}
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              placeholder="Instructions for students"
            />
          </label>
          <label className="lg:col-span-2">
            <span className={adminLabelClass}>Class</span>
            <select
              className={adminFieldClass}
              value={form.classId}
              onChange={(e) => setForm((f) => ({ ...f, classId: e.target.value }))}
            >
              <option value="">Select class</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.subjectName} ({cls.subjectCode}) · {cls.department} Sem{" "}
                  {cls.semester} Sec {cls.section}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className={adminLabelClass}>Due date</span>
            <input
              type="date"
              className={adminFieldClass}
              value={form.dueDate}
              onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
            />
          </label>
          <label>
            <span className={adminLabelClass}>Marks</span>
            <input
              type="number"
              min={1}
              className={adminFieldClass}
              value={form.marks}
              onChange={(e) => setForm((f) => ({ ...f, marks: e.target.value }))}
            />
          </label>
          <div className="lg:col-span-2">
            <span className={adminLabelClass}>Attachment</span>
            <label
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                attachFile(e.dataTransfer.files?.[0]);
              }}
              className={`mt-1 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-8 text-center transition ${
                dragOver
                  ? "border-indigo-400 bg-indigo-50/70"
                  : "border-slate-200 bg-slate-50 hover:border-indigo-300 hover:bg-indigo-50/40"
              }`}
            >
              <span className="rounded-xl bg-indigo-100 p-2.5 text-indigo-600">
                <Upload size={18} />
              </span>
              <span className="text-sm font-semibold text-slate-800">
                Drop file here or click to browse
              </span>
              <span className="text-xs text-slate-500">
                PDF, DOC, DOCX, XLSX, CSV
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept={FILE_ACCEPT}
                className="hidden"
                onChange={(e) => attachFile(e.target.files?.[0])}
              />
            </label>

            {file && (
              <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="rounded-xl bg-slate-100 p-2 text-slate-600">
                      {fileKind(file.name) === "sheet" || fileKind(file.name) === "csv" ? (
                        <FileSpreadsheet size={18} />
                      ) : (
                        <FileText size={18} />
                      )}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {file.name}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {formatBytes(file.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={clearFile}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    aria-label="Remove file"
                  >
                    <X size={16} />
                  </button>
                </div>

                {previewUrl && (
                  <iframe
                    title="PDF preview"
                    src={previewUrl}
                    className="mt-4 h-64 w-full rounded-xl border border-slate-200 bg-slate-50"
                  />
                )}

                {csvPreview && (
                  <pre className="mt-4 max-h-48 overflow-auto rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
                    {csvPreview}
                  </pre>
                )}
              </div>
            )}
          </div>
        </div>
      </AdminModal>
    </div>
  );
}

export default function FacultyAssignmentsPage() {
  return (
    <Suspense
      fallback={
        <p className="py-10 text-center text-sm text-slate-500">Loading…</p>
      }
    >
      <AssignmentsContent />
    </Suspense>
  );
}
