import { NextRequest, NextResponse } from "next/server";
import { createRequestLogger } from "@/lib/requestLogger";
import {
  generateMarksTemplateExcel,
  getTemplateData,
} from "@/lib/Admin/Resultpublication/dynamicTemplateGeneration";

/**
 * POST /api/admin/result/template/download
 * Body: { department, semester, batch, subject, subjectCode, exam, academicYear?, section? }
 * Returns: Excel .xlsx marks template for matching students
 */
export async function POST(request: NextRequest) {
  const logger = createRequestLogger();
  try {
    const body = await request.json();

    const result = await getTemplateData(body);
    if (result.success === false) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: result.status },
      );
    }

    const buffer = await generateMarksTemplateExcel(result.data, {
      generatedBy:
        typeof body.generatedBy === "string" && body.generatedBy.trim()
          ? body.generatedBy.trim()
          : "College Admin",
    });
    const { department, semester, subjectCode, exam } = result.data.header;
    const safeExam = String(exam).replace(/\s+/g, "-");
    const filename = `marks-${department}-sem${semester}-${subjectCode}-${safeExam}.xlsx`;

    logger.info(
      {
        department,
        semester,
        subjectCode,
        students: result.data.count,
      },
      "Marks template downloaded",
    );

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    logger.error({ err: error }, "Failed to download marks template");
    return NextResponse.json(
      { success: false, message: "Failed to generate download" },
      { status: 500 },
    );
  }
}
