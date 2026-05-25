import {NextResponse,NextRequest} from "next/server";
import Connect from "@/dbConnect/connect";
import { User } from "@/models/user";
import jwt from "jsonwebtoken";
import {Subject} from "@/models/subject.model"
import { Enrollment } from "@/models/enrollement.model";
import { Notice } from "@/models/notice.model";



export async function GET(request:NextRequest){
    try{
        await Connect();
        const token = request.cookies.get("token")?.value || request.headers.get("authorization")?.replace("Bearer ", "") || null;
        let tokenData;
        if(!token){
            console.error("No Token Found In Course Route")
            return NextResponse.json(
                {
                    success: false,
                    message: "No Token Found"
                },
                {
                    status: 401
                }
            )
        }else{
            
            try{
                
                tokenData = jwt.verify(token, process.env.JWT_SECRET!) as any;
                console.log("Token Data in Course Route:", tokenData) 
            }catch(err){
                console.error("Error parsing token in Course Route:", err)
                return NextResponse.json(
                    {
                        success: false,
                        message: "Invalid Token"
                    },
                    {
                        status: 401
                    }
                )
            }
             console.log("Email of User:", (tokenData as any).email)
        }

        const email = (tokenData as any).email;

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
            console.error("User not found with email:", email)
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found"
                },
                {
                    status: 404
                }
            )
        }

        const noticesInfo = await Notice.find({ expirationDate: { $gt: new Date() } }).sort({ date: -1 }).limit(5);
         if(!noticesInfo){
            console.error("No Notices found in the database")
            return NextResponse.json(
                {
                    success: false,
                    message: "No Notices found"
                },
                {
                    status: 404
                }
            )
         }

         console.log("Notices found:", noticesInfo.length)
         console.log("Notices found are:", noticesInfo)

         return NextResponse.json(
            {
                success: true,
                message: "Dashboard data fetched successfully",
                notices: noticesInfo,
                username: user.username
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
                message: "Internal Server Error"
            },
            {
                status: 500
            }
        )
    }
}