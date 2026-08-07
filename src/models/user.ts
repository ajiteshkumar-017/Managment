import mongoose, {Schema, Document, models, model} from "mongoose"

export interface IUser extends Document {
    username: string,
    email: string,
    password?: string,
    avatar?: string,
    avatarPublicId?: string,
    googleId?: string,
    authProvider?: "google" | "email" | "facebook" | "custom_auth",
    profileCompleted?: boolean,
    email_verified?: boolean
    role: 'student' | 'faculty' | 'admin',
}


const UserSchema = new Schema<IUser>({
    username: {
        type: String,
        trim: true
    },
    email: {
        type:String,
        required: [true, "Email is Required"],
        trim: true,
        unique: true,
        match: [/\S+@\S+\.\S+/, "Please use a valid email address"],    
    },
    password: {
        type : String,
        trim:true,
        // required: [false, "Password is Required"]
    },
    avatar: {
        type: String,
        required: false,
        trim: true
    },
    avatarPublicId: {
        type: String,
        required: false,
        trim: true
    },
    googleId: {
        type: String,
        required: false,
        trim: true
    },
    authProvider:{
        type: String,
        enum: ["google", "email", "facebook", "custom_auth"],
        default: "custom_auth"
    },
    profileCompleted: {
        type: Boolean,
        required: false
    },
    email_verified: {
        type: Boolean,
        required: false
    },
    role: {
        type: String,
        enum: ["student", "faculty", "admin"],
        default: "student"
    }
}, {timestamps: true})


export const User = (models.User as mongoose.Model<IUser>) || model<IUser>("User", UserSchema) ;