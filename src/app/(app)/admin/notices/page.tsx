"use client"
import React, { useState } from 'react'
import Bar from "@/utils/Admin/Bar"
import { Eye, Pen, PlusCircle, Trash2Icon, User2Icon, X } from 'lucide-react'


const filterOption = [
    {
        by: "Date", option: [""]
    },

    {
        by: "Topic", option: ["Academic Managment", "Exam", "Fest", "Cultural", "Holiday", "Important"]
    },
    {
        by: "Status", option: ["Active", "Expired", "Upcoming"]
    },
]

const Card = [
    { heading: "Total Notices", icon: <User2Icon size={18} />, number: "" },
    { heading: "Active Notices", icon: <User2Icon size={18} />, number: 1200 },
    { heading: "Expired Notices", icon: <User2Icon size={18} />, number: 900 },
    { heading: "Deleted Notices", icon: <User2Icon size={18} />, number: 9 },

]


const tableData = [
    {
        title: "Exam Schedueled", type: "Exam", audience: "Students", publishedDate: "12 May 2026", expiryDate: "25 May 2026", status: "active"
    },
    {
        title: "Cultural Fest", type: "Fest", audience: "All", publishedDate: "12 June 2026", expiryDate: "25 June 2026", status: "active"
    },
    {},
]




