import React, {useState, } from 'react'
import { useRouter } from 'next/navigation';
import { MapPin, Mic, MonitorCloud, Music, BriefcaseBusiness, Users, User, Trophy, BookOpen, Phone, Mail, Menu, X, Megaphone, FileText, Bell, Newspaper } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios"
import toast from "react-hot-toast";
import { useDebounce } from "react-use";


function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [clickedLogin, setClickedLogin] = useState(false);
    const [index, setIndex] = useState(0);
    const [emailStatus, setEmailStatus] = useState("");
    const [imageIndex, setImageIndex] = useState(0);
        
        const [showPassword, setShowPassword] = useState(false)
       
        const [email, setEmail] = useState("")
        const [username, setUsername] = useState("")
        const [password, setPassword] = useState("")
        const router = useRouter();
        // const toast = useToaster();

    const navLinks = ["Home", "Courses", "Faculty", "About", "Contact Us"];
    const handleFormOpen = () => {
        console.log("Form is opening")
        setIsFormOpen(!isFormOpen)
    }

    const handleLogin = async (e: React.FormEvent) => {
        try {
             e.preventDefault();
            const res = await axios.post("/api/users/login", {
                email,
                password
            })

            console.log("Login Successfull" ,res.data);
            console.log("API Success");
            toast.success(res?.data?.message || "Login Sucessfull")

             router.push("/dashboard");

            console.log("Redirect done");

        } catch (err:any) {
            toast.error(err?.response?.data?.message || "Something went wrong. Please try again.")
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



            console.log("SIgnUp data: ", res.data);

            toast.success(res?.data?.message || "SignUp Sucessfull")
            setIsFormOpen(false)
        } catch (error: any) {
            console.log("Error in SignUp Page:", error)
            const message = error.response?.data?.message || "Something went wrong"
            console.log(message)
            toast.error(message);   
        }
    }

    // const handleFormOpen = () => {
    //     console.log("Form is opening")
    //     setIsFormOpen(!isFormOpen)
    // }

    useDebounce(
        async () => {
            console.log("API calling for:", email);
            if (!email) return;
            if (email.length < 5) return;
            if (!email.includes("@")) return;

            try {
                const res = await axios.get(`/api/users/check-email?email=${email}`);

                if (res.data.exists) {
                    setEmailStatus("Email already taken");
                } else {
                    setEmailStatus("");
                }
            }catch (error: any) {
            console.log(error);
            console.log(error.response?.data);

            setEmailStatus("Error checking email");
            }
        },
        500,
        [email]
    )

  return (
    <>
    <div>
      <div className='w-full sticky top-0 z-50 border-b border-gray-100 bg-white'>
                <div className='flex items-center justify-between px-4 sm:px-6 md:px-10 py-4 md:py-6'>
                    {/* Logo */}
                    <div className='shrink-0'>
                        <img src="/iitblogo.png" alt="logo" width={50} height={50} className='w-12 h-12 sm:w-14 sm:h-14 md:w-15 md:h-15' />
                    </div>

                    {/* Desktop Navigation */}
                    <div className='hidden md:flex items-center gap-8'>
                        {navLinks.map((link) => (
                            <a key={link} href={`/${link.toLocaleLowerCase()}`} className="relative font-medium text-sm lg:text-base text-[#333333] hover:text-[#786EFE] transition-colors duration-300 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-0 after:bg-[#786EFE] after:transition-all after:duration-300 after:-translate-x-1/2 hover:after:w-full">
                                {link}
                            </a>
                        ))}
                    </div>

                    {/* Desktop Buttons */}
                    <div className='hidden md:flex gap-3 lg:gap-4'>
                        <button className="border border-[#333333] px-4 lg:px-6 py-2 rounded text-sm lg:text-base text-[#333333] hover:scale-105 transition-all duration-300" onClick={() => {handleFormOpen() ; setClickedLogin(true); console.log("Clicked Login :")}}>
                            Login
                        </button>

                        <button className="bg-[#786EFE] text-white px-4 lg:px-6 py-2 rounded hover:bg-[#655BDB] hover:scale-105 transition-all duration-300 text-sm lg:text-base" onClick={() => {handleFormOpen() ; setClickedLogin(false) ; console.log("Clicked Login :")}}>
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
                                    <button type="button" className="flex-1 border border-[#333333] px-4 py-2 rounded text-sm text-[#333333]" onClick={() => {handleFormOpen(); setClickedLogin(true); }}>
                                        Login
                                    </button>
                                    <button type="button" className="flex-1 bg-[#786EFE] text-white px-4 py-2 rounded text-sm" onClick={() => {handleFormOpen(); setClickedLogin(false); }}>
                                        Sign Up
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            
    </div>

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
                                        <form action="" className="w-full space-y-5" onSubmit={handleLogin} >
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

                                    <button type="submit" className="w-full p-3 bg-blue-500 mt-4 rounded-2xl text-black text-sm font-semibold tracking-wide hover:-translate-y-1 transition-all duration-300 hover:scale-105 cursor-pointer shadow-md hover:shadow-xl active:scale-95">
                                        Submit
                                    </button>
                                </form>
                                    ) : (
                                        <form action="" className="w-full space-y-5" onSubmit={handleSignUp} >
                                        <div className="flex flex-col w-full ">
                                        <label htmlFor="username" className="mb-2 text-sm font-medium text-[#111827]">Username</label>
                                        <input type="text" id="username" placeholder="Enter your username" className="border border-gray-400 text-black py-3 px-4 rounded-lg w-full placeholder:text-sm placeholder:font-normal placeholder:text-gray-500 shadow-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400" value={username} onChange={(e) => setUsername(e.target.value)} />
                                    </div>
                                    <div className="flex flex-col w-full ">
                                        <label htmlFor="email" className="mb-2 text-sm font-medium text-[#111827]">Email</label>
                                        <input type="email" id="email" placeholder="Enter your email" className="border border-gray-400 text-black py-3 px-4 rounded-lg w-full placeholder:text-sm placeholder:font-normal placeholder:text-gray-500 shadow-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400" value={email} onChange={(e) => {setEmail(e.target.value); setEmailStatus("");}} />
                                        <p className='text-red-500 text-sm mt-2 tracking-tight'>{emailStatus}</p>
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

                                    <button type="submit" className="w-full p-3 bg-blue-500 mt-4 rounded-2xl text-black text-sm font-semibold tracking-wide hover:-translate-y-1 transition-all duration-300 hover:scale-105 cursor-pointer shadow-md hover:shadow-xl active:scale-95">
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
    

    </>
  )
}

export default Navbar
