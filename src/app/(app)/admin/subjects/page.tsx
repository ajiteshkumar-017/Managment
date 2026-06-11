"use client"
import React, { useState } from 'react'
import Bar from "@/utils/Admin/Bar"
import { Eye, Pen, PlusCircle, User2Icon, X } from 'lucide-react'

const filterOption = [
    {
        by: "Department", option: ["Computer Science Engineering", "Mechanical Engineering", "Civil Engineering", "AeroSpace Engineering"]
    },
    {
        by: "Designation", option: ["Assistant Proffesor", "Proffessor"]
    },
    {
        by: "Status", option: ["Active", "Graduated", "BlackList", "Resticated"]
    },
    {
    by: "Semester", option : ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"]
  }
]

const tableData = [
    {
        name: "Ajitesh Kumar", subjectCode: "CSE-001", semester: "2nd", department: "CSE", status: "Active", type: "Core"
    },

    {
        name: "Boman", subjectCode: "CSE-001", semester: "2nd", department: "CSE", status: "Active", type: "Core"
    },

    {
        name: "Kunal Kumar", subjectCode: "BSE-004", semester: "2nd", department: "CSE", status: "Active", type: "Core"
    },

    {
        name: "Ajitesh Kumar", subjectCode: "CSE-001", semester: "2nd", department: "CSE", status: "Active", type: "Core"
    },
    {
        name: "Ajitesh Kumar", subjectCode: "CSE-001", semester: "2nd", department: "CSE", status: "Active", type: "Core"
    },
    {
        name: "Ajitesh Kumar", subjectCode: "CSE-001", semester: "2nd", department: "CSE", status: "Active", type: "Core"
    },
    {
        name: "Ajitesh Kumar", subjectCode: "CSE-001", semester: "2nd", department: "CSE", status: "Active", type: "Core"
    },
]

const subjectCard = [
    { heading: "Total Subject", number: 30 },
    { heading: "Core Subject", number: 12 },
    { heading: "Elective Subject", number: 18 },
    { heading: "Active Subject", number: 28 },
]


const handleFilterChange = (filterName: string, value: string) => {



}




