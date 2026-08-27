import { createPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "Campus Resources",
  description:
    "Academic calendar, library, placement cell, student portal, and alumni network at IIT Dholakpur.",
  path: "/resources",
});

export { default } from "@/components/seo/SeoLayout";
