import type { Metadata } from "next";
import { ManagementShell } from "@/components/layouts/ManagementShell";
import { noIndexMetadata } from "@/lib/seo";

export const metadata: Metadata = noIndexMetadata("Student portal");

export default function ManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ManagementShell>{children}</ManagementShell>;
}
