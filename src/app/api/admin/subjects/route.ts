import Connect from "@/dbConnect/connect";
import { Subject } from "@/models/subject.model";
import { NextResponse } from "next/server";
import { createRequestLogger } from "@/lib/requestLogger";

export async function GET() {
  const requestLogger = createRequestLogger();
  try {
    await Connect();

    const subjects = await Subject.find().sort({ createdAt: -1 }).lean();

    const data = subjects.map((s: any) => ({
      _id: s._id,
      code: s.subjectCode,
      name: s.subjectName,
      semester: String(s.semester ?? ""),
      department: s.department || "—",
      credits: s.credits ?? 0,
      totalClasses: s.totalClasses ?? 0,
      IspracticalSubject: Boolean(s.IspracticalSubject),
      status: s.status === "inactive" ? "Inactive" : "Active",
      type: "Core",
    }));

    const stats = {
      total: data.length,
      active: data.filter((s) => s.status === "Active").length,
      inactive: data.filter((s) => s.status === "Inactive").length,
      departments: new Set(data.map((s) => s.department)).size,
    };

    requestLogger.info({ count: data.length }, "Subjects fetched successfully");

    return NextResponse.json({ success: true, data, stats });
  } catch (error) {
    requestLogger.error({ err: error }, "Failed to fetch subjects");
    return NextResponse.json(
      { success: false, message: "Failed to fetch subjects" },
      { status: 500 },
    );
  }
}
