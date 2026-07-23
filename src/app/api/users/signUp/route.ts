import { NextResponse, NextRequest } from "next/server";
import Connect from "@/dbConnect/connect";
import bcrypt from "bcryptjs";
import { User } from "@/models/user"
import { Student } from "@/models/student.model";
import { createRequestLogger } from "@/lib/requestLogger";


export async function POST(request: NextRequest){
    const requestLogger = createRequestLogger();
    try {

        await Connect();

        const req = await request.json();
        const body = req;
        const {email, password, username} = body;

        if(!email || !username || !password){
            console.log("All filed are required.");
            requestLogger.warn({ reason: "missing_fields" }, "SignUp validation failed");
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
            requestLogger.warn({ reason: "user_exists", email }, "User already exists");
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
                requestLogger.warn({ reason: "user_create_failed", email }, "Failed to create user");
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

            console.log("User", newUser);

            const newStudentUser = await Student.create(
                {
                    userId: newUser._id,

                }
            );

            if(!newStudentUser){
                console.log("Error in Creating User");
                requestLogger.warn({ reason: "student_create_failed", userId: newUser._id }, "Failed to create student");
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
            console.log("New Student User",newStudentUser)
            console.log("Succesfully Signed in");
            requestLogger.info({
                studentId: newStudentUser._id,
                userId: newUser._id,
                department: newStudentUser.department,
                email: newUser.email,
            }, "SignUp Completed Successfully");
            



            return NextResponse.json({
                success : true,
                message: "SignUp Succesfull",
                newUser,
                newStudentUser
            },{status: 200})
        
    } catch (error:any) {
        console.log("Server Error, Error in SignUp Backend", error);
        requestLogger.error({ err: error }, "Failed to create student");
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
