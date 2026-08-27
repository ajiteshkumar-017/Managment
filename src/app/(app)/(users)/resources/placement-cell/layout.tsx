import { createPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "Placement Cell",
  description:
    "Campus placements, internships, and recruiting partners at IIT Dholakpur.",
  path: "/resources/placement-cell",
  keywords: ["campus placements", "IIT Dholakpur recruiters"],
});

export { default } from "@/components/seo/SeoLayout";
