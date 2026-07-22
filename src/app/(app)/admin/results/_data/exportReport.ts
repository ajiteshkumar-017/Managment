import { downloadSemesterPerformancePdf } from "@/lib/textConverter";
import { downloadSubjectPerformancePDF } from "@/lib/textToPdf";
import {
  getPerformanceLevel,
  performanceLabel,
  type SemesterPerformance,
  type SubjectPerformance,
} from "./departmentPerformance";

type PublishedExamRow = {
  examTitle: string;
  examType: string;
  department: string;
  semester: string;
  publishedDate: string;
  studentsCount: number;
  passRate: number;
  subjectCode?: string;
};

/** Export main Results page — published exam batches. */
export function exportPublishedExamsReport(exams: PublishedExamRow[]) {
  if (!exams.length) {
    throw new Error("No published exams to export");
  }

  const poorCount = exams.filter(
    (e) => getPerformanceLevel(e.passRate, true) === "poor",
  ).length;
  const attentionCount = exams.filter(
    (e) => getPerformanceLevel(e.passRate, true) === "warning",
  ).length;
  const avgPass =
    exams.length > 0
      ? `${Math.round((exams.reduce((sum, e) => sum + e.passRate, 0) / exams.length) * 10) / 10}%`
      : "0%";

  downloadSemesterPerformancePdf(
    {
      department: "All Departments",
      semester: "Published",
      subtitle: "Published exam results overview",
      metrics: {
        totalSubjects: exams.length,
        avgPass,
        poorCount,
        attentionCount,
      },
      subjectsList: exams.map((row) => ({
        subjectName: row.examTitle,
        subjectCode: row.subjectCode || row.examType,
        passPercentage: row.passRate,
        statusLabel: performanceLabel(getPerformanceLevel(row.passRate, true)),
        averageMarks: row.studentsCount,
        failedCount: 0,
        facultyName: `${row.department} · Sem ${row.semester} · ${row.publishedDate}`,
      })),
    },
    `published_exam_results.pdf`,
  );
}

/** Export department overview from live page data. */
export function exportDepartmentReport(input: {
  department: string;
  hod?: string;
  semesters: SemesterPerformance[];
}) {
  const { department, hod = "—", semesters } = input;

  const withResults = semesters.filter((s) =>
    Boolean(s.hasResults ?? (s.passRate > 0 || s.failed > 0)),
  );
  const poorCount = withResults.filter(
    (s) => getPerformanceLevel(s.passRate, true) === "poor",
  ).length;
  const attentionCount = withResults.filter(
    (s) => getPerformanceLevel(s.passRate, true) === "warning",
  ).length;
  const avgPass =
    withResults.length > 0
      ? `${Math.round((withResults.reduce((sum, s) => sum + s.passRate, 0) / withResults.length) * 10) / 10}%`
      : "0%";

  downloadSemesterPerformancePdf(
    {
      department,
      semester: "All",
      subtitle: "Department semester performance",
      metrics: {
        totalSubjects: semesters.length,
        avgPass,
        poorCount,
        attentionCount,
      },
      subjectsList: semesters.map((row) => {
        const hasResults = Boolean(
          row.hasResults ?? (row.passRate > 0 || row.failed > 0),
        );
        const level = getPerformanceLevel(row.passRate, hasResults);
        return {
          subjectName: `Semester ${row.semester}`,
          subjectCode: `SEM-${row.semester}`,
          passPercentage: row.passRate,
          statusLabel: performanceLabel(level),
          averageMarks: Math.round(row.avgCgpa * 10),
          failedCount: row.failed,
          facultyName: hod,
        };
      }),
    },
    `${department}_department_performance.pdf`,
  );
}

/** Export semester subjects from live page data. */
export function exportSemesterReport(input: {
  department: string;
  semester: string;
  subjects: SubjectPerformance[];
}) {
  const { department, semester, subjects } = input;

  if (!subjects.length) {
    throw new Error("No subjects to export");
  }

  const poorCount = subjects.filter((s) => {
    const hasResults = Boolean(s.hasResults ?? (s.students > 0 || s.failed > 0));
    return getPerformanceLevel(s.passRate, hasResults) === "poor";
  }).length;
  const attentionCount = subjects.filter((s) => {
    const hasResults = Boolean(s.hasResults ?? (s.students > 0 || s.failed > 0));
    return getPerformanceLevel(s.passRate, hasResults) === "warning";
  }).length;
  const withResults = subjects.filter((s) =>
    Boolean(s.hasResults ?? (s.students > 0 || s.failed > 0)),
  );
  const avgPass =
    withResults.length > 0
      ? `${Math.round((withResults.reduce((sum, s) => sum + s.passRate, 0) / withResults.length) * 10) / 10}%`
      : "0%";

  downloadSemesterPerformancePdf({
    department,
    semester,
    metrics: {
      totalSubjects: subjects.length,
      avgPass,
      poorCount,
      attentionCount,
    },
    subjectsList: subjects.map((row) => {
      const hasResults = Boolean(
        row.hasResults ?? (row.students > 0 || row.failed > 0),
      );
      return {
        subjectName: row.name,
        subjectCode: row.code,
        passPercentage: row.passRate,
        statusLabel: performanceLabel(getPerformanceLevel(row.passRate, hasResults)),
        averageMarks: row.avgMarks,
        failedCount: row.failed,
        facultyName: row.faculty,
      };
    }),
  });
}

/** Export single subject from live page data. */
export function exportSubjectReport(input: {
  department: string;
  semester: string;
  hod?: string;
  subject: SubjectPerformance;
}) {
  const { department, semester, hod = "—", subject } = input;

  if (!subject?.name) {
    throw new Error("Subject not found");
  }

  const safeName = subject.name.replace(/[^a-z0-9]+/gi, "_").toLowerCase();

  downloadSubjectPerformancePDF(
    {
      department,
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
        departmentHod: hod,
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
    `${department}_Sem${semester}_${safeName}_report.pdf`,
  );
}
