import { NextRequest, NextResponse } from "next/server";
import Connect from "@/dbConnect/connect";
import { createRequestLogger } from "@/lib/requestLogger";
import { Subject } from "@/models/subject.model";
import { Student } from "@/models/student.model";

/** Dropdown options for Add Result modal: subjects + student batches */
export async function GET(request: NextRequest) {
  const requestLogger = createRequestLogger();
  try {
    await Connect();
    const { searchParams } = new URL(request.url);
    const department = searchParams.get("department") || "";
    const semester = Number(searchParams.get("semester"));

    if (!department || !semester) {
      return NextResponse.json(
        { success: false, message: "department and semester are required" },
        { status: 400 },
      );
    }

    const [subjects, batches] = await Promise.all([
      Subject.find({
        department,
        semester,
        status: "active",
      } as Record<string, unknown>)
        .select("subjectCode subjectName credits")
        .sort({ subjectCode: 1 })
        .lean(),
      Student.distinct("batch", {
        department,
        semester,
        status: "active",
      } as Record<string, unknown>),
    ]);

    requestLogger.info(
      { department, semester, subjectCount: subjects.length },
      "Result form options fetched",
    );

    return NextResponse.json({
      success: true,
      data: {
        subjects: subjects.map((s) => ({
          // id: String(s._id),
          subjectCode: s.subjectCode,
          subjectName: s.subjectName,
          credits: s.credits,
          label: `${s.subjectCode} — ${s.subjectName}`,
        })),
        batches: (batches as string[]).filter(Boolean).sort(),
      },
    });
  } catch (error) {
    requestLogger.error({ err: error }, "Failed to load result form options");
    return NextResponse.json(
      { success: false, message: "Failed to load options" },
      { status: 500 },
    );
  }
}
