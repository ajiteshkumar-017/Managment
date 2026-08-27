import type { Metadata } from "next";
import { AdminSessionGuard } from "@/components/layouts/AdminSessionGuard";
import { noIndexMetadata } from "@/lib/seo";

export const metadata: Metadata = noIndexMetadata("Admin portal");

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminSessionGuard>{children}</AdminSessionGuard>;
}
