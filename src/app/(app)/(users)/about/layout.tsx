import { createPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "About the Institute",
  description:
    "Learn about IIT Dholakpur — history, governance, mission, and vision as an engineering institute in Komna, Nuapada, Odisha.",
  path: "/about",
});

export { default } from "@/components/seo/SeoLayout";
