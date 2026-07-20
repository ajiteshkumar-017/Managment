import Connect from "@/dbConnect/connect";
import { Faculty } from "@/models/faculty.model";
import { User } from "@/models/user";
import { NextResponse } from "next/server";

export async function GET() {
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

    return NextResponse.json({ success: true, data: safeFaculty });
  } catch (error) {
    console.error("Error fetching faculty list", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch faculty list" },
      { status: 500 },
    );
  }
}
