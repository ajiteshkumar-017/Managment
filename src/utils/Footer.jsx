import React from 'react'
import { MapPin, Phone, Mail } from "lucide-react";

import { FaInstagram, FaFacebookF, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import { resourceLinks } from "@/utils/ResourcePageShell";
import Link from 'next/link';
import { PUBLIC_LOGO } from "@/lib/publicLogo";

const socialMediaHandle = [
    {
        label: "Instagram", link: "https://instagram.com/ajiteshkumar__",icon: FaInstagram
    },
    {
        label: "Facebook", link: "",icon: FaFacebookF
    },
    {
        label: "LinkedIn", link: "",icon: FaLinkedinIn
    },
    {
        label: "Twitter", link: "",icon: FaTwitter
    },
]


function Footer() {
  return (
    <div>
      <footer className="bg-[#F9FAFB] border-t border-gray-200 mt-12 md:mt-20 px-4 sm:px-6 md:px-10 py-8 md:py-16">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                          {/* Column 1 — Branding */}
                          <div className="space-y-6">
                              <div className="flex items-center gap-4">
                                  <img src={PUBLIC_LOGO.mark} alt={PUBLIC_LOGO.alt} width={56} height={56} className='h-12 w-12 object-contain md:h-14 md:w-14' />
                                  <span className="text-lg sm:text-xl font-semibold tracking-tight text-[#1F2937] leading-snug">
                                      Indian Institute of Technology
                                  </span>
                              </div>
      
                              <p className="text-sm sm:text-[15px] leading-7 text-[#4B5563]">
                                  Committed to excellence in education, research, and innovation to build a better tomorrow.
                              </p>
      
                              <div className="flex gap-3">

                                  {socialMediaHandle.filter((data) => data.link).map((data) => (
                                      <Link
                                      href={data.link}
                                      key={data.label}
                                      className='w-8 h-8 sm:w-10 sm:h-10 p-2 sm:p-3 rounded-full bg-white border border-gray-200 text-[#4B5563] hover:text-[#786EFE] hover:-translate-y-1 transition-all duration-300 cursor-pointer'
                                      rel="noopener noreferrer"
                                      target="_blank"
                                      aria-label={data.label}
                                      >
                                        <data.icon className="w-full h-full" />
                                    </Link>
                                  ))}
                              </div>
                          </div>
      
                          {/* Column 2 — Quick Links */}
                          <div>
                              <h3 className="text-base sm:text-lg font-semibold tracking-tight text-[#1F2937] mb-4 sm:mb-5">
                                  Quick Links
                              </h3>
                              <ul className="flex flex-col gap-3 sm:gap-4">
                                  {[
                                      { label: "Home", href: "/landingPage" },
                                      { label: "Courses", href: "/courses" },
                                      { label: "Faculty", href: "/faculty" },
                                      { label: "About Us", href: "/about" },
                                      { label: "Contact Us", href: "/contactUs" },
                                  ].map((link) => (
                                      <li key={link.label}>
                                          <a href={link.href} className="text-sm sm:text-[15px] text-[#4B5563] hover:text-[#786EFE] transition-colors duration-300">
                                              {link.label}
                                          </a>
                                      </li>
                                  ))}
                              </ul>
                          </div>
      
                          {/* Column 3 — Resources */}
                          <div>
                              <h3 className="text-base sm:text-lg font-semibold tracking-tight text-[#1F2937] mb-4 sm:mb-5">
                                  Resources
                              </h3>
                              <ul className="flex flex-col gap-3 sm:gap-4">
                                  {resourceLinks.map((resource) => (
                                      <li key={resource.href}>
                                          <a href={resource.href} className="text-sm sm:text-[15px] text-[#4B5563] hover:text-[#786EFE] transition-colors duration-300">
                                              {resource.label}
                                          </a>
                                      </li>
                                  ))}
                              </ul>
                          </div>
      
                          {/* Column 4 — Contact */}
                          <div>
                              <h3 className="text-base sm:text-lg font-semibold tracking-tight text-[#1F2937] mb-4 sm:mb-5">
                                  Contact Us
                              </h3>
      
                              <div className="space-y-4 sm:space-y-5">
                                  <div className="flex items-start gap-3">
                                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#786EFE] mt-1 shrink-0" />
                                      <p className="text-sm sm:text-[15px] leading-7 text-[#4B5563]">
                                          IIT Dholakpur, Komna, Nuapada, Odisha
                                      </p>
                                  </div>
      
                                  <div className="flex items-start gap-3">
                                      <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-[#786EFE] mt-1 shrink-0" />
                                      <p className="text-sm sm:text-[15px] text-[#4B5563]">
                                          +91 9876543210
                                      </p>
                                  </div>
      
                                  <div className="flex items-start gap-3">
                                      <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-[#786EFE] mt-1 shrink-0" />
                                      <p className="text-sm sm:text-[15px] text-[#4B5563]">
                                          info@iitdholakpur.ac.in
                                      </p>
                                  </div>
                              </div>
                          </div>
                      </div>
      
                      {/* Bottom Bar */}
                      <div className="border-t border-gray-200 mt-8 md:mt-12 pt-6 text-center">
                          <p className="text-xs sm:text-sm text-[#6B7280]">
                              © 2026 Indian Institute of Technology, Dholakpur. All rights reserved.
                          </p>
                      </div>
                  </footer>
    </div>
  )
}

export default Footer
