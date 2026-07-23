import * as React from "react";
import { render } from "@react-email/render";
import {
  ContactThankYouEmail,
  type ContactThankYouEmailProps,
} from "./templates/contactThankYou";
import { emailConfig } from "./email.config";

export async function renderContactThankYouEmail(
  params: ContactThankYouEmailProps,
) {
  const html = await render(
    <ContactThankYouEmail
      firstName={params.firstName}
      enquiryType={params.enquiryType}
    />,
  );

  return {
    subject: `We received your enquiry — ${emailConfig.collegeName}`,
    html,
  };
}
