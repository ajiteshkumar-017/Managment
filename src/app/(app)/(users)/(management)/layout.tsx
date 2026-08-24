"use client";

import { useEffect } from "react";
import AdminNavbar from "@/utils/AdminNavbar";
import {
  ILLUSTRATION_CATALOG,
  illustrationSrc,
} from "@/components/illustrations/catalog";

export default function ManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    for (const item of ILLUSTRATION_CATALOG.loading) {
      const img = new Image();
      img.src = illustrationSrc(item.file);
    }
  }, []);

  return (
    <div className="flex h-dvh max-h-dvh w-full max-w-[100vw] flex-col overflow-hidden bg-linear-to-br from-slate-50 via-white to-slate-50 lg:flex-row">
      <AdminNavbar />
      <div className="min-h-0 min-w-0 w-full flex-1 overflow-y-auto">
        <div className="overflow-x-hidden bg-white p-5 font-comfortaa text-sm leading-relaxed text-slate-900 shadow-sm sm:p-6 md:p-7 lg:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
