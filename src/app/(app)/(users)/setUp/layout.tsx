import type { Metadata } from "next";
import { noIndexMetadata } from "@/lib/seo";

export const metadata: Metadata = noIndexMetadata("Complete your profile");

export { default } from "@/components/seo/SeoLayout";
