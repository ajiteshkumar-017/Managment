import { NextRequest, NextResponse } from "next/server";
import { User } from "@/models/user"

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");

  if(!email) {
    console.log("No Email is received to backend");

    return NextResponse.json(
        {
            message: "No email is recieved to backend."
        },
        {
            status:400
        }
    )
  }

  const user = await User.findOne({ email });

  console.log("User data: ",user)

  if (!user) {
   return NextResponse.json({
      exists: false
   });
}

  return NextResponse.json({
    exists: !!user,
  });
}