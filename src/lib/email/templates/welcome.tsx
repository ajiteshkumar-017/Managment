import { Heading, Text } from "@react-email/components";
import * as React from "react";
import { BaseLayout, EmailButton } from "../layouts";
import { emailConfig } from "../email.config";

export type WelcomeEmailProps = {
  name: string;
  email?: string;
  loginUrl?: string;
};

/** Shared welcome email for user / student (Akkio-style layout). */
export function WelcomeEmail({
  name,
  email,
  loginUrl = emailConfig.landingUrl,
}: WelcomeEmailProps) {
  const displayName = name.trim() || "there";

  return (
    <BaseLayout preview={`Welcome to ${emailConfig.collegeName}, ${displayName}`}>
      <Heading as="h1" style={styles.heading}>
        Welcome, {displayName}
      </Heading>

      <Text style={styles.intro}>
        Your account on the {emailConfig.collegeName} College Management Portal is
        ready. Sign in to explore your dashboard and stay connected with campus
        updates.
      </Text>

      {email ? (
        <Text style={styles.meta}>
          Signed up with <strong style={styles.strong}>{email}</strong>
        </Text>
      ) : null}

      <Text style={styles.ctaWrap}>
        <EmailButton href={loginUrl}>Open Campus Portal</EmailButton>
      </Text>
    </BaseLayout>
  );
}

export default WelcomeEmail;

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
  meta: {
    margin: "14px 0 0 0",
    fontSize: "13px",
    lineHeight: "1.6",
    color: "#6B7280",
    fontFamily:
      'Arial, Helvetica, sans-serif, "Segoe UI", Roboto, "Helvetica Neue"',
  },
  strong: {
    color: "#111827",
  },
  ctaWrap: {
    margin: "28px 0 0 0",
  },
};
