import { NextRequest, NextResponse } from "next/server";
import Connect from "@/dbConnect/connect";
import { verifyJwt } from "@/lib/verifyJwt";
import { createRequestLogger } from "@/lib/requestLogger";
import { getFacultyByUserId, getFacultyClasses } from "@/lib/faculty/helpers";
import { ResultBatch } from "@/models/resultBatch.model";
import { Class } from "@/models/class.model";
import {
  ACADEMIC_YEAR,
  EXAM_RESULT_TYPE,
  type AcademicYearType,
  type ExamResultType,
} from "@/constant/Constant";
import mongoose from "mongoose";
import { notifyResultPublished } from "@/services/notification/notifyEvent";

export async function GET(request: NextRequest) {
  const logger = createRequestLogger();

  try {
    await Connect();

    const auth = await verifyJwt(request);
    if (auth.ok === false) return auth.response;

    const { _id: userId, role } = auth.payload;
    if (role !== "faculty") {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 },
      );
    }

    const faculty = await getFacultyByUserId(String(userId));
    if (!faculty) {
      return NextResponse.json(
        { success: false, message: "Faculty profile not found" },
        { status: 404 },
      );
    }

    const classes = await getFacultyClasses(String(userId));
    const subjectIds = classes
      .map((c) => c.subjectId)
      .filter(Boolean)
      .map((id) => new mongoose.Types.ObjectId(id));

    const batches = subjectIds.length
      ? await ResultBatch.find({ subjectId: { $in: subjectIds } })
          .sort({ updatedAt: -1 })
          .lean()
      : [];

    const data = classes.map((cls) => {
      const matching = batches.find(
        (b) =>
          String(b.subjectId) === cls.subjectId &&
          b.department === cls.department &&
          Number(b.semester) === Number(cls.semester) &&
          String(b.batch) === String(cls.batch),
      );

      return {
        classId: cls.id,
        subjectId: cls.subjectId,
        subjectName: cls.subjectName,
        subjectCode: cls.subjectCode,
        department: cls.department,
        semester: cls.semester,
        section: cls.section,
        batch: cls.batch,
        studentCount: cls.studentCount,
        resultBatchId: matching ? String(matching._id) : null,
        examType: matching?.ExamType || "",
        academicYear: matching?.academicYear || "",
        status: matching?.status || "unpublished",
      };
    });

    logger.info({ userId, count: data.length }, "Faculty results overview fetched");

    return NextResponse.json({ success: true, data });
  } catch (error) {
    logger.error({ err: error }, "Faculty results failed");
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const logger = createRequestLogger();

  try {
    await Connect();

    const auth = await verifyJwt(request);
    if (auth.ok === false) return auth.response;

    const { _id: userId, role } = auth.payload;
    if (role !== "faculty") {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 },
      );
    }

    const faculty = await getFacultyByUserId(String(userId));
    if (!faculty) {
      return NextResponse.json(
        { success: false, message: "Faculty profile not found" },
        { status: 404 },
      );
    }

    const body = await request.json();
    const classId = String(body.classId || "").trim();
    const examType = String(body.ExamType || body.examType || "").trim() as ExamResultType;
    const academicYear = String(body.academicYear || "").trim() as AcademicYearType;
    const title = String(body.title || "").trim();
    const publish = Boolean(body.publish);

    if (!classId || !mongoose.Types.ObjectId.isValid(classId)) {
      return NextResponse.json(
        { success: false, message: "Valid classId is required" },
        { status: 400 },
      );
    }

    if (!EXAM_RESULT_TYPE.includes(examType)) {
      return NextResponse.json(
        { success: false, message: "Exam type must be Mid Sem or End Sem" },
        { status: 400 },
      );
    }

    if (!ACADEMIC_YEAR.includes(academicYear)) {
      return NextResponse.json(
        { success: false, message: "Invalid academic year" },
        { status: 400 },
      );
    }

    const cls = await Class.findById(classId).lean();
    if (!cls) {
      return NextResponse.json(
        { success: false, message: "Class not found" },
        { status: 404 },
      );
    }

    if (String(cls.facultyId) !== String(userId)) {
      return NextResponse.json(
        { success: false, message: "You are not assigned to this class" },
        { status: 403 },
      );
    }

    const existingQuery = {
      subjectId: cls.subjectId,
      department: cls.department,
      semester: cls.semester,
      batch: cls.batch,
      ExamType: examType,
      academicYear,
    };
    const existing = await ResultBatch.findOne(existingQuery as never);

    if (existing) {
      existing.title =
        title ||
        existing.title ||
        `${examType} Result · ${cls.department} Sem ${cls.semester}`;
      const becomingPublished = publish && existing.status !== "published";
      existing.status = publish ? "published" : existing.status || "unpublished";
      await existing.save();

      logger.info({ resultBatchId: existing._id, publish }, "Faculty result batch updated");

      if (becomingPublished) {
        await notifyResultPublished({
          classId: cls._id,
          department: cls.department,
          semester: cls.semester,
          batch: cls.batch,
          exam: examType,
        });
      }

      return NextResponse.json({
        success: true,
        message: publish ? "Result published" : "Result batch updated",
        data: { id: String(existing._id), status: existing.status },
      });
    }

    const created = await ResultBatch.create({
      title: title || `${examType} Result · ${cls.department} Sem ${cls.semester}`,
      department: cls.department,
      semester: cls.semester,
      academicYear,
      ExamType: examType,
      batch: cls.batch,
      subjectId: cls.subjectId,
      status: publish ? "published" : "unpublished",
    } as never);
    const batch = Array.isArray(created) ? created[0] : created;

    logger.info({ resultBatchId: batch._id, publish }, "Faculty result batch created");

    if (publish) {
      await notifyResultPublished({
        classId: cls._id,
        department: cls.department,
        semester: cls.semester,
        batch: cls.batch,
        exam: examType,
      });
    }

    return NextResponse.json({
      success: true,
      message: publish ? "Result published" : "Result saved as unpublished",
      data: { id: String(batch._id), status: batch.status },
    });
  } catch (error) {
    logger.error({ err: error }, "Faculty result publish failed");
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  const logger = createRequestLogger();

  try {
    await Connect();

    const auth = await verifyJwt(request);
    if (auth.ok === false) return auth.response;

    const { _id: userId, role } = auth.payload;
    if (role !== "faculty") {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 },
      );
    }

    const faculty = await getFacultyByUserId(String(userId));
    if (!faculty) {
      return NextResponse.json(
        { success: false, message: "Faculty profile not found" },
        { status: 404 },
      );
    }

    const body = await request.json();
    const resultBatchId = String(body.resultBatchId || "").trim();
    const classId = String(body.classId || "").trim();

    if (resultBatchId && mongoose.Types.ObjectId.isValid(resultBatchId)) {
      const batch = await ResultBatch.findById(resultBatchId);
      if (!batch) {
        return NextResponse.json(
          { success: false, message: "Result batch not found" },
          { status: 404 },
        );
      }

      const ownsClass = await Class.findOne({
        facultyId: userId,
        subjectId: batch.subjectId,
        department: batch.department,
        semester: batch.semester,
        batch: batch.batch,
      }).lean();

      if (!ownsClass) {
        return NextResponse.json(
          { success: false, message: "You are not assigned to this result" },
          { status: 403 },
        );
      }

      const becomingPublished = batch.status !== "published";
      batch.status = "published";
      await batch.save();

      logger.info({ resultBatchId }, "Faculty result published");

      if (becomingPublished) {
        await notifyResultPublished({
          classId: ownsClass._id,
          department: batch.department,
          semester: batch.semester,
          batch: batch.batch,
          exam: batch.ExamType,
        });
      }

      return NextResponse.json({
        success: true,
        message: "Result published",
        data: { id: String(batch._id), status: batch.status },
      });
    }

    if (classId && mongoose.Types.ObjectId.isValid(classId)) {
      const cls = await Class.findById(classId).lean();
      if (!cls || String(cls.facultyId) !== String(userId)) {
        return NextResponse.json(
          { success: false, message: "Class not found or not assigned" },
          { status: 403 },
        );
      }

      const batchQuery = {
        subjectId: cls.subjectId,
        department: cls.department,
        semester: cls.semester,
        batch: cls.batch,
      };
      const batch = await ResultBatch.findOne(batchQuery as never).sort({
        updatedAt: -1,
      });

      if (!batch) {
        return NextResponse.json(
          { success: false, message: "No result batch found for this class" },
          { status: 404 },
        );
      }

      const becomingPublished = batch.status !== "published";
      batch.status = "published";
      await batch.save();

      if (becomingPublished) {
        await notifyResultPublished({
          classId: cls._id,
          department: cls.department,
          semester: cls.semester,
          batch: cls.batch,
          exam: batch.ExamType,
        });
      }

      return NextResponse.json({
        success: true,
        message: "Result published",
        data: { id: String(batch._id), status: batch.status },
      });
    }

    return NextResponse.json(
      { success: false, message: "resultBatchId or classId is required" },
      { status: 400 },
    );
  } catch (error) {
    logger.error({ err: error }, "Faculty result patch failed");
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
