import mongoose, {Schema, Document, model, models} from "mongoose"

export interface IExamResult extends Document {
    userId: string,
    studentId: string,
    subjectId: string,
    examType: 'Mid Sem' | 'End Sem' | 'Internal' | 'Supplementary',
    examPublishedStatus: 'pending' | 'published' | 'failed',
    examResult: 'passed' | 'back' | 'failed' | 'not_attended',
    examResultDate: Date
}


const examResultSchema = new Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    },
    subjectId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject'
    },
    examType: {
        type: String,
        enum: ['Mid Sem', 'End Sem', 'Internal', 'Supplementary']
    },
    examPublishedStatus: {
        type: String,
        enum: ['pending', 'published', 'failed']
    },
    examResult: {
        type: String,
        enum: ['passed', 'back', 'failed', 'not_attended']
    },
    examResultDate: {
        type: Date,
        default: Date.now
    }
},{timestamps: true})

export const ExamResult = (models.ExamResult as mongoose.Model<IExamResult>) || model<IExamResult>("ExamResult", examResultSchema);