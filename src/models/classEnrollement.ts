import mongoose, {Schema, model, models} from "mongoose";

export interface ClassEnrollement {
    classId: mongoose.Types.ObjectId;
    studentId: mongoose.Types.ObjectId;
    enrolledAt?: Date;
    exitedAt?: Date | null;
    status?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const classEnrollementSchema = new Schema<ClassEnrollement>({
    classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class", required: true
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true
    },
    enrolledAt: {
        type: Date,
        default: Date.now
    },
    exitedAt: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        enum: ["enrolled", "exited"],
        default: "enrolled"
    }
}, {timestamps: true});

export const ClassEnrollement =
  (models.ClassEnrollement as mongoose.Model<ClassEnrollement>) ||
  model<ClassEnrollement>("ClassEnrollement", classEnrollementSchema);