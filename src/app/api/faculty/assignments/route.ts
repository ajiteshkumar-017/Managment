import { NextRequest, NextResponse } from "next/server";
import Connect from "@/dbConnect/connect";
import { verifyJwt } from "@/lib/verifyJwt";
import { createRequestLogger } from "@/lib/requestLogger";
import { getFacultyByUserId } from "@/lib/faculty/helpers";
import { decodeResourceId } from "@/lib/idToken";
import { Assignment } from "@/models/assignment";
import { Subject } from "@/models/subject.model";
import { Class } from "@/models/class.model";
import cloudinary from "@/lib/cloudinary";
import mongoose from "mongoose";
import { notifyAssignmentPublished } from "@/services/notification/notifyEvent";

async function uploadAssignmentFile(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const safeName = file.name.replace(/[^\w.\-]+/g, "_");

  return new Promise<{ secure_url: string }>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "CollegeManagement/assignments",
          resource_type: "raw",
          public_id: `${Date.now()}-${safeName}`,
          timeout: 120000,
        },
        (error, result) => {
          if (error || !result?.secure_url) {
            reject(error || new Error("File upload failed"));
            return;
          }
          resolve({ secure_url: result.secure_url });
        },
      )
      .end(buffer);
  });
}

function mapAssignment(a: {
  _id: unknown;
  title: string;
  description: string;
  dueDate: Date;
  status: string;
  marks: number;
  department: string;
  semester: number;
  batch: string;
  section?: string;
  attachement?: string;
  subjectId: unknown;
}) {
  const subject = a.subjectId as {
    subjectName?: string;
    subjectCode?: string;
  } | null;
  return {
    id: String(a._id),
    title: a.title,
    description: a.description,
    dueDate: a.dueDate,
    status: a.status,
    marks: a.marks,
    department: a.department,
    semester: a.semester,
    batch: a.batch,
    section: a.section || "",
    attachement: a.attachement || "",
    subjectName: subject?.subjectName || "Subject",
    subjectCode: subject?.subjectCode || "—",
  };
}

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
      return NextResponse.json({ success: true, data: [] });
    }

    const assignments = await Assignment.find({ facultyId: faculty._id })
      .populate({ path: "subjectId", model: Subject, select: "subjectName subjectCode" })
      .sort({ dueDate: 1 })
      .lean();

    const data = assignments.map(mapAssignment);

    logger.info({ userId, count: data.length }, "Faculty assignments fetched");

    return NextResponse.json({ success: true, data });
  } catch (error) {
    logger.error({ err: error }, "Faculty assignments failed");
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

    const formData = await request.formData();
    const title = String(formData.get("title") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const dueDateRaw = String(formData.get("dueDate") || "").trim();
    const dueDate = dueDateRaw ? new Date(dueDateRaw) : null;
    const marks = Number(formData.get("marks"));
    const classToken = String(formData.get("classId") || "").trim();
    const publish = String(formData.get("publish") || "") === "true";
    const file = formData.get("file");

    if (!title || !description || !dueDate || Number.isNaN(dueDate.getTime())) {
      return NextResponse.json(
        { success: false, message: "Title, description and due date are required" },
        { status: 400 },
      );
    }

    const classId = await decodeResourceId(classToken, "class");
    if (!classId) {
      return NextResponse.json(
        { success: false, message: "Valid classId is required" },
        { status: 400 },
      );
    }

    let attachement = "—";
    if (file instanceof File && file.size > 0) {
      const uploaded = await uploadAssignmentFile(file);
      attachement = uploaded.secure_url;
    }

    if (!Number.isFinite(marks) || marks <= 0) {
      return NextResponse.json(
        { success: false, message: "Marks must be a positive number" },
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

    const assignment = await Assignment.create({
      title,
      description,
      attachement,
      dueDate,
      subjectId: cls.subjectId,
      facultyId: faculty._id,
      department: cls.department,
      semester: cls.semester,
      batch: cls.batch,
      section: cls.section,
      marks,
      status: publish ? "uploaded" : "draft",
    });

    logger.info(
      { assignmentId: assignment._id, status: assignment.status },
      "Faculty assignment created",
    );

    if (publish) {
      await notifyAssignmentPublished({
        classId: cls._id,
        department: cls.department,
        semester: cls.semester,
        batch: cls.batch,
        section: cls.section,
        title: assignment.title,
        dueDate: assignment.dueDate,
      });
    }

    return NextResponse.json({
      success: true,
      message: publish ? "Assignment published" : "Assignment saved as draft",
      data: { id: String(assignment._id), status: assignment.status },
    });
  } catch (error) {
    logger.error({ err: error }, "Faculty assignment create failed");
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
    const assignmentId = String(body.assignmentId || "").trim();

    if (!assignmentId || !mongoose.Types.ObjectId.isValid(assignmentId)) {
      return NextResponse.json(
        { success: false, message: "Valid assignmentId is required" },
        { status: 400 },
      );
    }

    const assignment = await Assignment.findOne({
      _id: assignmentId,
      facultyId: faculty._id,
    });

    if (!assignment) {
      return NextResponse.json(
        { success: false, message: "Assignment not found" },
        { status: 404 },
      );
    }

    const alreadyPublished = assignment.status === "uploaded";
    assignment.status = "uploaded";
    await assignment.save();

    logger.info({ assignmentId }, "Faculty assignment published");

    if (!alreadyPublished) {
      await notifyAssignmentPublished({
        department: assignment.department,
        semester: assignment.semester,
        batch: assignment.batch,
        section: assignment.section,
        title: assignment.title,
        dueDate: assignment.dueDate,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Assignment published",
      data: { id: String(assignment._id), status: assignment.status },
    });
  } catch (error) {
    logger.error({ err: error }, "Faculty assignment publish failed");
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
