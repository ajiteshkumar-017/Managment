import type { MetadataRoute } from "next";
import { getSiteUrl, PUBLIC_PATHS } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const lastModified = new Date();

  return PUBLIC_PATHS.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified,
    changeFrequency: path === "/landingPage" ? "weekly" : "monthly",
    priority: path === "/landingPage" ? 1 : path === "/about" || path === "/courses" ? 0.8 : 0.6,
  }));
}
