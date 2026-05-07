import { NextResponse, NextRequest } from "next/server";
import Connect from "@/dbConnect/connect";
import bcrypt from "bcryptjs";
import { User } from "@/models/user"
import jwt from "jsonwebtoken"


export async function POST(request: NextRequest){
    try {

        const db = await Connect();

        // const text = await request.text();
        // console.log(text);
        

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
            username: user.username
        };

        const token = await jwt.sign( tokenData, process.env.JWT_SECRETKEY!, {expiresIn: 60 * 60 });

        console.log("Token generated", token);

        const response = NextResponse.json(
            {
                message: "User logged In Successfully"
            },
            {
                status: 200
            }
        )

        response.cookies.set("token", token, {
                httpOnly: true,
                
                });

          console.log("Generated The response")      

        return response;
        
        // console.log("The Form Data is: ", newUser);

        return NextResponse.json(
            {
                success:  true,
                message: "User Logged in successfully"
            },
            {
                status: 201
            }
        )
        

        // console.log("Detail" con)



        
       
        
    } catch (error: any) {
        console.log("Error in Login BAckend", error);
            return NextResponse.json(
                {
                    success: false,
                    message: "Server Error",
                    error
                },
                {
                    status: 500
                }
            )
        
    }
}