import { createPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "Faculty",
  description:
    "Meet faculty at IIT Dholakpur — departments, research, and contact details for engineering educators.",
  path: "/faculty",
  keywords: ["IIT Dholakpur faculty", "engineering professors"],
});

export { default } from "@/components/seo/SeoLayout";
