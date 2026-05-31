"use client"

import AdminNavbar from '@/utils/AdminNavbar';
import axios from 'axios';
import react, {useState, useEffect} from 'react';
import { Bell, BookAudio, LogOut, Megaphone, Search, SquarePen } from 'lucide-react'
import toast from 'react-hot-toast';


function Messages() {
  const [username, setUsername] = useState("Ajitesh");
  const [loading, setLoading] =useState(true);
  const [notices, setNotices] = useState([]);

   useEffect(() => {
    handleFetchUserData();
  }, [])

  const handleFetchUserData = async () => {
    try{
      setLoading(true);
      const response = await axios.get("/api/users/auth/message");
      if(response.data.success){
        setUsername(response.data.username);
        setNotices(response.data.notices);
        // setUsername(response.data.username);
        toast.success("User data fetched successfully");
      }else{
        console.error("Failed to fetch user data:", response.data.message);
        toast.error("Failed to fetch user data");
      }
    }catch(err){
      console.error("Error fetching user data:", err);
      toast.error("Error fetching user data");
    }finally{
      setLoading(false);
    }
  }

  const fetchUsername = async () => {
            try{
                const res = await fetch("/api/users/getUsername");
                const data = await res.json();
                setUsername(data.username);
                console.log("Username:", data.username);
            }catch(err){
              console.log(err);
            }
          }
  
          useEffect(() => {
              fetchUsername();
          })
  return (
    <div className='bg-linear-to-br from-slate-50 via-white to-slate-50 min-h-screen p-3 sm:p-4 md:p-5 lg:p-6'>
      {/* Header for Messages Page */}
    <div className='flex flex-col lg:flex-row gap-4 sm:gap-5 md:gap-6'>
      <AdminNavbar/ >

      <div className={`
            bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-7 lg:p-8 shadow-sm
            transition-all duration-300
            w-full
            text-slate-900
          `}>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 pb-6 sm:pb-8 border-b border-slate-200">
                        {/* Greeting */}
                        <div className="min-w-0">
                          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">
                            Hello {username} 👋
                          </h2>
                          <p className="text-xs sm:text-sm text-slate-600 mt-1 sm:mt-2">
                            Let's learn something new today
                          </p>
                        </div>
            
                        {/* Actions */}
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 shrink-0">
                          {/* Search */}
                          <div className="relative w-full sm:w-auto flex-1 sm:flex-none">
                            <Search 
                              className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400" 
                              size={18}
                            />
                            <input
                              className="w-full sm:w-52 md:w-60 lg:w-64 pl-10 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-slate-200 rounded-lg sm:rounded-xl text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                              placeholder="Search..."
                            />
                          </div>
            
                          {/* Notification Button */}
                          <button className="p-2.5 sm:p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg sm:rounded-xl transition-all shrink-0 flex items-center justify-center">
                            <Bell size={18} />
                          </button>
            
                          {/* Profile Button */}
                          {/* <button
                            onClick={() => setOpenProfile(true)}
                            className="p-2.5 sm:p-3 bg-slate-100 border border-slate-200 hover:bg-indigo-50 hover:border-indigo-300 text-slate-600 rounded-lg sm:rounded-xl transition-all shrink-0 flex items-center justify-center"
                          >
                            <SquarePen size={18} />
                          </button> */}
            
                          {/* <button onClick={handleLogout} className="p-2.5 bg-red-600 rounded-lg cursor-pointer">
                            <LogOut size={18}/>
                          </button> */}
                        </div>
                      </div>

            <div className="mt-6 sm:mt-8 md:mt-10">
              
            <h2 className="text-md sm:text-3xl md:text-3xl font-bold text-slate-900">
                Latest Notices and News
            </h2> 

            <div className={`bg-green-100 min-h-120 mt-4  rounded-lg p-4`}>
              <h3 className="text-lg font-semibold text-green-800 mb-5 lg:mb-6">Important Notices</h3>
                            <ul>

                                {notices.length === 0 ? (
                                    <div className="flex items-center h-full">
                                      <Megaphone size={24} className=" mr-2 m-2" />
                                      <p className="text-red-700 font-bold  text-2xl tracking-wide ">No notices available at the moment.</p>
                                    </div>
                                ) : (
                                    notices.map((notice, index) => (
                                        <li key={index} className={index > 0 ? "mt-4" : ""}>
                                            <h3 className="text-lg font-semibold text-green-800"><Megaphone size={18}/>{notice.title}</h3>
                                            <p className="text-green-700">{notice.description}</p>
                                        </li>
                                    ))
                                )}
                                
                            </ul>

              <h3 className="text-lg font-semibold text-green-800 mb-5 lg:mb-6 mt-6">Assignment Updates</h3>

                                <ul>
                                  <li>
                                    <div className="flex items-center gap-2">
                                      <Megaphone size={18}/>
                                      <h4 className="text-green-700 tracking-wider">
                                      New assignment posted for Data Structures. Check the portal for details.
                                     </h4>
                                    </div>
                                    
                                  </li>
                                  <li className="mt-4">
                                    <div className="flex items-center gap-2">
                                      <Megaphone size={18}/>
                                      <h4 className="text-yellow-500 tracking-wider">
                                      New assignment posted for Data Structures. Check the portal for details.
                                     </h4>
                                    </div>
                                  </li>
                                  <li className="mt-4">
                                    
                                    
                                  </li>
                                </ul>

              <h3 className="text-lg font-semibold text-green-800 mb-5 lg:mb-6 mt-6">
                Exam Notifications
              </h3>

              <ul>
                                  <li>
                                    <div className="flex items-center gap-2">
                                      <BookAudio size={18}/>
                                      <h4 className="text-green-700 tracking-wider">
                                      New assignment posted for Data Structures. Check the portal for details.
                                     </h4>
                                    </div>
                                    
                                  </li>
                                  <li className="mt-4">
                                    <div className="flex items-center gap-2">
                                      <BookAudio size={18}/>
                                      <h4 className="text-yellow-500 tracking-wider">
                                      New assignment posted for Data Structures. Check the portal for details.
                                     </h4>
                                    </div>
                                  </li>
                                  <li className="mt-4">
                                    
                                    
                                  </li>
              </ul>

            </div>
            </div>          

      </div>


      </div>

    </div>
  )
}

export default Messages
