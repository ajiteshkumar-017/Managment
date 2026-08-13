import { NextRequest, NextResponse } from "next/server";
import Connect from "@/dbConnect/connect";
import { verifyJwt } from "@/lib/verifyJwt";
import { createRequestLogger } from "@/lib/requestLogger";
import { getFacultyByUserId } from "@/lib/faculty/helpers";
import { Class } from "@/models/class.model";
import { Subject } from "@/models/subject.model";
import {
  generateMarksTemplateExcel,
  getTemplateData,
} from "@/lib/Admin/Resultpublication/dynamicTemplateGeneration";

export async function POST(request: NextRequest) {
  const logger = createRequestLogger();

  try {
    await Connect();

    const auth = await verifyJwt(request);
    if (auth.ok === false) return auth.response;

    const { _id: userId, role } = auth.payload;
    if (role !== "faculty") {
      return NextResponse.json(
        { success: false, message: "Only faculty can download this template" },
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

    const body = await request.json();
    const classId = String(body.classId || "").trim();

    if (!classId) {
      return NextResponse.json(
        { success: false, message: "classId is required" },
        { status: 400 },
      );
    }

    const cls = await Class.findById(classId)
      .populate({ path: "subjectId", model: Subject, select: "subjectName subjectCode" })
      .lean();

    if (!cls || String(cls.facultyId) !== String(userId)) {
      return NextResponse.json(
        { success: false, message: "You are not assigned to this class" },
        { status: 403 },
      );
    }

    const subject = cls.subjectId as {
      subjectName?: string;
      subjectCode?: string;
    } | null;

    const result = await getTemplateData({
      department: cls.department,
      semester: cls.semester,
      batch: cls.batch,
      section: cls.section,
      subject: subject?.subjectName || String(body.subject || ""),
      subjectCode: subject?.subjectCode || String(body.subjectCode || ""),
      exam: String(body.exam || body.ExamType || ""),
      academicYear: String(body.academicYear || ""),
    });

    if (result.success === false) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: result.status },
      );
    }

    const buffer = await generateMarksTemplateExcel(result.data, {
      generatedBy: "Faculty",
    });
    const { department, semester, subjectCode, exam } = result.data.header;
    const safeExam = String(exam).replace(/\s+/g, "-");
    const filename = `marks-${department}-sem${semester}-${subjectCode}-${safeExam}.xlsx`;

    logger.info(
      { classId, students: result.data.count },
      "Faculty marks template downloaded",
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
    logger.error({ err: error }, "Faculty template download failed");
    return NextResponse.json(
      { success: false, message: "Failed to generate download" },
      { status: 500 },
    );
  }
}
