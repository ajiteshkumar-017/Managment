import mongoose,{Schema, models, model, Document} from 'mongoose';
// import { RESULT_STATUS } from '@/constant/Constant.type';

export interface ISubjectResult extends Document {
    semesterResultId: mongoose.Schema.Types.ObjectId;
    subjectId: mongoose.Schema.Types.ObjectId;
    grade: string;
    maximumMarks: number;
    obtainedMarks: number;
    creditsEarned: number;
    resultStatus: "passed" | "back" | "failed" | "not_attended";
    createdAt: Date;
    updatedAt: Date;
}

const subjectResultSchema = new Schema({
    semesterResultId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SemesterResult',
        required: true
    },
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
    },
    grade: {
        type: String,
        required: true
    },
    maximumMarks: {
        type: Number,
        required: true
    },
    obtainedMarks: {
        type: Number,
        required: true,
        default: 0
    },
    creditsEarned: {
        type: Number,
        required: true
    },
    resultStatus: {
        type: String,
        enum: ["passed", "back", "failed", "not_attended"],
        required: true,
        default: "not_attended"
    },
}, {timestamps: true})

export const SubjectResult = (models.SubjectResult  as mongoose.Model<ISubjectResult>) || model<ISubjectResult>('SubjectResult', subjectResultSchema);