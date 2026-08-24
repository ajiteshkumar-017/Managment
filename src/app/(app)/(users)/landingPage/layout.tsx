import { AuthEntryShell } from "@/components/auth/AuthEntryShell";

export const dynamic = "force-dynamic";

export default async function LandingPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthEntryShell>{children}</AuthEntryShell>;
}
