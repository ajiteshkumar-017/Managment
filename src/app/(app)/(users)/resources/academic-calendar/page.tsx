"use client";

import { ResourcePageShell } from "@/utils/ResourcePageShell";
import { academicTerms } from "@/data/academicCalendar";

export default function AcademicCalendarPage() {
  return (
    <ResourcePageShell
      title="Academic Calendar"
      description="Key dates for registration, classes, exams, and breaks for the current academic year."
      currentHref="/resources/academic-calendar"
    >
      <div className="space-y-8">
        {academicTerms.map((block) => (
          <div
            key={block.term}
            className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
          >
            <div className="border-b border-gray-100 bg-slate-50 px-5 py-4 sm:px-6">
              <h2 className="text-lg font-bold text-[#333333]">{block.term}</h2>
              <p className="mt-1 text-sm text-slate-500">{block.period}</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b text-sm text-slate-400">
                    <th className="px-5 py-3 font-medium sm:px-6">Date</th>
                    <th className="px-5 py-3 font-medium sm:px-6">Event</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-[#333333]">
                  {block.items.map((row) => (
                    <tr key={row.date + row.event} className="hover:bg-slate-50">
                      <td className="whitespace-nowrap px-5 py-3.5 text-sm font-medium sm:px-6">
                        {row.date}
                      </td>
                      <td className="px-5 py-3.5 text-sm sm:px-6">{row.event}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
        <p className="text-sm text-slate-500">
          Dates are indicative and may be updated by the Academic Office. For
          official notices, check the Student Portal or Contact Us.
        </p>
      </div>
    </ResourcePageShell>
  );
}
