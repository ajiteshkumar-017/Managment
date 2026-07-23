import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email/sendEmail";
import { renderContactEnquiryEmail } from "@/lib/email/renderContactEnquiry";
import { renderContactThankYouEmail } from "@/lib/email/renderContactThankYou";
import { createRequestLogger } from "@/lib/requestLogger";

const ENQUIRY_TYPES = new Set(["Admissions", "Academics", "Hostel", "Other"]);

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  const requestLogger = createRequestLogger();

  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, message: "Invalid request body" },
        { status: 400 },
      );
    }

    const firstName = String(body.firstName ?? "").trim();
    const lastName = String(body.lastName ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const phone = String(body.phone ?? "").trim();
    const enquiryTypeRaw = String(body.enquiryType ?? "Other").trim();
    const enquiryType = ENQUIRY_TYPES.has(enquiryTypeRaw)
      ? enquiryTypeRaw
      : "Other";
    const message = String(body.message ?? "").trim();

    if (!firstName || !email || !message) {
      return NextResponse.json(
        {
          success: false,
          message: "First name, email, and message are required",
        },
        { status: 400 },
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid email address" },
        { status: 400 },
      );
    }

    if (message.length > 5000) {
      return NextResponse.json(
        { success: false, message: "Message is too long" },
        { status: 400 },
      );
    }

    const enquiryTemplate = await renderContactEnquiryEmail({
      firstName,
      lastName,
      email,
      phone,
      enquiryType,
      message,
    });

    const enquiryResult = await sendEmail({
      to: enquiryTemplate.to,
      subject: enquiryTemplate.subject,
      html: enquiryTemplate.html,
      replyTo: enquiryTemplate.replyTo,
    });

    if (enquiryResult.error) {
      requestLogger.error(
        { err: enquiryResult.error },
        "Contact enquiry email failed",
      );
      return NextResponse.json(
        {
          success: false,
          message: enquiryResult.error.message || "Failed to send message",
        },
        { status: 500 },
      );
    }

    const thankYouTemplate = await renderContactThankYouEmail({
      firstName,
      enquiryType,
    });

    const thankYouResult = await sendEmail({
      to: email,
      subject: thankYouTemplate.subject,
      html: thankYouTemplate.html,
    });

    if (thankYouResult.error) {
      // Enquiry already delivered — don't fail the form for auto-reply issues
      // (e.g. Resend free tier only allows sending to verified account email).
      requestLogger.warn(
        { err: thankYouResult.error, email },
        "Contact thank-you email failed",
      );
    } else {
      requestLogger.info(
        { id: thankYouResult.data?.id, email },
        "Contact thank-you email sent",
      );
    }

    requestLogger.info(
      {
        enquiryId: enquiryResult.data?.id,
        thankYouId: thankYouResult.data?.id,
        enquiryType,
        email,
      },
      "Contact enquiry email sent",
    );

    return NextResponse.json({
      success: true,
      message: "Message sent successfully",
      id: enquiryResult.data?.id,
      thankYouId: thankYouResult.data?.id ?? null,
    });
  } catch (error) {
    requestLogger.error({ err: error }, "Contact enquiry crashed");
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to send message",
      },
      { status: 500 },
    );
  }
}
