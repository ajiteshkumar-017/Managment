import Connect from "@/dbConnect/connect";
import { Notice } from "@/models/notice.model";
import { User } from "@/models/user";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await Connect();

    const notices = await Notice.find()
      .populate({ path: "createdBy", model: User, select: "username email" })
      .sort({ date: -1 })
      .lean();

    const now = new Date();

    const data = notices.map((n: any) => {
      const expiry = n.expiryDate ? new Date(n.expiryDate) : null;
      const published = n.date ? new Date(n.date) : null;
      let status: "Active" | "Expired" | "Upcoming" = "Active";
      if (expiry && expiry < now) status = "Expired";
      else if (published && published > now) status = "Upcoming";

      return {
        _id: n._id,
        title: n.title,
        type: capitalizeType(n.type),
        audience: mapAudience(n.audience),
        publishedDate: formatDate(n.date),
        expiryDate: n.expiryDate ? formatDate(n.expiryDate) : "—",
        status,
        description: n.description || "",
        isImportant: Boolean(n.IsImportant),
      };
    });

    const stats = {
      total: data.length,
      active: data.filter((n) => n.status === "Active").length,
      expired: data.filter((n) => n.status === "Expired").length,
      upcoming: data.filter((n) => n.status === "Upcoming").length,
    };

    return NextResponse.json({ success: true, data, stats });
  } catch (error) {
    console.error("Error fetching notices", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch notices" },
      { status: 500 },
    );
  }
}

function formatDate(value?: Date | string) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function capitalizeType(type?: string) {
  if (!type) return "General";
  return type.charAt(0).toUpperCase() + type.slice(1);
}

function mapAudience(audience?: string) {
  if (!audience) return "All";
  if (audience === "Student Only") return "Students";
  if (audience === "Faculty Only") return "Faculty";
  if (audience === "Admin Only") return "Admin";
  return audience;
}
