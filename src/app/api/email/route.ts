import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Welcome",
            html: "<h1>Hello!</h1>"
        });

        return NextResponse.json({
            success: true
        });

    } catch (error) {
        return NextResponse.json({
            success: false
        });
    }
}