"use client";

import AdminNavbar from "@/utils/AdminNavbar";

export default function ManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full max-w-[100vw] flex-col overflow-x-hidden bg-linear-to-br from-slate-50 via-white to-slate-50 lg:flex-row">
      <AdminNavbar />
      <div className="min-w-0 w-full flex-1">
        <div className="overflow-hidden bg-white p-5 font-comfortaa text-sm leading-relaxed text-slate-900 shadow-sm sm:p-6 md:p-7 lg:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
