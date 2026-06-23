"use client"

import Bar from '@/utils/Admin/Bar'
// import { ArrowBigUpDash, ArrowRight, CalendarPlus, Shuffle, User2Icon, UserCircle2Icon } from 'lucide-react'
import React, { useRef, useState } from 'react'
import {
  ArrowBigUpDash,
  PauseCircle,
  GraduationCap,
  PlayCircle,
  UploadCloud,
  BookOpenCheck,
  School,
  ArrowLeftRight,
  BriefcaseBusiness,
  CalendarCheck2,
  UserCog,
  CirclePlus,
  PenSquare,
  CalendarRange,
  Building2,
  BadgeCheck,
  User2Icon,
  ArrowRight,
  Presentation,
  Layers3,
  X,
  AlertTriangle,
  Send,
  DownloadIcon,
  Upload,
  Trash2,
  SquareTerminal,
  FileSpreadsheet,
  AlertCircle
} from "lucide-react";
import toast from 'react-hot-toast';
import axios from 'axios';
// const Card = [
//   {heading: "", icon: <UserCircle2Icon size={18}/>, number: "1800"}
// ]

const studentOperations = [
  {
    title: "Promote Semester",
    icon: <ArrowBigUpDash size={16} />,
    color: "bg-emerald-100 text-emerald-600"
  },
  {
    title: "Freeze Semester",
    icon: <PauseCircle size={16} />,
    color: "bg-amber-100 text-amber-600"
  },
  {
    title: "Passout Student",
    icon: <GraduationCap size={16} />,
    color: "bg-violet-100 text-violet-600"
  },
  {
    title: "Activate Semester",
    icon: <PlayCircle size={16} />,
    color: "bg-blue-100 text-blue-600"
  },
  {
    title: "Bulk Student Upload",
    icon: <UploadCloud size={16} />,
    color: "bg-indigo-100 text-indigo-600"
  }
];

const facultyOperations = [
  {
    title: "Assign Faculty To Subject",
    icon: <Layers3 size={16} />,
    color: "bg-cyan-100 text-cyan-600"
  },
  {
    title: "Assign Faculty To Class",
    icon: <Presentation size={16} />,
    color: "bg-blue-100 text-blue-600"
  },
  {
    title: "Transfer Department",
    icon: <ArrowLeftRight size={16} />,
    color: "bg-orange-100 text-orange-600"
  },
  {
    title: "Faculty Workload",
    icon: <BriefcaseBusiness size={16} />,
    color: "bg-violet-100 text-violet-600"
  },
  {
    title: "Faculty Availability",
    icon: <CalendarCheck2 size={16} />,
    color: "bg-green-100 text-green-600"
  },
  {
    title: "Faculty Status Update",
    icon: <UserCog size={16} />,
    color: "bg-rose-100 text-rose-600"
  },
  {
    title: "Bulk Faculty Upload",
    icon: <UploadCloud size={16} />,
    color: "bg-indigo-100 text-indigo-600"
  }
];

const subjectOperations = [
  {
    title: "Add Subject",
    icon: <CirclePlus size={16} />,
    color: "bg-emerald-100 text-emerald-600"
  },
  {
    title: "Update Subject",
    icon: <PenSquare size={16} />,
    color: "bg-blue-100 text-blue-600"
  },
  {
    title: "Assign To Semester",
    icon: <CalendarRange size={16} />,
    color: "bg-violet-100 text-violet-600"
  },
  {
    title: "Assign To Department",
    icon: <Building2 size={16} />,
    color: "bg-orange-100 text-orange-600"
  },
  {
    title: "Activate Subject",
    icon: <BadgeCheck size={16} />,
    color: "bg-green-100 text-green-600"
  },
  {
    title: "Bulk Subject Upload",
    icon: <UploadCloud size={16} />,
    color: "bg-indigo-100 text-indigo-600"
  }
];

type parseRow = {
  row: number;
  errors: Record<string, string[] | undefined>;
  data: unknown;
};

