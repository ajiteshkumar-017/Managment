"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from "framer-motion";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { MapPin } from "lucide-react";

const languages = [
    { id: 1, text: 'Indian Institute of Technology, Dholakpur', font: 'font-poppins' },
    { id: 2, text: 'भारतीय प्रौद्योगिकी संस्थान, ढोलकपुर', font: 'font-hindi' },
    { id: 3, text: 'ଭାରତୀୟ ପ୍ରଯୁକ୍ତି ପ୍ରତିଷ୍ଠାନ, ଢୋଲକପୁର' },
    { id: 4, text: 'المعهد الهندي للتكنولوجيا، دولاكبور' },
    { id: 5, text: 'A Insitution of Eminanace', font: "font-bitcount" }
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

]

function LandingPage() {

    const [index, setIndex] = useState(0);
    const [imageIndex, setImageIndex] = useState(0);

    useEffect(() => {
        // Change text every 5 seconds
        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % languages.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);


    useEffect(() => {
        const interval = setInterval(() => {
            setImageIndex((prev) => (prev + 1) % images.length);
        }, 6000)

        return () => clearInterval(interval)
    }, [])


    const currentItem = languages[index]

    const currenTImage = images[imageIndex]
    return (

        <div className='bg-white min-h-screen'>
            {/* Navbar */}

            <div className='w-full sticky top-0 z-50 border-b border-gray-100 bg-white'>
                <div className='flex items-center justify-between px-10 py-6'>
                    <div>
                        <img src="/iitblogo.png" alt="" width={60} />
                    </div>
                    {/* middle content */}
                    <div className='flex items-center gap-10'>

                        <a href="" className="relative font-medium text-[#333333] hover:text-[#786EFE] transition-colors duration-300 after:content-[''] after:absolute after:bottom-0 after:left-1/2  after:h-0.5 after:w-0 after:bg-[#786EFE]  after:transition-all after:duration-300 after:-translate-x-1/2
              hover:after:w-full ">Home</a>

                        <a href="" className="relative font-medium text-[#333333] hover:text-[#786EFE] transition-colors duration-300 after:content-[''] after:absolute after:bottom-0 after:left-1/2  after:h-0.5 after:w-0 after:bg-[#786EFE]  after:transition-all after:duration-300 after:-translate-x-1/2
              hover:after:w-full ">Courses</a>

                        <a href="" className="relative font-medium text-[#333333] hover:text-[#786EFE] transition-colors duration-300 after:content-[''] after:absolute after:bottom-0 after:left-1/2  after:h-0.5 after:w-0 after:bg-[#786EFE]  after:transition-all after:duration-300 after:-translate-x-1/2
              hover:after:w-full ">Faculty</a>

                        <a href="" className="relative font-medium text-[#333333] hover:text-[#786EFE] transition-colors duration-300 after:content-[''] after:absolute after:bottom-0 after:left-1/2  after:h-0.5 after:w-0 after:bg-[#786EFE]  after:transition-all after:duration-300 after:-translate-x-1/2
              hover:after:w-full ">About</a>

                        <a href="" className="relative font-medium text-[#333333] hover:text-[#786EFE] transition-colors duration-300 after:content-[''] after:absolute after:bottom-0 after:left-1/2  after:h-0.5 after:w-0 after:bg-[#786EFE]  after:transition-all after:duration-300 after:-translate-x-1/2
              hover:after:w-full ">Contact Us</a>




                    </div>

                    {/* right side buttons */}

                    <div className='flex gap-4'>
                        <button className="border border-[#333333] px-6 py-2 rounded text-[#333333] hover:scale-105 transition-all duration-300">
                            Login
                        </button>

                        <button className="bg-[#786EFE] text-white px-6 py-2 rounded hover:bg-[#655BDB] hover:scale-105 transition-all duration-300">
                            Sign Up
                        </button>

                    </div>
                </div>
            </div>


            {/* Identity Section */}

            <div className='flex justify-between px-16 py-8'>

                {/* left side  */}
                <div className="flex items-center gap-5">
                    <img src="/iitblogo.png" width={90} alt="logo" />

                    <div className="h-24 overflow-hidden flex items-center">
                        <AnimatePresence mode="wait">
                            <motion.h1
                                key={languages[index].id}
                                initial={{ y: -50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 50, opacity: 0 }}
                                transition={{ duration: 0.6 }}
                                className={`text-4xl font-bold text-[#333333] ${currentItem.font || ""}`}
                            >
                                {/* changed: removed duplicate classes */}
                                {languages[index].text}
                            </motion.h1>
                        </AnimatePresence>
                    </div>
                </div>

                {/* right side */}

                <div className="flex items-center gap-3" >
                    {/* changed: icon first */}
                    <MapPin className="w-5 h-5 text-[#666666]" />

                    <span className="text-[#666666] text-lg">
                        Komna, Nuapada, Odisha
                    </span>
                </div>

            </div>

            {/* Hero Section */}
            <div className='relative h-screen w-full px-10 py-10'>

                <div className='relative w-full h-full rounded-3xl overflow-hidden'>

                    <div className='absolute inset-0 w-full overflow-hidden'>
                        {images.map((image, i) => (
                            <motion.img
                                key={image}
                                src={image}
                                alt=""
                                className="absolute inset-0 w-full h-full object-cover"
                                animate={{
                                    opacity: i === imageIndex ? 1 : 0,
                                    // changed: fixed bug (imageIndex instead of index)

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
                    {/* changed: lighter overlay */}

                    {/* Motto */}
                    <div className="relative z-10 flex h-full items-end px-10 pb-12">
                        <p className="text-3xl md:text-4xl text-white font-semibold max-w-2xl leading-snug">
                            Dedicated to knowledge, innovation and excellence
                        </p>
                    </div>
                </div>

            </div>

        </div>

    )
}

export default LandingPage