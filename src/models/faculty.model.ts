import mongoose, {Schema, Document,model, models} from "mongoose";


interface IFaculty extends Document{
    userId: mongoose.Types.ObjectId,
    designation: string,
    salary: number,
    department: string,
    status: string,
    joinedAt: Date,
    lastPromoted: string
}

const facultySchema = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        designation: {
            type: String,
            default: "Assistant Proffessor"
        },
        salary: {
            type: Number
        },
        department: {
            type: String
        },
        status: {
            type: String
        },
        joinedAt: {
            type: Date
        },
        lastPromoted: {
            type: String
        }
    }, {timestamps: true}
)


export const Faculty = (models.Faculty as mongoose.Model<IFaculty>) || model<IFaculty>("Faculty", facultySchema);

