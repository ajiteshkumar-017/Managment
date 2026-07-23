"use client";

import { Building2, Handshake, LineChart, Users } from "lucide-react";
import { ResourcePageShell } from "@/utils/ResourcePageShell";

const stats = [
  { label: "Recruiters (2025)", value: "180+" },
  { label: "Highest package", value: "₹64 LPA" },
  { label: "Average package", value: "₹18 LPA" },
  { label: "Internship offers", value: "420+" },
];

const companies = [
  {
    name: "Google",
    sector: "Product / Cloud",
    visits: 4,
    studentsHired: 42,
    note: "Most frequent visitor · SWE & SRE roles",
  },
  {
    name: "Microsoft",
    sector: "Product / Azure",
    visits: 3,
    studentsHired: 38,
    note: "Full-time + internship pipeline",
  },
  {
    name: "Amazon",
    sector: "E-commerce / AWS",
    visits: 3,
    studentsHired: 35,
    note: "SDE-1 and Applied Scientist tracks",
  },
  {
    name: "Goldman Sachs",
    sector: "FinTech",
    visits: 2,
    studentsHired: 28,
    note: "Engineering & quant technology",
  },
  {
    name: "Adobe",
    sector: "Creative software",
    visits: 2,
    studentsHired: 22,
    note: "Product engineering & research",
  },
  {
    name: "Infosys",
    sector: "IT services",
    visits: 5,
    studentsHired: 56,
    note: "Highest headcount recruiter",
  },
  {
    name: "TCS Digital",
    sector: "IT services",
    visits: 4,
    studentsHired: 48,
    note: "Digital & research roles",
  },
  {
    name: "Flipkart",
    sector: "E-commerce",
    visits: 2,
    studentsHired: 19,
    note: "Backend & data roles",
  },
].sort((a, b) => b.studentsHired - a.studentsHired);

const topRecruiter = companies[0];
const mostVisits = [...companies].sort((a, b) => b.visits - a.visits)[0];

const highlights = [
  {
    icon: Building2,
    title: "Campus drives",
    text: "On-campus and hybrid recruitment drives through the academic year.",
  },
  {
    icon: Handshake,
    title: "Industry connect",
    text: "Workshops, pre-placement talks, and mentorship with alumni & recruiters.",
  },
  {
    icon: LineChart,
    title: "Career guidance",
    text: "Resume reviews, mock interviews, and aptitude prep sessions.",
  },
  {
    icon: Users,
    title: "Student support",
    text: "Dedicated placement coordinators for each department.",
  },
];

export default function PlacementCellPage() {
  const maxHired = Math.max(...companies.map((c) => c.studentsHired));

  return (
    <ResourcePageShell
      title="Placement Cell"
      description="Career services, campus recruitment, and internship support for students."
      currentHref="/resources/placement-cell"
    >
      <div className="mb-8 overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
        <img
          src="/placeMentCell.jpeg"
          alt="Placement drive at IIT Dholakpur"
          className="h-56 w-full object-cover sm:h-72 md:h-80"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-sm"
          >
            <p className="text-2xl font-bold text-[#786EFE]">{stat.value}</p>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-[#786EFE]/20 bg-[#786EFE]/5 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#786EFE]">
            Highest student intake
          </p>
          <h2 className="mt-2 text-xl font-bold text-[#333333]">
            {topRecruiter.name}
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Hired <strong>{topRecruiter.studentsHired}</strong> students ·{" "}
            {topRecruiter.visits} campus visits
          </p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Most frequent visitor
          </p>
          <h2 className="mt-2 text-xl font-bold text-[#333333]">
            {mostVisits.name}
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            {mostVisits.visits} drives this year · {mostVisits.studentsHired}{" "}
            offers
          </p>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 bg-slate-50 px-5 py-4 sm:px-6">
          <h2 className="text-lg font-bold text-[#333333]">
            Companies on campus
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Top recruiters by students hired (sample 2025 season)
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left">
            <thead>
              <tr className="border-b text-sm text-slate-400">
                <th className="px-5 py-3 font-medium sm:px-6">Company</th>
                <th className="px-5 py-3 font-medium sm:px-6">Sector</th>
                <th className="px-5 py-3 font-medium sm:px-6">Visits</th>
                <th className="px-5 py-3 font-medium sm:px-6">Students hired</th>
              </tr>
            </thead>
            <tbody className="divide-y text-[#333333]">
              {companies.map((company) => (
                <tr key={company.name} className="hover:bg-slate-50">
                  <td className="px-5 py-4 sm:px-6">
                    <p className="font-semibold">{company.name}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{company.note}</p>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600 sm:px-6">
                    {company.sector}
                  </td>
                  <td className="px-5 py-4 text-sm font-medium sm:px-6">
                    {company.visits}
                  </td>
                  <td className="px-5 py-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <span className="w-8 text-sm font-bold text-[#786EFE]">
                        {company.studentsHired}
                      </span>
                      <div className="h-2 flex-1 max-w-[140px] overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-[#786EFE]"
                          style={{
                            width: `${(company.studentsHired / maxHired) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {highlights.map((item) => {
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

      <p className="mt-8 text-sm text-slate-500">
        Contact the Training & Placement Office at{" "}
        <a
          href="mailto:placements@iitdholakpur.edu"
          className="font-semibold text-[#786EFE] hover:underline"
        >
          placements@iitdholakpur.edu
        </a>
      </p>
    </ResourcePageShell>
  );
}
