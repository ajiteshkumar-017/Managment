import { NextResponse, NextRequest } from "next/server";
import Connect from "@/dbConnect/connect";
import bcrypt from "bcryptjs";
import { User } from "@/models/user"


export async function POST(request: NextRequest){
    try {

        await Connect();

        const req = await request.json();
        const body = req;
        const {email, password, username} = body;

        if(!email || !username || !password){
            console.log("All filed are required.");
            return NextResponse.json(
                {
                    success: false,
                    message: "All field are required"
                },
                {
                    status: 400
                }
            );
        }

        

        const existingUser = await User.findOne({email});

        if(existingUser){
            console.log("User Already Exits");
            return NextResponse.json(
                {
                    success: false,
                    message : "User Already Exist"
                },
                {
                    status: 400
                }
            )
        }

            const salt = await bcrypt.genSalt(10)

            const hashedPassword = await bcrypt.hash(password,salt);

            console.log("Password hashing Completed")


            const newUser = await User.create(
                {
                    username,
                    password: hashedPassword,
                    email
                }
            )
            console.log("The Form Data is: ", newUser);

            if(!newUser){
                console.log("Error in Creating User");
                return NextResponse.json(
                    {
                        success: false,
                        message: "Failed to SignUp"
                    },
                    {
                        status: 400
                    }
                )
            }
            console.log("Succesfully Signed in")

            return NextResponse.json({
                success : true,
                message: "SignUp Succesfull",
                newUser
            },{status: 200})
        
    } catch (error:any) {
        console.log("Server Error, Error in SignUp Backend", error)
        return NextResponse.json(
            {
                success: false,
                message: "Server Error. SignUp Failed"
            },
            {
                status: 500
            }
        )
        
    }
}