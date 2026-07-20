import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

export async function GET() {
  try {
    const data = [
      {
        SubjectCode: "CSE301",
        SubjectName: "Database Management Systems",
        Credits: 4,
        Semester: 3,
        Department: "CSE",
        TotalClasses: 40,
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Subjects");

    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    return new Response(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="subject-template.xlsx"',
      },
    });
  } catch (error) {
    console.error("Error generating subject template", error);
    return NextResponse.json(
      { success: false, message: "Error generating template file" },
      { status: 500 },
    );
  }
}
