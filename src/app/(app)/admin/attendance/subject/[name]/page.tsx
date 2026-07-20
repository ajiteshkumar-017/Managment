"use client";

import Bar from "@/utils/Admin/Bar";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  Bell,
  BookOpen,
  CalendarCheck,
  ChartBarStacked,
  CheckCircle,
  CircleX,
  Clock,
  Download,
  FileText,
  Mail,
  Search,
  TrendingDown,
  UserX,
  Users,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type LowAttendanceStudent = {
  roll: number;
  name: string;
  attendance: number;
  status: "Critical" | "Warning";
};

type SessionRow = {
  date: string;
  time: string;
  present: number;
  absent: number;
};

type SubjectMeta = {
  code: string;
  credits: number;
  semester: string;
  department: string;
  totalClasses: number;
  faculty: string;
};

const DEFAULT_META: SubjectMeta = {
  code: "CSE401",
  credits: 3,
  semester: "7",
  department: "CSE",
  totalClasses: 36,
  faculty: "Dr. Rajesh Sharma",
};

const SUBJECT_META: Record<string, SubjectMeta> = {
  "Data Structures": { code: "CSE201", credits: 4, semester: "3", department: "CSE", totalClasses: 30, faculty: "Dr. Ajitesh Kumar" },
  "Database Management Systems": { code: "CSE301", credits: 4, semester: "3", department: "CSE", totalClasses: 30, faculty: "Dr. Priya Sharma" },
  "Computer Networks": { code: "CSE303", credits: 3, semester: "4", department: "CSE", totalClasses: 28, faculty: "Dr. Amit Verma" },
  "Software Engineering": { code: "CSE402", credits: 3, semester: "6", department: "CSE", totalClasses: 30, faculty: "Dr. Neha Gupta" },
  "Operating Systems": { code: "CSE302", credits: 4, semester: "3", department: "CSE", totalClasses: 30, faculty: "Dr. Vikram Rao" },
};

const overviewStats = (avg: number, enrolled: number, below75: number, below50: number) => [
  { label: "Average Attendance", value: `${avg}%`, hint: avg >= 75 ? "Above threshold" : "Below threshold", icon: <ChartBarStacked size={20} />, color: "bg-indigo-100 text-indigo-600" },
  { label: "Students Enrolled", value: String(enrolled), hint: "Total strength", icon: <Users size={20} />, color: "bg-cyan-100 text-cyan-600" },
  { label: "Classes Conducted", value: "27", hint: "of 30 required", icon: <CalendarCheck size={20} />, color: "bg-emerald-100 text-emerald-600" },
  { label: "Below 75%", value: String(below75), hint: `${Math.round((below75 / enrolled) * 100)}% of class`, icon: <AlertTriangle size={20} />, color: "bg-amber-100 text-amber-600" },
  { label: "Below 50%", value: String(below50), hint: "Critical risk", icon: <CircleX size={20} />, color: "bg-red-100 text-red-600" },
  { label: "Last Recorded", value: "Yesterday", hint: "Up to date", icon: <Clock size={20} />, color: "bg-violet-100 text-violet-600" },
];

const trendData = [
  { week: "Week 1", value: 92 },
  { week: "Week 2", value: 89 },
  { week: "Week 3", value: 84 },
  { week: "Week 4", value: 79 },
  { week: "Week 5", value: 73 },
];

const facultyData = {
  name: "Dr. Rajesh Sharma",
  department: "Computer Science",
  initials: "RS",
  required: 30,
  recorded: 27,
  missing: 3,
  compliance: 90,
};

const lowAttendanceStudents: LowAttendanceStudent[] = [
  { roll: 101, name: "Rahul Verma", attendance: 42, status: "Critical" },
  { roll: 109, name: "Priya Singh", attendance: 48, status: "Critical" },
  { roll: 115, name: "Aman Kumar", attendance: 69, status: "Warning" },
  { roll: 122, name: "Sneha Das", attendance: 71, status: "Warning" },
  { roll: 128, name: "Kunal Mehta", attendance: 44, status: "Critical" },
];

