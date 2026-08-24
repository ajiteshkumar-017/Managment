"use client"

import axios from 'axios';
import { Search } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { StudentPanelSkeleton } from "@/components/loading/GlassSkeleton";

type SubjectTable = {
  subjectCode: string;
  subjectName: string;
  markObtained: number;
  totalMark: number;
  grade: string;
  credit: number;
  cgpa: string;
};

type SemesterStat = {
  CGPA: number;
  semester: number;
  ClassRank: number;
  status: string;
  SGPA?: number;
};

function result() {
  const [username, setUsername] = useState("");
  const [subjectTable, setSubjectTable] = useState<SubjectTable[]>([]);
  const [stats, setStats] = useState<SemesterStat[]>([]);
  const [loading, setLoading] = useState(true);


  const getData = async () => {
    try {
        const res = await axios.get("/api/users/auth/result");
        console.log("Response of Result API", res.data);
        if(res.data.success){
          setStats((res.data.data.semesterData ?? []) as SemesterStat[]);
          setSubjectTable((res.data.data.SubjectWiseInfo ?? []) as SubjectTable[]);
          toast.success(res.data.message || 'Fetched the data');
        }else{
          console.log("Error in getting Data from backend.");
          toast.error(res.data.message || 'Error in getting Data from backend.');
        }

        
    } catch (err: any) {
      console.warn("Error in getting Data from backend.", err?.response?.data);
      setStats([]);
      setSubjectTable([]);
      toast.error(
        err?.response?.data?.message || "Error in getting Data from backend."
      );
    } finally {
      setLoading(false);
    }
  };





  
 
    const totalEarnedPoints = subjectTable.map((subject) => {
      let gradePoint = 0;
      if (subject.markObtained >= 90) gradePoint = 10;
      else if (subject.markObtained >= 80) gradePoint = 9;
      else if (subject.markObtained >= 70) gradePoint = 8; 
      else if (subject.markObtained >= 60) gradePoint = 7;
      else if (subject.markObtained >= 50) gradePoint = 6;
      else if (subject.markObtained >= 40) gradePoint = 5;
      else if (subject.markObtained >= 30) gradePoint = 4;
      else if (subject.markObtained >= 20) gradePoint = 3;
      else gradePoint = 0;
      return gradePoint * subject.credit;
    }).reduce((total, current) => total + current, 0);

  const totalCredits = subjectTable.reduce(
    (total, subject) => total + subject.credit,
    0
  );
  const sgpa = totalCredits > 0 ? totalEarnedPoints / totalCredits : 0;
  const latestStat = stats[0];

  const fetchUsername = async () => {
    try {
      const res = await fetch("/api/users/getUsername");
      const data = await res.json();
      setUsername(data.username);
      console.log("Username:", data.username);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUsername();
    getData();
  }, []);

  return (
    <>
          {/* HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 pb-6 sm:pb-8 border-b border-slate-200">
            {/* Greeting */}
            <div className="min-w-0">
              <h2 className="font-comfortaa text-2xl font-bold text-slate-900 sm:text-3xl">
                Hello {username} 👋
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Let's learn something new today
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 shrink-0">
              {/* Search */}
              <div className="relative w-full sm:w-auto flex-1 sm:flex-none">
                <Search
                  className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  className="w-full sm:w-52 md:w-60 lg:w-64 pl-10 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-slate-200 rounded-lg sm:rounded-xl text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Search..."
                />
              </div>

              {/* Notification Button */}
              <NotificationBell />
            </div>
          </div>

          {loading ? (
            <StudentPanelSkeleton variant="result" showHeader={false} />
          ) : (
          <>
          {/* RESULTS HERO SECTION */}
          <div className="mt-8 sm:mt-10 md:mt-12">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 mb-6 sm:mb-8">
              Result
            </h3>

            <div
              className="
                rounded-2xl sm:rounded-3xl
                bg-linear-to-br
                from-indigo-50
                via-white
                to-indigo-50
                border border-indigo-200
                p-6 sm:p-8 md:p-10
                shadow-sm
                text-slate-900
              "
            >
              <div className="flex items-center gap-3 justify-between">
                <p className="text-xs sm:text-sm font-medium uppercase tracking-wider text-indigo-600">
                Semester Performance
              </p>

              <p className='text-lg sm:text-xl md:text-lg pb-4 font-bold  sm:mt-3 text-slate-500'>
                Date Published: 25th May 2024
              </p>
              </div>

              <h2 className="mt-2 sm:mt-3 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
                Congratulations 🎉
              </h2>

              <p className="mt-2 sm:mt-3 text-sm sm:text-base text-slate-600">
                Your results have been published successfully.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 mt-6 sm:mt-8">
                <div className="bg-white border border-indigo-100 rounded-lg sm:rounded-2xl p-4 sm:p-6 hover:shadow-md transition-all">
                  <p className="text-xs sm:text-sm font-medium text-slate-600 uppercase tracking-wide">CGPA</p>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-2 sm:mt-3 text-indigo-600">
                    {latestStat?.CGPA?.toFixed(2) ?? "—"}
                  </h3>
                </div>

                <div className="bg-white border border-indigo-100 rounded-lg sm:rounded-2xl p-4 sm:p-6 hover:shadow-md transition-all">
                  <p className="text-xs sm:text-sm font-medium text-slate-600 uppercase tracking-wide">Semester</p>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-2 sm:mt-3 text-indigo-600">
                    {latestStat?.semester ?? "—"}
                  </h3>
                </div>

                <div className="bg-white border border-indigo-100 rounded-lg sm:rounded-2xl p-4 sm:p-6 hover:shadow-md transition-all">
                  <p className="text-xs sm:text-sm font-medium text-slate-600 uppercase tracking-wide">Class Rank</p>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-2 sm:mt-3 text-indigo-600">
                    #{latestStat?.ClassRank ?? "—"}
                  </h3>
                </div>

                <div className="bg-white border border-indigo-100 rounded-lg sm:rounded-2xl p-4 sm:p-6 hover:shadow-md transition-all">
                  <p className="text-xs sm:text-sm font-medium text-slate-600 uppercase tracking-wide">Status</p>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold mt-2 sm:mt-3 text-green-600">
                    {latestStat?.status || "—"}
                  </h3>
                </div>
              </div>

              {/* Message */}
              <div className="mt-6 sm:mt-8 bg-linear-to-r from-indigo-50 to-white rounded-lg sm:rounded-2xl p-4 sm:p-6 border border-indigo-100">
                <p className="text-sm sm:text-base leading-relaxed font-medium text-slate-700">
                  Congratulations on your excellent performance. Your hard work and
                  dedication have resulted in an outstanding academic record. Keep
                  pushing forward and continue striving for excellence.
                </p>
              </div>
            </div>
          </div>

          {/* SUBJECT-WISE PERFORMANCE SECTION */}
          <div className="mt-10 sm:mt-12 md:mt-14">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 mb-6 sm:mb-8">
              Subject-wise Performance
            </h3>

            {/* Desktop Table */}
            <div className="hidden lg:block">
              <div className="grid grid-cols-7 gap-4 mt-4 bg-linear-to-r from-slate-100 to-slate-50 rounded-xl sm:rounded-2xl px-4 py-4 border border-slate-200">
                {[
                  "Subject Code",
                  "Subject Name",
                  "Marks Obtained",
                  "Total Marks",
                  "Grade",
                  "Credits",
                  "CGPA",
                ].map((header, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-center"
                  >
                    <p className="text-xs md:text-sm uppercase tracking-wider font-semibold text-slate-700 text-center">
                      {header}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 mt-4">
                {subjectTable.map((subject, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-7 gap-4 bg-white border border-slate-200 rounded-lg sm:rounded-xl px-4 py-4 hover:shadow-md transition-all"
                  >
                    <p className="text-sm md:text-base text-center text-slate-900 font-medium">
                      {subject.subjectCode}
                    </p>

                    <p className="text-sm md:text-base text-center text-slate-700">
                      {subject.subjectName}
                    </p>

                    <p className="text-sm md:text-base text-center text-slate-900 font-medium">
                      {subject.markObtained}
                    </p>

                    <p className="text-sm md:text-base text-center text-slate-700">
                      {subject.totalMark}
                    </p>

                    <p className="text-sm md:text-base text-center font-semibold text-indigo-600">
                      {subject.grade}
                    </p>

                    <p className="text-sm md:text-base text-center text-slate-900 font-medium">
                      {subject.credit}
                    </p>

                    <p
                      className={`text-sm md:text-base text-center font-bold ${
                        Number(subject.cgpa) >= 9
                          ? "text-green-600"
                          : Number(subject.cgpa) >= 7
                          ? "text-amber-600"
                          : "text-red-600"
                      }`}
                    >
                      {subject.cgpa}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile + Tablet Cards */}
            <div className="lg:hidden space-y-4 mt-4">
              {subjectTable.map((subject, index) => (
                <div
                  key={index}
                  className="
                    bg-white
                    border
                    border-slate-200
                    rounded-xl sm:rounded-2xl
                    p-4 sm:p-6
                    shadow-sm
                    hover:shadow-md
                    transition-all
                  "
                >
                  {/* Subject Name + Grade */}
                  <div className="flex justify-between items-start gap-3 sm:gap-4">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base line-clamp-2">
                        {subject.subjectName}
                      </h4>

                      <p className="text-xs sm:text-sm text-slate-500 mt-1 sm:mt-2 font-medium">
                        {subject.subjectCode}
                      </p>
                    </div>

                    <span
                      className={`
                        px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap
                        ${
                          Number(subject.cgpa) >= 9
                            ? "bg-green-100 text-green-700"
                            : Number(subject.cgpa) >= 7
                            ? "bg-amber-100 text-amber-700"
                            : "bg-red-100 text-red-700"
                        }
                      `}
                    >
                      {subject.grade}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-100">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">
                        Marks Obtained
                      </p>
                      <p className="font-bold text-slate-900 mt-1 sm:mt-2 text-base sm:text-lg">
                        {subject.markObtained}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">
                        Total Marks
                      </p>
                      <p className="font-bold text-slate-900 mt-1 sm:mt-2 text-base sm:text-lg">
                        {subject.totalMark}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">
                        Credits
                      </p>
                      <p className="font-bold text-slate-900 mt-1 sm:mt-2 text-base sm:text-lg">
                        {subject.credit}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">
                        CGPA
                      </p>

                      <p
                        className={`font-bold mt-1 sm:mt-2 text-base sm:text-lg ${
                          Number(subject.cgpa) >= 9
                            ? "text-green-600"
                            : Number(subject.cgpa) >= 7
                            ? "text-amber-600"
                            : "text-red-600"
                        }`}
                      >
                        {subject.cgpa}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className='h-12 text-white flex items-center justify-center mt-6 rounded-lg '>
              <h3 className='text-lg sm:text-xl md:text-2xl font-bold bg-linear-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text'>
                Total GPA: {sgpa.toFixed(2)}
              </h3>
            </div>
          </div>

          {/* SEMESTER SUMMARY SECTION */}
          <div className="mt-10 sm:mt-12 md:mt-14">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 mb-6 sm:mb-8">
              Semester Summary
            </h3>

            {/* Desktop */}
            <div className="hidden lg:grid grid-cols-3 gap-6">
              {stats.map((sem, index) => (
                <div
                  key={index}
                  className="
                    bg-white
                    rounded-xl sm:rounded-2xl
                    p-5 sm:p-6
                    border
                    border-slate-200
                    shadow-sm
                    hover:shadow-md
                    hover:border-indigo-300
                    transition-all
                    duration-200
                  "
                >
                  <h4 className="text-base sm:text-lg font-bold text-indigo-600 mb-4 sm:mb-6">
                    Semester {sem.semester}
                  </h4>

                  <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-slate-700">CGPA</span>
                      <span className="text-slate-900 font-bold">{sem.CGPA}</span>
                    </div>

                    <div className="h-px bg-slate-100"></div>

                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-slate-700">SGPA</span>
                      <span className="text-slate-900 font-bold">{sem.SGPA ?? "—"}</span>
                    </div>

                    <div className="h-px bg-slate-100"></div>

                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-slate-700">Class Rank</span>
                      <span className="text-indigo-600 font-bold">#{sem.ClassRank}</span>
                    </div>

                    <div className="h-px bg-slate-100"></div>

                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-slate-700">Status</span>
                      <span className="text-green-600 font-semibold text-right">{sem.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile + Tablet */}
            <div className="lg:hidden space-y-4 sm:space-y-5 mt-4">
              {stats.map((sem, index) => (
                <div
                  key={index}
                  className="
                    bg-white
                    border
                    border-slate-200
                    rounded-xl sm:rounded-2xl
                    p-4 sm:p-6
                    shadow-sm
                    hover:shadow-md
                    transition-all
                  "
                >
                  <div className="flex items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <h4 className="text-base sm:text-lg font-bold text-indigo-600">
                      Semester {sem.semester}
                    </h4>

                    <span
                      className="
                        bg-indigo-100
                        text-indigo-600
                        px-3 sm:px-4
                        py-1.5 sm:py-2
                        rounded-lg sm:rounded-xl
                        text-xs sm:text-sm
                        font-semibold
                        whitespace-nowrap
                      "
                    >
                      CGPA {sem.CGPA}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:gap-4 gap-y-4 sm:gap-y-5">
                    <div className="bg-linear-to-br from-slate-50 to-white rounded-lg p-3 sm:p-4 border border-slate-100">
                      <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">
                        SGPA
                      </p>
                      <p className="font-bold text-slate-900 mt-1 sm:mt-2 text-base sm:text-lg">
                        {sem.SGPA ?? "—"}
                      </p>
                    </div>

                    <div className="bg-linear-to-br from-slate-50 to-white rounded-lg p-3 sm:p-4 border border-slate-100">
                      <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">
                        Rank
                      </p>
                      <p className="font-bold text-indigo-600 mt-1 sm:mt-2 text-base sm:text-lg">
                        #{sem.ClassRank}
                      </p>
                    </div>

                    <div className="bg-linear-to-br from-slate-50 to-white rounded-lg p-3 sm:p-4 border border-slate-100">
                      <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">
                        Status
                      </p>
                      <p className="font-bold text-green-600 mt-1 sm:mt-2 text-base sm:text-lg">
                        {sem.status}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          </>
          )}
    </>
  )
}

export default result