"use client";

import React, { useState } from "react";
import Bar from "@/utils/Admin/Bar";
import {
  Bell,
  Building2,
  Camera,
  KeyRound,
  LogOut,
  Save,
  Shield,
  SlidersHorizontal,
  UserRound,
} from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import axios from "axios";

type TabId = "profile" | "institution" | "security" | "notifications" | "preferences";

const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "profile", label: "Profile", icon: <UserRound size={16} /> },
  { id: "institution", label: "Institution", icon: <Building2 size={16} /> },
  { id: "security", label: "Security", icon: <Shield size={16} /> },
  { id: "notifications", label: "Notifications", icon: <Bell size={16} /> },
  { id: "preferences", label: "Preferences", icon: <SlidersHorizontal size={16} /> },
];

const inputClass =
  "w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-50";

function AdminSetting() {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>("profile");
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@college.edu",
    username: "admin",
    phone: "+91 98765 43210",
  });

  const [institution, setInstitution] = useState({
    collegeName: "Bubble Institute of Technology",
    shortName: "BIT",
    address: "Sector 12, Knowledge Park, City",
    academicYear: "2025-26",
    contactEmail: "office@college.edu",
    contactPhone: "+91 1800 123 456",
  });

  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notifications, setNotifications] = useState({
    attendanceAlerts: true,
    resultPublished: true,
    newEnrollments: true,
    noticeUpdates: true,
    facultyLeave: false,
    emailDigest: true,
  });

  const [preferences, setPreferences] = useState({
    attendanceThreshold: "75",
    passMark: "40",
    defaultDepartment: "CSE",
    sessionTimeout: "60",
    timezone: "Asia/Kolkata",
  });

  const handleSave = async () => {
    if (activeTab === "security") {
      if (!security.currentPassword || !security.newPassword) {
        toast.error("Please fill in password fields");
        return;
      }
      if (security.newPassword !== security.confirmPassword) {
        toast.error("New passwords do not match");
        return;
      }
      if (security.newPassword.length < 6) {
        toast.error("Password must be at least 6 characters");
        return;
      }
    }

    setSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      toast.success("Settings saved successfully");
      if (activeTab === "security") {
        setSecurity({ currentPassword: "", newPassword: "", confirmPassword: "" });
      }
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await axios.post("/api/users/logout");
      toast.success("Logged out successfully");
      router.push("/landingPage");
    } catch {
      toast.error("Failed to logout");
    } finally {
      setLoggingOut(false);
    }
  };

  const Toggle = ({
    checked,
    onChange,
    label,
    hint,
  }: {
    checked: boolean;
    onChange: (v: boolean) => void;
    label: string;
    hint: string;
  }) => (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-left transition hover:border-slate-300"
    >
      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-900">{label}</p>
        <p className="mt-0.5 text-xs text-slate-500">{hint}</p>
      </div>
      <span
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked ? "bg-indigo-600" : "bg-slate-200"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
            checked ? "left-5" : "left-0.5"
          }`}
        />
      </span>
    </button>
  );

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-linear-to-br from-slate-50 via-white to-slate-50 flex flex-col lg:flex-row">
      <Bar open={open} setOpen={setOpen} />

      <div className="flex-1 min-w-0 w-full">
        <div className="overflow-hidden bg-white p-5 text-slate-900 shadow-sm sm:p-6 md:p-7 lg:p-6">
          <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between sm:pb-8">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold font-comfortaa text-slate-900 sm:text-3xl">
                Settings
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Manage your admin profile, institution, and system preferences
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-60"
              >
                <LogOut size={16} />
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-60"
              >
                <Save size={16} />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-6 lg:flex-row">
            <aside className="w-full shrink-0 lg:w-56">
              <nav className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
                {tabs.map((tab) => {
                  const active = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`inline-flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
                        active
                          ? "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600/15"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span className={active ? "text-indigo-600" : "text-slate-400"}>
                        {tab.icon}
                      </span>
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </aside>

            <div className="min-w-0 flex-1">
              {activeTab === "profile" && (
                <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                  <div className="mb-6 border-b border-slate-100 pb-4">
                    <h2 className="text-lg font-bold text-slate-900">Profile</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Update your personal admin account details
                    </p>
                  </div>

                  <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                    <div className="relative">
                      <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-indigo-100 bg-indigo-50 text-2xl font-bold text-indigo-600">
                        {profile.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                      <button
                        type="button"
                        onClick={() => toast("Profile photo upload coming soon")}
                        className="absolute -bottom-1 -right-1 rounded-full bg-indigo-600 p-2 text-white shadow-sm transition hover:bg-indigo-700"
                        aria-label="Change photo"
                      >
                        <Camera size={14} />
                      </button>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{profile.name}</p>
                      <p className="text-sm text-slate-500">{profile.email}</p>
                      <p className="mt-1 text-xs text-slate-400">JPG or PNG, max 5MB</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Full Name
                      </label>
                      <input
                        value={profile.name}
                        onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                        className={inputClass}
                        placeholder="Admin name"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Username
                      </label>
                      <input
                        value={profile.username}
                        onChange={(e) =>
                          setProfile((p) => ({ ...p, username: e.target.value }))
                        }
                        className={inputClass}
                        placeholder="username"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Email
                      </label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                        className={inputClass}
                        placeholder="admin@college.edu"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Phone
                      </label>
                      <input
                        value={profile.phone}
                        onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                        className={inputClass}
                        placeholder="+91 ..."
                      />
                    </div>
                  </div>
                </section>
              )}

              {activeTab === "institution" && (
                <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                  <div className="mb-6 border-b border-slate-100 pb-4">
                    <h2 className="text-lg font-bold text-slate-900">Institution</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      College identity and contact information used across reports
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        College Name
                      </label>
                      <input
                        value={institution.collegeName}
                        onChange={(e) =>
                          setInstitution((p) => ({ ...p, collegeName: e.target.value }))
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Short Name
                      </label>
                      <input
                        value={institution.shortName}
                        onChange={(e) =>
                          setInstitution((p) => ({ ...p, shortName: e.target.value }))
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Academic Year
                      </label>
                      <input
                        value={institution.academicYear}
                        onChange={(e) =>
                          setInstitution((p) => ({ ...p, academicYear: e.target.value }))
                        }
                        className={inputClass}
                        placeholder="2025-26"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Address
                      </label>
                      <textarea
                        rows={3}
                        value={institution.address}
                        onChange={(e) =>
                          setInstitution((p) => ({ ...p, address: e.target.value }))
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Contact Email
                      </label>
                      <input
                        type="email"
                        value={institution.contactEmail}
                        onChange={(e) =>
                          setInstitution((p) => ({ ...p, contactEmail: e.target.value }))
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Contact Phone
                      </label>
                      <input
                        value={institution.contactPhone}
                        onChange={(e) =>
                          setInstitution((p) => ({ ...p, contactPhone: e.target.value }))
                        }
                        className={inputClass}
                      />
                    </div>
                  </div>
                </section>
              )}

              {activeTab === "security" && (
                <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                  <div className="mb-6 border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3">
                      <span className="rounded-xl bg-indigo-100 p-2.5 text-indigo-600">
                        <KeyRound size={18} />
                      </span>
                      <div>
                        <h2 className="text-lg font-bold text-slate-900">Security</h2>
                        <p className="mt-0.5 text-sm text-slate-500">
                          Change your password to keep the account secure
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mx-auto max-w-lg space-y-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={security.currentPassword}
                        onChange={(e) =>
                          setSecurity((p) => ({ ...p, currentPassword: e.target.value }))
                        }
                        className={inputClass}
                        placeholder="••••••••"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={security.newPassword}
                        onChange={(e) =>
                          setSecurity((p) => ({ ...p, newPassword: e.target.value }))
                        }
                        className={inputClass}
                        placeholder="••••••••"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={security.confirmPassword}
                        onChange={(e) =>
                          setSecurity((p) => ({ ...p, confirmPassword: e.target.value }))
                        }
                        className={inputClass}
                        placeholder="••••••••"
                      />
                    </div>
                    <p className="text-xs text-slate-500">
                      Use at least 6 characters. Avoid reusing passwords from other accounts.
                    </p>
                  </div>
                </section>
              )}

              {activeTab === "notifications" && (
                <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                  <div className="mb-6 border-b border-slate-100 pb-4">
                    <h2 className="text-lg font-bold text-slate-900">Notifications</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Choose which admin alerts you want to receive
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Toggle
                      checked={notifications.attendanceAlerts}
                      onChange={(v) =>
                        setNotifications((p) => ({ ...p, attendanceAlerts: v }))
                      }
                      label="Attendance alerts"
                      hint="Notify when students fall below threshold"
                    />
                    <Toggle
                      checked={notifications.resultPublished}
                      onChange={(v) =>
                        setNotifications((p) => ({ ...p, resultPublished: v }))
                      }
                      label="Result published"
                      hint="Alert when exam results are declared"
                    />
                    <Toggle
                      checked={notifications.newEnrollments}
                      onChange={(v) =>
                        setNotifications((p) => ({ ...p, newEnrollments: v }))
                      }
                      label="New enrollments"
                      hint="Notify on new student enrollments"
                    />
                    <Toggle
                      checked={notifications.noticeUpdates}
                      onChange={(v) =>
                        setNotifications((p) => ({ ...p, noticeUpdates: v }))
                      }
                      label="Notice updates"
                      hint="Updates when notices are published or expire"
                    />
                    <Toggle
                      checked={notifications.facultyLeave}
                      onChange={(v) =>
                        setNotifications((p) => ({ ...p, facultyLeave: v }))
                      }
                      label="Faculty leave"
                      hint="Alerts for faculty leave requests"
                    />
                    <Toggle
                      checked={notifications.emailDigest}
                      onChange={(v) =>
                        setNotifications((p) => ({ ...p, emailDigest: v }))
                      }
                      label="Weekly email digest"
                      hint="Summary of key metrics every Monday"
                    />
                  </div>
                </section>
              )}

              {activeTab === "preferences" && (
                <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                  <div className="mb-6 border-b border-slate-100 pb-4">
                    <h2 className="text-lg font-bold text-slate-900">Preferences</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Defaults used across attendance, results, and admin views
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Attendance Threshold (%)
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={preferences.attendanceThreshold}
                        onChange={(e) =>
                          setPreferences((p) => ({
                            ...p,
                            attendanceThreshold: e.target.value,
                          }))
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Pass Mark (%)
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={preferences.passMark}
                        onChange={(e) =>
                          setPreferences((p) => ({ ...p, passMark: e.target.value }))
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Default Department
                      </label>
                      <select
                        value={preferences.defaultDepartment}
                        onChange={(e) =>
                          setPreferences((p) => ({
                            ...p,
                            defaultDepartment: e.target.value,
                          }))
                        }
                        className={inputClass}
                      >
                        {["CSE", "ME", "CE", "AE", "ECE", "CHE"].map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Session Timeout (minutes)
                      </label>
                      <select
                        value={preferences.sessionTimeout}
                        onChange={(e) =>
                          setPreferences((p) => ({
                            ...p,
                            sessionTimeout: e.target.value,
                          }))
                        }
                        className={inputClass}
                      >
                        {["30", "60", "120", "240"].map((m) => (
                          <option key={m} value={m}>
                            {m} minutes
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Timezone
                      </label>
                      <select
                        value={preferences.timezone}
                        onChange={(e) =>
                          setPreferences((p) => ({ ...p, timezone: e.target.value }))
                        }
                        className={inputClass}
                      >
                        <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">America/New_York</option>
                        <option value="Europe/London">Europe/London</option>
                      </select>
                    </div>
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminSetting;
