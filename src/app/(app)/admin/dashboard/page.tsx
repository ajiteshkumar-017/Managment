"use client";

import React, { useEffect, useState } from "react";
import Bar from "@/utils/Admin/Bar";
import {
  Activity,
  History,
  MonitorPlay,
  Plus,
  ScanFace,
  Shapes,
  User,
  UserRoundCheck,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";

const quickActions = [
  { heading: "Add Student", link: "/admin/students?add=1" },
  { heading: "Add Faculty", link: "/admin/faculty?add=1" },
  { heading: "Add Subject", link: "/admin/subjects?add=1" },
  { heading: "Create Classes", link: "/admin/classes?add=1" },
  { heading: "Publish Notice", link: "/admin/notices?add=1" },
];

function AdminDashboard() {
  const router = useRouter();

  const [open, setOpen] = useState(true);
  const [recentActivities, setRecentActivities] = useState<string[]>([]);
  const [attendanceTrend, setAttendanceTrend] = useState<
    { day: string; attendance: number }[]
  >([]);
  const [attendanceToday, setAttendanceToday] = useState({
    rate: 0,
    present: 0,
    absent: 0,
  });

  const [cardInfo, setCardInfo] = useState({
    TotalStudents: 0,
    TotalFaculty: 0,
    TotalSubject: 0,
    TotalClasses: 0,
    activeNotices: 0,
  });

  const avgTrend =
    attendanceTrend.length > 0
      ? Math.round(
          attendanceTrend.reduce((sum, d) => sum + d.attendance, 0) /
            attendanceTrend.length,
        )
      : 0;

  const dashboardStats = [
    {
      label: "Total Students",
      value: `${cardInfo.TotalStudents}`,
      hint: "All departments",
      icon: <User size={20} />,
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      label: "Total Faculty",
      value: `${cardInfo.TotalFaculty}`,
      hint: "Currently teaching",
      icon: <UserRoundCheck size={20} />,
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      label: "Total Subjects",
      value: `${cardInfo.TotalSubject}`,
      hint: "Across programs",
      icon: <Shapes size={20} />,
      color: "bg-violet-100 text-violet-600",
    },
    {
      label: "Total Classes",
      value: `${cardInfo.TotalClasses}`,
      hint: "Active rooms",
      icon: <MonitorPlay size={20} />,
      color: "bg-cyan-100 text-cyan-600",
    },
    {
      label: "Attendance Today",
      value: `${attendanceToday.rate}%`,
      hint: "Institution average",
      icon: <ScanFace size={20} />,
      color: "bg-amber-100 text-amber-600",
    },
    {
      label: "Active Notices",
      value: `${cardInfo.activeNotices}`,
      hint: "Currently visible",
      icon: <Activity size={20} />,
      color: "bg-rose-100 text-rose-600",
    },
  ];

  const getData = async () => {
    try {
      const res = await axios.get("/api/admin/dashboard");

      if (!res.data?.success) {
        toast.error(res.data?.error || "Failed to fetch dashboard data");
        return;
      }

      const data = res.data.data;
      const stats = data.stats;

      setRecentActivities(data.recentActivities || []);
      setAttendanceTrend(data.attendanceTrend || []);
      setAttendanceToday({
        rate: stats.attendanceToday ?? 0,
        present: stats.presentToday ?? 0,
        absent: stats.absentToday ?? 0,
      });
      setCardInfo({
        TotalStudents: stats.totalStudents ?? 0,
        TotalFaculty: stats.totalFaculty ?? 0,
        TotalSubject: stats.totalSubjects ?? 0,
        TotalClasses: stats.totalClasses ?? 0,
        activeNotices: stats.activeNotices ?? 0,
      });
    } catch (error: any) {
      console.error("Failed to Fetch Data", error);
      if (error?.response?.status === 401) {
        router.replace("/landingPage");
        return;
      }
      toast.error(error?.response?.data?.error || "Failed to Fetch Data");
    }
  };

  useEffect(() => {
    getData();
  }, []);



  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-linear-to-br from-slate-50 via-white to-slate-50 flex flex-col lg:flex-row">
      <Bar open={open} setOpen={setOpen} />

      <div className="flex-1 min-w-0 w-full">
        <div className="overflow-hidden bg-white p-5 text-slate-900 shadow-sm sm:p-6 md:p-7 lg:p-6">
          <div className="border-b border-slate-200 pb-6 sm:pb-8">
            <h1 className="text-2xl font-bold font-comfortaa text-slate-900 sm:text-3xl">
              Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Monitor students, faculty, attendance and academic activities
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {dashboardStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      {stat.label}
                    </p>
                    <h3 className="mt-2 text-2xl font-bold text-slate-900">
                      {stat.value}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">{stat.hint}</p>
                  </div>
                  <span className={`rounded-xl p-2.5 ${stat.color}`}>
                    {stat.icon}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <h2 className="text-lg font-bold text-slate-900">Recent Activities</h2>
            <p className="mt-1 text-sm text-slate-500">
              Latest actions across the institution
            </p>
            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
              {recentActivities.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-slate-500">
                  No recent activity yet
                </p>
              ) : (
                recentActivities.map((activity, index) => (
                  <div
                    key={`${activity}-${index}`}
                    className={`flex items-center gap-3 px-4 py-3.5 sm:px-5 ${
                      index !== recentActivities.length - 1
                        ? "border-b border-slate-100"
                        : ""
                    }`}
                  >
                    <span className="rounded-xl bg-indigo-100 p-2.5 text-indigo-600 shrink-0">
                      <History size={16} />
                    </span>
                    <p className="text-sm font-medium text-slate-700">{activity}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-lg font-bold text-slate-900">Attendance Overview</h2>
            <p className="mt-1 text-sm text-slate-500">
              Weekly trend and today&apos;s snapshot
            </p>

            <div className="mt-4 flex flex-col gap-4 lg:flex-row">
              <div className="w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 lg:w-2/3">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Attendance Trend
                    </p>
                    <h3 className="mt-1 text-2xl font-bold text-slate-900">
                      {avgTrend}%
                    </h3>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-600/15">
                    Last 7 days
                  </span>
                </div>

                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart
                    data={attendanceTrend}
                    margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="attendance" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="day"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 12, fill: "#94a3b8" }}
                      dy={10}
                      height={32}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 12, fill: "#94a3b8" }}
                      domain={[0, 110]}
                      ticks={[0, 20, 40, 60, 80, 100]}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid #e2e8f0",
                        fontSize: "13px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="attendance"
                      stroke="#6366f1"
                      strokeWidth={3}
                      fill="url(#attendance)"
                      activeDot={{ r: 6 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="flex w-full flex-col justify-between gap-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 lg:w-1/3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Today&apos;s Attendance
                  </p>
                  <h3 className="mt-2 text-4xl font-bold text-slate-900">
                    {attendanceToday.rate}%
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">Institution average</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Total Present</p>
                    <p className="mt-1 text-xl font-semibold text-slate-900">
                      {attendanceToday.present}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Total Absent</p>
                    <p className="mt-1 text-xl font-semibold text-slate-900">
                      {attendanceToday.absent}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 mb-2">
            <h2 className="text-lg font-bold text-slate-900">Quick Actions</h2>
            <p className="mt-1 text-sm text-slate-500">
              Jump to common admin tasks
            </p>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {quickActions.map((action) => (
                <button
                  key={action.heading}
                  type="button"
                  onClick={() => router.push(action.link)}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 active:scale-[0.98] cursor-pointer"
                >
                  <Plus size={16} />
                  {action.heading}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
