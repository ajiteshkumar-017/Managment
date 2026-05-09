"use client"
import React, { useState } from 'react';
import {
  LayoutDashboard,
  BookOpen,
  MessageCircle,
  BarChart3,
  CalendarDays,
  Settings,
} from "lucide-react";
// import { Search, Bell } from "lucide-react";
import { Bell, Search, SquarePen } from "lucide-react";
import StudentPlanner from "@/utils/StudentPlanner";

function Dashboard() {

  const [openProfile, setOpenProfile] = useState(true);
  const eventColors = {
  meeting: "bg-orange-400",
  design: "bg-black",
  study: "bg-blue-500",
  presentation: "bg-orange-300",
  report: "bg-green-400",
};

const events = [
  {
    id: 1,
    title: "Team Meetup",
    day: "Mon",
    startTime: "10:30",
    endTime: "11:30",
    position: {
      top: "80px",
      left: "120px",
    },
    type: "meeting",
  },
  {
    id: 2,
    title: "Illustration",
    day: "Tue",
    startTime: "12:30",
    endTime: "13:30",
    position: {
      top: "170px",
      left: "220px",
    },
    type: "design",
  },
  {
    id: 3,
    title: "Research",
    day: "Wed",
    startTime: "10:30",
    endTime: "12:30",
    position: {
      top: "260px",
      left: "90px",
    },
    type: "study",
  },
  {
    id: 4,
    title: "Presentation",
    day: "Thu",
    startTime: "13:30",
    endTime: "14:30",
    position: {
      top: "350px",
      left: "260px",
    },
    type: "presentation",
  },
  {
    id: 5,
    title: "Report",
    day: "Sat",
    startTime: "12:30",
    endTime: "13:30",
    position: {
      top: "520px",
      left: "190px",
    },
    type: "report",
  },
];
const days = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];

const times = [
  "9:30",
  "10:30",
  "11:30",
  "12:30",
  "13:30",
];

