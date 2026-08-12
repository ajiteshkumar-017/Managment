import { DEPARTMENT, SEMESTER } from "@/constant/Constant";
import mongoose, {Schema, models, model} from "mongoose"

export interface IAttendanceSession extends Document {
        classId : Object,
        facultyId:mongoose.Types.ObjectId,
        sessionCode : number,
        sessionToken: string,
        startedAt: Date,
        expiryTime : Date,
        isActive : boolean,
        status: string
}



const AttendanceSessionSchema = new Schema({
    classId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
        required: true,
    },
    facultyId:{
      type: mongoose.Schema.Types.ObjectId,
      ref : "Faculty",
      required: true,
    },
     sessionCode: {
        type: Number,
        required: ["Session Code is  Required",true],
     },
     sessionToken: {
      type: String,
      required: true,
      unique: true,
  },
     startedAt:{
      type: Date,
      required: true,
     },
     expiryTime: {
        type: Date,
        required : true
     },
     isActive: {
        type: Boolean,
        default: true
     },
     status:{
      type: String,
      enum: ['active', 'expired', 'closed']
     }

},{timestamps : true});



export const AttendanceSession =( models.AttendanceSession as mongoose.Model<IAttendanceSession>) || model<IAttendanceSession>("AttendanceSession", AttendanceSessionSchema)



