"use client";

import { Globe2, HeartHandshake, Network, Newspaper } from "lucide-react";
import { ResourcePageShell } from "@/utils/ResourcePageShell";

const famousAlumni = [
  {
    name: "Ananya Mehra",
    batch: "B.Tech CSE · 2012",
    role: "VP of Engineering, Stripe",
    image: "/alumni1.jpg",
    success:
      "Led payment infrastructure teams serving millions of businesses worldwide. Open-sourced key reliability tooling used across fintech.",
    focus: "Payments · Distributed systems",
  },
  {
    name: "Rohan Desai",
    batch: "B.Tech EE · 2009",
    role: "Co-founder & CTO, Nimbus AI",
    image: "/alumni2.jpg",
    success:
      "Built an AI developer platform from zero to Series C. Earlier spent a decade at Google Brain working on large-scale model serving.",
    focus: "AI platforms · Startups",
  },
  {
    name: "Priya Natarajan",
    batch: "M.Tech CSE · 2014",
    role: "Principal Engineer, Microsoft Azure",
    image: "/alumni3.jpg",
    success:
      "Architect behind multi-region cloud security services. Mentors institute students through the Azure fellowship program each year.",
    focus: "Cloud · Security",
  },
  {
    name: "Kabir Singhania",
    batch: "B.Tech CSE · 2011",
    role: "Director of Product, Atlassian",
    image: "/alumni4.webp",
    success:
      "Scaled collaboration products used by Fortune 500 engineering teams. Known for bridging product strategy with deep software craft.",
    focus: "Product · Developer tools",
  },
];

const highlights = [
  {
    icon: Network,
    title: "Alumni network",
    text: "Connect with graduates across industry, research, and entrepreneurship.",
  },
  {
    icon: HeartHandshake,
    title: "Mentorship",
    text: "Volunteer as a mentor for current students and early-career alumni.",
  },
  {
    icon: Newspaper,
    title: "News & reunions",
    text: "Stay updated on campus events, chapter meets, and annual reunions.",
  },
  {
    icon: Globe2,
    title: "Chapters",
    text: "Regional and international alumni chapters for community and careers.",
  },
];

export default function AlumniPage() {
  return (
    <ResourcePageShell
      title="Alumni"
      description="Stay connected with the IIT Dholakpur alumni community worldwide."
      currentHref="/resources/alumni"
    >
      <div className="mb-2">
        <h2 className="text-xl font-bold text-[#333333]">Notable alumni</h2>
        <p className="mt-1 text-sm text-slate-500">
          Leaders shaping software, product, and technology companies globally
        </p>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {famousAlumni.map((person) => (
          <article
            key={person.name}
            className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="relative h-[360px] w-full bg-slate-100 sm:h-[420px]">
              <img
                src={person.image}
                alt={person.name}
                className="h-full w-full object-contain"
              />
              <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/75 via-black/35 to-transparent p-4">
                <p className="text-base font-bold text-white">{person.name}</p>
                <p className="text-xs text-white/85">{person.batch}</p>
              </div>
            </div>
            <div className="p-5">
              <p className="text-sm font-semibold text-[#786EFE]">{person.role}</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {person.success}
              </p>
              <p className="mt-3 text-xs font-medium uppercase tracking-wide text-slate-400">
                {person.focus}
              </p>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
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

      <div className="mt-8 rounded-2xl border border-gray-100 bg-slate-50/80 p-5 sm:p-6">
        <h2 className="text-lg font-bold text-[#333333]">Get involved</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Update your alumni profile, share opportunities with students, or
          support institute initiatives. Reach the Alumni Office anytime.
        </p>
        <p className="mt-4 text-sm text-slate-500">
          Email{" "}
          <a
            href="mailto:alumni@iitdholakpur.edu"
            className="font-semibold text-[#786EFE] hover:underline"
          >
            alumni@iitdholakpur.edu
          </a>
        </p>
      </div>
    </ResourcePageShell>
  );
}
