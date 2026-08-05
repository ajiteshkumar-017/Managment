"use client"

import Bar from '@/utils/Admin/Bar'
import AdminModal, {
  adminFieldClass,
  adminFormGridClass,
  adminLabelClass,
  adminPrimaryBtnClass,
  adminSecondaryBtnClass,
} from '@/utils/Admin/AdminModal'
// import { ArrowBigUpDash, ArrowRight, CalendarPlus, Shuffle, User2Icon, UserCircle2Icon } from 'lucide-react'
import React, { useEffect, useMemo, useRef, useState } from 'react'
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

type FacultyOption = {
  username: string;
  department?: string;
  designation?: string;
};

type SubjectOption = {
  subjectCode: string;
  subjectName: string;
  semester?: string;
  department?: string;
};

const DEPARTMENTS = [
  { value: "CSE", label: "Computer Science and Engineering" },
  { value: "ME", label: "Mechanical Engineering" },
  { value: "CE", label: "Civil Engineering" },
];

const API_ROUTES = {
  FACULTY: {
    LIST: "/api/admin/academicManagment/faculty",
    ASSIGN_SUBJECT: "/api/admin/academicManagment/faculty/assign-subject",
    ASSIGN_CLASS: "/api/admin/academicManagment/faculty/assign-class",
    TRANSFER_DEPARTMENT: "/api/admin/academicManagment/faculty/transfer-department",
    AVAILABILITY: "/api/admin/academicManagment/faculty/availability",
    STATUS: "/api/admin/academicManagment/faculty/status",
    WORKLOAD: "/api/admin/academicManagment/faculty/workload",
    BULK_UPLOAD: "/api/admin/academicManagment/faculty/bulk-upload",
  },
  SUBJECT: {
    LIST: "/api/admin/academicManagment/subject",
    UPDATE: "/api/admin/academicManagment/subject/update",
    ASSIGN_SEMESTER: "/api/admin/academicManagment/subject/assign-semester",
    ASSIGN_DEPARTMENT: "/api/admin/academicManagment/subject/assign-department",
    ACTIVATE: "/api/admin/academicManagment/subject/activate",
    BULK_UPLOAD: "/api/admin/academicManagment/subject/bulk-upload",
  },
  STUDENT: {
    BULK_UPLOAD: "/api/admin/academicManagment/bulkUpload-students",
  },
};

const bulkUploadConfig: Record<string, { validate: string; import: string; template: string; filename: string }> = {
  "Bulk Student Upload": {
    validate: `${API_ROUTES.STUDENT.BULK_UPLOAD}?validateOnly=true`,
    import: `${API_ROUTES.STUDENT.BULK_UPLOAD}?validateOnly=false`,
    template: `${API_ROUTES.STUDENT.BULK_UPLOAD}/template`,
    filename: "student-template.xlsx",
  },
  "Bulk Faculty Upload": {
    validate: `${API_ROUTES.FACULTY.BULK_UPLOAD}?validateOnly=true`,
    import: `${API_ROUTES.FACULTY.BULK_UPLOAD}?validateOnly=false`,
    template: `${API_ROUTES.FACULTY.BULK_UPLOAD}/template`,
    filename: "faculty-template.xlsx",
  },
  "Bulk Subject Upload": {
    validate: `${API_ROUTES.SUBJECT.BULK_UPLOAD}?validateOnly=true`,
    import: `${API_ROUTES.SUBJECT.BULK_UPLOAD}?validateOnly=false`,
    template: `${API_ROUTES.SUBJECT.BULK_UPLOAD}/template`,
    filename: "subject-template.xlsx",
  },
};

