export type PerformanceLevel = "poor" | "warning" | "good" | "none";

export type SemesterPerformance = {
  semester: number;
  students: number;
  subjects: number;
  passRate: number;
  avgCgpa: number;
  failed: number;
  hasResults?: boolean;
};

export type SubjectPerformance = {
  name: string;
  code: string;
  passRate: number;
  avgMarks: number;
  students: number;
  failed: number;
  faculty: string;
  facultyEmail: string;
  hasResults?: boolean;
};

export type DepartmentOverview = {
  code: string;
  name: string;
  passRate: number;
  avgCgpa: number;
  totalPassed: number;
  totalFailed: number;
  students: number;
  weakSemesters: number;
  hod: string;
};

const POOR_THRESHOLD = 70;
const WARNING_THRESHOLD = 80;

export function getPerformanceLevel(
  passRate: number,
  hasResults = true,
): PerformanceLevel {
  if (!hasResults) return "none";
  if (passRate < POOR_THRESHOLD) return "poor";
  if (passRate < WARNING_THRESHOLD) return "warning";
  return "good";
}

export function performanceRowClass(level: PerformanceLevel) {
  const map: Record<PerformanceLevel, string> = {
    poor: "bg-red-50/80 border-l-[3px] border-l-red-500 hover:bg-red-50",
    warning: "bg-amber-50/70 border-l-[3px] border-l-amber-500 hover:bg-amber-50",
    good: "bg-white border-l-[3px] border-l-emerald-400 hover:bg-slate-50/80",
    none: "bg-white border-l-[3px] border-l-slate-200 hover:bg-slate-50/80",
  };
  return map[level];
}

export function performanceBadgeClass(level: PerformanceLevel) {
  const map: Record<PerformanceLevel, string> = {
    poor: "bg-red-100 text-red-800 ring-1 ring-red-600/15",
    warning: "bg-amber-100 text-amber-800 ring-1 ring-amber-600/15",
    good: "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-600/15",
    none: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
  };
  return map[level];
}

export function performanceLabel(level: PerformanceLevel) {
  const map: Record<PerformanceLevel, string> = {
    poor: "Poor",
    warning: "Needs Attention",
    good: "Healthy",
    none: "No Results",
  };
  return map[level];
}

export function performanceNameClass(level: PerformanceLevel) {
  const map: Record<PerformanceLevel, string> = {
    poor: "text-red-700",
    warning: "text-amber-800",
    good: "text-slate-900",
    none: "text-slate-500",
  };
  return map[level];
}

const DEPARTMENT_OVERVIEWS: Record<string, DepartmentOverview> = {
  AE: {
    code: "AE",
    name: "Aerospace Engineering",
    passRate: 74.8,
    avgCgpa: 7.12,
    totalPassed: 186,
    totalFailed: 63,
    students: 249,
    weakSemesters: 3,
    hod: "Dr. Meera Krishnan",
  },
  CSE: {
    code: "CSE",
    name: "Computer Science & Engineering",
    passRate: 92.1,
    avgCgpa: 8.64,
    totalPassed: 520,
    totalFailed: 45,
    students: 565,
    weakSemesters: 0,
    hod: "Dr. Rajesh Sharma",
  },
  ME: {
    code: "ME",
    name: "Mechanical Engineering",
    passRate: 81.3,
    avgCgpa: 7.85,
    totalPassed: 310,
    totalFailed: 71,
    students: 381,
    weakSemesters: 1,
    hod: "Dr. Anil Kapoor",
  },
  CE: {
    code: "CE",
    name: "Civil Engineering",
    passRate: 79.6,
    avgCgpa: 7.54,
    totalPassed: 268,
    totalFailed: 69,
    students: 337,
    weakSemesters: 2,
    hod: "Dr. Sunita Rao",
  },
};

