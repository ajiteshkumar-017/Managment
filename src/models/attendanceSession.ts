import mongoose, {Schema, models, model} from "mongoose"

export interface IAttendanceSession extends Document {
        classId : Object,
        sessionCode : number,
        expiryTime : Date,
        isActive : boolean
}



const AttendanceSessionSchema = new Schema({
    
    classId : {
        type: String,
        required: true,
    },
     sessionCode: {
        type: Number,
        required: ["Session Code is  Required",true],
     },
     expiryTime: {
        type: Date,
        required : true
     },
     isActive: {
        type: Boolean,
        default: true
     }

},{timestamps : true});



export const AttendanceSession =( models.AttendanceSession as mongoose.Model<IAttendanceSession>) || model<IAttendanceSession>("AttendanceSession", AttendanceSessionSchema)