const dates = [
  { day: "Fri", number: 17 },
  { day: "Sat", number: 18 },
  { day: "Sun", number: 19 },
  { day: "Mon", number: 20, active: true },
  { day: "Tue", number: 21 },
  { day: "Wed", number: 22 },
];




  const panelData = [
    { name: "Dashboard", icon: <LayoutDashboard /> },
    { name: "Courses", icon: <BookOpen /> },
    { name: "Messages", icon: <MessageCircle /> },
    { name: "Results", icon: <BarChart3 /> },
    { name: "Timetable", icon: <CalendarDays /> },
    { name: "Settings", icon: <Settings /> },
  ];

  return (
    <div className="bg-[#F8FAFC] min-h-screen p-3 sm:p-4 md:p-6">
      {/* changed: flex-col on mobile, row on desktop */}
      <div className="flex flex-col lg:flex-row gap-4 min-h-screen">

        {/* Sidebar */}
        {/* changed: full width mobile, fixed width desktop */}
        <div
          className="
        w-full
        lg:w-[320px]
        bg-white
        rounded-2xl
        p-4 sm:p-6
        flex flex-col
        justify-between
        shadow-sm
      "
        >
          {/* Top Sidebar */}
          <div>
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img
                src="/campus1.jpg"
                alt=""
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover"
              />

              {/* changed: responsive text */}
              <span className="text-lg sm:text-xl font-semibold text-gray-800">
                Orbit
              </span>
            </div>

            {/* Panel Data */}
            <div className="mt-8 sm:mt-10 space-y-3 sm:space-y-4">
              {panelData.map((panel, index) => (
                <div
                  key={index}
                  className="
                flex items-center gap-4
                px-4 py-3 sm:py-4
                bg-white
                border border-gray-100
                rounded-2xl
                hover:bg-indigo-50
                hover:shadow-md
                transition-all duration-300
                cursor-pointer
              "
                >
                  <span className="text-indigo-500 text-lg sm:text-xl">
                    {panel.icon}
                  </span>

                  <h3 className="text-sm sm:text-base font-medium text-gray-700">
                    {panel.name}
                  </h3>
                </div>
              ))}
            </div>
          </div>

          {/* Calendar Card */}
          {/* changed: responsive spacing */}
          <div className="relative mt-20 sm:mt-24">
            <img
              src="/calender.png"
              alt="Academic Calendar"
              className="
            absolute
            -top-14 sm:-top-16
            left-1/2
            -translate-x-1/2
            w-28 h-28 sm:w-32 sm:h-32
            object-contain
            z-10
          "
            />

            <div
              className="
            bg-indigo-50
            rounded-3xl
            pt-18 sm:pt-20
            px-4 sm:px-6
            pb-5 sm:pb-6
            text-center
          "
            >
              <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
                Academic Calendar
              </h2>

              <p className="text-sm text-gray-600 leading-6 mb-5">
                Stay updated with exams, holidays and important events.
              </p>

              {/* changed: full width mobile */}
              <button
                className="
              w-full sm:w-auto
              bg-indigo-500
              text-white
              px-5 py-2.5
              rounded-xl
              font-medium
              hover:bg-indigo-600
              transition-all
            "
              >
                View Calendar
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {/* changed: full width */}
        <div className="flex-1 bg-white rounded-2xl p-4 sm:p-6 shadow-sm">

          {/* Top Section */}
          {/* changed: stack on mobile */}
          <div
            className="
          flex flex-col md:flex-row
          md:items-center
          md:justify-between
          gap-5
          border-b
          pb-5
        "
          >
            {/* Greeting */}
            <div>
              {/* changed: responsive heading */}
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Hello Ajitesh 👋
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Let’s learn something new today
              </p>
            </div>

            {/* Actions */}
            {/* changed: stack on small screens */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">

              {/* Search */}
              <div className="relative w-full sm:w-auto">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />

                {/* changed: responsive width */}
                <input
                  type="text"
                  placeholder="Search..."
                  className="
                w-full
                sm:w-64
                md:w-72
                pl-11 pr-4 py-3
                bg-gray-50
                border border-gray-200
                rounded-xl
                outline-none
                focus:ring-2
                focus:ring-indigo-400
                text-sm text-gray-800
              "
                />
              </div>

              {/* Notification */}
              {/* changed: full width on mobile */}
              <button
                className="
              w-full sm:w-auto
              p-3
              bg-indigo-500
              rounded-xl
              text-white
              hover:bg-indigo-600
              transition-all
              flex justify-center
            "
              >
                <Bell size={20} />
              </button>

              {/* Profile Edit */}
              <button

                className="
      p-3 bg-white border border-gray-200
      rounded-xl text-gray-700
      hover:bg-indigo-50
      hover:text-indigo-500
      hover:border-indigo-200
      transition-all
    "
              >
                <SquarePen size={20} />
              </button>
            </div>
          </div>
        </div>

        {
          openProfile ? (
            <div
  className="
    text-black
    space-y-6
    border border-gray-100
    rounded-2xl
    bg-white
    p-4 md:p-6
    shadow-md
  "
>
  {/* Header */}
  <div className="flex justify-between items-center">
    <h2 className="text-xl md:text-2xl font-bold">
      Profile
    </h2>

    <SquarePen
      className="
        cursor-pointer
        hover:text-indigo-500
        transition-colors
      "
    />
  </div>

  {/* Profile Info */}
  <div
    className="
      flex justify-center items-center
      mt-8
      flex-col
      space-y-4
    "
  >
    <img
      src="/campus1.jpg"
      alt=""
      className="
        w-32 h-32 md:w-40 md:h-40
        rounded-full
        object-cover
      "
    />

    <div className="space-y-2 text-center">
      <h3 className="text-xl md:text-2xl font-semibold tracking-tight">
        Ajitesh Kumar
      </h3>

      <p className="text-sm text-zinc-600">
        Designation
      </p>
    </div>
  </div>

  {/* Planner */}
  <div className="w-full mt-8">
    <StudentPlanner />
  </div>
</div>
          ) : (
            <div></div>
          )
        }
      </div>
    </div>
  )
}

export default Dashboard
