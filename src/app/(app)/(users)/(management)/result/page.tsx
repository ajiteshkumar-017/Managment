"use client"

import AdminNavbar from '@/utils/AdminNavbar'
import { Bell, Search } from 'lucide-react'
import React from 'react'

function result() {
  const username = "Ajitesh";

  const semester = [
    {
      semName: "Semester 1",
      cgpa: 9.12,
      percentage: 91.2,
      rank: "18",
      bestIn: "Physics",
      needToImprove: "Mathematics",
    },
    {
      semName: "Semester 2",
      cgpa: 8.95,
      percentage: 89.5,
      rank: "22",
      bestIn: "Chemistry",
      needToImprove: "English",
    },
    {
      semName: "Semester 3",
      cgpa: 9.28,
      percentage: 92.8,
      rank: "12",
      bestIn: "Computer Science",
      needToImprove: "Physics",
    },
    {
      semName: "Semester 4",
      cgpa: 8.84,
      percentage: 88.4,
      rank: "25",
      bestIn: "Mathematics",
      needToImprove: "Chemistry",
    },
    {
      semName: "Semester 5",
      cgpa: 9.45,
      percentage: 94.5,
      rank: "8",
      bestIn: "Data Structures",
      needToImprove: "English",
    },
    {
      semName: "Semester 6",
      cgpa: 9.38,
      percentage: 93.8,
      rank: "10",
      bestIn: "Database Management",
      needToImprove: "Computer Networks",
    },
    {
      semName: "Semester 7",
      cgpa: 9.56,
      percentage: 95.6,
      rank: "5",
      bestIn: "Artificial Intelligence",
      needToImprove: "Operating Systems",
    },
    {
      semName: "Semester 8",
      cgpa: 9.71,
      percentage: 97.1,
      rank: "3",
      bestIn: "Machine Learning",
      needToImprove: "Software Engineering",
    },
  ];

  const subjects = [
    {
      subjectCode: "CS101",
      subjectName: "Programming Fundamentals",
      marksObtained: 92,
      totalMarks: 100,
      grade: "A+",
      credits: 4,
      cgpa: 9.2,
    },
    {
      subjectCode: "MA102",
      subjectName: "Engineering Mathematics",
      marksObtained: 85,
      totalMarks: 100,
      grade: "A",
      credits: 4,
      cgpa: 8.5,
    },
    {
      subjectCode: "PH103",
      subjectName: "Applied Physics",
      marksObtained: 88,
      totalMarks: 100,
      grade: "A",
      credits: 3,
      cgpa: 8.8,
    },
    {
      subjectCode: "CH104",
      subjectName: "Engineering Chemistry",
      marksObtained: 79,
      totalMarks: 100,
      grade: "B+",
      credits: 3,
      cgpa: 7.9,
    },
    {
      subjectCode: "EC105",
      subjectName: "Basic Electronics",
      marksObtained: 95,
      totalMarks: 100,
      grade: "O",
      credits: 4,
      cgpa: 9.5,
    },
    {
      subjectCode: "ME106",
      subjectName: "Engineering Graphics",
      marksObtained: 82,
      totalMarks: 100,
      grade: "A",
      credits: 2,
      cgpa: 8.2,
    },
  ];

  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-slate-50 min-h-screen p-3 sm:p-4 md:p-5 lg:p-6">
      {/* MAIN LAYOUT */}
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-5 md:gap-6">
        <AdminNavbar />

        {/* ================= MAIN CONTENT ================= */}
        <div
          className={`
            bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-7 lg:p-8 shadow-sm
            transition-all duration-300
            w-full
            text-slate-900
          `}
        >
          {/* HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 pb-6 sm:pb-8 border-b border-slate-200">
            {/* Greeting */}
            <div className="min-w-0">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">
                Hello {username} 👋
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 sm:mt-2">
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
              <button className="p-2.5 sm:p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg sm:rounded-xl transition-all shrink-0 flex items-center justify-center">
                <Bell size={18} />
              </button>
            </div>
          </div>

          {/* RESULTS HERO SECTION */}
          <div className="mt-8 sm:mt-10 md:mt-12">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 mb-6 sm:mb-8">
              Result
            </h3>

            <div
              className="
                rounded-2xl sm:rounded-3xl
                bg-gradient-to-br
                from-indigo-50
                via-white
                to-indigo-50
                border border-indigo-200
                p-6 sm:p-8 md:p-10
                shadow-sm
                text-slate-900
              "
            >
              <p className="text-xs sm:text-sm font-medium uppercase tracking-wider text-indigo-600">
                Semester Performance
              </p>

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
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-2 sm:mt-3 text-indigo-600">10.0</h3>
                </div>

                <div className="bg-white border border-indigo-100 rounded-lg sm:rounded-2xl p-4 sm:p-6 hover:shadow-md transition-all">
                  <p className="text-xs sm:text-sm font-medium text-slate-600 uppercase tracking-wide">Semester</p>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-2 sm:mt-3 text-indigo-600">8</h3>
                </div>

                <div className="bg-white border border-indigo-100 rounded-lg sm:rounded-2xl p-4 sm:p-6 hover:shadow-md transition-all">
                  <p className="text-xs sm:text-sm font-medium text-slate-600 uppercase tracking-wide">Class Rank</p>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-2 sm:mt-3 text-indigo-600">#12</h3>
                </div>

                <div className="bg-white border border-indigo-100 rounded-lg sm:rounded-2xl p-4 sm:p-6 hover:shadow-md transition-all">
                  <p className="text-xs sm:text-sm font-medium text-slate-600 uppercase tracking-wide">Status</p>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold mt-2 sm:mt-3 text-green-600">
                    Passed
                  </h3>
                </div>
              </div>

              {/* Message */}
              <div className="mt-6 sm:mt-8 bg-gradient-to-r from-indigo-50 to-white rounded-lg sm:rounded-2xl p-4 sm:p-6 border border-indigo-100">
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
              <div className="grid grid-cols-7 gap-4 mt-4 bg-gradient-to-r from-slate-100 to-slate-50 rounded-xl sm:rounded-2xl px-4 py-4 border border-slate-200">
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
                {subjects.map((subject, index) => (
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
                      {subject.marksObtained}
                    </p>

                    <p className="text-sm md:text-base text-center text-slate-700">
                      {subject.totalMarks}
                    </p>

                    <p className="text-sm md:text-base text-center font-semibold text-indigo-600">
                      {subject.grade}
                    </p>

                    <p className="text-sm md:text-base text-center text-slate-900 font-medium">
                      {subject.credits}
                    </p>

                    <p
                      className={`text-sm md:text-base text-center font-bold ${
                        subject.cgpa >= 9
                          ? "text-green-600"
                          : subject.cgpa >= 7
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
              {subjects.map((subject, index) => (
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
                          subject.cgpa >= 9
                            ? "bg-green-100 text-green-700"
                            : subject.cgpa >= 7
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
                        {subject.marksObtained}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">
                        Total Marks
                      </p>
                      <p className="font-bold text-slate-900 mt-1 sm:mt-2 text-base sm:text-lg">
                        {subject.totalMarks}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">
                        Credits
                      </p>
                      <p className="font-bold text-slate-900 mt-1 sm:mt-2 text-base sm:text-lg">
                        {subject.credits}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">
                        CGPA
                      </p>

                      <p
                        className={`font-bold mt-1 sm:mt-2 text-base sm:text-lg ${
                          subject.cgpa >= 9
                            ? "text-green-600"
                            : subject.cgpa >= 7
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
          </div>

          {/* SEMESTER SUMMARY SECTION */}
          <div className="mt-10 sm:mt-12 md:mt-14">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 mb-6 sm:mb-8">
              Semester Summary
            </h3>

            {/* Desktop */}
            <div className="hidden lg:grid grid-cols-3 gap-6">
              {semester.map((sem, index) => (
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
                    {sem.semName}
                  </h4>

                  <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-slate-700">CGPA</span>
                      <span className="text-slate-900 font-bold">{sem.cgpa}</span>
                    </div>

                    <div className="h-px bg-slate-100"></div>

                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-slate-700">Percentage</span>
                      <span className="text-slate-900 font-bold">{sem.percentage}%</span>
                    </div>

                    <div className="h-px bg-slate-100"></div>

                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-slate-700">Class Rank</span>
                      <span className="text-indigo-600 font-bold">#{sem.rank}</span>
                    </div>

                    <div className="h-px bg-slate-100"></div>

                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-slate-700">Best In</span>
                      <span className="text-green-600 font-semibold text-right">{sem.bestIn}</span>
                    </div>

                    <div className="h-px bg-slate-100"></div>

                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-slate-700">To Improve</span>
                      <span className="text-amber-600 font-semibold text-right">{sem.needToImprove}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile + Tablet */}
            <div className="lg:hidden space-y-4 sm:space-y-5 mt-4">
              {semester.map((sem, index) => (
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
                      {sem.semName}
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
                      CGPA {sem.cgpa}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:gap-4 gap-y-4 sm:gap-y-5">
                    <div className="bg-gradient-to-br from-slate-50 to-white rounded-lg p-3 sm:p-4 border border-slate-100">
                      <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">
                        Percentage
                      </p>
                      <p className="font-bold text-slate-900 mt-1 sm:mt-2 text-base sm:text-lg">
                        {sem.percentage}%
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-slate-50 to-white rounded-lg p-3 sm:p-4 border border-slate-100">
                      <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">
                        Rank
                      </p>
                      <p className="font-bold text-indigo-600 mt-1 sm:mt-2 text-base sm:text-lg">
                        #{sem.rank}
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-slate-50 to-white rounded-lg p-3 sm:p-4 border border-slate-100">
                      <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">
                        Best Subject
                      </p>
                      <p className="font-bold text-green-600 mt-1 sm:mt-2 text-base sm:text-lg line-clamp-2">
                        {sem.bestIn}
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-slate-50 to-white rounded-lg p-3 sm:p-4 border border-slate-100">
                      <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">
                        To Improve
                      </p>
                      <p className="font-bold text-amber-600 mt-1 sm:mt-2 text-base sm:text-lg line-clamp-2">
                        {sem.needToImprove}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default result