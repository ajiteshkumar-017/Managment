import type { Metadata } from "next";
import { FacultyPanelShell } from "@/components/layouts/FacultyPanelShell";
import { noIndexMetadata } from "@/lib/seo";

export const metadata: Metadata = noIndexMetadata("Faculty portal");

export default function FacultyPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <FacultyPanelShell>{children}</FacultyPanelShell>;
}
