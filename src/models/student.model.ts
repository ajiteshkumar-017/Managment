import mongoose, {Schema, Document, models, model} from "mongoose";
import {
    DEPARTMENT,
    SEMESTER,
    STATUS,
    type DepartmentType,
    type SemesterType,
    type StatusType,
} from "@/constant/Constant";

export interface IStudent extends Document {
    userId: mongoose.Types.ObjectId,
    rollNumber : string,
    department : DepartmentType,
    semester: SemesterType,
    status: StatusType,
    section: string,
    batch: string,
    admissionYear: string,
    lastPromoted: Date,
}

const studentSchema = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,   
            ref: "User"
        },
        rollNumber: {
            type: String,
            required: false
        },
        department : {
            type: String,
            enum: DEPARTMENT,
            required: false
        },
        semester: {
            type: Number,
            enum: SEMESTER,
            required: false
        },
        section:{
            type: String,
            required: false
        },
        batch: {
            type: String,
            required: false
        },
        admissionYear: {
            type: String,
            required: false
        },
        status: {
            type: String,
            enum: STATUS,
            required: false,
        },
        lastPromoted: {
            type: Date,
            required: false
        }
    }, {timestamps : true}
)


export const Student = ( models.Student as mongoose.Model<IStudent> ) || model<IStudent>("Student", studentSchema);
