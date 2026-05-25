import mongoose, { Schema, Document, model, models } from "mongoose";


export interface IEnrollment extends Document{
    studentId: mongoose.Types.ObjectId
classId: mongoose.Types.ObjectId
    enrolledAt: Date,
    exitedAt: Date
}

const enrollementSchema = new Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        classId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Class",
            required: true,
        },
        enrolledAt: {
            type: Date,
            required: true,
        },
        exitedAt: {
            type: Date,
            required: true
        }
    }
)


export const Enrollment = (models.Enrollment as mongoose.Model<IEnrollment>) || model<IEnrollment>("Enrollment", enrollementSchema)