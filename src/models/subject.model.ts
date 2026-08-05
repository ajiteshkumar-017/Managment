import mongoose, { Schema, Document, model, models } from "mongoose";
import {
    DEPARTMENT,
    SEMESTER,
    STATUS,
    type DepartmentType,
    type SemesterType,
    type StatusType,
} from "@/constant/Constant";

export interface ISubject extends Document {
    semester: SemesterType,
    credits: number,
    subjectCode: string,
    subjectName: string,
    totalClasses: number,
    department: DepartmentType,
    IspracticalSubject: boolean,
    status: StatusType
}

const subjectSchema = new Schema(
    {
        credits: {
            type: Number,
            required: true
        },
        semester: {
            type: Number,
            enum: SEMESTER,
            required: true
        },
        subjectCode: {
            type: String,
            required: true,
            unique: true
        },
        subjectName: {
            type: String,
            required: true
        },
        totalClasses: {
            type: Number,
            required:false
        },
        department: {
            type: String,
            enum: DEPARTMENT,
            required: true,
            default: "CSE"
        },
        IspracticalSubject: {
            type: Boolean,
            required: true
        },
        status: {
            type: String,
            enum: STATUS,
            default: "active"
        }
    }, { timestamps: true }
)


export const Subject = (models.Subject as mongoose.Model<ISubject>) || model<ISubject>("Subject", subjectSchema)
