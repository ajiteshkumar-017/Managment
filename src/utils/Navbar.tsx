"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, X, Eye, EyeOff, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { useDebounce } from "react-use";

function GoogleIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [clickedLogin, setClickedLogin] = useState(true);
  const [emailStatus, setEmailStatus] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();

  const navLinks = [
    { label: "Home", href: "/landingPage" },
    { label: "Courses", href: "/courses" },
    { label: "Faculty", href: "/faculty" },
    { label: "About", href: "/about" },
    { label: "Contact Us", href: "/contactUs" },
  ];

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setUsername("");
    setEmailStatus("");
    setShowPassword(false);
  };

  const openAuth = (login: boolean) => {
    setClickedLogin(login);
    setIsFormOpen(true);
    setMobileMenuOpen(false);
    resetForm();
  };

  const closeAuth = () => {
    setIsFormOpen(false);
    resetForm();
  };

  const handleGoogleAuth = () => {
    setGoogleLoading(true);
    window.location.href = "/api/users/auth/google/login";
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await axios.post("/api/users/login", { email, password });
      toast.success(res?.data?.message || "Login successful");
      resetForm();
      closeAuth();
      if (res.data.ProfileStatus === true) {
        router.push("/dashboard");
      } else {
        router.push("/setUp");
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(
        error?.response?.data?.message || "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (emailStatus) {
      toast.error(emailStatus);
      return;
    }
    setSubmitting(true);
    try {
      const res = await axios.post("/api/users/signUp", {
        email,
        password,
        username,
      });
      toast.success(res?.data?.message || "Sign up successful");
      resetForm();
      setClickedLogin(true);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  useDebounce(
    async () => {
      if (clickedLogin) return;
      if (!email || email.length < 5 || !email.includes("@")) return;

      try {
        const res = await axios.get(`/api/users/check-email?email=${email}`);
        setEmailStatus(res.data.exists ? "Email already taken" : "");
      } catch {
        setEmailStatus("Error checking email");
      }
    },
    500,
    [email, clickedLogin],
  );

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[#786EFE] focus:bg-white focus:ring-2 focus:ring-[#786EFE]/20";

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/90 backdrop-blur-md">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6 md:px-10 md:py-5">
          <div className="shrink-0">
            <img
              src="/iitblogo.png"
              alt="logo"
              width={50}
              height={50}
              className="h-12 w-12 sm:h-14 sm:w-14"
            />
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="relative text-sm font-medium text-[#333333] transition-colors duration-300 after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-0 after:-translate-x-1/2 after:bg-[#786EFE] after:transition-all after:duration-300 after:content-[''] hover:text-[#786EFE] hover:after:w-full lg:text-base"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden gap-3 md:flex lg:gap-4">
            <button
              type="button"
              className="rounded-xl border border-[#333333]/80 px-4 py-2 text-sm text-[#333333] transition-all duration-300 hover:border-[#786EFE] hover:text-[#786EFE] lg:px-6 lg:text-base"
              onClick={() => openAuth(true)}
            >
              Login
            </button>
            <button
              type="button"
              className="rounded-xl bg-[#786EFE] px-4 py-2 text-sm text-white transition-all duration-300 hover:bg-[#655BDB] hover:shadow-lg hover:shadow-[#786EFE]/25 lg:px-6 lg:text-base"
              onClick={() => openAuth(false)}
            >
              Sign Up
            </button>
          </div>

          <button
            type="button"
            className="p-2 md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-gray-100 bg-white md:hidden"
            >
              <div className="space-y-3 px-4 py-4">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="block py-2 text-sm text-[#333333] transition-colors hover:text-[#786EFE]"
                  >
                    {link.label}
                  </a>
                ))}
                <div className="flex gap-2 border-t border-gray-100 pt-4">
                  <button
                    type="button"
                    className="flex-1 rounded-xl border border-[#333333] px-4 py-2.5 text-sm text-[#333333]"
                    onClick={() => openAuth(true)}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    className="flex-1 rounded-xl bg-[#786EFE] px-4 py-2.5 text-sm text-white"
                    onClick={() => openAuth(false)}
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-md"
            onClick={closeAuth}
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="relative grid w-full max-w-[920px] overflow-hidden rounded-3xl border border-white/40 bg-white shadow-2xl shadow-[#786EFE]/15 md:grid-cols-[1.05fr_1fr]"
            >
              {/* Brand panel */}
              <div className="relative hidden overflow-hidden bg-linear-to-br from-[#786EFE] via-[#6B5FE8] to-[#4F46E5] p-8 text-white md:flex md:flex-col md:justify-between">
                <div className="pointer-events-none absolute -top-16 -right-10 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
                <div className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-[#A78BFA]/30 blur-3xl" />

                <div className="relative">
                  <div className="flex items-center gap-3">
                    <img
                      src="/iitblogo.png"
                      alt=""
                      className="h-11 w-11 rounded-xl bg-white/15 object-cover ring-1 ring-white/25"
                    />
                    <div>
                      <p className="font-comfortaa text-lg font-bold tracking-tight">
                        Orbit
                      </p>
                      <p className="text-xs text-white/70">Campus portal</p>
                    </div>
                  </div>

                  <h2 className="mt-10 font-comfortaa text-3xl leading-tight font-bold">
                    {clickedLogin
                      ? "Welcome back to campus."
                      : "Start your academic journey."}
                  </h2>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/80">
                    Courses, attendance, results, and campus updates — all in one
                    modern student workspace.
                  </p>
                </div>

                <div className="relative space-y-3 text-sm text-white/85">
                  <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
                    Secure sign-in with Google or email
                  </div>
                  <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
                    Personalized dashboard for your semester
                  </div>
                </div>
              </div>

              {/* Form panel */}
              <div className="relative bg-white px-5 py-6 sm:px-8 sm:py-8">
                <button
                  type="button"
                  onClick={closeAuth}
                  className="absolute top-1 right-2 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>

                <div className="mb-6 md:hidden">
                  <p className="font-comfortaa text-lg font-bold text-[#333333]">
                    Orbit
                  </p>
                </div>

                <div className="mb-6 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
                  <button
                    type="button"
                    onClick={() => {
                      setClickedLogin(true);
                      resetForm();
                    }}
                    className={`rounded-lg py-2.5 text-sm font-semibold transition ${
                      clickedLogin
                        ? "bg-white text-[#786EFE] shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setClickedLogin(false);
                      resetForm();
                    }}
                    className={`rounded-lg py-2.5 text-sm font-semibold transition ${
                      !clickedLogin
                        ? "bg-white text-[#786EFE] shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    Sign Up
                  </button>
                </div>

                <div className="mb-5">
                  <h1 className="font-comfortaa text-2xl font-bold tracking-tight text-[#333333]">
                    {clickedLogin ? "Sign in" : "Create account"}
                  </h1>
                  <p className="mt-1 text-sm text-slate-500">
                    {clickedLogin
                      ? "Access your student portal"
                      : "Join with your college email"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={googleLoading || submitting}
                  className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-[#786EFE]/40 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {googleLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-[#786EFE]" />
                  ) : (
                    <GoogleIcon />
                  )}
                  Continue with Google
                </button>

                <div className="my-5 flex items-center gap-3">
                  <div className="h-px flex-1 bg-slate-200" />
                  <span className="text-xs font-medium tracking-wide text-slate-400 uppercase">
                    or continue with email
                  </span>
                  <div className="h-px flex-1 bg-slate-200" />
                </div>

                {clickedLogin ? (
                  <form className="space-y-4" onSubmit={handleLogin}>
                    <div>
                      <label
                        htmlFor="login-email"
                        className="mb-1.5 block text-sm font-medium text-slate-700"
                      >
                        Email
                      </label>
                      <input
                        id="login-email"
                        type="email"
                        required
                        value={email}
                        placeholder="you@college.edu"
                        className={inputClass}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="login-password"
                        className="mb-1.5 block text-sm font-medium text-slate-700"
                      >
                        Password
                      </label>
                      <div className="relative">
                        <input
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          required
                          value={password}
                          placeholder="Enter your password"
                          className={`${inputClass} pr-12`}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          className="absolute top-1/2 right-3 -translate-y-1/2 rounded-lg p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting || googleLoading}
                      className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#786EFE] px-4 py-3 text-sm font-semibold text-white shadow-md shadow-[#786EFE]/25 transition hover:bg-[#655BDB] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        "Sign in"
                      )}
                    </button>
                  </form>
                ) : (
                  <form className="space-y-4" onSubmit={handleSignUp}>
                    <div>
                      <label
                        htmlFor="signup-username"
                        className="mb-1.5 block text-sm font-medium text-slate-700"
                      >
                        Full name
                      </label>
                      <input
                        id="signup-username"
                        type="text"
                        required
                        value={username}
                        placeholder="Your name"
                        className={inputClass}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="signup-email"
                        className="mb-1.5 block text-sm font-medium text-slate-700"
                      >
                        Email
                      </label>
                      <input
                        id="signup-email"
                        type="email"
                        required
                        value={email}
                        placeholder="you@college.edu"
                        className={inputClass}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setEmailStatus("");
                        }}
                      />
                      {emailStatus && (
                        <p className="mt-1.5 text-sm text-rose-500">{emailStatus}</p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="signup-password"
                        className="mb-1.5 block text-sm font-medium text-slate-700"
                      >
                        Password
                      </label>
                      <div className="relative">
                        <input
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          required
                          value={password}
                          placeholder="Create a password"
                          className={`${inputClass} pr-12`}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          className="absolute top-1/2 right-3 -translate-y-1/2 rounded-lg p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting || googleLoading || !!emailStatus}
                      className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#786EFE] px-4 py-3 text-sm font-semibold text-white shadow-md shadow-[#786EFE]/25 transition hover:bg-[#655BDB] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        "Create account"
                      )}
                    </button>
                  </form>
                )}

                <p className="mt-5 text-center text-sm text-slate-500">
                  {clickedLogin ? (
                    <>
                      New here?{" "}
                      <button
                        type="button"
                        className="font-semibold text-[#786EFE] hover:underline"
                        onClick={() => {
                          setClickedLogin(false);
                          resetForm();
                        }}
                      >
                        Create an account
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{" "}
                      <button
                        type="button"
                        className="font-semibold text-[#786EFE] hover:underline"
                        onClick={() => {
                          setClickedLogin(true);
                          resetForm();
                        }}
                      >
                        Sign in
                      </button>
                    </>
                  )}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;
