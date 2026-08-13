import Connect from "@/dbConnect/connect";
import { Class } from "@/models/class.model";
import { Subject } from "@/models/subject.model";
import { User } from "@/models/user";
import { ClassEnrollement } from "@/models/classEnrollement";
import { NextResponse } from "next/server";
import { createRequestLogger } from "@/lib/requestLogger";

export async function GET() {
  const requestLogger = createRequestLogger();
  try {
    await Connect();

    const classes = await Class.find()
      .populate({ path: "subjectId", model: Subject, select: "subjectCode subjectName department" })
      .populate({ path: "facultyId", model: User, select: "username email" })
      .sort({ createdAt: -1 })
      .lean();

    const enrollmentCounts = await ClassEnrollement.aggregate([
      { $match: { status: "enrolled" } },
      {
        $group: {
          _id: "$classId",
          count: { $sum: 1 },
        },
      },
    ]);

    const countMap = new Map(
      enrollmentCounts.map((e: any) => [String(e._id), e.count]),
    );

    const data = classes.map((c: any) => {
      const subject = c.subjectId;
      const faculty = c.facultyId;
      return {
        _id: c._id,
        classNo: c.classCode || "—",
        room: c.room || "—",
        department: subject?.department || "—",
        subjectCode: subject?.subjectCode || "—",
        subjectName: subject?.subjectName || "—",
        faculty: faculty?.username || "—",
        capacity: countMap.get(String(c._id)) ?? 0,
        size: "—",
        amenities: "—",
        status: "Active" as const,
      };
    });

    const stats = {
      total: data.length,
      active: data.length,
      maintenance: 0,
      smartEquipped: 0,
    };

    requestLogger.info({ count: data.length }, "Classes fetched successfully");

    return NextResponse.json({ success: true, data, stats });
  } catch (error) {
    requestLogger.error({ err: error }, "Failed to fetch classes");
    return NextResponse.json(
      { success: false, message: "Failed to fetch classes" },
      { status: 500 },
    );
  }
}
