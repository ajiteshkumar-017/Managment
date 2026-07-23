import * as React from "react";
import { render } from "@react-email/render";
import {
  ContactEnquiryEmail,
  type ContactEnquiryEmailProps,
} from "./templates/contactEnquiry";
import { emailConfig } from "./email.config";

export async function renderContactEnquiryEmail(
  params: ContactEnquiryEmailProps,
) {
  const fullName = [params.firstName.trim(), params.lastName?.trim()]
    .filter(Boolean)
    .join(" ");

  const html = await render(
    <ContactEnquiryEmail
      firstName={params.firstName}
      lastName={params.lastName}
      email={params.email}
      phone={params.phone}
      enquiryType={params.enquiryType}
      message={params.message}
    />,
  );

  return {
    subject: `[Contact] ${params.enquiryType} — ${fullName || params.email}`,
    html,
    replyTo: params.email,
    to: emailConfig.contactToEmail,
  };
}
