"use client"

import React, { useState } from 'react'
import Bar from "@/utils/Admin/Bar"
import {
  UserRoundCheck,
  Shapes,
  MonitorPlay,
  ScanFace,
  Activity,
  User,
  History,
  Plus,
} from 'lucide-react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { useRouter } from 'next/navigation';

const attendanceData = [
  { day: 'Mon', attendance: 82 },
  { day: 'Tue', attendance: 88 },
  { day: 'Wed', attendance: 85 },
  { day: 'Thu', attendance: 90 },
  { day: 'Fri', attendance: 87 },
  { day: 'Sat', attendance: 80 },
];

const DashboardCard = [
  { heading: "Total Students", number: 1200, icon: <User size={20} /> },
  { heading: "Total Faculty", number: 700, icon: <UserRoundCheck size={20} /> },
  { heading: "Total Subjects", number: 700, icon: <Shapes size={20} /> },
  { heading: "Total Classes", number: 700, icon: <MonitorPlay size={20} /> },
  { heading: "Attendance Today", number: 700, icon: <ScanFace size={20} /> },
  { heading: "Active Notices", number: 700, icon: <Activity size={20} /> },
]

const quickActions = [
  { heading: "Add Student", link: "/admin/students" },
  { heading: "Add Faculty", link: "/admin/faculty/add-faculty" },
  { heading: "Add Subject", link: "/admin/subjects/add-subject" },
  { heading: "Create Classes", link: "/admin/classes/create-classes" },
  { heading: "Publish Notice", link: "/admin/notices/publish-notice" },
]

const recentActivities = [
  "Ajitesh enrolled in CS202",
  "Faculty Dr Smith created attendance session",
  "Result published for Semester 4",
  "Notice added by Admin",
]

function page() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="bg-linear-to-br from-slate-50 via-white to-slate-50 flex flex-col lg:flex-row min-h-screen w-full items-stretch">

      
     <Bar open={sidebarOpen} setOpen={setSidebarOpen} />

      
      <div className="flex-1 min-w-0">
        <div className="w-full min-h-screen border border-slate-100 shadow-md p-4 sm:p-6 pt-5">

          
          <div className="mb-8">
            <h1 className="font-comfortaa lg:text-2xl text-3xl font-bold text-slate-900">
              Admin Dashboard
            </h1>
            <p className="text-slate-500 mt-2 text-sm sm:text-base">
              Monitor students, faculty, attendance and academic activities.
            </p>
          </div>

          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 mt-8 gap-3 sm:gap-5">
            {DashboardCard.map((data, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                    {data.icon}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium text-right leading-tight">
                    {data.heading}
                  </p>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-4 sm:mt-5">
                  {data.number}
                </h2>
              </div>
            ))}
          </div>

          
          <div className="mt-10 sm:mt-12">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-5">
              Recent Activities
            </h3>
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-6">
              {recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 sm:gap-4 py-3 sm:py-4 ${index !== recentActivities.length - 1 ? "border-b border-slate-100" : ""}`}
                >
                  <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                    <History size={16} />
                  </div>
                  <p className="text-slate-700 text-sm sm:text-base font-medium">
                    {activity}
                  </p>
                </div>
              ))}
            </div>
          </div>

          
          <div className="mt-10 sm:mt-12 w-full">
            <h2 className="text-xl sm:text-2xl font-bold text-black">Attendance Overview</h2>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-6 mt-4 flex flex-col lg:flex-row gap-6">

              
              <div className="w-full lg:w-2/3 bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-6">
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <div>
                    <p className="text-xs sm:text-sm text-slate-500">Attendance Trend</p>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900">87%</h3>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs sm:text-sm font-medium">
                    +4.2%
                  </span>
                </div>

                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart
                    data={attendanceData}
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
                      tick={{ fontSize: 12, fill: '#94a3b8' }}
                      dy={10}
                      height={32}
                    />

                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 12, fill: '#94a3b8' }}
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

              
              <div className="w-full lg:w-1/3 rounded-3xl bg-linear-to-br from-indigo-600 to-violet-600 text-white p-5 sm:p-6 flex flex-row lg:flex-col justify-between gap-4 items-center lg:items-start">
                <div>
                  <p className="text-xs sm:text-sm opacity-80">Today's Attendance</p>
                  <h2 className="text-4xl sm:text-5xl font-bold mt-2 sm:mt-4">85%</h2>
                </div>
                <div className="flex flex-row lg:flex-col gap-4 sm:gap-5">
                  <div>
                    <p className="text-xs sm:text-sm opacity-80">Total Present</p>
                    <h3 className="text-xl sm:text-2xl font-semibold">1200</h3>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm opacity-80">Total Absent</p>
                    <h3 className="text-xl sm:text-2xl font-semibold">200</h3>
                  </div>
                </div>
              </div>

            </div>
          </div>

          
          <div className="mt-10 sm:mt-12 mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-5">
              Quick Actions
            </h3>
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => router.push(action.link)}
                    className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 text-sm sm:text-base rounded-2xl font-semibold transition-all hover:shadow-lg active:scale-95 cursor-pointer"
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
    </div>
  )
}

export default page