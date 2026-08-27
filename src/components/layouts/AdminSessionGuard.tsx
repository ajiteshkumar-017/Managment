"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export function AdminSessionGuard({ children }: { children: React.ReactNode }) {
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
