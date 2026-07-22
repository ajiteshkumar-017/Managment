import Connect from "@/dbConnect/connect";
import { Faculty } from "@/models/faculty.model";
import { User } from "@/models/user";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await Connect();

    const faculty = await Faculty.find()
      .populate({ path: "userId", model: User, select: "username email avatar" })
      .sort({ createdAt: -1 })
      .lean();

    const data = faculty
      .map((item: any) => {
        const user = item.userId;
        return {
          _id: item._id,
          username: user?.username?.trim() || "",
          name: user?.username?.trim() || "—",
          email: user?.email || "",
          department: item.department || "—",
          designation: item.designation || "—",
          status: normalizeFacultyStatus(item.status),
        };
      })
      .filter((item) => item.username);

    const stats = {
      total: data.length,
      active: data.filter((f) => f.status === "Active").length,
      onLeave: data.filter((f) => f.status === "On Leave").length,
      resigned: data.filter((f) => f.status === "Resigned").length,
    };

    return NextResponse.json({ success: true, data, stats });
  } catch (error) {
    console.error("Error fetching faculty list", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch faculty list" },
      { status: 500 },
    );
  }
}

function normalizeFacultyStatus(status?: string) {
  if (!status) return "Active";
  const lower = status.toLowerCase();
  if (lower === "active") return "Active";
  if (lower === "on leave" || lower === "onleave") return "On Leave";
  if (lower === "resigned") return "Resigned";
  return status;
}
