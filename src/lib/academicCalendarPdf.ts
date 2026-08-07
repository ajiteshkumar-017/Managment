import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { academicTerms } from "@/data/academicCalendar";

/** Builds and downloads the academic calendar as a PDF. */
export function downloadAcademicCalendarPdf(filename = "academic-calendar.pdf") {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42);
  doc.text("Academic Calendar 2025–26", 14, 18);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(
    "Key dates for registration, classes, exams, and breaks. Subject to Academic Office updates.",
    14,
    25,
    { maxWidth: 180 },
  );

  let cursorY = 32;

  academicTerms.forEach((term, index) => {
    if (cursorY > 250) {
      doc.addPage();
      cursorY = 18;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(30, 41, 59);
    doc.text(term.term, 14, cursorY);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(term.period, 14, cursorY + 5);

    autoTable(doc, {
      startY: cursorY + 8,
      head: [["Date", "Event"]],
      body: term.items.map((item) => [item.date, item.event]),
      theme: "grid",
      styles: {
        fontSize: 9,
        cellPadding: 3,
        valign: "middle",
        textColor: [51, 65, 85],
      },
      headStyles: {
        fillColor: [79, 70, 229],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
      margin: { left: 14, right: 14 },
    });

    // jspdf-autotable attaches finalY on the doc instance
    const finalY =
      (doc as jsPDF & { lastAutoTable?: { finalY?: number } }).lastAutoTable
        ?.finalY ?? cursorY + 40;
    cursorY = finalY + (index < academicTerms.length - 1 ? 12 : 8);
  });

  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(
    "Generated from Orbit Student Portal · Dates are indicative",
    14,
    doc.internal.pageSize.getHeight() - 10,
  );

  doc.save(filename);
}
