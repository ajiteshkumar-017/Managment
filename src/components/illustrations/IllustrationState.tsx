"use client";

import type { ReactNode } from "react";
import type { IllustrationSituation } from "./catalog";
import { SituationIllustration } from "./SituationIllustration";

export function IllustrationState({
  situation,
  title,
  description,
  size = "md",
  fullScreen = false,
  children,
}: {
  situation: IllustrationSituation;
  title?: string;
  description?: string;
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
  children?: ReactNode;
}) {
  const body = (
    <div className="mx-auto flex min-h-[40vh] w-full max-w-md flex-col items-center justify-center px-4 py-6 text-center">
      <SituationIllustration situation={situation} size={size} />
      {title ? (
        <h2 className="mt-4 text-lg font-semibold text-slate-900 sm:text-xl">
          {title}
        </h2>
      ) : null}
      {description ? (
        <p className="mt-2 text-sm text-slate-500">{description}</p>
      ) : null}
      {children ? <div className="mt-5">{children}</div> : null}
    </div>
  );

  if (!fullScreen) return body;

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#f6f7fb] p-6">
      {body}
    </div>
  );
}
