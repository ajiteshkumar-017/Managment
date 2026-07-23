import Connect from "@/dbConnect/connect";
import { Faculty } from "@/models/faculty.model";
import { User } from "@/models/user";
import { NextResponse } from "next/server";
import { createRequestLogger } from "@/lib/requestLogger";

type PopulatedUser = {
  username?: string;
  email?: string;
  avatar?: string;
} | null;

function isActiveStatus(status?: string) {
  if (!status) return true;
  const lower = status.toLowerCase();
  return lower !== "resigned";
}

export async function GET() {
  const requestLogger = createRequestLogger();

  try {
    await Connect();

    const faculty = await Faculty.find()
      .populate({
        path: "userId",
        model: User,
        select: "username email avatar",
      })
      .select("userId designation department patents prominentWork status")
      .sort({ designation: 1, createdAt: -1 })
      .lean();

    const data = faculty
      .filter((item) => isActiveStatus(item.status as string | undefined))
      .map((item) => {
        const user = item.userId as PopulatedUser;
        const name = user?.username?.trim() || "";
        const email = user?.email?.trim() || "";
        const patents = Array.isArray(item.patents)
          ? item.patents.map((p) => String(p).trim()).filter(Boolean)
          : [];
        const prominentWork =
          typeof item.prominentWork === "string"
            ? item.prominentWork.trim()
            : "";

        return {
          name,
          email,
          designation: (item.designation || "Faculty").trim(),
          department: item.department ? String(item.department).trim() : "",
          avatar: user?.avatar || "",
          ...(patents.length > 0 ? { patents } : {}),
          ...(prominentWork ? { prominentWork } : {}),
        };
      })
      .filter((item) => item.name && item.email);

    requestLogger.info({ count: data.length }, "Public faculty list fetched");

    return NextResponse.json({ success: true, data });
  } catch (error) {
    requestLogger.error({ err: error }, "Failed to fetch public faculty list");
    return NextResponse.json(
      { success: false, message: "Failed to fetch faculty" },
      { status: 500 },
    );
  }
}
