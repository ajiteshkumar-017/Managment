import Connect from "@/dbConnect/connect";
import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken"
import { createRequestLogger } from "@/lib/requestLogger";

export async function POST(req:NextRequest){
    const requestLogger = createRequestLogger();
    try {
        
        const response = NextResponse.json({
        success: true,
        message: "Logout Successfully"

    }, {status: 200})

    response.cookies.set("token", "", {
        httpOnly : true
    })

    requestLogger.info({}, "Logout successful");
    return response

    } catch (error: any) {
        console.error("Error in Logout", error)
        requestLogger.error({ err: error }, "Logout failed");
        return NextResponse.json({message: "Something Went Wrong"}, {status:500})
    }
}
