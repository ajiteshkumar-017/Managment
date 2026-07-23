"use client";

import Link from "next/link";
import {
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  GraduationCap,
  Library,
} from "lucide-react";
import { ResourcePageShell, resourceLinks } from "@/utils/ResourcePageShell";

const icons = [CalendarDays, Library, BriefcaseBusiness, BookOpen, GraduationCap];

export default function ResourcesHubPage() {
  return (
    <ResourcePageShell
      title="Campus resources"
      description="Academic calendars, library access, placements, student portal, and alumni — all in one place."
      currentHref="/resources"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {resourceLinks.map((item, index) => {
          const Icon = icons[index] ?? BookOpen;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#786EFE]/30 hover:shadow-md"
            >
              <span className="inline-flex rounded-xl bg-[#786EFE]/10 p-2.5 text-[#786EFE]">
                <Icon size={20} />
              </span>
              <h2 className="mt-4 text-lg font-bold text-[#333333] group-hover:text-[#786EFE]">
                {item.label}
              </h2>
              <p className="mt-1 text-sm text-slate-500">Open resource →</p>
            </Link>
          );
        })}
      </div>
    </ResourcePageShell>
  );
}
