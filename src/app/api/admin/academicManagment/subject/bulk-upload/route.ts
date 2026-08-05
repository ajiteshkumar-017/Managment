import Connect from "@/dbConnect/connect";
import { Subject } from "@/models/subject.model";
import { subjectUploadSchema } from "@/validation/admin/bulkUpload-Subject/subjectBulkUploadSchema";
import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import z from "zod";
import { createRequestLogger } from "@/lib/requestLogger";

type TrackedSubjectRow = z.infer<typeof subjectUploadSchema> & { __originalRow: number };

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
      subjectCode: row.SubjectCode,
      subjectName: row.SubjectName,
      credits: row.Credits,
      semester: row.Semester,
      department: row.Department,
      totalClasses: row.TotalClasses ?? 0,
      IspracticalSubject:
        row.IspracticalSubject ?? row.IsPracticalSubject ?? row.Practical ?? false,
    }));

    const validRows: TrackedSubjectRow[] = [];
    const invalidRows: {
      row: number;
      errors: Record<string, string[] | undefined>;
      data: unknown;
    }[] = [];
    const finalValidRows: z.infer<typeof subjectUploadSchema>[] = [];

    for (const [index, row] of normalizedRows.entries()) {
      const result = subjectUploadSchema.safeParse(row);
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

    const tempValidRows: TrackedSubjectRow[] = [];
    const seenCodes = new Map<string, number>();

    for (const subject of validRows) {
      const currentExcelRow = subject.__originalRow;
      const codeKey = subject.subjectCode.trim().toUpperCase();
      const errorObj: Record<string, string[]> = {};
      let hasInternalError = false;

      if (seenCodes.has(codeKey)) {
        errorObj.subjectCode = [`Duplicate code: matches row ${seenCodes.get(codeKey)} in this sheet.`];
        hasInternalError = true;
      } else {
        seenCodes.set(codeKey, currentExcelRow);
      }

      if (hasInternalError) {
        invalidRows.push({ row: currentExcelRow, errors: errorObj, data: subject });
      } else {
        tempValidRows.push(subject);
      }
    }

    const uniqueCodes = tempValidRows.map((s) => s.subjectCode.trim().toUpperCase());
    const existingSubjects = await Subject.find({ subjectCode: { $in: uniqueCodes } });
    const existingCodeSet = new Set(existingSubjects.map((s) => s.subjectCode.toUpperCase()));

    for (const subject of tempValidRows) {
      if (existingCodeSet.has(subject.subjectCode.trim().toUpperCase())) {
        invalidRows.push({
          row: subject.__originalRow,
          errors: { subjectCode: ["Subject code already exists in database."] },
          data: subject,
        });
        continue;
      }
      const { __originalRow, ...cleanData } = subject;
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
          "Subject bulk upload validation failed",
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
        "Subject bulk upload validation succeeded",
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
        "Subject bulk upload import blocked",
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

    const preparedSubjects = finalValidRows.map((subject) => ({
      subjectCode: subject.subjectCode.trim().toUpperCase(),
      subjectName: subject.subjectName,
      credits: subject.credits,
      semester: Number(subject.semester),
      department: subject.department,
      totalClasses: subject.totalClasses || 0,
      status: "active" as const,
      IspracticalSubject: Boolean(subject.IspracticalSubject),
    }));

    await Subject.insertMany(preparedSubjects);

    requestLogger.info({ importedCount: finalValidRows.length }, "Subject bulk upload completed successfully");
    return NextResponse.json({
      success: true,
      message: `${finalValidRows.length} subjects imported successfully`,
    });
  } catch (error) {
    requestLogger.error({ err: error }, "Subject bulk upload failed");
    console.error("Error in subject bulk upload", error);
    return NextResponse.json(
      { success: false, message: "Error in subject bulk upload" },
      { status: 500 },
    );
  }
}
