"use client";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  AlertCircle,
  CheckCircle2,
  FileSpreadsheet,
  RotateCcw,
  Send,
  Upload,
} from "lucide-react";
import AdminModal, {
  adminPrimaryBtnClass,
  adminSecondaryBtnClass,
} from "@/utils/Admin/AdminModal";

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

type Step = "pick" | "errors" | "confirm" | "done";

type UploadMarksheetModalProps = {
  open: boolean;
  onClose: () => void;
  onPublished?: () => void;
};

export default function UploadMarksheetModal({
  open,
  onClose,
  onPublished,
}: UploadMarksheetModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<Step>("pick");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [invalidRows, setInvalidRows] = useState<InvalidRow[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [preview, setPreview] = useState<PreviewInfo | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!open) return;
    setStep("pick");
    setFile(null);
    setInvalidRows([]);
    setErrorMessage("");
    setPreview(null);
    setSuccessMessage("");
    if (inputRef.current) inputRef.current.value = "";
  }, [open]);

  const resetToPick = () => {
    setStep("pick");
    setFile(null);
    setInvalidRows([]);
    setErrorMessage("");
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
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
      const res = await axios.post(
        "/api/admin/result/marksheet/upload?validateOnly=true",
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
        const message =
          err instanceof Error ? err.message : "Validation failed";
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
      const res = await axios.post(
        "/api/admin/result/marksheet/upload?validateOnly=false",
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
      const message =
        axios.isAxiosError(err)
          ? err.response?.data?.message || err.message
          : err instanceof Error
            ? err.message
            : "Publish failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminModal
      open={open}
      onClose={onClose}
      title="Upload Marksheet"
      description="Upload the filled Excel template. We will validate marks, then ask you to confirm publish."
      icon={<Upload size={20} />}
      maxWidthClassName="max-w-xl"
      footer={
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          {step === "pick" && (
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
                onClick={resetToPick}
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
                onClick={resetToPick}
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
      {step === "pick" && (
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Use the Excel file from <span className="font-semibold">Add Result → Download Template</span>,
            fill only Obtained Marks, then upload it here.
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
              {invalidRows.map((item, index) => (
                <li
                  key={`${item.row}-${index}`}
                  className="rounded-lg bg-white/70 px-3 py-2"
                >
                  <span className="font-semibold">
                    {item.row > 0 ? `Row ${item.row}: ` : ""}
                  </span>
                  {item.errors.join(" ")}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-sm text-slate-600">
            Fix the Excel file, then click <span className="font-semibold">Re-upload Fixed File</span>.
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
