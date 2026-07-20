import Connect from "@/dbConnect/connect";
import { Subject } from "@/models/subject.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await Connect();
    const subjects = await Subject.find().select("subjectCode subjectName -_id").sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: subjects });
  } catch (error) {
    console.error("Error fetching subjects", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch subjects" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await Connect();
    const body = await request.json();
    const { subjectCode, subjectName, credits, semester, department, totalClasses } = body;

    if (!subjectCode || !subjectName || !credits || !semester || !department) {
      return NextResponse.json(
        { success: false, message: "All required fields must be provided" },
        { status: 400 },
      );
    }

    const existing = await Subject.findOne({ subjectCode });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Subject code already exists" },
        { status: 409 },
      );
    }

    const subject = await Subject.create({
      subjectCode,
      subjectName,
      credits,
      semester: String(semester),
      department,
      totalClasses: totalClasses || 0,
      status: "active",
    });

    return NextResponse.json({
      success: true,
      message: "Subject added successfully",
      data: subject,
    });
  } catch (error) {
    console.error("Error adding subject", error);
    return NextResponse.json(
      { success: false, message: "Failed to add subject" },
      { status: 500 },
    );
  }
}
