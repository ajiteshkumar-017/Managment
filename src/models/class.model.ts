import mongoose, {Schema, model, models} from "mongoose"

export interface IClass extends Document {
    subjectId: Object
    facultyId: Object
    classCode: string
    room: string
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

    room: {
        type: String
    }

}, { timestamps: true })


export const Class =   (models.Class as mongoose.Model<IClass>) || model<IClass>("Class", classSchema)