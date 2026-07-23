import { Hr } from "@react-email/components";
import * as React from "react";

type EmailDividerProps = {
  style?: React.CSSProperties;
};

export function EmailDivider({ style }: EmailDividerProps) {
  return <Hr style={{ ...styles.divider, ...style }} />;
}

const styles = {
  divider: {
    borderColor: "#e2e8f0",
    borderTop: "1px solid #e2e8f0",
    margin: "24px 0",
  },
};
