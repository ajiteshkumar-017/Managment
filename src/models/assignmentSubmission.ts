import mongoose, { Schema, Document } from "mongoose";

export interface IAssignmentSubmission extends Document {
    assignmentId: string;
    studentId: string;
    submissionDate: Date;
    submissionTime: Date;
    submissionStatus: string;
    markProvided: number;
    status: string;
    remark: string;
    attachement: string;
    updatedAt: Date;
    createdAt: Date;
}
const assignmentSubmissionSchema = new Schema({
    assignmentId: {
        type: Schema.Types.ObjectId,
        ref: "Assignment",
        required: true,
    },
    studentId: {
        type: Schema.Types.ObjectId,
        ref: "Student",
        required: true,
    },
    submissionDate: {
        type: Date,
        required: true,
    },
    submissionTime: {
        type: Date,
        required: true,
    },
    submissionStatus: {
        type: String,
        enum: ["submitted", "draft", "unsubmitted"],
        default: "draft",
    },
    markProvided:{
        type: Number,
        required: true,
    },
    status:{
        type: String,
        enum: ["published", "unpublished", "draft"],
        default: "draft",
    },
    remark:{
        type: String,
        required: true,
    },
    attachement:{
        type: String,
        required: true,
    },
    
},{timestamps: true})

const AssignmentSubmission = mongoose.model<IAssignmentSubmission>("AssignmentSubmission", assignmentSubmissionSchema);