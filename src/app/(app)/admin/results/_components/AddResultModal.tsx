"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { ArrowLeft, ClipboardList, Download, FileSpreadsheet } from "lucide-react";
import AdminModal, {
  adminFieldClass,
  adminFormGridClass,
  adminLabelClass,
  adminPrimaryBtnClass,
  adminSecondaryBtnClass,
} from "@/utils/Admin/AdminModal";
import {
  ACADEMIC_YEAR,
  DEPARTMENT,
  EXAM_RESULT_TYPE,
  SEMESTER,
} from "@/constant/Constant";

type SubjectOption = {
  subjectCode: string;
  subjectName: string;
  credits: number;
  label: string;
};

export type AddResultFormValues = {
  department: string;
  semester: string;
  batch: string;
  ExamType: "Mid Sem" | "End Sem";
  subjectCode: string;
  academicYear: string;
};

type AddResultModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: AddResultFormValues) => void | Promise<void>;
  submitting?: boolean;
};

const defaultValues: AddResultFormValues = {
  department: "CSE",
  semester: "5",
  batch: "",
  ExamType: "End Sem",
  subjectCode: "",
  academicYear: "2025-2026",
};

type Step = "form" | "download";

export default function AddResultModal({
  open,
  onClose,
  onSubmit,
  submitting = false,
}: AddResultModalProps) {
  const [form, setForm] = useState<AddResultFormValues>(defaultValues);
  const [subjects, setSubjects] = useState<SubjectOption[]>([]);
  const [batches, setBatches] = useState<string[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [step, setStep] = useState<Step>("form");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(defaultValues);
    setSubjects([]);
    setBatches([]);
    setStep("form");
  }, [open]);

  useEffect(() => {
    if (!open || !form.department || !form.semester || step !== "form") return;

    let cancelled = false;

    const loadOptions = async () => {
      setLoadingOptions(true);
      try {
        const res = await axios.get("/api/admin/result/options", {
          params: {
            department: form.department,
            semester: form.semester,
          },
        });

        if (cancelled) return;

        if (!res.data?.success) {
          throw new Error(res.data?.message || "Failed to load options");
        }

        const nextSubjects: SubjectOption[] = res.data.data?.subjects || [];
        const nextBatches: string[] = res.data.data?.batches || [];

        setSubjects(nextSubjects);
        setBatches(nextBatches);
        setForm((prev) => ({
          ...prev,
          subjectCode: nextSubjects.some((s) => s.subjectCode === prev.subjectCode)
            ? prev.subjectCode
            : "",
          batch:
            prev.batch && nextBatches.includes(prev.batch)
              ? prev.batch
              : nextBatches[0] || prev.batch,
        }));
      } catch (err: unknown) {
        if (cancelled) return;
        const message = axios.isAxiosError(err)
          ? err.response?.data?.message || err.message
          : err instanceof Error
            ? err.message
            : "Failed to load subjects / batches";
        toast.error(message);
        setSubjects([]);
        setBatches([]);
      } finally {
        if (!cancelled) setLoadingOptions(false);
      }
    };

    loadOptions();
    return () => {
      cancelled = true;
    };
  }, [open, form.department, form.semester, step]);

  const selectedSubject = subjects.find((s) => s.subjectCode === form.subjectCode);

  const handleContinue = async () => {
    if (!form.department) {
      toast.error("Select a department");
      return;
    }
    if (!form.semester) {
      toast.error("Select a semester");
      return;
    }
    if (!form.batch.trim()) {
      toast.error("Select or enter a batch");
      return;
    }
    if (!form.ExamType) {
      toast.error("Select an exam type");
      return;
    }
    if (!form.subjectCode || !selectedSubject) {
      toast.error("Select a subject");
      return;
    }

    await onSubmit({
      ...form,
      batch: form.batch.trim(),
    });
    setStep("download");
  };

  const handleDownloadTemplate = async () => {
    if (!selectedSubject && !form.subjectCode) {
      toast.error("Subject is required");
      return;
    }

    setDownloading(true);
    try {
      const subjectName =
        selectedSubject?.subjectName || form.subjectCode;

      const res = await axios.post(
        "/api/admin/result/template/download",
        {
          department: form.department,
          semester: Number(form.semester),
          batch: form.batch.trim(),
          subject: subjectName,
          subjectCode: form.subjectCode,
          exam: form.ExamType,
          academicYear: form.academicYear,
        },
        { responseType: "blob" },
      );

      // Axios may return JSON error as a blob when responseType is blob
      if (res.data instanceof Blob && res.data.type.includes("application/json")) {
        const text = await res.data.text();
        const json = JSON.parse(text) as { message?: string };
        throw new Error(json.message || "Failed to download template");
      }

      const filename = `marks-${form.department}-sem${form.semester}-${form.subjectCode}.xlsx`;
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

  return (
    <AdminModal
      open={open}
      onClose={onClose}
      title={step === "form" ? "Add Result" : "Download Marks Template"}
      description={
        step === "form"
          ? "Choose department, semester, batch, exam and subject to start a result draft."
          : "Download the Excel file with student roll numbers and names. Fill Obtained Marks only, then upload later."
      }
      icon={<ClipboardList size={20} />}
      maxWidthClassName="max-w-xl"
      footer={
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          {step === "download" ? (
            <>
              <button
                type="button"
                onClick={() => setStep("form")}
                disabled={downloading}
                className={`${adminSecondaryBtnClass} sm:w-auto`}
              >
                <ArrowLeft size={16} />
                Back
              </button>
              <button
                type="button"
                onClick={handleDownloadTemplate}
                disabled={downloading || submitting}
                className={`${adminPrimaryBtnClass} sm:w-auto`}
              >
                <Download size={16} />
                {downloading ? "Downloading..." : "Download Template"}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className={`${adminSecondaryBtnClass} sm:w-auto`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleContinue}
                disabled={submitting || loadingOptions}
                className={`${adminPrimaryBtnClass} sm:w-auto`}
              >
                <FileSpreadsheet size={16} />
                {submitting ? "Creating..." : "Continue"}
              </button>
            </>
          )}
        </div>
      }
    >
      {step === "form" ? (
        <div className="space-y-5">
          <div className={adminFormGridClass}>
            <div>
              <label className={adminLabelClass}>Department</label>
              <select
                className={adminFieldClass}
                value={form.department}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    department: e.target.value,
                    subjectCode: "",
                    batch: "",
                  }))
                }
              >
                {DEPARTMENT.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={adminLabelClass}>Semester</label>
              <select
                className={adminFieldClass}
                value={form.semester}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    semester: e.target.value,
                    subjectCode: "",
                    batch: "",
                  }))
                }
              >
                {SEMESTER.map((s) => (
                  <option key={s} value={String(s)}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={adminLabelClass}>Batch</label>
              {batches.length > 0 ? (
                <select
                  className={adminFieldClass}
                  value={form.batch}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, batch: e.target.value }))
                  }
                >
                  <option value="">Select batch</option>
                  {batches.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  className={adminFieldClass}
                  value={form.batch}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, batch: e.target.value }))
                  }
                  placeholder="e.g. 2023 or 2021-25"
                  disabled={loadingOptions}
                />
              )}
              {!loadingOptions && batches.length === 0 && (
                <p className="mt-1 text-xs text-slate-500">
                  No batches found for this department/semester — enter manually.
                </p>
              )}
            </div>

            <div>
              <label className={adminLabelClass}>Exam</label>
              <select
                className={adminFieldClass}
                value={form.ExamType}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    ExamType: e.target.value as AddResultFormValues["ExamType"],
                  }))
                }
              >
                {EXAM_RESULT_TYPE.map((t) => (
                  <option key={t} value={t}>
                    {t === "End Sem"
                      ? "End Semester"
                      : t === "Mid Sem"
                        ? "Mid Semester"
                        : t}
                  </option>
                ))}
              </select>
            </div>

            <div className="lg:col-span-2">
              <label className={adminLabelClass}>Subject</label>
              <select
                className={adminFieldClass}
                value={form.subjectCode}
                onChange={(e) =>
                  setForm((p) => ({ ...p, subjectCode: e.target.value }))
                }
                disabled={loadingOptions || subjects.length === 0}
              >
                <option value="">
                  {loadingOptions
                    ? "Loading subjects..."
                    : subjects.length === 0
                      ? "No subjects for this department/semester"
                      : "Select subject"}
                </option>
                {subjects.map((s) => (
                  <option key={s.subjectCode} value={s.subjectCode}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="lg:col-span-2">
              <label className={adminLabelClass}>Academic Year</label>
              <select
                className={adminFieldClass}
                value={form.academicYear}
                onChange={(e) =>
                  setForm((p) => ({ ...p, academicYear: e.target.value }))
                }
              >
                {ACADEMIC_YEAR.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedSubject && (
            <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 px-4 py-3 text-sm text-slate-700">
              <p className="font-semibold text-slate-900">
                {selectedSubject.subjectName}
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                {form.department} · Semester {form.semester}
                {form.batch ? ` · Batch ${form.batch}` : ""} ·{" "}
                {form.ExamType === "End Sem" ? "End Semester" : "Mid Semester"} ·{" "}
                {selectedSubject.subjectCode} · {selectedSubject.credits} credits
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <p className="font-semibold text-slate-900">
              {selectedSubject?.subjectName || form.subjectCode}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {form.department} · Semester {form.semester} · Batch {form.batch} ·{" "}
              {form.ExamType === "End Sem" ? "End Semester" : "Mid Semester"} ·{" "}
              {form.subjectCode}
              {form.academicYear ? ` · ${form.academicYear}` : ""}
            </p>
          </div>
          <p className="text-sm text-slate-600">
            Click <span className="font-semibold">Download Template</span> to get
            an Excel file with student roll numbers, names, and emails prefilled.
            Enter only obtained marks.
          </p>
        </div>
      )}
    </AdminModal>
  );
}
