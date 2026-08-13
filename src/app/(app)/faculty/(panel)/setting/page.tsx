"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { Bell, Loader2, LogOut, UserRound } from "lucide-react";

export default function FacultySettingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    username: "",
    role: "",
    designation: "",
    department: "",
    avatar: "",
  });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get("/api/faculty/setting");
        if (!res.data?.success) {
          toast.error(res.data?.message || "Failed to load settings");
          return;
        }
        const d = res.data.data;
        setProfile({
          name: d.name || "",
          email: d.email || "",
          username: d.username || "",
          role: d.role || "faculty",
          designation: d.designation || "",
          department: d.department || "",
          avatar: d.avatar || "",
        });
      } catch (err: unknown) {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          router.replace("/landingPage");
          return;
        }
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [router]);

  const logout = async () => {
    setLoggingOut(true);
    try {
      await axios.post("/api/users/logout");
      router.replace("/landingPage");
    } catch {
      toast.error("Failed to logout");
      setLoggingOut(false);
    }
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="font-comfortaa text-2xl font-bold text-slate-900 sm:text-3xl">
            Settings
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Your faculty profile and account
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 transition hover:bg-slate-50"
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell size={18} />
          </button>
          <button
            type="button"
            onClick={logout}
            disabled={loggingOut}
            className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-60"
          >
            <LogOut size={16} />
            {loggingOut ? "Signing out…" : "Sign out"}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="mt-10 flex items-center justify-center gap-2 text-sm text-slate-500 w-full">
          <Loader2 size={16} className="animate-spin" />
          Loading profile…
        </div>
      ) : (
        <div className="mt-8  space-y-6 w-full">
          <section className="rounded-2xl border border-slate-200 p-5 w-full">
            <div className="flex items-center gap-4">
              {profile.avatar ? (
                
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="h-16 w-16 rounded-2xl object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
                  <UserRound size={28} />
                </div>
              )}
              <div>
                <p className="text-lg font-bold text-slate-900">{profile.name}</p>
                <p className="text-sm text-slate-500">{profile.email}</p>
                <p className="mt-1 text-xs font-medium tracking-wide text-indigo-600 uppercase">
                  {profile.role}
                </p>
              </div>
            </div>

            <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium text-slate-500 uppercase">
                  Username
                </dt>
                <dd className="mt-1 text-sm font-semibold text-slate-900">
                  {profile.username || "—"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500 uppercase">
                  Designation
                </dt>
                <dd className="mt-1 text-sm font-semibold text-slate-900">
                  {profile.designation || "—"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500 uppercase">
                  Department
                </dt>
                <dd className="mt-1 text-sm font-semibold text-slate-900">
                  {profile.department || "—"}
                </dd>
              </div>
            </dl>
          </section>
        </div>
      )}
    </div>
  );
}
