"use client"
import AdminNavbar from '@/utils/AdminNavbar'
import { Bell, Clock, Divide, Search, SquarePen, UserCheck2 } from 'lucide-react'
import React, { useState } from 'react'
import { Percent, CircleCheckBig, CircleX, CalendarDays } from 'lucide-react';
import { CalendarCheck, UserCheck, ClipboardCheck } from 'lucide-react';
import { AlertTriangle, AlertCircle, ShieldAlert, Ban } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";    


import {
  LayoutDashboard,
  BookOpen,
  MessageCircle,
  BarChart3,
  Settings,
  X,
  CheckCircle,
  Award,
  Users,
  Menu,
} from "lucide-react";


function attendance() {
    const [username, setUsername] = useState("Ajitesh")

    const attendanceData = [
  {
    subject: "Database Management Systems",
    faculty: "Dr. Sharma",
    attendance: "84%",
    status: "Excellent",
  },

  {
    subject: "Operating Systems",
    faculty: "Prof. Verma",
    attendance: "76%",
    status: "Good",
  },

  {
    subject: "Computer Networks",
    faculty: "Dr. Rao",
    attendance: "68%",
    status: "Average",
  },

  {
    subject: "Software Engineering",
    faculty: "Prof. Mehta",
    attendance: "91%",
    status: "Excellent",
  },
];

const data = [
  {
    name: "Present",
    value: 42,
    percentage: "84%",
    color: "#6366F1",
  },

  {
    name: "Absent",
    value: 8,
    percentage: "16%",
    color: "#F59E0B",
  },
];

    // const attendanceCard = [
    //     {icon: <Percent/> , heading: "Overall Attandance", percentage: "82", totalClass: "50", progress: 70},
    //     {icon: <CircleCheckBig/>, heading: "Present Classes", percentage: "46", totalClass: "50", progress: 90},
    //     {icon:<CircleX/>, heading: "Absent Classes", percentage: "6", totalClass: "50", progress: 10},
    //     {icon: <CalendarDays/>, heading: "Classes Today", percentage: "5", totalClass: "50", progress: 20, completed:"2", Live: "2"},
    // ]

    const todaysClasses = [
        {icon : <UserCheck2/>, heading: "Operatings Systems", faculty: "Dr Sharma", time: "9:00 AM", status: "completed"},
        {icon : <UserCheck2/>, heading: "Operatings Systems", faculty: "Dr Sharma", time: "10:00 AM", status: "upcoming"},
        {icon : <UserCheck2/>, heading: "Operatings Systems", faculty: "Dr Sharma", time: "11:00 AM", status: "upcoming"},
        {icon : <UserCheck2/>, heading: "Operatings Systems", faculty: "Dr Sharma", time: "04:00 AM", status: "upcoming"},
        {icon : <UserCheck2/>, heading: "Operatings Systems", faculty: "Dr Sharma", time: "5:00 PM", status: "upcoming"},
    ]

//     const data = [
//   { name: "Present", value: 42, percentage: "84%", color: "#22c55e" }, // Green-500
//   { name: "Absent", value: 6, percentage: "12%", color: "#ef4444" },  // Red-500
//   { name: "Late", value: 2, percentage: "4%", color: "#eab308" },    // Yellow-500
// ];

const tableData = [
    {date: "14 MAY 2026", subject : "Data Structure and Algorithm", faculty : "Dr.Sharma", status: "present", method: "QR Code", time: "9:02 AM"},
    {date: "13 MAY 2026", subject : "Physics", faculty : "Dr.Mukherjee", status: "present", method: "QR Code", time: "9:02 AM"},
    {date: "10 Apr 2026", subject : "Mathematics", faculty : "Dr.Patra", status: "Absent", method: "--", time: "10:00 AM"},
    {date: "10 Feb 2026", subject : "English", faculty : "Dr.Dash", status: "present", method: "Code", time: "1:30 AM"},
    {date: "10 Jan 2026", subject : "Communation English", faculty : "Dr.Kunal", status: "Absent", method: "--", time: "9:02 AM"},
]

  return (
    <div className=' text-black bg-linear-to-br from-slate-50 via-white to-slate-50 min-h-screen p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col lg:flex-row lg:gap-8 w-full'>
      <div className=''>
        <AdminNavbar/>
      </div>

      {/* Right Side */}

      <div className="flex-1 min-w-0 overflow-hidden rounded-2xl bg-white p-5 text-slate-900 shadow-sm transition-all duration-300 sm:rounded-3xl sm:p-6 md:p-7 lg:p-8">
        {/* Header */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 pb-6 sm:pb-8 border-b border-slate-200">
            {/* Greeting */}
            <div className="min-w-0">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">
                Hello {username} 👋
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 sm:mt-2">
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
                
                className="p-2.5 sm:p-3 bg-slate-100 border border-slate-200 hover:bg-indigo-50 hover:border-indigo-300 text-slate-600 rounded-lg sm:rounded-xl transition-all shrink-0 flex items-center justify-center"
              >
                <SquarePen size={18} />
              </button>
            </div>
          </div>

        {/* Main Content */}

            <div className="flex w-full min-w-0 flex-col gap-6 xl:flex-row">

            {/* ================= LEFT SECTION ================= */}
            <div
                className="
                xl:w-3/5
                w-full
                min-w-0
                bg-white
                border
                border-slate-200
                rounded-3xl
                shadow-sm
                p-4
                sm:p-5
                lg:p-6
                space-y-6
                "
            >

                {/* HEADER */}
                <div
                className="
                    flex
                    flex-col
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                    gap-4
                "
                >

                <div>

                    <h2
                    className="
                        text-xl
                        sm:text-2xl
                        font-bold
                        tracking-tight
                        text-slate-900
                    "
                    >
                    Live Attendance Session
                    </h2>

                    <p className="text-sm text-slate-500 mt-1">
                    Mark your attendance before session expires
                    </p>
                </div>

                <span
                    className="
                    w-fit
                    px-3
                    py-1
                    rounded-full
                    bg-red-100
                    text-red-600
                    text-sm
                    font-semibold
                    "
                >
                    🔴 Live
                </span>
                </div>

                {/* SESSION CARD */}
                <div
                className="
                    bg-gradient-to-r
                    from-purple-50
                    to-indigo-50
                    border
                    border-purple-100
                    rounded-3xl
                    p-4
                    sm:p-5
                "
                >

                <div
                    className="
                    flex
                    flex-col
                    lg:flex-row
                    gap-6
                    lg:items-center
                    lg:justify-between
                    "
                >

                    {/* LEFT CONTENT */}
                    <div className="flex items-start gap-4">

                    {/* ICON */}
                    <div
                        className="
                        w-14
                        h-14
                        sm:w-16
                        sm:h-16
                        rounded-2xl
                        bg-purple-600
                        flex
                        items-center
                        justify-center
                        text-white
                        shrink-0
                        "
                    >
                        <BookOpen className="w-7 h-7 sm:w-8 sm:h-8" />
                    </div>

                    {/* TEXT */}
                    <div className="min-w-0">

                        <h3
                        className="
                            text-lg
                            sm:text-xl
                            font-bold
                            text-slate-900
                            leading-tight
                        "
                        >
                        Database Management Systems
                        </h3>

                        <div className="mt-3 space-y-2">

                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Users className="w-4 h-4 shrink-0" />
                            <span>Dr. Sharma</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <CheckCircle className="w-4 h-4 shrink-0" />
                            <span>10:00 AM - 11:00 AM</span>
                        </div>

                        </div>
                    </div>
                    </div>

                    {/* TIMER */}
                    <div
                    className="
                        bg-white
                        rounded-2xl
                        px-5
                        py-4
                        text-center
                        border
                        border-slate-200
                        w-full
                        sm:w-fit
                        sm:min-w-[170px]
                    "
                    >

                    <p className="text-sm text-slate-500">
                        Session expires in
                    </p>

                    <h2
                        className="
                        text-3xl
                        sm:text-4xl
                        font-bold
                        tracking-tight
                        text-slate-900
                        mt-2
                        "
                    >
                        02:23
                    </h2>

                    <p className="text-xs text-green-600 font-medium mt-2">
                        Attendance active
                    </p>
                    </div>

                </div>
                </div>

                {/* ACTION SECTION */}
                <div className="grid grid-cols-1 lg:grid-cols-2">

                {/* QR SECTION */}
                <div
                    className="
                    flex
                    flex-col
                    items-center
                    text-center
                    px-4
                    py-6
                    lg:border-r
                    border-slate-200
                    "
                >

                    <h3 className="font-semibold text-lg text-slate-900">
                    Scan QR Code
                    </h3>

                    <p className="text-sm text-slate-500 mt-2 max-w-xs leading-relaxed">
                    Open your camera and scan the QR code shown by the faculty
                    </p>

                    {/* QR BOX */}
                    <div
                    className="
                        w-32
                        h-32
                        sm:w-40
                        sm:h-40
                        bg-slate-100
                        rounded-2xl
                        mt-6
                        flex
                        items-center
                        justify-center
                        text-slate-400
                        text-sm
                    "
                    >
                    QR Scanner
                    </div>

                    <button
                    className="
                        mt-6
                        w-full
                        sm:w-auto
                        bg-purple-600
                        hover:bg-purple-700
                        active:scale-95
                        transition-all
                        text-white
                        px-5
                        py-3
                        rounded-2xl
                        font-semibold
                    "
                    >
                    Scan QR Code
                    </button>
                </div>

                {/* CODE SECTION */}
                <div
                    className="
                    flex
                    flex-col
                    items-center
                    text-center
                    px-4
                    py-6
                    border-t
                    lg:border-t-0
                    border-slate-200
                    "
                >

                    <h3 className="font-semibold text-lg text-slate-900">
                    Attendance Code
                    </h3>

                    <p className="text-sm text-slate-500 mt-2 max-w-xs leading-relaxed">
                    Enter the 6-digit attendance code shared by faculty
                    </p>

                    {/* INPUT */}
                    <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter Code"
                    className="
                        mt-6
                        w-full
                        max-w-[220px]
                        border
                        border-slate-200
                        rounded-2xl
                        px-4
                        py-3
                        text-center
                        text-lg
                        tracking-[0.3em]
                        font-semibold
                        focus:outline-none
                        focus:ring-2
                        focus:ring-purple-500
                    "
                    />

                    <button
                    className="
                        mt-6
                        w-full
                        sm:w-auto
                        bg-purple-600
                        hover:bg-purple-700
                        active:scale-95
                        transition-all
                        text-white
                        px-5
                        py-3
                        rounded-2xl
                        font-semibold
                    "
                    >
                    Submit Code
                    </button>

                </div>

                </div>

            </div>

            {/* ================= RIGHT SECTION ================= */}
            <div
                className="
                xl:w-2/5
                w-full
                min-w-0
                bg-white
                border
                border-slate-200
                rounded-3xl
                shadow-sm
                p-4
                sm:p-6
                space-y-6
                "
            >

                {/* HEADER */}
                <div
                className="
                    flex
                    flex-col
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                    gap-4
                    border-b
                    border-slate-200
                    pb-5
                "
                >

                <div>

                    <h2
                    className="
                        text-lg
                        sm:text-xl
                        font-bold
                        tracking-tight
                        text-slate-900
                    "
                    >
                    Today's Classes
                    </h2>

                    <p className="text-sm text-slate-500 mt-1">
                    Your scheduled classes for today
                    </p>
                </div>

                <button
                    className="
                    text-sm
                    font-semibold
                    text-indigo-600
                    hover:text-indigo-700
                    transition-colors
                    self-start
                    sm:self-auto
                    "
                >
                    View Timetable
                </button>
                </div>

                {/* CLASS LIST */}
                <div className="space-y-4">

                {todaysClasses.map((classItem, index) => (

                    <div
                    key={index}
                    className="
                        flex
                        flex-col
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                        gap-4
                        p-4
                        rounded-2xl
                        border
                        border-slate-100
                        hover:bg-slate-50
                        transition-all
                    "
                    >

                    {/* LEFT */}
                    <div className="flex items-start gap-4">

                        <div
                        className={`
                            w-12
                            h-12
                            rounded-2xl
                            flex
                            items-center
                            justify-center
                            text-white
                            shrink-0

                            ${
                            classItem.status === "completed"
                                ? "bg-green-500"
                                : "bg-amber-500"
                            }
                        `}
                        >

                        {
                            classItem.status === "completed"
                            ? <CheckCircle className="w-6 h-6" />
                            : <Clock className="w-6 h-6" />
                        }

                        </div>

                        <div className="min-w-0">

                        <h3
                            className="
                            font-bold
                            text-slate-900
                            leading-tight
                            text-sm
                            sm:text-base
                            "
                        >
                            {classItem.heading}
                        </h3>

                        <p className="text-sm text-slate-500 mt-1">
                            {classItem.faculty}
                        </p>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div
                        className="
                        flex
                        sm:block
                        items-center
                        justify-between
                        w-full
                        sm:w-auto
                        gap-3
                        sm:text-right
                        "
                    >

                        <p
                        className="
                            text-sm
                            font-semibold
                            text-slate-700
                        "
                        >
                        {classItem.time}
                        </p>

                        <span
                        className={`
                            inline-block
                            px-3
                            py-1
                            rounded-full
                            text-xs
                            font-semibold
                            capitalize

                            ${
                            classItem.status === "completed"
                                ? "bg-green-100 text-green-700"
                                : "bg-amber-100 text-amber-700"
                            }
                        `}
                        >
                        {classItem.status}
                        </span>
                    </div>

                    </div>
                ))}

                </div>

                {/* FOOTER */}
                <div
                className="
                    pt-5
                    border-t
                    border-slate-200
                    flex
                    justify-center
                "
                >
                <button
                    className="
                    text-green-600
                    font-semibold
                    hover:text-green-700
                    transition-colors
                    "
                >
                    View Full Timetable
                </button>
                </div>

            </div>

            </div>

    {/* Warning Card */}

                <div
                className="
                    mt-8
                    rounded-2xl
                    border
                    border-yellow-200
                    bg-gradient-to-r
                    from-yellow-50
                    via-white
                    to-orange-50
                    shadow-sm
                    p-4
                    sm:p-5
                "
                >

                <div
                    className="
                    flex
                    flex-col
                    lg:flex-row
                    lg:items-center
                    lg:justify-between
                    gap-5
                    "
                >

                    {/* LEFT CONTENT */}
                    <div className="flex items-start gap-4">

                    {/* ICON */}
                    <div
                        className="
                        w-12
                        h-12
                        rounded-2xl
                        bg-yellow-100
                        flex
                        items-center
                        justify-center
                        shrink-0
                        "
                    >
                        <AlertTriangle className="w-6 h-6 text-yellow-600" />
                    </div>

                    {/* TEXT */}
                    <div>

                        <h3
                        className="
                            font-bold
                            text-slate-900
                            text-lg
                            tracking-tight
                        "
                        >
                        Low Attendance Alert
                        </h3>

                        <p
                        className="
                            text-sm
                            sm:text-base
                            text-slate-600
                            mt-2
                            leading-relaxed
                            max-w-2xl
                        "
                        >
                        Your attendance in <span className="font-semibold text-slate-900">CSE</span> is currently
                        <span className="text-red-600 font-bold"> 64% </span>
                        which is below the required
                        <span className="font-bold text-slate-900"> 75%</span>.
                        </p>

                    </div>
                    </div>

                    {/* BUTTON */}
                    <div className="w-full sm:w-auto">

                    <button
                        className="
                        w-full
                        sm:w-auto
                        px-5
                        py-3
                        rounded-2xl
                        bg-purple-600
                        hover:bg-purple-700
                        text-white
                        font-semibold
                        shadow-md
                        transition-all
                        duration-300
                        hover:scale-95
                        "
                    >
                        View Details
                    </button>

                    </div>

                </div>

                </div>

          

            {/* ================= LEFT CARD ================= */}
            <div className="w-full min-w-0 ">

                <div
                className="
                    bg-white
                    p-5
                    sm:p-6
                    rounded-3xl
                    border
                    border-slate-200
                    shadow-sm
                "
                >

                {/* HEADER */}
                <h3
                    className="
                    text-xl
                    font-bold
                    text-slate-900
                    tracking-tight
                    "
                >
                    Attendance Summary
                </h3>

                {/* CHART SECTION */}
                <div
                    className="
                    flex
                    flex-col
                    sm:flex-row
                    items-center
                    justify-between
                    gap-6
                    mt-6
                    "
                >

                    {/* CHART */}
                    <div className="w-full sm:w-1/2 h-52 min-w-0">

                    <ResponsiveContainer width="100%" height="100%">

                        <PieChart>

                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={70}
                            paddingAngle={0}
                            dataKey="value"
                            startAngle={90}
                            endAngle={-270}
                        >

                            {data.map((entry, index) => (
                            <Cell
                                key={index}
                                fill={entry.color}
                            />
                            ))}

                        </Pie>

                        </PieChart>

                    </ResponsiveContainer>

                    </div>

                    {/* LEGEND */}
                    <div className="w-full sm:w-1/2 space-y-4">

                    {data.map((item, index) => (

                        <div
                        key={index}
                        className="
                            flex
                            items-start
                            gap-3
                        "
                        >

                        <span
                            className="
                            w-3
                            h-3
                            rounded-full
                            mt-1
                            shrink-0
                            "
                            style={{
                            backgroundColor: item.color
                            }}
                        />

                        <div>

                            <p
                            className="
                                text-sm
                                font-semibold
                                text-slate-800
                            "
                            >
                            {item.name}
                            </p>

                            <p
                            className="
                                text-xs
                                text-slate-500
                                mt-1
                            "
                            >
                            {item.percentage} ({item.value})
                            </p>

                        </div>

                        </div>

                    ))}

                    </div>

                </div>

                {/* DIVIDER */}
                <div className="border-t border-slate-100 my-6" />

                {/* STATS */}
                <div
                    className="
                    grid
                    grid-cols-3
                    text-center
                    gap-4
                    "
                >

                    <div>

                    <p className="text-xs text-slate-400 font-medium">
                        Total
                    </p>

                    <h3
                        className="
                        text-2xl
                        font-bold
                        text-slate-900
                        mt-1
                        "
                    >
                        50
                    </h3>

                    </div>

                    <div>

                    <p className="text-xs text-slate-400 font-medium">
                        Attended
                    </p>

                    <h3
                        className="
                        text-2xl
                        font-bold
                        text-slate-900
                        mt-1
                        "
                    >
                        42
                    </h3>

                    </div>

                    <div>

                    <p className="text-xs text-slate-400 font-medium">
                        Percentage
                    </p>

                    <h3
                        className="
                        text-2xl
                        font-black
                        text-indigo-600
                        mt-1
                        "
                    >
                        84%
                    </h3>

                    </div>

                </div>

                </div>

            </div>

            {/* ================= RIGHT CARD ================= */}
            <div className="w-full min-w-0 mt-6">

                <div
                className="
                    bg-white
                    border
                    border-slate-200
                    rounded-3xl
                    shadow-sm
                    p-5
                    sm:p-6
                    min-h-[360px]
                "
                >

                {/* HEADER */}
                <div
                    className="
                    flex
                    items-center
                    justify-between
                    border-b
                    border-slate-100
                    pb-5
                    "
                >

                    <div>

                    <h2
                        className="
                        text-xl
                        font-bold
                        tracking-tight
                        text-slate-900
                        "
                    >
                        Attendance Records
                    </h2>

                    <p className="text-sm text-slate-500 mt-1">
                        Subject-wise attendance overview
                    </p>

                    </div>

                </div>

                {/* RECORD LIST */}
                {/* <div className="mt-6 space-y-5">

                    {attendanceData.map((item, index) => (

                    <div
                        key={index}
                        className="
                        border
                        border-slate-100
                        rounded-2xl
                        p-4
                        hover:bg-slate-50
                        transition-all
                        "
                    >

                        
                        <div
                        className="
                            flex
                            flex-col
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                            gap-3
                        "
                        >

                        <div>

                            <h3
                            className="
                                font-bold
                                text-slate-900
                            "
                            >
                            {item.subject}
                            </h3>

                            <p
                            className="
                                text-sm
                                text-slate-500
                                mt-1
                            "
                            >
                            {item.faculty}
                            </p>

                        </div>

                        <div
                            className="
                            text-left
                            sm:text-right
                            "
                        >

                            <h3
                            className="
                                text-lg
                                font-bold
                                text-slate-900
                            "
                            >
                            {item.attendance}
                            </h3>

                            <span
                            className={`
                                inline-block
                                mt-2
                                px-3
                                py-1
                                rounded-full
                                text-xs
                                font-semibold

                                ${
                                item.status === "Excellent"
                                    ? "bg-green-100 text-green-700"
                                    : item.status === "Good"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-yellow-100 text-yellow-700"
                                }
                            `}
                            >
                            {item.status}
                            </span>

                        </div>

                        </div> 

                        
                         <div
                        className="
                            mt-5
                            h-3
                            bg-slate-100
                            rounded-full
                            overflow-hidden
                        "
                        >

                        <div
                            className="
                            h-full
                            rounded-full
                            bg-indigo-500
                            "
                            style={{
                            width: item.attendance
                            }}
                        />

                        </div> 

                     </div>

                    ))} 

                </div>  */}

                <div
            className="
                hidden
                lg:block
                mt-6
                bg-white
                rounded-3xl
                border
                border-slate-200
                shadow-sm
                overflow-x-auto
                
            "
            >

            {/* TABLE HEADER */}
            <div
                className="
                min-w-[900px]
                grid
                grid-cols-6
                gap-4
                px-6
                py-5
                border-b
                border-slate-200
                text-sm
                font-bold
                uppercase
                tracking-wide
                text-slate-500
                "
            >

                {
                [
                    "Date",
                    "Subject",
                    "Faculty",
                    "Status",
                    "Method",
                    "Time"
                ].map((heading, index) => (

                    <div
                    key={index}
                    className="text-center"
                    >
                    {heading}
                    </div>

                ))
                }

            </div>

            {/* TABLE BODY */}
            <div className="min-w-[900px]">

                {
                tableData.map((item, index) => (

                    <div
                    key={index}
                    className="
                        grid
                        grid-cols-6
                        gap-4
                        items-center
                        px-6
                        py-5
                        border-b
                        border-slate-100
                        text-sm
                        text-center
                        hover:bg-slate-50
                        transition-all
                    "
                    >

                    {/* DATE */}
                    <div className="font-medium text-slate-700">
                        {item.date}
                    </div>

                    {/* SUBJECT */}
                    <div className="font-semibold text-slate-900">
                        {item.subject}
                    </div>

                    {/* FACULTY */}
                    <div className="text-slate-600">
                        {item.faculty}
                    </div>

                    {/* STATUS */}
                    <div>

                        <span
                        className={`
                            inline-block
                            px-3
                            py-1
                            rounded-full
                            text-xs
                            font-semibold

                            ${
                            item.status === "Available"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }
                        `}
                        >
                        {item.status}
                        </span>

                    </div>

                    {/* METHOD */}
                    <div className="text-slate-700 font-medium">
                        {item.method}
                    </div>

                    {/* TIME */}
                    <div className="text-slate-500">
                        {item.time}
                    </div>

                    </div>

                ))
                }

            </div>

            

            </div>

                <div className="lg:hidden mt-6 space-y-4">

                { tableData.length>0 && tableData.map((data, index) => (

                    <div
                    key={index}
                    className="
                        bg-white
                        border
                        border-slate-200
                        rounded-2xl
                        shadow-sm
                        hover:shadow-md
                        transition-all
                        p-4
                    "
                    >

                    {/* Header */}
                    <div className="flex items-center justify-between">

                        <h3 className="font-bold text-slate-900">
                        {data.subject}
                        </h3>

                        <span
                        className={`
                            px-3 py-1
                            rounded-full
                            text-xs
                            font-semibold
                            text-white

                            ${
                            data.status === "present"
                                ? "bg-green-500"
                                : "bg-red-500"
                            }
                        `}
                        >
                        {data.status === "present"
                            ? "Present"
                            : "Absent"}
                        </span>

                    </div>

                    {/* Faculty & Time */}
                    <div className="mt-3 text-sm text-slate-500">

                        {data.faculty} • {data.time}

                    </div>

                    {/* Method & Date */}
                    <div className="mt-2 text-sm text-slate-600">

                        {data.method === "--"
                        ? "No Method"
                        : data.method}

                        {" • "}
                        {data.date}

                    </div>

                    </div>

                ))}

                </div>

                


                </div>

            </div>

           

      </div>
    </div>
  )
}

export default attendance
