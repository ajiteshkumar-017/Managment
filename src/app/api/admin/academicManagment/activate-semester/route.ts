import {NextRequest, NextResponse} from "next/server"
import { Student } from "@/models/student.model"
import Connect from "@/dbConnect/connect";

export async function POST(request:NextRequest){
    try {

        await Connect();

        const body = await request.json();

        const {semester, section, department, batch} = body;

        if(!semester || !section || !department || !batch){
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

        const result = await Student.updateMany(
            {
                department,
                semester,
                section,
                batch,
                status : "On Hold",
            },
            {
                $set : {
                    status: "Active"
                }
            }
        )

        if(!result){
            console.log("Error in Updating Status of Semester ")

            return NextResponse.json(
                {
                    success: false,
                    message: "Something went Wrong. Please reselect your desired field"
                }, {status: 401}
            )
        }

        console.log("Result:", result);

        return NextResponse.json(
            {
                success: true,
                message: "Activated the Semester",
                result
            },{
                status:200
            }
        )
        
        
    } catch (error:any) {
        console.log("Error in Activation of Semester", error)
            console.log("Error Message", error?.message);
            console.log("Error Stack", error?.message?.stack);

            return NextResponse.json(
                {
                    success: false,
                    message: "Error in Activation of Semester"
                }, {status: 500}
            )
    }
}