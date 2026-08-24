import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import QRCode from "qrcode";
import { AttendanceSession } from "@/models/attendanceSession";
import Connect from "@/dbConnect/connect";
import { verifyJwt } from "@/lib/verifyJwt";
import { Faculty } from "@/models/faculty.model";
import { createRequestLogger } from "@/lib/requestLogger";
import { Class } from "@/models";
import { decodeResourceId, encodeResourceId } from "@/lib/idToken";
import { AUDIT_ACTION, AUDIT_ENTITY_TYPE } from "@/constant/audit";
import { writeAuditFromRequest } from "@/lib/systemUses/audit/writeAuditFromRequest";

function generateSessionCode() {
  return Math.floor(100000 + Math.random() * 900000);
}

export async function GET(request: NextRequest) {
  try {
    const logger = createRequestLogger();
    await Connect();

    const auth = await verifyJwt(request);
    if (auth.ok === false) {
      return auth.response;
    }

    const { _id: userId, email, role } = auth.payload;

    if (role !== "faculty") {
      logger.warn({ email, role }, "Unauthorized role tried to start attendance session");
      return NextResponse.json(
        { success: false, message: "Only faculty can start an attendance session" },
        { status: 403 },
      );
    }

    const classToken = request.nextUrl.searchParams.get("classId")?.trim();
    const className = request.nextUrl.searchParams.get("className")?.trim();

    if (!classToken && !className) {
      return NextResponse.json(
        { success: false, message: "classId or className query param is required" },
        { status: 400 },
      );
    }

    const classId = classToken ? await decodeResourceId(classToken, "class") : null;
    if (classToken && !classId) {
      return NextResponse.json(
        { success: false, message: "Invalid class id" },
        { status: 400 },
      );
    }

    const classData = classId
      ? await Class.findById(classId)
      : await Class.findOne({ room: className });

    if (!classData) {
      logger.warn({ classId, className }, "Class not found");
      return NextResponse.json(
        { success: false, message: "Class not found" },
        { status: 404 },
      );
    }

    const faculty = await Faculty.findOne({ userId });
    if (!faculty) {
      logger.warn({ userId, email }, "Faculty profile not found");
      return NextResponse.json(
        { success: false, message: "Faculty not found" },
        { status: 404 },
      );
    }

    if (String(classData.facultyId) !== String(userId)) {
      logger.warn(
        { userId, classFacultyId: classData.facultyId, classId, className },
        "Faculty not assigned to this class",
      );
      return NextResponse.json(
        { success: false, message: "You are not assigned to this class" },
        { status: 403 },
      );
    }

    await AttendanceSession.updateMany(
      { classId: classData._id, isActive: true },
      { $set: { isActive: false, status: "closed" } },
    );

    const startedAt = new Date();
    const expiryTime = new Date(startedAt.getTime() + 3 * 60 * 1000);
    const sessionToken = crypto.randomBytes(32).toString("hex");
    const sessionCode = generateSessionCode();

    const session = await AttendanceSession.create({
      classId: classData._id,
      facultyId: faculty._id,
      sessionCode,
      sessionToken,
      startedAt,
      expiryTime,
      isActive: true,
      status: "active",
    });

    const encodedSessionId = await encodeResourceId(String(session._id), "session");
    const encodedClassId = await encodeResourceId(String(classData._id), "class");

    // Must match what the student scanner / mark API expects
    const qrPayload = JSON.stringify({
      sessionId: encodedSessionId,
      token: sessionToken,
      sessionCode,
      classId: encodedClassId,
    });
    const qrCodeDataUrl = await QRCode.toDataURL(qrPayload);

    logger.info(
      { sessionId: session._id, classId: classData._id, facultyId: faculty._id },
      "Attendance session started",
    );

    await writeAuditFromRequest(request, {
      action: AUDIT_ACTION.ATTENDANCE_SESSION_START,
      entityType: AUDIT_ENTITY_TYPE.ATTENDANCE_SESSION,
      entityId: session._id,
      description: `Started attendance session for class ${classData.classCode}`,
      metadata: { classId: String(classData._id), classCode: classData.classCode },
      severity: "medium",
    });

    return NextResponse.json({
      success: true,
      message: "Attendance session started",
      data: {
        expiryTime: expiryTime.toISOString(),
        qrPayload: JSON.parse(qrPayload),
        qrCodeDataUrl,
        sessionId: encodedSessionId,
        class: {
          id: encodedClassId,
          room: classData.room || "",
          classCode: classData.classCode,
          department: classData.department,
          semester: classData.semester,
          section: classData.section,
        },
      },
    });
  } catch (error) {
    console.error("Error starting attendance session:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
