import { NextRequest, NextResponse } from "next/server";
import { createRequestLogger } from "@/lib/requestLogger";
import { verifyJwt } from "@/lib/verifyJwt";
import Connect from "@/dbConnect/connect";
import { getFacultyByUserId } from "@/lib/faculty/helpers";
import { Class } from "@/models/class.model";
import { Subject } from "@/models/subject.model";
import {
  parseMarksheetBuffer,
  publishMarksheet,
  validateMarksheet,
} from "@/lib/Admin/Resultpublication/marksheetUpload";
import { AUDIT_ACTION, AUDIT_ENTITY_TYPE } from "@/constant/audit";
import { writeAuditFromRequest } from "@/lib/systemUses/audit/writeAuditFromRequest";

async function facultyOwnsMarksheet(userId: string, buffer: Buffer) {
  const parsed = await parseMarksheetBuffer(buffer);
  const subject =
    (await Subject.findOne({
      subjectCode: parsed.header.subjectCode.trim().toUpperCase(),
    } as Record<string, unknown>).lean()) ||
    (await Subject.findOne({
      subjectCode: parsed.header.subjectCode.trim(),
    } as Record<string, unknown>).lean());

  if (!subject) {
    return {
      ok: false as const,
      message: `Subject "${parsed.header.subjectCode}" was not found.`,
    };
  }

  const cls = await Class.findOne({
    facultyId: userId,
    subjectId: subject._id,
    department: parsed.header.department,
    semester: parsed.header.semester,
    batch: parsed.header.batch,
  } as Record<string, unknown>).lean();

  if (!cls) {
    return {
      ok: false as const,
      message:
        "This marksheet is not for one of your assigned classes. Download the template from your class and try again.",
    };
  }

  return { ok: true as const, classId: String(cls._id) };
}

export async function POST(request: NextRequest) {
  const logger = createRequestLogger();

  try {
    await Connect();

    const auth = await verifyJwt(request);
    if (auth.ok === false) return auth.response;

    const { _id: userId, role } = auth.payload;
    if (role !== "faculty") {
      return NextResponse.json(
        { success: false, message: "Only faculty can upload marksheets" },
        { status: 403 },
      );
    }

    const faculty = await getFacultyByUserId(String(userId));
    if (!faculty) {
      return NextResponse.json(
        { success: false, message: "Faculty profile not found" },
        { status: 404 },
      );
    }

    const validateOnly =
      new URL(request.url).searchParams.get("validateOnly") !== "false";

    const formData = await request.formData();
    const file = formData.get("file");
    const expectedClassId = String(formData.get("classId") || "").trim();

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, message: "Please select a marksheet file to upload." },
        { status: 400 },
      );
    }

    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Only Excel files (.xlsx) are allowed. Please upload the downloaded template.",
        },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    try {
      const ownership = await facultyOwnsMarksheet(String(userId), buffer);
      if (!ownership.ok) {
        return NextResponse.json(
          {
            success: false,
            message: ownership.message,
            invalidRows: [{ row: 0, errors: [ownership.message] }],
          },
          { status: 403 },
        );
      }

      if (expectedClassId && ownership.classId !== expectedClassId) {
        const message =
          "The uploaded file does not match the class you selected. Download a fresh template for that class.";
        return NextResponse.json(
          {
            success: false,
            message,
            invalidRows: [{ row: 0, errors: [message] }],
          },
          { status: 400 },
        );
      }
    } catch (parseError) {
      const message =
        parseError instanceof Error
          ? parseError.message
          : "Could not read the Excel file. Download a fresh template and try again.";
      return NextResponse.json(
        {
          success: false,
          message,
          invalidRows: [{ row: 0, errors: [message] }],
        },
        { status: 400 },
      );
    }

    if (validateOnly) {
      const result = await validateMarksheet(buffer);
      logger.info(
        {
          success: result.success,
          invalidCount: result.invalidRows.length,
          students: result.studentCount,
        },
        "Faculty marksheet validation completed",
      );
      return NextResponse.json(result, {
        status: result.success ? 200 : 400,
      });
    }

    const published = await publishMarksheet(buffer);
    if (!published.success) {
      logger.warn(
        { invalidCount: published.invalidRows?.length || 0 },
        "Faculty marksheet publish blocked",
      );
      return NextResponse.json(published, { status: 400 });
    }

    logger.info(
      { students: published.studentCount, batchId: published.batchId },
      "Faculty marksheet published",
    );
    await writeAuditFromRequest(request, {
      action: AUDIT_ACTION.RESULT_BATCH_UPLOAD_MARKSHEET,
      entityType: AUDIT_ENTITY_TYPE.RESULT_BATCH,
      entityId: published.batchId,
      description: `Faculty uploaded and published marksheet for ${published.studentCount} students`,
      metadata: { students: published.studentCount, batchId: published.batchId },
      severity: "high",
    });
    return NextResponse.json(published);
  } catch (error) {
    logger.error({ err: error }, "Faculty marksheet upload failed");
    return NextResponse.json(
      { success: false, message: "Failed to process marksheet upload." },
      { status: 500 },
    );
  }
}
