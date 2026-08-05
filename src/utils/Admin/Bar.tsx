"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import {
  LayoutDashboard,
  GraduationCap,
  BriefcaseBusiness,
  BookOpenCheck,
  BellRing,
  CalendarCheck2,
  SlidersHorizontal,
  TrendingUp,
  ChevronLeft,
  ArrowRightFromLine,
  Menu,
  X,
  School,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", icon: <LayoutDashboard size={18} />, link: "/admin/dashboard" },
  { name: "Students", icon: <GraduationCap size={18} />, link: "/admin/students" },
  { name: "Faculty", icon: <BriefcaseBusiness size={18} />, link: "/admin/faculty" },
  { name: "Subjects", icon: <BookOpenCheck size={18} />, link: "/admin/subjects" },
  {name: "Classes", icon: <BriefcaseBusiness size={18} />, link: "/admin/classes" },
  { name: "Notices", icon: <BellRing size={18} />, link: "/admin/notices" },
  {name: "Academic Managment", icon : <School size={18} />, link: "/admin/academicManagment"},
  { name: "Attendance", icon: <CalendarCheck2 size={18} />, link: "/admin/attendance" },
  {name: "Enrollment", icon: <BriefcaseBusiness size={18} />, link: "/admin/enrollment" },
  {name:"Results", icon: <BookOpenCheck size={18} />, link: "/admin/results" },
  { name: "Settings", icon: <SlidersHorizontal size={18} />, link: "/admin/setting" },
]

 function Bar({ 
  open, 
  setOpen 
}: { 
  open: boolean, 
  setOpen: (v: boolean) => void 
}) {

  const router = useRouter()
  const pathname = usePathname()

  const NavItem = ({
    info,
    collapsed = false,
  }: {
    info: typeof navigation[0]
    collapsed?: boolean
  }) => {
    const isActive = pathname === info.link || pathname.startsWith(info.link + "/")
    return (
      <div
        key={info.link}
        title={collapsed ? info.name : undefined}
        onClick={() => { router.push(info.link); if (!collapsed) setOpen(true) }}
        className={`
          flex items-center rounded-xl cursor-pointer
          transition-all duration-150 font-comfortaa
          ${collapsed ? "justify-center p-2.5" : "gap-3 py-2.5 px-3"}
          ${isActive
            ? "bg-indigo-50 text-indigo-600"
            : "text-slate-500 hover:bg-slate-100 hover:text-indigo-500"
          }
        `}
      >
        <span className={isActive ? "text-indigo-600" : "text-slate-400"}>
          {info.icon}
        </span>
        {!collapsed && <h3 className="font-semibold text-sm">{info.name}</h3>}
      </div>
    )
  }

  return (
    <>
     
      {open ? (
        <aside className="hidden lg:flex flex-col sticky top-0 min-h-screen w-56 shrink-0 border-r border-slate-100 shadow-sm bg-white px-4 py-5 self-stretch">
          
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2 text-indigo-600 ml-8">
              <TrendingUp size={24} />
              <h2 className="font-comfortaa font-bold text-base text-slate-800">Bubble</h2>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
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
        <aside className="hidden lg:flex flex-col sticky top-0 min-h-screen w-14 shrink-0 border-r border-slate-100 shadow-sm bg-white px-2 py-5 self-stretch">
          <div className="flex flex-col items-center mb-6">
            <button
              onClick={() => setOpen(true)}
              title="Expand sidebar"
              className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
            >
              <ArrowRightFromLine size={16} className="text-slate-500" />
            </button>
          </div>

          <nav className="flex flex-col gap-1 items-center">
            {navigation.map((info) => (
              <NavItem key={info.link} info={info} collapsed />
            ))}
          </nav>
        </aside>
      )}

     
      <header className="lg:hidden flex items-center justify-between bg-white border-b border-slate-100 shadow-sm px-4 py-4">
        <div className="flex items-center gap-2 text-indigo-600">
          <TrendingUp size={22} />
          <h2 className="font-comfortaa font-bold text-base text-slate-800">Bubble</h2>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
        >
          <Menu size={20} className="text-slate-600" />
        </button>
      </header>

      
      {!open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

         
          <div className="relative z-10 flex flex-col w-64 max-w-[80vw] bg-white h-full shadow-xl px-4 py-5">

            
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2 text-indigo-600">
                <TrendingUp size={22} />
                <h2 className="font-comfortaa font-bold text-base text-slate-800">Bubble</h2>
              </div>
              <button
                onClick={() => setOpen(!open)}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X size={16} className="text-slate-500"  />
              </button>
            </div>

            {/* Nav */}
            <nav className="flex flex-col gap-1">
              {navigation.map((info) => (
                <NavItem key={info.link} info={info} />
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  )
}

export default Bar
