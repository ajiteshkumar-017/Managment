import { NextRequest, NextResponse } from "next/server";
import { createRequestLogger } from "@/lib/requestLogger";
import {
  publishMarksheet,
  validateMarksheet,
} from "@/lib/Admin/Resultpublication/marksheetUpload";

/**
 * POST /api/admin/result/marksheet/upload?validateOnly=true|false
 * FormData: file (xlsx)
 */
export async function POST(request: NextRequest) {
  const logger = createRequestLogger();
  try {
    const validateOnly =
      new URL(request.url).searchParams.get("validateOnly") !== "false";

    const formData = await request.formData();
    const file = formData.get("file");

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
          message: "Only Excel files (.xlsx) are allowed. Please upload the downloaded template.",
        },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    if (validateOnly) {
      const result = await validateMarksheet(buffer);
      logger.info(
        {
          success: result.success,
          invalidCount: result.invalidRows.length,
          students: result.studentCount,
        },
        "Marksheet validation completed",
      );
      return NextResponse.json(result, {
        status: result.success ? 200 : 400,
      });
    }

    const published = await publishMarksheet(buffer);
    if (!published.success) {
      logger.warn(
        { invalidCount: published.invalidRows?.length || 0 },
        "Marksheet publish blocked",
      );
      return NextResponse.json(published, { status: 400 });
    }

    logger.info(
      { students: published.studentCount, batchId: published.batchId },
      "Marksheet published",
    );
    return NextResponse.json(published);
  } catch (error) {
    logger.error({ err: error }, "Marksheet upload failed");
    return NextResponse.json(
      { success: false, message: "Failed to process marksheet upload." },
      { status: 500 },
    );
  }
}
