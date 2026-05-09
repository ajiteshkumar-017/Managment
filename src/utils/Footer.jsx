import React from 'react'
import { MapPin, Mic, MonitorCloud, Music, BriefcaseBusiness, Users, User, Trophy, BookOpen, Phone, Mail, Menu, X, Megaphone, FileText, Bell, Newspaper } from "lucide-react";

import { FaInstagram, FaFacebookF, FaLinkedinIn, FaTwitter } from "react-icons/fa";


function Footer() {
  return (
    <div>
      <footer className="bg-[#F9FAFB] border-t border-gray-200 mt-12 md:mt-20 px-4 sm:px-6 md:px-10 py-8 md:py-16">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                          {/* Column 1 — Branding */}
                          <div className="space-y-6">
                              <div className="flex items-center gap-4">
                                  <img src="/iitblogo.png" alt="logo" width={50} height={50} className='w-12 h-12 md:w-15 md:h-15' />
                                  <span className="text-lg sm:text-xl font-semibold tracking-tight text-[#1F2937] leading-snug">
                                      Indian Institute of Technology
                                  </span>
                              </div>
      
                              <p className="text-sm sm:text-[15px] leading-7 text-[#4B5563]">
                                  Committed to excellence in education, research, and innovation to build a better tomorrow.
                              </p>
      
                              <div className="flex gap-3">
                                  {[FaInstagram, FaFacebookF, FaLinkedinIn, FaTwitter].map((Icon, idx) => (
                                      <Icon key={idx} className="w-8 h-8 sm:w-10 sm:h-10 p-2 sm:p-3 rounded-full bg-white border border-gray-200 text-[#4B5563] hover:text-[#786EFE] hover:-translate-y-1 transition-all duration-300 cursor-pointer" />
                                  ))}
                              </div>
                          </div>
      
                          {/* Column 2 — Quick Links */}
                          <div>
                              <h3 className="text-base sm:text-lg font-semibold tracking-tight text-[#1F2937] mb-4 sm:mb-5">
                                  Quick Links
                              </h3>
                              <ul className="flex flex-col gap-3 sm:gap-4">
                                  {["Home", "Courses", "Faculty", "About Us", "Contact Us"].map((link) => (
                                      <li key={link}>
                                          <a href="" className="text-sm sm:text-[15px] text-[#4B5563] hover:text-[#786EFE] transition-colors duration-300">
                                              {link}
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
                                  {["Academic Calendar", "Library", "Placement Cell", "Student Portal", "Alumni"].map((resource) => (
                                      <li key={resource}>
                                          <a href="" className="text-sm sm:text-[15px] text-[#4B5563] hover:text-[#786EFE] transition-colors duration-300">
                                              {resource}
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