function academicManagment() {


  const [open, setOpen] = useState(true)
  const [showModal, setModal] = useState(false)
  const [modelType, setModelType] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean | null>(false)
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const pendingActionRef = useRef<(() => unknown | Promise<unknown>) | null>(null);

  // const [validateDataOnly, setValidateDataOnly] = useState(true);
  const [validationDone, setValidationDone] = useState(false);
  const [hasValidationErrors, sethasValidationError] = useState(false)
  const [parsedRows, setParsedRows] = useState<parseRow[]>([]);
  const [duplicateData, setDuplicateData] = useState(0);
  const [validRow, setValidRow] = useState(0);
  const [invalidRow, setInvalidRow] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [facultyList, setFacultyList] = useState<FacultyOption[]>([]);
  const [subjectList, setSubjectList] = useState<SubjectOption[]>([]);
  const [workload, setWorkload] = useState<{ totalLoad?: number; subjectAssignments?: number; classAssignments?: number } | null>(null);
  const [form, setForm] = useState({
    selectedFacultyUsername: "",
    selectedSubjectCode: "",
    semester: "1",
    toSemester: "2",
    section: "ALL",
    department: "CSE",
    batch: "2025-26",
    reason: "",
    academicYear: "2025-26",
    classCode: "",
    room: "",
    newDepartment: "CSE",
    availability: "Available",
    status: "active",
    subjectCode: "",
    subjectName: "",
    credits: "4",
    totalClasses: "40",
  });

  const STUDENT_OP_ROUTES: Record<string, string> = {
    "Freeze Semester": "/api/admin/academicManagment/freeze-semester",
    "Promote Semester": "/api/admin/academicManagment/promote-semester",
    "Activate Semester": "/api/admin/academicManagment/activate-semester",
  };

  const resetModalState = () => {
    setSelectedFile(null);
    setValidationDone(false);
    sethasValidationError(false);
    setParsedRows([]);
    setDuplicateData(0);
    setValidRow(0);
    setInvalidRow(0);
    setTotalRows(0);
    setWorkload(null);
  };

  const openOperationModal = (title: string) => {
    resetModalState();
    setModelType(title);
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
    resetModalState();
  };

  const requestConfirm = (message: string, action: () => unknown | Promise<unknown>) => {
    setConfirmMessage(message);
    pendingActionRef.current = action;
    setConfirmOpen(true);
  };

  const cancelConfirm = () => {
    setConfirmOpen(false);
    pendingActionRef.current = null;
  };

  const handleConfirm = async () => {
    const action = pendingActionRef.current;
    setConfirmOpen(false);
    pendingActionRef.current = null;
    if (action) await action();
  };

  const confirmOperation = (action: () => unknown | Promise<unknown>, customMessage?: string) => {
    requestConfirm(
      customMessage ||
        `Are you sure you want to proceed with "${modelType || "this operation"}"?`,
      action,
    );
  };

  const modalMeta = useMemo(() => {
    const allOps = [...studentOperations, ...facultyOperations, ...subjectOperations];
    return allOps.find((op) => op.title === modelType);
  }, [modelType]);

  useEffect(() => {
    if (!showModal) return;

    const fetchOptions = async () => {
      try {
        const [facultyRes, subjectRes] = await Promise.all([
          axios.get(API_ROUTES.FACULTY.LIST),
          axios.get(API_ROUTES.SUBJECT.LIST),
        ]);

        setFacultyList(facultyRes.data.data || []);
        setSubjectList(subjectRes.data.data || []);
      } catch (error) {
        console.error("Failed to load faculty/subject options", error);
      }
    };

    fetchOptions();
  }, [showModal]);

  const updateForm = (key: string, value: string) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "semester") {
        const current = Number(value);
        if (!Number.isNaN(current)) {
          next.toSemester = String(Math.min(8, current + 1));
        }
      }
      return next;
    });
  };

  const getBulkConfig = () => bulkUploadConfig[modelType];


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
  const handleImportofBulkStudents = async (e?: React.FormEvent) => {
    try {

      e?.preventDefault();
      if (!selectedFile) {
        console.log("Error in File");
        toast.error("Please select a file first");
        return;
      }

      const config = getBulkConfig();
      if (!config) {
        toast.error("Bulk upload config not found");
        return;
      }

      const formData = new FormData();
      formData.append("file", selectedFile)

      const res = await axios.post(config.import, formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      )

      toast.success(res.data.message || "Records imported successfully!");
      closeModal();
    } catch (error: any) {
      console.error("Error in Uploading the File. Please review the File and Upload again")
      toast.error(error.response?.data?.message || "Something went wrong while Uploading the File")
    } finally {
      setLoading(false);
    }
  }

  const handleDownloadofTemplate = async () => {
    try {

      const config = getBulkConfig();
      if (!config) {
        toast.error("Template not available for this operation");
        return;
      }

      const response = await axios.get(config.template, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(response.data);

      const link = document.createElement("a");

      link.href = url;
      link.download = config.filename;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

    } catch (err: any) {
      console.log("Error in Downloading the Template", err);
      toast.error("Error downloading template");
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
    if (!selectedFile) return toast.error("Please pick a file first!");

    const config = getBulkConfig();
    if (!config) {
      toast.error("Validation not available for this operation");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await axios.post(
        config.validate,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      )

      if (res.data.success === false || res.data.hasConflicts) {
        sethasValidationError(true);
        toast.error(res.data.message || "Validation failed! Duplicate entries found.");
      } else {
        sethasValidationError(false);
        setParsedRows(res.data.data || []);
        setInvalidRow(0);
        setDuplicateData(0)
        setTotalRows(res.data.totalRows)
        setValidRow(res.data.finalVRow ?? res.data.validData ?? 0)
        toast.success("File analyzed! No duplicates found.");
      }

      setValidationDone(true);
    } catch (error: any) {
      sethasValidationError(true);
      setValidationDone(true);

      const errData = error.response?.data;
      if (errData) {
        setInvalidRow(errData.invalidRows?.length ?? 0);
        setDuplicateData(errData.duplicateRows ?? 0)
        setTotalRows(errData.totalRows ?? 0)
        setValidRow(errData.finalVRow ?? 0)
        setParsedRows(errData.invalidRows ?? [])
      }
    } finally {
      setLoading(false);
    }
  }

  const submitFacultyOperation = async (endpoint: string, payload: Record<string, unknown>, successMsg: string) => {
    try {
      setLoading(true);
      const res = await axios.post(endpoint, payload);
      toast.success(res.data.message || successMsg);
      closeModal();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const patchFacultyOperation = async (endpoint: string, payload: Record<string, unknown>, successMsg: string) => {
    try {
      setLoading(true);
      const res = await axios.patch(endpoint, payload);
      toast.success(res.data.message || successMsg);
      closeModal();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const patchSubjectOperation = async (endpoint: string, payload: Record<string, unknown>, successMsg: string) => {
    try {
      setLoading(true);
      const res = await axios.patch(endpoint, payload);
      toast.success(res.data.message || successMsg);
      closeModal();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const postSubjectOperation = async (endpoint: string, payload: Record<string, unknown>, successMsg: string) => {
    try {
      setLoading(true);
      const res = await axios.post(endpoint, payload);
      toast.success(res.data.message || successMsg);
      closeModal();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const submitStudentSemesterOperation = async () => {
    const endpoint = STUDENT_OP_ROUTES[modelType];
    if (!endpoint) {
      toast.error("Operation route not configured");
      return;
    }
    if (!form.semester || !form.section || !form.department || !form.batch) {
      toast.error("Semester, section, department and batch are required");
      return;
    }
    try {
      setLoading(true);
      const payload: Record<string, unknown> = {
        semester: Number(form.semester),
        section: form.section,
        department: form.department,
        batch: form.batch,
      };
      if (modelType === "Freeze Semester" && form.reason.trim()) {
        payload.reason = form.reason.trim();
      }
      const res = await axios.post(endpoint, payload);
      toast.success(res.data.message || `${modelType} completed`);
      closeModal();
    } catch (error: any) {
      toast.error(error.response?.data?.message || `${modelType} failed`);
    } finally {
      setLoading(false);
    }
  };

  const fetchFacultyWorkload = async () => {
    if (!form.selectedFacultyUsername) return toast.error("Select a faculty member first");
    try {
      setLoading(true);
      const res = await axios.get(`${API_ROUTES.FACULTY.WORKLOAD}?facultyUsername=${encodeURIComponent(form.selectedFacultyUsername)}`);
      setWorkload(res.data.data);
      toast.success("Workload loaded");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load workload");
    } finally {
      setLoading(false);
    }
  };


  const academicStats = [
    { label: "Student Operations", value: String(studentOperations.length), hint: "Enrollment & promotion", color: "bg-indigo-100 text-indigo-600" },
    { label: "Faculty Operations", value: String(facultyOperations.length), hint: "Assignments & status", color: "bg-emerald-100 text-emerald-600" },
    { label: "Subject Operations", value: String(subjectOperations.length), hint: "Curriculum management", color: "bg-violet-100 text-violet-600" },
    { label: "Bulk Uploads", value: "3", hint: "Batch import tools", color: "bg-cyan-100 text-cyan-600" },
  ];

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-linear-to-br from-slate-50 via-white to-slate-50 flex flex-col lg:flex-row">
      <Bar open={open} setOpen={setOpen} />

      <div className="flex-1 min-w-0 w-full">
        <div className="overflow-hidden bg-white p-5 text-slate-900 shadow-sm sm:p-6 md:p-7 lg:p-6">
          <div className="border-b border-slate-200 pb-6 sm:pb-8">
            <h1 className="text-2xl font-bold font-comfortaa text-slate-900 sm:text-3xl">Academic Management</h1>
            <p className="mt-1 text-sm text-slate-600">
              Manage academic operations, bulk uploads, and institutional settings
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {academicStats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{stat.label}</p>
                    <h3 className="mt-2 text-2xl font-bold text-slate-900">{stat.value}</h3>
                    <p className="mt-1 text-xs text-slate-500">{stat.hint}</p>
                  </div>
                  <span className={`rounded-xl p-2.5 ${stat.color}`}>
                    <School size={20} />
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-bold text-slate-900">Operations Center</h2>
            <p className="mt-1 text-sm text-slate-500">Select an operation to manage students, faculty, or subjects</p>
          </div>

        <div className='mt-6'>
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-4">


            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-indigo-100 text-indigo-600 p-2 rounded-xl">
                  <User2Icon size={22} />
                </span>

                <div>
                  <h3 className="text-slate-900 font-bold text-lg">
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
                    className="w-full flex items-center justify-between rounded-xl border border-slate-200 p-3 transition hover:bg-slate-50 cursor-pointer"

                    onClick={() => openOperationModal(item.title)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="bg-indigo-100 text-indigo-600 p-2 rounded-lg">

                        {item.icon}
                      </span>

                      <p className="text-sm font-medium text-slate-900">
                        {item.title}
                      </p>
                    </div>


                    <ArrowRight size={16} className="text-slate-500" />
                  </button>
                ))}

              </div>
            </div>




            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-emerald-100 text-emerald-600 p-2 rounded-xl">
                  <BriefcaseBusiness size={22} />
                </span>

                <div>
                  <h3 className="text-slate-900 font-bold text-lg">
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
                    className="w-full flex items-center justify-between rounded-xl border border-slate-200 p-3 transition hover:bg-slate-50 cursor-pointer"
                    onClick={() => openOperationModal(item.title)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="bg-emerald-100 text-emerald-600 p-2 rounded-lg">
                        {item.icon}
                      </span>

                      <p className="text-sm font-medium text-slate-900">
                        {item.title}
                      </p>
                    </div>

                    <ArrowRight size={16} className="text-slate-500" />
                  </button>
                ))}

              </div>
            </div>




            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-violet-100 text-violet-600 p-2 rounded-xl">
                  <BookOpenCheck size={22} />
                </span>

                <div>
                  <h3 className="text-slate-900 font-bold text-lg">
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
                    className="w-full flex items-center justify-between rounded-xl border border-slate-200 p-3 transition hover:bg-slate-50 cursor-pointer"
                    onClick={() => openOperationModal(item.title)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="bg-violet-100 text-violet-600 p-2 rounded-lg">
                        {item.icon}
                      </span>

                      <p className="text-sm font-medium text-slate-900">
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
      </div>

      <AdminModal
        open={showModal}
        onClose={closeModal}
        title={modelType || "Academic Operation"}
        description="Complete the required fields to continue this academic operation."
        icon={modalMeta?.icon ?? <SquareTerminal size={20} />}
      >
              {(modelType === "Freeze Semester" ||
                modelType === "Promote Semester" ||
                modelType === "Activate Semester" ||
                modelType === "Passout Student") && (
                <>
                  <div className={adminFormGridClass}>
                    <div>
                      <label className={adminLabelClass}>
                        {modelType === "Promote Semester" ? "From Semester" : "Semester"}
                      </label>
                      <select
                        className={adminFieldClass}
                        value={form.semester}
                        onChange={(e) => updateForm("semester", e.target.value)}
                      >
                        {(modelType === "Passout Student" ? [8] : [1, 2, 3, 4, 5, 6, 7, 8]).map((n) => (
                          <option key={n} value={String(n)}>{n}</option>
                        ))}
                      </select>
                    </div>

                    {modelType === "Promote Semester" && (
                      <div>
                        <label className={adminLabelClass}>Promote to Semester</label>
                        <select
                          className={adminFieldClass}
                          value={form.toSemester}
                          onChange={(e) => updateForm("toSemester", e.target.value)}
                          disabled
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                            <option key={n} value={String(n)}>{n}</option>
                          ))}
                        </select>
                        <p className="mt-1 text-xs text-slate-500">Students move to the next semester automatically.</p>
                      </div>
                    )}

                    <div>
                      <label className={adminLabelClass}>Section</label>
                      <select
                        className={adminFieldClass}
                        value={form.section}
                        onChange={(e) => updateForm("section", e.target.value)}
                      >
                        {["ALL", "A", "B", "C", "D", "E"].map((s) => (
                          <option key={s} value={s}>{s === "ALL" ? "All" : s}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={adminLabelClass}>Department</label>
                      <select
                        className={adminFieldClass}
                        value={form.department}
                        onChange={(e) => updateForm("department", e.target.value)}
                      >
                        {DEPARTMENTS.map((d) => (
                          <option key={d.value} value={d.value}>{d.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={adminLabelClass}>Batch</label>
                      <select
                        className={adminFieldClass}
                        value={form.batch}
                        onChange={(e) => updateForm("batch", e.target.value)}
                      >
                        {["2026-27", "2025-26", "2024-25", "2023-24"].map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>

                    {modelType === "Freeze Semester" && (
                      <div className="lg:col-span-2">
                        <label className={adminLabelClass}>Reason for Freezing</label>
                        <textarea
                          rows={3}
                          className={`${adminFieldClass} resize-none`}
                          value={form.reason}
                          onChange={(e) => updateForm("reason", e.target.value)}
                          placeholder="Optional reason for freezing this semester group"
                        />
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    className={`${adminPrimaryBtnClass} mt-6`}
                    onClick={() => {
                      if (modelType === "Passout Student") {
                        confirmOperation(() =>
                          toast.success("Passout flow coming soon (connect API when ready)"),
                        );
                        return;
                      }
                      if (modelType === "Promote Semester") {
                        const next = String(Math.min(8, Number(form.semester) + 1));
                        updateForm("toSemester", next);
                      }
                      confirmOperation(submitStudentSemesterOperation);
                    }}
                  >
                    <Send size={18} />
                    Submit
                  </button>
                </>
              )}

              {modelType === "Assign Faculty To Subject" && (
                <>
                  <div className={adminFormGridClass}>
                    <div>
                      <label className={adminLabelClass}>Faculty</label>
                      <select className={adminFieldClass} value={form.selectedFacultyUsername} onChange={(e) => updateForm("selectedFacultyUsername", e.target.value)}>
                        <option value="">Select faculty</option>
                        {facultyList.map((f) => (
                          <option key={f.username} value={f.username}>{f.username || "Unknown faculty"}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={adminLabelClass}>Subject</label>
                      <select className={adminFieldClass} value={form.selectedSubjectCode} onChange={(e) => updateForm("selectedSubjectCode", e.target.value)}>
                        <option value="">Select subject</option>
                        {subjectList.map((s) => (
                          <option key={s.subjectCode} value={s.subjectCode}>{s.subjectCode} — {s.subjectName}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={adminLabelClass}>Semester</label>
                      <select className={adminFieldClass} value={form.semester} onChange={(e) => updateForm("semester", e.target.value)}>
                        {[1,2,3,4,5,6,7,8].map((n) => <option key={n} value={String(n)}>{n}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={adminLabelClass}>Section</label>
                      <select className={adminFieldClass} value={form.section} onChange={(e) => updateForm("section", e.target.value)}>
                        {["ALL","A","B","C","D","E"].map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={adminLabelClass}>Department</label>
                      <select className={adminFieldClass} value={form.department} onChange={(e) => updateForm("department", e.target.value)}>
                        {DEPARTMENTS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={adminLabelClass}>Academic Year</label>
                      <input className={adminFieldClass} value={form.academicYear} onChange={(e) => updateForm("academicYear", e.target.value)} placeholder="2025-26" />
                    </div>
                  </div>
                  <button className={`${adminPrimaryBtnClass} mt-6`} onClick={() => confirmOperation(() => submitFacultyOperation(API_ROUTES.FACULTY.ASSIGN_SUBJECT, {
                      facultyUsername: form.selectedFacultyUsername,
                      subjectCode: form.selectedSubjectCode,
                      semester: form.semester,
                      section: form.section,
                      department: form.department,
                      academicYear: form.academicYear,
                    }, "Faculty assigned to subject"))}>
                    <Send size={18} /> Submit
                  </button>
                </>
              )}

              {modelType === "Assign Faculty To Class" && (
                <>
                  <div className={adminFormGridClass}>
                    <div>
                      <label className={adminLabelClass}>Faculty</label>
                      <select className={adminFieldClass} value={form.selectedFacultyUsername} onChange={(e) => updateForm("selectedFacultyUsername", e.target.value)}>
                        <option value="">Select faculty</option>
                        {facultyList.map((f) => (
                          <option key={f.username} value={f.username}>{f.username || "Unknown faculty"}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={adminLabelClass}>Subject</label>
                      <select className={adminFieldClass} value={form.selectedSubjectCode} onChange={(e) => updateForm("selectedSubjectCode", e.target.value)}>
                        <option value="">Select subject</option>
                        {subjectList.map((s) => (
                          <option key={s.subjectCode} value={s.subjectCode}>{s.subjectCode} — {s.subjectName}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={adminLabelClass}>Subject Code</label>
                      <input className={adminFieldClass} value={form.subjectCode} onChange={(e) => updateForm("subjectCode", e.target.value)} placeholder="CSE301-A" />
                    </div>
                    <div>
                      <label className={adminLabelClass}>Room</label>
                      <input className={adminFieldClass} value={form.room} onChange={(e) => updateForm("room", e.target.value)} placeholder="Lab 201" />
                    </div>
                  </div>
                  <button className={`${adminPrimaryBtnClass} mt-6`} onClick={() => confirmOperation(() => submitFacultyOperation(API_ROUTES.FACULTY.ASSIGN_CLASS, {
                      facultyUsername: form.selectedFacultyUsername,
                      subjectCode: form.selectedSubjectCode,
                      classCode: form.classCode,
                      room: form.room,
                    }, "Faculty assigned to class"))}>
                    <Send size={18} /> Submit
                  </button>
                </>
              )}

              {modelType === "Transfer Department" && (
                <>
                  <div className={adminFormGridClass}>
                    <div>
                      <label className={adminLabelClass}>Faculty</label>
                      <select className={adminFieldClass} value={form.selectedFacultyUsername} onChange={(e) => updateForm("selectedFacultyUsername", e.target.value)}>
                        <option value="">Select faculty</option>
                        {facultyList.map((f) => (
                          <option key={f.username} value={f.username}>{f.username || "Unknown faculty"}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={adminLabelClass}>New Department</label>
                      <select className={adminFieldClass} value={form.newDepartment} onChange={(e) => updateForm("newDepartment", e.target.value)}>
                        {DEPARTMENTS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
                      </select>
                    </div>
                  </div>
                  <button className={`${adminPrimaryBtnClass} mt-6`} onClick={() => confirmOperation(() => submitFacultyOperation(API_ROUTES.FACULTY.TRANSFER_DEPARTMENT, { facultyUsername: form.selectedFacultyUsername, newDepartment: form.newDepartment }, "Department transferred"))}>
                    <Send size={18} /> Submit
                  </button>
                </>
              )}

              {modelType === "Faculty Workload" && (
                <>
                  <div>
                    <label className={adminLabelClass}>Faculty</label>
                    <select className={adminFieldClass} value={form.selectedFacultyUsername} onChange={(e) => updateForm("selectedFacultyUsername", e.target.value)}>
                      <option value="">Select faculty</option>
                      {facultyList.map((f) => (
                        <option key={f.username} value={f.username}>{f.username || "Unknown faculty"}</option>
                      ))}
                    </select>
                  </div>
                  <button className={`${adminPrimaryBtnClass} mt-6`} onClick={() => confirmOperation(fetchFacultyWorkload, `Load workload for selected faculty?`)}>
                    <BriefcaseBusiness size={18} /> Load Workload
                  </button>
                  {workload && (
                    <div className="mt-4 grid grid-cols-3 gap-3">
                      <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-center">
                        <p className="text-xs text-slate-500">Subject load</p>
                        <h3 className="text-2xl font-bold text-indigo-700">{workload.subjectAssignments}</h3>
                      </div>
                      <div className="rounded-xl border border-violet-200 bg-violet-50 p-4 text-center">
                        <p className="text-xs text-slate-500">Class load</p>
                        <h3 className="text-2xl font-bold text-violet-700">{workload.classAssignments}</h3>
                      </div>
                      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center">
                        <p className="text-xs text-slate-500">Total</p>
                        <h3 className="text-2xl font-bold text-emerald-700">{workload.totalLoad}</h3>
                      </div>
                    </div>
                  )}
                </>
              )}

              {modelType === "Faculty Availability" && (
                <>
                  <div className={adminFormGridClass}>
                    <div>
                      <label className={adminLabelClass}>Faculty</label>
                      <select className={adminFieldClass} value={form.selectedFacultyUsername} onChange={(e) => updateForm("selectedFacultyUsername", e.target.value)}>
                        <option value="">Select faculty</option>
                        {facultyList.map((f) => (
                          <option key={f.username} value={f.username}>{f.username || "Unknown faculty"}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={adminLabelClass}>Availability</label>
                      <select className={adminFieldClass} value={form.availability} onChange={(e) => updateForm("availability", e.target.value)}>
                        <option value="Available">Available</option>
                        <option value="Unavailable">Unavailable</option>
                        <option value="On Leave">On Leave</option>
                      </select>
                    </div>
                  </div>
                  <button className={`${adminPrimaryBtnClass} mt-6`} onClick={() => confirmOperation(() => submitFacultyOperation(API_ROUTES.FACULTY.AVAILABILITY, { facultyUsername: form.selectedFacultyUsername, availability: form.availability }, "Availability updated"))}>
                    <Send size={18} /> Submit
                  </button>
                </>
              )}

              {modelType === "Faculty Status Update" && (
                <>
                  <div className={adminFormGridClass}>
                    <div>
                      <label className={adminLabelClass}>Faculty</label>
                      <select className={adminFieldClass} value={form.selectedFacultyUsername} onChange={(e) => updateForm("selectedFacultyUsername", e.target.value)}>
                        <option value="">Select faculty</option>
                        {facultyList.map((f) => (
                          <option key={f.username} value={f.username}>{f.username || "Unknown faculty"}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={adminLabelClass}>Status</label>
                      <select className={adminFieldClass} value={form.status} onChange={(e) => updateForm("status", e.target.value)}>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="on leave">On Leave</option>
                      </select>
                    </div>
                  </div>
                  <button className={`${adminPrimaryBtnClass} mt-6`} onClick={() => confirmOperation(() => patchFacultyOperation(API_ROUTES.FACULTY.STATUS, { facultyUsername: form.selectedFacultyUsername, status: form.status }, "Faculty status updated"))}>
                    <Send size={18} /> Submit
                  </button>
                </>
              )}

              {modelType === "Add Subject" && (
                <>
                  <div className={adminFormGridClass}>
                    <div>
                      <label className={adminLabelClass}>Subject Code</label>
                      <input className={adminFieldClass} value={form.subjectCode} onChange={(e) => updateForm("subjectCode", e.target.value)} />
                    </div>
                    <div>
                      <label className={adminLabelClass}>Subject Name</label>
                      <input className={adminFieldClass} value={form.subjectName} onChange={(e) => updateForm("subjectName", e.target.value)} />
                    </div>
                    <div>
                      <label className={adminLabelClass}>Credits</label>
                      <input type="number" className={adminFieldClass} value={form.credits} onChange={(e) => updateForm("credits", e.target.value)} />
                    </div>
                    <div>
                      <label className={adminLabelClass}>Semester</label>
                      <select className={adminFieldClass} value={form.semester} onChange={(e) => updateForm("semester", e.target.value)}>
                        {[1,2,3,4,5,6,7,8].map((n) => <option key={n} value={String(n)}>{n}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={adminLabelClass}>Department</label>
                      <select className={adminFieldClass} value={form.department} onChange={(e) => updateForm("department", e.target.value)}>
                        {DEPARTMENTS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={adminLabelClass}>Total Classes</label>
                      <input type="number" className={adminFieldClass} value={form.totalClasses} onChange={(e) => updateForm("totalClasses", e.target.value)} />
                    </div>
                  </div>
                  <button className={`${adminPrimaryBtnClass} mt-6`} onClick={() => confirmOperation(() => postSubjectOperation(API_ROUTES.SUBJECT.LIST, form, "Subject added"))}>
                    <Send size={18} /> Submit
                  </button>
                </>
              )}

              {(modelType === "Update Subject" || modelType === "Assign To Semester" || modelType === "Assign To Department" || modelType === "Activate Subject") && (
                <>
                  <div className={adminFormGridClass}>
                    <div className="lg:col-span-2">
                      <label className={adminLabelClass}>Subject</label>
                      <select className={adminFieldClass} value={form.selectedSubjectCode} onChange={(e) => updateForm("selectedSubjectCode", e.target.value)}>
                        <option value="">Select subject</option>
                        {subjectList.map((s) => (
                          <option key={s.subjectCode} value={s.subjectCode}>{s.subjectCode} — {s.subjectName}</option>
                        ))}
                      </select>
                    </div>

                    {modelType === "Update Subject" && (
                      <>
                        <div>
                          <label className={adminLabelClass}>Subject Code</label>
                          <input className={adminFieldClass} value={form.subjectCode} onChange={(e) => updateForm("subjectCode", e.target.value)} placeholder='Enter Subject Code' />
                        </div>
                        <div>
                          <label className={adminLabelClass}>Subject Name</label>
                          <input className={adminFieldClass} value={form.subjectName} onChange={(e) => updateForm("subjectName", e.target.value)} placeholder='Enter Subject Name' />
                        </div>
                        <div>
                          <label className={adminLabelClass}>Credits</label>
                          <input type="number" className={adminFieldClass} value={form.credits} onChange={(e) => updateForm("credits", e.target.value)} placeholder='Enter Credits' />
                        </div>
                        <div>
                          <label className={adminLabelClass}>Total Classes</label>
                          <input type="number" className={adminFieldClass} value={form.totalClasses} onChange={(e) => updateForm("totalClasses", e.target.value)} placeholder='Enter Subject Name' />
                        </div>
                      </>
                    )}

                    {modelType === "Assign To Semester" && (
                      <>
                      <div>
                        <div>
                          <label className={adminLabelClass}>Subject Code</label>
                          <input className={adminFieldClass} value={form.subjectCode} onChange={(e) => updateForm("subjectCode", e.target.value)} placeholder='Enter Subject Code' />
                        </div>
                      </div>
                      <div>
                        <label className={adminLabelClass}>Semester</label>
                        <select className={adminFieldClass} value={form.semester} onChange={(e) => updateForm("semester", e.target.value)}>
                          {[1,2,3,4,5,6,7,8].map((n) => <option key={n} value={String(n)}>{n}</option>)}
                        </select>
                      </div>
                      
                      </>
                    )}

                    {modelType === "Assign To Department" && (
                      <div>
                        <label className={adminLabelClass}>Department</label>
                        <select className={adminFieldClass} value={form.department} onChange={(e) => updateForm("department", e.target.value)}>
                          {DEPARTMENTS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
                        </select>
                      </div>
                    )}

                    {modelType === "Activate Subject" && (
                      <div>
                        <label className={adminLabelClass}>Status</label>
                        <select className={adminFieldClass} value={form.status} onChange={(e) => updateForm("status", e.target.value)}>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <button
                    className={`${adminPrimaryBtnClass} mt-6`}
                    onClick={() => confirmOperation(() => {
                      if (modelType === "Update Subject") {
                        return patchSubjectOperation(API_ROUTES.SUBJECT.UPDATE, {
                          subjectCode: form.selectedSubjectCode,
                          newSubjectCode: form.subjectCode,
                          subjectName: form.subjectName,
                          credits: form.credits,
                          semester: form.semester,
                          department: form.department,
                          totalClasses: form.totalClasses,
                        }, "Subject updated");
                      } else if (modelType === "Assign To Semester") {
                        return patchSubjectOperation(API_ROUTES.SUBJECT.ASSIGN_SEMESTER, { subjectCode: form.selectedSubjectCode, semester: form.semester }, "Semester assigned");
                      } else if (modelType === "Assign To Department") {
                        return patchSubjectOperation(API_ROUTES.SUBJECT.ASSIGN_DEPARTMENT, { subjectCode: form.selectedSubjectCode, department: form.department }, "Department assigned");
                      } else {
                        return patchSubjectOperation(API_ROUTES.SUBJECT.ACTIVATE, { subjectCode: form.selectedSubjectCode, status: form.status }, "Subject status updated");
                      }
                    })}
                  >
                    <Send size={18} /> Submit
                  </button>
                </>
              )}

              {
                bulkUploadConfig[modelType] && (
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

                      <button className="w-full py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition-all cursor-pointer" onClick={closeModal}>
                        Cancel
                      </button>

                      <button className={`w-full flex justify-center items-center gap-2 py-2.5 text-sm  bg-indigo-600 rounded-xl font-bold text-white hover:bg-indigo-700 transition-all duration-300 cursor-pointer  ${loading || !validationDone || hasValidationErrors
                        ? "bg-slate-200 text-slate-400 cursor-not-allowed opacity-70" // ❌ Locked style (Grayed out)
                        : "bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer shadow-sm shadow-indigo-100" // ✅ Active style (Indigo)
                        }`} onClick={() => confirmOperation(() => handleImportofBulkStudents(), `Import validated records for "${modelType}"?`)} disabled={loading || !validationDone || hasValidationErrors}>
                        <Send size={18} />
                        Import Records
                      </button>

                    </div>
                  </>
                )
              }
      </AdminModal>

      <AdminModal
        open={confirmOpen}
        onClose={cancelConfirm}
        title="Confirm Operation"
        description={confirmMessage}
        icon={<AlertTriangle size={20} />}
        maxWidthClassName="max-w-md"
        zIndexClassName="z-[60]"
        footer={
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button type="button" onClick={cancelConfirm} className={adminSecondaryBtnClass}>
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white shadow-sm shadow-red-600/20 transition hover:bg-red-700 active:scale-[0.99]"
            >
              Yes, Confirm
            </button>
          </div>
        }
      >
        <p className="text-sm leading-relaxed text-slate-600">
          This will update academic records. Please review the details before confirming.
        </p>
      </AdminModal>
    </div>
  )
}

export default academicManagment
