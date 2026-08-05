import Connect from "@/dbConnect/connect";
import { Student } from "@/models/student.model";
import { NextRequest, NextResponse } from "next/server";
import { createRequestLogger } from "@/lib/requestLogger";



export async function POST(request:NextRequest) {
    const requestLogger = createRequestLogger();
    try {
        
        await Connect();

        const body = await request.json();

        const {semester,department, batch} = body;

        if(!semester || !department || ! batch){
            requestLogger.warn({ semester, department, batch }, "Invalid payload");
            console.error("All fields are Required");
            return NextResponse.json(
                {
                    success: false,
                    message: "All field are Required"
                },
                {
                    status: 401
                }
            )
        }

        if(semester === "8"){
            requestLogger.warn({ semester, department, batch }, "Passout action not allowed for semester 8");
            console.log("This action cannot be done.")

            return NextResponse.json(
                {
                    success: false,
                    message: "This action is not allowed. Please select other semester student or follow other method",

                }, {status: 403}
            )
        }

        const result = await Student.updateMany(
            {
                semester,
                department,
                batch,
                status: "active"
            },

            {
                $set: {
                    status: "graduated"
                }
            }
        )

        if(!result){
            requestLogger.warn({ semester, department, batch }, "Passout update failed");
            console.log("Error in getting User detail")

            return NextResponse.json(
                {
                    success: false,
                    message: "Something went Wrong. Please reselect your desired field"
                }, {status: 401}
            )
        }

         console.log(result.modifiedCount);
        
        requestLogger.info(
            { semester, department, batch, modifiedCount: result.modifiedCount },
            "Students passed out successfully",
        );
                return NextResponse.json(
                    {
                        success: true,
                        message: "Passed Out the Semester's Student",
                        result
                    }, {status: 200}
                )
    } catch (error:any) {
        requestLogger.error({ err: error }, "Failed to pass out students");
        console.log("Error in Passing out Student of Semester", error)
            console.log("Error Message", error?.message);
            console.log("Error Stack", error?.message?.stack);

            return NextResponse.json(
                {
                    success: false,
                    message: "Error in Passing Out Students of Semester"
                }, {status: 500}
            )
    }
}
