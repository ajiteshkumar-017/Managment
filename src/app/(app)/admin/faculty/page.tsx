"use client"
import React, { useState } from 'react'
import Bar from "@/utils/Admin/Bar"
import { Eye, Pen, PlusCircle, User2Icon, X } from 'lucide-react'
import { table } from 'console'

const filterOption = [
  {
    by: "Department", option: ["Computer Science Engineering", "Mechanical Engineering", "Civil Engineering", "AeroSpace Engineering"]
  },
  {
    by: "Designation", option: ["Assistant Proffesor", "Proffessor"]
  },
  {
    by: "Status", option: ["Active", "Graduated", "BlackList", "Resticated"]
  }
]

const tableData = [
  {
    name: "Ajitesh Kumar", semester: "2nd", department: "CSE", status: "Active"
  },

  {
    name: "Boman", semester: "2nd", department: "CSE", status: "Active"
  },

  {
    name: "Ajitesh Kumar", semester: "2nd", department: "CSE", status: "Active"
  },

  {
    name: "Ajitesh Kumar", semester: "2nd", department: "CSE", status: "Active"
  },
  {
    name: "Ajitesh Kumar", semester: "2nd", department: "CSE", status: "Active"
  },
  {
    name: "Ajitesh Kumar", semester: "2nd", department: "CSE", status: "Active"
  },
  {
    name: "Ajitesh Kumar", semester: "2nd", department: "CSE", status: "Active"
  },
]

const facultyCard = [
  { heading: "Total faculty", number: 1200 },
  { heading: "Active faculty", number: 900 },
  { heading: "On Leave", number: 9 },
  { heading: "Resigned", number: 5 },
]

