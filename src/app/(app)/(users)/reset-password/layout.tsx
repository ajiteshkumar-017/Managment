import type { Metadata } from "next";
import { AuthEntryShell } from "@/components/auth/AuthEntryShell";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Choose a new campus portal password",
};

export default async function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthEntryShell>{children}</AuthEntryShell>;
}
