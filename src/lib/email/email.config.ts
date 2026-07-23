function withProtocol(url?: string) {
  if (!url) return "http://localhost:3000";
  const trimmed = url.trim().replace(/\/$/, "");
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  // Local hosts stay on http; deployed hosts default to https.
  if (/^(localhost|127\.0\.0\.1)(:\d+)?$/i.test(trimmed)) {
    return `http://${trimmed}`;
  }
  return `https://${trimmed}`;
}

/** Prefer public/production URL so email images & CTAs work in inboxes. */
const appUrl = withProtocol(
  process.env.EMAIL_APP_URL ||
    process.env.PRODUCTION_DOMAIN ||
    process.env.DEV_DOMAIN,
);

export const emailConfig = {
  from: process.env.EMAIL_FROM || "onboarding@resend.dev",
  collegeName: process.env.COLLEGE_NAME || "IIT Dholakpur",
  supportEmail: process.env.SUPPORT_EMAIL || "contact@iitdholakpur.edu",
  /** Inbox for Contact Us form submissions */
  contactToEmail:
    process.env.CONTACT_TO_EMAIL || "ajiteshk007@gmail.com",
  /** Website primary */
  brandColor: "#786EFE",
  /** Website secondary */
  brandColorSecondary: "#655BDB",
  logoUrl: process.env.EMAIL_LOGO_URL || `${appUrl}/iitblogo.png`,
  appUrl,
  landingUrl: `${appUrl}/landingPage`,
};