const sessionHistory: SessionRow[] = [
  { date: "21 Aug 2026", time: "10:00 AM", present: 54, absent: 10 },
  { date: "19 Aug 2026", time: "10:00 AM", present: 59, absent: 5 },
  { date: "17 Aug 2026", time: "10:00 AM", present: 61, absent: 3 },
  { date: "14 Aug 2026", time: "10:00 AM", present: 58, absent: 6 },
  { date: "12 Aug 2026", time: "10:00 AM", present: 55, absent: 9 },
];

const insights = [
  { icon: TrendingDown, color: "bg-red-100 text-red-600", title: "Average attendance is decreasing", sub: "Down from 92% to 73% over 5 weeks — action needed" },
  { icon: UserX, color: "bg-red-100 text-red-600", title: "14 students are below 75%", sub: "21.9% of enrolled students at risk of failing criteria" },
  { icon: AlertTriangle, color: "bg-amber-100 text-amber-600", title: "3 attendance sessions are missing", sub: "Faculty has not recorded attendance for 3 classes" },
  { icon: CheckCircle, color: "bg-emerald-100 text-emerald-600", title: "Faculty compliance is 90%", sub: "27 of 30 required sessions recorded" },
];

function csvEscape(value: string | number) {
  const text = String(value);
  if (/[",\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function downloadFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function statusClass(status: LowAttendanceStudent["status"]) {
  return status === "Critical"
    ? "bg-red-50 text-red-800 ring-1 ring-red-600/15"
    : "bg-amber-50 text-amber-800 ring-1 ring-amber-600/15";
}

function attendanceColor(n: number) {
  if (n < 50) return "text-red-700";
  if (n < 75) return "text-amber-700";
  return "text-emerald-700";
}

function SubjectAttendanceDetail() {
  const [open, setOpen] = useState(true);
  const [chartReady, setChartReady] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | LowAttendanceStudent["status"]>("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<"faculty" | "hod" | null>(null);

  const params = useParams();
  const rawName = params?.name;
  const subjectName = Array.isArray(rawName)
    ? decodeURIComponent(rawName[0] || "")
    : rawName
      ? decodeURIComponent(rawName)
      : "Subject";

  const meta = SUBJECT_META[subjectName] ?? DEFAULT_META;
  const avgAttendance = trendData[trendData.length - 1]?.value ?? 73;
  const enrolled = 64;
  const below75 = 14;
  const below50 = 3;

  useEffect(() => {
    setChartReady(true);
  }, []);

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();
    return lowAttendanceStudents.filter((student) => {
      const matchesSearch =
        !query ||
        student.name.toLowerCase().includes(query) ||
        String(student.roll).includes(query);
      const matchesStatus = filterStatus === "all" || student.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [search, filterStatus]);

  const buildReportCsv = () => {
    const rows: string[] = [
      "Attendance Report",
      "",
      "Field,Value",
      `Subject,${csvEscape(subjectName)}`,
      `Subject Code,${csvEscape(meta.code)}`,
      `Department,${csvEscape(meta.department)}`,
      `Semester,${csvEscape(meta.semester)}`,
      `Faculty,${csvEscape(meta.faculty)}`,
      `Generated,${csvEscape(new Date().toLocaleString())}`,
      "",
      "Summary Metric,Value",
      `Average Attendance,${avgAttendance}%`,
      `Students Enrolled,${enrolled}`,
      `Students Below 75%,${below75}`,
      `Students Below 50%,${below50}`,
      `Classes Conducted,27 / ${meta.totalClasses}`,
      `Faculty Compliance,${facultyData.compliance}%`,
      "",
      "Low Attendance Students",
      "Roll,Name,Attendance,Status",
      ...lowAttendanceStudents.map(
        (s) => `${s.roll},${csvEscape(s.name)},${s.attendance}%,${csvEscape(s.status)}`,
      ),
      "",
      "Session History",
      "Date,Time,Present,Absent,Rate",
      ...sessionHistory.map((s) => {
        const rate = Math.round((s.present / (s.present + s.absent)) * 100);
        return `${csvEscape(s.date)},${csvEscape(s.time)},${s.present},${s.absent},${rate}%`;
      }),
    ];
    return rows.join("\n");
  };

  const buildAttendanceCsv = () => {
    const studentRows = [
      "Section,Roll,Name,Attendance,Status",
      ...lowAttendanceStudents.map((s) => `Students,${s.roll},${s.name},${s.attendance}%,${s.status}`),
    ];
    const sessionRows = [
      "",
      "Section,Date,Time,Present,Absent,Rate",
      ...sessionHistory.map((s) => {
        const rate = Math.round((s.present / (s.present + s.absent)) * 100);
        return `Sessions,${s.date},${s.time},${s.present},${s.absent},${rate}%`;
      }),
    ];
    return [...studentRows, ...sessionRows].join("\n");
  };

  const handleGenerateReport = async () => {
    setActionLoading("report");
    try {
      await new Promise((r) => setTimeout(r, 600));
      const safeName = subjectName.replace(/[^a-z0-9]/gi, "_").toLowerCase();
      downloadFile(
        `${safeName}_attendance_report.csv`,
        buildReportCsv(),
        "text/csv;charset=utf-8",
      );
      toast.success("Report downloaded.");
    } catch {
      toast.error("Failed to generate report");
    } finally {
      setActionLoading(null);
    }
  };

  const handleExportAttendance = async () => {
    setActionLoading("export");
    try {
      await new Promise((r) => setTimeout(r, 500));
      const safeName = subjectName.replace(/[^a-z0-9]/gi, "_").toLowerCase();
      downloadFile(
        `${safeName}_attendance.csv`,
        buildAttendanceCsv(),
        "text/csv;charset=utf-8",
      );
      toast.success("Attendance data exported as CSV");
    } catch {
      toast.error("Failed to export attendance");
    } finally {
      setActionLoading(null);
    }
  };

  const sendNotification = async (target: "faculty" | "hod") => {
    setConfirmAction(null);
    setActionLoading(target);
    const label = target === "faculty" ? meta.faculty : `${meta.department} HOD`;
    const toastId = toast.loading(`Sending notification to ${label}...`);
    try {
      await new Promise((r) => setTimeout(r, 1200));
      toast.success(
        target === "faculty"
          ? `Reminder sent to ${meta.faculty} about missing sessions and low attendance.`
          : `Escalation sent to ${meta.department} HOD for ${subjectName}.`,
        { id: toastId },
      );
    } catch {
      toast.error("Failed to send notification", { id: toastId });
    } finally {
      setActionLoading(null);
    }
  };

  const actionButtons = [
    {
      id: "report",
      icon: FileText,
      label: "Generate Report",
      sub: "CSV for Excel",
      color: "bg-indigo-100 text-indigo-600",
      onClick: handleGenerateReport,
    },
    {
      id: "export",
      icon: Download,
      label: "Export Attendance",
      sub: "CSV download",
      color: "bg-cyan-100 text-cyan-600",
      onClick: handleExportAttendance,
    },
    {
      id: "faculty",
      icon: Bell,
      label: "Notify Faculty",
      sub: "Send reminder",
      color: "bg-amber-100 text-amber-600",
      onClick: () => setConfirmAction("faculty"),
    },
    {
      id: "hod",
      icon: Mail,
      label: "Notify HOD",
      sub: "Escalate issue",
      color: "bg-red-100 text-red-600",
      onClick: () => setConfirmAction("hod"),
    },
  ];

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-linear-to-br from-slate-50 via-white to-slate-50 flex flex-col lg:flex-row">
      <Bar open={open} setOpen={setOpen} />

      <div className="flex-1 min-w-0 w-full">
        <div className="overflow-hidden bg-white p-5 text-slate-900 shadow-sm sm:p-6 md:p-7 lg:p-6">
          <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-start sm:justify-between sm:pb-8">
            <div className="min-w-0">
              <Link
                href="/admin/attendance"
                className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 transition hover:text-indigo-800"
              >
                <ArrowLeft size={16} />
                Back to Attendance
              </Link>
              <h1 className="text-2xl font-bold font-comfortaa text-slate-900 sm:text-3xl">{subjectName}</h1>
              <p className="mt-1 text-sm text-slate-600">
                Subject attendance overview, compliance, and administrative actions
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
              <span className="rounded-xl bg-indigo-100 p-2.5 text-indigo-600">
                <BookOpen size={20} />
              </span>
              <div>
                <h2 className="font-bold text-slate-900">Subject Information</h2>
                <p className="text-sm text-slate-500">Academic metadata</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-px bg-slate-100 sm:grid-cols-4">
              {[
                { label: "Subject Code", value: meta.code },
                { label: "Credits", value: String(meta.credits) },
                { label: "Semester", value: meta.semester },
                { label: "Department", value: meta.department },
              ].map((item) => (
                <div key={item.label} className="bg-white px-5 py-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{item.label}</p>
                  <p className="mt-1 font-semibold text-slate-900">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-100 px-5 py-4">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-slate-500">Total classes  {meta.totalClasses} classes </span>
                <span className="font-medium text-slate-900">Faculty · {meta.faculty}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {overviewStats(avgAttendance, enrolled, below75, below50).map((stat) => (
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
            <h2 className="text-lg font-bold text-slate-900">Attendance Trend</h2>
            <p className="mt-1 text-sm text-slate-500">5-week performance overview</p>
            <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-slate-500">Weekly average</span>
                <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 ring-1 ring-red-600/15">
                  Declining
                </span>
              </div>
              <div className="h-[220px] w-full min-w-0">
                {chartReady ? (
                  <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="week" tick={{ fontSize: 12, fill: "#64748b" }} />
                      <YAxis domain={[60, 100]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 12, fill: "#64748b" }} />
                      <Tooltip formatter={(v: number) => [`${v}%`, "Attendance"]} />
                      <Line type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={2} dot={{ fill: "#4f46e5", r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-slate-400">Loading chart...</div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-lg font-bold text-slate-900">Faculty Compliance</h2>
            <p className="mt-1 text-sm text-slate-500">Session recording status</p>
            <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                  {facultyData.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-900">{facultyData.name}</p>
                  <p className="text-sm text-slate-500">{facultyData.department}</p>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-600/15">
                  {facultyData.compliance}% compliant
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: "Required", value: facultyData.required },
                  { label: "Recorded", value: facultyData.recorded },
                  { label: "Missing", value: facultyData.missing },
                  { label: "Compliance", value: `${facultyData.compliance}%` },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl bg-slate-50 p-3 text-center">
                    <p className="text-xs font-medium uppercase text-slate-500">{item.label}</p>
                    <p className="mt-1 text-xl font-bold text-slate-900">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-lg font-bold text-slate-900">Low Attendance Students</h2>
            <p className="mt-1 text-sm text-slate-500">{filteredStudents.length} student(s) shown</p>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name or roll number..."
                  className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All statuses</option>
                <option value="Critical">Critical</option>
                <option value="Warning">Warning</option>
              </select>
            </div>

            <div className="mt-4 hidden lg:block overflow-hidden rounded-2xl border border-slate-200">
              <div className="grid grid-cols-[0.6fr_1.4fr_0.8fr_0.8fr] gap-3 border-b border-slate-200 bg-slate-50/90 px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                {["Roll", "Student", "Attendance", "Status"].map((h) => (
                  <div key={h} className="text-center">{h}</div>
                ))}
              </div>
              {filteredStudents.length === 0 ? (
                <div className="px-4 py-12 text-center text-sm text-slate-500">No students match your search.</div>
              ) : (
                filteredStudents.map((student) => (
                  <div key={student.roll} className="grid grid-cols-[0.6fr_1.4fr_0.8fr_0.8fr] items-center gap-3 border-b border-slate-100 px-4 py-3.5 text-sm last:border-b-0 hover:bg-slate-50/80">
                    <div className="text-center text-slate-600">{student.roll}</div>
                    <div className="text-left font-medium text-slate-900">{student.name}</div>
                    <div className={`text-center font-semibold ${attendanceColor(student.attendance)}`}>{student.attendance}%</div>
                    <div className="flex justify-center">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(student.status)}`}>{student.status}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <ul className="mt-4 divide-y divide-slate-100 lg:hidden" role="list">
              {filteredStudents.map((student) => (
                <li key={`${student.roll}-mobile`} className="p-3">
                  <article className="rounded-2xl border border-slate-200 border-l-[3px] border-l-red-500 bg-white p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm text-slate-500">Roll {student.roll}</p>
                        <h3 className="font-bold text-slate-900">{student.name}</h3>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(student.status)}`}>{student.status}</span>
                    </div>
                    <p className={`mt-2 text-lg font-bold ${attendanceColor(student.attendance)}`}>{student.attendance}%</p>
                  </article>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10">
            <h2 className="text-lg font-bold text-slate-900">Session History</h2>
            <p className="mt-1 text-sm text-slate-500">Recent attendance sessions</p>

            <div className="mt-4 hidden lg:block overflow-hidden rounded-2xl border border-slate-200">
              <div className="grid grid-cols-[1fr_0.8fr_0.6fr_0.6fr_0.6fr] gap-3 border-b border-slate-200 bg-slate-50/90 px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                {["Date", "Time", "Present", "Absent", "Rate"].map((h) => (
                  <div key={h} className="text-center">{h}</div>
                ))}
              </div>
              {sessionHistory.map((session) => {
                const rate = Math.round((session.present / (session.present + session.absent)) * 100);
                return (
                  <div key={session.date} className="grid grid-cols-[1fr_0.8fr_0.6fr_0.6fr_0.6fr] items-center gap-3 border-b border-slate-100 px-4 py-3.5 text-sm last:border-b-0 hover:bg-slate-50/80">
                    <div className="text-center font-medium text-slate-900">{session.date}</div>
                    <div className="text-center text-slate-600">{session.time}</div>
                    <div className="text-center font-medium text-emerald-700">{session.present}</div>
                    <div className="text-center font-medium text-red-700">{session.absent}</div>
                    <div className="flex justify-center">
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800">{rate}%</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <ul className="mt-4 space-y-3 lg:hidden" role="list">
              {sessionHistory.map((session) => {
                const rate = Math.round((session.present / (session.present + session.absent)) * 100);
                return (
                  <li key={`${session.date}-mobile`}>
                    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-slate-900">{session.date}</p>
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">{rate}%</span>
                      </div>
                      <p className="mt-1 text-sm text-slate-500">{session.time}</p>
                      <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                        <div><p className="text-xs text-slate-400">Present</p><p className="font-medium text-emerald-700">{session.present}</p></div>
                        <div><p className="text-xs text-slate-400">Absent</p><p className="font-medium text-red-700">{session.absent}</p></div>
                      </div>
                    </article>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="mt-10">
            <h2 className="text-lg font-bold text-slate-900">Insights</h2>
            <p className="mt-1 text-sm text-slate-500">Automated flags and recommendations</p>
            <div className="mt-4 divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {insights.map((item) => (
                <div key={item.title} className="flex items-start gap-3 p-4">
                  <span className={`rounded-xl p-2.5 ${item.color}`}>
                    <item.icon size={18} />
                  </span>
                  <div>
                    <p className="font-semibold text-slate-900">{item.title}</p>
                    <p className="mt-0.5 text-sm text-slate-500">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-lg font-bold text-slate-900">Actions</h2>
            <p className="mt-1 text-sm text-slate-500">Reports, exports, and notifications</p>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {actionButtons.map((action) => (
                <button
                  key={action.id}
                  type="button"
                  disabled={actionLoading !== null}
                  onClick={action.onClick}
                  className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50/30 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className={`rounded-xl p-3 ${action.color}`}>
                    <action.icon size={22} />
                  </span>
                  <div className="text-center">
                    <p className="font-semibold text-slate-900">
                      {actionLoading === action.id ? "Processing..." : action.label}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">{action.sub}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold font-comfortaa text-slate-900">
                {confirmAction === "faculty" ? "Notify Faculty" : "Notify HOD"}
              </h3>
              <button type="button" onClick={() => setConfirmAction(null)} className="rounded-full p-2 hover:bg-slate-100">
                <X size={22} />
              </button>
            </div>
            <p className="text-sm text-slate-600">
              {confirmAction === "faculty"
                ? `Send an attendance reminder to ${meta.faculty} about missing sessions and students below 75%?`
                : `Escalate low attendance and missing sessions for ${subjectName} to the ${meta.department} HOD?`}
            </p>
            <div className="mt-6 flex gap-3">
              <button type="button" onClick={() => setConfirmAction(null)} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                Cancel
              </button>
              <button
                type="button"
                onClick={() => sendNotification(confirmAction)}
                className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SubjectAttendanceDetail;
