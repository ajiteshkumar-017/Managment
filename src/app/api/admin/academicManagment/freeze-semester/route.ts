import Connect from "@/dbConnect/connect";
import { Student } from "@/models/student.model";
import {NextResponse, NextRequest} from "next/server";

export async function POST(request:NextRequest){
    try {
        await Connect();
         const body = await request.json();
         const {semester, batch, department, section} = body;

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
                semester,
                section,
                department,
                batch,
                status: "Active"
            }, {
                $set : {
                    status: "On Hold"
                }
            }
        )

        if(!result){
            console.log("Error in getting User detail")

            return NextResponse.json(
                {
                    success: false,
                    message: "Something went Wrong. Please reselect your desired field"
                }, {status: 401}
            )
        }

        console.log(result.modifiedCount);


        return NextResponse.json(
            {
                success: true,
                message: "Frooze the Semester's Student",
                result
            }, {status: 200}
        )
        

        
    } catch (error:any) {
        
    }
}