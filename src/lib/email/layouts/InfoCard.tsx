import { Section, Text } from "@react-email/components";
import * as React from "react";
import { emailConfig } from "../email.config";

type InfoCardProps = {
  title?: string;
  items: string[];
};

export function InfoCard({ title = "What you can do", items }: InfoCardProps) {
  return (
    <Section style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {items.map((item) => (
        <Text key={item} style={styles.item}>
          <span style={styles.check}>✓</span> {item}
        </Text>
      ))}
    </Section>
  );
}

const styles = {
  card: {
    marginTop: "24px",
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
    padding: "20px",
  },
  title: {
    margin: "0 0 12px 0",
    fontSize: "12px",
    letterSpacing: "1px",
    textTransform: "uppercase" as const,
    color: emailConfig.brandColor,
    fontWeight: "700",
  },
  item: {
    margin: "0 0 10px 0",
    fontSize: "14px",
    lineHeight: "22px",
    color: "#334155",
  },
  check: {
    color: emailConfig.brandColor,
    fontWeight: "700",
    marginRight: "8px",
  },
};
