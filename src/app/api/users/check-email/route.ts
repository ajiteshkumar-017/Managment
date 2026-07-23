import { NextRequest, NextResponse } from "next/server";
import { User } from "@/models/user"
import Connect from "@/dbConnect/connect";
import { createRequestLogger } from "@/lib/requestLogger";

export async function GET(req: NextRequest) {
  const requestLogger = createRequestLogger();
  try {
    await Connect();

    const email = req.nextUrl.searchParams.get("email");

    if(!email) {
      console.log("No Email is received to backend");
      requestLogger.warn({ reason: "missing_email" }, "No email received");

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
      requestLogger.info({ email, exists: false }, "Check email: not registered");
      return NextResponse.json({
        exists: false
      });
    }

    requestLogger.warn({ email, userId: user._id, exists: true }, "Email already exists");
    return NextResponse.json({
      message: "Email is already exists",
      exists: !!user,
    });
  } catch (error: unknown) {
    requestLogger.error({ err: error }, "Check email failed");
    return NextResponse.json(
      { message: "Server error checking email" },
      { status: 500 }
    );
  }
}
