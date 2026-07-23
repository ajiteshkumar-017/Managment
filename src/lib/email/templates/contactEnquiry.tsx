import { Heading, Link, Text } from "@react-email/components";
import * as React from "react";
import { BaseLayout } from "../layouts";
import { emailConfig } from "../email.config";

export type ContactEnquiryEmailProps = {
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  enquiryType: string;
  message: string;
};

export function ContactEnquiryEmail({
  firstName,
  lastName,
  email,
  phone,
  enquiryType,
  message,
}: ContactEnquiryEmailProps) {
  const fullName = [firstName.trim(), lastName?.trim()].filter(Boolean).join(" ");

  return (
    <BaseLayout preview={`New ${enquiryType} enquiry from ${fullName || email}`}>
      <Heading as="h1" style={styles.heading}>
        New contact enquiry
      </Heading>

      <Text style={styles.intro}>
        Someone submitted the Contact Us form on the {emailConfig.collegeName}{" "}
        portal.
      </Text>

      <Text style={styles.row}>
        <span style={styles.label}>Name</span>
        <br />
        {fullName || "—"}
      </Text>

      <Text style={styles.row}>
        <span style={styles.label}>Email</span>
        <br />
        <Link href={`mailto:${email}`} style={styles.link}>
          {email}
        </Link>
      </Text>

      {phone?.trim() ? (
        <Text style={styles.row}>
          <span style={styles.label}>Phone</span>
          <br />
          <Link href={`tel:${phone.replace(/\s/g, "")}`} style={styles.link}>
            {phone}
          </Link>
        </Text>
      ) : null}

      <Text style={styles.row}>
        <span style={styles.label}>Enquiry type</span>
        <br />
        {enquiryType}
      </Text>

      <Text style={styles.row}>
        <span style={styles.label}>Message</span>
        <br />
        <span style={styles.message}>{message}</span>
      </Text>
    </BaseLayout>
  );
}

export default ContactEnquiryEmail;

const styles = {
  heading: {
    margin: "0",
    fontSize: "24px",
    lineHeight: "1.3",
    color: "#111827",
    fontWeight: "700",
    fontFamily:
      'Arial, Helvetica, sans-serif, "Segoe UI", Roboto, "Helvetica Neue"',
  },
  intro: {
    margin: "14px 0 0 0",
    fontSize: "15px",
    lineHeight: "1.7",
    color: "#4B5563",
    fontFamily:
      'Arial, Helvetica, sans-serif, "Segoe UI", Roboto, "Helvetica Neue"',
  },
  row: {
    margin: "18px 0 0 0",
    fontSize: "15px",
    lineHeight: "1.6",
    color: "#111827",
    fontFamily:
      'Arial, Helvetica, sans-serif, "Segoe UI", Roboto, "Helvetica Neue"',
  },
  label: {
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "0.04em",
    textTransform: "uppercase" as const,
    color: "#6B7280",
  },
  link: {
    color: emailConfig.brandColor,
    textDecoration: "none",
    fontWeight: "600",
  },
  message: {
    display: "block" as const,
    marginTop: "6px",
    whiteSpace: "pre-wrap" as const,
    color: "#374151",
  },
};
