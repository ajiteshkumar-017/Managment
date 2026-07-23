import Connect from "@/dbConnect/connect";
import { NextResponse, NextRequest } from "next/server";
import { mkdir } from "fs/promises";
import path from "node:path";
import { Buffer } from "node:buffer";
import { buffer } from "node:stream/consumers";
import { writeFile } from "node:fs/promises";
import { rejects } from "node:assert";
import cloudinary from "@/lib/cloudinary";
import { headers } from "next/headers";
import { getUser } from "@/lib/getUser";
import { User } from "@/models/user";
import { redirect } from "next/navigation";
import { createRequestLogger } from "@/lib/requestLogger";


export async function POST(req:NextRequest){
    const requestLogger = createRequestLogger();
    try {

         console.log("STEP 1");
         console.log("STEP 2");
        await Connect();
        console.log("API HIT");

        const {email} = await getUser()

        if(!email){
            console.log("Error in getting Email", email)
            requestLogger.warn({ reason: "missing_email" }, "No email received for setup");
            return NextResponse.json({
                success: false,
                message: "No Email is received."
            },{status:400})
        }

        // const user = await User.findOne({email});
        // const user = await User.findOne(
        // { email },
        // { profileCompleted: 1 }
        // );

        

         console.log("STEP 3");

        const formData = await req.formData();
        const file = formData.get("image") as File

        console.log("FILE:", file);
console.log("TYPE:", typeof file);
console.log("INSTANCE:", file instanceof File);
        console.log("STEP 4");

        if(!file){
            console.log("Error in geting the Image");
            requestLogger.warn({ reason: "missing_file", email }, "No file received for setup");
            return NextResponse.json({
                success: false,
                message: "No file is received."
            },{status:404});
        }

        const MAX_SIZE = 5 * 1024 * 1024;

        if(!file.type.startsWith("image/")){
            console.log("Choose a Proper file Type. This type dont Support our required type")
            requestLogger.warn({ reason: "invalid_file_type", email, fileType: file.type }, "Invalid file type for setup");
            return NextResponse.json(
                {
                    success: false,
                    message: "File Type Error. Please choose the required file type!"
                },{status:404}
            )
        }

        if(file.size > MAX_SIZE){
            console.log("Please Select the file below the required Size.")
            requestLogger.warn({ reason: "file_too_large", email, fileSize: file.size }, "File size exceeds limit");
            return NextResponse.json(
                {
                    success: false,
                    message: "Please select the file size below given criteria."
                }, {status:402}
            )
        }

        console.log("STEP 5");

        const byte = await file.arrayBuffer();

        console.log("STEP 6");
        const buffer = await Buffer.from(byte);

        
        



        const uploadDir = path.join(process.cwd(), "public", "uploads")
        console.log("STEP 8");
        await mkdir(uploadDir,{recursive :true});
        const filename = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
        const localPath = path.join(uploadDir,filename);
        console.log("STEP 9");
        await writeFile(localPath,buffer);
        const localUrl = `uploads/${filename}`

      console.log("STEP 10");

        const cloudinaryUploadResult = await new Promise<any>((resolve,reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder : "CollegeManagement",
                    public_id:`${Date.now()}-${file.name.replace(/\s/g, '_')}`,
                    transformation : [{
                        width: 500, height:500
                    }],
                    resource_type: "image",
                    timeout: 12000

                }, 
                (error, result) => {
                    if(error){
                        console.error("Error uploading to Cloudinary:", error)
                        reject(error)
                    }else{
                        resolve(result)
                    }
                }
            ).end(buffer)
        })

        console.log("STEP 11");

        if(!cloudinaryUploadResult || !cloudinaryUploadResult.secure_url){
            console.log("Something went wrong in Uploading to Cloudinary")
            requestLogger.warn({ reason: "cloudinary_upload_failed", email }, "Cloudinary upload failed");
            return NextResponse.json(
                {
                    success: false,
                    message: "Something went wrong in Uploading to Cloudinary"
                },
                {
                    status: 400
                }
            )
        }

        const imageUrl = cloudinaryUploadResult.secure_url;

        const updatedUser = await User.findOneAndUpdate(
            {email},
            {avatar: imageUrl },
            {new: true}
        );

        if(!updatedUser){
            console.log("No User found in this Email")
            requestLogger.warn({ reason: "user_not_found", email }, "User not found for avatar update");
            return NextResponse.json({
                success: false,
                message : "No Successfull. All are waste"
            },{status:403})
        } 


        console.log("Implanted or Updated the Photo");
        requestLogger.info({
            email,
            userId: updatedUser._id,
        }, "Setup avatar uploaded successfully");

        return NextResponse.json({
            success: true,
            message: "Uploaded the Image",
            imageUrl
        },{status:200})



    } catch (error:any) {
        console.log("Error in Clouding the Photo");
        requestLogger.error({ err: error }, "Setup avatar upload failed");
        return NextResponse.json(
            {
                success: false,
                message: "Something Went Wrong. Please try after some time."

            },
            {
                status:500
            }
        )
        

    }
}


// import { NextResponse } from "next/server";

// export async function POST() {
//   console.log("ROUTE HIT");
  
//   return NextResponse.json({
//     success: true,
//     message: "Route works"
//   });
// }
