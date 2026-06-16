"use client"

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Mic, MonitorCloud, Music, BriefcaseBusiness, Users, User, Trophy, BookOpen, Phone, Mail, Menu, X, Megaphone, FileText, Bell, Newspaper } from "lucide-react";
import { FaInstagram, FaFacebookF, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from 'next/navigation';
import Navbar from '@/utils/Navbar';
import Footer from "@/utils/Footer"

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
    
    const [showPassword, setShowPassword] = useState(false)
   
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
        const [isFormOpen, setIsFormOpen] = useState(false)
        const [clickedLogin, setClickedLogin] = useState(false);

    

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



    const handleLogin = async (e: React.FormEvent) => {
        try {
             e.preventDefault();
            const res = await axios.post("/api/users/login", {
                email,
                password
            })

            console.log("Login Successfull" ,res.data);
            console.log("API Success");

             

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

            console.log("Consologing res",res);

            if(res.status !== 200){
                console.log("Error in SignUp, Please Try Again")
            }

            console.log("SIgnUp data: ", res.data)
        } catch (error: any) {
         
            
            throw new Error("Error in SignUp", error);

            
        }
    }

    const handleFormOpen = () => {
        console.log("Form is opening")
        setIsFormOpen(!isFormOpen)
    }

    return (
        <div className='bg-white min-h-screen'>
            {/* ============ NAVBAR ============ */}
            <Navbar/>
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
            <Footer />
            
            

            




        </div>





    )
}

export default LandingPage