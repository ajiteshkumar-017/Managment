import Connect from "@/dbConnect/connect";
import { Student } from "@/models/student.model";
import { User } from "@/models/user";
import { studentUploadSchema } from "@/validation/admin/bulkUpload-Student/bulkUploadSchema";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import z from "zod";
import { createRequestLogger } from "@/lib/requestLogger";

type TrackedStudentRow = z.infer<typeof studentUploadSchema> & { __originalRow: number };

export async function POST(request: NextRequest) {
  const requestLogger = createRequestLogger();
  try {
    await Connect();
    const { searchParams } = new URL(request.url);
    const validateOnly = searchParams.get("validateOnly") === "true";

    const formData = await request.formData();

    const file = formData.get("file");

    if (!(file instanceof File)) {
      requestLogger.warn({}, "Invalid payload: file required");
      return Response.json({ message: "File is required" }, { status: 400 });
    }

    const allowedFileType = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
      "application/vnd.ms-excel", // .xls
      "text/csv", // .csv
    ];

    if (!allowedFileType.includes(file.type)) {
      requestLogger.warn({ fileType: file.type }, "Invalid file type");
      return Response.json(
        {
          message: "Only .xlsx, .xls, and .csv files are allowed.",
        },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const workBook = XLSX.read(buffer, {
      type: "buffer",
    });

    const sheetName = workBook.SheetNames[0];

    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(
      workBook.Sheets[sheetName],
    );

    console.log(rows);

    const normalizedRows = rows.map((row) => ({
  name: row.Name,
  email: row.Email,
  rollNo: row.RollNo,
  semester: row.Semester,
  section: row.Section,
  department: row.Department,
  batch: String(row.Batch),
}));

console.log(rows[0]);
console.log(Object.keys(rows[0]));

    // for( const row of rows as any[]){
    //     if(!row.email || !row.email){
    //         return Response.json(
    //       { message: "Invalid data format: Name and Email are required fields." },
    //       { status: 420 }
    //     );
    //     }
    // }

   const validRows: TrackedStudentRow[] = [];
    const invalidRows: {
      row: number;
      errors: Record<string, string[] | undefined>;
      data: unknown;
    }[] = [];

    const finalValidRows: z.infer<typeof studentUploadSchema>[] = [];

    for (const [index, row] of normalizedRows.entries()) {
      const result = studentUploadSchema.safeParse(row);

      if (!result.success) {
        invalidRows.push({
          row: index + 2, // +2 because Excel header is row 1
          errors: result.error.flatten().fieldErrors,
          data: row,
        });

        continue;
      }
    
      const validStudentData: TrackedStudentRow = {
        ...result.data,
        __originalRow: index + 2,
      };
     validRows.push(validStudentData);
    }

    
    const tempValidRows: TrackedStudentRow[] = [];
    const seenEmails = new Map<string, number>(); 
    const seenRollNumbers = new Map<string, number>(); 

   
    
    for (const student of validRows) {
  const currentExcelRow = student.__originalRow; 
  const emailKey = student.email.toLowerCase().trim();
  const rollKey = student.rollNo;

  let hasInternalError = false;
  const errorObj: Record<string, string[]> = {};

    if (seenEmails.has(emailKey)) {
        const originalRow = seenEmails.get(emailKey);
        errorObj.email = [`Duplicate email: matches row ${originalRow} in this sheet.`];
        hasInternalError = true;
    } else {
    seenEmails.set(emailKey, currentExcelRow);
  }
  if (seenRollNumbers.has(rollKey)) {
    const originalRow = seenRollNumbers.get(rollKey);
    errorObj.rollNo = [`Duplicate roll number: matches row ${originalRow} in this sheet.`];
    hasInternalError = true;
  } else {
    seenRollNumbers.set(rollKey, currentExcelRow);
  }

  if (hasInternalError) {
    invalidRows.push({
      row: currentExcelRow,
      errors: errorObj,
      data: student,
    });
  } else {
    tempValidRows.push(student); 
  }
  
}

const uniqueEmails = tempValidRows.map((student) => student.email.toLowerCase().trim());
const uniqueRollNumbers = tempValidRows.map((student) => student.rollNo);

    // const uniqueEmails = [...new Set(emails)];
    // const uniqueRollNumbers = [...new Set(rollNumbers)];

    // if (emails.length !== uniqueEmails.length) {
    //   return Response.json(
    //     {
    //       message:
    //         "Upload blocked: There are duplicate emails inside your Excel file.",
    //     },
    //     { status: 400 },
    //   );
    // }

    // if (rollNumbers.length !== uniqueRollNumbers.length) {
    //   return Response.json(
    //     {
    //       message:
    //         "Upload blocked: There are duplicate roll numbers inside your Excel file.",
    //     },
    //     { status: 400 },
    //   );
    // }

    const existingUsers = await User.find({
      email: {
        $in: uniqueEmails,
      },
    });

    const existingsStudents = await Student.find({
      rollNumber: {
        $in: uniqueRollNumbers,
      },
    });

    const existingEmailSet = new Set(existingUsers.map((user) => user.email));
    const existingRollNoSet = new Set(existingsStudents.map((stud) => stud.rollNumber));

    for (const student of tempValidRows) {
      const emailConflict = existingEmailSet.has(student.email.toLowerCase().trim());
      const rollConflict = existingRollNoSet.has(student.rollNo);

      if (emailConflict || rollConflict) {
        invalidRows.push({
         row: student.__originalRow,
          errors: {
            ...(emailConflict && { email: ["User with this email already exists. Please choose a new Email"] }),
            ...(rollConflict && { rollNo: ["Roll number already exists. "] }),
          },
          data: student,
        });
        continue;
      }

      const { __originalRow, ...cleanStudentData } = student;
      finalValidRows.push(cleanStudentData);
    }

    if (validateOnly) {
        if (invalidRows.length > 0) {
            invalidRows.sort((a, b) => a.row - b.row);

  // 2. Count rows containing internal spreadsheet duplicate messages
  const sheetDuplicateCount = invalidRows.filter(item => 
    Object.values(item.errors).some(messages => 
      messages?.some(msg => msg.includes("Duplicate"))
    )
  ).length;
            requestLogger.warn(
              { totalRows: normalizedRows.length, invalidCount: invalidRows.length, validateOnly },
              "Student bulk upload validation failed",
            );
            return NextResponse.json(
            {
                success: false,
                message: "Please fix the validation errors before importing.",
                totalRows: normalizedRows.length,
                validData: validRows.length,
                finalVRow: finalValidRows.length,
                duplicateRows: sheetDuplicateCount,
                
                invalidRows:invalidRows,
                
            },
            { status: 400 },
            );
        }
      requestLogger.info(
        { totalRows: normalizedRows.length, validData: validRows.length, validateOnly },
        "Student bulk upload validation succeeded",
      );
      return Response.json({
        success: true,
        preview: true,
        message: "Everything is fine",
        totalRows: normalizedRows.length,
        validData: validRows.length,
        data: normalizedRows, // Send rows back for UI table display
      });
    }

    if (invalidRows.length > 0) {
      requestLogger.warn(
        { invalidCount: invalidRows.length },
        "Student bulk upload import blocked",
      );
      return NextResponse.json(
        {
          success: false,
          message: "Import blocked. The data file contains database conflicts or validation issues.",
          invalidRows,
        },
        { status: 400 }
      );
    }


    if (finalValidRows.length === 0) {
      requestLogger.warn({}, "No new valid rows found to insert");
      return Response.json({ success: false, message: "No new valid rows found to insert." }, { status: 400 });
    }
    const preparedUsers = finalValidRows.map((student) => {
      const generatedId = new mongoose.Types.ObjectId();
      return {
        _id: generatedId,
        email: student.email.toLowerCase().trim(),
        role: "student",
      };
    });


    // const userDocs = finalValidRows.map((student) => ({
    //   email: student.email,
    //   role: "student",
    // }));

    const users = await User.insertMany(preparedUsers);
    

    const preparedStudents = finalValidRows.map((student, index) => ({
      userId: preparedUsers[index]._id,

      name: student.name,

      rollNo: student.rollNo,

      semester: student.semester,

      department: student.department,

      batch: student.batch,

      section: student.section,

      status: "active",
    }));

    

    

    await Student.insertMany(preparedStudents);

    console.log("")

    requestLogger.info(
      { importedCount: finalValidRows.length, totalRows: normalizedRows.length },
      "Student bulk upload completed successfully",
    );
    return Response.json({
      success: true,
      preview: false,
      message: `${normalizedRows.length} students successfully imported to database!`,
    });

    // return Response.json({
    //   success: true,
    //   data: rows,
    // });
  } catch (err: any) {
    requestLogger.error({ err }, "Student bulk upload failed");
    console.log("Error In Bulk Upload of Students", err);

    return NextResponse.json(
      {
        success: false,
        message: "Error in Bulk Upload of Students.",
      },
      {
        status: 500,
      },
    );
  }
}
