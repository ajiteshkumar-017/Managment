import Connect from "@/dbConnect/connect";
import { emailConfig, sendEmail } from "@/lib/email";
import { renderForgotPasswordEmail } from "@/lib/email/renderForgotPassword";
import { createRequestLogger } from "@/lib/requestLogger";
import { User } from "@/models";
import { SignJWT } from "jose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const logger = createRequestLogger();

  try {
    await Connect();

    const body = await request.json();
    const email = String(body?.email ?? "").trim().toLowerCase();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 },
      );
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User is new to us. Please register to continue.",
        },
        { status: 404 },
      );
    }

    const token = await new SignJWT({
      _id: String(existingUser._id),
      email: existingUser.email,
      role: existingUser.role,
      purpose: "password_reset",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1h")
      .sign(new TextEncoder().encode(process.env.JWT_SECRET));

    const resetUrl = `${emailConfig.appUrl}/reset-password?token=${token}`;
    const template = await renderForgotPasswordEmail({
      name: existingUser.username ?? "there",
      email: existingUser.email,
      resetUrl,
      expiresIn: "1 hour",
    });

    const result = await sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
    });

    if (result.error) {
      logger.error({ err: result.error, email }, "Failed to send password reset email");
      return NextResponse.json(
        {
          success: false,
          message: result.error.message || "Failed to send password reset email",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Password reset email sent",
        data: { url: resetUrl },
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error({ err: error }, "Failed to send password reset email");
    return NextResponse.json(
      { success: false, message: "Failed to send password reset email" },
      { status: 500 },
    );
  }
}
