import {NextRequest, NextResponse} from "next/server";
import Connect from "@/dbConnect/connect";
import { User } from "@/models/user";
import jwt from "jsonwebtoken";
import { getUser } from "@/lib/getUser";
import { writeFile, mkdir } from 'fs/promises'
import path, { resolve } from 'path'
import cloudinary from '@/lib/cloudinary'
import result from "@/app/(app)/(users)/(management)/result/page";
import { createRequestLogger } from "@/lib/requestLogger";

// if(!process.env.CLOUDINARY_API_SECRET || !process.env.CLOUDINARY_API_KEY || !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME){
//     console.error("Cloudinary configuration variables are missing in the environment variables.")
// }


export async function POST(request:NextRequest){
    const requestLogger = createRequestLogger();
    try {
        await Connect();

        const {email} = await getUser()

        if(!email){
            console.error("Email not found in token data")
            console.error(`In ${request.nextUrl.pathname}` )
            requestLogger.warn({ reason: "missing_email" }, "Upload profile image unauthorized");
            return NextResponse.json(
                {
                    success: false,
                    message: "Email not found in token"
                },
                {
                    status: 401
                }
            )
        }

        const existingUser = await User.findOne({email});

        const formData = await request.formData()

        const file = formData.get('image') as File



         if (!file) {
            console.log("No file uploaded in the request")
            requestLogger.warn({ reason: "missing_file", email }, "No file uploaded");
            return NextResponse.json(
                { success: false, message: 'No file uploaded' },
                { status: 400 }
            )
    }

    if (!file.type.startsWith("image/")) {
        console.log("Please Uplaod a valid image file")
        requestLogger.warn({ reason: "invalid_file_type", email, fileType: file.type }, "Invalid image file type");
   return NextResponse.json(
      { success:false, message:"Only images allowed" },
      { status:400 }
   )
}

    const MAX_SIZE = 5 * 1024 * 1024;

    if (file.size > MAX_SIZE) {
      requestLogger.warn({ reason: "file_too_large", email, fileSize: file.size }, "Profile image too large");
      return NextResponse.json(
        {
          success: false,
          message: "File size must be less than 5MB",
        },
        {
          status: 400,
        }
      );
    }

    if (existingUser.avatarPublicId) {
      try {

        await cloudinary.uploader.destroy(
          existingUser.avatarPublicId
        );

        console.log(
          "Old avatar deleted successfully"
        );

      } catch (deleteError) {

        console.error(
          "Failed to delete old avatar:",
          deleteError
        );

      }
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // const uploadDir  = path.join(process.cwd(), 'public', 'uploads')
    // await mkdir(uploadDir, { recursive: true }) 
    // const filename  = `${Date.now()}-${file.name.replace(/\s/g, '_')}`
    // const localPath = path.join(uploadDir, filename)
    // await writeFile(localPath, buffer)
    // const localUrl = `/uploads/${filename}`
    // console.log("Local Url: ", localUrl)

    console.log("Coming to Cloudinary part")


    const cloudinaryResult = await new Promise<any>((resolve,reject) => {
        cloudinary.uploader.upload_stream(
            {
                folder : "CollegeManagement",
                public_id: `${Date.now()}-${file.name.replace(/\s/g, '_')}`,
                transformation: [
                    { width: 500, height: 500, crop: "fill" }
                ],
                resource_type: "image",
                timeout: 120000

            },
            
            
                (error, result) => {
                    if(error){
                        console.error("Error uploading to Cloudinary:", error)
                        reject(error)
                    } else {
                        resolve(result)
                    }
                }
            
        ).end(buffer)
    })

    // console.log("Cloudinary Upload Result:", cloudinaryResult)

    if(!cloudinaryResult || !cloudinaryResult.secure_url){
        console.error("Invalid response from Cloudinary:", cloudinaryResult)
        requestLogger.warn({ reason: "cloudinary_upload_failed", email }, "Cloudinary upload failed");
        return NextResponse.json(
            {
                success: false,
                message: "Failed to upload image to Cloudinary"
            },
            {
                status: 500
            }
        )

    }

    const imageUrl = cloudinaryResult.secure_url;

    const user = await User.findOneAndUpdate(
        { email },
        {
          avatar: imageUrl,
          avatarPublicId: cloudinaryResult.public_id,
        },
        { new: true }
    )

    if(!user){
        console.error("User not found with email:", email)
        requestLogger.warn({ reason: "user_not_found", email }, "User not found for profile image");
        return NextResponse.json(
            {
                success: false,
                message: "User not found"
            },
            {
                status: 404
            }
        )
    }

    requestLogger.info({
        email,
        userId: user._id,
        publicId: cloudinaryResult.public_id,
    }, "Profile image uploaded successfully");

    return NextResponse.json(
        {
            success: true,
            message: "Profile image uploaded successfully",
            // localPath,                                    
            publicId:cloudinaryResult.public_id, 
            imageUrl
        },
        {
            status: 200
        }
    )

    } catch (err:any) {
        console.error("Error in Uploading Profile Image:", err);
        requestLogger.error({ err }, "Profile image upload failed");
        return NextResponse.json(
            {
                success: false,
                message: err?.response?.data?.message || "Error in Uploading Profile Image"
            },
            {
                status: 500
            }
        )
        
    }
}

export async function GET(request: NextRequest){
    const requestLogger = createRequestLogger();
    try{
         await Connect();

         const {email} = await getUser();

         console.log("Email In Getting Profile Image:", email);

         if(!email){
            console.error("Email Not found.");
            requestLogger.warn({ reason: "missing_email" }, "Get profile image unauthorized");
            return NextResponse.json(
                {
                    success: false,
                    message: "Email not found in "
                },
                {
                    status:404
                }
            )
         }

         const user = await User.findOne({email});

         if(!user){
            requestLogger.warn({ reason: "user_not_found", email }, "Get profile image user not found");
            return NextResponse.json(
                {
                    success: false,
                    message: "INDIAN AND INDIA"
                },
                {
                    status: 404
                }
            )
         }

         const getImage = user.avatar;

        //  console.log("Image Url:", getImage);

         requestLogger.info({
            email,
            userId: user._id,
            hasAvatar: !!getImage,
         }, "Profile image fetched successfully");

         return NextResponse.json(
            {
                success: true,
                message: "Profile Image Fetched Successfully",
                getImage
            },
            {
                status: 200
            }
         )

         
    }catch(err:any){
        console.log("Error in Getting Profile Image if User:", err)
        requestLogger.error({ err }, "Get profile image failed");
        return NextResponse.json(
            {
                success: false,
                message: "Error in Geting Profile Image of User",
                
            },{
                status: 500
            }
        )
    }
}
