import { NextResponse, NextRequest } from "next/server";
import Connect from "@/dbConnect/connect";
import bcrypt from "bcryptjs";
import { User } from "@/models/user"
import jwt from "jsonwebtoken"
import dotenv from "dotenv";

dotenv.config();

export async function GET(request: NextRequest) {
  try {
    await Connect();

    const token = request.cookies.get("token")?.value || request.headers.get("authorization")?.replace("Bearer ", "") || null;

    if (!token) {
      console.error("No Token Found In GetUsername Route");
      return NextResponse.json(
        {
          success: false,
          message: "No Token Found"
        },
        {
          status: 401
        }
      );
    }

    let tokenData;
    try {
      tokenData = jwt.verify(token, process.env.JWT_SECRET!) as any;
      console.log("Token Data in GetUsername Route:", tokenData);
    } catch (err) {
      console.error("Error parsing token in GetUsername Route:", err);
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Token"
        },
        {
          status: 401
        }
      );
    }

    const email = (tokenData as any).email;

    if (!email) {
      console.error("Email not found in token data");
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

    return NextResponse.json(
      {
        success: true,
        username: user.username
      },
      {
        status: 200
      }
    );

  } catch (error) {
    console.error("Error in GetUsername Route:", error);
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