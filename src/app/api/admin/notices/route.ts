import Connect from "@/dbConnect/connect";
import { Notice } from "@/models/notice.model";
import { User } from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import { createRequestLogger } from "@/lib/requestLogger";
import { requireAdmin } from "@/lib/requireRole";
import { parseNoticePayload } from "@/lib/notices/parsePayload";
import { serializeNotice } from "@/lib/notices/serialize";
import { AUDIT_ACTION, AUDIT_ENTITY_TYPE } from "@/constant/audit";
import { writeAuditFromRequest } from "@/lib/systemUses/audit/writeAuditFromRequest";
import { notifyNoticePublished } from "@/services/notification/notifyEvent";

function isPublished(date: Date, now = new Date()) {
  return date.getTime() <= now.getTime();
}

export async function GET(request: NextRequest) {
  const requestLogger = createRequestLogger();
  try {
    const auth = await requireAdmin(request);
    if (auth.ok === false) return auth.response;

    await Connect();

    const notices = await Notice.find()
      .populate({ path: "createdBy", model: User, select: "username email" })
      .sort({ date: -1 })
      .lean();

    const now = new Date();
    const data = notices.map((n) => serializeNotice(n, now));

    const stats = {
      total: data.length,
      active: data.filter((n) => n.status === "Active").length,
      expired: data.filter((n) => n.status === "Expired").length,
      upcoming: data.filter((n) => n.status === "Upcoming").length,
    };

    requestLogger.info(
      { count: data.length, adminId: String(auth.user._id) },
      "Notices fetched successfully",
    );

    return NextResponse.json({ success: true, data, stats });
  } catch (error) {
    requestLogger.error({ err: error }, "Failed to fetch notices");
    return NextResponse.json(
      { success: false, message: "Failed to fetch notices" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const requestLogger = createRequestLogger();
  try {
    const auth = await requireAdmin(request);
    if (auth.ok === false) return auth.response;

    await Connect();

    const parsed = parseNoticePayload(await request.json());
    if (parsed.ok === false) {
      requestLogger.warn({ reason: parsed.message }, "Invalid notice payload");
      return NextResponse.json(
        { success: false, message: parsed.message },
        { status: 400 },
      );
    }

    const notice = await Notice.create({
      title: parsed.data.title,
      description: parsed.data.description,
      type: parsed.data.type,
      audience: parsed.data.audience,
      date: parsed.data.publishedDate,
      expiryDate: parsed.data.expiryDate,
      IsImportant: parsed.data.isImportant,
      createdBy: auth.user._id,
    });

    if (isPublished(parsed.data.publishedDate)) {
      await notifyNoticePublished({
        title: parsed.data.title,
        description: parsed.data.description,
        audience: parsed.data.audience,
      });
    }

    await writeAuditFromRequest(request, {
      action: AUDIT_ACTION.NOTICE_CREATE,
      entityType: AUDIT_ENTITY_TYPE.NOTICE,
      entityId: notice._id,
      description: `Published notice "${parsed.data.title}" to ${parsed.data.audience}`,
      metadata: {
        audience: parsed.data.audience,
        type: parsed.data.type,
        publishedDate: parsed.data.publishedDate,
        expiryDate: parsed.data.expiryDate,
      },
      severity: "medium",
    });

    requestLogger.info(
      {
        noticeId: String(notice._id),
        audience: parsed.data.audience,
        adminId: String(auth.user._id),
      },
      "Notice published",
    );

    return NextResponse.json({
      success: true,
      message: "Notice published",
      data: serializeNotice(notice.toObject()),
    });
  } catch (error) {
    requestLogger.error({ err: error }, "Failed to publish notice");
    return NextResponse.json(
      { success: false, message: "Failed to publish notice" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  const requestLogger = createRequestLogger();
  try {
    const auth = await requireAdmin(request);
    if (auth.ok === false) return auth.response;

    await Connect();

    const body = await request.json();
    const id = typeof body?._id === "string" ? body._id : "";
    if (!id || !Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Valid notice id is required" },
        { status: 400 },
      );
    }

    const parsed = parseNoticePayload(body);
    if (parsed.ok === false) {
      requestLogger.warn({ reason: parsed.message }, "Invalid notice payload");
      return NextResponse.json(
        { success: false, message: parsed.message },
        { status: 400 },
      );
    }

    const updated = await Notice.findByIdAndUpdate(
      id,
      {
        title: parsed.data.title,
        description: parsed.data.description,
        type: parsed.data.type,
        audience: parsed.data.audience,
        date: parsed.data.publishedDate,
        expiryDate: parsed.data.expiryDate,
        IsImportant: parsed.data.isImportant,
      },
      { new: true, runValidators: true },
    ).lean();

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Notice not found" },
        { status: 404 },
      );
    }

    await writeAuditFromRequest(request, {
      action: AUDIT_ACTION.NOTICE_UPDATE,
      entityType: AUDIT_ENTITY_TYPE.NOTICE,
      entityId: updated._id,
      description: `Updated notice "${parsed.data.title}" audience ${parsed.data.audience}`,
      metadata: {
        audience: parsed.data.audience,
        type: parsed.data.type,
      },
      severity: "medium",
    });

    requestLogger.info(
      {
        noticeId: String(updated._id),
        audience: parsed.data.audience,
        adminId: String(auth.user._id),
      },
      "Notice updated",
    );

    return NextResponse.json({
      success: true,
      message: "Notice updated",
      data: serializeNotice(updated),
    });
  } catch (error) {
    requestLogger.error({ err: error }, "Failed to update notice");
    return NextResponse.json(
      { success: false, message: "Failed to update notice" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  const requestLogger = createRequestLogger();
  try {
    const auth = await requireAdmin(request);
    if (auth.ok === false) return auth.response;

    await Connect();

    const id = request.nextUrl.searchParams.get("id") || "";
    if (!id || !Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Valid notice id is required" },
        { status: 400 },
      );
    }

    const deleted = await Notice.findByIdAndDelete(id).lean();
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Notice not found" },
        { status: 404 },
      );
    }

    await writeAuditFromRequest(request, {
      action: AUDIT_ACTION.NOTICE_DELETE,
      entityType: AUDIT_ENTITY_TYPE.NOTICE,
      entityId: deleted._id,
      description: `Deleted notice "${deleted.title}"`,
      metadata: { audience: deleted.audience },
      severity: "high",
    });

    requestLogger.info(
      { noticeId: id, adminId: String(auth.user._id) },
      "Notice deleted",
    );

    return NextResponse.json({
      success: true,
      message: "Notice deleted",
    });
  } catch (error) {
    requestLogger.error({ err: error }, "Failed to delete notice");
    return NextResponse.json(
      { success: false, message: "Failed to delete notice" },
      { status: 500 },
    );
  }
}
