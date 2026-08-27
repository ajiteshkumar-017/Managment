import { createPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "Courses & Programmes",
  description:
    "B.Tech, M.Tech and PhD programmes at IIT Dholakpur across CSE, Mechanical, Civil, Electrical and Aerospace engineering.",
  path: "/courses",
  keywords: ["B.Tech", "M.Tech", "PhD", "engineering programmes"],
});

export { default } from "@/components/seo/SeoLayout";
