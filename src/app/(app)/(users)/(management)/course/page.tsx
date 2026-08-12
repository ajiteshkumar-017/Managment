"use client";

import axios from "axios";
import { Bell, Loader2, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

type CourseRow = {
  subjectCode: string;
  subjectName: string;
  faculty?: string;
  credits: number;
  totalClasses?: number;
};

function Course() {
  const [username, setUsername] = useState("");
  const [courses, setCourses] = useState<CourseRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTableData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/users/auth/course");
      const rows: CourseRow[] =
        response.data?.tableData || response.data?.subjects || [];
      setCourses(rows);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const errorMessage =
        err?.response?.data?.message || "Something Went Wrong in Fetching Data";
      toast.error(errorMessage);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsername = async () => {
    try {
      const res = await fetch("/api/users/getUsername");
      const data = await res.json();
      setUsername(data.username);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUsername();
    fetchTableData();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse text-black">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:pb-8">
          <div className="min-w-0 space-y-2 text-left">
            <div className="h-8 w-48 rounded-lg bg-slate-200" />
            <div className="h-4 w-64 rounded-md bg-slate-200" />
          </div>
          <div className="flex w-full shrink-0 flex-wrap items-center gap-2 sm:w-auto sm:gap-3">
            <div className="h-11 w-full rounded-xl bg-slate-200 sm:w-52 md:w-60 lg:w-64" />
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-200">
              <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white lg:block">
            <div className="border-b border-slate-200 px-5 py-4">
              <div className="h-5 w-24 rounded-md bg-slate-200" />
            </div>
            <div className="overflow-x-auto">
              <div className="grid grid-cols-5 gap-4 border-b border-slate-200 bg-slate-50 px-4 py-3.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="mx-auto h-3 w-16 rounded-md bg-slate-200" />
                ))}
              </div>
              <div className="min-w-250">
                {Array.from({ length: 5 }).map((_, row) => (
                  <div
                    key={row}
                    className="grid grid-cols-5 items-center gap-4 border-b border-slate-100 px-4 py-4"
                  >
                    <div className="mx-auto h-4 w-16 rounded-md bg-slate-200" />
                    <div className="mx-auto h-4 w-32 rounded-md bg-slate-200" />
                    <div className="mx-auto h-4 w-24 rounded-md bg-slate-200" />
                    <div className="mx-auto h-4 w-8 rounded-md bg-slate-200" />
                    <div className="mx-auto h-4 w-12 rounded-md bg-slate-200" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:pb-8">
        <div className="min-w-0 text-left">
          <h2 className="font-comfortaa text-2xl font-bold text-slate-900 sm:text-3xl">
            Hello {username} 👋
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Your subjects for this semester
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:gap-3">
          <div className="relative w-full flex-1 sm:w-auto sm:flex-none">
            <Search
              className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400 sm:left-4"
              size={18}
            />
            <input
              className="w-full rounded-xl border border-slate-200 py-2.5 pr-3 pl-10 text-sm text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none sm:w-52 sm:py-3 sm:pr-4 sm:pl-11 md:w-60 lg:w-64"
              placeholder="Search..."
            />
          </div>

          <button
            type="button"
            className="flex items-center justify-center rounded-xl bg-indigo-600 p-3 text-white transition-all hover:bg-indigo-700"
          >
            <Bell size={18} />
          </button>
        </div>
      </div>

      <div className="mt-8">
        <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white lg:block">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-lg font-bold text-slate-900">Overview</h2>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-250 grid grid-cols-5 border-b border-slate-200 bg-slate-50 px-4 py-3.5">
              {["Subject Code", "Subject", "Faculty", "Credits", "Total Class"].map(
                (heading) => (
                  <div
                    key={heading}
                    className="text-center text-xs font-bold tracking-wider text-slate-500 uppercase"
                  >
                    {heading}
                  </div>
                ),
              )}
            </div>

            <div className="min-w-250">
              {courses.length === 0 ? (
                <div className="px-4 py-10 text-center text-sm text-slate-500">
                  No subjects found for your department and semester.
                </div>
              ) : (
                courses.map((course) => (
                  <div
                    key={course.subjectCode}
                    className="grid grid-cols-5 items-center border-b border-slate-100 px-4 py-4 text-center text-sm transition-all hover:bg-slate-50"
                  >
                    <p className="font-medium text-slate-700">{course.subjectCode}</p>
                    <p className="font-semibold text-slate-900">{course.subjectName}</p>
                    <p className="text-center text-slate-700">{course.faculty || "-"}</p>
                    <p className="text-slate-700">{course.credits}</p>
                    <p className="text-center text-slate-700">
                      {course.totalClasses ?? 0}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-4 lg:hidden">
          <h2 className="mb-4 text-lg font-bold text-slate-900">Overview</h2>
          {courses.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center text-sm text-slate-500">
              No subjects found for your department and semester.
            </div>
          ) : (
            courses.map((item) => (
              <div
                key={item.subjectCode}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-slate-500">{item.subjectCode}</p>
                    <h3 className="mt-1 text-sm font-bold text-slate-900">
                      {item.subjectName}
                    </h3>
                  </div>
                  <span className="rounded-lg bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-600">
                    {item.credits} Cr
                  </span>
                </div>
                <div className="mt-3 text-sm text-slate-700">
                  <span className="font-medium text-slate-500">Faculty:</span>{" "}
                  {item.faculty || "-"}
                </div>
                <div className="mt-1 text-sm text-slate-700">
                  <span className="font-medium text-slate-500">Total classes:</span>{" "}
                  {item.totalClasses ?? 0}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default Course;
