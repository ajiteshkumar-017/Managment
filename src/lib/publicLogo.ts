/**
 * Institute logos for public/marketing pages only
 * (landing, about, courses, contact, public faculty).
 * Do not import this from student, faculty, or admin panels.
 */
const INSTITUTION_LOGO = "/Logo/newLogo2.png";
const INSTITUTION_LOGO_SMALL = "/Logo/newLogo.png";

export const PUBLIC_LOGO = {
  mark: INSTITUTION_LOGO,
  full: INSTITUTION_LOGO,
  vector: INSTITUTION_LOGO,
  markOnDark: INSTITUTION_LOGO,
  alt: "IIT Dholakpur",
} as const;

export const PUBLIC_LOGO_SMALL = {
  mark: INSTITUTION_LOGO_SMALL,
  full: INSTITUTION_LOGO_SMALL,
  vector: INSTITUTION_LOGO_SMALL,
  markOnDark: INSTITUTION_LOGO_SMALL,
  alt: "IIT Dholakpur",
} as const;
