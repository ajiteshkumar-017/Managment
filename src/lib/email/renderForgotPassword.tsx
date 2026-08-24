import * as React from "react";
import { render } from "@react-email/render";
import {
  ForgotPasswordEmail,
  type ForgotPasswordEmailProps,
} from "./templates/forgotPassword";
import { emailConfig } from "./email.config";

export async function renderForgotPasswordEmail(
  params: ForgotPasswordEmailProps,
) {
  const html = await render(
    <ForgotPasswordEmail
      name={params.name}
      email={params.email}
      resetUrl={params.resetUrl}
      expiresIn={params.expiresIn}
    />,
  );

  return {
    subject: `Reset your ${emailConfig.collegeName} password`,
    html,
  };
}
