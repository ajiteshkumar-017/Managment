import { createPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "Student Portal",
  description:
    "Sign in to the IIT Dholakpur student portal for attendance, courses, timetable, and results.",
  path: "/resources/student-portal",
});

export { default } from "@/components/seo/SeoLayout";
