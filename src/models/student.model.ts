import mongoose, {Schema, Document, models, model} from "mongoose";

export interface IStudent extends Document {
    userId: mongoose.Types.ObjectId,
    rollNumber : string,
    department : string,
    semester: number,
    status: string,
    section: string,
    batch: string,
    admissionYear: string
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
            required: false
        },
        semester: {
            type: Number,
            required: false
        },
        section:{
            type: String,
            required: false
        },
        lastSem:{

        },

        examStatus:{
            type: String,
            enum: ["passed", "back", "failed", "not_attended"],
            default: "not_attended",
            required: false
        },

        status: {
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
        lastPromoted: {
            type: Date,
            required: false
        }
    }, {timestamps : true}
)


export const Student = ( models.Student as mongoose.Model<IStudent> ) || model<IStudent>("Student", studentSchema);