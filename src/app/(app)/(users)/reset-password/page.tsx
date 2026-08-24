"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { ArrowLeft, CircleCheck, Eye, EyeOff, KeyRound, Loader2 } from "lucide-react";
import {
  AuthSplitScreen,
  authInputClass,
} from "@/components/auth/AuthSplitScreen";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setSubmitting(true);
    try {
      const res = await axios.post("/api/users/reset-password", {
        token,
        password,
      });
      if (res.data?.success) {
        setDone(true);
        toast.success(res.data.message || "Password updated");
      } else {
        toast.error(res.data?.message || "Failed to reset password");
      }
    } catch (error) {
      const message =
        axios.isAxiosError(error) && error.response?.data?.message
          ? String(error.response.data.message)
          : "Failed to reset password";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!token) {
    return (
      <AuthSplitScreen
        headline="This link is missing."
        subhead="Open the reset link from your email, or request a new one."
      >
        <Link
          href="/forgotPassword"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-[#786EFE]"
        >
          <ArrowLeft className="h-4 w-4" />
          Request a new link
        </Link>
        <div className="mt-10 w-full">
          <h1 className="font-comfortaa text-3xl font-bold tracking-tight text-[#333333] sm:text-4xl">
            Invalid reset link
          </h1>
          <p className="mt-3 text-sm text-slate-500 sm:text-base">
            The password reset token is missing. Request a new email and use the
            button in that message.
          </p>
          <Link
            href="/forgotPassword"
            className="mt-10 flex w-full items-center justify-center rounded-xl bg-[#786EFE] px-4 py-3.5 text-sm font-semibold text-white shadow-md shadow-[#786EFE]/25 transition hover:bg-[#655BDB]"
          >
            Forgot password
          </Link>
        </div>
      </AuthSplitScreen>
    );
  }

  return (
    <AuthSplitScreen
      headline="Choose a new password."
      subhead="This link expires in one hour. After you save, you can sign in with your new password."
    >
      <Link
        href="/landingPage"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-[#786EFE]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to sign in
      </Link>

      {done ? (
        <div className="mt-10 w-full">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#786EFE]/10 text-[#786EFE]">
            <CircleCheck className="h-7 w-7" />
          </div>
          <h1 className="mt-6 font-comfortaa text-3xl font-bold tracking-tight text-[#333333] sm:text-4xl">
            Password updated
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-500 sm:text-base">
            Your password has been changed. Sign in with your new password to
            continue.
          </p>
          <button
            type="button"
            className="mt-10 w-full rounded-xl bg-[#786EFE] px-4 py-3.5 text-sm font-semibold text-white shadow-md shadow-[#786EFE]/25 transition hover:bg-[#655BDB]"
            onClick={() => router.push("/landingPage")}
          >
            Go to login
          </button>
        </div>
      ) : (
        <div className="mt-8 w-full lg:mt-10">
          <p className="mb-6 font-comfortaa text-lg font-bold text-[#333333] lg:hidden">
            Orbit
          </p>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#786EFE]/10 text-[#786EFE]">
            <KeyRound className="h-6 w-6" />
          </div>
          <h1 className="mt-5 font-comfortaa text-3xl font-bold tracking-tight text-[#333333] sm:text-4xl">
            Reset password
          </h1>
          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            Enter a new password for your campus account.
          </p>

          <form className="mt-8 w-full space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="reset-password"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                New password
              </label>
              <div className="relative">
                <input
                  id="reset-password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  value={password}
                  placeholder="At least 6 characters"
                  className={`${authInputClass} pr-12`}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute top-1/2 right-3 -translate-y-1/2 rounded-lg p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="reset-confirm"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Confirm password
              </label>
              <div className="relative">
                <input
                  id="reset-confirm"
                  type={showConfirm ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  value={confirmPassword}
                  placeholder="Re-enter your new password"
                  className={`${authInputClass} pr-12`}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute top-1/2 right-3 -translate-y-1/2 rounded-lg p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                  onClick={() => setShowConfirm((v) => !v)}
                  aria-label={
                    showConfirm ? "Hide confirm password" : "Show confirm password"
                  }
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#786EFE] px-4 py-3.5 text-sm font-semibold text-white shadow-md shadow-[#786EFE]/25 transition hover:bg-[#655BDB] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save new password"
              )}
            </button>
          </form>
        </div>
      )}
    </AuthSplitScreen>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-dvh items-center justify-center text-sm text-slate-500">
          Loading...
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
