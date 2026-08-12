import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import QRCode from "qrcode";
import { AttendanceSession } from "@/models/attendanceSession";
import ConnectDB from "@/dbConnect/connect";
import { verifyJwt } from "@/lib/verifyJwt";
import { Faculty } from "@/models/faculty.model";
import { createRequestLogger } from "@/lib/requestLogger";
import { Class } from "@/models";

function generateSessionCode() {
  return Math.floor(100000 + Math.random() * 900000);
}

export async function GET(request: NextRequest) {
  try {
    const logger = createRequestLogger();
    await ConnectDB();

    const auth = await verifyJwt(request);
    if (auth.ok === false) {
      return auth.response;
    }

    const { _id: userId, email, role } = auth.payload;

    if (role !== "faculty" && role !== "admin") {
      logger.warn({ email, role }, "Unauthorized role tried to start attendance session");
      return NextResponse.json(
        { success: false, message: "Only faculty or admin can start an attendance session" },
        { status: 403 },
      );
    }

    const className = request.nextUrl.searchParams.get("className")?.trim();
    if (!className) {
      return NextResponse.json(
        { success: false, message: "className query param is required" },
        { status: 400 },
      );
    }

    const classData = await Class.findOne({ room: className });
    if (!classData) {
      logger.warn({ className }, "Class not found");
      return NextResponse.json(
        { success: false, message: "Class not found" },
        { status: 404 },
      );
    }

    let faculty = null;

    if (role === "faculty") {
      faculty = await Faculty.findOne({ userId });
      if (!faculty) {
        logger.warn({ userId, email }, "Faculty profile not found");
        return NextResponse.json(
          { success: false, message: "Faculty not found" },
          { status: 404 },
        );
      }

      if (String(classData.facultyId) !== String(userId)) {
        logger.warn(
          { userId, classFacultyId: classData.facultyId, className },
          "Faculty not assigned to this class",
        );
        return NextResponse.json(
          { success: false, message: "You are not assigned to this class" },
          { status: 403 },
        );
      }
    } else {
      // Admin can start for any class — attach the class's assigned faculty
      faculty = await Faculty.findOne({ userId: classData.facultyId });
      if (!faculty) {
        return NextResponse.json(
          { success: false, message: "Assigned faculty profile not found for this class" },
          { status: 404 },
        );
      }
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

    // Must match what the student scanner / mark API expects
    const qrPayload = JSON.stringify({
      sessionId: String(session._id),
      token: sessionToken,
      sessionCode,
      classId: String(classData._id),
    });
    const qrCodeDataUrl = await QRCode.toDataURL(qrPayload);

    logger.info(
      { sessionId: session._id, classId: classData._id, facultyId: faculty._id },
      "Attendance session started",
    );

    return NextResponse.json({
      success: true,
      message: "Attendance session started",
      data: {
        expiryTime: expiryTime.toISOString(),
        qrPayload: JSON.parse(qrPayload),
        qrCodeDataUrl,
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
