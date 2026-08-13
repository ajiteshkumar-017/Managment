"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { Upload } from "lucide-react";
import PublishResultModal from "./_components/PublishResultModal";

type ResultRow = {
  classId: string;
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  department: string;
  semester: number;
  section: string;
  batch: string;
  studentCount: number;
  resultBatchId: string | null;
  examType: string;
  academicYear: string;
  status: string;
};

function statusClass(status: string) {
  if (status === "published")
    return "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-600/15";
  if (status === "draft")
    return "bg-slate-100 text-slate-700 ring-1 ring-slate-600/10";
  return "bg-amber-50 text-amber-800 ring-1 ring-amber-600/15";
}

export default function FacultyResultsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<ResultRow[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [initialClassId, setInitialClassId] = useState("");

  const load = async () => {
    try {
      const res = await axios.get("/api/faculty/results");
      if (!res.data?.success) {
        toast.error(res.data?.message || "Failed to load results");
        return;
      }
      setRows(res.data.data || []);
    } catch (err: unknown) {
      toast.error(
        axios.isAxiosError(err)
          ? err.response?.data?.message || "Failed to load results"
          : "Failed to load results",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openPublish = (classId?: string) => {
    setInitialClassId(classId || "");
    setModalOpen(true);
  };

  return (
    <div>
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-comfortaa text-2xl font-bold text-slate-900 sm:text-3xl">
            Results
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Add class details, upload the marksheet, then publish after validation
          </p>
        </div>
        <button
          type="button"
          onClick={() => openPublish()}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          <Upload size={16} />
          Publish Result
        </button>
      </div>

      {loading ? (
        <p className="mt-8 text-center text-sm text-slate-500">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
          No classes available for results
        </p>
      ) : (
        <>
          <div className="mt-6 hidden overflow-hidden rounded-2xl border border-slate-200 lg:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs tracking-wide text-slate-500 uppercase">
                <tr>
                  <th className="px-4 py-3 font-semibold">Subject</th>
                  <th className="px-4 py-3 font-semibold">Section</th>
                  <th className="px-4 py-3 font-semibold">Students</th>
                  <th className="px-4 py-3 font-semibold">Exam</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.classId} className="border-t border-slate-100">
                    <td className="px-4 py-3.5">
                      <button
                        type="button"
                        onClick={() => router.push(`/faculty/classes/${encodeURIComponent(row.classId)}`)}
                        className="text-left font-semibold text-slate-900 hover:text-indigo-600"
                      >
                        {row.subjectName}
                      </button>
                      <p className="text-xs text-indigo-600">{row.subjectCode}</p>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600">
                      {row.department} · Sem {row.semester} · Sec {row.section}
                    </td>
                    <td className="px-4 py-3.5 text-slate-600">{row.studentCount}</td>
                    <td className="px-4 py-3.5 text-slate-600">
                      {row.examType || "—"}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusClass(row.status)}`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      {row.status !== "published" ? (
                        <button
                          type="button"
                          onClick={() => openPublish(row.classId)}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
                        >
                          <Upload size={12} />
                          Publish
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
            {rows.map((row) => (
              <div
                key={row.classId}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => router.push(`/faculty/classes/${encodeURIComponent(row.classId)}`)}
                  className="text-left"
                >
                  <p className="font-semibold text-slate-900">{row.subjectName}</p>
                  <p className="mt-0.5 text-sm text-indigo-600">{row.subjectCode}</p>
                </button>
                <p className="mt-2 text-sm text-slate-600">
                  {row.department} · Sem {row.semester} · Sec {row.section}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {row.studentCount} students · {row.examType || "No exam yet"}
                </p>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusClass(row.status)}`}
                  >
                    {row.status}
                  </span>
                  {row.status !== "published" && (
                    <button
                      type="button"
                      onClick={() => openPublish(row.classId)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
                    >
                      <Upload size={12} />
                      Publish
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <PublishResultModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        classes={rows}
        initialClassId={initialClassId}
        onPublished={() => {
          load().catch(() => undefined);
        }}
      />
    </div>
  );
}
