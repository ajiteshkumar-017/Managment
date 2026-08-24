import { NextRequest, NextResponse } from "next/server";
import { createRequestLogger } from "@/lib/requestLogger";
import { verifyJwt } from "@/lib/verifyJwt";
import { AttendanceRecord, Class, Student } from "@/models";
import { AttendanceSession } from "@/models/attendanceSession";
import Connect from "@/dbConnect/connect";
import { decodeResourceId } from "@/lib/idToken";
import mongoose from "mongoose";
import { notifyAttendanceMarked } from "@/services/notification/notifyEvent";

export async function POST(request: NextRequest) {
  try {
    const logger = createRequestLogger();
    await Connect();

    const auth = await verifyJwt(request);
    if (auth.ok === false) {
      return auth.response;
    }

    const { _id: userId, email, role } = auth.payload;
    const body = await request.json();
    const { sessionId, token } = body;

    if (role !== "student") {
      return NextResponse.json(
        {
          success: false,
          message: "Only authorised students can scan QR and mark present",
        },
        { status: 403 },
      );
    }

    if (!sessionId || !token) {
      return NextResponse.json(
        {
          success: false,
          message: "sessionId and token are required",
        },
        { status: 400 },
      );
    }

    const studentData = await Student.findOne({ userId });
    if (!studentData) {
      logger.warn({ userId, email }, "Student not found");
      return NextResponse.json(
        { success: false, message: "Student not found" },
        { status: 404 },
      );
    }

    const resolvedSessionId =
      (await decodeResourceId(sessionId, "session")) ||
      (mongoose.Types.ObjectId.isValid(sessionId) ? sessionId : null);

    if (!resolvedSessionId) {
      return NextResponse.json(
        { success: false, message: "Invalid sessionId" },
        { status: 400 },
      );
    }

    const sessionData = await AttendanceSession.findById(resolvedSessionId);
    if (!sessionData) {
      return NextResponse.json(
        { success: false, message: "Session not found" },
        { status: 404 },
      );
    };

    if (sessionData.status !== "active" || !sessionData.isActive) {
      return NextResponse.json(
        { success: false, message: "Session is not active" },
        { status: 400 },
      );
    }

    if (sessionData.expiryTime < new Date()) {
      await AttendanceSession.findByIdAndUpdate(sessionData._id, {
        isActive: false,
        status: "expired",
      });
      return NextResponse.json(
        { success: false, message: "Session has expired" },
        { status: 400 },
      );
    }

    if (sessionData.sessionToken !== token) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 400 },
      );
    };

    const classData = await Class.findOne({_id: sessionData.classId});

    if(!classData){
      return NextResponse.json(
        { success: false, message: "Class not found" },
        { status: 404 },
      );
    }

    if(String(classData.semester) !== String(studentData.semester) || String(classData.department) !== String(studentData.department) || String(classData.section) !== String(studentData.section) ){
      console.log("Student is not part of this class");
      return NextResponse.json(
        { success: false, message: "Student is not part of this class", data: {
        } },
        { status: 400 },
      );
    }

    const existing = await AttendanceRecord.findOne({
      studentId: studentData._id,
      sessionId: sessionData._id,
    });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Student already marked present" },
        { status: 400 },
      );
    }

    const attendanceRecord = await AttendanceRecord.create({
      studentId: studentData._id,
      sessionId: sessionData._id,
      markedAt: new Date(),
      method: "qr",
    });

    logger.info(
      { studentId: studentData._id, sessionId: sessionData._id },
      "Attendance marked via QR",
    );

    if (studentData.userId) {
      await notifyAttendanceMarked({
        userId: studentData.userId,
        classCode: classData.classCode,
        room: classData.room,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Attendance marked",
    });
  } catch (error) {
    console.error("Error marking attendance:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
