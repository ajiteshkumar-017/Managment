import { AuthEntryShell } from "@/components/auth/AuthEntryShell";
import { createPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createPageMetadata({
  title: "IIT Dholakpur | Engineering & Technology, Nuapada, Odisha",
  description:
    "Welcome to IIT Dholakpur in Komna, Nuapada, Odisha. Explore undergraduate and postgraduate engineering programmes, faculty, campus resources, and admissions.",
  path: "/landingPage",
  keywords: ["IIT Dholakpur admissions", "engineering college Nuapada"],
  absoluteTitle: true,
});

export default async function LandingPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthEntryShell>{children}</AuthEntryShell>;
}
