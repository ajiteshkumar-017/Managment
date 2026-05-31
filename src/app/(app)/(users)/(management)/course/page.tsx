"use client"

import AdminNavbar from '@/utils/AdminNavbar'
import axios from 'axios'
import { Bell, Search } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import toast from "react-hot-toast"
import {Loader2} from "lucide-react"

function Course() {
  const [username, setUsername] = useState("")
  const [attendanceData, setAttendanceData] = useState([])
  const [loading, setLoading] = useState(true)

//   

//   {
//     subjectCode: "CSE201",
//     subject: "Data Structures",
//     faculty: "Mr. Sharma",
//     credits: 4,
//     attendance: "92%",
//     // present: 23,
//     // absent: 2,
//     // status: "Excellent",
//   },

//   {
//     subjectCode: "CSE202",
//     subject: "Database Management System",
//     faculty: "Mrs. Priya",
//     credits: 3,
//     attendance: "81%",
//     // present: 21,
//     // absent: 5,
//     // status: "Good",
//   },

//   {
//     subjectCode: "CSE203",
//     subject: "Operating Systems",
//     faculty: "Mr. Das",
//     credits: 4,
//     attendance: "74%",
//     // present: 19,
//     // absent: 7,
//     // status: "Average",
//   },

//   {
//     subjectCode: "CSE204",
//     subject: "Computer Networks",
//     faculty: "Dr. Reddy",
//     credits: 3,
//     attendance: "65%",
//     // present: 17,
//     // absent: 9,
//     // status: "Low",
//   },

//   {
//     subjectCode: "CSE205",
//     subject: "Software Engineering",
//     faculty: "Ms. Kavya",
//     credits: 2,
//     attendance: "96%",
//     // present: 24,
//     // absent: 1,
//     status: "Excellent",
//   },

//   {
//     subjectCode: "CSE206",
//     subject: "Artificial Intelligence",
//     faculty: "Dr. Mehta",
//     credits: 4,
//     attendance: "70%",
//     // present: 18,
//     // absent: 8,
//     // status: "Warning",
//   },

// ];

const fetchTableData = async () => {
  setLoading(true)
  try {
    const response = await axios.get("/api/users/auth/course");
    console.log("Response from API: ", response.data)
    setAttendanceData(response.data?.tableData || [])
    toast.success("Data fetched Successfully",{id: String(Date.now(),)});
  } catch (error: any) {
    console.log("Error in Fetching Table Data: ", error)
    

    const errorMessage = error?.response?.data?.message || "Something Went Wrong in Fetching Data"
    toast.error(errorMessage)
  } finally {
    // FIXED: Turns off loading state whether request succeeds or fails
    setLoading(false) 
  }
}

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
  console.log("Getting Username")
  fetchUsername();
  console.log("Course component mounted, fetching data...");
  fetchTableData();
}, [])


