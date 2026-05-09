"use client"
import ContactMap from "@/utils/ContactMap"

import react, {useState} from "react" 

import Footer from "@/utils/Footer";
import Navbar from "@/utils/Navbar"


function page() {

    const handleSubmit = async (e:React.FormEvent) => {
        try {
            e.preventDefault()
            console.log("Clicked button")
        } catch (err: any) {
            console.error('Error in submit button')
        }
    }

  return (
    <div className="min-h-screen bg-white">
        <Navbar/>

        <div className="flex flex-col lg:flex-row p-4 sm:p-6 md:p-8 gap-8">
            <div className="w-full lg:w-1/2 ">
            <img src="/campus1.jpg" alt="" className="rounded-2xl w-full h-full object-cover" />

            </div>

            <div className="w-full lg:w-1/2 ">
                <form action="" className="bg-white shadow-xl w-full rounded-2xl p-4 min-h-[500px] space-y-4">

                    <div className="flex justify-between">
                        <div className="flex flex-col gap-4 p-2  w-1/2">
                        <label htmlFor="First Name" className="text-base text-black font-semibold">First Name</label>
                        <input type="text" className="px-4 py-3 focus:ring-2 focus:ring-purple-400 outline-none border border-gray-100 rounded-2xl" />
                        </div>
                
                <div className="flex flex-col gap-4 p-2 w-1/2">
                    <label htmlFor="Last Name"  className="text-base text-black font-semibold">Last Name</label>
                    <input type="text" className="px-4 py-3 focus:ring-2 focus:ring-purple-400 outline-none border border-gray-100 rounded-2xl  shadow-sm" />
                </div>
                    </div>

                <div className=" flex flex-col mt-4  gap-4 p-2 ">
                <label htmlFor="Email" className="text-base text-black font-semibold">Email</label>
                <input type="email" className="px-4 py-3 focus:ring-2 focus:ring-purple-400 outline-none border border-gray-100 rounded-2xl  shadow-sm" />
                </div>

                <div className=" flex flex-col mt-4 p-2 gap-4">
                <label htmlFor="tel" className="text-base text-black font-semibold">Phone Number</label>
                <input type="tel" className="px-4 py-3 focus:ring-2 focus:ring-purple-400 outline-none border border-gray-100 rounded-2xl  shadow-sm" />
                </div>

                <div className=" flex flex-col mt-4 p-2 gap-4">
                <label htmlFor="tel" className="text-base text-black font-semibold">Enter your message</label>
                <textarea  className="px-4 py-3 focus:ring-2 focus:ring-purple-400 outline-none border border-gray-100 rounded-2xl  shadow-sm text-black" />
                </div>

                <div className=" flex flex-col mt-4 p-2 gap-4">
                    <button className="p-2 bg-amber-400 rounded-3xl text-black font-bold cursor-pointer hover:scale-95 transition-all duration-300" onClick={handleSubmit}>Submit</button>
                </div>

                

                
            </form>
            </div>
        </div>

        <div>
            <h2 className="text-3xl text-black m-4 tracking-tighter font-bold p-4">Campus map</h2>
        </div>

        <div className="p-4">
            
            <ContactMap />
        </div>

        <div className="m-4 p-6 bg-white border border-gray-200 rounded-2xl">
    <h2 className="text-2xl font-bold mb-6 text-black flex items-center gap-2">
        <span className="w-2 h-8 bg-amber-400 rounded-full"></span>
        Important Helplines
    </h2>
    <div className="overflow-x-auto">
        <table className="w-full text-left">
            <thead>
                <tr className="text-gray-400 text-sm border-b">
                    <th className="pb-4 font-medium">Department</th>
                    <th className="pb-4 font-medium">Contact Number</th>
                    <th className="pb-4 font-medium text-right">Action</th>
                </tr>
            </thead>
            <tbody className="divide-y text-black">
                <tr className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 font-medium">Anti-Ragging Helpline</td>
                    <td className="py-4 font-mono">1800-180-5522</td>
                    <td className="py-4 text-right">
                        <a href="tel:18001805522" className="text-blue-600 font-semibold hover:underline">Call Now</a>
                    </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 font-medium">Women's Cell</td>
                    <td className="py-4 font-mono">+91 22 2576 4051</td>
                    <td className="py-4 text-right">
                        <a href="tel:912225764051" className="text-blue-600 font-semibold hover:underline">Call Now</a>
                    </td>
                </tr>

                <tr className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 font-medium">Mechanical Engineering</td>
                    <td className="py-4 font-mono">+91 89 1726 0560</td>
                    <td className="py-4 text-right">
                        <a href="tel:8917260560" className="text-blue-600 font-semibold hover:underline">Call Now</a>
                    </td>
                </tr>


                <tr className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 font-medium">Computer Science</td>
                    <td className="py-4 font-mono">+91 22 2576 4051</td>
                    <td className="py-4 text-right">
                        <a href="tel:912225764051" className="text-blue-600 font-semibold hover:underline">Call Now</a>
                    </td>
                </tr>

                
            </tbody>
        </table>
    </div>
        </div>

        <Footer/>
      
    </div>
  )
}

export default page
