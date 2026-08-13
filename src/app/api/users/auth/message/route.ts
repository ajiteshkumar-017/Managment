import {NextResponse,NextRequest} from "next/server";
import Connect from "@/dbConnect/connect";
import { User } from "@/models/user";
import jwt from "jsonwebtoken";
import {Subject} from "@/models/subject.model"
import { Notice } from "@/models/notice.model";
import { getUser } from "@/lib/getUser";
import { createRequestLogger } from "@/lib/requestLogger";



export async function GET(request:NextRequest){
    const requestLogger = createRequestLogger();
    try{
        await Connect();
        

        const {email} = await getUser();

        if(!email){
            console.error("Email not found in token data")
            requestLogger.warn({ reason: "missing_email" }, "Message unauthorized");
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
            requestLogger.warn({ reason: "user_not_found", email }, "Message user not found");
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
            requestLogger.warn({ reason: "notices_not_found", userId: user._id }, "No notices found");
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

         requestLogger.info({
            email,
            userId: user._id,
            noticeCount: noticesInfo.length,
         }, "Notices fetched successfully");

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
        requestLogger.error({ err }, "Message/notices fetch failed");
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
