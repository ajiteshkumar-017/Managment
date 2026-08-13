"use client";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  ClipboardList,
  Download,
  FileSpreadsheet,
  RotateCcw,
  Send,
  Upload,
} from "lucide-react";
import AdminModal, {
  adminFieldClass,
  adminFormGridClass,
  adminLabelClass,
  adminPrimaryBtnClass,
  adminSecondaryBtnClass,
} from "@/utils/Admin/AdminModal";
import { ACADEMIC_YEAR, EXAM_RESULT_TYPE } from "@/constant/Constant";

type ClassOption = {
  classId: string;
  subjectName: string;
  subjectCode: string;
  department: string;
  semester: number;
  section: string;
  batch: string;
};

type InvalidRow = { row: number; errors: string[] };

type PreviewInfo = {
  department: string;
  semester: number;
  batch: string;
  subject: string;
  subjectCode: string;
  exam: string;
  validStudents: number;
};

type Step = "form" | "file" | "errors" | "confirm" | "done";

type PublishResultModalProps = {
  open: boolean;
  onClose: () => void;
  classes: ClassOption[];
  initialClassId?: string;
  onPublished?: () => void;
};

export default function PublishResultModal({
  open,
  onClose,
  classes,
  initialClassId = "",
  onPublished,
}: PublishResultModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<Step>("form");
  const [classId, setClassId] = useState("");
  const [examType, setExamType] = useState<(typeof EXAM_RESULT_TYPE)[number]>("End Sem");
  const [academicYear, setAcademicYear] =
    useState<(typeof ACADEMIC_YEAR)[number]>("2025-2026");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [invalidRows, setInvalidRows] = useState<InvalidRow[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [preview, setPreview] = useState<PreviewInfo | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  const selected = classes.find((c) => c.classId === classId);

  useEffect(() => {
    if (!open) return;
    setStep("form");
    setClassId(initialClassId || classes[0]?.classId || "");
    setExamType("End Sem");
    setAcademicYear("2025-2026");
    setFile(null);
    setInvalidRows([]);
    setErrorMessage("");
    setPreview(null);
    setSuccessMessage("");
    if (inputRef.current) inputRef.current.value = "";
  }, [open, initialClassId, classes]);

  const handleContinue = () => {
    if (!classId || !selected) {
      toast.error("Select a class");
      return;
    }
    setStep("file");
  };

  const handleDownloadTemplate = async () => {
    if (!selected) return;
    setDownloading(true);
    try {
      const res = await axios.post(
        "/api/faculty/results/template/download",
        {
          classId,
          exam: examType,
          ExamType: examType,
          academicYear,
        },
        { responseType: "blob" },
      );

      if (res.data instanceof Blob && res.data.type.includes("application/json")) {
        const text = await res.data.text();
        const json = JSON.parse(text) as { message?: string };
        throw new Error(json.message || "Failed to download template");
      }

      const filename = `marks-${selected.department}-sem${selected.semester}-${selected.subjectCode}.xlsx`;
      const url = URL.createObjectURL(res.data as Blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
      toast.success("Marks template downloaded");
    } catch (err: unknown) {
      let message = "Failed to download template";
      if (axios.isAxiosError(err) && err.response?.data instanceof Blob) {
        try {
          const text = await err.response.data.text();
          const json = JSON.parse(text) as { message?: string };
          message = json.message || message;
        } catch {
          message = err.message;
        }
      } else if (err instanceof Error) {
        message = err.message;
      }
      toast.error(message);
    } finally {
      setDownloading(false);
    }
  };

  const handleFile = (list: FileList | null) => {
    const next = list?.[0];
    if (!next) return;
    if (!next.name.match(/\.(xlsx|xls)$/i)) {
      toast.error("Please upload an Excel file (.xlsx)");
      return;
    }
    setFile(next);
    setInvalidRows([]);
    setErrorMessage("");
    setPreview(null);
  };

  const validateFile = async () => {
    if (!file) {
      toast.error("Please choose a marksheet file first");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("classId", classId);
      const res = await axios.post(
        "/api/faculty/results/marksheet/upload?validateOnly=true",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      if (!res.data?.success) {
        throw new Error(res.data?.message || "Validation failed");
      }

      setPreview(res.data.preview || null);
      setStep("confirm");
      toast.success("Marksheet looks good");
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data) {
        const data = err.response.data as {
          message?: string;
          invalidRows?: InvalidRow[];
        };
        setErrorMessage(data.message || "Validation failed");
        setInvalidRows(data.invalidRows || []);
        setStep("errors");
        toast.error(data.message || "Validation failed");
      } else {
        const message = err instanceof Error ? err.message : "Validation failed";
        setErrorMessage(message);
        setInvalidRows([{ row: 0, errors: [message] }]);
        setStep("errors");
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const publishFile = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("classId", classId);
      const res = await axios.post(
        "/api/faculty/results/marksheet/upload?validateOnly=false",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      if (!res.data?.success) {
        throw new Error(res.data?.message || "Publish failed");
      }

      setSuccessMessage(res.data.message || "Results published successfully");
      setStep("done");
      toast.success(res.data.message || "Published");
      onPublished?.();
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.invalidRows) {
        const data = err.response.data as {
          message?: string;
          invalidRows?: InvalidRow[];
        };
        setErrorMessage(data.message || "Publish failed");
        setInvalidRows(data.invalidRows || []);
        setStep("errors");
      }
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : err instanceof Error
          ? err.message
          : "Publish failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const resetToFile = () => {
    setStep("file");
    setFile(null);
    setInvalidRows([]);
    setErrorMessage("");
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const titleMap: Record<Step, string> = {
    form: "Publish Result",
    file: "Upload Marksheet",
    errors: "Fix marksheet errors",
    confirm: "Confirm publish",
    done: "Result published",
  };

  const descriptionMap: Record<Step, string> = {
    form: "Choose the class and exam details first. Next you will download a template and upload filled marks.",
    file: "Download the Excel template, fill Obtained Marks only, then upload the file to validate.",
    errors: "The file was not published. Fix the rows below and re-upload.",
    confirm: "Validation passed. Publishing will notify students and lock editing.",
    done: "Results are live for this class.",
  };

  return (
    <AdminModal
      open={open}
      onClose={onClose}
      title={titleMap[step]}
      description={descriptionMap[step]}
      icon={<ClipboardList size={20} />}
      maxWidthClassName="max-w-xl"
      footer={
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          {step === "form" && (
            <>
              <button
                type="button"
                onClick={onClose}
                className={`${adminSecondaryBtnClass} sm:w-auto`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleContinue}
                className={`${adminPrimaryBtnClass} sm:w-auto`}
              >
                <FileSpreadsheet size={16} />
                Continue
              </button>
            </>
          )}

          {step === "file" && (
            <>
              <button
                type="button"
                onClick={() => setStep("form")}
                disabled={loading || downloading}
                className={`${adminSecondaryBtnClass} sm:w-auto`}
              >
                <ArrowLeft size={16} />
                Back
              </button>
              <button
                type="button"
                onClick={validateFile}
                disabled={!file || loading}
                className={`${adminPrimaryBtnClass} sm:w-auto`}
              >
                <FileSpreadsheet size={16} />
                {loading ? "Validating..." : "Validate Marksheet"}
              </button>
            </>
          )}

          {step === "errors" && (
            <>
              <button
                type="button"
                onClick={onClose}
                className={`${adminSecondaryBtnClass} sm:w-auto`}
              >
                Close
              </button>
              <button
                type="button"
                onClick={resetToFile}
                className={`${adminPrimaryBtnClass} sm:w-auto`}
              >
                <RotateCcw size={16} />
                Re-upload Fixed File
              </button>
            </>
          )}

          {step === "confirm" && (
            <>
              <button
                type="button"
                onClick={resetToFile}
                disabled={loading}
                className={`${adminSecondaryBtnClass} sm:w-auto`}
              >
                Choose Another File
              </button>
              <button
                type="button"
                onClick={publishFile}
                disabled={loading}
                className={`${adminPrimaryBtnClass} sm:w-auto`}
              >
                <Send size={16} />
                {loading ? "Publishing..." : "Upload & Publish"}
              </button>
            </>
          )}

          {step === "done" && (
            <button
              type="button"
              onClick={onClose}
              className={`${adminPrimaryBtnClass} sm:w-auto`}
            >
              Done
            </button>
          )}
        </div>
      }
    >
      {step === "form" && (
        <div className="space-y-5">
          <div className={adminFormGridClass}>
            <label className="lg:col-span-2">
              <span className={adminLabelClass}>Class</span>
              <select
                className={adminFieldClass}
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
              >
                <option value="">Select class</option>
                {classes.map((cls) => (
                  <option key={cls.classId} value={cls.classId}>
                    {cls.subjectName} ({cls.subjectCode}) · {cls.department} Sem{" "}
                    {cls.semester} Sec {cls.section}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className={adminLabelClass}>Exam</span>
              <select
                className={adminFieldClass}
                value={examType}
                onChange={(e) =>
                  setExamType(e.target.value as (typeof EXAM_RESULT_TYPE)[number])
                }
              >
                {EXAM_RESULT_TYPE.map((t) => (
                  <option key={t} value={t}>
                    {t === "End Sem" ? "End Semester" : "Mid Semester"}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className={adminLabelClass}>Academic Year</span>
              <select
                className={adminFieldClass}
                value={academicYear}
                onChange={(e) =>
                  setAcademicYear(e.target.value as (typeof ACADEMIC_YEAR)[number])
                }
              >
                {ACADEMIC_YEAR.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {selected && (
            <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 px-4 py-3 text-sm text-slate-700">
              <p className="font-semibold text-slate-900">{selected.subjectName}</p>
              <p className="mt-0.5 text-xs text-slate-500">
                {selected.department} · Semester {selected.semester} · Sec{" "}
                {selected.section} · Batch {selected.batch} · {selected.subjectCode}
              </p>
            </div>
          )}
        </div>
      )}

      {step === "file" && selected && (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <p className="font-semibold text-slate-900">{selected.subjectName}</p>
            <p className="mt-1 text-xs text-slate-500">
              {selected.department} · Semester {selected.semester} · Batch{" "}
              {selected.batch} · Sec {selected.section} ·{" "}
              {examType === "End Sem" ? "End Semester" : "Mid Semester"} ·{" "}
              {selected.subjectCode}
              {academicYear ? ` · ${academicYear}` : ""}
            </p>
          </div>

          <button
            type="button"
            onClick={handleDownloadTemplate}
            disabled={downloading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 disabled:opacity-60"
          >
            <Download size={16} />
            {downloading ? "Downloading..." : "Download Template"}
          </button>

          <p className="text-sm text-slate-600">
            Fill only <span className="font-semibold">Obtained Marks</span> in the
            template, then choose the file below. We validate every row before
            publishing.
          </p>

          <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center transition hover:border-indigo-300 hover:bg-indigo-50/40">
            <span className="rounded-xl bg-indigo-100 p-3 text-indigo-600">
              <Upload size={22} />
            </span>
            <span className="text-sm font-semibold text-slate-800">
              {file ? file.name : "Click to choose marksheet (.xlsx)"}
            </span>
            <span className="text-xs text-slate-500">Excel template only</span>
            <input
              ref={inputRef}
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={(e) => handleFile(e.target.files)}
            />
          </label>
        </div>
      )}

      {step === "errors" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-bold text-red-800">
              <AlertCircle size={16} />
              {errorMessage || "Please fix these issues"}
            </div>
            <ul className="max-h-56 space-y-2 overflow-y-auto text-sm text-red-700">
              {invalidRows.length === 0 ? (
                <li className="rounded-lg bg-white/70 px-3 py-2">
                  The file could not be published. Check the template and try again.
                </li>
              ) : (
                invalidRows.map((item, index) => (
                  <li
                    key={`${item.row}-${index}`}
                    className="rounded-lg bg-white/70 px-3 py-2"
                  >
                    <span className="font-semibold">
                      {item.row > 0 ? `Row ${item.row}: ` : ""}
                    </span>
                    {item.errors.join(" ")}
                  </li>
                ))
              )}
            </ul>
          </div>
          <p className="text-sm text-slate-600">
            Results were <span className="font-semibold">not published</span>. Fix
            the Excel file, then click{" "}
            <span className="font-semibold">Re-upload Fixed File</span>.
          </p>
        </div>
      )}

      {step === "confirm" && preview && (
        <div className="space-y-4">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-bold text-emerald-800">
              <CheckCircle2 size={16} />
              Validation passed
            </div>
            <p className="text-sm text-emerald-900">
              This will publish results for{" "}
              <span className="font-bold">{preview.validStudents} students</span>
              . This action will notify students and lock editing. Continue?
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <p className="font-semibold text-slate-900">{preview.subject}</p>
            <p className="mt-1 text-xs text-slate-500">
              {preview.department} · Sem {preview.semester} · Batch {preview.batch} ·{" "}
              {preview.exam} · {preview.subjectCode}
            </p>
          </div>
        </div>
      )}

      {step === "done" && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-center">
          <CheckCircle2 className="mx-auto text-emerald-600" size={28} />
          <p className="mt-3 text-sm font-semibold text-emerald-900">
            {successMessage}
          </p>
        </div>
      )}
    </AdminModal>
  );
}
