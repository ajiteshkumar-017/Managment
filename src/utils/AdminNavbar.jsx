import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  BookOpen,
  MessageCircle,
  BarChart3,
  CalendarDays,
  Settings,
  ClipboardList,
  X,
  Menu,
  Bell,
} from "lucide-react";
import { CalendarCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import { PanelIdentity } from "@/components/navigation/PanelIdentity";

export default function AdminNavbar() {
  const [mobileView, setMobileView] = useState(false);
  const [username, setUsername] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  const panelData = [
    { name: "Dashboard", icon: <LayoutDashboard size={18} />, link: "/dashboard" },
    { name: "Courses", icon: <BookOpen size={18} />, link: "/course" },
    { name: "Assignments", icon: <ClipboardList size={18} />, link: "/assignments" },
    { name: "Messages", icon: <MessageCircle size={18} />, link: "/messages" },
    { name: "Notifications", icon: <Bell size={18} />, link: "/notifications" },
    { name: "Attendance", icon: <CalendarCheck size={18} />, link: "/attendance" },
    { name: "Results", icon: <BarChart3 size={18} />, link: "/result" },
    { name: "Timetable", icon: <CalendarDays size={18} />, link: "/timetable" },
    { name: "Settings", icon: <Settings size={18} />, link: "/setting" },
  ];

  const fetchUsername = async () => {
    try {
      const res = await axios.get("/api/users/getUsername");
      setUsername(res.data.username);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUsername();
  }, []);

  const NavButton = ({ panel, onNavigate }) => {
    const isActive = pathname === panel.link;
    return (
      <button
        type="button"
        onClick={() => {
          router.push(panel.link);
          onNavigate?.();
        }}
        className={`
          flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left
          transition-all duration-150 font-comfortaa
          ${
            isActive
              ? "bg-indigo-50 text-indigo-600"
              : "text-slate-500 hover:bg-slate-100 hover:text-indigo-500"
          }
        `}
      >
        <span className={isActive ? "text-indigo-600" : "text-slate-400"}>
          {panel.icon}
        </span>
        <span className="text-sm font-semibold">{panel.name}</span>
      </button>
    );
  };

  return (
    <>
      {/* ================= MOBILE TOP BAR ================= */}
      <header className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-white px-4 py-4 shadow-sm lg:hidden">
        <div className="flex items-center gap-2">
          <img
            src="/campus1.jpg"
            className="h-8 w-8 rounded-lg object-cover"
            alt=""
          />
          <h2 className="font-comfortaa text-base font-bold text-slate-800">
            Orbit
          </h2>
        </div>
        <button
          type="button"
          onClick={() => setMobileView(true)}
          className="rounded-xl bg-slate-100 p-2 transition-colors hover:bg-slate-200"
        >
          <Menu size={20} className="text-slate-600" />
        </button>
      </header>

      {/* ================= DESKTOP SIDEBAR (matches admin Bar: w-56) ================= */}
      <aside
        className="
          hidden h-dvh w-56 shrink-0
          flex-col overflow-hidden border-r border-slate-100
          bg-white px-4 py-5 shadow-sm lg:flex
        "
      >
        <div className="mb-5 flex shrink-0 items-center gap-2">
          <img
            src="/campus1.jpg"
            className="h-8 w-8 rounded-lg object-cover"
            alt=""
          />
          <h2 className="font-comfortaa text-base font-bold text-slate-800">
            Orbit
          </h2>
        </div>

        <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto overscroll-contain">
          {panelData.map((panel) => (
            <NavButton key={panel.link} panel={panel} />
          ))}
        </nav>

        <div className="mt-3 shrink-0 space-y-2.5 pt-3">
          <PanelIdentity role="student" />
          <div className="rounded-xl border border-indigo-100 bg-indigo-50/80 px-3 py-3 text-center">
            <h3 className="text-xs font-bold text-slate-800">Academic Calendar</h3>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
              Exams, holidays & events
            </p>
            <button
              type="button"
              onClick={() => router.push("/calendar")}
              className="mt-2.5 w-full rounded-lg bg-indigo-600 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700"
            >
              View Calendar
            </button>
          </div>
        </div>
      </aside>

      {/* ================= MOBILE SIDEBAR ================= */}
      <AnimatePresence>
        {mobileView && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileView(false)}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="
                fixed top-0 left-0 z-50 flex h-dvh w-64
                max-w-[80vw] flex-col overflow-hidden bg-white px-4 py-5
                shadow-xl lg:hidden
              "
            >
              <div className="mb-5 flex shrink-0 items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src="/campus1.jpg"
                    className="h-8 w-8 rounded-lg object-cover"
                    alt=""
                  />
                  <h2 className="font-comfortaa text-base font-bold text-slate-800">
                    Orbit
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileView(false)}
                  className="rounded-full bg-slate-100 p-1.5 transition-colors hover:bg-slate-200"
                >
                  <X size={16} className="text-slate-500" />
                </button>
              </div>

              <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto overscroll-contain">
                {panelData.map((panel) => (
                  <NavButton
                    key={panel.link}
                    panel={panel}
                    onNavigate={() => setMobileView(false)}
                  />
                ))}
              </nav>

              <div className="mt-3 shrink-0 space-y-2.5 pt-3">
                <PanelIdentity role="student" />
                <div className="rounded-xl border border-indigo-100 bg-indigo-50/80 px-3 py-3 text-center">
                  <h3 className="text-xs font-bold text-slate-800">Academic Calendar</h3>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                    Exams, holidays & events
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      router.push("/calendar");
                      setMobileView(false);
                    }}
                    className="mt-2.5 w-full rounded-lg bg-indigo-600 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700"
                  >
                    View Calendar
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
