import Connect from "@/dbConnect/connect";
import { Student } from "@/models/student.model";
import { User } from "@/models/user"; 
import {NextResponse, NextRequest} from "next/server";
import { text } from "node:stream/consumers";



export async function GET(req:NextRequest) {
    try {
        await Connect();

        const {searchParams} = new URL(req.url);
        let searchTerm = searchParams.get("search");

        const existingUser = await User.findOne({ username: "kumar" });
        
        if (!existingUser) {
            console.log("⚠️ Could not find a user named 'kumar' in the database.");
            return NextResponse.json({ 
                success: false, 
                message: "Please ensure a user with username 'kumar' exists first!" 
            }, { status: 400 });
        }

        // STEP 2: Check if a student document is already linked to this user's ID
        const existingStudent = await Student.findOne({ userId: existingUser._id });

        if (!existingStudent) {
            console.log("⚠️ Student document missing. Seeding linked record for 'kumar' now...");
            
            // Force-insert a clean student document using your Mongoose Model
            await Student.create({
                userId: existingUser._id, // This links it to the actual user record dynamically
                semester: 1,
                department: "Computer Science and Engineering",
                section: "A",
                status: "active",
                batch: "2025-29",
                rollNumber: "25BTCSE05",
                admissionYear: "2025"
            });
            
            console.log("✅ Linked student document created successfully!");
        }

        // STEP 3: If no search term is passed, just return the data to check it
        if (!searchTerm) {
            const allStudents = await Student.find({}).populate('userId').lean();
            return NextResponse.json({ success: true, message: "Displaying all data", user: allStudents });
        }
        
        searchTerm = searchTerm.replace(/^["']|["']$/g, '').trim();
        const textSearchRule = { $regex: searchTerm, $options: "i" };

        const studentMatchConditions: any[] = [
            { department: textSearchRule },
            { section: textSearchRule },
            { status: textSearchRule }
        ];

        const numericValue = parseInt(searchTerm, 10);
        if (!isNaN(numericValue)) {
            studentMatchConditions.push({ semester: numericValue });
        }

        // STEP 4: Run the aggregation pipeline search
        const searchResults = await Student.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userDetail"
                },
            },
            {
                $unwind: {
                    path: "$userDetail",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $match: {
                    $or: [
                        ...studentMatchConditions,
                        { 'userDetail.username': textSearchRule }
                    ]
                }
            },
            {
                $project: {
                    _id: 1,
                    semester: 1,
                    department: 1,
                    status: 1,
                    section: 1,
                    batch: 1,
                    rollNumber: 1,
                    admissionYear: 1,
                    userId: "$userDetail"
                }
            }
        ]);

        if (!searchResults || searchResults.length === 0) {
            return NextResponse.json({ success: false, message: "No search matches found" }, { status: 404 });
        }

        console.log("User Details:", searchResults);
        return NextResponse.json({ success: true, message: "Found the User details", user: searchResults }, { status: 200 });

//          const exactUserCollectionName = User.collection.name; 
//         console.log("👉 REAL MONGO COLLECTION NAME IS:", exactUserCollectionName);

//         const {searchParams} = new URL(req.url)
//         let searchTerm = searchParams.get("search")

//         console.log("Serach Term:", searchTerm)

//         if(!searchTerm){
//             console.log("No SearchTerm is found");
//             return NextResponse.json(
//                 {
//                     success: false,
//                     message: "No SearchTerm is found"
//                 },
//                 {
//                     status: 404
//                 }
//             )
//         }
//         searchTerm  = searchTerm.replace(/^["']|["']$/g, '').trim();

//         const textSearchRule = { $regex: searchTerm, $options: "i"};

//         const studentMatchConditions: any[] = [
//       { department: textSearchRule },
//       { section: textSearchRule },
//       { status: textSearchRule }
//     ];
//         console.log("Field to Check:", studentMatchConditions)

//         const numericValue = parseInt(searchTerm, 10);

//         if(!isNaN(numericValue)){
//             studentMatchConditions.push({semester: numericValue})
//         }

//         const checkUserDirectly = await User.find({
//             $or: [
//                 { username: textSearchRule },
//                 { name: textSearchRule }
//             ]
//         }).lean();
//         console.log("👉 DIRECT USER DB CHECK:", JSON.stringify(checkUserDirectly, null, 2));


       
//         const user = await Student.aggregate([
            
//             {
//                 $lookup: {
//                     from :"users",
//                     localField: "userId",
//                     foreignField: "_id",
//                     as: "userDetail"
//                 }
//             },
//             {
//                 $unwind : {
//                     path: "$userDetail",
//                     preserveNullAndEmptyArrays: true
//                 }
//             },
//             {
//                 $match: {
//                     $or: [
//                         ...studentMatchConditions,
//                         {"userDetail.username" : textSearchRule}
//                     ]
//                 }
//             },
//             {
//                 $project: {
//                     _id: 1,
//                     semester : 1,
//                     department : 1,
//                     section : 1,
//                     status: 1,
//                     batch: 1,          // Added so these don't get deleted
//                     rollNumber: 1,     // Added so these don't get deleted
//                     admissionYear: 1,  // Added so these don't get deleted
//                     userId : "$userDetail"

//                 }
//             }
//         ])
        
// //         const user = await Student.aggregate([
// //     {
// //         $lookup: {
// //             from: "users",
// //             localField: "userId",
// //             foreignField: "_id",
// //             as: "userDetail"
// //         }
// //     },
// //     { $limit: 1 } 
// // ]);
// // console.log("DEBUG LOOKUP RESULT:", JSON.stringify(user, null, 2));

//         if(!user){
//             console.log("User Data :", user)
//             console.log("No data is founded in Database ");

//             return NextResponse.json(
//                 {
//                     success: false,
//                     message: "No data is found. Please Search other relavant Data"
//                 },
//                 {
//                     status: 404
//                 }
//             )
//         }

//         console.log("User Details :", user)

//         return NextResponse.json(
//             {
//                 success: true,
//                 message: "Found the User details",
//                 user
//             }, {status: 200}
//         )



    } catch (err:any) {
        console.log("Error in Search Term. Please try after Some time:", err);
        return NextResponse.json(
            {
                success: false,
                message:"Error in Finding Term"
            },
            {
                status: 500
            }
        )
    }
}