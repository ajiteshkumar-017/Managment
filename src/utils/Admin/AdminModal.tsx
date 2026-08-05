"use client";

import React, { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export const adminLabelClass =
  "mb-1 block text-sm font-medium text-slate-700";

export const adminFieldClass =
  "w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 transition placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500";

export const adminFormGridClass =
  "grid grid-cols-1 gap-4 lg:grid-cols-2";

export const adminPrimaryBtnClass =
  "inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-sm shadow-indigo-600/20 transition hover:bg-indigo-700 active:scale-[0.99]";

export const adminSecondaryBtnClass =
  "inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50";

type AdminModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  maxWidthClassName?: string;
  zIndexClassName?: string;
};

export default function AdminModal({
  open,
  onClose,
  title,
  description,
  icon,
  children,
  footer,
  maxWidthClassName = "max-w-2xl",
  zIndexClassName = "z-50",
}: AdminModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className={`fixed inset-0 ${zIndexClassName} flex items-center justify-center p-4 sm:p-6`}>
          <motion.button
            type="button"
            aria-label="Close modal backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-0 bg-slate-900/45 backdrop-blur-[6px]"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-modal-title"
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className={`relative z-10 flex max-h-[90vh] w-full ${maxWidthClassName} flex-col overflow-hidden rounded-[1.75rem] border border-slate-200/90 bg-white shadow-[0_32px_64px_-16px_rgba(15,23,42,0.28)]`}
          >
            <div className="h-1 w-full bg-linear-to-r from-indigo-500 via-indigo-600 to-indigo-500" />

            <div className="flex items-start justify-between gap-4 border-b border-slate-100 bg-linear-to-b from-slate-50 to-white px-5 py-4 sm:px-6 sm:py-5">
              <div className="flex min-w-0 items-start gap-3">
                {icon ? (
                  <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-600/10">
                    {icon}
                  </span>
                ) : null}
                <div className="min-w-0 pt-0.5">
                  <h3
                    id="admin-modal-title"
                    className="font-comfortaa text-lg font-bold tracking-tight text-slate-900 sm:text-xl"
                  >
                    {title}
                  </h3>
                  {description ? (
                    <p className="mt-1 text-sm leading-relaxed text-slate-500">
                      {description}
                    </p>
                  ) : null}
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-transparent p-2 text-slate-400 transition hover:border-slate-200 hover:bg-white hover:text-slate-700 hover:shadow-sm"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
              <div className="mx-0.5 my-1 sm:mx-1">{children}</div>
            </div>

            {footer ? (
              <div className="border-t border-slate-100 bg-slate-50/90 px-5 py-4 sm:px-6">
                {footer}
              </div>
            ) : null}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
