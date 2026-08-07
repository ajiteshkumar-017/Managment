import mongoose, {Schema, Document, } from "mongoose";
import { ACADEMIC_YEAR, DEPARTMENT, DepartmentType, SEMESTER } from "../constant/Constant";

export interface IAssignment extends Document {
    studentId: string;
    subjectId: string;
    facultyId: string;
    departmentId: string;
    semester: number;
    batch: string;
    marks: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

const assignmentSchema = new Schema(
    {
        title:{
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        attachement:{
            type: String,
            required: true,
        },
        dueDate: {
            type: Date,
            required: true,
        },
        subjectId:{
            type: Schema.Types.ObjectId,
            ref: "Subject",
            required: true,
        },
        facultyId: {
            type: Schema.Types.ObjectId,
            ref: "Faculty",
            required: true,
        },
        department: {
            type: String,
            enum: DEPARTMENT,
            required: true,
        },
        semester:{
            type: Number,
            enum: SEMESTER,
            required: true,
        },
        batch:{
            type: String,
            required: true,
        },
        marks: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["uploaded", "draft", "unpublished"],
            default: "draft",
        },
    },
    { timestamps: true }
);

export const Assignment = mongoose.model<IAssignment>("Assignment", assignmentSchema);