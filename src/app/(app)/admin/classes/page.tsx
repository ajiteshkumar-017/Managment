"use client"
import React, {useState} from 'react'
import Bar from "@/utils/Admin/Bar"
import { Eye, Pen, PlusCircle, User2Icon, X } from 'lucide-react'

const filterOption = [
    {
      by: "Capacity", option : ["Computer Science Engineering", "Mechanical Engineering", "Civil Engineering", "AeroSpace Engineering" ]
    },
    
    {
        by: "Technical Availabilty", option:  ["AC", "SmartBoard", "Both AC And SmartBoard"]
    },
    {
      by: "Status", option : ["Active", "Graduated", "BlackList", "Resticated" ]
    },
  ]

  const tableData = [
    {
      name: "Ajitesh Kumar", semester: "2nd", department : "CSE", status: "Active", classNo : 102, capacity: 1200, size: 30
    },

    {
      name: "Boman", semester: "2nd", department : "CSE",  status: "Active", classNo : 205,capacity: 1200, size: 30
    },

    {
      name: "Ajitesh Kumar", semester: "2nd", department : "CSE",  status: "Active", classNo : 562,capacity: 1200, size: 30
    },

    {
      name: "Ajitesh Kumar", semester: "2nd", department : "CSE", status: "Active", classNo : 534,capacity: 1200, size: 30
    },
    {
      name: "Ajitesh Kumar", semester: "2nd", department : "CSE",  status: "Active", classNo : 902,capacity: 1200, size: 30
    
    },
    {
      name: "Ajitesh Kumar", semester: "2nd", department : "CSE",  status: "Active", classNo : 102, capacity: 1200, size: 30
    },
    
    {
      name: "Ajitesh Kumar", semester: "2nd", department : "CSE",  status: "Active", classNo : 102, capacity: 1200, size: 30
    },
    {
      name: "Ajitesh Kumar", semester: "2nd", department : "CSE",  status: "Active", classNo : 102, capacity: 1200, size: 30
    },
    {
      name: "Ajitesh Kumar", semester: "2nd", department : "CSE",  status: "Active", classNo : 102, capacity: 1200, size: 30
    },
    {
      name: "Ajitesh Kumar", semester: "2nd", department : "CSE",  status: "Active", classNo : 102, capacity: 1200, size: 30
    },
    {
      name: "Ajitesh Kumar", semester: "2nd", department : "CSE",  status: "Active"
    },
    {
      name: "Ajitesh Kumar", semester: "2nd", department : "CSE",  status: "Active"
    },
    {
      name: "Ajitesh Kumar", semester: "2nd", department : "CSE",  status: "Active"
    },
    {
      name: "Ajitesh Kumar", semester: "2nd", department : "CSE",  status: "Active"
    },
    {
      name: "Ajitesh Kumar", semester: "2nd", department : "CSE",  status: "Active"
    },
    {
      name: "Ajitesh Kumar", semester: "2nd", department : "CSE",  status: "Active"
    },
    {
      name: "Ajitesh Kumar", semester: "2nd", department : "CSE",  status: "Active"
    },
    {
      name: "Ajitesh Kumar", semester: "2nd", department : "CSE",  status: "Active"
    },
    {
      name: "Ajitesh Kumar", semester: "2nd", department : "CSE",  status: "Active"
    },

    {
      name: "Ajitesh Kumar", semester: "2nd", department : "CSE",  status: "Active"
    },
    {
      name: "Ajitesh Kumar", semester: "2nd", department : "CSE",  status: "Active"
    },
    {
      name: "Ajitesh Kumar", semester: "2nd", department : "CSE",  status: "Active"
    },
    {
      name: "Ajitesh Kumar", semester: "2nd", department : "CSE",  status: "Active"
    },
    {
      name: "Ajitesh Kumar", semester: "2nd", department : "CSE",  status: "Active"
    },
    {
      name: "Ajitesh Kumar", semester: "2nd", department : "CSE",  status: "Active"
    },
    {
      name: "Ajitesh Kumar", semester: "2nd", department : "CSE",  status: "Active"
    },
    {
      name: "Ajitesh Kumar", semester: "2nd", department : "CSE",  status: "Active"
    },
    {
      name: "Ajitesh Kumar", semester: "2nd", department : "CSE",  status: "Active"
    },
    {
      name: "Ajitesh Kumar", semester: "2nd", department : "CSE",  status: "Active"
    },
    {
      name: "Ajitesh Kumar", semester: "2nd", department : "CSE",  status: "Active"
    },
    {
      name: "Ajitesh Kumar", semester: "2nd", department : "CSE",  status: "Active"
    },

  ]

  const facultyCard = [
    {heading: "Total Classes", number: 120},
    {heading: "Working", number: 900},
    {heading: "On Maintaince", number: 9},
    {heading: "Destructed", number: 5},
  ]

