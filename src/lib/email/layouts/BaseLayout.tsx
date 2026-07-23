import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
} from "@react-email/components";
import * as React from "react";
import { EmailHeader } from "./EmailHeader";
import { EmailFooter } from "./EmailFooter";
import { emailConfig } from "../email.config";

type BaseLayoutProps = {
  preview: string;
  children: React.ReactNode;
  collegeName?: string;
  logoUrl?: string;
  supportEmail?: string;
};

export function BaseLayout({
  preview,
  children,
  collegeName = emailConfig.collegeName,
  logoUrl = emailConfig.logoUrl,
  supportEmail = emailConfig.supportEmail,
}: BaseLayoutProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.inner}>
            <EmailHeader collegeName={collegeName} logoUrl={logoUrl} />
            {children}
            <EmailFooter collegeName={collegeName} supportEmail={supportEmail} />
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  body: {
    margin: "0",
    padding: "32px 12px",
    backgroundColor: "#F3F4F6",
    fontFamily:
      'Arial, Helvetica, sans-serif, "Segoe UI", Roboto, "Helvetica Neue"',
  },
  container: {
    maxWidth: "560px",
    margin: "0 auto",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    overflow: "hidden" as const,
    border: "1px solid #E5E7EB",
  },
  inner: {
    padding: "36px 40px 32px 40px",
  },
};
