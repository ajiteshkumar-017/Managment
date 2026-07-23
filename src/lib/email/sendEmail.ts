import { resend } from "./transporter";
import { emailConfig } from "./email.config";

interface SendEmailProps {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
}: SendEmailProps) {
  return resend.emails.send({
    from: emailConfig.from,
    to,
    subject,
    html,
    ...(replyTo ? { replyTo } : {}),
  });
}