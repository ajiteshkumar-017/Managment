import type { Metadata } from "next";
import { AuthEntryShell } from "@/components/auth/AuthEntryShell";
import { noIndexMetadata } from "@/lib/seo";

export const metadata: Metadata = noIndexMetadata(
  "Forgot password",
  "Reset your IIT Dholakpur campus portal password.",
);

export default async function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthEntryShell>{children}</AuthEntryShell>;
}
