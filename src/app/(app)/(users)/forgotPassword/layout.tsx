import type { Metadata } from "next";
import { AuthEntryShell } from "@/components/auth/AuthEntryShell";

export const metadata: Metadata = {
  title: "Forgot password",
  description: "Reset your campus portal password",
};

export default async function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthEntryShell>{children}</AuthEntryShell>;
}
