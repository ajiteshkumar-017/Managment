import { Column, Img, Row, Section, Text } from "@react-email/components";
import * as React from "react";
import { emailConfig } from "../email.config";

type EmailHeaderProps = {
  collegeName?: string;
  logoUrl?: string;
};

export function EmailHeader({
  collegeName = emailConfig.collegeName,
  logoUrl = emailConfig.logoUrl,
}: EmailHeaderProps) {
  return (
    <Section style={styles.header}>
      <Row>
        <Column style={styles.logoCol}>
          <Img
            src={logoUrl}
            width="40"
            height="40"
            alt={`${collegeName} logo`}
            style={styles.logo}
          />
        </Column>
        <Column style={styles.nameCol}>
          <Text style={styles.collegeName}>{collegeName}</Text>
        </Column>
      </Row>
    </Section>
  );
}

const styles = {
  header: {
    padding: "8px 0 28px 0",
  },
  logoCol: {
    width: "48px",
    verticalAlign: "middle" as const,
  },
  nameCol: {
    verticalAlign: "middle" as const,
    paddingLeft: "12px",
  },
  logo: {
    display: "block",
    borderRadius: "8px",
  },
  collegeName: {
    margin: "0",
    fontSize: "18px",
    fontWeight: "700",
    color: "#111827",
    fontFamily:
      'Arial, Helvetica, sans-serif, "Segoe UI", Roboto, "Helvetica Neue"',
    lineHeight: "40px",
  },
};