const SEMESTERS_BY_DEPT: Record<string, SemesterPerformance[]> = {
  AE: [
    { semester: 1, students: 32, subjects: 6, passRate: 82.4, avgCgpa: 7.6, failed: 6 },
    { semester: 2, students: 30, subjects: 6, passRate: 78.1, avgCgpa: 7.3, failed: 7 },
    { semester: 3, students: 31, subjects: 6, passRate: 68.2, avgCgpa: 6.8, failed: 10 },
    { semester: 4, students: 29, subjects: 6, passRate: 71.5, avgCgpa: 7.0, failed: 8 },
    { semester: 5, students: 33, subjects: 6, passRate: 64.9, avgCgpa: 6.5, failed: 12 },
    { semester: 6, students: 31, subjects: 6, passRate: 76.8, avgCgpa: 7.2, failed: 7 },
    { semester: 7, students: 32, subjects: 5, passRate: 69.4, avgCgpa: 6.9, failed: 10 },
    { semester: 8, students: 31, subjects: 4, passRate: 85.2, avgCgpa: 7.8, failed: 5 },
  ],
  CSE: [
    { semester: 1, students: 70, subjects: 6, passRate: 91.2, avgCgpa: 8.4, failed: 6 },
    { semester: 2, students: 72, subjects: 6, passRate: 90.5, avgCgpa: 8.3, failed: 7 },
    { semester: 3, students: 68, subjects: 6, passRate: 93.1, avgCgpa: 8.7, failed: 5 },
    { semester: 4, students: 71, subjects: 6, passRate: 92.8, avgCgpa: 8.6, failed: 5 },
    { semester: 5, students: 69, subjects: 6, passRate: 89.4, avgCgpa: 8.2, failed: 7 },
    { semester: 6, students: 70, subjects: 6, passRate: 94.0, avgCgpa: 8.9, failed: 4 },
    { semester: 7, students: 72, subjects: 5, passRate: 91.7, avgCgpa: 8.5, failed: 6 },
    { semester: 8, students: 73, subjects: 4, passRate: 95.2, avgCgpa: 9.0, failed: 4 },
  ],
};

const SUBJECTS_BY_DEPT_SEM: Record<string, Record<string, SubjectPerformance[]>> = {
  AE: {
    "3": [
      { name: "Aerodynamics I", code: "AE301", passRate: 61.3, avgMarks: 48, students: 31, failed: 12, faculty: "Dr. Vikram Nair", facultyEmail: "vikram.nair@college.edu" },
      { name: "Aircraft Structures", code: "AE302", passRate: 66.8, avgMarks: 52, students: 31, failed: 10, faculty: "Prof. Anita Bose", facultyEmail: "anita.bose@college.edu" },
      { name: "Fluid Mechanics", code: "AE303", passRate: 72.4, avgMarks: 58, students: 31, failed: 9, faculty: "Dr. Rohan Das", facultyEmail: "rohan.das@college.edu" },
      { name: "Thermodynamics", code: "AE304", passRate: 78.9, avgMarks: 64, students: 31, failed: 7, faculty: "Dr. Kavita Menon", facultyEmail: "kavita.menon@college.edu" },
      { name: "Engineering Mathematics III", code: "AE305", passRate: 81.2, avgMarks: 67, students: 31, failed: 6, faculty: "Prof. Suresh Iyer", facultyEmail: "suresh.iyer@college.edu" },
      { name: "Material Science", code: "AE306", passRate: 74.1, avgMarks: 60, students: 31, failed: 8, faculty: "Dr. Neha Pillai", facultyEmail: "neha.pillai@college.edu" },
    ],
    "5": [
      { name: "Flight Dynamics", code: "AE501", passRate: 58.7, avgMarks: 45, students: 33, failed: 14, faculty: "Dr. Vikram Nair", facultyEmail: "vikram.nair@college.edu" },
      { name: "Propulsion Systems", code: "AE502", passRate: 63.2, avgMarks: 49, students: 33, failed: 12, faculty: "Prof. Anita Bose", facultyEmail: "anita.bose@college.edu" },
      { name: "Control Systems", code: "AE503", passRate: 69.1, avgMarks: 54, students: 33, failed: 10, faculty: "Dr. Arjun Sethi", facultyEmail: "arjun.sethi@college.edu" },
      { name: "Aircraft Design", code: "AE504", passRate: 71.8, avgMarks: 57, students: 33, failed: 9, faculty: "Dr. Kavita Menon", facultyEmail: "kavita.menon@college.edu" },
      { name: "Composite Materials", code: "AE505", passRate: 76.4, avgMarks: 62, students: 33, failed: 8, faculty: "Dr. Neha Pillai", facultyEmail: "neha.pillai@college.edu" },
      { name: "Avionics Basics", code: "AE506", passRate: 80.5, avgMarks: 66, students: 33, failed: 6, faculty: "Prof. Suresh Iyer", facultyEmail: "suresh.iyer@college.edu" },
    ],
    "7": [
      { name: "Computational Fluid Dynamics", code: "AE701", passRate: 62.5, avgMarks: 47, students: 32, failed: 12, faculty: "Dr. Rohan Das", facultyEmail: "rohan.das@college.edu" },
      { name: "Space Flight Mechanics", code: "AE702", passRate: 67.8, avgMarks: 53, students: 32, failed: 10, faculty: "Dr. Vikram Nair", facultyEmail: "vikram.nair@college.edu" },
      { name: "Rocket Propulsion", code: "AE703", passRate: 70.2, avgMarks: 55, students: 32, failed: 10, faculty: "Prof. Anita Bose", facultyEmail: "anita.bose@college.edu" },
      { name: "Aircraft Stability", code: "AE704", passRate: 75.6, avgMarks: 61, students: 32, failed: 8, faculty: "Dr. Arjun Sethi", facultyEmail: "arjun.sethi@college.edu" },
      { name: "Project Phase I", code: "AE705", passRate: 88.4, avgMarks: 72, students: 32, failed: 4, faculty: "Dr. Meera Krishnan", facultyEmail: "meera.krishnan@college.edu" },
    ],
  },
  CSE: {
    "3": [
      { name: "Data Structures", code: "CSE201", passRate: 91.2, avgMarks: 74, students: 68, failed: 6, faculty: "Dr. Ajitesh Kumar", facultyEmail: "ajitesh.kumar@college.edu" },
      { name: "Database Management Systems", code: "CSE301", passRate: 88.5, avgMarks: 71, students: 68, failed: 8, faculty: "Dr. Priya Sharma", facultyEmail: "priya.sharma@college.edu" },
      { name: "Operating Systems", code: "CSE302", passRate: 90.1, avgMarks: 73, students: 68, failed: 7, faculty: "Dr. Vikram Rao", facultyEmail: "vikram.rao@college.edu" },
      { name: "Discrete Mathematics", code: "CSE203", passRate: 86.4, avgMarks: 69, students: 68, failed: 9, faculty: "Prof. Neha Gupta", facultyEmail: "neha.gupta@college.edu" },
      { name: "Digital Logic", code: "CSE204", passRate: 93.8, avgMarks: 76, students: 68, failed: 4, faculty: "Dr. Amit Verma", facultyEmail: "amit.verma@college.edu" },
      { name: "Object Oriented Programming", code: "CSE205", passRate: 94.2, avgMarks: 78, students: 68, failed: 4, faculty: "Dr. Rajesh Sharma", facultyEmail: "rajesh.sharma@college.edu" },
    ],
  },
};

