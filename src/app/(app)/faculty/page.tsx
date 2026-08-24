  "use client";

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Mail, Search, Sparkles, Award } from "lucide-react";
import Navbar from "@/utils/Navbar";
import Footer from "@/utils/Footer";
import { IllustrationState } from "@/components/illustrations/IllustrationState";

type FacultyCard = {
  name: string;
  email: string;
  designation: string;
  department?: string;
  avatar?: string;
  patents?: string[];
  prominentWork?: string;
};

function FacultyPage() {
  const [faculty, setFaculty] = useState<FacultyCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axios.get("/api/faculty");
        if (!res.data?.success) {
          setError(res.data?.message || "Failed to load faculty");
          setFaculty([]);
          return;
        }
        setFaculty(res.data.data || []);
      } catch {
        setError("Failed to load faculty. Please try again.");
        setFaculty([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const departments = useMemo(() => {
    const set = new Set(
      faculty.map((f) => f.department).filter((d): d is string => Boolean(d)),
    );
    return ["All", ...Array.from(set).sort()];
  }, [faculty]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return faculty.filter((f) => {
      if (department !== "All" && f.department !== department) return false;
      if (!q) return true;
      return (
        f.name.toLowerCase().includes(q) ||
        f.email.toLowerCase().includes(q) ||
        f.designation.toLowerCase().includes(q) ||
        (f.department || "").toLowerCase().includes(q) ||
        (f.prominentWork || "").toLowerCase().includes(q) ||
        (f.patents || []).some((p) => p.toLowerCase().includes(q))
      );
    });
  }, [faculty, search, department]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="border-b border-gray-100 bg-linear-to-br from-slate-50 via-white to-[#786EFE]/5 px-4 py-10 sm:px-6 md:px-10 md:py-14">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#786EFE]">
            Faculty
          </p>
          <h1 className="mt-2 font-comfortaa text-3xl font-bold text-[#333333] sm:text-4xl">
            Meet our educators
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
            Faculty members across departments — roles, contact, and notable
            contributions when available.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:px-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search
              size={16}
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or designation"
              className="w-full rounded-xl border border-gray-200 py-2.5 pr-4 pl-9 text-sm text-[#333333] outline-none focus:ring-2 focus:ring-[#786EFE]/40"
            />
          </div>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-[#333333] outline-none focus:ring-2 focus:ring-[#786EFE]/40"
          >
            {departments.map((d) => (
              <option key={d} value={d}>
                {d === "All" ? "All departments" : d}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-56 animate-pulse rounded-2xl border border-gray-100 bg-slate-100"
              />
            ))}
          </div>
        ) : error ? (
          <p className="mt-10 rounded-2xl border border-red-100 bg-red-50 px-4 py-6 text-sm text-red-700">
            {error}
          </p>
        ) : filtered.length === 0 ? (
          <IllustrationState
            situation="empty"
            title="No faculty found"
            description="No faculty members match this search."
          />
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((person) => {
              const hasPatents = Boolean(person.patents?.length);
              const hasWork = Boolean(person.prominentWork);
              const initial = person.name.charAt(0).toUpperCase();

              return (
                <article
                  key={`${person.email}-${person.name}`}
                  className="flex flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-start gap-3">
                    {person.avatar ? (
                      <img
                        src={person.avatar}
                        alt={person.name}
                        className="h-14 w-14 shrink-0 rounded-2xl object-cover"
                      />
                    ) : (
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#786EFE]/10 text-lg font-bold text-[#786EFE]">
                        {initial}
                      </div>
                    )}
                    <div className="min-w-0">
                      <h2 className="truncate text-base font-bold text-[#333333]">
                        {person.name}
                      </h2>
                      <p className="mt-0.5 text-sm font-semibold text-[#786EFE]">
                        {person.designation}
                      </p>
                      {person.department ? (
                        <p className="mt-0.5 text-xs text-slate-500">
                          {person.department}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <a
                    href={`mailto:${person.email}`}
                    className="mt-4 inline-flex items-center gap-2 text-sm text-slate-600 transition hover:text-[#786EFE]"
                  >
                    <Mail size={14} className="shrink-0" />
                    <span className="truncate">{person.email}</span>
                  </a>

                  {hasWork ? (
                    <div className="mt-4 rounded-xl border border-gray-100 bg-slate-50/80 p-3">
                      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        <Sparkles size={12} className="text-[#786EFE]" />
                        Prominent work
                      </p>
                      <p className="mt-1.5 text-sm leading-relaxed text-slate-700">
                        {person.prominentWork}
                      </p>
                    </div>
                  ) : null}

                  {hasPatents ? (
                    <div className="mt-3 rounded-xl border border-gray-100 bg-slate-50/80 p-3">
                      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        <Award size={12} className="text-[#786EFE]" />
                        Patents
                      </p>
                      <ul className="mt-1.5 space-y-1">
                        {person.patents!.map((patent) => (
                          <li
                            key={patent}
                            className="text-sm leading-relaxed text-slate-700"
                          >
                            {patent}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}

export default FacultyPage;
