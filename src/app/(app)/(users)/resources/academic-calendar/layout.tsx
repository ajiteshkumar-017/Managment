import { createPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "Academic Calendar",
  description:
    "Key dates for registration, classes, examinations, and breaks at IIT Dholakpur.",
  path: "/resources/academic-calendar",
});

export { default } from "@/components/seo/SeoLayout";
