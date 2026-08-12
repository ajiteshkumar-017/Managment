import mongoose,{Schema, models, model, Document} from 'mongoose';
import { SEMESTER, type SemesterType } from "@/constant/Constant";

export interface ISemesterResult extends Document {
    studentId: mongoose.Types.ObjectId;
    semester: SemesterType;
    resultBatch: mongoose.Types.ObjectId;
    CGPA: number;
    SGPA: number;
    rank: number;
    passStatus : 'Pass' | 'Fail' | 'Withdraw' | 'Transfer';
    passStatusDate: Date;
    hadBack: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const semesterResultSchema = new Schema({
    studentId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    semester:{
        type: Number,
        enum: SEMESTER,
        required: true
    },
    resultBatch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ResultBatch',
        required: true
    },
    CGPA: {
        type: Number,
        required: true
    },
    SGPA: {
        type: Number,
        required: true
    },
    rank: {
        type: Number,
        required: true
    },
    passStatus : {
        type: String,
        enum: ['Pass', 'Fail', 'Withdraw', 'Transfer'],
        required: true
    },
    passStatusDate: {
        type: Date,
        required: true
    },
    hadBack: {
        type: Boolean,
        default: false
    },
}, {timestamps: true})


export const SemesterResult = (models.SemesterResult as mongoose.Model<ISemesterResult>) || model<ISemesterResult>('SemesterResult', semesterResultSchema);
