"use client"

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Mic, MonitorCloud, Music, BriefcaseBusiness, Users, User, Trophy, BookOpen, Phone, Mail, Menu, X, Megaphone, FileText, Bell, Newspaper } from "lucide-react";
import { FaInstagram, FaFacebookF, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from 'next/navigation';

const languages = [
    { id: 1, text: 'Indian Institute of Technology, Dholakpur', font: 'font-poppins' },
    { id: 2, text: 'भारतीय प्रौद्योगिकी संस्थान, ढोलकपुर', font: 'font-hindi' },
    { id: 3, text: 'ଭାରତୀୟ ପ୍ରଯୁକ୍ତି ପ୍ରତିଷ୍ଠାନ, ଢୋଲକପୁର' },
    { id: 4, text: 'المعهد الهندي للتكنولوجيا، دولاكبور' },
    { id: 5, text: 'A Institution of Eminence', font: "font-bitcount" }
];

const images = [
    "insitutuion.jpeg",
    "campus1.jpg",
    "campus2.jpg",
    "campus3.jpg",
    "campus4.jpg",
    "campus5.jpg",
    "campus6.jpg",
    "campus7.jpg",
    "campus8.jpg",
];

const events = [
    {
        title: "Expert Talk",
        description: "AI and Future Opportunities and Challenges",
        time: "10:00 AM - 12:00 PM",
        icon: <Mic className='w-6 h-6' />,
        day: "24",
        month: "MAY",
    },
    {
        title: "Workshop",
        description: "Web Development Workshop Hands-on Workshop",
        time: "11:00 AM - 02:00 PM",
        icon: <MonitorCloud className="w-6 h-6" />,
        day: "24",
        month: "MAY",
    },
    {
        title: "Cultural Fest",
        description: "Aarambh 2K24 Annual Cultural Festival",
        time: "09:00 AM - 08:00 PM",
        icon: <Music className="w-6 h-6" />,
        day: "24",
        month: "MAY",
    },
    {
        title: "Placement Drive",
        description: "On Campus Placement Drive for 2024 Batch",
        time: "09:30 AM - 05:00 PM",
        icon: <BriefcaseBusiness className="w-6 h-6" />,
        day: "24",
        month: "MAY",
    },
];

function LandingPage() {
    const [index, setIndex] = useState(0);
    const [imageIndex, setImageIndex] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [clickedLogin, setClickedLogin] = useState(false);
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter();

    const handleFormOpen = () => {
        console.log("Form is opening")
        setIsFormOpen(!isFormOpen)
    }

    const LatestSection = [
        {
            icon: <Megaphone className="w-6 h-6 text-white my-4" />,
            heading: "Admissions Open for 2026",
            date: "20 MAY 2026",
            para: "Applications are now open for B.Tech, M.Tech, and Ph.D. programs for the academic session 2026–27.",
            iconBack: "bg-purple-400",
            headingColor: "text-purple-400"
        },
        {
            icon: <FileText className="w-6 h-6 text-white my-4" />,
            heading: "Semester Examination Schedule Released",
            date: "18 JAN 2026",
            para: "The final semester examination timetable for all departments has been published on the academic portal.",
            iconBack: "bg-green-400",
            headingColor: "text-green-700"
        },
        {
            icon: <Bell className="w-6 h-6 text-white my-4" />,
            heading: "Scholarship Applications Invited",
            date: "10 FEB 2026",
            para: "Merit-based and need-based scholarship applications are now available for eligible students.",
            iconBack: "bg-orange-400",
            headingColor: "text-orange-700"
        },
        {
            icon: <Newspaper className="w-6 h-6 text-white my-4" />,
            heading: "Annual Tech Fest Announced",
            date: "05 MAR 2026",
            para: "The institute's annual technical and innovation festival will begin next month with multiple competitions and workshops.",
            iconBack: "bg-blue-400",
            headingColor: "text-blue-700"
        },
    ];

    function CountUp({ target, duration = 2000 }: { target: number, duration?: number }) {
        const [count, setCount] = useState(0);
        const elementRef = useRef<HTMLSpanElement>(null);
        const hasAnimated = useRef(false);

        useEffect(() => {
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting && !hasAnimated.current) {
                        hasAnimated.current = true;
                        startAnimation();
                        if (elementRef.current) observer.unobserve(elementRef.current);
                    }
                },
                { threshold: 0.1 }
            );

            const startAnimation = () => {
                let startTime: number | null = null;

                const step = (currentTime: number) => {
                    if (!startTime) startTime = currentTime;
                    const progress = Math.min((currentTime - startTime) / duration, 1);
                    const currentCount = Math.floor(progress * target);
                    setCount(currentCount);

                    if (progress < 1) {
                        window.requestAnimationFrame(step);
                    } else {
                        setCount(target);
                    }
                };

                window.requestAnimationFrame(step);
            };

            if (elementRef.current) {
                observer.observe(elementRef.current);
            }

            return () => observer.disconnect();
        }, [target, duration]);

        return (
            <span ref={elementRef} className="tabular-nums">
                {count.toLocaleString()}+
            </span>
        );
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % languages.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setImageIndex((prev) => (prev + 1) % images.length);
        }, 6000);

        return () => clearInterval(interval);
    }, []);

    const currentItem = languages[index];

    const navLinks = ["Home", "Courses", "Faculty", "About", "Contact Us"];


    const handleLogin = async (e: React.FormEvent) => {
        try {
             e.preventDefault();
            const res = await axios.post("/api/users/login", {
                email,
                password
            })

            console.log("Login Successfull" ,res.data);
            console.log("API Success");

  await router.push("/dashboard");

  console.log("Redirect done");

        } catch (err:any) {
            console.error("Error in Login. Please Try Again.", err)

            
        }
    }

    const handleSignUp = async (e: React.FormEvent) => {
        try {
            e.preventDefault();
            const res = await axios.post("/api/users/signUp", {
                email,
                password,
                username
            })

            if(res.status !== 200){
                console.log("Error in SignUp, Please Try Again")
            }

            console.log("SIgnUp data: ", res.data)
        } catch (error: any) {
            throw new Error("Error in SignUp", error);

            
        }
    }

    return (
        <div className='bg-white min-h-screen'>
            {/* ============ NAVBAR ============ */}
            <div className='w-full sticky top-0 z-50 border-b border-gray-100 bg-white'>
                <div className='flex items-center justify-between px-4 sm:px-6 md:px-10 py-4 md:py-6'>
                    {/* Logo */}
                    <div className='shrink-0'>
                        <img src="/iitblogo.png" alt="logo" width={50} height={50} className='w-12 h-12 sm:w-14 sm:h-14 md:w-15 md:h-15' />
                    </div>

                    {/* Desktop Navigation */}
                    <div className='hidden md:flex items-center gap-8'>
                        {navLinks.map((link) => (
                            <a key={link} href="" className="relative font-medium text-sm lg:text-base text-[#333333] hover:text-[#786EFE] transition-colors duration-300 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-0 after:bg-[#786EFE] after:transition-all after:duration-300 after:-translate-x-1/2 hover:after:w-full">
                                {link}
                            </a>
                        ))}
                    </div>

                    {/* Desktop Buttons */}
                    <div className='hidden md:flex gap-3 lg:gap-4'>
                        <button className="border border-[#333333] px-4 lg:px-6 py-2 rounded text-sm lg:text-base text-[#333333] hover:scale-105 transition-all duration-300" onClick={() => {handleFormOpen() ; setClickedLogin(true)}}>
                            Login
                        </button>

                        <button className="bg-[#786EFE] text-white px-4 lg:px-6 py-2 rounded hover:bg-[#655BDB] hover:scale-105 transition-all duration-300 text-sm lg:text-base" onClick={() => {handleFormOpen() ; setClickedLogin(false)}}>
                            Sign Up
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button className='md:hidden p-2' onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className='md:hidden border-t border-gray-100 bg-white'
                        >
                            <div className='px-4 py-4 space-y-3'>
                                {navLinks.map((link) => (
                                    <a key={link} href="" className="block py-2 text-sm text-[#333333] hover:text-[#786EFE] transition-colors">
                                        {link}
                                    </a>
                                ))}
                                <div className='flex gap-2 pt-4 border-t border-gray-100'>
                                    <button className="flex-1 border border-[#333333] px-4 py-2 rounded text-sm text-[#333333]" onClick={() => {handleFormOpen; setClickedLogin(true)}}>
                                        Login
                                    </button>
                                    <button className="flex-1 bg-[#786EFE] text-white px-4 py-2 rounded text-sm" onClick={handleFormOpen}>
                                        Sign Up
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ============ IDENTITY SECTION ============ */}
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-6 px-4 sm:px-6 md:px-16 py-8'>
                {/* Left Side */}
                <div className="flex flex-row items-center  gap-3 sm:gap-5 flex-1">
                    <img src="/iitblogo.png" width={70} height={70} alt="logo" className='w-16 h-16 sm:w-20 sm:h-20 md:w-22.5 md:h-22.5 shrink-0' />

                    <div className="h-20 sm:h-24 overflow-hidden flex items-center flex-1 min-w-0">
                        <AnimatePresence mode="wait">
                            <motion.h1
                                key={languages[index].id}
                                initial={{ y: -50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 50, opacity: 0 }}
                                transition={{ duration: 0.6 }}
                                className={`text-xl sm:text-2xl md:text-4xl font-bold text-[#333333] leading-tight wrap-break-words ${currentItem.font || ""}`}
                            >
                                {languages[index].text}
                            </motion.h1>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Right Side - Location */}
                <div className="flex items-center gap-2 text-[#666666]">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                    <span className="text-xs sm:text-sm md:text-lg">
                        Komna, Nuapada, Odisha
                    </span>
                </div>
            </div>

            {/* ============ HERO SECTION ============ */}
            <div className='relative w-full h-64 sm:h-80 md:h-screen px-4 sm:px-6 md:px-10 py-6 md:py-10'>
                <div className='relative w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden'>
                    {/* Image Carousel */}
                    <div className='absolute inset-0 w-full overflow-hidden'>
                        {images.map((image, i) => (
                            <motion.img
                                key={image}
                                src={image}
                                alt=""
                                className="absolute inset-0 w-full h-full object-cover"
                                animate={{
                                    opacity: i === imageIndex ? 1 : 0,
                                    scale: i === imageIndex ? 1.05 : 1,
                                }}
                                transition={{
                                    opacity: { duration: 1 },
                                    scale: { duration: 6 },
                                }}
                            />
                        ))}
                    </div>

                    <div className="absolute inset-0 bg-black/25" />

                    {/* Motto Text */}
                    <div className="relative z-10 flex h-full items-end px-4 sm:px-6 md:px-10 pb-6 md:pb-12">
                        <p className="text-lg sm:text-2xl md:text-3xl lg:text-4xl text-white font-semibold max-w-2xl leading-snug">
                            Dedicated to knowledge, innovation and excellence
                        </p>
                    </div>
                </div>
            </div>

            {/* ============ LATEST NEWS SECTION ============ */}
            <div className='px-4 sm:px-6 md:px-12 py-8 md:py-12'>
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1F2937]">
                        Latest News
                    </h2>

                    <button className="w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-2.5 text-sm font-medium tracking-wide border border-[#786EFE] text-[#786EFE] rounded-xl hover:bg-[#786EFE] hover:text-white transition-all duration-300">
                        View All
                    </button>
                </div>

                {/* News Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {LatestSection.map((item, index) => (
                        <div
                            key={index}
                            className="border border-gray-200 p-5 sm:p-6 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between gap-5 bg-white"
                        >
                            <span className={`inline-flex w-fit ${item.iconBack} px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-lg sm:text-xl`}>
                                {item.icon}
                            </span>

                            <p className="text-xs uppercase tracking-widest text-[#6B7280] font-medium">
                                {item.date}
                            </p>

                            <h3 className={`text-lg sm:text-xl font-semibold tracking-tight leading-snug ${item.headingColor}`}>
                                {item.heading}
                            </h3>

                            <p className="text-sm sm:text-[15px] leading-7 text-[#4B5563]">
                                {item.para}
                            </p>

                            <a href="" className="text-sm font-medium tracking-wide text-[#786EFE] hover:text-[#5b54d6] transition-colors">
                                Read More →
                            </a>
                        </div>
                    ))}
                </div>
            </div>

            {/* ============ UPCOMING EVENTS SECTION ============ */}
            <div className='px-4 sm:px-6 md:px-12 py-8 md:py-12'>
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 md:mb-12">
                    <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1F2937]">
                        Upcoming Events
                    </h2>

                    <button className="w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-2.5 text-sm font-medium tracking-wide border border-[#786EFE] text-[#786EFE] rounded-xl hover:bg-[#786EFE] hover:text-white transition-all duration-300">
                        View All Events
                    </button>
                </div>

                {/* Timeline Section */}
                <div className="relative w-full py-8 md:py-16">
                    {/* Timeline Line - Hidden on Mobile */}
                    <div className="hidden md:block absolute top-8 left-8 right-8 h-0.5 bg-gray-200" />

                    {/* Event Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 relative">
                        {events.map((event, index) => (
                            <div key={index} className="relative">
                                {/* Timeline Dot - Hidden on Mobile */}
                                <div className="hidden md:block absolute -top-10 left-1/2 -translate-x-1/2 z-10">
                                    <div className="w-6 h-6 rounded-full bg-white border-2 border-purple-300 flex items-center justify-center shadow-sm">
                                        <div className="w-2 h-2 rounded-full bg-purple-500" />
                                    </div>
                                </div>

                                {/* Event Card */}
                                <div className="border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between gap-6 bg-white">
                                    {/* Top Row */}
                                    <div className="flex justify-between items-start">
                                        {/* Date Block */}
                                        <div className="flex flex-col leading-none">
                                            <h6 className="text-2xl sm:text-3xl font-bold text-[#1F2937]">
                                                {event.day}
                                            </h6>
                                            <p className="text-xs uppercase tracking-widest text-[#6B7280] font-medium mt-2">
                                                {event.month}
                                            </p>
                                        </div>

                                        {/* Icon Badge */}
                                        <span className="inline-flex items-center justify-center p-2 sm:p-4 bg-purple-100 text-purple-600 rounded-xl">
                                            {event.icon}
                                        </span>
                                    </div>

                                    {/* Event Title */}
                                    <h3 className="text-lg sm:text-xl font-semibold tracking-tight leading-snug text-[#1F2937]">
                                        {event.title}
                                    </h3>

                                    {/* Event Description */}
                                    <p className="text-sm sm:text-[15px] leading-7 text-[#4B5563]">
                                        {event.description}
                                    </p>

                                    {/* Event Time */}
                                    <p className="text-xs sm:text-sm font-medium tracking-wide text-[#374151]">
                                        {event.time}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ============ ACHIEVEMENTS SECTION ============ */}
            <div className="px-4 sm:px-6 md:px-10 py-8 md:py-16">
                {/* Section Heading */}
                <div className="mb-8 md:mb-10">
                    <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1F2937]">
                        Our Achievements
                    </h2>
                    <p className="text-sm sm:text-[15px] leading-7 text-[#4B5563] mt-2 max-w-xl">
                        Building excellence through education, innovation, and research.
                    </p>
                </div>

                {/* Achievement Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {[
                        { icon: Users, count: 25000, label: "Students enrolled across undergraduate and postgraduate programs." },
                        { icon: User, count: 1200, label: "Faculty members dedicated to quality teaching and mentorship." },
                        { icon: Trophy, count: 350, label: "Research patents filed in innovation, science, and technology." },
                        { icon: BookOpen, count: 500, label: "Industry and academic projects completed successfully." },
                    ].map((item, index) => (
                        <div key={index} className="border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md hover:-translate-y-2 transition-all duration-300 bg-white">
                            <span className="inline-flex items-center justify-center p-2 sm:p-4 rounded-xl bg-purple-100 text-purple-600">
                                <item.icon className="w-6 h-6 sm:w-7 sm:h-7" />
                            </span>

                            <h2 className="mt-5 sm:mt-6 text-3xl sm:text-4xl font-bold tracking-tight text-[#1F2937]">
                                <CountUp target={item.count} />
                            </h2>

                            <p className="mt-2 sm:mt-3 text-sm sm:text-[15px] leading-7 text-[#4B5563]">
                                {item.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ============ FOOTER ============ */}
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

            {
                isFormOpen ? (


                    <div className={`fixed inset-0  flex z-50 bg-black/40 backdrop-blur-sm items-center justify-center`} >
                        <div className={`bg-white p-6 backdrop-blur-md w-[90%] sm:w-125 min-h-100 flex flex-col  items-start rounded-2xl shadow-2xl border border-white/20`}>
                            <div className="relative w-full flex items-center justify-center">
                                <h1 className={`text-black text-2xl font-semibold tracking-tight p-3 text-center`}>{clickedLogin ? "Login" : "SignUp"}</h1>
                                <X className={`w-10 h-10 items-end absolute right-3 cursor-pointer p-2 rounded-full hover:bg-black/10 transition-all text-black `}  onClick={handleFormOpen}/>
                            </div>

                            <div className="p-6 w-full overflow-hidden">
                                {
                                    clickedLogin ? (
                                        <form action="" className="w-full space-y-5" >
                                    <div className="flex flex-col w-full ">
                                        <label htmlFor="email" className="mb-2 text-sm font-medium text-[#111827]">Email</label>
                                        <input type="email" id="email" placeholder="Enter your email" className="border border-gray-400 text-black py-3 px-4 rounded-lg w-full placeholder:text-sm placeholder:font-normal placeholder:text-gray-500 shadow-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                                        onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>

                                    <div className="flex flex-col w-full">
                                        <label className="mb-2 text-sm font-medium text-[#111827]">Password</label>

                                        <div className="relative flex items-center w-full">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Enter your password"
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="border border-gray-400 py-3 px-4 pl-3 pr-12  text-[15px] font-medium rounded-lg w-full outline-none text-black placeholder:text-sm placeholder:font-normal placeholder:text-gray-500 shadow-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 "
                                            />

                                            {/* Toggle icon based on state */}
                                            <div
                                                className="absolute right-3 cursor-pointer p-1 hover:bg-black/10 rounded-full transition-colors"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="w-5 h-5 text-gray-800" />
                                                ) : (
                                                    <Eye className="w-5 h-5 text-gray-800" />
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <button className="w-full p-3 bg-blue-500 mt-4 rounded-2xl text-black text-sm font-semibold tracking-wide hover:-translate-y-1 transition-all duration-300 hover:scale-105 cursor-pointer shadow-md hover:shadow-xl active:scale-95" onClick={handleLogin}>
                                        Submit
                                    </button>
                                </form>
                                    ) : (
                                        <form action="" className="w-full space-y-5" >
                                        <div className="flex flex-col w-full ">
                                        <label htmlFor="username" className="mb-2 text-sm font-medium text-[#111827]">Username</label>
                                        <input type="text" id="username" placeholder="Enter your username" className="border border-gray-400 text-black py-3 px-4 rounded-lg w-full placeholder:text-sm placeholder:font-normal placeholder:text-gray-500 shadow-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400" value={username} onChange={(e) => setUsername(e.target.value)} />
                                    </div>
                                    <div className="flex flex-col w-full ">
                                        <label htmlFor="email" className="mb-2 text-sm font-medium text-[#111827]">Email</label>
                                        <input type="email" id="email" placeholder="Enter your email" className="border border-gray-400 text-black py-3 px-4 rounded-lg w-full placeholder:text-sm placeholder:font-normal placeholder:text-gray-500 shadow-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400" value={email} onChange={(e) => setEmail(e.target.value)} />
                                    </div>

                                    
                                    

                                    <div className="flex flex-col w-full">
                                        <label className="mb-2 text-sm font-medium text-[#111827]">Password</label>

                                        <div className="relative flex items-center w-full">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Enter your password"
                                                className="border border-gray-400 py-3 px-4 pl-3 pr-12  text-[15px] font-medium rounded-lg w-full outline-none text-black placeholder:text-sm placeholder:font-normal placeholder:text-gray-500 shadow-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 "
                                                value={password} onChange={(e) => setPassword(e.target.value)}
                                            />

                                            {/* Toggle icon based on state */}
                                            <div
                                                className="absolute right-3 cursor-pointer p-1 hover:bg-black/10 rounded-full transition-colors"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="w-5 h-5 text-gray-800" />
                                                ) : (
                                                    <Eye className="w-5 h-5 text-gray-800" />
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <button className="w-full p-3 bg-blue-500 mt-4 rounded-2xl text-black text-sm font-semibold tracking-wide hover:-translate-y-1 transition-all duration-300 hover:scale-105 cursor-pointer shadow-md hover:shadow-xl active:scale-95" onClick={handleSignUp}>
                                        Submit
                                    </button>
                                </form>
                                    )
                                }
                            </div>



                        </div>
                    </div>
                ) : (
                    <></>
                )
            }




        </div>





    )
}

export default LandingPage