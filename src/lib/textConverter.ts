import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export type SemesterPdfMetrics = {
  totalSubjects: number;
  avgPass: string;
  poorCount: number;
  attentionCount: number;
};

export type SemesterPdfSubjectRow = {
  subjectName: string;
  subjectCode: string;
  passPercentage: number;
  statusLabel: string;
  averageMarks: number;
  failedCount: number;
  facultyName: string;
};

export type SemesterPdfPayload = {
  department: string;
  semester: string;
  metrics: SemesterPdfMetrics;
  subjectsList: SemesterPdfSubjectRow[];
  subtitle?: string;
};

/** Builds a semester performance PDF (used by export buttons as a test). */
export function buildSemesterPerformancePdf(payload: SemesterPdfPayload): jsPDF {
  const {
    department,
    semester,
    metrics,
    subjectsList,
    subtitle = "Subject-wise performance · poor subjects highlighted in red",
  } = payload;

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text(`${department} · Semester ${semester}`, 14, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100); 
    doc.text("Subject-wise performance · poor subjects highlighted in red", 14, 26);

    
    doc.setFillColor(248, 249, 250); 
    doc.roundedRect(14, 32, 182, 22, 2, 2, "F");

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    
   
    doc.text("SUBJECTS", 18, 38);
    doc.setFont("helvetica", "bold"); doc.setFontSize(14); doc.text(String(metrics.totalSubjects), 18, 44);
   
    
    doc.setFontSize(9); doc.text("AVG PASS %", 60, 38);
    doc.setFont("helvetica", "bold"); doc.setFontSize(14); doc.text(metrics.avgPass, 60, 44);
  

   
    doc.setFontSize(9); doc.text("POOR SUBJECTS", 105, 38);
    doc.setFont("helvetica", "bold"); doc.setFontSize(14); doc.text(String(metrics.poorCount), 105, 44);
    doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.text("Below 70% pass", 105, 49);

    
    doc.setFontSize(9); doc.text("NEEDS ATTENTION", 150, 38);
    doc.setFont("helvetica", "bold"); doc.setFontSize(14); doc.text(String(metrics.attentionCount), 150, 44);
    doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.text("70-79% pass", 150, 49);

  doc.setFontSize(9);
  doc.text("NEEDS ATTENTION", 150, 38);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(String(metrics.attentionCount), 150, 44);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("70-79% pass", 150, 49);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("Subjects", 14, 64);

    
    const tableHeaders = [["SUBJECT", "CODE", "PASS %", "AVG MARKS", "FAILED", "FACULTY"]];
    
    const tableRows = subjectsList.map((row: any) => [
      row.subjectName,
      row.subjectCode,
      `${row.passPercentage}% · ${row.statusLabel}`, // Compiles "68% · Poor"
      row.averageMarks,
      row.failedCount,
      row.facultyName
    ]);

  autoTable(doc, {
    head: tableHeaders,
    body: tableRows,
    startY: 70,
    theme: "striped",
    headStyles: { fillColor: [79, 70, 229], textColor: [255, 255, 255], fontStyle: "bold" },
    styles: { fontSize: 9, cellPadding: 4 },
    didParseCell: (data) => {
      if (data.section === "body") {
        const statusText = String(data.row.raw[2] ?? "");
        if (statusText.includes("Poor")) {
          data.cell.styles.fillColor = [254, 226, 226];
          data.cell.styles.textColor = [153, 27, 27];
        } else if (statusText.includes("Needs Attention")) {
          data.cell.styles.fillColor = [254, 243, 199];
          data.cell.styles.textColor = [146, 64, 14];
        }
      }
    },
  });

  return doc;
}

/** Client-side download using textConverter PDF builder. */
export function downloadSemesterPerformancePdf(payload: SemesterPdfPayload, filename?: string) {
  const doc = buildSemesterPerformancePdf(payload);
  const safeDept = payload.department.replace(/[^a-z0-9_-]/gi, "_");
  const safeSem = payload.semester.replace(/[^a-z0-9_-]/gi, "_");
  doc.save(filename ?? `${safeDept}-Semester-${safeSem}_Performance_Report.pdf`);
}