function adminFaculty() {
    const [open,setOpen]= useState(true)
    const [selectedFilter, setSelectedFilter]= useState({});
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(100)
    const [rowsPerPage, setrowsPerPage] = useState(10)
     const [showModal, setShowModal] = useState<boolean | null>(false)
      const [editableData, setEdittableData] = useState(null)
         const [edit, setEdit] = useState(false)
         const [view, setView]= useState(false)

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    const paginatedData = tableData.slice(
    startIndex,
    endIndex
    );

    const handleChangeofFilter = (filterName: string, value: string) => {
        setSelectedFilter((prev) => ({
            ...prev,
            [filterName]: value
        }))
    }

    

    const getPagination = (currentPage: number, totalPage: number) => {
        const pages = [];

        if(totalPage < 7){
            return Array.from({ length: totalPage }, (_, i) => i + 1);
        }

        pages.push(1);

        if (currentPage <= 3) {
        pages.push(2, 3, 4, 5, "...", totalPages);
        return pages;
  }

  // End
  if (currentPage >= totalPages - 3) {
    pages.push(
      1,
      "...",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages
    );
    return pages;
  }

  // Middle
  pages.push(
   
    "...",
    currentPage - 2,
    currentPage - 1,
    currentPage,
    currentPage + 1,
    currentPage + 2,
    "...",
    totalPages-1
  );

        pages.push(totalPage)

        return pages
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
  return (
    <div className='bg-linear-to-br from-slate-50 via-white to-slate-50 flex flex-col lg:flex-row min-h-screen w-full items-stretch'>
      <Bar open={open} setOpen={setOpen}/>

      <div className='flex-1 p-6 w-full'>
        <h1 className="text-2xl font-bold mb-4 text-black font-comfortaa tracking-tight">Classes</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {
              facultyCard.length > 0 && facultyCard.map((data,i) => 
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

         <h2 className='text-2xl mt-8 text-slate-600 font-comfortaa tracking-tight font-bold'>Classes Information</h2>

        <h3 className=' mt-8 text-slate-600 font-comfortaa tracking-tight font-bold'>Filter Options</h3>

        

    <div className="mt-4 w-full lg:w-auto  flex flex-col lg:flex-row gap-3 lg:flex-wrap lg:items-center">
            {
              filterOption.length > 0 && filterOption.map((opt, i) =>
              (
                <div key={i} className=' py-3 px-4 rounded-xl shadow-sm border border-slate-200 text-black'>
                    <select name="" id="" value={selectedFilter[opt.by] || ""} onChange={(e) => handleChangeofFilter(opt.by, e.target.value)}  className={`outline-none bg-transparent font-medium text-sm text-black 
                      `}>

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
              <span ><PlusCircle/></span>
              Add Classes
            </button>
            

            
        </div>

        {
          Object.keys(selectedFilter).length > 0  && (
            <div className='mt-4 flex flex-wrap gap-2'>
              {
                Object.entries(selectedFilter).map(([key,value]) => (
                  <span className=' lg:w-auto  rounded-full bg-green-600 py-1 px-2 text-sm font-medium'>
                    {key} : {String(value)}
                  </span>
                ))
              }
            </div>
          )
        }

        
       


       {/* HEADING */}

        <div className='grid grid-cols-7 my-4 rounded-xl bg-slate-100 py-2 px-4 justify-center items-center text-center text-sm  '>
          {
            ["SL No", "Class No", "Used by Department", "Capacity", "Size", "Status", "Actions"].map((head, i) => 
            (
              <div key={i}  className=''>
                <h3 className='uppercase font-bold text-zinc-400'>{head}</h3>
              </div>
              
            )
            
            )
          }


          
        </div>

         
        <div className='gap-4 space-y-2 overflow-x-auto hidden lg:block'>
          {
            paginatedData.map((tbData, index) => 
            (
              <div className='grid lg:grid-cols-7 text-center text-black  py-2'>
                 <div>{startIndex + index + 1}</div>
                 <div>CSE100</div>
                <div>{tbData.department}</div>
                <div>500</div>
                  <div>1200❌1200 foot</div>
                  
                  <div>
                    <span className={`${tbData.status === "Active" ? "bg-violet-200" : "bg-red-500"} py-1 px-2 rounded-full `} >
                    {tbData.status}
                    </span>
                  </div>
                  <div className='space-x-4 flex justify-center'>
                    <button title="View Details" className='py-2 px-2 bg-slate-100 rounded-lg text-slate-600 cursor-pointer hover' onClick={() => handleview(index)}>
                      <Eye size={18}/>
                    </button>

                    <button title="Edit Detail" className='py-2 px-2 bg-indigo-50 rounded-lg text-indigo-600 cursor-pointer' onClick={() => editData(index)}>
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

        <div className='lg:hidden gap-4 space-y-4 '>

          {
            paginatedData.length > 0 && paginatedData.map((data,i) => (
              <div className='gap-4 space-y-4 shadow-sm py-2 px-4 rounded-xl border border-slate-200'>
                <div className='justify-between flex   rounded-xl '>
                 <div className='text-xl text-black  font-bold'>
                   {data.classNo}
                 </div>

                 
                  <span className={`w-auto rounded-full px-3  text-sm  font-medium py-1 ${data.status === "Active" ? "bg-green-400 text-green-100" : "bg-red-500"}`}>
                    {data.status}
                  </span>
                 
                </div>

                <div className='grid grid-cols-2 gap-4' >
                    <div>
                      <h3 className='text-slate-400 font-medium  font-comfortaa'>Department</h3>
                      <h3 className='text-black'>{data.department}</h3>
                    </div>

                    <div>
                      <h3 className='text-slate-400 font-medium  font-comfortaa'>Semester</h3>
                      <h3 className='text-black'>{data.semester}</h3>
                    </div>

                    <div>
                      <h3 className='text-slate-400 font-medium  font-comfortaa'>Capacity</h3>
                      <h3 className='text-black'>{data.capacity}</h3>
                    </div>

                    <div>
                      <h3 className='text-slate-400 font-medium  font-comfortaa'>Size</h3>
                      <h3 className='text-black'>{data.size}</h3>
                    </div>
                </div>

                <div className='flex justify-between gap-4 '>
                  <button className='w-1/2 flex gap-2 text-center bg-slate-100 p-4  justify-center items-center font-medium text-slate-400 rounded-xl shadow-sm border border-slate-200' onClick={() => handleview(i)}>
                    <Eye size={18}/>
                    View
                  </button>

                  <button className='flex gap-2 text-center bg-indigo-100 p-4 w-1/2 justify-center items-center font-medium text-indigo-400 rounded-xl shadow-sm border border-slate-200' onClick={() => editData(i)}>
                    <Pen size ={18}/>
                    Edit
                  </button>
                </div>
                  
              </div>
            ))
          }

        </div>

        <div className="mt-10 flex items-center justify-center gap-2">

  {/* Previous */}
  <button
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
  </button>

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
        duration-200
        ${
          currentPage === page
            ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
            : page === "..."
            ? "bg-transparent text-slate-400 cursor-default"
            : "bg-white border border-slate-200 text-slate-700 hover:border-indigo-300 hover:text-indigo-600 hover:shadow-sm"
        }
      `}
    >
      {page}
    </button>
  ))}

  {/* Next */}
  <button
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
  </button>

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

export default adminFaculty
