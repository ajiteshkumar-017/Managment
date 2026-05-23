import Connect from "@/dbConnect/connect";
import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken"

export async function POST(req:NextRequest){
    try {
        
        const response = NextResponse.json({
        success: true,
        message: "Logout Successfully"

    }, {status: 200})

    response.cookies.set("token", "", {
        httpOnly : true
    })

    return response

    } catch (error: any) {
        console.error("Error in Logout", error)
        return NextResponse.json({message: "Something Went Wrong"}, {status:500})
    }
}