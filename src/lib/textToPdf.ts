import jsPDF from "jspdf";

type SemesterPdfMetrics = {
  passPercentage: string;
  avgMark: string;
  student: string;
  failed: string;
};

type SemesterFacultyDetail = {
  facultyName: string;
  semNumber: number;
  facultyEmail: string;
  departmentHod: string;
};

type SemesterPdfMetricsData = {
  percentage: number;
  avgMark: number;
  totalStudent: number;
  failedStudentNum: number;
};

export type SemesterPdfActions = {
  notifyHod: () => void;
  notifyFaculty: (facultyId: string) => Promise<void>;
  askFacultyForReason: (subjectCode: string) => void;
};

export type SubjectPerformancePdfPayload = {
  department: string;
  semester: string;
  subjectName: string;
  metrics: SemesterPdfMetrics;
  facultyDetails: SemesterFacultyDetail;
  metricsData: SemesterPdfMetricsData;
  actions: SemesterPdfActions;
};

type PerformanceStatus = {
  label: string;
  tone: [number, number, number];
  soft: [number, number, number];
  hint: string;
};

function getPerformanceStatus(passRate: number): PerformanceStatus {
  if (passRate < 70) {
    return {
      label: "Poor",
      tone: [185, 28, 28],
      soft: [254, 226, 226],
      hint: "Immediate attention required",
    };
  }
  if (passRate < 80) {
    return {
      label: "Needs Attention",
      tone: [180, 83, 9],
      soft: [254, 243, 199],
      hint: "Monitor and follow up with faculty",
    };
  }
  return {
    label: "Healthy",
    tone: [4, 120, 87],
    soft: [209, 250, 229],
    hint: "Performance within expected range",
  };
}

function drawRoundedRect(
  doc: jsPDF,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  style: "F" | "S" | "FD" = "F",
) {
  doc.roundedRect(x, y, w, h, r, r, style);
}

function drawMetricCard(
  doc: jsPDF,
  x: number,
  y: number,
  w: number,
  h: number,
  opts: {
    label: string;
    value: string;
    hint: string;
    accent: [number, number, number];
    soft: [number, number, number];
  },
) {
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  drawRoundedRect(doc, x, y, w, h, 3, "FD");

  // Accent bar on left
  doc.setFillColor(...opts.accent);
  doc.rect(x, y + 3, 1.2, h - 6, "F");

  // Soft accent chip
  doc.setFillColor(...opts.soft);
  drawRoundedRect(doc, x + w - 14, y + 5, 9, 9, 2, "F");

  doc.setTextColor(100, 116, 139);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.text(opts.label.toUpperCase(), x + 6, y + 9);

  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(opts.value, x + 6, y + 20);

  doc.setTextColor(148, 163, 184);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.text(opts.hint, x + 6, y + 27);
}