function defaultSemesters(): SemesterPerformance[] {
  return Array.from({ length: 8 }, (_, i) => ({
    semester: i + 1,
    students: 40,
    subjects: 6,
    passRate: 80 + (i % 3) * 2,
    avgCgpa: 7.5 + (i % 4) * 0.2,
    failed: 8,
  }));
}

function defaultSubjects(semester: string): SubjectPerformance[] {
  return [
    { name: `Core Subject A (Sem ${semester})`, code: `GEN${semester}01`, passRate: 82, avgMarks: 66, students: 40, failed: 7, faculty: "Dr. Faculty One", facultyEmail: "faculty.one@college.edu" },
    { name: `Core Subject B (Sem ${semester})`, code: `GEN${semester}02`, passRate: 68, avgMarks: 52, students: 40, failed: 13, faculty: "Dr. Faculty Two", facultyEmail: "faculty.two@college.edu" },
    { name: `Elective Subject (Sem ${semester})`, code: `GEN${semester}03`, passRate: 75, avgMarks: 60, students: 40, failed: 10, faculty: "Prof. Faculty Three", facultyEmail: "faculty.three@college.edu" },
  ];
}

export function getDepartmentOverview(code: string): DepartmentOverview {
  const key = code.toUpperCase();
  return (
    DEPARTMENT_OVERVIEWS[key] ?? {
      code: key,
      name: `${key} Department`,
      passRate: 78,
      avgCgpa: 7.4,
      totalPassed: 200,
      totalFailed: 55,
      students: 255,
      weakSemesters: 2,
      hod: "Dr. Department HOD",
    }
  );
}

export function getSemesterPerformance(dept: string): SemesterPerformance[] {
  return SEMESTERS_BY_DEPT[dept.toUpperCase()] ?? defaultSemesters();
}

export function getSubjectsForSemester(dept: string, semester: string): SubjectPerformance[] {
  const byDept = SUBJECTS_BY_DEPT_SEM[dept.toUpperCase()];
  if (byDept?.[semester]) return byDept[semester];
  return defaultSubjects(semester);
}

export function getSubjectDetail(dept: string, semester: string, subjectName: string): SubjectPerformance | null {
  const subjects = getSubjectsForSemester(dept, semester);
  const decoded = decodeURIComponent(subjectName);
  return subjects.find((s) => s.name === decoded || s.code === decoded) ?? null;
}
