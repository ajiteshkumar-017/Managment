import type { Metadata } from "next";
import { AuthEntryShell } from "@/components/auth/AuthEntryShell";
import { noIndexMetadata } from "@/lib/seo";

export const metadata: Metadata = noIndexMetadata(
  "Reset password",
  "Choose a new IIT Dholakpur campus portal password.",
);

export default async function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthEntryShell>{children}</AuthEntryShell>;
}
