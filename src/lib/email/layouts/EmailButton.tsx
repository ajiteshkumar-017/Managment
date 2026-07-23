import { Button } from "@react-email/components";
import * as React from "react";
import { emailConfig } from "../email.config";

type EmailButtonProps = {
  href: string;
  children: React.ReactNode;
};

export function EmailButton({ href, children }: EmailButtonProps) {
  return (
    <Button href={href} style={styles.button}>
      {children}
    </Button>
  );
}

const styles = {
  button: {
    backgroundColor: emailConfig.brandColor,
    borderRadius: "10px",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "700",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "inline-block",
    padding: "14px 22px",
    lineHeight: "100%",
    fontFamily:
      'Arial, Helvetica, sans-serif, "Segoe UI", Roboto, "Helvetica Neue"',
  },
};
