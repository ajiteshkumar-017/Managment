import Connect from "@/dbConnect/connect";
import { Student } from "@/models/student.model";
import {NextResponse, NextRequest} from "next/server";


export async function POST(request:NextRequest) {

    try {

        await Connect();

        const body = await request.json();

        const {semester,section, department, batch,} = body;

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

        const user = await Student.updateMany({semester,department,section,batch, status: "Active"}, {
            $inc : {semester: 1},
            
        })

        if(!user){
            console.log("Error in getting User detail")

            return NextResponse.json(
                {
                    success: false,
                    message: "Something went Wrong. Please reselect your desired field"
                }, {status: 401}
            )
        }


        console.log("Updated Info are:", user)

        return NextResponse.json(
            {
                success: true,
                message: "Succesfully promoted the Students",
                user
            }, {status: 200}
        )


        
    } catch (error:any) {
            console.log("Error in Promoting Semester of Students", error)
            console.log("Error Message", error?.message);
            console.log("Error Stack", error?.message?.stack);

            return NextResponse.json(
                {
                    success: false,
                    message: "Error in Prmoting Semester of the Students"
                }, {status: 500}
            )
    }
    
}