import Connect from "@/dbConnect/connect";
import { Faculty } from "@/models/faculty.model";
import { User } from "@/models/user";
import { NextResponse } from "next/server";
import { createRequestLogger } from "@/lib/requestLogger";

export async function GET() {
  const requestLogger = createRequestLogger();
  try {
    await Connect();

    // const facultyDetail= await User.find({role: "faculty"});

    const faculty = await Faculty.find()
      .populate({ path: "userId", model: User, select: "username" })
      .sort({ createdAt: -1 });

    const safeFaculty = faculty
      .map((item) => {
        const user = item.userId as { username?: string } | null;
        return {
          username: user?.username?.trim() || "",
          department: item.department,
          designation: item.designation,
        };
      })
      .filter((item) => item.username);

    requestLogger.info({ count: safeFaculty.length }, "Faculty list fetched successfully");
    return NextResponse.json({ success: true, data: safeFaculty });
  } catch (error) {
    requestLogger.error({ err: error }, "Failed to fetch faculty list");
    console.error("Error fetching faculty list", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch faculty list" },
      { status: 500 },
    );
  }
}
