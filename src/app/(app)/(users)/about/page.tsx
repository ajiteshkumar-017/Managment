"use client"

import react, {useState} from "react" 

import Footer from "@/utils/Footer";
import Navbar from "@/utils/Navbar"


 function Page() {
  return (
    <>
    
    <div className="bg-white min-h-screen">
      <Navbar/>
      <div className="flex justify-between items-start m-4 p-4">
        <div className="w-1/2 p-4 flex justify-center ">
          <img src="/campus1.jpg" alt=""  className="bg-white max-h-100 w-auto object-contain rounded-2xl"/>
        </div>
        <div className="w-1/2 p-4">
          <h1 className="text-4xl font-bold tracking-tight mb-4 text-black">Introduction</h1>
          <p className="text-black font-bitcount">IIT Bombay was established in 1958. It attracts top-tier students. Its renowned faculty drives research and academics, forging collaborations with national and international peers. Alumni excel in various fields, contributing to industry, academia, research, and more. The institute offers innovative short-term courses, continuing education, and distance learning. Faculty members have received prestigious awards, including the Shanti Swaroop Bhatnagar and Padma honors. It provides a fully residential experience with hostels, dining, sports, and recreational facilities.</p>
        </div>
        
      </div>

      <div className="flex justify-between items-start m-4 p-4">

        <div className="w-1/2 p-4">
          <h1 className="text-4xl font-bold tracking-tight mb-4 text-black">Functional Organization</h1>
          <p className="text-black font-bitcount">IIT Bombay is an autonomous institute and deemed university governed by a board of governors, chaired by the president of India. It operates under the guidance of the IIT Council, established by India's ministry of education (MoE) (earlier called human resource development). The director, appointed by MoE, leads the institute for a five-year term, overseeing academic matters and serving on various committees. The senate, composed of professors and nominated members, ensures academic standards. The administrative functions are managed by the registrar and senior officials. The institute advisory council, comprising industry and academic experts, provides input on policies and goals.</p>
        </div>
        <div className="w-1/2 p-4 flex justify-center ">
          <img src="/campus2.jpg" alt=""  className="bg-white max-h-100 w-auto object-contain rounded-2xl "/>
        </div>
        
        
      </div>

      <div className="m-4 p-4 space-y-4">
        <h2 className="text-4xl font-bold tracking-tight mb-4 text-black">History</h2>
        <p className="text-black font-bitcount">In 1958, IIT Bombay was established as part of a government initiative inspired by recommendations from a committee led by Sir Nalini Ranjan Sarkar. IIT Bombay's campus covers 200 hectares in Powai, Mumbai. It received significant support from UNESCO and the government of the USSR, with equipment, experts, and fellowships facilitating its growth. In 1961, an Act of Parliament granted it the status of an institution of national importance, allowing it to confer its own degrees and diplomas.</p>

        <div className="w-full h-125 md:h-100 overflow-hidden rounded-xl">
            <img 
              src="/campus4.jpg" 
              alt="IIT Bombay Campus" 
              className="w-full h-full object-cover" 
            />
        </div>  


      </div>

      <div className="m-4 p-4 space-y-4">
          <h2 className="text-4xl font-bold tracking-tight mb-4 text-black">Mission</h2>
          <div className="overflow-hidden w-full h-125 md:h-100">
            <img src="campus8.jpg" alt="" />
          </div>
      </div>

      <div className="m-4 p-4 space-y-4">
          <h2 className="text-4xl font-bold tracking-tight mb-4 text-black">Vision</h2>
      </div>

        <Footer/> 
    </div>
    </>
  )

  
}
export default Page;