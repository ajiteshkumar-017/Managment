import { downloadSemesterPerformancePdf } from "@/lib/textConverter";
import { downloadSubjectPerformancePDF } from "@/lib/textToPdf";
import {
  getDepartmentOverview,
  getPerformanceLevel,
  getSemesterPerformance,
  getSubjectDetail,
  getSubjectsForSemester,
  performanceLabel,
} from "./departmentPerformance";

/** Export department overview via textConverter PDF (test). */
export function exportDepartmentReport(department: string) {
  const overview = getDepartmentOverview(department);
  const semesters = getSemesterPerformance(department);

  const poorCount = semesters.filter((s) => getPerformanceLevel(s.passRate) === "poor").length;
  const attentionCount = semesters.filter((s) => getPerformanceLevel(s.passRate) === "warning").length;
  const avgPass =
    semesters.length > 0
      ? `${Math.round((semesters.reduce((sum, s) => sum + s.passRate, 0) / semesters.length) * 10) / 10}%`
      : "0%";

  downloadSemesterPerformancePdf({
    department: overview.code,
    semester: "All",
    subtitle: "Department semester performance · poor semesters highlighted in red",
    metrics: {
      totalSubjects: semesters.length,
      avgPass,
      poorCount,
      attentionCount,
    },
    subjectsList: semesters.map((row) => ({
      subjectName: `Semester ${row.semester}`,
      subjectCode: `SEM-${row.semester}`,
      passPercentage: row.passRate,
      statusLabel: performanceLabel(getPerformanceLevel(row.passRate)),
      averageMarks: Math.round(row.avgCgpa * 10),
      failedCount: row.failed,
      facultyName: overview.hod,
    })),
  }, `${overview.code}_department_performance.pdf`);
}

/** Export semester subjects via textConverter PDF (test). */
export function exportSemesterReport(department: string, semester: string) {
  const overview = getDepartmentOverview(department);
  const subjects = getSubjectsForSemester(department, semester);
  const poorCount = subjects.filter((s) => getPerformanceLevel(s.passRate) === "poor").length;
  const attentionCount = subjects.filter((s) => getPerformanceLevel(s.passRate) === "warning").length;
  const avgPass =
    subjects.length > 0
      ? `${Math.round((subjects.reduce((sum, s) => sum + s.passRate, 0) / subjects.length) * 10) / 10}%`
      : "0%";

  downloadSemesterPerformancePdf({
    department: overview.code,
    semester,
    metrics: {
      totalSubjects: subjects.length,
      avgPass,
      poorCount,
      attentionCount,
    },
    subjectsList: subjects.map((row) => ({
      subjectName: row.name,
      subjectCode: row.code,
      passPercentage: row.passRate,
      statusLabel: performanceLabel(getPerformanceLevel(row.passRate)),
      averageMarks: row.avgMarks,
      failedCount: row.failed,
      facultyName: row.faculty,
    })),
  });
}

/** Export single subject via textConverter PDF (test). */
export function exportSubjectReport(department: string, semester: string, subjectName: string) {
  const overview = getDepartmentOverview(department);
  const subject = getSubjectDetail(department, semester, subjectName);
  if (!subject) {
    throw new Error("Subject not found");
  }

  const safeName = subject.name.replace(/[^a-z0-9]+/gi, "_").toLowerCase();

  downloadSubjectPerformancePDF(
    {
      department: overview.code,
      semester,
      subjectName: subject.name,
      metrics: {
        passPercentage: String(subject.passRate),
        avgMark: String(subject.avgMarks),
        student: String(subject.students),
        failed: String(subject.failed),
      },
      facultyDetails: {
        facultyName: subject.faculty,
        semNumber: Number(semester) || 0,
        facultyEmail: subject.facultyEmail,
        departmentHod: overview.hod,
      },
      metricsData: {
        percentage: subject.passRate,
        avgMark: subject.avgMarks,
        totalStudent: subject.students,
        failedStudentNum: subject.failed,
      },
      actions: {
        notifyHod: () => {},
        notifyFaculty: async () => {},
        askFacultyForReason: () => {},
      },
    },
    `${overview.code}_Sem${semester}_${safeName}_report.pdf`,
  );
}
