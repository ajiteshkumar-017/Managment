"use client";

import Link from "next/link";
import {
  Building2,
  Compass,
  History,
  Target,
  Eye,
} from "lucide-react";
import Navbar from "@/utils/Navbar";
import Footer from "@/utils/Footer";

const highlights = [
  {
    title: "Introduction",
    icon: Building2,
    image: "/campus1.jpg",
    imageAlt: "IIT Dholakpur campus",
    body: "IIT Dholakpur attracts top-tier students and faculty dedicated to research, teaching, and national impact. Alumni contribute across industry, academia, and entrepreneurship. The institute offers strong residential life with hostels, dining, sports, and recreation — alongside continuing education and short-term programs.",
  },
  {
    title: "Functional organization",
    icon: Compass,
    image: "/campus2.jpg",
    imageAlt: "Institute academic block",
    reverse: true,
    body: "IIT Dholakpur is an autonomous institute of national importance. Governance is led by a Board of Governors, with academic standards overseen by the Senate. The Director steers academic and administrative strategy, supported by the Registrar and senior officers, while advisory councils bring industry and academic expertise into policy.",
  },
];

const missionPoints = [
  "Deliver rigorous engineering education with strong fundamentals",
  "Advance research that solves real industrial and societal problems",
  "Build ethical, skilled graduates ready for leadership roles",
  "Foster collaboration with academia, industry, and global peers",
];

const visionPoints = [
  "Be a leading institute for engineering education and innovation",
  "Create knowledge and technology with lasting national impact",
  "Nurture inclusive excellence across teaching, research, and campus life",
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="border-b border-gray-100 bg-linear-to-br from-slate-50 via-white to-[#786EFE]/5 px-4 py-10 sm:px-6 md:px-10 md:py-14">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#786EFE]">
            About
          </p>
          <h1 className="mt-2 font-comfortaa text-3xl font-bold text-[#333333] sm:text-4xl">
            About the institute
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
            Learn about IIT Dholakpur — our history, organization, mission, and
            vision.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-10 px-4 py-8 sm:px-6 md:px-10 md:py-10">
        {highlights.map((block) => {
          const Icon = block.icon;
          return (
            <div
              key={block.title}
              className={`flex flex-col gap-6 lg:items-center lg:gap-10 ${
                block.reverse ? "lg:flex-row-reverse" : "lg:flex-row"
              }`}
            >
              <div className="w-full overflow-hidden rounded-2xl border border-gray-100 shadow-sm lg:w-1/2">
                <img
                  src={block.image}
                  alt={block.imageAlt}
                  className="h-56 w-full object-cover sm:h-72 lg:h-80"
                />
              </div>
              <div className="w-full lg:w-1/2">
                <span className="inline-flex rounded-xl bg-[#786EFE]/10 p-2.5 text-[#786EFE]">
                  <Icon size={18} />
                </span>
                <h2 className="mt-3 text-2xl font-bold text-[#333333]">
                  {block.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-[15px] sm:leading-7">
                  {block.body}
                </p>
              </div>
            </div>
          );
        })}
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-8 sm:px-6 md:px-10">
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-5 sm:p-6 md:p-8">
              <span className="inline-flex rounded-xl bg-[#786EFE]/10 p-2.5 text-[#786EFE]">
                <History size={18} />
              </span>
              <h2 className="mt-3 text-2xl font-bold text-[#333333]">History</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-[15px] sm:leading-7">
                Established as part of a national push for excellence in
                technology education, IIT Dholakpur grew with a focus on
                rigorous academics, research capacity, and regional impact in
                Odisha. Over the years it has expanded departments, laboratories,
                and residential facilities while building partnerships that
                strengthen teaching and innovation.
              </p>
            </div>
            <div className="min-h-56 overflow-hidden lg:min-h-full">
              <img
                src="/campus4.jpg"
                alt="Campus history"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-8 sm:px-6 md:px-10">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
            <span className="inline-flex rounded-xl bg-[#786EFE]/10 p-2.5 text-[#786EFE]">
              <Target size={18} />
            </span>
            <h2 className="mt-3 text-xl font-bold text-[#333333]">Mission</h2>
            <div className="mt-4 overflow-hidden rounded-xl">
              <img
                src="/campus8.jpg"
                alt="Mission"
                className="h-40 w-full object-cover sm:h-48"
              />
            </div>
            <ul className="mt-4 space-y-2">
              {missionPoints.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-2 text-sm text-slate-600"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#786EFE]" />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
            <span className="inline-flex rounded-xl bg-[#786EFE]/10 p-2.5 text-[#786EFE]">
              <Eye size={18} />
            </span>
            <h2 className="mt-3 text-xl font-bold text-[#333333]">Vision</h2>
            <div className="mt-4 overflow-hidden rounded-xl">
              <img
                src="/campus5.jpg"
                alt="Vision"
                className="h-40 w-full object-cover sm:h-48"
              />
            </div>
            <ul className="mt-4 space-y-2">
              {visionPoints.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-2 text-sm text-slate-600"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#786EFE]" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 md:px-10">
        <div className="rounded-2xl border border-gray-100 bg-slate-50/80 p-5 sm:p-6">
          <h2 className="text-lg font-bold text-[#333333]">Explore more</h2>
          <p className="mt-1 text-sm text-slate-500">
            Continue browsing academics and campus life
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              { label: "Courses", href: "/courses" },
              { label: "Faculty", href: "/faculty" },
              { label: "Contact Us", href: "/contactUs" },
              { label: "Resources", href: "/resources" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-[#333333] transition hover:border-[#786EFE]/40 hover:text-[#786EFE]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
