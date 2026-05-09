"use client"

import Footer from "@/utils/Footer"
import Navbar from "@/utils/Navbar"
import react, { useEffect } from "react"


function courses() {
    return (
        <div className="bg-white min-h-screen">
            <Navbar/>

            <div className="mt-4 pl-6">
                <h2 className=" text-3xl text-black section-heading  p-4 tracking-normal font-bold">Introduction</h2>
                <p className="text-black p-4 text-base leading-8 tracking-wide ">Our institution offers three premier academic pillars designed to bridge the gap between theoretical knowledge and industrial mastery: B.Tech, M.Tech, and PhD.

                    The B.Tech program serves as a rigorous foundation, equipping students with core engineering principles and hands-on technical skills. For those seeking leadership, our M.Tech tracks provide specialized expertise in advanced system design and niche architectural domains. Finally, our PhD program fosters groundbreaking innovation, challenging researchers to solve complex, real-world problems.

                    Each course is structured into specialized departments, ensuring a focused, professional trajectory. Built for the modern engineer, our curriculum emphasizes precision, scalability, and technical excellence.</p>

            </div>

            <h2 className="text-3xl text-black mt-4 ml-6 p-4 tracking-normal font-bold">Courses</h2>

           <div className="mt-4 p-4 ml-4">
  <div className="grid grid-cols-1 lg:grid-cols-3 place-items-center justify-between gap-8">

    {/* B.Tech */}
    <button className="group text-left p-8 bg-white border border-gray-200 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-2 hover:border-[#786EFE] flex flex-col min-h-[500px]">

      <div className="flex justify-between items-start mb-6 gap-2">
        <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-[#1F2937]">
          Bachelor of Technology
        </h2>

        <span className="text-[10px] font-mono bg-purple-100 text-[#786EFE] px-2 py-1 rounded tracking-widest uppercase">
          CRS-001
        </span>
      </div>

      <div className="mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[#786EFE]">
          Focus: Skill Acquisition & Core Engineering
        </h3>
      </div>

      <p className="text-[#4B5563] text-[15px] leading-7 mb-8 flex-grow">
        A comprehensive four-year undergraduate program focusing on the fundamentals of engineering and applied sciences. Designed to bridge the gap between theoretical concepts and industrial application through rigorous hands-on training and project-based learning.
      </p>

      <div className="pt-6 border-t border-gray-200 flex items-center justify-between group-hover:text-[#786EFE] transition-colors text-black">
        <span className="text-xs font-semibold uppercase tracking-widest">
          View Departments
        </span>

        <svg
          className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 8l4 4m0 0l-4 4m4-4H3"
          />
        </svg>
      </div>
    </button>

    {/* M.Tech */}
    <button className="group text-left p-8 bg-white border border-gray-200 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-2 hover:border-[#786EFE] flex flex-col min-h-[500px]">

      <div className="flex justify-between items-start mb-6 gap-2">
        <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-[#1F2937]">
          Master of Technology
        </h2>

        <span className="text-[10px] font-mono bg-purple-100 text-[#786EFE] px-2 py-1 rounded tracking-widest uppercase">
          CRS-002
        </span>
      </div>

      <div className="mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[#786EFE]">
          Focus: Specialization & Technical Leadership
        </h3>
      </div>

      <p className="text-[#4B5563] text-[15px] leading-7 mb-8 flex-grow">
        An advanced two-year postgraduate degree for professionals seeking specialization in niche technical domains. This program emphasizes architectural system design, advanced analytics, and optimization of complex industrial workflows.
      </p>

      <div className="pt-6 border-t border-gray-200 flex items-center justify-between group-hover:text-[#786EFE] transition-colors text-black">
        <span className="text-xs font-semibold uppercase tracking-widest">
          View Departments
        </span>

        <svg
          className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 8l4 4m0 0l-4 4m4-4H3"
          />
        </svg>
      </div>
    </button>

    {/* PhD */}
    <button className="group text-left p-8 bg-white border border-gray-200 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-2 hover:border-[#786EFE] flex flex-col min-h-[500px]">

      <div className="flex justify-between items-start mb-6 gap-2">
        <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-[#1F2937]">
          Doctor of Philosophy
        </h2>

        <span className="text-[10px] font-mono bg-purple-100 text-[#786EFE] px-2 py-1 rounded tracking-widest uppercase">
          CRS-003
        </span>
      </div>

      <div className="mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[#786EFE]">
          Focus: Innovation & Knowledge Creation
        </h3>
      </div>

      <p className="text-[#4B5563] text-[15px] leading-7 mb-8 flex-grow">
        The pinnacle of academic achievement, focused on original research and expanding the global knowledge base. Candidates solve unsolved industry problems and pioneer new technological frontiers.
      </p>

      <div className="pt-6 border-t border-gray-200 flex items-center justify-between group-hover:text-[#786EFE] transition-colors text-black">
        <span className="text-xs font-semibold uppercase tracking-widest">
          View Departments
        </span>

        <svg
          className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 8l4 4m0 0l-4 4m4-4H3"
          />
        </svg>
      </div>
    </button>

  </div>
</div>
            <Footer />

        </div>
    )
}

export default courses