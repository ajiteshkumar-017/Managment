"use client";

import { IllustrationState } from "@/components/illustrations/IllustrationState";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <IllustrationState
      situation="error"
      size="lg"
      fullScreen
      title="Something went wrong"
      description="An unexpected error stopped this page. You can try again."
    >
      <button
        type="button"
        onClick={() => reset()}
        className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
      >
        Try again
      </button>
    </IllustrationState>
  );
}
