"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, MapPin, Monitor, BookMarked } from "lucide-react";
import { ResourcePageShell } from "@/utils/ResourcePageShell";

const gallery = [
  { src: "/library1.jpg", caption: "Central reading hall" },
  { src: "/library3.avif", caption: "Digital & research wing" },
  { src: "/campus4.jpg", caption: "Quiet study floors" },
  { src: "/campus2.jpg", caption: "Campus knowledge hub" },
];

const highlights = [
  {
    icon: BookMarked,
    title: "Collections",
    text: "Over 80,000 print titles, journals, and digital databases across engineering and sciences.",
  },
  {
    icon: Monitor,
    title: "Digital access",
    text: "Online journals, e-books, and research databases available on campus network and VPN.",
  },
  {
    icon: Clock,
    title: "Timings",
    text: "Mon–Sat 8:00 AM – 10:00 PM · Sunday 10:00 AM – 6:00 PM (exam weeks extended).",
  },
  {
    icon: MapPin,
    title: "Location",
    text: "Central Library Building, Academic Block A, Ground & First Floor.",
  },
];

const services = [
  "Book issue / return & renewals",
  "Reference & research help desk",
  "Inter-library loan requests",
  "Reading rooms & discussion pods",
  "Thesis & dissertation archive",
  "Plagiarism check support",
];

export default function LibraryPage() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % gallery.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <ResourcePageShell
      title="Library"
      description="Explore collections, digital resources, and study spaces at the Central Library."
      currentHref="/resources/library"
    >
      <div className="relative mb-8 overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative h-56 w-full sm:h-72 md:h-96">
          <AnimatePresence mode="wait">
            <motion.img
              key={gallery[index].src}
              src={gallery[index].src}
              alt={gallery[index].caption}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.55 }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-3 p-4 sm:p-6">
            <p className="text-sm font-medium text-white sm:text-base">
              {gallery[index].caption}
            </p>
            <div className="flex gap-1.5">
              {gallery.map((item, i) => (
                <button
                  key={item.src}
                  type="button"
                  aria-label={`Show ${item.caption}`}
                  onClick={() => setIndex(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === index ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {highlights.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <span className="inline-flex rounded-xl bg-[#786EFE]/10 p-2.5 text-[#786EFE]">
                <Icon size={18} />
              </span>
              <h2 className="mt-3 text-base font-bold text-[#333333]">
                {item.title}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">
                {item.text}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-bold text-[#333333]">Services</h2>
        <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {services.map((service) => (
            <li
              key={service}
              className="flex items-start gap-2 text-sm text-slate-600"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#786EFE]" />
              {service}
            </li>
          ))}
        </ul>
        <p className="mt-5 text-sm text-slate-500">
          Need help? Email{" "}
          <a
            href="mailto:library@iitdholakpur.edu"
            className="font-semibold text-[#786EFE] hover:underline"
          >
            library@iitdholakpur.edu
          </a>
        </p>
      </div>
    </ResourcePageShell>
  );
}
