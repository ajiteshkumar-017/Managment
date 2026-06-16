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
        }
    }
)


export const Student = ( models.Student as mongoose.Model<IStudent> ) || model<IStudent>("Student", studentSchema);