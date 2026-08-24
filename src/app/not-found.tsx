"use client";

import Link from "next/link";
import { IllustrationState } from "@/components/illustrations/IllustrationState";

export default function NotFound() {
  return (
    <IllustrationState
      situation="notFound"
      size="lg"
      fullScreen
      title="Page not found"
      description="This page isn’t in the curriculum. Head home or try another route."
    >
      <Link
        href="/landingPage"
        className="inline-flex rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
      >
        Go home
      </Link>
    </IllustrationState>
  );
}
