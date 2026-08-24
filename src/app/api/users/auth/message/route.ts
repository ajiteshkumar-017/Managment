import { NextResponse, NextRequest } from "next/server";
import Connect from "@/dbConnect/connect";
import { Notice } from "@/models/notice.model";
import { resolveAuthUser } from "@/lib/resolveAuthUser";
import { createRequestLogger } from "@/lib/requestLogger";
import { noticeVisibilityFilter } from "@/lib/notices/audience";
import { serializePublicNotice } from "@/lib/notices/serialize";

export async function GET(request: NextRequest) {
  const requestLogger = createRequestLogger();
  try {
    await Connect();

    const auth = await resolveAuthUser(request);
    if (auth.ok === false) return auth.response;

    const role = auth.user.role;
    const notices = await Notice.find(noticeVisibilityFilter(role, "inbox"))
      .select("title description date type expiryDate IsImportant audience")
      .sort({ date: -1 })
      .limit(20)
      .lean();

    requestLogger.info(
      {
        userId: String(auth.user._id),
        role,
        noticeCount: notices.length,
      },
      "Visible notices fetched",
    );

    return NextResponse.json(
      {
        success: true,
        message: "Dashboard data fetched successfully",
        notices: notices.map((notice) => serializePublicNotice(notice)),
        username: auth.user.username,
      },
      { status: 200 },
    );
  } catch (err) {
    requestLogger.error({ err }, "Message/notices fetch failed");
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 },
    );
  }
}
