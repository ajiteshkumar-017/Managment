import { createPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "Alumni",
  description:
    "Stay connected with the IIT Dholakpur alumni community across industry, research, and entrepreneurship.",
  path: "/resources/alumni",
});

export { default } from "@/components/seo/SeoLayout";
