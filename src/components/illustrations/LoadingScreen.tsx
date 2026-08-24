"use client";

import {
  IllustrationImage,
  useRotatingIllustration,
} from "./SituationIllustration";

export function LoadingScreen({ embedded = false }: { embedded?: boolean }) {
  const item = useRotatingIllustration("loading");

  return (
    <div
      className={
        embedded
          ? "flex w-full items-center justify-center py-10"
          : "flex min-h-screen w-full items-center justify-center bg-[#f6f7fb] p-6"
      }
    >
      <div className="flex w-full max-w-md flex-col items-center gap-5 px-8 py-10">
        <IllustrationImage item={item} size="lg" />

        <div className="text-center">
          <p className="text-sm tracking-[0.35em] text-slate-400 uppercase">
            Please wait
          </p>
          <p className="mt-3 text-lg font-semibold text-slate-900">
            {item.caption ?? item.alt}
          </p>
        </div>

        <div className="flex gap-2">
          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-slate-500 [animation-delay:-0.15s]" />
          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-slate-700" />
        </div>
      </div>
    </div>
  );
}
