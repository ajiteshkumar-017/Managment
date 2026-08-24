export type IllustrationSituation =
  | "loading"
  | "notFound"
  | "unauthorized"
  | "empty"
  | "error";

export type IllustrationItem = {
  file: string;
  alt: string;
  caption?: string;
};

const ILLUSTRATION_DIR = "/illustrations";

/**
 * Drop more SVGs into `public/illustrations` and add the filename here.
 * Loading / 404 pick one asset per visit, then advance to the next.
 */
export const ILLUSTRATION_CATALOG: Record<
  IllustrationSituation,
  IllustrationItem[]
> = {
  loading: [
    {
      file: "loading-elephant.svg",
      alt: "Loading",
      caption: "Loading study materials",
    },
    {
      file: "loading-innovation.svg",
      alt: "Getting things ready",
      caption: "Preparing your workspace",
    },
    {
      file: "loading-graduation.svg",
      alt: "Preparing your academic space",
      caption: "Setting up your classes",
    },
  ],
  notFound: [
    {
      file: "404 Error Page not Found with people connecting a plug-rafiki.svg",
      alt: "Page not found",
    },
    {
      file: "Oops! 404 Error with a broken robot-bro.svg",
      alt: "Broken page",
    },
    {
      file: "Oops! 404 Error with a broken robot-rafiki.svg",
      alt: "Page not found",
    },
  ],
  unauthorized: [
    {
      file: "401 Error Unauthorized-rafiki.svg",
      alt: "Unauthorized",
    },
  ],
  empty: [
    { file: "loading-graduation.svg", alt: "Nothing here yet" },
    { file: "loading-innovation.svg", alt: "Nothing here yet" },
  ],
  error: [
    {
      file: "Oops! 404 Error with a broken robot-bro.svg",
      alt: "Something went wrong",
    },
    {
      file: "Oops! 404 Error with a broken robot-rafiki.svg",
      alt: "Something went wrong",
    },
    {
      file: "401 Error Unauthorized-rafiki.svg",
      alt: "Access error",
    },
  ],
};

export function illustrationSrc(file: string) {
  return `${ILLUSTRATION_DIR}/${encodeURIComponent(file)}`;
}

const ticks: Partial<Record<IllustrationSituation, number>> = {};
const routePick: Partial<
  Record<IllustrationSituation, { path: string; item: IllustrationItem }>
> = {};

/** One SVG per route visit. Same page loader + nested loader share it. Next route gets the next SVG. */
export function getIllustrationForRoute(
  situation: IllustrationSituation,
  pathname: string,
) {
  const list = ILLUSTRATION_CATALOG[situation];
  if (list.length === 0) return null;

  const prev = routePick[situation];
  if (prev && prev.path === pathname) return prev.item;

  const tick = ticks[situation] ?? 0;
  ticks[situation] = tick + 1;
  const item = list[tick % list.length];
  routePick[situation] = { path: pathname, item };
  return item;
}
