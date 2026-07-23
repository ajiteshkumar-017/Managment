import { NextResponse, NextRequest } from "next/server";
import { sendEmail } from "@/lib/email/sendEmail";
import { renderWelcomeEmail } from "@/lib/email/renderWelcome";
import { createRequestLogger } from "@/lib/requestLogger";

export async function POST(request: NextRequest) {
  const requestLogger = createRequestLogger();

  try {
    const body = await request.json().catch(() => ({}));
    const name = body.name || "Ajitesh";
    const to = body.to || "ajiteshk007@gmail.com";

    const template = await renderWelcomeEmail({
      name,
      email: to,
    });

    const result = await sendEmail({
      to,
      subject: template.subject,
      html: template.html,
    });

    if (result.error) {
      requestLogger.error({ err: result.error }, "Test email failed");
      return NextResponse.json(
        {
          success: false,
          message: result.error.message || "Failed to send email",
          error: result.error,
        },
        { status: 500 },
      );
    }

    requestLogger.info({ id: result.data?.id }, "Welcome test email sent");
    return NextResponse.json({
      success: true,
      message: "Welcome test email sent successfully",
      id: result.data?.id,
    });
  } catch (error) {
    requestLogger.error({ err: error }, "Test email crashed");
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to send email",
      },
      { status: 500 },
    );
  }
}
