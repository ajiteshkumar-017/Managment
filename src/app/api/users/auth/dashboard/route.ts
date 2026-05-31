import {NextResponse,NextRequest} from "next/server";
import Connect from "@/dbConnect/connect";
import { User } from "@/models/user";
import jwt from "jsonwebtoken";

import {Subject} from "@/models/subject.model"
import mongoose from "mongoose";
import { Enrollment } from "@/models/enrollement.model";
import { getUser } from "@/lib/getUser";

export async function GET(request:NextRequest){
    try{
         await Connect();
        
               const {email} = await getUser();
               if(!email){
                console.log("Email not found in token");
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