function adminSubjects() {
    const [open, setOpen] = useState(true)
    const [selectedFilter, setSelectedFilter] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(100);
    const [LargeScreen, setLargeScreen] = useState(window.innerWidth >= 1024)
    const [showModal, setShowModal] = useState<boolean | null>(false)
    const [editableData, setEdittableData] = useState(null)
    const [edit, setEdit] = useState(false)
    const [view, setView]= useState(false)


    const handleChangeofFilter = (filterName: string, value: string) => {
        setSelectedFilter((prev) => ({
            ...prev,
            [filterName]: value

        }))
    }

    const handleAddition = () => {

        try {

            console.log("Coming to Button Submission.")
        } catch (error) {

        }


    }

    const handleview = (id: number) => {
        
        console.log("Coming to View");
       
        const rowtoView = tableData.filter((_,index) => index === id);
        if(rowtoView){
            setEdittableData(rowtoView)
        }

        console.log("rowToView", rowtoView)
        setView(true)
    }

    const editData = (index: number) => {
        console.log("Edit Button Working");
        console.log("Edit Button No", index);
        

        const rowtoEdit = tableData[index]

        console.log(rowtoEdit)

        if(rowtoEdit){
            setEdittableData(rowtoEdit)
            setEdit(true);
            
        }

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

            <div className='flex-1 p-6 w-full overflow-x-auto md:flex-wrap'>
                <h1 className="text-2xl font-bold mb-4 text-black font-comfortaa tracking-tight">Subject</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {
                        subjectCard.length > 0 && subjectCard.map((data, i) =>
                        (

                            <div className='space-x-2 text-black  p-4 rounded-lg shadow-md border border-slate-200' key={i}>
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

                <h2 className='text-2xl mt-8 text-slate-600 font-comfortaa tracking-tight font-bold'>Subject Information</h2>

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







                <div className="hidden lg:block mt-6">
                    <div className="grid grid-cols-8 bg-slate-100 rounded-xl px-4 py-4 text-center">
                        {[
                            "SL No",
                            "Subject Code",
                            "Subject Name",
                            "Department",
                            "Semester",
                            "Type",
                            "Status",
                            "Actions",
                        ].map((head, i) => (
                            <div key={i}>
                                <h3 className="text-xs uppercase font-bold tracking-wider text-slate-500">
                                    {head}
                                </h3>
                            </div>
                        ))}
                    </div>

                    <div className="mt-2 space-y-2">
                        {tableData.map((tbData, index) => (
                            <div
                                key={index}
                                className="
          grid
          grid-cols-8
          items-center
          rounded-xl
          bg-white
          px-4
          py-4
          shadow-sm
          border
          border-slate-100
          text-center
          text-black
        "
                            >
                                <div>{index + 1}</div>

                                <div>{tbData.subjectCode}</div>

                                <div>{tbData.name}</div>

                                <div>{tbData.department}</div>

                                <div>{tbData.semester}</div>

                                <div>{tbData.type}</div>

                                <div>
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-medium ${tbData.status === "Active"
                                            ? "bg-emerald-100 text-emerald-700"
                                            : "bg-red-100 text-red-700"
                                            }`}
                                    >
                                        {tbData.status}
                                    </span>
                                </div>

                                <div className="flex justify-center gap-2">
                                    <button className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition" onClick={() => handleview(index)} >
                                        <Eye size={16} />
                                    </button>

                                    <button className="p-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition" onClick={() => editData(index) }>
                                        <Pen size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>


                <div className="lg:hidden mt-6 space-y-4">  
                    {tableData.map((tbData, index) => (
                        <div
                            key={index}
                            className="
        bg-white
        rounded-2xl
        border
        border-slate-200
        shadow-sm
        p-5
      "
                        >

                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="font-bold text-slate-900 text-lg">
                                        {tbData.name}
                                    </h3>

                                    <p className="text-sm text-slate-500">
                                        {tbData.subjectCode}
                                    </p>
                                </div>

                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${tbData.status === "Active"
                                        ? "bg-emerald-100 text-emerald-700"
                                        : "bg-red-100 text-red-700"
                                        }`}
                                >
                                    {tbData.status}
                                </span>
                            </div>


                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-slate-500">Department</p>
                                    <p className="font-medium text-black">
                                        {tbData.department}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-slate-500">Semester</p>
                                    <p className="font-medium text-black">
                                        {tbData.semester}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-slate-500">Type</p>
                                    <p className="font-medium text-black">
                                        {tbData.type}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-slate-500">SL No</p>
                                    <p className="font-medium text-black">
                                        {index + 1}
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 mt-5">
                                <button
                                    className="
            flex-1
            flex
            items-center
            justify-center
            gap-2
            bg-slate-100
            py-3
            rounded-xl
            text-slate-700
            font-medium
          "
           onClick={() => handleview(index)}
                                >
                                    <Eye size={16} />
                                    View
                                </button>

                                <button
                                    className="
            flex-1
            flex
            items-center
            justify-center
            gap-2
            bg-indigo-50
            py-3
            rounded-xl
            text-indigo-600
            font-medium
          "
           onClick={() => editData(index)}
                                >
                                    <Pen size={16} />
                                    Edit
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3">


                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                        className="
    w-full
    lg:w-24
      px-4 py-2
      rounded-xl
      bg-white
      border
      border-slate-200
      text-slate-700
      text-sm
      font-medium
      shadow-sm
      hover:bg-slate-50
      transition-all
      disabled:opacity-50
      disabled:cursor-not-allowed
    "
                    >
                        Previous
                    </button>


                    <div className="flex items-center gap-2">
                        {getPagination(currentPage, totalPages).map((page, index) => (
                            <button
                                key={index}
                                disabled={page === "..."}
                                onClick={() => {
                                    if (page !== "...") {
                                        setCurrentPage(page);
                                    }
                                }}
                                className={`
          min-w-[42px]
          h-[42px]
          rounded-xl
          text-sm
          font-semibold
          transition-all
          ${currentPage === page
                                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                                        : page === "..."
                                            ? "bg-transparent shadow-none cursor-default text-slate-400"
                                            : "bg-white text-slate-700 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 hover:shadow-sm"
                                    }
        `}
                            >
                                {page}
                            </button>
                        ))}
                    </div>


                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(currentPage + 1)}
                        className="
    w-full
    lg:w-24
      px-4 py-2
      rounded-xl
      bg-white
      border
      border-slate-200
      text-slate-700
      text-sm
      font-medium
      shadow-sm
      hover:bg-slate-50
      transition-all
      disabled:opacity-50
      disabled:cursor-not-allowed
    "
                    >
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
                                    <label htmlFor="" className='text-black font-medium tracking-tight font-comfortaa'>Subject Code</label>
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
                                    <label htmlFor="" className='text-black font-medium tracking-tight font-comfortaa'>Subject Name</label>
                                    <input type="text" placeholder='Enter Subject Name' className=' p-3 mt-2 rounded-xl bg-white shadow-sm text-black border border-slate-200 w-full' />
                                </div>
                            </div>

                            <div className='flex flex-col lg:flex-row   p-2 gap-4'>
                                <div className='flex flex-col w-full lg:w-1/2'>
                                    <label htmlFor="" className='text-black font-medium tracking-tight font-comfortaa'>Type</label>
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


            {edit && (
            <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50'>
                <div className='h-auto max-h-[90vh] overflow-y-auto w-full max-w-2xl bg-white rounded-lg shadow-lg p-6 mx-4'>
                    
                    {/* Header */}
                    <div className='flex justify-between items-center text-black border-b pb-3 mb-4'>
                        <h3 className='text-lg font-bold font-comfortaa'>Edit Subject Details</h3>
                        <button 
                            className='rounded-full hover:bg-slate-100 p-2 cursor-pointer transition' 
                            onClick={() => setEdit(false)}
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Row 1 */}
                    <div className='flex flex-col lg:flex-row gap-4 mb-4'>
                        <div className='flex flex-col w-full lg:w-1/2'>
                            <label className='text-black font-medium tracking-tight font-comfortaa'>Subject Code</label>
                            <select className='p-3 mt-2 rounded-xl bg-white shadow-sm text-black border border-slate-200 w-full'>
                                <option value="CSE-001">CSE-001</option>
                                <option value="CSE-002">CSE-002</option>
                                <option value="CSE-003">CSE-003</option>
                            </select>
                        </div>

                        <div className='flex flex-col w-full lg:w-1/2'>
                            <label className='text-black font-medium tracking-tight font-comfortaa'>Subject Name</label>
                            <input 
                                type="text" 
                                placeholder='Enter Subject Name' 
                                className='p-3 mt-2 rounded-xl bg-white shadow-sm text-black border border-slate-200 w-full' 
                            />
                        </div>
                    </div>

                    {/* Row 2 */}
                    <div className='flex flex-col lg:flex-row gap-4 mb-4'>
                        <div className='flex flex-col w-full lg:w-1/2'>
                            <label className='text-black font-medium tracking-tight font-comfortaa'>Type</label>
                            <select className='p-3 mt-2 rounded-xl bg-white shadow-sm text-black border border-slate-200 w-full'>
                                <option value="core">Core</option>
                                <option value="elective">Elective</option>
                            </select>
                        </div>

                        <div className='flex flex-col w-full lg:w-1/2'>
                            <label className='text-black font-medium tracking-tight font-comfortaa'>Department</label>
                            <select className='p-3 mt-2 rounded-xl bg-white shadow-sm text-black border border-slate-200 w-full'>
                                <option value="cse">CSE</option>
                                <option value="ece">ECE</option>
                            </select>
                        </div>
                    </div>

                    {/* Row 3 */}
                    <div className='flex gap-4 mb-6'>
                        <div className='flex flex-col w-full lg:w-1/2'>
                            <label className='text-black font-medium tracking-tight font-comfortaa'>Semester</label>
                            <select className='p-3 mt-2 rounded-xl bg-white shadow-sm text-black border border-slate-200 w-full'>
                                <option value="1">Semester 1</option>
                                <option value="2">Semester 2</option>
                            </select>
                        </div>
                    </div>

                    {/* Submit Action */}
                    <button className='p-4 bg-blue-500 text-white w-full rounded-xl font-bold font-comfortaa hover:bg-blue-600 shadow-md cursor-pointer transition-all duration-200 active:scale-95'>
                        Save Changes
                    </button>
                </div>
            </div>
        )}

        {
    view  && (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50'>
            <div className='h-auto max-h-[90vh] overflow-y-auto w-full max-w-2xl bg-white rounded-lg shadow-lg p-6 mx-4'>
                
                {/* Header */}
                <div className='flex justify-between items-center text-black border-b pb-3 mb-4'>
                    <h3 className='text-lg font-bold font-comfortaa'>View Subject Details</h3>
                    <button 
                        className='rounded-full hover:bg-slate-100 p-2 cursor-pointer transition'  
                        onClick={() => setView(false)}
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Row 1 */}
                <div className='flex flex-col lg:flex-row gap-4 mb-4'>
                    <div className='flex flex-col w-full lg:w-1/2'>
                        <label className='text-black font-medium tracking-tight font-comfortaa'>Subject Code</label>
                        <select 
                            className='p-3 mt-2 rounded-xl bg-white shadow-sm text-black border border-slate-200 w-full disabled:bg-slate-50' 
                            disabled 
                            value={editableData[0]?.subjectCode || ""}
                        >
                            <option value="CSE-001">CSE-001</option>
                            <option value="CSE-002">CSE-002</option>
                            <option value="CSE-003">CSE-003</option>
                            <option value="BSE-004">BSE-004</option>
                        </select>
                    </div>

                    <div className='flex flex-col w-full lg:w-1/2'>
                        <label className='text-black font-medium tracking-tight font-comfortaa'>Subject Name</label>
                        <input 
                            type="text" 
                            className='p-3 mt-2 rounded-xl bg-white shadow-sm text-black border border-slate-200 w-full disabled:bg-slate-50' 
                            disabled
                            value={editableData[0]?.name || ""} // 👈 Populated name value
                        />
                    </div>
                </div>

                {/* Row 2 */}
                <div className='flex flex-col lg:flex-row gap-4 mb-4'>
                    <div className='flex flex-col w-full lg:w-1/2'>
                        <label className='text-black font-medium tracking-tight font-comfortaa'>Type</label>
                        <select 
                            className='p-3 mt-2 rounded-xl bg-white shadow-sm text-black border border-slate-200 w-full disabled:bg-slate-50' 
                            disabled
                            value={editableData[0]?.type || ""} // 👈 Populated type value
                        >
                            <option value="Core">Core</option>        {/* Capitalized C to match your tableData */}
                            <option value="Elective">Elective</option>
                        </select>
                    </div>

                    <div className='flex flex-col w-full lg:w-1/2'>
                        <label className='text-black font-medium tracking-tight font-comfortaa'>Department</label>
                        <select 
                            className='p-3 mt-2 rounded-xl bg-white shadow-sm text-black border border-slate-200 w-full disabled:bg-slate-50' 
                            disabled
                            value={editableData[0]?.department || ""} // 👈 Populated department value
                        >
                            <option value="CSE">CSE</option>          {/* Capitalized to match your tableData */}
                            <option value="ECE">ECE</option>
                        </select>
                    </div>
                </div>

                {/* Row 3 */}
                <div className='flex gap-4 mb-6'>
                    <div className='flex flex-col w-full lg:w-1/2'>
                        <label className='text-black font-medium tracking-tight font-comfortaa'>Semester</label>
                        <select 
                            className='p-3 mt-2 rounded-xl bg-white shadow-sm text-black border border-slate-200 w-full disabled:bg-slate-50' 
                            disabled
                            value={editableData[0]?.semester || ""} // 👈 Populated semester value
                        >
                            <option value="1st">1st</option>
                            <option value="2nd">2nd</option>          {/* Matches "2nd" from your tableData */}
                        </select>
                    </div>
                </div>

            </div>
        </div>
    )
}
</div>
    )
}

export default adminSubjects
