"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  FlaskConical,
  GraduationCap,
  Layers,
} from "lucide-react";
import Navbar from "@/utils/Navbar";
import Footer from "@/utils/Footer";

const courses = [
  {
    code: "CRS-001",
    shortTitle: "B.Tech",
    title: "Bachelor of Technology",
    duration: "4 years",
    focus: "Skill acquisition & core engineering",
    description:
      "A comprehensive undergraduate program in engineering fundamentals and applied sciences — bridging theory with industry through labs, projects, and hands-on training.",
    highlights: [
      "Core engineering foundations",
      "Project-based learning",
      "Department specializations",
      "Industry-ready skills",
    ],
    icon: GraduationCap,
  },
  {
    code: "CRS-002",
    shortTitle: "M.Tech",
    title: "Master of Technology",
    duration: "2 years",
    focus: "Specialization & technical leadership",
    description:
      "An advanced postgraduate track for deeper expertise in niche domains — system design, analytics, and optimization of complex engineering workflows.",
    highlights: [
      "Advanced specialization",
      "Research-informed curriculum",
      "Leadership readiness",
      "Industry collaboration",
    ],
    icon: Layers,
  },
  {
    code: "CRS-003",
    shortTitle: "PhD",
    title: "Doctor of Philosophy",
    duration: "3–5 years",
    focus: "Innovation & knowledge creation",
    description:
      "Original research at the frontier of technology — solving open problems and contributing new knowledge to academia and industry.",
    highlights: [
      "Original research",
      "Faculty mentorship",
      "Publications & patents",
      "Global collaborations",
    ],
    icon: FlaskConical,
  },
];

const departments = ["CSE", "ME", "CE", "EE", "AE"];

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="border-b border-gray-100 bg-linear-to-br from-slate-50 via-white to-[#786EFE]/5 px-4 py-10 sm:px-6 md:px-10 md:py-14">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#786EFE]">
            Academics
          </p>
          <h1 className="mt-2 font-comfortaa text-3xl font-bold text-[#333333] sm:text-4xl">
            Courses
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
            Three academic pillars — B.Tech, M.Tech, and PhD — built for precision,
            depth, and real-world impact.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:px-10">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-start gap-3">
            <span className="rounded-xl bg-[#786EFE]/10 p-2.5 text-[#786EFE]">
              <BookOpen size={18} />
            </span>
            <div>
              <h2 className="text-lg font-bold text-[#333333]">Introduction</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-[15px] sm:leading-7">
                Our programs connect theory with industrial practice. B.Tech
                builds core engineering strength, M.Tech develops specialized
                technical leadership, and PhD drives original research. Each
                pathway is organized by department so students progress with
                focus and clarity.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-4 sm:px-6 md:px-10">
        <h2 className="text-xl font-bold text-[#333333] sm:text-2xl">
          Programs
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Choose a pathway that matches your academic goals
        </p>

        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {courses.map((course) => {
            const Icon = course.icon;
            return (
              <article
                key={course.code}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:border-[#786EFE]/35 hover:shadow-md"
              >
                <div className="border-b border-gray-100 bg-linear-to-br from-[#786EFE]/8 via-white to-slate-50 px-5 py-5">
                  <div className="flex items-start justify-between gap-3">
                    <span className="inline-flex rounded-xl bg-white p-2.5 text-[#786EFE] shadow-sm ring-1 ring-gray-100">
                      <Icon size={20} />
                    </span>
                    <span className="rounded-full bg-[#786EFE]/10 px-2.5 py-1 font-mono text-[10px] font-semibold tracking-wider text-[#786EFE] uppercase">
                      {course.code}
                    </span>
                  </div>
                  <p className="mt-4 text-xs font-semibold tracking-wide text-[#786EFE] uppercase">
                    {course.shortTitle}
                  </p>
                  <h3 className="mt-1 text-xl font-bold tracking-tight text-[#333333]">
                    {course.title}
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
                      {course.duration}
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <p className="text-xs font-semibold tracking-wide text-[#786EFE] uppercase">
                    {course.focus}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {course.description}
                  </p>

                  <ul className="mt-4 space-y-2">
                    {course.highlights.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm text-slate-600"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#786EFE]" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-5">
                    <Link
                      href="/faculty"
                      className="inline-flex w-full items-center justify-between rounded-xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-[#333333] transition group-hover:border-[#786EFE]/30 group-hover:bg-[#786EFE]/5 group-hover:text-[#786EFE]"
                    >
                      Explore faculty & departments
                      <ArrowRight
                        size={16}
                        className="transition group-hover:translate-x-0.5"
                      />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:px-10 md:pb-12">
        <div className="rounded-2xl border border-gray-100 bg-slate-50/80 p-5 sm:p-6">
          <h2 className="text-lg font-bold text-[#333333]">Departments</h2>
          <p className="mt-1 text-sm text-slate-500">
            Programs are offered across core engineering departments
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {departments.map((dept) => (
              <span
                key={dept}
                className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-[#333333]"
              >
                {dept}
              </span>
            ))}
          </div>
          <p className="mt-5 text-sm text-slate-500">
            Questions about admissions or curriculum?{" "}
            <Link
              href="/contactUs"
              className="font-semibold text-[#786EFE] hover:underline"
            >
              Contact us
            </Link>
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
