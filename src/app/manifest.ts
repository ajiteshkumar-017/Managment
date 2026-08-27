import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.legalName,
    short_name: SITE.name,
    description: SITE.description,
    start_url: "/landingPage",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: SITE.brandColor,
    lang: "en-IN",
    icons: [
      {
        src: SITE.logo,
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: SITE.logo,
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
