import Connect from "@/dbConnect/connect";
import { Faculty } from "@/models/faculty.model";
import { User } from "@/models/user";
import { facultyUploadSchema } from "@/validation/admin/bulkUpload-Faculty/facultyBulkUploadSchema";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import z from "zod";
import { createRequestLogger } from "@/lib/requestLogger";

type TrackedFacultyRow = z.infer<typeof facultyUploadSchema> & { __originalRow: number };

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
      return NextResponse.json({ message: "File is required" }, { status: 400 });
    }

    const allowedFileType = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "text/csv",
    ];

    if (!allowedFileType.includes(file.type)) {
      requestLogger.warn({ fileType: file.type }, "Invalid file type");
      return NextResponse.json(
        { message: "Only .xlsx, .xls, and .csv files are allowed." },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const workBook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workBook.SheetNames[0];
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(workBook.Sheets[sheetName]);

    const normalizedRows = rows.map((row) => ({
      name: row.Name,
      email: row.Email,
      designation: row.Designation,
      department: row.Department,
      salary: row.Salary,
      status: row.Status,
    }));

    const validRows: TrackedFacultyRow[] = [];
    const invalidRows: {
      row: number;
      errors: Record<string, string[] | undefined>;
      data: unknown;
    }[] = [];
    const finalValidRows: z.infer<typeof facultyUploadSchema>[] = [];

    for (const [index, row] of normalizedRows.entries()) {
      const result = facultyUploadSchema.safeParse(row);
      if (!result.success) {
        invalidRows.push({
          row: index + 2,
          errors: result.error.flatten().fieldErrors,
          data: row,
        });
        continue;
      }
      validRows.push({ ...result.data, __originalRow: index + 2 });
    }

    const tempValidRows: TrackedFacultyRow[] = [];
    const seenEmails = new Map<string, number>();

    for (const faculty of validRows) {
      const currentExcelRow = faculty.__originalRow;
      const emailKey = faculty.email.toLowerCase().trim();
      const errorObj: Record<string, string[]> = {};
      let hasInternalError = false;

      if (seenEmails.has(emailKey)) {
        errorObj.email = [`Duplicate email: matches row ${seenEmails.get(emailKey)} in this sheet.`];
        hasInternalError = true;
      } else {
        seenEmails.set(emailKey, currentExcelRow);
      }

      if (hasInternalError) {
        invalidRows.push({ row: currentExcelRow, errors: errorObj, data: faculty });
      } else {
        tempValidRows.push(faculty);
      }
    }

    const uniqueEmails = tempValidRows.map((f) => f.email.toLowerCase().trim());
    const existingUsers = await User.find({ email: { $in: uniqueEmails } });
    const existingEmailSet = new Set(existingUsers.map((u) => u.email.toLowerCase()));

    for (const faculty of tempValidRows) {
      if (existingEmailSet.has(faculty.email.toLowerCase().trim())) {
        invalidRows.push({
          row: faculty.__originalRow,
          errors: { email: ["User with this email already exists."] },
          data: faculty,
        });
        continue;
      }
      const { __originalRow, ...cleanData } = faculty;
      finalValidRows.push(cleanData);
    }

    if (validateOnly) {
      if (invalidRows.length > 0) {
        invalidRows.sort((a, b) => a.row - b.row);
        const sheetDuplicateCount = invalidRows.filter((item) =>
          Object.values(item.errors).some((messages) =>
            messages?.some((msg) => msg.includes("Duplicate")),
          ),
        ).length;

        requestLogger.warn(
          { totalRows: normalizedRows.length, invalidCount: invalidRows.length, validateOnly },
          "Faculty bulk upload validation failed",
        );
        return NextResponse.json(
          {
            success: false,
            message: "Please fix the validation errors before importing.",
            totalRows: normalizedRows.length,
            validData: validRows.length,
            finalVRow: finalValidRows.length,
            duplicateRows: sheetDuplicateCount,
            invalidRows,
          },
          { status: 400 },
        );
      }

      requestLogger.info(
        { totalRows: normalizedRows.length, validData: validRows.length, validateOnly },
        "Faculty bulk upload validation succeeded",
      );
      return NextResponse.json({
        success: true,
        preview: true,
        message: "Everything is fine",
        totalRows: normalizedRows.length,
        validData: validRows.length,
        finalVRow: finalValidRows.length,
        data: normalizedRows,
      });
    }

    if (invalidRows.length > 0 || finalValidRows.length === 0) {
      requestLogger.warn(
        { invalidCount: invalidRows.length, finalValidCount: finalValidRows.length },
        "Faculty bulk upload import blocked",
      );
      return NextResponse.json(
        {
          success: false,
          message: "Import blocked. Fix validation issues first.",
          invalidRows,
        },
        { status: 400 },
      );
    }

    const preparedUsers = finalValidRows.map((faculty) => {
      const generatedId = new mongoose.Types.ObjectId();
      return {
        _id: generatedId,
        username: faculty.name,
        email: faculty.email.toLowerCase().trim(),
        role: "faculty",
      };
    });

    await User.insertMany(preparedUsers);

    const preparedFaculty = finalValidRows.map((faculty, index) => ({
      userId: preparedUsers[index]._id,
      designation: faculty.designation,
      salary: faculty.salary,
      department: faculty.department,
      status: faculty.status,
      joinedAt: new Date(),
    }));

    await Faculty.insertMany(preparedFaculty);

    requestLogger.info({ importedCount: finalValidRows.length }, "Faculty bulk upload completed successfully");
    return NextResponse.json({
      success: true,
      message: `${finalValidRows.length} faculty records imported successfully`,
    });
  } catch (error) {
    requestLogger.error({ err: error }, "Faculty bulk upload failed");
    console.error("Error in faculty bulk upload", error);
    return NextResponse.json(
      { success: false, message: "Error in faculty bulk upload" },
      { status: 500 },
    );
  }
}
