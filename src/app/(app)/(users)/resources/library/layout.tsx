import { createPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "Central Library",
  description:
    "Collections, digital access, timings, and services at the IIT Dholakpur central library.",
  path: "/resources/library",
});

export { default } from "@/components/seo/SeoLayout";
