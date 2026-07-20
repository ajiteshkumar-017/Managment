import mongoose, { Schema, Document, model, models } from "mongoose";

export interface ISubjectFacultyAssignment extends Document {
  facultyId: mongoose.Types.ObjectId;
  subjectId: mongoose.Types.ObjectId;
  semester: string;
  section: string;
  department: string;
  academicYear: string;
}

const subjectFacultyAssignmentSchema = new Schema(
  {
    facultyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faculty",
      required: true,
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    semester: {
      type: String,
      required: true,
    },
    section: {
      type: String,
      default: "ALL",
    },
    department: {
      type: String,
      required: true,
    },
    academicYear: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const SubjectFacultyAssignment =
  (models.SubjectFacultyAssignment as mongoose.Model<ISubjectFacultyAssignment>) ||
  model<ISubjectFacultyAssignment>("SubjectFacultyAssignment", subjectFacultyAssignmentSchema);
