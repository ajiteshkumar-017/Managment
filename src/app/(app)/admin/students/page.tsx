"use client"
import React, { useState } from 'react'

import Bar  from '@/utils/Admin/Bar'
import {Book, ChevronsUp, DrumstickIcon, Eye, KeyRound, Pen, PlusCircle, Search, ShieldAlert, Trash2Icon, User2Icon, X} from "lucide-react"
import { stringify } from 'querystring'

function AdminStudents() {
  const [open, setOpen] = useState(true)
  const [selectedFilter, setSelectedFilter]= useState({});
  const [currentPage, setCurrentPage]= useState(1);
  const [totalPages, setTotalPages] = useState(100);
  const [LargeScreen, setLargeScreen] = useState(window.innerWidth >= 1024)
  const [showModal, setShowModal] = useState<boolean | null>(false)

  const handleChangeofFilter = (filterName, value ) => {
    setSelectedFilter((prev) => ({
      ...prev,
      [filterName] : value
    }))
  }

  const studentCard = [
    { heading: "Total Students", number: 1200 },
    { heading: "Active Students", number: 1100 },
    { heading: "Graduated Students", number: 300 },
    { heading: "New Enrollments", number: 150 },
  ]

  const Card = ({data} : {data : typeof studentCard[0]}) => {}

  const filterOption = [
    {
      by: "Department", option : ["Computer Science Engineering", "Mechanical Engineering", "Civil Engineering", "AeroSpace Engineering" ]
    },
    {
      by: "Semester", option : ["1st Semester", "2nd Semester", "3rd Semester", "4th Semester" ]
    },
    {
      by: "Section", option : ["A", "B", "C", "D" ]
    },
    {
      by: "Status", option : ["Active", "Graduated", "BlackList", "Resticated" ]
    },
  ]

  const tableData = [
    {
      name: "Ajitesh Kumar", semester: "2nd", department : "CSE", section :"A", status: "Active"
    },

    {
      name: "Boman", semester: "2nd", department : "CSE", section :"A", status: "Active"
    },

    {
      name: "Ajitesh Kumar", semester: "2nd", department : "CSE", section :"A", status: "Active"
    },

    {
      name: "Ajitesh Kumar", semester: "2nd", department : "CSE", section :"A", status: "Active"
    },
    {
      name: "Ajitesh Kumar", semester: "2nd", department : "CSE", section :"A", status: "Active"
    },
    {
      name: "Ajitesh Kumar", semester: "2nd", department : "CSE", section :"A", status: "Active"
    },
    {
      name: "Ajitesh Kumar", semester: "2nd", department : "CSE", section :"A", status: "Active"
    },
  ]

  const getPagination = (currentPage: number, totalPage: number) => {

        const pages = [];
        const siblingCount = LargeScreen ? 2 : 1;

        currentPage = Math.max(1, Math.min(currentPage, totalPage));

        const start = Math.max(2, currentPage - siblingCount)
        console.log(currentPage, totalPage)

        if (totalPage < 7) {
            return Array.from({ length: 5 }, (_, i) => i + 1);
        }

        pages.push(1);

        if (currentPage <= 4) {
            console.log("Failing into 1st Block")
            pages.push(2, 3, 4, 5, "...", totalPage)
            return pages
        }



        if (currentPage >= totalPage - 3) {

            console.log("Failing into 2nd Block")
            pages.push(
                "...",
                totalPage - 4,
                totalPage - 3,
                totalPage - 2,
                totalPage - 1,
                totalPage
            )

            return pages
        }


        console.log(currentPage, totalPage)

        if (currentPage > 4 && currentPage < totalPage - 3) {
            console.log("Failing into 3rd Block")
            //      pages.push(
            //     "...",
            //     currentPage-2,
            //     currentPage -1,
            //     currentPage,
            //     currentPage +1,
            //     currentPage +2,
            //     "...",
            // )

            pages.push("...")
            for (let i = currentPage - siblingCount; i <= currentPage + siblingCount; i++) {
                console.log("Faling Under for Loop.");
                if (i > 1 && i < totalPage) {
                    pages.push(i);
                }
            }
        }

        pages.push("...")



        pages.push(totalPage);

        return pages
    }
  return (
    <div className='bg-linear-to-br from-slate-50 via-white to-slate-50 flex flex-col lg:flex-row min-h-screen w-full items-stretch'>
      <Bar open={open} setOpen={setOpen}/>

      <div className='flex-1 p-6 w-full'>
        <h1 className="text-2xl font-bold mb-4 text-black font-comfortaa tracking-tight">Student Management</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {
              studentCard.length > 0 && studentCard.map((data,i) => 
              (

                <div className='space-x-2 text-black  p-4 rounded-lg shadow-md border border-slate-200'>
                    <div className='flex justify-start gap-4 items-center mb-4'>
                      <span className='bg-indigo-400 p-2 rounded-lg'>
                        <User2Icon size={24}/>
                      </span>

                      <h3 className='text-xl font-medium'>{data.heading}</h3>
                    </div>
                    
                    <h2 className='text-2xl text-center font-bold '>{data.number}</h2>
                </div>
              ))
            }
        </div>

         <h2 className='text-2xl mt-8 text-slate-600 font-comfortaa tracking-tight font-bold'>Student Information</h2>

        <h3 className=' mt-8 text-slate-600 font-comfortaa tracking-tight font-bold'>Filter Options</h3>

        

        {/* <div className="w-full bg-amber-50/60 border border-amber-200 rounded-2xl p-5 shadow-xs mt-4">
      
      <div className="flex items-center gap-2.5 text-amber-800 font-semibold text-base mb-3 border-b border-amber-200/60 pb-2">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
        <h2>Critical Administrative Instructions</h2>
      </div>

     
      <ul className="space-y-3.5 text-sm text-slate-700 font-medium pl-1">
        
        
        <li className="flex items-start gap-2.5">
          <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 shrink-0" />
          <p>
            <span className="text-slate-900 font-bold">Data Modifications (Edit):</span> Committing an update permanently overwrites the existing data records. Ensure accuracy before saving, as current data attributes cannot be automatically recovered.
          </p>
        </li>

        
        <li className="flex items-start gap-2.5">
          <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 shrink-0" />
          <p>
            <span className="text-slate-900 font-bold">Record Deletion (Delete):</span> Activating the deletion mechanism results in the permanent removal of the specified data asset. This operation is absolute and <span className="text-rose-600 font-bold underline decoration-rose-200 decoration-2">cannot be reverted or restored</span> under any circumstances.
          </p>
        </li>

        
        <li className="flex items-start gap-2.5">
          <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 shrink-0" />
          <p>
            <span className="text-slate-900 font-bold">Academic Promotion (Semester Up):</span> Advancing a student to the next academic level updates their structural enrollment parameters. Please note that academic demotions <span className="text-amber-800 font-bold underline decoration-amber-200 decoration-2">are restricted</span> by the system; students cannot be reverted to a previous semester once promoted.
          </p>
        </li>

      </ul>
      
      
      <p className="mt-4 text-xs text-slate-400 font-normal italic">
        * Please double-check all inputs before executing these actions. System logs will record all administrative modifications.
      </p>
    </div> */}

    <div className="mt-4 w-full gap-4 lg:flex lg:items-center lg:justify-center">
            {
              filterOption.length > 0 && filterOption.map((opt, i) =>
              (
                <div key={i} className=' py-4 px-2 rounded-lg shadow:md border border-slate-200 text-black text-center'>
                    <select name="" id="" value={selectedFilter[opt.by] || ""} onChange={(e) => handleChangeofFilter(opt.by, e.target.value)}  className={`outline-none bg-transparent ${
                      selectedFilter[opt.by]
                        ? "text-black"
                        : "text-slate-500"
                    }`}>

                      <option value="" disabled>
                    {opt.by}  
                  </option>
                     
                      {
                        opt.option.map((item,index) => 
                        (
                         
                            <option value={item} key={index}  className='text-black'>{item}</option>
                          
                        )
                        )
                      }
                    </select>
                </div>
              )
              )
            }

            <div className="flex flex-col gap-2 lg:flex-row lg:items-center ">
              <input
                type="text"
                className="w-full lg:w-60 rounded-lg border border-slate-100 p-4 text-black shadow-sm"
                placeholder="Search..."
              />

              <button className="cursor-pointer rounded-lg border border-slate-200 bg-gray-400 p-4 font-bold text-white shadow-sm font-comfortaa">
                Search
              </button>
            </div>

            <button className='flex items-center font-bold text-white gap-2 border border-slate-200 bg-indigo-600 p-4 rounded-lg cursor-pointer font-comfortaa w-full mt-4 lg:mt-0 justify-center lg:justify-start' onClick={() => setShowModal(true)}>
              <span ><PlusCircle/></span>
              Add Student
            </button>

            
        </div>

        {
          Object.keys(selectedFilter).length > 0   ? <pre className="w-full mt-4 rounded bg-slate-100 p-4 text-black wrap-break-words whitespace-normal">
        <h3>
          Selected Filter : {selectedFilter === "{}" ? "None" : JSON.stringify(selectedFilter)}
        </h3>
      </pre> : ("")
        }

        
       


       {/* HEADING */}

        <div className='grid grid-cols-8 mt-4  bg-slate-100 py-4 px-2 text-center '>
          {
            ["SL No", "Photo", "Name","Department", "Semester", "Section", "Status", "Actions"].map((head, i) => 
            (
              <div key={i}  className=''>
                <h3 className='uppercase font-bold text-zinc-400'>{head}</h3>
              </div>
              
            )
            
            )
          }


          
        </div>

         
        <div className='gap-4 space-y-2 overflow-x-auto'>
          {
            tableData.map((tbData, index) => 
            (
              <div className='grid lg:grid-cols-8 text-center text-black  py-2'>
                 <div>{index + 1}</div>
                 <div>Photot</div>
                  <div>{tbData.name}</div>
                  
                  <div>{tbData.department}</div>
                  <div>{tbData.semester}</div>
                  <div>{tbData.section}</div>
                  <div>{tbData.status}</div>
                  <div className='space-x-4 flex justify-center'>
                    <button title="View Details" className='py-2 px-2 bg-slate-100 rounded-lg text-slate-600 cursor-pointer hover'>
                      <Eye size={18}/>
                    </button>

                    <button title="Edit Detail" className='py-2 px-2 bg-indigo-50 rounded-lg text-indigo-600 cursor-pointer'>
                      <Pen size={18}/>
                    </button>


                    {/* <button title="Delete Student" className='py-2 px-2 bg-rose-50 rounded-lg text-rose-600 cursor-pointer'>
                      <Trash2Icon size={18}/>
                    </button> */}

                    {/* <button title="Edit Detail" className='py-2 px-2 bg-amber-50 rounded-lg text-amber-600'>
                      <KeyRound size={12}/>
                    </button> */}

                    {/* <button title="Promote One Semester Up" className='py-2 px-2 bg-emerald-50 rounded-lg text-emerald-600 cursor-pointer'>
                      <ChevronsUp size={12}/>
                    </button> */}

                    
                  </div>
              </div>
            )
            )
          }
        </div>

        <div className='flex justify-center items-center gap-4 mt-4'>
            <button className='py-2 px-2 rounded-lg font-bold  disabled:cursor-not-allowed disabled:opacity-50 text-black shadow-sm border border-slate-200 transition-all ' disabled={
                currentPage === 1
            }
            onClick={() => setCurrentPage(currentPage-1)}
            >
                Previous
            </button>

            {
                getPagination(currentPage, totalPages).map((page,index) => 
                    (
                        <button className={`${currentPage === page ? "bg-indigo-600 text-white" : "bg-white text-black"} font-extralight   px-4 py-2 rounded-lg shadow-md shadow-indigo-100 border-2 border-white transition-all duration-100`} disabled={page === "..."}
                            onClick={() => {
                                if (page !== "...") {
                                setCurrentPage(page);
                                }
                                }}>
                            {page}
                        </button>
                    ) 
                )
            }

            <button className='py-2 px-2 rounded-lg font-medium  disabled:cursor-not-allowed disabled:opacity-50 text-black shadow-sm border border-slate-200 transition-all ' disabled ={currentPage === totalPages}>
                Next
            </button>
        </div>
        

      </div>

      {
                showModal ? (
                <div className=' fixed inset-0 bg-black/50  flex justify-center items-center'>
                        <div className='h-160 lg:h-120 w-260 bg-white rounded-lg shadow-sm p-4'>
                            <div className='flex flex-cols justify-between text-black'>
                                    <h3 className='p-2'>Input From</h3>
                                    <button className='rounded-full hover:bg-slate-200  p-2 cursor-pointer ' onClick={() => setShowModal(false)}>
                                        <X size={24} />
                                    </button>
                            </div>

                            <div className='flex flex-col lg:flex-row  p-2 gap-4'>
                                <div className='flex flex-col  w-full lg:w-1/2'>
                                    <label htmlFor="" className='text-black font-medium tracking-tight font-comfortaa'>Photo</label>
                                <input type="text" placeholder='Enter Subject Name' className=' p-3 mt-2 rounded-xl bg-white shadow-sm text-black border border-slate-200 w-full' />
                                </div>

                                <div className='flex flex-col  w-full lg:w-1/2'>
                                    <label htmlFor="" className='text-black font-medium tracking-tight font-comfortaa'>Subject Name</label>
                                <input type="text" placeholder='Enter Subject Name' className=' p-3 mt-2 rounded-xl bg-white shadow-sm text-black border border-slate-200 w-full' />
                                </div>
                            </div>

                             <div className='flex flex-col lg:flex-row   p-2 gap-4'>
                                <div className='flex flex-col w-full lg:w-1/2'>
                                    <label htmlFor="" className='text-black font-medium tracking-tight font-comfortaa'>Status</label>
                                <select name="" id="" className='p-3 mt-2 rounded-xl bg-white shadow-sm text-black border border-slate-200 w-full'>
                                    <option value="">CSE-001</option>
                                    <option value="">CSE-002</option>
                                    <option value="">CSE-003</option>
                                    <option value="">BSE-001</option>
                                    <option value="">BSE-001</option>
                                    <option value="">BSE-001</option>
                                    <option value="">BSE-001</option>
                                </select>
                                </div>

                                <div className='flex flex-col  w-full lg:w-1/2'>
                                    <label htmlFor="" className='text-black font-medium tracking-tight font-comfortaa'> Department</label>
                                <select name="" id="" className='p-3 mt-2 rounded-xl bg-white shadow-sm text-black border border-slate-200 w-full'>
                                    <option value="">CSE-001</option>
                                    <option value="">CSE-002</option>
                                    <option value="">CSE-003</option>
                                    <option value="">BSE-001</option>
                                    <option value="">BSE-001</option>
                                    <option value="">BSE-001</option>
                                    <option value="">BSE-001</option>
                                </select>
                                </div>
                            </div>

                             <div className='flex  p-2 gap-4'>
                                 <div className='flex flex-col  w-full lg:w-1/2'>
                                    <label htmlFor="" className='text-black font-medium tracking-tight font-comfortaa'>Semester</label>
                                <select name="" id="" className='p-3 mt-2 rounded-xl bg-white shadow-sm text-black border border-slate-200 w-full'>
                                    <option value="">CSE-001</option>
                                    <option value="">CSE-002</option>
                                    <option value="">CSE-003</option>
                                    <option value="">BSE-001</option>
                                    <option value="">BSE-001</option>
                                    <option value="">BSE-001</option>
                                    <option value="">BSE-001</option>
                                </select>
                                </div>

                            
                            </div>

                            <button className='p-4 bg-blue-500 mt-2 w-full rounded-xl font-bold font-comfortaa hover:border-none hover:bg-blue-700 shadow-sm border-zinc-200 cursor-pointer transition-all duration-200 hover:scale-98'>
                                Submit
                            </button>
                        </div>
                </div>
                ) : (<></>)
            }
    </div>
  )
}

export default AdminStudents
