import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/dashboard",
          "/attendance",
          "/course$",
          "/course/",
          "/assignments",
          "/setting",
          "/result",
          "/messages",
          "/notifications",
          "/setUp",
          "/timetable",
          "/calendar",
          "/faculty/",
          "/api/",
          "/forgotPassword",
          "/reset-password",
          "/delay",
          "/testing",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
