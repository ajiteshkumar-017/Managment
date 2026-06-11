import mongoose, {Document, Schema, models, model} from "mongoose"



export interface INotice extends Document {
    title: string;
    description: string;
    date: Date;
    type: 'assignment' | 'announcement' | 'event' | 'placement' | 'general' | 'holiday';
    createdBy: mongoose.Types.ObjectId;
    IsImportant: boolean;
    expiryDate: Date
}


const NoticeSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    type: {
        type: String,
        enum: ['assignment', 'announcement', 'event', 'placement', 'general', 'holiday'],
        required: true,
        default: 'general'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    IsImportant: {
        type: Boolean,
        default: false
    },
    expiryDate: {
        type: Date,
        default: null,
        required: false
    },
    attachment: {
        type: Boolean,
        required: false
    },
    audience: {
        type : String,
        enum : ["Faculty Only", "All", "Student Only", "Admin Only"],
        default: "All"
    }
}, {timestamps: true});


export const Notice = models.Notice as mongoose.Model<INotice> || model<INotice>('Notice', NoticeSchema);

