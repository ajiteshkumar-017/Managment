import Connect from "@/dbConnect/connect";
import { Class } from "@/models/class.model";
import { Subject } from "@/models/subject.model";
import { User } from "@/models/user";
import { Enrollment } from "@/models/enrollement.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await Connect();

    const classes = await Class.find()
      .populate({ path: "subjectId", model: Subject, select: "subjectCode subjectName department" })
      .populate({ path: "facultyId", model: User, select: "username email" })
      .sort({ createdAt: -1 })
      .lean();

    const enrollmentCounts = await Enrollment.aggregate([
      { $match: { exitedAt: { $exists: true } } },
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

    return NextResponse.json({ success: true, data, stats });
  } catch (error) {
    console.error("Error fetching classes", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch classes" },
      { status: 500 },
    );
  }
}