function academicManagment() {


  const [open, setOpen] = useState(true)
  const [showModal, setModal] = useState(false)
  const [modelType, setModelType] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean | null>(false)
  const fileInputRef = useRef<HTMLInputElement>(null);

  // const [validateDataOnly, setValidateDataOnly] = useState(true);
  const [validationDone, setValidationDone] = useState(false);
  const [hasValidationErrors, sethasValidationError] = useState(false)
  const [parsedRows, setParsedRows] = useState<parseRow[]>([]);
  const [duplicateData, setDuplicateData] = useState(0);
  const [validRow, setValidRow] = useState(0);
  const [invalidRow, setInvalidRow] = useState(0);
  const [totalRows, setTotalRows] = useState(0);


  const handleButtonClick = () => {
    // Actively clicks the hidden input when the styled button is pressed
    fileInputRef.current?.click();
  };


  // const operationHandler = {
  //   "Freeze Students": freezeStudents,
  // "Promote Students": promoteStudents,
  // "Bulk Upload": bulkUploadStudents,
  // }



  const handleStudentBulkUploadFileSelection = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {

      setLoading(true);

      const file = e.target?.files?.[0];

      if (!file) {
        console.error("Please Selected a File");
        toast.error("Error in Selection of File");
        setLoading(false);
        return;

      }

      setSelectedFile(file);

      // const preview = URL.createObjectURL(file);

      // setPreview(preview);

      setValidationDone(false);
      sethasValidationError(false);


      console.log(selectedFile)

      console.log("Selected the File:", selectedFile)

      setModal(true)

    } catch (err: any) {
      console.error("Error in Uploading the File for Student's Bulk Upload", err);


    }
  }

  // const handleValidationOfFile = async () => {


  // }
  const handleImportofBulkStudents = async (e) => {
    try {

      e.preventDefault();
      if (!selectedFile) {
        console.log("Error in File");
        toast.error("Please select a file first");
        return;
      }

      // const imageUrl = URL.createObjectURL(selectedFile)

      const formData = new FormData();


      formData.append("file", selectedFile)

      console.log("CALLING API");
      console.log("API URL", "/api/admin/ClgMangment");

      const res = await axios.post("/api/admin/academicManagment/bulkUpload-students?validateOnly=false", formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      )

      toast.success("Students imported successfully!");
      console.log("API Response:", res.data);
      toast.success(res.data.message || "Students imported successfully!");
      setModal(false); // Close modal window
      setSelectedFile(null);
      setValidationDone(false);
    } catch (error: any) {
      console.error("Error in Uploading the File. Please review the File and Upload again")
      toast.error(error.response.data.message || "Something went wrong while Uploading the File")
    } finally {
      setLoading(false);
    }
  }

  const handleDownloadofTemplate = async () => {
    try {

      console.log("Downloading the Template")

      const response = await axios.get("/api/admin/academicManagment/bulkUpload-students/template", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(response.data);

      const link = document.createElement("a");

      link.href = url;
      link.download = "student-template.xlsx";

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

      console.log(response)
      if (!response.status === true) {
        console.log("Error in Downloadig the template.")
        toast.error("Error in Downloadig the template.")
      }

    } catch (err: any) {
      console.log("Error in Dewloading the Template", err);
    }
  }

  //   const modalMap = {
  //   "Freeze Semester": FreezeSemesterModal,
  //   "Promote Semester": PromoteSemesterModal,
  //   "Passout Student": PassoutStudentModal,
  //   "Activate Semester": ActivateSemesterModal,
  // };

  // const ActiveModal = activeModal ? modalMap[activeModal] : null;

  // const freezeStudents = () => {

  // }

  const handleValidationofFile = async () => {
    console.log("Reached the Validation route")
    if (!selectedFile) return toast.error("Please pick a file first!");

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await axios.post(
        "/api/admin/academicManagment/bulkUpload-students?validateOnly=true",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      )

      console.log(res.data.invalidRows);




      if (res.data.success === false || res.data.hasConflicts) {
        sethasValidationError(true);
        console.log("Total Rows", res.data.totalRows),
          console.log("Valid data", res.data.validData);
        console.log("Duplicate Rows", res.data.duplicateRows);
        toast.error(res.data.message || "Validation failed! Duplicate entries found.");
      } else {
        sethasValidationError(false);
        setParsedRows(res.data.data || []); // Show these rows in a table preview
        console.log("Console Log of the Backend data:", res.data.message)
        console.log("Total Rows", res.data.totalRows),
          console.log("Ready To Import data", res.data.finalVRow);


        setInvalidRow(0);
        setDuplicateData(0)
        setTotalRows(res.data.totalRows)
        setValidRow(res.data.finalVRow)
        toast.success("File analyzed! No duplicates found.");
        // if(hasValidationErrors === false){

        // }
      }

      setValidationDone(true);
    } catch (error) {
      sethasValidationError(true);
      setValidationDone(true);


      console.log("Total Rows", error.response.data.totalRows),
        console.log("Valid data", error.response.data.validData);
      console.log("Duplicate Rows", error.response.data.duplicateRows);
      console.log("Invalid Rows", error.response.data.invalidRows.length)
      console.log("Invalid Rows Data", error.response.data.invalidRows)
      console.log("Final Rows", error.response.data.finalVRow)
      setInvalidRow(error.response.data.invalidRows.length);
      setDuplicateData(error.response.data.duplicateRows)
      setTotalRows(error.response.data.totalRows)
      setValidRow(error.response.data.finalVRow)
      setParsedRows(error.response.data.invalidRows)
      console.log("Parsed Rows", parsedRows)
      // toast.error(error.response?.data?.message || "File validation failed.");
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className='bg-linear-to-br from-slate-50 via white to-slate-50 flex flex-col lg:flex-row w-full items-stretch min-h-screen'>
      <Bar open={open} setOpen={setOpen} />

      <div className='flex-1 p-6 w-full'>

        <h2 className='text-2xl font-comfortaa text-black'>Academic Management</h2>
        <p className='text-slate-600 tracking-tight mt-2'>Manage all academic operation and institutional settings</p>

        {/* <div className='grid grid-cols-1 gap-4'>
              {
                Card.length > 0 && Card.map(() => 
              (

              ))
              }
          </div> */}


        <div className='my-6'>
          <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <div className="flex items-start gap-3">

              <div className="mt-1 rounded-lg bg-amber-100 p-2">
                <AlertTriangle className="text-amber-700" size={20} />
              </div>

              <div>
                <h3 className="text-lg font-bold text-amber-900">
                  Important Instructions
                </h3>

                <ul className="mt-3 space-y-2 text-sm text-amber-800">
                  <li>
                    • Academic operations affect multiple student, faculty and subject
                    records across the institution.
                  </li>

                  <li>
                    • Verify all information carefully before performing any action.
                  </li>

                  <li>
                    • Semester Promotion should be executed only after result
                    finalization and academic approval.
                  </li>

                  <li>
                    • Freezing a semester may restrict academic activities for selected
                    students.
                  </li>

                  <li>
                    • Pass-out operations should only be performed for students who have
                    successfully completed all graduation requirements.
                  </li>

                  <li>
                    • Bulk upload operations may update a large number of records at once.
                  </li>

                  <li>
                    • Faculty and subject assignments directly impact attendance,
                    timetable and result management modules.
                  </li>

                  <li className="font-bold text-red-700">
                    ⚠️ Some academic operations cannot be reverted automatically after
                    execution. Please review all details before proceeding.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-8">


            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-indigo-100 text-indigo-600 p-2 rounded-lg">
                  <User2Icon size={22} />
                </span>

                <div>
                  <h3 className="text-black font-bold text-lg">
                    Student Operations
                  </h3>
                  <p className="text-sm text-slate-500">
                    Manage student academics
                  </p>
                </div>
              </div>

              <div className="space-y-2">

                {studentOperations.map((item, index) => (
                  <button
                    key={index}
                    className="
                      w-full
                      flex
                      items-center
                      justify-between
                      p-3
                      rounded-lg
                      border
                      border-slate-200
                      hover:bg-slate-50
                      transition-all
                      cursor-pointer

                      
                      "

                    onClick={() => { console.log(item.title); setModelType(item.title); setModal(true) }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="bg-indigo-100 text-indigo-600 p-2 rounded-lg">

                        {item.icon}
                      </span>

                      <p className="text-sm font-medium text-black">
                        {item.title}
                      </p>
                    </div>


                    <ArrowRight size={16} className="text-slate-500" />
                  </button>
                ))}

              </div>
            </div>




            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-emerald-100 text-emerald-600 p-2 rounded-lg">
                  <BriefcaseBusiness size={22} />
                </span>

                <div>
                  <h3 className="text-black font-bold text-lg">
                    Faculty Operations
                  </h3>

                  <p className="text-sm text-slate-500">
                    Manage faculty records
                  </p>
                </div>
              </div>

              <div className="space-y-2">

                {facultyOperations.map((item, index) => (
                  <button
                    key={index}
                    className="
            w-full
            flex
            items-center
            justify-between
            p-3
            rounded-lg
            border
            border-slate-200
            hover:bg-slate-50
            transition-all
            cursor-pointer
          "
                  >
                    <div className="flex items-center gap-3">
                      <span className="bg-emerald-100 text-emerald-600 p-2 rounded-lg">
                        {item.icon}
                      </span>

                      <p className="text-sm font-medium text-black">
                        {item.title}
                      </p>
                    </div>

                    <ArrowRight size={16} className="text-slate-500" />
                  </button>
                ))}

              </div>
            </div>




            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-violet-100 text-violet-600 p-2 rounded-lg">
                  <BookOpenCheck size={22} />
                </span>

                <div>
                  <h3 className="text-black font-bold text-lg">
                    Subject Operations
                  </h3>

                  <p className="text-sm text-slate-500">
                    Manage subjects
                  </p>
                </div>
              </div>

              <div className="space-y-2">

                {subjectOperations.map((item, index) => (
                  <button
                    key={index}
                    className="
            w-full
            flex
            items-center
            justify-between
            p-3
            rounded-lg
            border
            border-slate-200
            hover:bg-slate-50
            transition-all
            cursor-pointer
          "
                  >
                    <div className="flex items-center gap-3">
                      <span className="bg-violet-100 text-violet-600 p-2 rounded-lg">
                        {item.icon}
                      </span>

                      <p className="text-sm font-medium text-black">
                        {item.title}
                      </p>
                    </div>

                    <ArrowRight size={16} className="text-slate-500" />
                  </button>
                ))}

              </div>
            </div>

          </div>
        </div>
      </div>

      {
        showModal && (
          <div className='fixed inset-0 bg-black/50 flex justify-center items-center'>
            <div className='h-auto max-h-[90vh] overflow-y-auto w-full max-w-2xl bg-white shadow-sm border border-slate-200 rounded-xl p-6 mx-4'>
              <div className='flex justify-between items-center text-black border-b pb-3 mb-4'>
                <h3 className='text-lg font-bold font-comfortaa'>{modelType}</h3>
                <button
                  className='rounded-full hover:bg-slate-100 p-2 cursor-pointer transition'
                  onClick={() => setModal(false)}
                >
                  <X size={24} />
                </button>
              </div>

              {
                modelType === "Freeze Semester" && (
                  <>
                    <div className='gap-2 flex'>
                      <div className='w-full lg:w-1/2 flex flex-col m-2 p-2 shadow-sm border border-slate-200 rounded-lg'>
                        <label htmlFor="" className='text-black'>Semester</label>
                        <select name="" id="" className='text-black p-2'>
                          <option value="promote Semester">Semester</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                        </select>
                      </div>
                      <div className='w-full lg:w-1/2 flex flex-col m-2 p-2 shadow-sm border border-slate-200 rounded-lg'>
                        <label htmlFor="" className='text-black'>Section</label>
                        <select name="" id="" className='text-black p-2'>
                          <option value="promote Semester">Section</option>
                          <option value="ALL">All </option>
                          <option value="A">A</option>
                          <option value="B">B</option>
                          <option value="C">C</option>
                          <option value="D">D</option>
                          <option value="E">E</option>
                        </select>
                      </div>



                    </div>

                    <div className='gap-2 flex'>



                      <div className='w-full lg:w-1/2 flex flex-col m-2 p-2 shadow-sm border border-slate-200 rounded-lg'>
                        <label htmlFor="" className='text-black'> Department</label>
                        <select name="" id="" className='text-black p-2'>
                          <option value="promote Semester"> Department</option>
                          <option value="CSE">Computer Science and Engineering</option>
                          <option value="ME">Mechanical Engineering</option>
                          <option value="CE">Civil Engineering</option>
                        </select>
                      </div>
                    </div>

                    <div className='gap-2 flex'>



                      <div className='w-full  flex flex-col m-2 p-2 shadow-sm border border-slate-200 rounded-lg'>
                        <label htmlFor="" className='text-black'> Reason for Freezing of the Department</label>
                        <textarea name="" id="" className='text-black p-2 border-2 my-2'>

                        </textarea>
                      </div>
                    </div>


                    <button className='flex gap-3 p-3 w-full justify-center items-center bg-blue-500 mt-4 cursor-pointer rounded-xl font-bold font-comfortaa hover:bg-blue-700 transition-all duration-300  '>
                      <span>
                        <Send size={18} />
                      </span>
                      Submit
                    </button>
                  </>
                )
              }

              {
                modelType === "Promote Semester" && (
                  <>
                    <div className='gap-2 flex'>
                      <div className='w-full lg:w-1/2 flex flex-col m-2 p-2 shadow-sm border border-slate-200 rounded-lg'>
                        <label htmlFor="" className='text-black'>From Semester</label>
                        <select name="" id="" className='text-black p-2'>
                          <option value="promote Semester">From Semester</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                        </select>
                      </div>


                      <div className='w-full lg:w-1/2 flex flex-col m-2 p-2 shadow-sm border border-slate-200 rounded-lg'>
                        <label htmlFor="" className='text-black'>Promote to Semester</label>
                        <select name="" id="" className='text-black p-2'>
                          <option value="promote Semester">To Semester</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                        </select>
                      </div>
                    </div>

                    <div className='gap-2 flex'>
                      <div className='w-full lg:w-1/2 flex flex-col m-2 p-2 shadow-sm border border-slate-200 rounded-lg'>
                        <label htmlFor="" className='text-black'>Section</label>
                        <select name="" id="" className='text-black p-2'>
                          <option value="promote Semester">Section</option>
                          <option value="ALL">All </option>
                          <option value="A">A</option>
                          <option value="B">B</option>
                          <option value="C">C</option>
                          <option value="D">D</option>
                          <option value="E">E</option>
                        </select>
                      </div>


                      <div className='w-full lg:w-1/2 flex flex-col m-2 p-2 shadow-sm border border-slate-200 rounded-lg'>
                        <label htmlFor="" className='text-black'> Department</label>
                        <select name="" id="" className='text-black p-2'>
                          <option value="promote Semester"> Department</option>
                          <option value="CSE">Computer Science and Engineering</option>
                          <option value="ME">Mechanical Engineering</option>
                          <option value="CE">Civil Engineering</option>
                        </select>
                      </div>
                    </div>

                    <button className='flex gap-3 p-3 w-full justify-center items-center bg-blue-500 mt-4 cursor-pointer rounded-xl font-bold font-comfortaa hover:bg-blue-700 transition-all duration-300  '>
                      <span>
                        <Send size={18} />
                      </span>
                      Submit
                    </button>
                  </>
                )
              }

              {
                modelType === "Passout Student" && (
                  <>
                    <div className='gap-2 flex'>
                      <div className='w-full lg:w-1/2 flex flex-col m-2 p-2 shadow-sm border border-slate-200 rounded-lg'>
                        <label htmlFor="" className='text-black'>From Semester</label>
                        <select name="" id="" className='text-black p-2'>

                          <option value="8">8</option>

                        </select>
                      </div>


                      <div className='w-full lg:w-1/2 flex flex-col m-2 p-2 shadow-sm border border-slate-200 rounded-lg'>
                        <label htmlFor="" className='text-black'> Department</label>
                        <select name="" id="" className='text-black p-2'>
                          <option value="promote Semester"> Department</option>
                          <option value="CSE">Computer Science and Engineering</option>
                          <option value="ME">Mechanical Engineering</option>
                          <option value="CE">Civil Engineering</option>
                        </select>
                      </div>



                    </div>

                    <div className='gap-2 flex'>
                      <div className='w-full lg:w-1/2 flex flex-col m-2 p-2 shadow-sm border border-slate-200 rounded-lg'>
                        <label htmlFor="" className='text-black'>Section</label>
                        <select name="" id="" className='text-black p-2'>
                          <option value="promote Semester">Section</option>
                          <option value="ALL">All </option>
                          <option value="A">A</option>
                          <option value="B">B</option>
                          <option value="C">C</option>
                          <option value="D">D</option>
                          <option value="E">E</option>
                        </select>
                      </div>

                      <div className='w-full lg:w-1/2 flex flex-col m-2 p-2 shadow-sm border border-slate-200 rounded-lg'>
                        <label htmlFor="" className='text-black'>Choose the Batch</label>
                        <select name="" id="" className='text-black p-2'>
                          <option value="">Batch</option>
                          <option value="">2026-27</option>
                          <option value="">2025-26</option>
                          <option value="CE">2024-25</option>
                        </select>
                      </div>



                    </div>

                    <button className='flex gap-3 p-3 w-full justify-center items-center bg-blue-500 mt-4 cursor-pointer rounded-xl font-bold font-comfortaa hover:bg-blue-700 transition-all duration-300  '>
                      <span>
                        <Send size={18} />
                      </span>
                      Submit
                    </button>
                  </>
                )
              }

              {
                modelType === "Bulk Student Upload" && (
                  <>
                    {/* Download Template */}
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 flex flex-col lg:flex-row items-center justify-between gap-4">
                      <div>
                        <h3 className="text-base font-semibold text-slate-800">
                          Download Template
                        </h3>

                        <p className="text-slate-500 text-sm mt-1">
                          Download the official Excel template before uploading student data.
                        </p>
                      </div>

                      <button className="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all duration-300 cursor-pointer" onClick={handleDownloadofTemplate}>
                        <DownloadIcon size={18} />
                        Download
                      </button>
                    </div>

                    {/* Upload Area */}
                    <div className="mt-6 border-2 border-dashed border-indigo-300 rounded-2xl py-8 px-6 text-center bg-indigo-50/40 hover:bg-indigo-50 transition-all duration-300">

                      <UploadCloud
                        size={34}
                        className="mx-auto text-indigo-600 mb-4"
                      />

                      <h3 className="text-base font-semibold">
                        Drag & Drop Excel File
                      </h3>

                      <p className="text-xs text-slate-500">
                        Upload an Excel (.xlsx) or CSV (.csv) file
                      </p>

                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleStudentBulkUploadFileSelection}
                        className="hidden"
                        accept=".csv, .xlsx" // Optional: limits file types
                      />

                      <button className="mt-6 px-4 py-2.5 text-sm bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all cursor-pointer" onClick={handleButtonClick}>
                        Choose File
                      </button>
                    </div>

                    {/* Selected File */}
                    <div className="mt-6 rounded-2xl border border-slate-200 bg-white px-4 py-3 flex items-center justify-between">

                      <div className="flex items-center gap-4">

                        <div className="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                          <FileSpreadsheet size={24} className="text-indigo-600" />
                        </div>

                        <div>
                          <h3 className="text-black text-sm font-medium flex gap-2 ">
                            {selectedFile && <p>Uploaded: {selectedFile.name}</p> || "File 1.xlsx"}
                          </h3>

                          <p className=" text-slate-500 text-xs">
                            {selectedFile && <>{selectedFile.size}</>}
                          </p>
                        </div>

                      </div>

                      <button className="text-red-500 hover:text-red-700 cursor-pointer" onClick={() => setSelectedFile(null)}>
                        <Trash2 size={20} />
                      </button>


                    </div>

                    <div className='flex justify-center items-center'>
                      <button className={`w-full flex p-3  m-2 text-center items-center justify-center rounded-xl  bg-indigo-500 cursor-pointer font-bold gap-2`} onClick={handleValidationofFile}   >
                        <span>
                          <PlayCircle size={20} />
                        </span>
                        Validate and Preview
                      </button>
                    </div>


                    {/* Divider */}
                    <div className="h-px bg-slate-200 my-8" />

                    {/* Validation Summary */}

                    {
                      validationDone && (
                        <div>

                          <h3 className="text-black font-bold text-lg mb-4">
                            Validation Summary
                          </h3>

                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

                            <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-3">
                              <p className="text-xs text-slate-500">
                                Total Records
                              </p>

                              <h2 className="text-2xl font-semibold text-indigo-700 mt-2">
                                {totalRows}
                              </h2>
                            </div>

                            <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                              <p className="text-sm text-slate-500">
                                Ready to Import
                              </p>

                              <h2 className="text-3xl font-bold text-green-700 mt-2">
                                {validRow}
                              </h2>
                            </div>

                            <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                              <p className="text-sm text-slate-500">
                                Invalid
                              </p>

                              <h2 className="text-3xl font-bold text-red-700 mt-2">
                                {invalidRow}
                              </h2>
                            </div>

                            <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
                              <p className="text-sm text-slate-500">
                                Duplicate
                              </p>

                              <h2 className="text-3xl font-bold text-yellow-700 mt-2">
                                {duplicateData}
                              </h2>
                            </div>

                          </div>

                        </div>
                      )
                    }

                    {/* Invalid Rows */}
                    {validationDone && parsedRows.length > 0 && (
                      <div className="mt-8">

                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-sm font-medium text-slate-800">Invalid rows</h3>
                          <span className="text-xs font-medium px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200">
                            {parsedRows.length} row{parsedRows.length > 1 ? "s" : ""} need attention
                          </span>
                        </div>

                        <div className="flex flex-col gap-2">
                          {parsedRows.map((row, index) => (
                            <div
                              key={index}
                              className="bg-white border border-red-100 border-l-[3px] border-l-red-400 rounded-xl px-4 py-3 flex flex-col gap-2"
                            >
                              <p className="text-xs font-medium text-red-700 flex items-center gap-1.5">
                                <AlertCircle size={14} />
                                Row {row.row}
                              </p>

                              <div className="flex flex-wrap gap-1.5">
                                {Object.entries(row.errors).map(([field, messages]) =>
                                  messages?.map((msg, i) => (
                                    <span
                                      key={i}
                                      className="text-xs px-2.5 py-1 rounded-full bg-red-50 text-red-800 border border-red-100"
                                    >
                                      <span className="font-medium">{field}:</span> {msg}
                                    </span>
                                  ))
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                      </div>
                    )}

                    {/* Progress */}
                    {
                      validationDone && (
                        <div className="mt-8">

                          <div className="flex justify-between mb-2">

                            <p className="text-black font-medium">
                              Upload Progress
                            </p>

                            <span className="text-indigo-600 font-semibold">
                              68%
                            </span>

                          </div>

                          <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">

                            <div className="h-full w-[68%] bg-indigo-600 rounded-full"></div>

                          </div>

                        </div>
                      )
                    }

                    {/* Footer */}
                    <div className="flex flex-col lg:flex-row gap-4 mt-8">

                      <button className="w-full py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition-all cursor-pointer" onClick={() => setModal(false)}>
                        Cancel
                      </button>

                      <button className={`w-full flex justify-center items-center gap-2 py-2.5 text-sm  bg-indigo-600 rounded-xl font-bold text-white hover:bg-indigo-700 transition-all duration-300 cursor-pointer  ${loading || !validationDone || hasValidationErrors
                        ? "bg-slate-200 text-slate-400 cursor-not-allowed opacity-70" // ❌ Locked style (Grayed out)
                        : "bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer shadow-sm shadow-indigo-100" // ✅ Active style (Indigo)
                        }`} onClick={handleImportofBulkStudents} disabled={loading || !validationDone || hasValidationErrors}>
                        <Send size={18} />
                        Import Students
                      </button>

                    </div>
                  </>
                )
              }
            </div>
          </div>
        )
      }
    </div>
  )
}

export default academicManagment
