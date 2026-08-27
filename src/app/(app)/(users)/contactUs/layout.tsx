import { createPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "Contact Us",
  description:
    "Contact IIT Dholakpur for admissions, academics, and campus enquiries. Campus: Komna, Nuapada, Odisha.",
  path: "/contactUs",
  keywords: ["IIT Dholakpur contact", "admissions helpline"],
});

export { default } from "@/components/seo/SeoLayout";
