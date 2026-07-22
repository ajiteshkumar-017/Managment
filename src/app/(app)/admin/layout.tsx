"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

/**
 * Re-check auth when the user returns via browser back/forward (bfcache).
 * Cached protected pages must not stay visible without a valid session.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const verifySession = async () => {
      try {
        await axios.get("/api/admin/setting");
      } catch {
        router.replace("/landingPage");
      }
    };

    const onPageShow = (event: PageTransitionEvent) => {
      // Restored from back-forward cache — force a fresh auth check
      if (event.persisted) {
        verifySession();
      }
    };

    verifySession();
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, [router]);

  return <>{children}</>;
}
