import React from "react";
import Footer from "@/utils/Footer";
import Navbar from "@/utils/Navbar";
import Link from "next/link";

export type ResourceNavItem = {
  label: string;
  href: string;
};

export const resourceLinks: ResourceNavItem[] = [
  { label: "Academic Calendar", href: "/resources/academic-calendar" },
  { label: "Library", href: "/resources/library" },
  { label: "Placement Cell", href: "/resources/placement-cell" },
  { label: "Student Portal", href: "/resources/student-portal" },
  { label: "Alumni", href: "/resources/alumni" },
];

type ResourcePageShellProps = {
  eyebrow?: string;
  title: string;
  description: string;
  children: React.ReactNode;
  currentHref?: string;
};

export function ResourcePageShell({
  eyebrow = "Resources",
  title,
  description,
  children,
  currentHref,
}: ResourcePageShellProps) {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="border-b border-gray-100 bg-linear-to-br from-slate-50 via-white to-[#786EFE]/5 px-4 py-10 sm:px-6 md:px-10 md:py-14">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#786EFE]">
            {eyebrow}
          </p>
          <h1 className="mt-2 font-comfortaa text-3xl font-bold text-[#333333] sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
            {description}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:px-10 md:py-10">
        {children}
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 md:px-10">
        <div className="rounded-2xl border border-gray-100 bg-slate-50/80 p-5 sm:p-6">
          <h2 className="text-lg font-bold text-[#333333]">More resources</h2>
          <p className="mt-1 text-sm text-slate-500">
            Jump to another campus resource
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {resourceLinks.map((item) => {
              const active = item.href === currentHref;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    active
                      ? "bg-[#786EFE] text-white"
                      : "bg-white text-[#333333] border border-gray-200 hover:border-[#786EFE]/40 hover:text-[#786EFE]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default ResourcePageShell;
