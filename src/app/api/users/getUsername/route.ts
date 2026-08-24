import { NextResponse, NextRequest } from "next/server";
import Connect from "@/dbConnect/connect";
import bcrypt from "bcryptjs";
import { User } from "@/models/user"
import jwt from "jsonwebtoken"
import dotenv from "dotenv";
import { getUser } from "@/lib/getUser";
import { jwtVerify } from "jose";
import { createRequestLogger } from "@/lib/requestLogger";

dotenv.config();

const secret = new TextEncoder().encode(process.env.JWT_SECRET!) 

export async function GET(request: NextRequest) {
  const requestLogger = createRequestLogger();
  try {
    await Connect();

     
         const {email} = await getUser();
         

          if(!email){
            console.error("Email not found in token payload")
            requestLogger.warn({ reason: "missing_email" }, "getUsername unauthorized");
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
      

    
    

    if (!email) {
      console.error("Email not found in token data");
      requestLogger.warn({ reason: "missing_email" }, "getUsername unauthorized");

      return NextResponse.json(
        {
          success: false,
          message: "Email not found in token"
        },
        {
          status: 401
        }
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      console.log("No User is linked with this email");
      requestLogger.warn({ reason: "user_not_found", email }, "getUsername user not found");
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

    requestLogger.info({
      email,
      userId: user._id,
      username: user.username,
    }, "Username fetched successfully");

    return NextResponse.json(
      {
        success: true,
        username: user.username,
        avatar: user.avatar || "",
      },
      {
        status: 200
      }
    );

  } catch (error) {
    console.error("Error in GetUsername Route:", error);
    requestLogger.error({ err: error }, "getUsername failed");
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while fetching username"
      },
      {
        status: 500
      }
    );
  }
}