return (
  loading ? (
    <div className="bg-linear-to-br from-slate-50 via-white to-slate-50 min-h-screen text-black flex flex-col lg:flex-row p-2 animate-pulse">
      
      {/* SIDEBAR PLACEHOLDER */}
      <div className="py-4 px-4 hidden lg:block">
        <div className="w-64 h-screen bg-slate-200 rounded-2xl" />
      </div>

      {/* MAIN CONTENT PLACEHOLDER */}
      <div className="flex-1 bg-white lg:m-4 rounded-none lg:rounded-3xl p-4 sm:p-6 md:p-7 lg:p-8 shadow-lg overflow-hidden">
        
        {/* HEADER SKELETON */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 pb-6 sm:pb-8 border-b border-slate-200">
          {/* LEFT HEADER */}
          <div className="min-w-0 text-left space-y-2">
            <div className="h-9 w-48 bg-slate-200 rounded-lg" />
            <div className="h-4 w-64 bg-slate-200 rounded-md" />
          </div>

          {/* RIGHT HEADER */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 shrink-0 w-full sm:w-auto">
            {/* SEARCH INPUT */}
            <div className="w-full sm:w-52 md:w-60 lg:w-64 h-11 bg-slate-200 rounded-xl" />
            {/* NOTIFICATION BUTTON */}
            <div className="p-5 w-11 h-11 bg-indigo-200 rounded-xl flex items-center justify-center">
              <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
            </div>
          </div>
        </div>

        {/* TABLE SECTION (DESKTOP) */}
        <div className="mt-8">
          <div className="hidden lg:block bg-white border border-slate-200 rounded-2xl overflow-hidden">
            {/* TITLE */}
            <div className="px-6 py-5 border-b border-slate-200">
              <div className="h-6 w-24 bg-slate-200 rounded-md" />
            </div>

            {/* TABLE BODY */}
            <div className="overflow-x-auto">
              {/* HEADER ROW */}
              <div className="grid grid-cols-5 border-b border-slate-200 bg-slate-50 px-4 py-4 gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-3 w-16 bg-slate-200 rounded-md mx-auto" />
                ))}
              </div>

              {/* ITERATED ROWS */}
              <div className="min-w-250">
                {Array.from({ length: 5 }).map((_, row) => (
                  <div key={row} className="grid grid-cols-5 items-center px-4 py-5 border-b border-slate-100 gap-4">
                    <div className="h-4 w-16 bg-slate-200 rounded-md mx-auto" />
                    <div className="h-4 w-32 bg-slate-200 rounded-md mx-auto" />
                    <div className="h-4 w-24 bg-slate-200 rounded-md mx-auto" />
                    <div className="h-4 w-8 bg-slate-200 rounded-md mx-auto" />
                    <div className="h-4 w-12 bg-slate-200 rounded-md mx-auto" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* LIST SECTION (MOBILE) */}
          <div className="lg:hidden mt-6 space-y-4">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Overview
            </h2>
            {Array.from({ length: 3 }).map((_, card) => (
              <div key={card} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="h-3 w-16 bg-slate-200 rounded-md" />
                    <div className="h-5 w-40 bg-slate-200 rounded-md" />
                  </div>
                  <div className="h-7 w-12 bg-indigo-100 rounded-lg" />
                </div>
                <div className="h-4 w-28 bg-slate-200 rounded-md" />
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  ) : (
    <div className="bg-linear-to-br from-slate-50 via-white to-slate-50 min-h-screen text-black flex flex-col lg:flex-row p-2">

      {/* SIDEBAR */}
      <div className="py-4 px-4">
        <AdminNavbar />
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 bg-white lg:m-4 rounded-none lg:rounded-3xl p-4 sm:p-6 md:p-7 lg:p-8 shadow-lg overflow-hidden">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 pb-6 sm:pb-8 border-b border-slate-200">
          {/* LEFT */}
          <div className="min-w-0 text-left">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">
              Hello {username} 👋
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 sm:mt-2">
              Let's learn something new today
            </p>
          </div>

          {/* RIGHT */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 shrink-0">
            {/* SEARCH */}
            <div className="relative w-full sm:w-auto flex-1 sm:flex-none">
              <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                className="w-full sm:w-52 md:w-60 lg:w-64 pl-10 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Search..."
              />
            </div>

            {/* NOTIFICATION */}
            <button className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all flex items-center justify-center">
              <Bell size={18} />
            </button>
          </div>
        </div>

        {/* TABLE SECTION */}
        <div className="mt-8">
          {/* TABLE WRAPPER (DESKTOP) */}
          <div className="hidden lg:block bg-white border border-slate-200 rounded-2xl overflow-hidden">
            {/* TABLE TITLE */}
            <div className="px-6 py-5 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">Overview</h2>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">
              {/* HEADER */}
              <div className="min-w-250 grid grid-cols-5 border-b border-slate-200 bg-slate-50 px-4 py-4">
                {["Subject Code", "Subject", "Faculty", "Credits", "Total Class"].map((heading, index) => (
                  <div key={index} className="text-xs uppercase tracking-wider font-bold text-slate-500 text-center">
                    {heading}
                  </div>
                ))}
              </div>

              {/* ROWS */}
              <div className="min-w-250">
                {attendanceData.map((course, index) => (
                  <div key={index} className="grid grid-cols-5 items-center text-center px-4 py-5 border-b border-slate-100 hover:bg-slate-50 transition-all">
                    <p className="font-medium text-slate-700">{course.subjectCode}</p>
                    <p className="font-semibold text-slate-900">{course.subjectName}</p>
                    <p className="text-slate-700 text-center">{course.faculty || "-"}</p>
                    <p className="text-slate-700">{course.credits}</p>
                    <p className="text-slate-700 text-center">{course.totalClasses ?? 0}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* LIST SECTION (MOBILE) */}
          <div className="lg:hidden mt-6 space-y-4">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Overview</h2>
            {attendanceData.map((item, index) => (
              <div key={index} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-slate-500">{item.subjectCode}</p>
                    <h3 className="font-bold text-slate-900 mt-1">{item.subjectName}</h3>
                  </div>
                  <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-sm font-semibold">
                    {item.credits} Cr
                  </span>
                </div>
                <div className="mt-3 text-sm text-slate-700">
                  <span className="font-medium text-slate-500">Faculty:</span> {item.faculty || "-"}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
)
}

export default Course
