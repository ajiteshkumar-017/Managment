import { NextRequest,NextResponse } from "next/server";
import {User} from "@/models/user";
import Connect from "@/dbConnect/connect";
import { getUser } from "@/lib/getUser";

export async function GET(request:NextRequest) {
    try {

        await Connect();

        const {email} = await getUser();

        if(!email){
            console.log("No Email Found");
            return NextResponse.json(
                {
                    success: false,
                    message: "No Email is Found"
                },{status: 401}
            )
        }

        const user = await User.findOne({email},{profileCompleted: 1})

        if(!user){
            console.log("No User Found on this Email");

            return NextResponse.json(
                {
                    success: false,
                    message: "NO User Found with this Email."
                },{status: 401}
            )
        }

        return NextResponse.json({
        success: true,
        message: "Checked the Profile Status",
        profileCompleted: user?.profileCompleted
    });
        
    } catch (error:any) {
        console.log("Error in Getting Profile Status", error);
        console.log("Error message", error?.message);
        console.log("Error Stack", error?.message?.stack);

        return NextResponse.json(
            {
                success: false,
                message: "Error in getting Profile Status"
            },
            {
                status: 500
            }
        )
    }
    
}