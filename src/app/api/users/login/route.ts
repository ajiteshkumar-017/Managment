import { NextResponse, NextRequest } from "next/server";
import Connect from "@/dbConnect/connect";
import bcrypt from "bcryptjs";
import { User } from "@/models/user"
import jwt from "jsonwebtoken"
import dotenv from "dotenv";
import { SignJWT } from 'jose'

dotenv.config();

console.log("MongoDB URL:", process.env.MONGODB_URL!);

// if(!process.env.JWT_SECRET){
//     throw new Error("JWT_SECRET is not configured")
// }

 if(!process.env.JWT_SECRET!){
    console.log("JWT_SECRET is also not configured")
    console.log("JWT_SECRET value is:", process.env.JWT_SECRET!);
 }

 const secret = new TextEncoder().encode(process.env.JWT_SECRET!)


export async function POST(request: NextRequest){
    try {
        console.log("Coming to Login Backend");
         await Connect();

        // const text = await request.text();
        // console.log(text);
        console.log("MongoDB URL:", process.env.MONGODB_URL!);
        console.log("JWT_SECRET:", process.env.JWT_SECRET!);

        const req = await request.json();

        const body = req;

        const {email, password} = body;

        if(!email || !password){
            console.log("All field are required");
            return NextResponse.json(
                {
                    success: false,
                    message: "All field are required"
                }
            )
        }

        const user = await User.findOne({email});

        if(!user){
            console.log("No User Exits with this credential")
            return NextResponse.json(
                {
                    success: false,
                    message: "No User Exits with this credential"
                },
                {
                    status: 400
                }
            )
        }
    
        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid){
            console.log("Invalid Credential, Please try again.")
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid Credential. Please try again."
                },
                {
                    status: 400
                }
            )
        }


        const tokenData = {
            _id : user._id,
            email: user.email,
            role: user.role
        };

        // console.log("Coming to JWT Part");
        // if (!process.env.JWT_SECRET!) {
        //     console.log("JWT_SECRET is not configured")
        // }

        // console.error("JWT_SECRET value is:", process.env.JWT_SECRET!);
        // console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);

        console.log("Token Data:", tokenData);

        const token = await new SignJWT({ 
                _id:   String(tokenData._id),   
                email: tokenData.email, 
                role:  tokenData.role 
            })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('1d')
            .sign(secret)
        console.log("Token generated", token);
        console.log("Token type:", typeof token);

        const response = NextResponse.json(
            {
                success: true,
                message: "User logged In Successfully"
            },
            {
                status: 200
            }
        )

        response.cookies.set("token", token, {
                httpOnly: true,
                path: "/"
                });

        console.log("Generated The response")      

        return response;

        // return NextResponse.json(
        //     {
        //         success:  true,
        //         message: "User Logged in successfully"
        //     },
        //     {
        //         status: 201
        //     }
        // )
        

        // console.log("Detail" con)



        
       
        
    } catch (error: any) {
        console.log("Error in Login BAckend", error);
        console.error("JWT_SECRET value is:", process.env.JWT_SECRET!);
        console.error("The actual login error is:", error);

            return NextResponse.json({
            errorName: error.name || "RuntimeError",
            errorMessage: error.message || "Unknown crash",
            errorStack: error.stack || "No trace available"
        }, { status: 500 });
    
        
    }
}