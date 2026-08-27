import type { Metadata } from "next";
import { noIndexMetadata } from "@/lib/seo";

export const metadata: Metadata = noIndexMetadata("Testing");

export { default } from "@/components/seo/SeoLayout";
