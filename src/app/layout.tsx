import type { Metadata, Viewport } from "next";
import {
  Bitcount_Grid_Single,
  Comfortaa,
  Geist_Mono,
  Lato,
  Noto_Sans_Devanagari,
  Poppins,
} from "next/font/google";
import { Toaster } from "react-hot-toast";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  getSiteUrl,
  organizationJsonLd,
  SITE,
  websiteJsonLd,
} from "@/lib/seo";
import "./globals.css";

const lato = Lato({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-lato-next",
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins-next",
});

const comfortaa = Comfortaa({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-comfortaa-next",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
});

const hindi = Noto_Sans_Devanagari({
  weight: ["400", "700"],
  subsets: ["devanagari", "latin"],
  display: "swap",
  preload: false,
  variable: "--font-hindi-next",
});

const bitcount = Bitcount_Grid_Single({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  variable: "--font-bitcount-next",
});

const siteUrl = getSiteUrl();

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: SITE.brandColor,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${SITE.name} | ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [...SITE.keywords],
  authors: [{ name: SITE.legalName, url: siteUrl }],
  creator: SITE.legalName,
  publisher: SITE.legalName,
  category: "education",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "/landingPage",
  },
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: "/landingPage",
    siteName: SITE.name,
    title: `${SITE.name} | ${SITE.tagline}`,
    description: SITE.description,
    images: [
      {
        url: SITE.ogImage,
        width: 1200,
        height: 630,
        alt: `${SITE.legalName} campus in Komna, Nuapada`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} | ${SITE.tagline}`,
    description: SITE.description,
    images: [SITE.ogImage],
  },
  icons: {
    icon: [{ url: SITE.logo, type: "image/png" }],
    apple: [{ url: SITE.logo }],
    shortcut: SITE.logo,
  },
  manifest: "/manifest.webmanifest",
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? {
        verification: {
          google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
        },
      }
    : {}),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-IN"
      className={`${lato.variable} ${poppins.variable} ${comfortaa.variable} ${geistMono.variable} ${hindi.variable} ${bitcount.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){if(window.__orbitAuthEntryGuard)return;window.__orbitAuthEntryGuard=true;window.addEventListener('pageshow',function(e){if(!e.persisted)return;var p=location.pathname;if(p==='/'||p.indexOf('/landingPage')===0||p.indexOf('/forgotPassword')===0||p.indexOf('/reset-password')===0)location.reload();});})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": [organizationJsonLd(siteUrl), websiteJsonLd(siteUrl)],
          }}
        />
        {children}
        <Toaster
          position="top-right"
          gutter={10}
          toastOptions={{
            duration: 4000,
            className:
              "min-w-[340px] rounded-xl border border-gray-200 bg-white shadow-xl px-4 py-4 text-sm font-medium flex items-center gap-3",
            success: {
              className:
                "border-l-4 border-l-green-500 bg-white text-gray-800 shadow-md",
              iconTheme: {
                primary: "#22c55e",
                secondary: "#ffffff",
              },
            },
            error: {
              className:
                "border-l-4 border-l-red-500 bg-white text-gray-800 shadow-md",
              iconTheme: {
                primary: "#ef4444",
                secondary: "#ffffff",
              },
            },
            loading: {
              className:
                "border-l-4 border-l-blue-500 bg-white text-gray-800 shadow-md",
            },
          }}
        />
      </body>
    </html>
  );
}
