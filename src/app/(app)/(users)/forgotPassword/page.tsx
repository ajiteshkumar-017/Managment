"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { ArrowLeft, Loader2, Mail, ShieldCheck } from "lucide-react";
import {
  AuthSplitScreen,
  authInputClass,
} from "@/components/auth/AuthSplitScreen";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function ForgotPasswordForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [sentTo, setSentTo] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();

    if (!trimmed) {
      toast.error("Please enter your email");
      return;
    }
    if (!isValidEmail(trimmed)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setSubmitting(true);
    try {
      const res = await axios.post("/api/users/forgot-password", {
        email: trimmed,
      });
      if (res.data?.success) {
        setSentTo(trimmed);
        toast.success(res.data.message || "Password reset email sent");
      } else {
        toast.error(res.data?.message || "Failed to send reset email");
      }
    } catch (error) {
      const message =
        axios.isAxiosError(error) && error.response?.data?.message
          ? String(error.response.data.message)
          : "Failed to send password reset email";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthSplitScreen
      headline="We will get you back in."
      subhead="Enter the email on your account. If it matches a campus profile, we will send a reset link that expires in one hour."
    >
      <Link
        href="/landingPage"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-[#786EFE]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to sign in
      </Link>

      {sentTo ? (
        <div className="mt-10 w-full">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#786EFE]/10 text-[#786EFE]">
            <Mail className="h-7 w-7" />
          </div>
          <h1 className="mt-6 font-comfortaa text-3xl font-bold tracking-tight text-[#333333] sm:text-4xl">
            Check your inbox
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-500 sm:text-base">
            If an account exists for{" "}
            <span className="font-semibold text-slate-700">{sentTo}</span>, we
            sent a password reset link. It expires in 1 hour.
          </p>
          <button
            type="button"
            className="mt-10 w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-[#786EFE]/40 hover:bg-slate-50"
            onClick={() => setSentTo("")}
          >
            Use a different email
          </button>
          <Link
            href="/landingPage"
            className="mt-3 flex w-full items-center justify-center rounded-xl bg-[#786EFE] px-4 py-3.5 text-sm font-semibold text-white shadow-md shadow-[#786EFE]/25 transition hover:bg-[#655BDB]"
          >
            Return to login
          </Link>
        </div>
      ) : (
        <div className="mt-8 w-full lg:mt-10">
          <p className="mb-6 font-comfortaa text-lg font-bold text-[#333333] lg:hidden">
            Orbit
          </p>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#786EFE]/10 text-[#786EFE]">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="mt-5 font-comfortaa text-3xl font-bold tracking-tight text-[#333333] sm:text-4xl">
            Forgot password
          </h1>
          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            Enter your college email and we will send you a reset link.
          </p>

          <form className="mt-8 w-full space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="forgot-email"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Email
              </label>
              <input
                id="forgot-email"
                type="email"
                required
                autoComplete="email"
                autoFocus
                value={email}
                placeholder="you@college.edu"
                className={authInputClass}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#786EFE] px-4 py-3.5 text-sm font-semibold text-white shadow-md shadow-[#786EFE]/25 transition hover:bg-[#655BDB] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending link...
                </>
              ) : (
                "Send reset link"
              )}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-500">
            Remembered it?{" "}
            <Link
              href="/landingPage"
              className="font-semibold text-[#786EFE] hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      )}
    </AuthSplitScreen>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-dvh items-center justify-center text-sm text-slate-500">
          Loading...
        </div>
      }
    >
      <ForgotPasswordForm />
    </Suspense>
  );
}
