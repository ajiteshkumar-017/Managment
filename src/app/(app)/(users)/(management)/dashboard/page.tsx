"use client";

import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  BookOpen,
  MessageCircle,
  BarChart3,
  CalendarDays,
  Settings,
  X,
  Bell,
  Search,
  SquarePen,
  CheckCircle,
  Award,
  Users,
  Menu,
  LogOut,
} from "lucide-react";
import {
  SlidersHorizontal,
  Type,
  GitBranch,
  PenTool,
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

function Dashboard() {
  const [openProfile, setOpenProfile] = useState(false);
  const [username, setUsername] = useState("Ajitesh");
  const [completeClasses, setCompleteClasses] = useState(0);

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

  const courseCard = [
    {
      icon: <BookOpen size={24} />,
      heading: "Active Courses",
      percentage: 20,
      barColor: "bg-orange-500",
      divColor: "bg-orange-100",
    },
    {
      icon: <CheckCircle size={24} />,
      heading: "Completed Courses",
      percentage: 23,
      barColor: "bg-green-500",
      divColor: "bg-green-100",
    },
    {
      icon: <Award size={24} />,
      heading: "Certificates",
      percentage: 20,
      barColor: "bg-blue-500",
      divColor: "bg-blue-100",
    },
    {
      icon: <Users size={24} />,
      heading: "Community",
      percentage: 20,
      barColor: "bg-purple-500",
      divColor: "bg-purple-100",
    },
  ];

  const assignmentData = [
  {
    icon: <Type size={20} />,
    taskName: "Typography test",
    doneTime: "Today, 10:30 AM",
    grade: "190/200",
    status: "Completed",
  },

  {
    icon: <GitBranch size={20} />,
    taskName: "Inclusive design test",
    doneTime: "Tomorrow, 10:30 AM",
    grade: "160/200",
    status: "Completed",
  },

  {
    icon: <PenTool size={20} />,
    taskName: "Drawing test",
    doneTime: "23 Feb, 12:30 PM",
    grade: "--/200",
    status: "Upcoming",
  },
];

  const activeHours = [
    { day: "S", hours: 2 },
    { day: "M", hours: 5 },
    { day: "T", hours: 3 },
    { day: "W", hours: 4 },
    { day: "T", hours: 7 },
    { day: "F", hours: 3 },
    { day: "S", hours: 3 },
  ];

  const performanceData = [
    { month: "Jan", score: 30 },
    { month: "Feb", score: 45 },
    { month: "Mar", score: 35 },
    { month: "Apr", score: 50 },
    { month: "May", score: 65 },
    { month: "Jun", score: 55 },
  ];

  const [mobileView, setMobileView] = useState(false)

  const handleLeft = () => {
    console.log("Clicked")
  }

  const handleLogout = async () => {
    console.log("Trying to logout");

    try{
        const res = await axios.post('/api/users/logout');
        toast.success(res?.data?.message || "Logout")

        console.log(res.data)
        router.push("/landingPage")

        
    }catch(err:any){
      toast.error(err?.res?.data?.message ||"Failed to Log Out.")
      console.error("Error while Loging Out. Please try after sometime.")
    }
  }
  
  const handleCompletedClasses = async () => {
    console.log("Trying to fetch completed classes");
    try{
        const res = await axios.get('/api/users/auth/dashboard');
       
    } catch (err) {
        console.error("Error fetching completed classes:", err);  
    }

  }

  useEffect(() => {
    handleCompletedClasses();
  }, [])

  

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
                    {c.percentage}%
                  </h2>

                  {/* Progress Bar */}
                  <div className="h-2 bg-white/60 rounded-full overflow-hidden">
                    <div
                      className={`${c.barColor} h-full transition-all duration-500 rounded-full`}
                      style={{ width: `${c.percentage}%` }}
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
                <select className="cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option>Weekly</option>
                  <option>Monthly</option>
                  <option>Yearly</option>
                </select>
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
                Performance
              </h3>

              <div className="h-72 min-w-0 sm:h-80">
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
              </div>
            </div>
          </div>

          <div className="hidden lg:block mt-4 rounded-lg shadow-md  ">
               
               <h2 className="text-2xl text-black font-semibold tracking-tight leading-4 p-4">My Assignment</h2>
                      {/* Heading and Icon Section */}

                      {/* <div className="grid lg:grid-cols-4 ">
                        {
                          ["BookOpen", "Task", "Grade", "Update"].map((heading, index) => 
                          

                            (
                              <div key={index} className="text-center border-b border-gray-200 p-4">
                                  {heading}
                              </div>
                            )
                          )
                        }
                      </div> */}


                      {/* Content Area */}

                     <div className="overflow-x-auto ">

                    {/* HEADER */}
                    {/* <div
                      className="
                        min-w-[700px]
                        grid
                        grid-cols-4
                        border-b
                        border-gray-200
                        pb-4
                        px-4 text-center mt-4
                      "
                    >
                      <h3 className="font-semibold text-gray-500">
                        BookOpen
                      </h3>

                      <h3 className="font-semibold text-gray-500">
                        Task
                      </h3>

                      <h3 className="font-semibold text-gray-500">
                        Grade
                      </h3>

                      <h3 className="font-semibold text-gray-500">
                        Update
                      </h3>
                    </div> */}

                    {/* CONTENT */}
                    <div className="overflow-x-auto mt-6">

                    {/* TABLE WRAPPER */}
                    <div className="min-w-187.5">

                      {/* HEADER */}
                      <div
                        className="
                          grid
                          grid-cols-[80px_1.7fr_1fr_1fr]
                          items-center
                          pb-5
                          border-b
                          border-gray-200
                          px-2
                          text-center
                        "
                      >
                        <div className="flex justify-center text-gray-400">
                          <SlidersHorizontal size={18} />
                        </div>

                        <h3
                          className="
                            text-sm
                            font-semibold
                            tracking-wide
                            text-gray-400
                            uppercase
                          "
                        >
                          Task
                        </h3>

                        <h3
                          className="
                            text-sm
                            font-semibold
                            tracking-wide
                            text-gray-400
                            uppercase
                          "
                        >
                          Grade
                        </h3>

                        <h3
                          className="
                            text-sm
                            font-semibold
                            tracking-wide
                            text-gray-400
                            uppercase
                          "
                        >
                          Update
                        </h3>
                      </div>

                      {/* ROWS */}
                      <div className="divide-y divide-gray-100">

                        {assignmentData.map((data, index) => (

                          <div
                            key={index}
                            className="
                              grid
                              grid-cols-[80px_1.7fr_1fr_1fr]
                              items-center
                              px-2
                              py-7
                              hover:bg-gray-50
                              transition-all
                              text-center 
                            "
                          >

                            {/* ICON */}
                            <div className="flex justify-center">
                              <span
                                className="
                                  w-11
                                  h-11
                                  rounded-2xl
                                  border
                                  border-gray-200
                                  flex
                                  items-center
                                  justify-center
                                  text-gray-700
                                  bg-white
                                "
                              >
                                {data.icon}
                              </span>
                            </div>

                            {/* TASK */}
                            <div>
                              <h2
                                className="
                                  text-[18px]
                                  font-semibold
                                  text-gray-900
                                  leading-none
                                "
                              >
                                {data.taskName}
                              </h2>

                              <p
                                className="
                                  mt-3
                                  text-sm
                                  text-gray-400
                                  font-medium
                                "
                              >
                                {data.doneTime}
                              </p>
                            </div>

                            {/* GRADE */}
                            <div>
                              <h2
                                className="
                                  text-[18px]
                                  font-bold
                                  text-gray-900
                                "
                              >
                                {data.grade}
                              </h2>

                              <p
                                className="
                                  mt-2
                                  text-sm
                                  text-gray-400
                                  font-medium
                                "
                              >
                                Final grade
                              </p>
                            </div>

                            {/* STATUS */}
                            <div>
                              <span
                                className={`
                                  px-4
                                  py-2
                                  rounded-xl
                                  text-sm
                                  font-semibold
                                  ${
                                    data.status === "Completed"
                                      ? "bg-purple-100 text-purple-500"
                                      : "bg-orange-100 text-orange-400"
                                  }
                                `}
                              >
                                {data.status}
                              </span>
                            </div>

                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  </div>

                  
                {/* hello */}
               <div>

               </div>
               
          </div>

          <div className="lg:hidden mt-6 space-y-4">

  {assignmentData.map((data, index) => (

    <div
      key={index}
      className="
        bg-white
        border
        border-slate-200
        rounded-2xl
        p-4
        shadow-sm
      "
    >

      {/* Top */}
      <div className="flex items-start justify-between gap-4">

        <div className="flex items-center gap-3">

          <div
            className="
              w-12
              h-12
              rounded-xl
              border
              border-slate-200
              flex
              items-center
              justify-center
              text-slate-700
            "
          >
            {data.icon}
          </div>

          <div>

            <h3
              className="
                font-bold
                text-slate-900
              "
            >
              {data.taskName}
            </h3>

            <p
              className="
                text-sm
                text-slate-500
                mt-1
              "
            >
              {data.doneTime}
            </p>

          </div>

        </div>

        <span
          className={`
            px-3
            py-1
            rounded-xl
            text-xs
            font-semibold

            ${
              data.status === "Completed"
                ? "bg-purple-100 text-purple-600"
                : "bg-orange-100 text-orange-500"
            }
          `}
        >
          {data.status}
        </span>

      </div>

      {/* Bottom */}
      <div
        className="
          mt-4
          pt-4
          border-t
          border-slate-100
          flex
          items-center
          justify-between
        "
      >

        <div>

          <p className="text-xs text-slate-500">
            Grade
          </p>

          <h3
            className="
              text-lg
              font-bold
              text-slate-900
            "
          >
            {data.grade}
          </h3>

        </div>

        <div className="text-right">

          <p className="text-xs text-slate-500">
            Status
          </p>

          <p
            className={`
              font-semibold
              ${
                data.status === "Completed"
                  ? "text-purple-600"
                  : "text-orange-500"
              }
            `}
          >
            {data.status}
          </p>

        </div>

      </div>

    </div>

  ))}

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