"use client";

import React, { useState, useEffect } from "react";
import {
  BookOpen,
  X,
  Bell,
  Search,
  SquarePen,
  CheckCircle,
  LogOut,
  ArrowRight,
  ClipboardList,
  SlidersHorizontal,
  Percent,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import StudentPlanner from "@/utils/StudentPlanner";
import toast from "react-hot-toast";
import axios from "axios";
// import { Router } from "next/router";
import { useRouter } from "next/navigation";

type DashboardAssignment = {
  id: string;
  title: string;
  dueDate: string;
  marks: number;
  dueStatus: "upcoming" | "due_today" | "overdue";
};

type DashboardCards = {
  courseProgress: number;
  subjectCount: number;
  completedToday: number;
  classesToday: number;
  pendingAssignments: number;
  attendanceThisSem: number;
};

function dueLabel(status: DashboardAssignment["dueStatus"]) {
  if (status === "overdue") return "Overdue";
  if (status === "due_today") return "Due today";
  return "Upcoming";
}

function Dashboard() {
  const [openProfile, setOpenProfile] = useState(false);
  const [username, setUsername] = useState("Ajitesh");
  const [assignments, setAssignments] = useState<DashboardAssignment[]>([]);
  const [assignmentsLoading, setAssignmentsLoading] = useState(true);
  const [cards, setCards] = useState<DashboardCards>({
    courseProgress: 0,
    subjectCount: 0,
    completedToday: 0,
    classesToday: 0,
    pendingAssignments: 0,
    attendanceThisSem: 0,
  });
  const [activeHours, setActiveHours] = useState([
    { day: "S", hours: 0 },
    { day: "M", hours: 0 },
    { day: "T", hours: 0 },
    { day: "W", hours: 0 },
    { day: "T", hours: 0 },
    { day: "F", hours: 0 },
    { day: "S", hours: 0 },
  ]);
  const [performanceData, setPerformanceData] = useState<{ month: string; score: number }[]>([]);

  const fetchUsername = async () => {
          try{
              const res = await fetch("/api/users/getUsername");
              const data = await res.json();
              setUsername(data.username);
              console.log("Username:", data.username);
          }catch(err){
            console.log(err);
          }
        }
  
        useEffect(() => {
          fetchUsername();
        }, []);

const router = useRouter();

  const previewAssignments = assignments.slice(0, 3);

  const courseCard = [
    {
      icon: <BookOpen size={24} />,
      heading: "Active Courses",
      value: `${cards.courseProgress}%`,
      bar: cards.courseProgress,
      hint: `${cards.subjectCount} subjects this semester`,
      barColor: "bg-orange-500",
      divColor: "bg-orange-100",
    },
    {
      icon: <CheckCircle size={24} />,
      heading: "Completed Classes",
      value: String(cards.completedToday),
      bar:
        cards.classesToday > 0
          ? Math.round((cards.completedToday / cards.classesToday) * 100)
          : 0,
      hint: `${cards.classesToday} scheduled today`,
      barColor: "bg-green-500",
      divColor: "bg-green-100",
    },
    {
      icon: <ClipboardList size={24} />,
      heading: "Pending Assignments",
      value: String(cards.pendingAssignments),
      bar: Math.min(100, cards.pendingAssignments * 20),
      hint: "Upcoming due dates",
      barColor: "bg-blue-500",
      divColor: "bg-blue-100",
    },
    {
      icon: <Percent size={24} />,
      heading: "Attendance this sem",
      value: `${cards.attendanceThisSem}%`,
      bar: cards.attendanceThisSem,
      hint: "Overall attendance",
      barColor: "bg-purple-500",
      divColor: "bg-purple-100",
    },
  ];

  const handleLogout = async () => {
    console.log("Trying to logout");

    try{
        const res = await axios.post('/api/users/logout');
        toast.success(res?.data?.message || "Logout")

        console.log(res.data)
        router.push("/landingPage")

        
    }catch(err:any){
      console.log("Error message", err)
      toast.error(err?.res?.data?.message ||"Failed to Log Out.")
      console.log("Error while Loging Out. Please try after sometime.")
    }
  }
  
  const handleCompletedClasses = async () => {
    try {
      const res = await axios.get("/api/users/auth/dashboard");
      if (!res.data?.success) return;
      const next = res.data.data;
      if (next?.name) setUsername(next.name);
      if (next?.cards) setCards(next.cards);
      if (Array.isArray(next?.activeHours)) setActiveHours(next.activeHours);
      if (Array.isArray(next?.performance)) setPerformanceData(next.performance);
    } catch (err) {
      console.error("Error fetching dashboard:", err);
    }
  };

  useEffect(() => {
    handleCompletedClasses();
  }, [])

  useEffect(() => {
    const loadAssignments = async () => {
      try {
        const res = await axios.get("/api/users/auth/assignments");
        if (res.data?.success) {
          setAssignments(res.data.data || []);
        }
      } catch (err) {
        console.error("Error fetching assignments:", err);
      } finally {
        setAssignmentsLoading(false);
      }
    };
    loadAssignments();
  }, []);

  

  return (
    <>
          {/* HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 pb-6 sm:pb-8 border-b border-slate-200">
            {/* Greeting */}
            <div className="min-w-0">
              <h2 className="text-2xl font-bold font-comfortaa text-slate-900 sm:text-3xl">
                Hello {username} 👋
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Let's learn something new today
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 shrink-0">
              {/* Search */}
              <div className="relative w-full sm:w-auto flex-1 sm:flex-none">
                <Search 
                  className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400" 
                  size={18}
                />
                <input
                  className="w-full sm:w-52 md:w-60 lg:w-64 pl-10 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-slate-200 rounded-lg sm:rounded-xl text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Search..."
                />
              </div>

              {/* Notification Button */}
              <button className="p-2.5 sm:p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg sm:rounded-xl transition-all shrink-0 flex items-center justify-center">
                <Bell size={18} />
              </button>

              {/* Profile Button */}
              <button
                onClick={() => setOpenProfile(true)}
                className="p-2.5 sm:p-3 bg-slate-100 border border-slate-200 hover:bg-indigo-50 hover:border-indigo-300 text-slate-600 rounded-lg sm:rounded-xl transition-all shrink-0 flex items-center justify-center"
              >
                <SquarePen size={18} />
              </button>

              <button onClick={handleLogout} className="p-2.5 bg-red-600 rounded-lg cursor-pointer">
                <LogOut size={18}/>
              </button>
            </div>
          </div>

          {/* OVERVIEW SECTION */}
          <div className="mt-8">
            <h3 className="mb-5 text-lg font-bold text-slate-900">
              Overview
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {courseCard.map((c, i) => (
                <div
                  key={i}
                  className={`${c.divColor} flex min-h-48 flex-col justify-between rounded-2xl p-4 shadow-sm transition-all duration-200 hover:shadow-md sm:min-h-52 sm:p-5`}
                >
                  {/* Icon and Title */}
                  <div className="flex items-start gap-3">
                    <span className={`${c.barColor} flex shrink-0 items-center justify-center rounded-xl p-2.5 text-white`}>
                      {c.icon}
                    </span>
                    <h4 className="mt-0.5 line-clamp-2 text-sm font-semibold text-slate-900">
                      {c.heading}
                    </h4>
                  </div>

                  {/* Percentage */}
                  <h2 className="my-4 text-2xl font-bold text-slate-900 sm:text-3xl">
                    {c.value}
                  </h2>
                  <p className="-mt-2 mb-3 text-xs text-slate-600">{c.hint}</p>

                  {/* Progress Bar */}
                  <div className="h-2 overflow-hidden rounded-full bg-white/60">
                    <div
                      className={`${c.barColor} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${c.bar}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ANALYTICS SECTION */}
          <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-2">
            {/* BAR CHART */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 sm:text-lg">
                  Active Hours
                </h3>
                <span className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                  This week
                </span>
              </div>

              <div className="h-72 min-w-0 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activeHours} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                    <YAxis tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "#fff", 
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px"
                      }}
                      cursor={{ fill: "rgba(99, 102, 241, 0.1)" }}
                    />
                    <Bar 
                      dataKey="hours" 
                      fill="#6366f1" 
                      radius={[8, 8, 0, 0]}
                      animationDuration={1000}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* LINE CHART */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <h3 className="mb-5 text-base font-bold text-slate-900 sm:text-lg">
                  Performance (SGPA)
                </h3>

              <div className="h-72 min-w-0 sm:h-80">
                {performanceData.length === 0 ? (
                  <p className="flex h-full items-center justify-center text-sm text-slate-500">
                    No semester results published yet
                  </p>
                ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                    <YAxis tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "#fff", 
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px"
                      }}
                      cursor={{ stroke: "rgba(99, 102, 241, 0.2)" }}
                    />
                    <Line 
                      type="monotone"
                      dataKey="score" 
                      stroke="#6366f1" 
                      strokeWidth={3}
                      dot={{ fill: "#6366f1", r: 5 }}
                      activeDot={{ r: 7 }}
                      animationDuration={1000}
                    />
                  </LineChart>
                </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 hidden rounded-lg shadow-md lg:block">
            <div className="flex items-center justify-between p-4">
              <h2 className="text-2xl font-semibold tracking-tight text-black">
                My Assignment
              </h2>
              <button
                type="button"
                onClick={() => router.push("/assignments")}
                className="rounded-xl p-2 text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-600"
                aria-label="View all assignments"
              >
                <ArrowRight size={22} />
              </button>
            </div>

            <div className="overflow-x-auto">
              <div className="mt-2 min-w-187.5">
                <div className="grid grid-cols-[80px_1.7fr_1fr_1fr] items-center border-b border-gray-200 px-2 pb-5 text-center">
                  <div className="flex justify-center text-gray-400">
                    <SlidersHorizontal size={18} />
                  </div>
                  <h3 className="text-sm font-semibold tracking-wide text-gray-400 uppercase">
                    Task
                  </h3>
                  <h3 className="text-sm font-semibold tracking-wide text-gray-400 uppercase">
                    Marks
                  </h3>
                  <h3 className="text-sm font-semibold tracking-wide text-gray-400 uppercase">
                    Update
                  </h3>
                </div>

                <div className="divide-y divide-gray-100">
                  {assignmentsLoading ? (
                    <p className="px-4 py-10 text-center text-sm text-slate-500">
                      Loading assignments…
                    </p>
                  ) : previewAssignments.length === 0 ? (
                    <p className="px-4 py-10 text-center text-sm text-slate-500">
                      No assignments published yet
                    </p>
                  ) : (
                    previewAssignments.map((data) => (
                      <div
                        key={data.id}
                        className="grid grid-cols-[80px_1.7fr_1fr_1fr] items-center px-2 py-7 text-center transition-all hover:bg-gray-50"
                      >
                        <div className="flex justify-center">
                          <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-700">
                            <ClipboardList size={20} />
                          </span>
                        </div>
                        <div>
                          <h2 className="text-[18px] leading-none font-semibold text-gray-900">
                            {data.title}
                          </h2>
                          <p className="mt-3 text-sm font-medium text-gray-400">
                            Due{" "}
                            {new Date(data.dueDate).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                            })}
                          </p>
                        </div>
                        <div>
                          <h2 className="text-[18px] font-bold text-gray-900">
                            --/{data.marks}
                          </h2>
                          <p className="mt-2 text-sm font-medium text-gray-400">
                            Max marks
                          </p>
                        </div>
                        <div>
                          <span
                            className={`rounded-xl px-4 py-2 text-sm font-semibold ${
                              data.dueStatus === "overdue"
                                ? "bg-orange-100 text-orange-500"
                                : data.dueStatus === "due_today"
                                  ? "bg-indigo-100 text-indigo-600"
                                  : "bg-purple-100 text-purple-500"
                            }`}
                          >
                            {dueLabel(data.dueStatus)}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-4 lg:hidden">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">My Assignment</h2>
              <button
                type="button"
                onClick={() => router.push("/assignments")}
                className="rounded-xl p-2 text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-600"
                aria-label="View all assignments"
              >
                <ArrowRight size={20} />
              </button>
            </div>

            {assignmentsLoading ? (
              <p className="rounded-2xl border border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-500">
                Loading assignments…
              </p>
            ) : previewAssignments.length === 0 ? (
              <p className="rounded-2xl border border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-500">
                No assignments published yet
              </p>
            ) : (
              previewAssignments.map((data) => (
                <div
                  key={data.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 text-slate-700">
                        <ClipboardList size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">{data.title}</h3>
                        <p className="mt-1 text-sm text-slate-500">
                          Due{" "}
                          {new Date(data.dueDate).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                          })}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`rounded-xl px-3 py-1 text-xs font-semibold ${
                        data.dueStatus === "overdue"
                          ? "bg-orange-100 text-orange-500"
                          : data.dueStatus === "due_today"
                            ? "bg-indigo-100 text-indigo-600"
                            : "bg-purple-100 text-purple-600"
                      }`}
                    >
                      {dueLabel(data.dueStatus)}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                    <div>
                      <p className="text-xs text-slate-500">Marks</p>
                      <h3 className="text-lg font-bold text-slate-900">
                        --/{data.marks}
                      </h3>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Status</p>
                      <p
                        className={`font-semibold ${
                          data.dueStatus === "overdue"
                            ? "text-orange-500"
                            : data.dueStatus === "due_today"
                              ? "text-indigo-600"
                              : "text-purple-600"
                        }`}
                      >
                        {dueLabel(data.dueStatus)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

        {/* ================= PROFILE SIDEBAR (DESKTOP) ================= */}
        <AnimatePresence>
          {openProfile && (
            <>
              {/* Backdrop Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="hidden lg:block fixed inset-0 bg-black/30 z-40"
                onClick={() => setOpenProfile(false)}
              />
              
              {/* Profile Panel */}
              <motion.div
                initial={{ opacity: 0, x: 400 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 400 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="hidden lg:block fixed right-0 top-0 w-full xl:w-96 h-screen z-50 p-4 sm:p-6 md:p-8 overflow-y-auto"
              >
                <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-7 shadow-xl border border-slate-200">
                {/* Header */}
                <div className="flex justify-between items-center gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-slate-200">
                  <h2 className="font-bold text-base sm:text-lg text-slate-900">
                    Profile
                  </h2>
                  <button
                    onClick={() => setOpenProfile(false)}
                    className="p-2 sm:p-2.5 hover:bg-slate-100 rounded-lg transition-colors shrink-0"
                  >
                    <X size={18} className="text-slate-600" />
                  </button>
                </div>

                {/* Profile Info */}
                <div className="text-center mt-6 sm:mt-8 pb-6 sm:pb-8 border-b border-slate-200">
                  <img
                    src="/campus1.jpg"
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-full mx-auto object-cover border-4 border-indigo-500"
                    alt="Profile"
                  />
                  <h3 className="mt-4 sm:mt-6 font-bold text-base sm:text-lg text-slate-900">
                    {username}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">
                    Student
                  </p>
                </div>

                {/* Student Planner */}
                <div className="mt-6 sm:mt-8">
                  <StudentPlanner />
                </div>
              </div>
            </motion.div>
            </>
          )}
        </AnimatePresence>

      {/* ================= MOBILE PROFILE DRAWER ================= */}
      <AnimatePresence>
        {openProfile && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 lg:hidden z-30"
              onClick={() => setOpenProfile(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.3, type: "spring", damping: 25 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl p-5 sm:p-6 md:p-7 lg:hidden z-40 max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex justify-between items-center gap-4 pb-6 border-b border-slate-200">
                <h2 className="font-bold text-lg sm:text-xl text-slate-900">Profile</h2>
                <button
                  onClick={() => setOpenProfile(false)}
                  className="p-2 sm:p-2.5 hover:bg-slate-100 rounded-lg transition-colors shrink-0"
                >
                  <X size={20} className="text-slate-600" />
                </button>
              </div>

              {/* Profile Info */}
              <div className="text-center mt-6 pb-6 border-b border-slate-200">
                <img
                  src="/campus1.jpg"
                  className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-indigo-500"
                  alt="Profile"
                />
                <h3 className="mt-4 font-bold text-lg text-slate-900">
                  {username}
                </h3>
                <p className="text-sm text-slate-600 mt-2">Student</p>
              </div>

              {/* Student Planner */}
              <div className="mt-6">
                <StudentPlanner />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Dashboard;