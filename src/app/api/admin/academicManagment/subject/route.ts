import Connect from "@/dbConnect/connect";
import { Subject } from "@/models/subject.model";
import { NextRequest, NextResponse } from "next/server";
import { createRequestLogger } from "@/lib/requestLogger";
import { SemesterType } from "@/constant/Constant";

export async function GET() {
  const requestLogger = createRequestLogger();
  try {
    await Connect();
    const subjects = await Subject.find().select("subjectCode subjectName -_id").sort({ createdAt: -1 });
    requestLogger.info({ count: subjects.length }, "Subjects fetched successfully");
    return NextResponse.json({ success: true, data: subjects });
  } catch (error) {
    requestLogger.error({ err: error }, "Failed to fetch subjects");
    console.error("Error fetching subjects", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch subjects" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const requestLogger = createRequestLogger();
  try {
    await Connect();
    const body = await request.json();
    const {
      subjectCode,
      subjectName,
      credits,
      semester,
      department,
      totalClasses,
      IspracticalSubject,
    } = body;

    if (!subjectCode || !subjectName || !credits || !semester || !department) {
      requestLogger.warn({ subjectCode, subjectName, credits, semester, department }, "Invalid payload");
      return NextResponse.json(
        { success: false, message: "All required fields must be provided" },
        { status: 400 },
      );
    }

    const existing = await Subject.findOne({ subjectCode });
    if (existing) {
      requestLogger.warn({ subjectCode }, "Subject code already exists");
      return NextResponse.json(
        { success: false, message: "Subject code already exists" },
        { status: 409 },
      );
    }

    const subject = await Subject.create({
      subjectCode,
      subjectName,
      credits,
      semester: Number(semester) as SemesterType,
      department,
      totalClasses: totalClasses || 0,
      IspracticalSubject: Boolean(IspracticalSubject),
      status: "active",
    });

    requestLogger.info({ subjectCode, department, semester }, "Subject added successfully");
    return NextResponse.json({
      success: true,
      message: "Subject added successfully",
      data: subject,
    });
  } catch (error) {
    requestLogger.error({ err: error }, "Failed to add subject");
    console.error("Error adding subject", error);
    return NextResponse.json(
      { success: false, message: "Failed to add subject" },
      { status: 500 },
    );
  }
}
