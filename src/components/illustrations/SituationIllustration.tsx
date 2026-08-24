"use client";

import { useLayoutEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  ILLUSTRATION_CATALOG,
  getIllustrationForRoute,
  illustrationSrc,
  type IllustrationItem,
  type IllustrationSituation,
} from "./catalog";

const SIZE_CLASS = {
  sm: "h-40 w-40 sm:h-48 sm:w-48",
  md: "h-56 w-56 sm:h-64 sm:w-64",
  lg: "h-72 w-72 sm:h-80 sm:w-80",
};

export function useRotatingIllustration(situation: IllustrationSituation) {
  const pathname = usePathname() || "";
  const [item, setItem] = useState<IllustrationItem>(
    () =>
      getIllustrationForRoute(situation, pathname) ??
      ILLUSTRATION_CATALOG[situation][0],
  );

  useLayoutEffect(() => {
    const next = getIllustrationForRoute(situation, pathname);
    if (next) setItem(next);
  }, [situation, pathname]);

  return item;
}

export function IllustrationImage({
  item,
  size = "md",
  className = "",
}: {
  item: IllustrationItem;
  size?: keyof typeof SIZE_CLASS;
  className?: string;
}) {
  return (
    <div
      className={`relative shrink-0 ${SIZE_CLASS[size]} ${className}`.trim()}
    >
      <img
        key={item.file}
        src={illustrationSrc(item.file)}
        alt={item.alt}
        width={500}
        height={500}
        className="block h-full w-full object-contain"
      />
    </div>
  );
}

export function SituationIllustration({
  situation,
  size = "md",
  className = "",
}: {
  situation: IllustrationSituation;
  size?: keyof typeof SIZE_CLASS;
  className?: string;
}) {
  const item = useRotatingIllustration(situation);
  return <IllustrationImage item={item} size={size} className={className} />;
}
