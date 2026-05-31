import react,{useState, useEffect} from "react"


import React from 'react'
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
} from "lucide-react";
import { CalendarCheck, UserCheck, ClipboardCheck } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from 'next/navigation';
import axios from "axios";

export default function AdminNavbar() {

    const [mobileView, setMobileView] = useState(false)
    const [username, setUsername] = useState("");
    const router = useRouter();

      const panelData = [
        { name: "Dashboard", icon: <LayoutDashboard size={20} />, link: "/dashboard" },
        { name: "Courses", icon: <BookOpen size={20} />, link : "/course" },
        { name: "Messages", icon: <MessageCircle size={20}/>, link : "/messages" },
        {name: "Attendance", icon : <CalendarCheck/>, link: "/attendance"},
        { name: "Results", icon: <BarChart3 size={20} /> , link : "/result"},
        { name: "Timetable", icon: <CalendarDays size={20} />, link : "/timetable" },
        { name: "Settings", icon: <Settings size={20} /> ,link : "/setting" },
      ];

      const fetchUsername = async () => {
        try{
            const res = await axios.get("/api/users/getUsername");
            const data = await res.data;
            setUsername(data.username);
            console.log("Username in Admin Navbar:", data.username);
        }catch(err){
          console.log(err);
        }
      }

      useEffect(() => {
        fetchUsername();
      }, []);
  return (
    <div>
      
              {/* ================= LEFT SIDEBAR ================= */}
              {/* ================= MOBILE TOP BAR ================= */}
      
      <div className="flex flex-col w-full px-4 lg:hidden">
        <div className="flex lg:hidden items-center justify-between bg-white rounded-2xl  shadow-sm  p-4 w-full    ">
      
        <div className="flex items-center gap-3">
          <img
            src="/campus1.jpg"
            className="w-10 h-10 rounded-xl object-cover"
            alt=""
          />
      
          <h2 className="font-bold text-xl text-slate-900">
            Orbit
          </h2>
        </div>
      
        <button
          onClick={() => setMobileView(true)}
          className="
            p-2
            rounded-xl
            border
            border-slate-200
            bg-white
          "
        >
          <Menu className="w-6 h-6 text-black" />
        </button>
        </div>
      </div>
      
      
      
      {/* ================= DESKTOP SIDEBAR ================= */}
      
      <div
        className="
          hidden
          lg:block
          w-72
          xl:w-80
          bg-white
          rounded-3xl
          p-7
          shadow-sm
          sticky
          top-6
          h-fit
        "
      >
      
        {/* Logo */}
        <div className="flex items-center gap-4">
          <img
            src="/campus1.jpg"
            className="w-12 h-12 rounded-xl object-cover"
            alt=""
          />
      
          <span className="font-bold text-xl text-slate-900">
            Orbit
          </span>
        </div>
      
        {/* Navigation */}
        <div className="mt-10 space-y-3">
          {panelData.map((panel, i) => (
            <button
              key={i}
              className="
                w-full
                flex
                items-center
                gap-4
                px-4
                py-3.5
                rounded-2xl
                border
                border-slate-200
                hover:bg-indigo-50
                hover:border-indigo-300
                transition-all
                cursor-pointer
              "
              onClick={() => router.push(panel.link)}
            >
              <span className="text-indigo-500">
                {panel.icon}
              </span>
      
              <span className="font-medium text-slate-900">
                {panel.name}
              </span>
            </button>
          ))}
        </div>
      
        {/* Calendar */}
        <div className="relative mt-24">
      
          <img
            src="/calender.png"
            alt=""
            className="
              absolute
              -top-20
              left-1/2
              -translate-x-1/2
              w-40
              h-40
              object-contain
              z-10
            "
          />
      
          <div
            className="
              bg-gradient-to-br
              from-indigo-50
              to-indigo-100
              rounded-3xl
              pt-28
              px-7
              pb-8
              text-center
              border
              border-indigo-200
            "
          >
            <h2 className="text-lg font-bold text-slate-900">
              Academic Calendar
            </h2>
      
            <p className="text-sm text-slate-600 leading-relaxed mt-3">
              Stay updated with exams, holidays and events.
            </p>
      
            <button
              className="
                mt-6
                w-full
                bg-indigo-600
                hover:bg-indigo-700
                transition-all
                text-white
                py-3
                rounded-2xl
                font-semibold
              "
            >
              View Calendar
            </button>
          </div>
        </div>
      </div>
      
      
      
      {/* ================= MOBILE SIDEBAR ================= */}
      
      <AnimatePresence>
      
        {mobileView && (
      
          <>
            {/* OVERLAY */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileView(false)}
              className="
                fixed
                inset-0
                bg-black/40
                z-40
                lg:hidden
              "
            />
      
            {/* SIDEBAR */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                duration: 0.35,
                ease: "easeInOut",
              }}
              className="
                fixed
                left-0
                top-0
                h-screen
                w-[300px]
                bg-white
                z-50
                p-6
                overflow-y-auto
                lg:hidden
                shadow-2xl
              "
            >
      
              {/* HEADER */}
              <div className="flex items-center w-full">
      
                <div className="flex items-center gap-3">
                  <img
                    src="/campus1.jpg"
                    className="w-11 h-11 rounded-xl object-cover"
                    alt=""
                  />
      
                  <span className="font-bold text-xl text-slate-900">
                    Orbit
                  </span>
                </div>
      
                <button
                  onClick={() => setMobileView(false)}
                  className="ml-auto"
                >
                  <X className="w-6 h-6 text-black" />
                </button>
              </div>
      
              {/* Navigation */}
              <div className="mt-10 space-y-3">
      
                {panelData.map((panel, i) => (
      
                  <button
                    key={i}
                    className="
                      w-full
                      flex
                      items-center
                      gap-4
                      px-4
                      py-3.5
                      rounded-2xl
                      border
                      border-slate-200
                      hover:bg-indigo-50
                      hover:border-indigo-300
                      transition-all
                    "
                    onClick={() => router.push(panel.link)}
                  >
                    <span className="text-indigo-500">
                      {panel.icon}
                    </span>
      
                    <span className="font-medium text-slate-900">
                      {panel.name}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
