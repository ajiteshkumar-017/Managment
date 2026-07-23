import {NextResponse,NextRequest} from "next/server";
import Connect from "@/dbConnect/connect";
import { User } from "@/models/user";
import jwt from "jsonwebtoken";

import {Subject} from "@/models/subject.model"
import mongoose from "mongoose";
import { Enrollment } from "@/models/enrollement.model";
import { getUser } from "@/lib/getUser";
import { createRequestLogger } from "@/lib/requestLogger";

export async function GET(request:NextRequest){
    const requestLogger = createRequestLogger();
    try{
         await Connect();
        
               const {email} = await getUser();
               if(!email){
                console.log("Email not found in token");
                requestLogger.warn({ reason: "unauthorized" }, "Dashboard unauthorized");
                return NextResponse.json(
                    {
                        success: false,
                        message: "Unauthorized"
                    },
                    {
                        status: 401
                    }
                )
               }


                const user= await User.findOne({email});
                
                if(!user){ 
                    console.log("No User is linked with this email")
                    requestLogger.warn({ reason: "user_not_found", email }, "Dashboard user not found");
                    return NextResponse.json(
                        {
                            success: false,
                            message: "No User found."
                        },
                        {
                            status: 404
                        }
                    )
                }

                const subjectData = await Subject.find({studentId: user._id});

                if(!subjectData){
                    console.log("No Subject is linked with this user")
                    requestLogger.warn({ reason: "subjects_not_found", userId: user._id }, "Dashboard subjects not found");
                    return NextResponse.json(
                        {
                            success: false,
                            message: "No Subject found for this user."
                        },
                        {
                            status: 404
                        }
                    )
                }

                const totalClasses = subjectData.reduce((total, subject) => total + (subject.totalClasses || 0), 0);

                requestLogger.info({
                    email,
                    userId: user._id,
                    totalSubjects: subjectData.length,
                    totalClasses,
                }, "Dashboard data fetched successfully");

                return NextResponse.json(
                    {
                        success: true,
                        message: "Dashboard Data fetched successfully",
                        data: {
                            name: user.username,
                            email: user.email,
                            totalSubjects: subjectData.length,
                            totalClasses
                        }
                    },
                    {
                        status: 200
                    }
                )
                
    }catch(err){
        console.error("Error in Dashboard Route:", err)
        requestLogger.error({ err }, "Dashboard fetch failed");
        return NextResponse.json(
            {
                success: false,
                message: "Internal Server Error",
                err
            },
            {
                status: 500
            }
        )
    }
}
