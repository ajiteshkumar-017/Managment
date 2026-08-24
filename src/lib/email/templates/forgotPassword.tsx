import { Heading, Link, Text } from "@react-email/components";
import * as React from "react";
import { BaseLayout, EmailButton } from "../layouts";
import { emailConfig } from "../email.config";

export type ForgotPasswordEmailProps = {
  name: string;
  email?: string;
  resetUrl: string;
  expiresIn?: string;
};

export function ForgotPasswordEmail({
  name,
  email,
  resetUrl,
  expiresIn = "1 hour",
}: ForgotPasswordEmailProps) {
  const displayName = name.trim() || "there";

  return (
    <BaseLayout
      preview={`Reset your ${emailConfig.collegeName} password`}
    >
      <Heading as="h1" style={styles.heading}>
        Reset your password
      </Heading>

      <Text style={styles.intro}>
        Hi {displayName}, we received a request to reset the password for your{" "}
        {emailConfig.collegeName} account
        {email ? (
          <>
            {" "}
            (<strong style={styles.strong}>{email}</strong>)
          </>
        ) : null}
        . Click the button below to choose a new password.
      </Text>

      <Text style={styles.ctaWrap}>
        <EmailButton href={resetUrl}>Reset password</EmailButton>
      </Text>

      <Text style={styles.meta}>
        This link expires in <strong style={styles.strong}>{expiresIn}</strong>.
        If you did not ask to reset your password, you can ignore this email —
        your account stays unchanged.
      </Text>

      <Text style={styles.fallback}>
        If the button does not work, copy and paste this link into your browser:
        <br />
        <Link href={resetUrl} style={styles.link}>
          {resetUrl}
        </Link>
      </Text>
    </BaseLayout>
  );
}

export default ForgotPasswordEmail;

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
  ctaWrap: {
    margin: "28px 0 0 0",
  },
  meta: {
    margin: "20px 0 0 0",
    fontSize: "13px",
    lineHeight: "1.6",
    color: "#6B7280",
    fontFamily:
      'Arial, Helvetica, sans-serif, "Segoe UI", Roboto, "Helvetica Neue"',
  },
  fallback: {
    margin: "16px 0 0 0",
    fontSize: "12px",
    lineHeight: "1.6",
    color: "#9CA3AF",
    wordBreak: "break-all" as const,
    fontFamily:
      'Arial, Helvetica, sans-serif, "Segoe UI", Roboto, "Helvetica Neue"',
  },
  link: {
    color: emailConfig.brandColor,
    textDecoration: "none",
    fontWeight: "600",
  },
};
