import mongoose, { Schema, Document, model, models } from "mongoose";

export interface ISubject extends Document {
    semester: string,
    credits: number,
    subjectCode: string,
    subjectName: string,
    totalClasses: number
}

const subjectSchema = new Schema(
    {
        credits: {
            type: Number,
            required: true
        },
        semester: {
            type:String,
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
        }
    }, { timestamps: true }
)


export const Subject = (models.Subject as mongoose.Model<ISubject>) || model<ISubject>("Subject", subjectSchema)