function adminFaculty() {
  const [open, setOpen] = useState(true)
  const [selectedFilter, setSelectedFilter] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(100);
  const [LargeScreen, setLargeScreen] = useState(window.innerWidth >= 1024)
  const [showModal, setShowModal] = useState<boolean | null>(false)

  const handleChangeofFilter = (filterName: string, value: string) => {
    setSelectedFilter((prev) => ({
      ...prev,
      [filterName]: value
    }))
  }

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
      <Bar open={open} setOpen={setOpen} />

      <div className='flex-1 p-6 w-full'>
        <h1 className="text-2xl font-bold mb-4 text-black font-comfortaa tracking-tight">Faculty</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {
            facultyCard.length > 0 && facultyCard.map((data, i) =>
            (

              <div className='space-x-2 text-black  p-4 rounded-lg shadow-md border border-slate-200'>
                <div className='flex justify-start gap-4 items-center mb-4'>
                  <span className='bg-indigo-400 p-2 rounded-lg'>
                    <User2Icon size={24} />
                  </span>

                  <h3 className='text-xl font-medium'>{data.heading}</h3>
                </div>

                <h2 className='text-2xl text-center font-bold '>{data.number}</h2>
              </div>
            ))
          }
        </div>

        <h2 className='text-2xl mt-8 text-slate-600 font-comfortaa tracking-tight font-bold'>Faculty Information</h2>

        <h3 className=' mt-8 text-slate-600 font-comfortaa tracking-tight font-bold'>Filter Options</h3>



         <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
        
          
          {filterOption.map((opt, i) => (
            <div
              key={i}
              className="
                w-full
                lg:w-auto
                rounded-xl
                border
                border-slate-200
                bg-white
                px-4
                py-3
                shadow-sm
              "
            >
              <select
                value={selectedFilter[opt.by] || ""}
                onChange={(e) =>
                  handleChangeofFilter(opt.by, e.target.value)
                }
                className="
                  w-full
                  bg-transparent
                  outline-none
                  text-sm
                  text-black
                "
              >
                <option value="" disabled>
                  {opt.by}
                </option>
        
                {opt.option.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          ))}
        
          
          <div className="flex w-full gap-2 lg:w-auto">
            <input
              type="text"
              placeholder="Search..."
              className="
                flex-1
                rounded-xl
                border
                border-slate-200
                px-4
                py-3
                text-sm
                text-black
                shadow-sm
              "
            />
        
            <button
              className="
                rounded-xl
                bg-slate-800
                px-5
                py-3
                text-sm
                font-medium
                text-white
              "
            >
              Search
            </button>
          </div>
        
          
          <button
            onClick={() => setShowModal(true)}
            className="
              flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-indigo-600
              px-5
              py-3
              text-sm
              font-semibold
              text-white
              shadow-sm
              lg:w-auto
            "
          >
            <PlusCircle size={18} />
            Add Subject
          </button>
        </div>

        {/* {
          Object.keys(selectedFilter).length > 0   ? <pre className="w-full mt-4 rounded bg-slate-100 p-4 text-black wrap-break-words whitespace-normal">
        <h3>
          Selected Filter : {selectedFilter === "{}" ? "None" : JSON.stringify(selectedFilter)}
        </h3>
      </pre> : ("")
        } */}

        {Object.keys(selectedFilter).length > 0 && (
  <div className="mt-4 flex flex-wrap gap-2">
    {Object.entries(selectedFilter).map(([key, value]) => (
      <span
        key={key}
        className="
          rounded-full
          bg-indigo-50
          px-3
          py-1
          text-xs
          font-medium
          text-indigo-600
        "
      >
        {key}: {String(value)   }
      </span>
    ))}
  </div>
)}






        {/* HEADING */}

        <div className='grid grid-cols-7 mt-6  bg-slate-100 py-4 text-sm rounded-xl px-4 text-center '>
          {
            ["SL No", "Photo", "Name", "Department", "Designation", "Status", "Actions"].map((head, i) =>
            (
              <div key={i} className=''>
                <h3 className='uppercase font-bold text-zinc-400'>{head}</h3>
              </div>

            )

            )
          }



        </div>


        <div className='gap-4 space-y-2  hidden lg:block'>
          {
            tableData.map((tbData, index) =>
            (
              <div className='grid lg:grid-cols-7 text-center text-black  py-2'>
                <div>{index + 1}</div>
                <div>Photot</div>
                <div>{tbData.name}</div>

                <div>{tbData.department}</div>
                <div>{tbData.semester}</div>

                <div>
                  <span className={`${tbData.status === "Active" ? "bg-violet-200" : "bg-red-500"} py-1 px-2 rounded-full `} >
                    {tbData.status}
                  </span>
                </div>
                <div className='space-x-4 flex justify-center'>
                  <button title="View Details" className='py-2 px-2 bg-slate-100 rounded-lg text-slate-600 cursor-pointer hover'>
                    <Eye size={18} />
                  </button>

                  <button title="Edit Detail" className='py-2 px-2 bg-indigo-50 rounded-lg text-indigo-600 cursor-pointer'>
                    <Pen size={18} />
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

        <div className='lg:hidden gap-4'>
          {
            tableData.length > 0 && tableData.map((data, index) =>

            (
              <div className='w-full p-4 ' key={index}>
                <div>
                  {data.department}
                  { }
                </div>
              </div>
            ))
          }
        </div>

        {/* <div className='flex justify-center items-center gap-4 mt-4'>
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
        </div> */}


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
                  <label htmlFor="" className='text-black font-medium tracking-tight font-comfortaa'>Faculty Photo</label>
                  <input type="text" placeholder='Enter Subject Name' className=' p-3 mt-2 rounded-xl bg-white shadow-sm text-black border border-slate-200 w-full' />
                </div>

                <div className='flex flex-col  w-full lg:w-1/2'>
                  <label htmlFor="" className='text-black font-medium tracking-tight font-comfortaa'>Faculty Name</label>
                  <input type="text" placeholder='Enter Subject Name' className=' p-3 mt-2 rounded-xl bg-white shadow-sm text-black border border-slate-200 w-full' />
                </div>
              </div>

              <div className='flex flex-col lg:flex-row   p-2 gap-4'>
                <div className='flex flex-col w-full lg:w-1/2'>
                  <label htmlFor="" className='text-black font-medium tracking-tight font-comfortaa'>Faculty Designation</label>
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
                  <label htmlFor="" className='text-black font-medium tracking-tight font-comfortaa'>Faculty Department</label>
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

export default adminFaculty
