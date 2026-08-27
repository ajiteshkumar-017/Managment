"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Bar from "@/utils/Faculty/Bar";

export function FacultyPanelShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      try {
        await axios.get("/api/faculty/setting");
      } catch {
        router.replace("/landingPage");
      }
    };

    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) verifySession();
    };

    verifySession();
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, [router]);

  return (
    <div className="flex h-dvh max-h-dvh w-full max-w-[100vw] flex-col overflow-hidden bg-linear-to-br from-slate-50 via-white to-slate-50 lg:flex-row">
      <Bar open={open} setOpen={setOpen} />
      <div className="min-h-0 min-w-0 w-full flex-1 overflow-y-auto">
        <div className="overflow-x-hidden bg-white p-5 font-comfortaa text-slate-900 shadow-sm sm:p-6 md:p-7 lg:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
