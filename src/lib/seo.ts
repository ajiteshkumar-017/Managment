import type { Metadata } from "next";

function withProtocol(url?: string) {
  if (!url) return "https://vector-phi-rosy.vercel.app";
  const trimmed = url.trim().replace(/\/$/, "");
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^(localhost|127\.0\.0\.1)(:\d+)?$/i.test(trimmed)) {
    return `http://${trimmed}`;
  }
  return `https://${trimmed}`;
}

export function getSiteUrl() {
  return withProtocol(
    process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.PRODUCTION_DOMAIN ||
      process.env.VERCEL_PROJECT_PRODUCTION_URL,
  ).replace(/\/landingPage$/i, "");
}

export const SITE = {
  name: "IIT Dholakpur",
  legalName: "Indian Institute of Technology, Dholakpur",
  tagline: "Engineering & Technology, Nuapada, Odisha",
  description:
    "IIT Dholakpur is an engineering institute in Komna, Nuapada, Odisha offering B.Tech, M.Tech and PhD programmes in computer science, mechanical, civil, electrical and allied engineering.",
  locale: "en_IN",
  ogImage: "/campus1.jpg",
  logo: "/iitblogo.png",
  brandColor: "#786EFE",
  email: "contact@iitdholakpur.edu",
  phone: "+91-22-2576-4051",
  address: {
    streetAddress: "IIT Dholakpur Campus",
    addressLocality: "Komna",
    addressRegion: "Odisha",
    addressCountry: "IN",
  },
  sameAs: ["https://instagram.com/ajiteshkumar__"],
  keywords: [
    "IIT Dholakpur",
    "engineering college Odisha",
    "B.Tech Nuapada",
    "computer science",
    "admissions",
    "IIT Dholakpur faculty",
    "engineering college Komna",
  ],
} as const;

export const PUBLIC_PATHS = [
  "/landingPage",
  "/about",
  "/courses",
  "/faculty",
  "/contactUs",
  "/resources",
  "/resources/academic-calendar",
  "/resources/library",
  "/resources/placement-cell",
  "/resources/student-portal",
  "/resources/alumni",
] as const;

type PageSeoInput = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  absoluteTitle?: boolean;
};

export function createPageMetadata({
  title,
  description,
  path,
  keywords = [],
  absoluteTitle = false,
}: PageSeoInput): Metadata {
  const pageTitle = absoluteTitle ? title : `${title} | ${SITE.name}`;

  return {
    title: { absolute: pageTitle },
    description,
    keywords: [...SITE.keywords, ...keywords],
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: SITE.locale,
      siteName: SITE.name,
      title: pageTitle,
      description,
      url: path,
      images: [
        {
          url: SITE.ogImage,
          width: 1200,
          height: 630,
          alt: `${SITE.legalName} campus`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [SITE.ogImage],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export function noIndexMetadata(
  title: string,
  description = "Private campus portal. Sign in to continue.",
): Metadata {
  return {
    title: { absolute: `${title} | ${SITE.name}` },
    description,
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
        noimageindex: true,
      },
    },
  };
}

export function organizationJsonLd(siteUrl: string) {
  return {
    "@type": "CollegeOrUniversity",
    "@id": `${siteUrl}/#institute`,
    name: SITE.legalName,
    alternateName: SITE.name,
    url: `${siteUrl}/landingPage`,
    logo: `${siteUrl}${SITE.logo}`,
    image: `${siteUrl}${SITE.ogImage}`,
    description: SITE.description,
    email: SITE.email,
    telephone: SITE.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.streetAddress,
      addressLocality: SITE.address.addressLocality,
      addressRegion: SITE.address.addressRegion,
      addressCountry: SITE.address.addressCountry,
    },
    sameAs: SITE.sameAs,
    areaServed: "IN",
  };
}

export function websiteJsonLd(siteUrl: string) {
  return {
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: SITE.legalName,
    alternateName: SITE.name,
    url: siteUrl,
    inLanguage: "en-IN",
    publisher: {
      "@id": `${siteUrl}/#institute`,
    },
  };
}
