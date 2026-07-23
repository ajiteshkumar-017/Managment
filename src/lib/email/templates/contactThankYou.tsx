import { Heading, Text } from "@react-email/components";
import * as React from "react";
import { BaseLayout } from "../layouts";
import { emailConfig } from "../email.config";

export type ContactThankYouEmailProps = {
  firstName: string;
  enquiryType?: string;
};

export function ContactThankYouEmail({
  firstName,
  enquiryType,
}: ContactThankYouEmailProps) {
  const displayName = firstName.trim() || "there";

  return (
    <BaseLayout
      preview={`We received your enquiry — ${emailConfig.collegeName}`}
    >
      <Heading as="h1" style={styles.heading}>
        Thank you, {displayName}
      </Heading>

      <Text style={styles.intro}>
        We have received your enquiry
        {enquiryType ? (
          <>
            {" "}
            regarding <strong style={styles.strong}>{enquiryType}</strong>
          </>
        ) : null}
        . Our team will review it and try to reply with the correct information
        within <strong style={styles.strong}>48–72 hours</strong>.
      </Text>

      <Text style={styles.intro}>
        If your request is urgent, you can also reach us through the helplines
        listed on our Contact Us page.
      </Text>

      <Text style={styles.signoff}>
        Best regards,
        <br />
        {emailConfig.collegeName} team
      </Text>
    </BaseLayout>
  );
}

export default ContactThankYouEmail;

const styles = {
  heading: {
    margin: "0",
    fontSize: "28px",
    lineHeight: "1.25",
    color: "#111827",
    fontWeight: "700",
    fontFamily:
      'Arial, Helvetica, sans-serif, "Segoe UI", Roboto, "Helvetica Neue"',
  },
  intro: {
    margin: "16px 0 0 0",
    fontSize: "15px",
    lineHeight: "1.7",
    color: "#4B5563",
    fontFamily:
      'Arial, Helvetica, sans-serif, "Segoe UI", Roboto, "Helvetica Neue"',
  },
  strong: {
    color: "#111827",
  },
  signoff: {
    margin: "24px 0 0 0",
    fontSize: "14px",
    lineHeight: "1.7",
    color: "#6B7280",
    fontFamily:
      'Arial, Helvetica, sans-serif, "Segoe UI", Roboto, "Helvetica Neue"',
  },
};
