"use client";

import React, { useState } from "react";
import Footer from "@/utils/Footer";
import Navbar from "@/utils/Navbar";
import dynamic from "next/dynamic";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const ContactMap = dynamic(() => import("@/utils/ContactMap"), {
  ssr: false,
});

const quickContacts = [
  {
    label: "Address",
    value: "IIT Dholakpur Campus, Odisha, India",
    icon: MapPin,
  },
  {
    label: "Phone",
    value: "+91 22 2576 4051",
    href: "tel:+912225764051",
    icon: Phone,
  },
  {
    label: "Email",
    value: "contact@iitdholakpur.edu",
    href: "mailto:contact@iitdholakpur.edu",
    icon: Mail,
  },
  {
    label: "Office Hours",
    value: "Mon–Fri, 9:00 AM – 5:00 PM",
    icon: Clock,
  },
];

const helplines = [
  { department: "Anti-Ragging Helpline", number: "1800-180-5522", tel: "18001805522" },
  { department: "Women's Cell", number: "+91 22 2576 4051", tel: "+912225764051" },
  { department: "Mechanical Engineering", number: "+91 89 1726 0560", tel: "+918917260560" },
  { department: "Computer Science", number: "+91 22 2576 4051", tel: "+912225764051" },
];

const enquiryTypes = ["Admissions", "Academics", "Hostel", "Other"];

function ContactUs() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    enquiryType: "Admissions",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill first name, email, and message");
      return;
    }

    setSubmitting(true);
    try {
      const res = await axios.post("/api/contact", {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        enquiryType: form.enquiryType,
        message: form.message.trim(),
      });

      if (!res.data?.success) {
        throw new Error(res.data?.message || "Failed to submit");
      }

      toast.success(res.data.message || "Message submitted successfully");
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        enquiryType: "Admissions",
        message: "",
      });
    } catch (error: unknown) {
      const message =
        axios.isAxiosError(error)
          ? error.response?.data?.message
          : error instanceof Error
            ? error.message
            : null;
      toast.error(message || "Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="border-b border-gray-100 bg-linear-to-br from-slate-50 via-white to-[#786EFE]/5 px-4 py-10 sm:px-6 md:px-10 md:py-14">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#786EFE]">
            Contact Us
          </p>
          <h1 className="mt-2 font-comfortaa text-3xl font-bold text-[#333333] sm:text-4xl">
            Reach the institute
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
            Send an enquiry or use the helplines below for urgent support.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:px-10">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickContacts.map((item) => {
            const Icon = item.icon;
            const content = (
              <div className="flex h-full items-start gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                <span className="rounded-xl bg-[#786EFE]/10 p-2.5 text-[#786EFE]">
                  <Icon size={18} />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {item.label}
                  </p>
                  <p className="mt-1 text-sm font-medium text-[#333333] break-words">
                    {item.value}
                  </p>
                </div>
              </div>
            );

            if (item.href) {
              return (
                <a key={item.label} href={item.href} className="transition hover:opacity-90">
                  {content}
                </a>
              );
            }
            return <div key={item.label}>{content}</div>;
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-10 sm:px-6 md:px-10">
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <img
              src="/campus1.jpg"
              alt="Campus"
              className="h-64 w-full rounded-2xl object-cover sm:h-80 lg:h-full lg:min-h-[520px]"
            />
          </div>

          <div className="w-full lg:w-1/2">
            <form
              onSubmit={handleSubmit}
              className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-xl sm:p-6"
            >
              <div>
                <h2 className="text-xl font-bold text-[#333333]">Send a message</h2>
                <p className="mt-1 text-sm text-slate-500">We typically respond within 1–2 working days.</p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label htmlFor="firstName" className="text-sm font-semibold text-[#333333]">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={form.firstName}
                    onChange={handleChange}
                    className="rounded-xl border border-gray-200 px-4 py-3 text-sm text-[#333333] outline-none focus:ring-2 focus:ring-[#786EFE]/40"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="lastName" className="text-sm font-semibold text-[#333333]">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={form.lastName}
                    onChange={handleChange}
                    className="rounded-xl border border-gray-200 px-4 py-3 text-sm text-[#333333] outline-none focus:ring-2 focus:ring-[#786EFE]/40"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-semibold text-[#333333]">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="rounded-xl border border-gray-200 px-4 py-3 text-sm text-[#333333] outline-none focus:ring-2 focus:ring-[#786EFE]/40"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label htmlFor="phone" className="text-sm font-semibold text-[#333333]">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    className="rounded-xl border border-gray-200 px-4 py-3 text-sm text-[#333333] outline-none focus:ring-2 focus:ring-[#786EFE]/40"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="enquiryType" className="text-sm font-semibold text-[#333333]">
                    Enquiry Type
                  </label>
                  <select
                    id="enquiryType"
                    name="enquiryType"
                    value={form.enquiryType}
                    onChange={handleChange}
                    className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#333333] outline-none focus:ring-2 focus:ring-[#786EFE]/40"
                  >
                    {enquiryTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-sm font-semibold text-[#333333]">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={form.message}
                  onChange={handleChange}
                  className="rounded-xl border border-gray-200 px-4 py-3 text-sm text-[#333333] outline-none focus:ring-2 focus:ring-[#786EFE]/40"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-[#786EFE] py-3 text-sm font-bold text-white transition hover:bg-[#655BDB] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-6 sm:px-6 md:px-10">
        <h2 className="text-2xl font-bold tracking-tight text-[#333333]">Campus map</h2>
        <p className="mt-1 text-sm text-slate-500">Find us on the map</p>
        <div className="mt-4">
          <ContactMap />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 md:px-10">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
          <h2 className="flex items-center gap-2 text-2xl font-bold text-[#333333]">
            <span className="h-8 w-2 rounded-full bg-[#786EFE]" />
            Important Helplines
          </h2>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b text-sm text-slate-400">
                  <th className="pb-4 font-medium">Department</th>
                  <th className="pb-4 font-medium">Contact Number</th>
                  <th className="pb-4 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y text-[#333333]">
                {helplines.map((row) => (
                  <tr key={row.department} className="transition-colors hover:bg-slate-50">
                    <td className="py-4 font-medium">{row.department}</td>
                    <td className="py-4 font-mono text-sm">{row.number}</td>
                    <td className="py-4 text-right">
                      <a
                        href={`tel:${row.tel}`}
                        className="font-semibold text-[#786EFE] hover:underline"
                      >
                        Call Now
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default ContactUs;
