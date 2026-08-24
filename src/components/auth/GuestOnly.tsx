"use client";

import { useEffect } from "react";
import axios from "axios";
import { homeForRole } from "@/lib/authHome";

declare global {
  interface Window {
    __orbitAuthEntryGuard?: boolean;
    __orbitGuestOnlyBound?: boolean;
  }
}

function bounceToPanel(home?: string, role?: string) {
  window.location.replace(home || homeForRole(role));
}

/**
 * Register outside React. useEffect cleanup would remove the listener on
 * navigate-away, and back-forward cache restores the page without remounting.
 */
if (typeof window !== "undefined" && !window.__orbitGuestOnlyBound) {
  window.__orbitGuestOnlyBound = true;
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) window.location.reload();
  });
}

/**
 * Client fallback when a cached public page is shown after the user already
 * has a session cookie (browser Back, or Next.js client cache).
 */
export function GuestOnly({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let cancelled = false;

    const bounceIfAuthed = async () => {
      try {
        const res = await axios.get("/api/users/session");
        if (cancelled || !res.data?.authenticated) return;
        bounceToPanel(res.data.home, res.data.role);
      } catch {
        // No valid session — stay on the public page.
      }
    };

    bounceIfAuthed();
    window.addEventListener("popstate", bounceIfAuthed);
    return () => {
      cancelled = true;
      window.removeEventListener("popstate", bounceIfAuthed);
    };
  }, []);

  return <>{children}</>;
}
