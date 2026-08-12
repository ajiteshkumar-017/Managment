import { DEPARTMENT, SEMESTER } from "@/constant/Constant"
import mongoose, {Schema, model, models} from "mongoose"

export interface IClass extends Document {
    subjectId: mongoose.Types.ObjectId
    facultyId: mongoose.Types.ObjectId
    classCode: string
    room: string
    day: string
    startTime: string
    endTime: string
    department: string
    semester: number
    batch: string
}

const classSchema = new mongoose.Schema({
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
        required: true
    },
    facultyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    classCode: {
        type: String,
        required: true
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
    batch:{
        type: String,
        required: true
    },

    room: {
        type: String
    },
    day:{
        type: String,
        enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        required: true
    },
    startTime:{
        type: String,
        required: true
    },
    endTime:{
        type: String,
        required: true
    },

}, { timestamps: true })


export const Class =   (models.Class as mongoose.Model<IClass>) || model<IClass>("Class", classSchema)