import mongoose, {Schema, model, models} from "mongoose"


export interface IAttendanceRecord extends Document {
    studentId : Object,
    sessionId : Object,
    markedAt : Date,
    method : "qr" | "code"
}


const attendanceRecordSchema = new Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AttendanceSession"
  },

  markedAt: {
    type: Date,
    default: Date.now
  },

  method: {
    type: String,
    enum: ["qr", "code"],
    default: "code"
  }
})

export const AttendanceRecord = (models.AttendanceRecord as mongoose.Model<IAttendanceRecord>) || model<IAttendanceRecord>("AttendanceRecord", attendanceRecordSchema);