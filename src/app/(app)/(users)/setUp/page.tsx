"use client"

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Mic, MonitorCloud, Music, BriefcaseBusiness, Users, User, Trophy, BookOpen, Phone, Mail, Menu, X, Megaphone, FileText, Bell, Newspaper, Save } from "lucide-react";
import { FaInstagram, FaFacebookF, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from 'next/navigation';
import Navbar from '@/utils/Navbar';
import Footer from "@/utils/Footer"
import toast from 'react-hot-toast';
import Cropper from 'react-easy-crop';
import { getCroppedImage } from '@/lib/cropImage';
// import {useRouter} from "next/navigation"

type CroppedArea = {
    x: number;
    y: number;
    width: number;
    height: number;
};


function SetUp() {

    const [department, setDepartment] = useState("");
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [selectedfile, setSelectedfile] = useState<File | null>(null);
    const [preview, setPreview] = useState(null)
    const [croppedView, setCroppedView] = useState(null);
    const [currentImage, setCurrentImage] = useState(null);
    const [showModal, setShowModal] = useState<boolean | null>(false);
    const [zoom, setZoom] = useState(1)
    const [loading, setLoading] = useState(false)
    const [semester, setSemester] = useState("");
    const [section, setSection] = useState("");
    const router = useRouter();

    
    const handleProfileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            // setShowModal(true)
            console.log("Hello Brother")
            const file = e.target.files?.[0]


            if (!file) {
                console.log("No file is Found.Please select a file");
                return
            }
            console.log("Got the file.", file)

            setSelectedfile(file)


            const preview = URL.createObjectURL(file);

            setPreview(preview);

            console.log("Done the Preview:", preview)
            console.log(selectedfile)

            console.log("Selected the File:", selectedfile)

            setShowModal(true)

        } catch (err: any) {
            console.log("Error in File Upload", err);
            toast.error("AAG AAG AAAG")
        }
    }

    // const handleSave = async () => {
    //     try {

    //         if (!selectedfile || !croppedView) {
    //             console.log("No Selected FIle found")
    //             return
    //         }

    //         const formData = new FormData();
    //         formData.append("image", croppedView)

    //     } catch (error: any) {
    //         console.log("Some error in Saving the upload of the file.")
    //         toast.error("Error in Uploading Profile Photo")
    //     }
    // }

    const handleSubmission = async (e) => {
        try {

            e.preventDefault();
            console.log("SUBMIT CLICKED");

            if (!selectedfile || !croppedView) {
                console.error("No File is Found")
                return
            }

            const imageUrl = URL.createObjectURL(selectedfile);

            const croppedBlob = await getCroppedImage(imageUrl,croppedView);

            const croppedFile = new File(
      [croppedBlob],
      "profile.jpg",
      {
        type: "image/jpeg",
      }
    );
            

            const formData = new FormData();
            formData.append("image", croppedFile)

            console.log("CALLING API");
            console.log("API URL", "/api/users/setUp");

            const res = await axios.post("/api/users/auth/setUp", formData,
                {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }
            )

            console.log("Response Genertaed")

            if (res.status !== 200) {
                console.error("Faulty Response by Backend",);

            }

            setCurrentImage(res.data.imageUrl);
            setCrop({ x: 0, y: 0 });
            setPreview(null)
            setCroppedView(null)
            setShowModal(false)

            console.log("Current Image:", currentImage)

        } catch (error: any) {
            console.log("Error in AXIOS", error)
        }
    }

    const handleSave = async () => {
        try {
            const res = await axios.post("/api/users/auth/getDetail", {semester,section,department});

            console.log(res.data.message);

            if(res.status === 200){
                toast.success("Updated the Profile.")
                router.push("/dashboard")
            }

            

        } catch (error:any) {
            console.log("Error in Submit of SetUP file");
    
            toast.error(error.response.data.message || "Error in Uploading")

            return
        }
    }

    useEffect(() => {
        setCurrentImage(currentImage)
    }, [currentImage])

    return (
        <div className="bg-linear-to-br from-slate-50 via-white to-slate-50 min-h-screen p-4 sm:p-6 flex flex-col items-center">


            <h3 className='font-comfortaa text-2xl font-bold text-indigo-500 text-center mt-4'>Please Complete Your Profile</h3>

            <div className="w-full max-w-5xl p-4 sm:p-6 mt-8 rounded-xl shadow-md border border-slate-200">

               <div className="mb-6 flex flex-col lg:flex-row items-center lg:items-start gap-6 p-2 sm:p-4">
                    <img
                    src={currentImage || "/uploads/1781560547307-profile.jpg"}
                    alt="Profile pic"
                    className="h-32 w-32 sm:h-40 sm:w-40 lg:h-48 lg:w-48 rounded-full border-2 border-slate-200 object-cover"
/>

                    <div className="text-center lg:text-left">
                        <p className='text-black'>Please select a JPEG, JPG, PNG or WEBP TYPE IMAGE</p>

                        <div className='mt-8'>
                            <input
                                type="file"
                                accept="image/*"
                                id="photo"
                                className="hidden"
                                // value={currentImage || "/public/uploads/"}
                                onChange={handleProfileUpload}
                            />

                            <label
                                htmlFor="photo"
                                className="bg-indigo-600 px-4 py-3 rounded-xl text-white font-bold cursor-pointer hover:bg-indigo-700 transition-all duration-100 "
                            >
                                Upload Image
                            </label>

                        </div>
                    </div>

                </div>
                <div className="flex flex-col lg:flex-row gap-4 mb-4">
                    <div className='text-black shadow-sm border border-slate-100 flex flex-col p-2 w-full lg:w-1/2 rounded-xl'>
                        <label htmlFor="">Selected Your Department</label>
                        <select className="p-2 mt-2 border border-slate-200 rounded-lg" value={department} onChange={(e) => setDepartment(e.target.value)}>

                            <option value="default">Department</option>
                            <option value="CSE">Computer Science and Engineering</option>
                            <option value="ME">Mechanical Engineering</option>
                            <option value="CHE">Chemical Engineering</option>
                            <option value="CE">Civil Engineering</option>
                            <option value="BE">BioTechnology Engineering</option>
                            <option value="AI&M">Ai and Mathematics</option>
                        </select>
                    </div>

                    <div className='text-black shadow-sm border border-slate-100 flex flex-col p-2 w-full lg:w-1/2 rounded-xl'>
                        <label htmlFor="">Selected Your Semester</label>
                        <select className="p-2 mt-2 border border-slate-200 rounded-lg" value={semester} onChange={(e) => setSemester(e.target.value)}>

                            <option value="default">Semester</option>
                            <option value="1">Semester 1</option>
                            <option value="2">Semester 2</option>
                            <option value="3">Semester 3</option>
                            <option value="4">Semester 4</option>
                            <option value="5">Semester 5</option>
                            <option value="6">Semester 6</option>
                            <option value="7">Semester 7</option>
                            <option value="8">Semester 8</option>
                        </select>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-4 mb-4">
                    <div className='text-black shadow-sm border border-slate-100 flex flex-col p-2 w-full lg:w-1/2 rounded-xl'>
                        <label htmlFor="">Selected Your Section</label>
                        <select className="p-2 mt-2 border border-slate-200 rounded-lg" value={section} onChange={(e) => setSection(e.target.value)}>

                            <option value="default">Section</option>
                            <option value="A">Section A</option>
                            <option value="B">Section B</option>
                            <option value="C">Section C</option>
                            <option value="D">Section D</option>
                            <option value="E">Section E</option>
                            <option value="F">Section F</option>
                        </select>
                    </div>


                </div>

            <div>
                <button type="button" className='w-full px-4 py-3 rounded-xl bg-indigo-600 transition-all duration-300 font-bold font-comfortaa cursor-pointer hover:bg-indigo-800 hover:scale-98' onClick={handleSave}>
                    Submit
                </button>
            </div>




            </div>

            {
                showModal && (
                    <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 z-50">
                        <div className="w-full max-w-lg bg-white shadow-md border border-slate-200 rounded-xl p-4 sm:p-6">
                            <div className="relative h-[250px] sm:h-[350px] lg:h-[400px] w-full">

                                <Cropper
                                    image={`${preview}`}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={1}
                                    cropShape="round"
                                    onCropChange={setCrop}
                                    onZoomChange={setZoom}
                                    onCropComplete={(_, croppedPixels) => {
                                        setCroppedView(croppedPixels);
                                    }}


                                />



                                <div>



                                </div>


                            </div>

                           <div className="flex flex-col sm:flex-row gap-3 sm:justify-between mt-4">
                                <button className=' px-2 py-3 flex items-center gap-2 bg-red-500 rounded-lg font-bold tracking-wide disabled:opacity-50 disabled:cursor-not-allowed' disabled={loading} onClick={() => { setShowModal(false); setPreview(null) }}><X size={20} /> Cancel</button>

                                <button type='button' className="flex items-center gap-2 bg-green-500 py-3 px-3 rounded-lg font-bold tracking-wide cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" onClick={handleSubmission} disabled={loading}>
                                    <Save size={20} />
                                    {loading === true ? "Saving..." : "Save "}
                                </button>
                            </div>


                        </div>
                    </div>
                )
            }


        </div>
    )

}

export default SetUp