export function buildSubjectPerformancePdf(payload: SubjectPerformancePdfPayload): jsPDF {
  const { department, semester, facultyDetails, metricsData, subjectName } = payload;
  const status = getPerformanceStatus(metricsData.percentage);
  const passed = Math.max(metricsData.totalStudent - metricsData.failedStudentNum, 0);
  const generatedAt = new Date().toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 14;
  const contentW = pageW - margin * 2;

  // ── Header band ──────────────────────────────────────────────
  doc.setFillColor(30, 41, 59);
  doc.rect(0, 0, pageW, 48, "F");

  // Accent strip
  doc.setFillColor(79, 70, 229);
  doc.rect(0, 48, pageW, 2.2, "F");

  doc.setTextColor(148, 163, 184);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("ACADEMIC PERFORMANCE REPORT", margin, 14);

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  const title = doc.splitTextToSize(subjectName, contentW - 50);
  doc.text(title, margin, 26);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(203, 213, 225);
  doc.text(`${department}  ·  Semester ${semester}  ·  Subject Detail`, margin, 40);

  // Status badge (top-right)
  const badgeLabel = status.label.toUpperCase();
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  const badgeW = doc.getTextWidth(badgeLabel) + 12;
  const badgeX = pageW - margin - badgeW;
  doc.setFillColor(...status.soft);
  drawRoundedRect(doc, badgeX, 12, badgeW, 10, 2, "F");
  doc.setTextColor(...status.tone);
  doc.text(badgeLabel, badgeX + 6, 17.5);

  // ── Metric cards ─────────────────────────────────────────────
  const cardY = 58;
  const cardH = 32;
  const gap = 4;
  const cardW = (contentW - gap * 3) / 4;

  const cards: Array<{
    label: string;
    value: string;
    hint: string;
    accent: [number, number, number];
    soft: [number, number, number];
  }> = [
    {
      label: "Pass %",
      value: `${metricsData.percentage}%`,
      hint: status.label,
      accent: status.tone,
      soft: status.soft,
    },
    {
      label: "Avg Mark",
      value: String(metricsData.avgMark),
      hint: "Out of 100",
      accent: [79, 70, 229],
      soft: [224, 231, 255],
    },
    {
      label: "Students",
      value: String(metricsData.totalStudent),
      hint: "Enrolled",
      accent: [8, 145, 178],
      soft: [207, 250, 254],
    },
    {
      label: "Failed",
      value: String(metricsData.failedStudentNum),
      hint: "Below pass mark",
      accent: [220, 38, 38],
      soft: [254, 226, 226],
    },
  ];

  cards.forEach((card, i) => {
    drawMetricCard(doc, margin + i * (cardW + gap), cardY, cardW, cardH, card);
  });

  // ── Pass-rate progress ───────────────────────────────────────
  let y = cardY + cardH + 12;

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  drawRoundedRect(doc, margin, y, contentW, 28, 3, "FD");

  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Pass Rate Overview", margin + 6, y + 9);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(status.hint, margin + 6, y + 15);

  const barX = margin + 6;
  const barY = y + 19;
  const barW = contentW - 12;
  const barH = 4.5;
  const fillW = Math.max(0, Math.min(barW, (metricsData.percentage / 100) * barW));

  doc.setFillColor(241, 245, 249);
  drawRoundedRect(doc, barX, barY, barW, barH, 1.5, "F");
  doc.setFillColor(...status.tone);
  drawRoundedRect(doc, barX, barY, fillW || 0.5, barH, 1.5, "F");

  // Threshold markers (70% / 80%)
  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.2);
  const t70 = barX + barW * 0.7;
  const t80 = barX + barW * 0.8;
  doc.line(t70, barY - 1, t70, barY + barH + 1);
  doc.line(t80, barY - 1, t80, barY + barH + 1);

  y += 36;

  // ── Faculty & summary two-column ─────────────────────────────
  const colGap = 5;
  const leftW = contentW * 0.58;
  const rightW = contentW - leftW - colGap;
  const sectionH = 52;

  // Faculty card
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  drawRoundedRect(doc, margin, y, leftW, sectionH, 3, "FD");

  doc.setFillColor(238, 242, 255);
  drawRoundedRect(doc, margin + 5, y + 5, 10, 10, 2, "F");

  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Faculty Details", margin + 18, y + 11);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text("Assigned instructor for this subject", margin + 18, y + 16);

  const facultyRows: Array<[string, string]> = [
    ["Faculty", facultyDetails.facultyName || "—"],
    ["Email", facultyDetails.facultyEmail || "—"],
    ["Department HOD", facultyDetails.departmentHod || "—"],
    ["Semester", `Semester ${facultyDetails.semNumber || semester}`],
  ];

  facultyRows.forEach(([label, value], i) => {
    const rowY = y + 24 + i * 6.5;
    doc.setTextColor(100, 116, 139);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.text(label, margin + 6, rowY);
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text(doc.splitTextToSize(value, leftW - 42)[0], margin + 40, rowY);
  });

  // Snapshot card
  const rightX = margin + leftW + colGap;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  drawRoundedRect(doc, rightX, y, rightW, sectionH, 3, "FD");

  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Result Snapshot", rightX + 6, y + 11);

  const snapshot: Array<[string, string]> = [
    ["Passed", String(passed)],
    ["Failed", String(metricsData.failedStudentNum)],
    ["Pass Rate", `${metricsData.percentage}%`],
    ["Avg Marks", String(metricsData.avgMark)],
  ];

  snapshot.forEach(([label, value], i) => {
    const rowY = y + 22 + i * 7;
    doc.setFillColor(i % 2 === 0 ? 248 : 255, i % 2 === 0 ? 250 : 255, i % 2 === 0 ? 252 : 255);
    doc.rect(rightX + 4, rowY - 4, rightW - 8, 6.5, "F");
    doc.setTextColor(100, 116, 139);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.text(label, rightX + 7, rowY);
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.text(value, rightX + rightW - 7, rowY, { align: "right" });
  });

  y += sectionH + 10;

  // ── Assessment note ──────────────────────────────────────────
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  const note =
    metricsData.percentage < 70
      ? `Pass rate is below 70%. Notify the HOD and ask ${facultyDetails.facultyName} for a written explanation.`
      : metricsData.percentage < 80
        ? "Pass rate is 70-79%. Follow up with faculty and monitor the next assessment cycle."
        : "Pass rate is 80% or above. Continue current teaching and assessment practices.";
  const noteMaxW = contentW - 16;
  const noteLines = doc.splitTextToSize(note, noteMaxW) as string[];
  const noteBoxH = 15 + noteLines.length * 4.2;

  doc.setFillColor(...status.soft);
  drawRoundedRect(doc, margin, y, contentW, noteBoxH, 3, "F");

  doc.setTextColor(...status.tone);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(`Assessment · ${status.label}`, margin + 6, y + 7);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(noteLines, margin + 6, y + 13);

  // ── Footer ───────────────────────────────────────────────────
  const pageH = doc.internal.pageSize.getHeight();
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(margin, pageH - 16, pageW - margin, pageH - 16);

  doc.setTextColor(148, 163, 184);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.text("College Management · Results Export", margin, pageH - 10);
  doc.text(`Generated ${generatedAt}`, pageW - margin, pageH - 10, { align: "right" });

  return doc;
}

export function downloadSubjectPerformancePDF(payload: SubjectPerformancePdfPayload, filename?: string) {
  const doc = buildSubjectPerformancePdf(payload);
  const safeDep = payload.department.replace(/[^a-z0-9_-]/gi, "_");
  const safeSem = payload.semester.replace(/[^a-z0-9_-]/gi, "_");
  const safeSubject = payload.subjectName.replace(/[^a-z0-9_-]/gi, "_");
  doc.save(filename ?? `${safeDep}-Semester-${safeSem}-${safeSubject}-Performance_Report.pdf`);
}
