import mongoose, {Schema, Document, model, models} from "mongoose"
import {
    DEPARTMENT,
    SEMESTER,
    ACADEMIC_YEAR,
    EXAM_RESULT_TYPE,
    RESULT_STATUS,
    type DepartmentType,
    type SemesterType,
    type AcademicYearType,
    type ExamResultType,
    type ResultStatusType,
} from "@/constant/Constant"

export interface IResultBatch extends Document {
    title: string,
    department: DepartmentType,
    semester: SemesterType,
    academicYear: AcademicYearType,
    ExamType: ExamResultType,
    /** Student batch year group, e.g. "2021-25" or "2023" */
    batch: string,
    subjectId: mongoose.Types.ObjectId,
    status: ResultStatusType,
    createdAt: Date,
    updatedAt: Date,
}

const resultBatchSchema = new Schema({ 
    title: {
        type: String,
        required: true,
        default: "Result Publication",
    },
    department:{
        type: String,
        enum: DEPARTMENT,
        required: true
    },
    semester:{
        type: Number,
        enum: SEMESTER,
        required: true
    },
    academicYear:{
        type: String,
        enum: ACADEMIC_YEAR,
        required: true
    },
    ExamType: {
        type: String,
        enum: EXAM_RESULT_TYPE,
        required: true
    },
    batch: {
        type: String,
        required: true,
        trim: true,
    },
    subjectId: {
        type: Schema.Types.ObjectId,
        ref: "Subject",
        required: true,
    },
    status: {
        type: String,
        enum: RESULT_STATUS,
        default: 'unpublished'
    },
}, { timestamps: true })

export const ResultBatch = models.ResultBatch as mongoose.Model<IResultBatch> || model<IResultBatch>('ResultBatch', resultBatchSchema);
