import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";


export async function GET(request:NextRequest) {
    try {

        const data = [
            {
            Name: "John Doe",
            Email: "john@example.com",
            RollNo: "CSE001",
            Semester: 1,
            Section: "A",
            Department: "CSE",
            Batch: "2026",
            },
        ];

        const worksheet = XLSX.utils.json_to_sheet(data);

         const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Students"
    ); 

    const buffer = XLSX.write(workbook, {
    type: "buffer",
    bookType: "xlsx",
  });

        return new Response(buffer, {
        headers: {
        "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition":
            'attachment; filename="student-template.xlsx"',
        },
  });

        
    } catch (error) {
        console.log("Error in Template", error);
        return NextResponse.json(
            {
                success: false,
                message: "Error in Template file"
            }, 
            {
                status: 500
            }
        )
        
    }
}