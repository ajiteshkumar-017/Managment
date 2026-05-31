import {NextResponse,NextRequest} from "next/server";
import Connect from "@/dbConnect/connect";
import { User } from "@/models/user";
import jwt from "jsonwebtoken";

import {Subject} from "@/models/subject.model"
// import mongoose from "mongoose";
import { Enrollment } from "@/models/enrollement.model";
import { getUser } from "@/lib/getUser";


export async function GET(request:NextRequest){
    try {
        await Connect();

        const {email} = await getUser();

        

        if(!email){
            console.error("Email not found in token data")
            return NextResponse.json(
                {
                    success: false,
                    message: "Email not found in token"
                },
                {
                    status: 401
                }
            )
        }



        

        const user = await User.findOne({email});

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
            );
        }

        const tableData = await  Enrollment.aggregate([
            {
                $match: {
                    studentId: user._id
                }
            },
            {
                $lookup : {
                    from: "classes",
                    localField: "classId",
                    foreignField: "_id",
                    as: "class"
                }
            },
            {
                $unwind: "$class"
            },
            {
                $lookup: {
                    from: "subjects",
                    localField: "class.subjectId",
                    foreignField: "_id",
                    as: "subject"
                }
            },
            {
                $unwind: "$subject"
            },
            {
                $lookup: {
                    from: "users",
                    localField: "class.facultyId",
                    foreignField: "_id",
                    as: "faculty"
                }
            },
            {
                $unwind: "$faculty"
            },
            {
                $lookup: {
                    from: "attendancesessions",
                    localField: "class._id",
                    foreignField: "classId",
                    as: "sessions"
                }
            },

            {
                $project: {
                    _id: 0,
                    subjectCode: "$subject.subjectCode",
                    subjectName: "$subject.subjectName",
                    faculty: "$faculty.username",
                    credits: "$subject.credits",
                    totalClasses: { $size: "$sessions" }
                }
            }
        ])

        console.log("Data for Course table", tableData)

        return NextResponse.json(
            {
                success: true, 
                message: "Data Send Successfully",
                tableData
            },
            {
                status: 200
            }
        );

    } catch (err:any) {
        console.log("Error is happening here: ", err)
        return NextResponse.json(
            {
                success: false,
                message: "Error in Course Backend",
                err
            },
            {
                status: 500
            }
        )
    }
}