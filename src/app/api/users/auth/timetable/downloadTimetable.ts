// import Connect from "@/dbConnect/connect";
// import { verifyJwt } from "@/lib/verifyJwt";
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(request: NextRequest) {
  
//     try {
//         await Connect();

//         const auth = await verifyJwt(request);

//         if(auth.ok === false) return auth.response;

//         const { _id: userId, role } = auth.payload;
//         if(role !== "admin" && role !== "faculty") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//         if(!userId) return NextResponse.json({ error: "Invalid token payload" }, { status: 401 });

        
//         const form = await request.formData();
//         const file = form.get("file") as File;

//         if(!file) return NextResponse.json({ error: "File is required" }, { status: 400 });

//         const buffer = Buffer.from(await file.arrayBuffer());
//         const safeName = file.name.replace(/[^\w.\-]+/g, "_");

        

//     } catch (error) {
        
//     }

  

//   return NextResponse.json(timetable);
// }