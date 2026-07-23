import * as React from "react";
import { render } from "@react-email/render";
import { WelcomeEmail, type WelcomeEmailProps } from "./templates/welcome";
import { emailConfig } from "./email.config";

export async function renderWelcomeEmail(params: WelcomeEmailProps) {
  const html = await render(
    <WelcomeEmail
      name={params.name}
      email={params.email}
      loginUrl={params.loginUrl}
    />,
  );

  return {
    subject: `Welcome to ${emailConfig.collegeName}, ${params.name.trim() || "there"}`,
    html,
  };
}

/** Back-compat helper used by API routes */
export async function welcomeEmailTemplate(params: {
  name: string;
  email?: string;
  loginUrl?: string;
  role?: string;
}) {
  return renderWelcomeEmail({
    name: params.name,
    email: params.email,
    loginUrl: params.loginUrl,
  });
}
