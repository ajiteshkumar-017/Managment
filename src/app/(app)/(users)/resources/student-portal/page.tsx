"use client";

import Link from "next/link";
import {
  CalendarCheck,
  ClipboardList,
  LayoutDashboard,
  Settings,
} from "lucide-react";
import { ResourcePageShell } from "@/utils/ResourcePageShell";

const features = [
  {
    icon: LayoutDashboard,
    title: "Dashboard",
    text: "Attendance overview, notices, and quick academic updates.",
  },
  {
    icon: ClipboardList,
    title: "Courses & results",
    text: "View enrolled courses, schedules, and published exam results.",
  },
  {
    icon: CalendarCheck,
    title: "Timetable",
    text: "Check your weekly class timetable and upcoming assessments.",
  },
  {
    icon: Settings,
    title: "Profile & settings",
    text: "Update personal details and manage account preferences.",
  },
];

export default function StudentPortalPage() {
  return (
    <ResourcePageShell
      title="Student Portal"
      description="Sign in to access your academic dashboard, courses, attendance, and results."
      currentHref="/resources/student-portal"
    >
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-bold text-[#333333]">Get started</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Use your registered college email to log in from the landing page.
          New students can create an account with Sign Up, then complete profile
          setup.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/landingPage"
            className="rounded-xl bg-[#786EFE] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#655BDB]"
          >
            Go to Login
          </Link>
          <Link
            href="/contactUs"
            className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-[#333333] transition hover:border-[#786EFE]/40 hover:text-[#786EFE]"
          >
            Need help?
          </Link>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {features.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <span className="inline-flex rounded-xl bg-[#786EFE]/10 p-2.5 text-[#786EFE]">
                <Icon size={18} />
              </span>
              <h2 className="mt-3 text-base font-bold text-[#333333]">
                {item.title}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">
                {item.text}
              </p>
            </div>
          );
        })}
      </div>
    </ResourcePageShell>
  );
}
