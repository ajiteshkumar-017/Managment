import type { Metadata } from "next";
import { noIndexMetadata } from "@/lib/seo";

export const metadata: Metadata = noIndexMetadata("Loading");

export { default } from "@/components/seo/SeoLayout";
