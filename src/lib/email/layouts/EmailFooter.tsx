import { Link, Section, Text } from "@react-email/components";
import * as React from "react";
import { emailConfig } from "../email.config";
import { EmailDivider } from "./EmailDivider";

type EmailFooterProps = {
  collegeName?: string;
  supportEmail?: string;
};

export function EmailFooter({
  collegeName = emailConfig.collegeName,
  supportEmail = emailConfig.supportEmail,
}: EmailFooterProps) {
  return (
    <Section style={styles.footer}>
      <EmailDivider style={styles.divider} />
      <Text style={styles.help}>
        Having trouble with your account?{" "}
        <Link href={`mailto:${supportEmail}`} style={styles.link}>
          Contact us
        </Link>
      </Text>
      <Text style={styles.signoff}>
        Best,
        <br />~ {collegeName} team
      </Text>
    </Section>
  );
}

const styles = {
  footer: {
    padding: "0",
  },
  divider: {
    margin: "28px 0 20px 0",
  },
  help: {
    margin: "0",
    fontSize: "13px",
    lineHeight: "1.6",
    color: "#9CA3AF",
    fontFamily:
      'Arial, Helvetica, sans-serif, "Segoe UI", Roboto, "Helvetica Neue"',
  },
  link: {
    color: emailConfig.brandColor,
    textDecoration: "none",
    fontWeight: "600",
  },
  signoff: {
    margin: "18px 0 0 0",
    fontSize: "13px",
    lineHeight: "1.7",
    color: "#9CA3AF",
    fontFamily:
      'Arial, Helvetica, sans-serif, "Segoe UI", Roboto, "Helvetica Neue"',
  },
};
