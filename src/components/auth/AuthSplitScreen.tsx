import type { ReactNode } from "react";
import { PUBLIC_LOGO } from "@/lib/publicLogo";

type AuthSplitScreenProps = {
  headline: string;
  subhead: string;
  illustrationSrc?: string;
  children: ReactNode;
};

export function AuthSplitScreen({
  headline,
  subhead,
  illustrationSrc = "/illustrations/Innovation-bro.svg",
  children,
}: AuthSplitScreenProps) {
  return (
    <div className="h-dvh w-full overflow-x-hidden bg-white">
      <div className="grid h-full w-full grid-cols-1 lg:grid-cols-2">
        <aside className="relative hidden min-h-0 min-w-0 overflow-hidden bg-linear-to-br from-[#786EFE] via-[#6B5FE8] to-[#4338CA] text-white lg:flex lg:flex-col">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-24 -right-16 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-24 -left-10 h-80 w-80 rounded-full bg-[#A78BFA]/25 blur-3xl" />
          </div>

          <div className="relative z-10 shrink-0 px-10 pt-10">
            <div className="flex items-center gap-3">
              <img
                src={PUBLIC_LOGO.markOnDark}
                alt=""
                className="h-12 w-12 object-contain"
              />
              <div>
                <p className="font-comfortaa text-lg font-bold tracking-tight">
                  Orbit
                </p>
                <p className="text-xs text-white/70">Campus portal</p>
              </div>
            </div>
            <h2 className="mt-10 font-comfortaa text-4xl leading-tight font-bold">
              {headline}
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/80">
              {subhead}
            </p>
          </div>

          <div className="relative z-10 flex min-h-0 min-w-0 flex-1 items-center justify-center overflow-hidden px-8 pb-10">
            <img
              src={illustrationSrc}
              alt=""
              className="h-auto max-h-full w-full max-w-full object-contain"
            />
          </div>
        </aside>

        <main className="flex min-h-0 min-w-0 w-full flex-col overflow-x-hidden overflow-y-auto bg-[#F8FAFC]">
          <div className="flex min-h-full w-full flex-1 flex-col justify-center px-6 py-10 sm:px-10 lg:px-16 xl:px-20">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export const authInputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[#786EFE] focus:ring-2 focus:ring-[#786EFE]/20";
