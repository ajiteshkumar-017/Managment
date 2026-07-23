import Connect from "@/dbConnect/connect";
import {  getUser } from "@/lib/getUser";
import { Student } from "@/models/student.model";
import { User } from "@/models/user";
import { headers } from "next/headers";
import { NextRequest,NextResponse } from "next/server";
import { createRequestLogger } from "@/lib/requestLogger";


export async function POST(req:NextRequest) {
    const requestLogger = createRequestLogger();
    try {

        await Connect();
        console.log("STEP 1")
        const body = await req.json();

        const {semester, department, section} = body;

        console.log(body)

        console.log("STEP 2")
        if(!semester || !department || !section){
            console.log("Please Select Any Choice in All field");
            requestLogger.warn({ reason: "missing_fields" }, "getDetail validation failed");
            return NextResponse.json(
                {
                    success : false,
                    message: "All fields are required"
                },{status:400}
            )
        }

        console.log("STEP 3")

        const getuser = await getUser();

        const email = getuser.email ;
        if(!email){
            console.log("No Email is found");
            requestLogger.warn({ reason: "missing_email" }, "getDetail email not found");
            return NextResponse.json(
                {
                    succcess: false,
                    message: "Error in Email"
                }, {status: 404}
            )
        }

        console.log("STEP 4")
        const isProfileComplete =
            !!department &&
            !!semester &&
            !!section;

        const user = await User.findOneAndUpdate(
  { email },
  {
    profileCompleted:
      !!department &&
      !!semester &&
      !!section
  }
);

        console.log("STEP 5")

        user.profileCompleted = isProfileComplete ;

        await user.save();

        if(!user){
            console.log("No User is found");
            requestLogger.warn({ reason: "user_not_found", email }, "getDetail user not found");
            return NextResponse.json(
                {
                    succcess: false,
                    message: "Error in User"
                }, {status: 404}
            )
        }
         console.log(user)
        console.log("STEP 6")

        const updatedUser = await Student.findOneAndUpdate({userId: user._id},  {new: true});

        console.log("STEP 7")

        console.log("Updated User",updatedUser)

        if (!updatedUser){
            console.log("Error in Updating User");
            requestLogger.warn({ reason: "student_update_failed", userId: user._id }, "getDetail student update failed");
            return NextResponse.json(
                {
                    succcess: false,
                    message: "Error in Updating User"
                }, {status: 404}
            )
        }

        console.log("STEP 8")
        requestLogger.info({
            email,
            userId: user._id,
            studentId: updatedUser._id,
            semester,
            department,
            section,
        }, "Profile details updated successfully");
        
        return NextResponse.json(
            {
                success : true,
                message: "Upadted the User Successfully"
            },{status:200}
        )
        
    } catch (err:any) {
        console.error("Very much Error")
        console.log("Error", err)
        console.log("Error message", err?.message)
        console.log("Error message Stack", err?.Stack)
        requestLogger.error({ err }, "getDetail profile setup failed");
        return NextResponse.json(
            {
                success: false,
                message: "Error in SettingUp Profile. Please Try Again !"
            },{status:500}
        )

    }
}
