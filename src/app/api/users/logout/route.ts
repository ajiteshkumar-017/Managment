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
        console.log("Error message", error.message)
        console.log("Error stack", error.stack)
        console.log("Error name", error.name)
        console.log("Error code", error.code)
        console.log("Error status", error.status)
        console.log("Error details", error.details)
        console.log("Error cause", error.cause)
        console.log("Error message", error.message)
        requestLogger.error({ err: error }, "Logout failed");
        return NextResponse.json({message: "Something Went Wrong"}, {status:500})
    }
}
