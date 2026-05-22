"use client"

import AdminNavbar from '@/utils/AdminNavbar'
import { Bell, Search } from 'lucide-react'
import React, { useState } from 'react'

function Course() {
  const [username, setUsername] = useState("Ajitesh")

  const attendanceData = [
  {
    subjectCode: "CSE201",
    subject: "Data Structures",
    faculty: "Mr. Sharma",
    credits: 4,
    attendance: "92%",
    // present: 23,
    // absent: 2,
    // status: "Excellent",
  },

  {
    subjectCode: "CSE202",
    subject: "Database Management System",
    faculty: "Mrs. Priya",
    credits: 3,
    attendance: "81%",
    // present: 21,
    // absent: 5,
    // status: "Good",
  },

  {
    subjectCode: "CSE203",
    subject: "Operating Systems",
    faculty: "Mr. Das",
    credits: 4,
    attendance: "74%",
    // present: 19,
    // absent: 7,
    // status: "Average",
  },

  {
    subjectCode: "CSE204",
    subject: "Computer Networks",
    faculty: "Dr. Reddy",
    credits: 3,
    attendance: "65%",
    // present: 17,
    // absent: 9,
    // status: "Low",
  },

  {
    subjectCode: "CSE205",
    subject: "Software Engineering",
    faculty: "Ms. Kavya",
    credits: 2,
    attendance: "96%",
    // present: 24,
    // absent: 1,
    status: "Excellent",
  },

  {
    subjectCode: "CSE206",
    subject: "Artificial Intelligence",
    faculty: "Dr. Mehta",
    credits: 4,
    attendance: "70%",
    // present: 18,
    // absent: 8,
    // status: "Warning",
  },
];
  return (
    <div className="bg-linear-to-br from-slate-50 via-white to-slate-50 min-h-screen text-black flex flex-col lg:flex-row p-2">

  {/* SIDEBAR */}
  <div className='py-4 px-4'>

  <AdminNavbar  />
  </div>

  {/* MAIN CONTENT */}
  <div
    className="
      flex-1
      bg-white
      lg:m-4
      rounded-none
      lg:rounded-3xl
      p-4
      sm:p-6
      md:p-7
      lg:p-8
      shadow-lg
      overflow-hidden
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
        sm:gap-6
        pb-6
        sm:pb-8
        border-b
        border-slate-200
      "
    >

      {/* LEFT */}
      <div className="min-w-0 text-left">
        <h2
          className="
            text-2xl
            sm:text-3xl
            md:text-4xl
            font-bold
            text-slate-900
          "
        >
          Hello {username} 👋
        </h2>

        <p
          className="
            text-xs
            sm:text-sm
            text-slate-600
            mt-1
            sm:mt-2
          "
        >
          Let's learn something new today
        </p>
      </div>

      {/* RIGHT */}
      <div
        className="
          flex
          flex-wrap
          items-center
          gap-2
          sm:gap-3
          md:gap-4
          shrink-0
        "
      >

        {/* SEARCH */}
        <div
          className="
            relative
            w-full
            sm:w-auto
            flex-1
            sm:flex-none
          "
        >
          <Search
            className="
              absolute
              left-3
              sm:left-4
              top-1/2
              -translate-y-1/2
              text-slate-400
            "
            size={18}
          />

          <input
            className="
              w-full
              sm:w-52
              md:w-60
              lg:w-64
              pl-10
              sm:pl-11
              pr-3
              sm:pr-4
              py-2.5
              sm:py-3
              border
              border-slate-200
              rounded-xl
              text-sm
              text-slate-900
              placeholder-slate-500
              focus:outline-none
              focus:ring-2
              focus:ring-indigo-500
            "
            placeholder="Search..."
          />
        </div>

        {/* NOTIFICATION */}
        <button
          className="
            p-3
            bg-indigo-600
            hover:bg-indigo-700
            text-white
            rounded-xl
            transition-all
            flex
            items-center
            justify-center
          "
        >
          <Bell size={18} />
        </button>
      </div>
    </div>

    {/* <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">

  <div>
    <h2 className="text-xl font-bold text-slate-900">
      Attendance Overview
    </h2>

    <p className="text-sm text-slate-500 mt-1">
      Track and manage student attendance
    </p>
  </div>

  <button
    className="
      bg-indigo-600
      hover:bg-indigo-700
      text-white
      px-5
      py-2.5
      rounded-xl
      font-medium
      transition-all
    "
  >
    Manage Attendance
  </button>

</div> */}

    {/* TABLE SECTION */}
    <div className="mt-8 ">

      {/* TABLE WRAPPER */}
      <div
        className="
        hidden
        lg:block
          bg-white
          border
          border-slate-200
          rounded-2xl
          overflow-hidden
        "
      >

        {/* TABLE TITLE */}
        <div
          className="
            px-6
            py-5
            border-b
            border-slate-200
          "
        >
          <h2
            className="
              text-xl
              font-bold
              text-slate-900
            "
          >
          Overview
          </h2>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">

          {/* HEADER */}
          <div
            className="
              min-w-250
              grid
              grid-cols-5
             
              border-b
              border-slate-200
              bg-slate-50
              px-4
              py-4
            "
          >
            {[
              "Subject Code",
              "Subject",
              "Faculty",
              "Credits",
              "Total Class ",
              // "Present",
              // "Absent",
              // "Status",
            ].map((heading, index) => (
              <div
                key={index}
                className="
                  text-xs
                  uppercase
                  tracking-wider
                  font-bold
                  text-slate-500
                "
              >
                {heading}
              </div>
            ))}
          </div>

          {/* ROWS */}
          <div className="min-w-250">

            {attendanceData.map((course, index) => (

              <div
                key={index}
                className="
                  grid
                  grid-cols-5
                  items-center

                  px-4
                  py-5
                  border-b
                  border-slate-100
                  hover:bg-slate-50
                  transition-all
                "
              >

                <p className="font-medium text-slate-700">
                  {course.subjectCode}
                </p>

                <p className="font-semibold text-slate-900">
                  {course.subject}
                </p>

                <p className="text-slate-700">
                  {course.faculty}
                </p>

                <p className="text-slate-700">
                  {course.credits}
                </p>

                <p className="font-bold text-slate-900">
                  {course.attendance}
                </p>

                {/* <p className="text-green-600 font-semibold">
                  {course.present}
                </p>

                <p className="text-red-500 font-semibold">
                  {course.absent}
                </p> */}

                {/* <div>
                  <span
                    className={`
                      px-4
                      py-2
                      rounded-xl
                      text-sm
                      font-semibold

                      ${
                        course.status === "Excellent"
                          ? "bg-green-100 text-green-600"

                          : course.status === "Good"
                          ? "bg-blue-100 text-blue-600"

                          : course.status === "Average"
                          ? "bg-yellow-100 text-yellow-600"

                          : "bg-red-100 text-red-600"
                      }
                    `}
                  >
                    {course.status}
                  </span>
                </div> */}

              </div>

            ))}

          </div>
        </div>
      </div>

      <div className="lg:hidden mt-6 space-y-4">

  <h2 className="text-xl font-bold text-slate-900 mb-4">
    Overview
  </h2>

  {attendanceData.map((item, index) => (

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
      <div className="flex items-start justify-between">

        <div>
          <p className="text-xs text-slate-500">
            {item.subjectCode}
          </p>

          <h3 className="font-bold text-slate-900 mt-1">
            {item.subject}
          </h3>
        </div>

        <span
          className="
            bg-indigo-50
            text-indigo-600
            px-3
            py-1
            rounded-lg
            text-sm
            font-semibold
          "
        >
          {item.credits} Cr
        </span>

      </div>

      {/* Faculty */}
      <div className="mt-3 text-sm text-slate-600">
        {item.faculty}
      </div>

      {/* Attendance */}
      <div className="mt-4">

        <div className="flex justify-between text-sm">

          <span className="text-slate-500">
            Total Classes
          </span>

          <span className="font-bold text-slate-900">
            {item.attendance}
          </span>

        </div>

        <div className="mt-2 h-2 bg-slate-100 rounded-full overflow-hidden">

          <div
            className="h-full bg-indigo-500 rounded-full"
            style={{
              width: item.attendance
            }}
          />

        </div>

      </div>

    </div>

  ))}

</div>
    </div>
  </div>
</div>
  )
}

export default Course