function page() {
    const [open, setOpen] = useState(true)
    const [selectedFilter, setSelectedFilter] = useState({});
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(100)
    const [rowsPerPage, setrowsPerPage] = useState(10)
    const [showModal, setShowModal] = useState<boolean | null>(false)
    const [editableData, setEdittableData] = useState(null)
    const [edit, setEdit] = useState(false)
    const [view, setView] = useState(false)
    const [selectedType, setSelectedType] = useState<string>("");
    const [department, setDepartment] = useState<string>("");
    const [semester, setSemester] = useState<string>("");

    const isDisabled = selectedType === "All";

    const handleTypeChange = (e) => {
        const value = e.target.value;
        setSelectedType(value);

        // Reset subordinate values if "All" is selected
        if (value === "all") {
            setDepartment("");
            setSemester("");
        }
    };



    const handleChangeofFilter = (filterName: string, value: string) => {
        setSelectedFilter((prev) => ({
            ...prev,
            [filterName]: value
        }))
    }

    const startIndex = (currentPage - 1) * rowsPerPage;
    const lastIndex = startIndex + rowsPerPage;

    const paginatedData = tableData.slice(startIndex, lastIndex);


    return (
        <div className='bg-linear-to-br from-slate-50 via-white to-slate-50 flex flex-col lg:flex-row min-h-screen w-full items-stretch'>
            <Bar open={open} setOpen={setOpen} />

            <div className='flex-1 p-6 w-full'>
                <h1 className="text-2xl font-bold mb-4 text-black font-comfortaa tracking-tight">Notices</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                    {
                        Card.length > 0 && Card.map((data, i) =>
                        (
                            <div>


                            </div>
                        ))
                    }

                </div>

                <h2 className='text-2xl mt-8 text-slate-600 font-comfortaa tracking-tight font-bold'>Notices Information</h2>

                <h3 className=' mt-8 text-slate-600 font-comfortaa tracking-tight font-bold'>Filter Options</h3>



                <div className="mt-4 w-full lg:w-auto  flex flex-col lg:flex-row gap-3 lg:flex-wrap lg:items-center">
                    {
                        filterOption.length > 0 && filterOption.map((opt, i) =>
                        (
                            <div key={i} className=' py-3 px-4 rounded-xl shadow-sm border border-slate-200 text-black'>
                                {

                                    opt.by === "Date" ? (

                                        <input
                                            type='date'
                                            value={selectedFilter[opt.by] || ""}
                                            onChange={(e) => handleChangeofFilter(opt.by, e.target.value)}
                                            className="outline-none bg-transparent font-medium text-sm text-black w-full"
                                        />
                                    ) : (

                                        <select
                                            value={selectedFilter[opt.by] || ""}
                                            onChange={(e) => handleChangeofFilter(opt.by, e.target.value)}
                                            className="outline-none bg-transparent font-medium text-sm text-black w-full"
                                        >
                                            <option value="" disabled>
                                                {opt.by}
                                            </option>
                                            {
                                                opt.option.map((item, index) => (
                                                    <option value={item} key={index} className='text-black'>
                                                        {item}
                                                    </option>
                                                ))
                                            }
                                        </select>
                                    )
                                }
                            </div>
                        )
                        )
                    }

                    <div className="flex gap-2 lg:items-center ">
                        <input
                            type="text"
                            className="w-full flex-1  rounded-lg border border-slate-200 px-4 py-3 text-black shadow-sm"
                            placeholder="Search..."
                        />

                        <button className="cursor-pointer rounded-lg border border-slate-200 bg-gray-400 px-4 py-3 font-bold text-white shadow-sm font-comfortaa">
                            Search
                        </button>
                    </div>

                    <button className='flex items-center w-full lg:w-auto text-sm font-bold text-white gap-2 border border-slate-200 bg-indigo-600 px-2 py-3 rounded-xl justify-center cursor-pointer font-comfortaa text-center' onClick={() => setShowModal(true)}>
                        <span ><PlusCircle /></span>
                        Add Notices
                    </button>



                </div>

                {
                    Object.keys(selectedFilter).length > 0 && (
                        <div className='mt-4 flex flex-wrap gap-2'>
                            {
                                Object.entries(selectedFilter).map(([key, value]) => (
                                    <span className=' lg:w-auto  rounded-full bg-indigo-500 py-1 px-2 text-sm  font-bold'>
                                        {key} : {String(value)}
                                    </span>
                                ))
                            }
                        </div>
                    )
                }





                {/* HEADING */}

                {/* <div className='grid grid-cols-7 my-4 rounded-xl bg-slate-100 py-2 px-4 justify-center items-center text-center text-sm  '>
                    {
                        ["SL No", "Class No", "Used by Department", "Capacity", "Size", "Status", "Actions"].map((head, i) =>
                        (
                            <div key={i} className=''>
                                <h3 className='uppercase font-bold text-zinc-400'>{head}</h3>
                            </div>

                        )

                        )
                    }



                </div> */}


                <div className='gap-4 space-y-2 overflow-x-auto hidden lg:block'>

                </div>

                <div className='lg:hidden gap-4 space-y-4 '>



                </div>

                {/* <div className="mt-10 flex items-center justify-center gap-2">

  {/* Previous */}
                {/* <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="
      px-4 py-2
      rounded-xl
      border border-slate-200
      bg-white
      text-slate-600
      text-sm font-medium
      shadow-sm
      hover:bg-slate-50
      disabled:opacity-50
      disabled:cursor-not-allowed
      transition-all
    "
                >
                    Previous
                </button> */}



                {/* Next */}
                {/* <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="
      px-4 py-2
      rounded-xl
      border border-slate-200
      bg-white
      text-slate-600
      text-sm font-medium
      shadow-sm
      hover:bg-slate-50
      disabled:opacity-50
      disabled:cursor-not-allowed
      transition-all
    "
                >
                    Next
                </button> */}


                <div className=' mt-6 p-2 gap-4 grid grid-cols-8 bg-zinc-100 rounded-xl'>
                    {
                        ["Sl.No", "Title", , "Type", "Audience", "Published Date", "ExpiryDate", "Status", "Action"].map((heading, index) =>

                        (
                            <div key={index} className='gap-4 text-slate-400 uppercase justify-center items-center text-center wrap-break-word text-sm  font-bold p-1 '>
                                {heading}
                            </div>
                        )
                        )
                    }
                </div>


                <div>
                    {
                        paginatedData.length > 0 && paginatedData.map((data, i) =>
                        (
                            <div key={i} className='grid grid-cols-8 text-black text-center p-2'>
                                <h3>
                                    {i + 1}
                                </h3>

                                <h3>
                                    {data.title}
                                </h3>

                                <h3>
                                    {data.type}
                                </h3>
                                <h3>
                                    {data.audience}
                                </h3>

                                <h3>
                                    {data.publishedDate}
                                </h3>

                                <h3>
                                    {data.expiryDate}
                                </h3>

                                <h3>
                                    {data.status}
                                </h3>

                                <div className='flex items-center justify-center m-1 gap-3'>
                                    <button className='flex items-center justify-between gap-2 bg-slate-100 p-2 rounded-full hover:bg-slate-100 cursor-pointer '>
                                        <Eye size={18} />

                                    </button>

                                    <button className='flex items-center justify-between gap-2 bg-indigo-600 p-2 rounded-full hover:bg-green-300 cursor-pointer '>
                                        <Pen size={18} />

                                    </button>
                                </div>

                            </div>
                        ))
                    }
                </div>


            </div>

            {/* {
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
                                    <label htmlFor="" className='text-black font-medium tracking-tight font-comfortaa'>CLASS NO</label>
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
                                    <label htmlFor="" className='text-black font-medium tracking-tight font-comfortaa'>Used by department</label>
                                <input type="text" placeholder='Enter Subject Name' className=' p-3 mt-2 rounded-xl bg-white shadow-sm text-black border border-slate-200 w-full' />
                                </div>
                            </div>

                             <div className='flex flex-col lg:flex-row   p-2 gap-4'>
                                <div className='flex flex-col w-full lg:w-1/2'>
                                    <label htmlFor="" className='text-black font-medium tracking-tight font-comfortaa'>Used by Semester</label>
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
                                    <label htmlFor="" className='text-black font-medium tracking-tight font-comfortaa'>Capacity</label>
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
                                    <label htmlFor="" className='text-black font-medium tracking-tight font-comfortaa'>Size</label>
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
            } */}


            {
                showModal && (
                    <div className='fixed inset-0 bg-black/50 flex justify-center items-center'>
                        <div className='h-160 lg:h-120 w-260 bg-white rounded-lg shadow-sm p-4'>
                            <div className='flex flex-cols justify-between text-black'>
                                <h3 className='p-2'>Input From</h3>
                                <button className='rounded-full hover:bg-slate-200  p-2 cursor-pointer ' onClick={() => setShowModal(false)}>
                                    <X size={24} />
                                </button>
                            </div>

                            <div className='flex flex-col lg:flex-row  p-2 gap-4'>
                                {/* <div className='flex flex-col  w-full lg:w-1/2'>
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
                                                                </div> */}

                                <div className='flex flex-col  w-full lg:w-full'>
                                    <label htmlFor="" className='text-black font-medium tracking-tight font-comfortaa'>Notice </label>
                                    <textarea placeholder='Enter the Notice' className=' p-3 mt-2 rounded-xl bg-white shadow-sm text-black border border-slate-200 w-full' />
                                </div>
                            </div>

                            <div className='flex flex-col lg:flex-row   p-2 gap-4'>
                                <div className='flex flex-col w-full lg:w-1/2'>
                                    <label htmlFor="" className='text-black font-medium tracking-tight font-comfortaa'>For</label>
                                    <select name="" id="type"
                                        value={selectedType}
                                        onChange={handleTypeChange} className='p-3 mt-2 rounded-xl bg-white shadow-sm text-black border border-slate-200 w-full'>
                                        <option value="">Default</option>
                                        <option value="All">All</option>
                                        <option value="">Exam</option>
                                        <option value="">Fest</option>
                                        <option value="">Cultural Fest</option>
                                        <option value="">Academic Managment</option>
                                        <option value="">Holiday</option>
                                        <option value="">Important</option>

                                    </select>
                                </div>

                                <div className='flex flex-col  w-full lg:w-1/2'>
                                    <label htmlFor="" className='text-black font-medium tracking-tight font-comfortaa'> Department</label>
                                    <select name="" id="" className='p-3 mt-2 rounded-xl bg-white shadow-sm text-black border border-slate-200 w-full' value={department}
                                        onChange={(e) => setDepartment(e.target.value)}
                                        disabled={isDisabled}>
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
                                    <select name="" id="" value={semester}
                                        onChange={(e) => setSemester(e.target.value)}
                                        disabled={isDisabled} className='p-3 mt-2 rounded-xl bg-white shadow-sm text-black border border-slate-200 w-full'>
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
                )
            }




        </div>
    )
}

export default page
