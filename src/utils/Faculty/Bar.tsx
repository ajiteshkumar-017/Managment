"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck2,
  BookOpen,
  CalendarDays,
  ClipboardList,
  BarChart3,
  SlidersHorizontal,
  TrendingUp,
  ChevronLeft,
  ArrowRightFromLine,
  Menu,
  X,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", icon: <LayoutDashboard size={18} />, link: "/faculty/dashboard" },
  { name: "Attendance", icon: <CalendarCheck2 size={18} />, link: "/faculty/attendance" },
  { name: "Classes", icon: <BookOpen size={18} />, link: "/faculty/classes" },
  { name: "Timetable", icon: <CalendarDays size={18} />, link: "/faculty/timetable" },
  { name: "Assignments", icon: <ClipboardList size={18} />, link: "/faculty/assignments" },
  { name: "Results", icon: <BarChart3 size={18} />, link: "/faculty/results" },
  { name: "Settings", icon: <SlidersHorizontal size={18} />, link: "/faculty/setting" },
];

function Bar({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const NavItem = ({
    info,
    collapsed = false,
  }: {
    info: (typeof navigation)[0];
    collapsed?: boolean;
  }) => {
    const isActive =
      pathname === info.link || pathname.startsWith(info.link + "/");
    return (
      <div
        title={collapsed ? info.name : undefined}
        onClick={() => {
          router.push(info.link);
          if (!collapsed) setOpen(true);
        }}
        className={`
          flex cursor-pointer items-center rounded-xl font-comfortaa transition-all duration-150
          ${collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5"}
          ${
            isActive
              ? "bg-indigo-50 text-indigo-600"
              : "text-slate-500 hover:bg-slate-100 hover:text-indigo-500"
          }
        `}
      >
        <span className={isActive ? "text-indigo-600" : "text-slate-400"}>
          {info.icon}
        </span>
        {!collapsed && <h3 className="text-sm font-semibold">{info.name}</h3>}
      </div>
    );
  };

  return (
    <>
      {open ? (
        <aside className="sticky top-0 hidden min-h-screen w-56 shrink-0 flex-col self-stretch border-r border-slate-100 bg-white px-4 py-5 shadow-sm lg:flex">
          <div className="mb-8 flex items-center justify-between">
            <div className="ml-2 flex items-center gap-2 text-indigo-600">
              <TrendingUp size={24} />
              <div>
                <h2 className="font-comfortaa text-base font-bold text-slate-800">
                  Bubble
                </h2>
                <p className="text-[10px] font-medium tracking-wide text-slate-400 uppercase">
                  Faculty
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-full bg-slate-100 p-1.5 transition-colors hover:bg-slate-200"
            >
              <ChevronLeft size={16} className="text-slate-500" />
            </button>
          </div>

          <nav className="flex flex-col gap-1">
            {navigation.map((info) => (
              <NavItem key={info.link} info={info} />
            ))}
          </nav>
        </aside>
      ) : (
        <aside className="sticky top-0 hidden min-h-screen w-14 shrink-0 flex-col self-stretch border-r border-slate-100 bg-white px-2 py-5 shadow-sm lg:flex">
          <div className="mb-6 flex flex-col items-center">
            <button
              onClick={() => setOpen(true)}
              title="Expand sidebar"
              className="rounded-full bg-slate-100 p-1.5 transition-colors hover:bg-slate-200"
            >
              <ArrowRightFromLine size={16} className="text-slate-500" />
            </button>
          </div>

          <nav className="flex flex-col items-center gap-1">
            {navigation.map((info) => (
              <NavItem key={info.link} info={info} collapsed />
            ))}
          </nav>
        </aside>
      )}

      <header className="flex items-center justify-between border-b border-slate-100 bg-white px-4 py-4 shadow-sm lg:hidden">
        <div className="flex items-center gap-2 text-indigo-600">
          <TrendingUp size={22} />
          <div>
            <h2 className="font-comfortaa text-base font-bold text-slate-800">
              Bubble
            </h2>
            <p className="text-[10px] font-medium tracking-wide text-slate-400 uppercase">
              Faculty
            </p>
          </div>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="rounded-xl bg-slate-100 p-2 transition-colors hover:bg-slate-200"
        >
          <Menu size={20} className="text-slate-600" />
        </button>
      </header>

      {!open && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-10 flex h-full w-64 max-w-[80vw] flex-col bg-white px-4 py-5 shadow-xl">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-600">
                <TrendingUp size={22} />
                <h2 className="font-comfortaa text-base font-bold text-slate-800">
                  Bubble
                </h2>
              </div>
              <button
                onClick={() => setOpen(true)}
                className="rounded-full bg-slate-100 p-1.5 transition-colors hover:bg-slate-200"
              >
                <X size={16} className="text-slate-500" />
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              {navigation.map((info) => (
                <NavItem key={info.link} info={info} />
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

export default Bar;
