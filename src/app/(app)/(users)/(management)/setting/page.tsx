"use client"



import { Bell, Clock1, Search, UploadCloud } from 'lucide-react'
import React,{useEffect, useState} from 'react'
import toast from 'react-hot-toast'
import { CldUploadButton } from 'next-cloudinary';
import Image from 'next/image'
import axios from 'axios'
import Cropper from "react-easy-crop";
import { X, Save } from 'lucide-react';
import {getCroppedImage} from "@/lib/cropImage"
import { Loader2 } from 'lucide-react'


type CroppedArea = {
  x: number;
  y: number;
  width: number;
  height: number;
};

function setting() {
  const [username, setUsername] = useState("")
  const [loading, setLoading] = useState(false)
   const [preview,    setPreview]  = useState<string | null>(null)
  const [cloudUrl,   setCloudUrl] = useState<string | null>(null)
  const [uploading,  setUploading] = useState(false)
  const [fetching, setFetching] = useState(false) 
  const [currentImage, setCurrentImage] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [image, setImage] = useState()
  const [selectedFile, setSelectedFile] =
  useState<File | null>(null);
const [zoom, setZoom] = useState(1);
const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
const [showCropModal, setShowCropModal] = useState(false);

let chooseCounter = 0
let uploadCounter = 0;


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPreview(URL.createObjectURL(file))   // instant local preview, no upload yet
  }

  const handleProfileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setLoading(true)
      setUploading(true)
      chooseCounter ++;

      console.log("Select Counter",chooseCounter)

      const file = e.target.files?.[0]
      if (!file) return

      setSelectedFile(file);

    //    const formData = new FormData()
    //     formData.append('image', file)

    // const res = await axios.post('/api/users/auth/setting/uploadProfileImage', formData, {
    //   headers: {
    //     'Content-Type': 'multipart/form-data'
    //   }
    // })

    // console.log("Response of Cloudinary :",res)
    // const data = await res.json()

    // if(res.data.success){
    //   console.log('Local path:', res.data.localUrl)
    //   console.log('PublicId URL:',  res.data.publicId)
    //   toast.success("Profile Image Uploaded Successfully")
    //   setPreview(res.data.imageUrl);
    //   setCloudUrl(res.data.imageUrl)
    // }else{
    //   setUploading(false)
    //   toast.error(res.data.message || "Failed to upload profile image")
    // }

    const preview = URL.createObjectURL(file)

    setPreview(preview)
    console.log("Preview:", preview);
    console.log("Crop", crop);
    console.log("showModal:", showCropModal);
    console.log("selectedImage:", selectedFile);
    
    setShowCropModal(true);

      
    } catch (err:any) {
      console.error("Error in Uploading Profile Image:", err)
      toast.error(err?.response?.data?.message || "Error in Uploading Profile Image")

    }finally{
      setLoading(false)

      setUploading(false)
    }
  }

  const getProfileImage = async () => {
    try {
      setFetching(true)

      

      const response = await axios.get("/api/users/auth/setting/uploadProfileImage");

      if(response.data.success){
        console.log("Fetched the Photo");
        toast.success("Fetched Data");
        setCurrentImage(response.data.getImage)
      }

    } catch (err:any) {
      console.log("Error in getting Image.")
      toast.error("Error in Data");
      

      
    }
  }

  const handleSave = async () => {
    try {

      // (selectedFile);
      // console.log(croppedAreaPixels)console.log
      setLoading(true);
      setUploading(true)
      uploadCounter++;

      console.log("Upload Counter",uploadCounter)

      if(!setSelectedFile || !croppedAreaPixels){
        console.log("No file and Cropped Image found.")
        return
      }

      const imageUrl =  URL.createObjectURL(selectedFile);

      const croppedBlob = await getCroppedImage(imageUrl,croppedAreaPixels);

      // console.log("Cropped Blob: ", croppedBlob);

      const croppedFile = new File(
      [croppedBlob],
      "profile.jpg",
      {
        type: "image/jpeg",
      }
    );

    const formData= new FormData();
    formData.append('image', croppedFile);

    const res = await axios.post(
  "/api/users/auth/setting/uploadProfileImage",
  formData,
  {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }
);

      
      //   const file = e.target.Files?.[0];
      //   if(!file) return
      //   const formData= new FormData();
      //   formData.append("image",file)

      // const res = await axios.post('/api/users/auth/setting/uploadProfileImage', formData, {
      //   headers: {
      //   'Content-Type': 'multipart/form-data'
      //  }
      // });

      console.log("Starting Uploading of Image");

       if(res.data.success){
        console.log("Successfully Uploaded the Image")
        setCurrentImage(res.data.imageUrl);
        setCloudUrl(res.data.publicId);
        setCrop({x:0, y:0});
        setPreview(null)
        setCroppedAreaPixels(null)
        setShowCropModal(false)
        toast.success(res.data?.message || "Successfully Uploaded the Image")
      }
      
    } catch (err:any) {
      console.log("Error in Uploading Profile Picture");
      toast.error(err.response.data?.message || "Failed to Upload Profile Picture")
    }finally{
      setLoading(false);
      setUploading(false)
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
    
          // useEffect(() => {
          //   fetchUsername();
          // }, []);

  

  useEffect(() => {
    fetchUsername();
    getProfileImage()
  }, [])

  // const handleSubmit = async() => {
  //   try{
  //     setLoading(true)

  //   }catch(err:any){
  //     console.error("Error in Submitting Profile Data:", err)
  //     toast.error(err?.response?.data?.message || "Error in Submitting Profile Data")
  //   }finally{
  //     setLoading(false)
  //   }
  // }
  return (
    <>
  <div
    className="
      bg-white
      rounded-2xl
      sm:rounded-3xl
      border
      border-slate-200
      shadow-sm
      p-4
      sm:p-6
      mt-4
    "
  >

    
    <div
      className="
        flex
        flex-col
        sm:flex-row
        sm:items-center
        gap-4
      "
    >

      <div
        className="
          p-3
          rounded-2xl
          bg-indigo-100
          text-indigo-600
          w-fit
        "
      >
        <Clock1 size={22} />
      </div>

      <div>
        <h3
          className="
            text-xl
            sm:text-2xl
            font-bold
            tracking-tight
            text-slate-900
          "
        >
          Profile Settings
        </h3>

        <p className="text-sm text-slate-500 mt-1">
          Manage your profile photo and account appearance
        </p>
      </div>

    </div>

   
    <div className="mt-8">

      <label className="block text-base font-semibold text-slate-800 mb-4">
        Profile Picture
      </label>

      <div
        className="
          flex
          flex-col
          md:flex-row
          md:items-center
          gap-6
        "
      >

        
        <div
          className="
            flex
            justify-center
            md:justify-start
          "
        >

          

        </div>

        
        <div
          className="
            flex
            flex-col
            items-center
            md:items-start
          "
        >

          
          {/* <button
            // onClick={handleProfileUpload}
            className="
              flex
              items-center
              justify-center
              gap-2
              bg-indigo-600
              hover:bg-indigo-700
              text-white
              font-medium
              px-5
              py-3
              rounded-xl
              transition-all
              shadow-sm
              w-full
              sm:w-fit
            "
          >
            <UploadCloud size={18} />

            Upload New Photo
          </button> */}

          
        
      
      <img
  src={ `${currentImage}`}
  alt="Profile"
  className="
    h-28
    w-28
    sm:h-32
    sm:w-32
    rounded-full
    object-cover
    shadow-md
    border-4
    border-indigo-100
    bg-slate-100
    mb-4
  "
/>

<p className="text-sm text-slate-500 mb-4 text-center md:text-left">
            JPG, PNG or JPEG. Maximum size 5MB.
          </p>

         

      {/* Upload button */}
      <input
        type="file"
        accept="image/*"
        onChange={handleProfileUpload}
        style={{ display: 'none' }}
        id="image-upload"
       
      />
      <label htmlFor="image-upload" style={{ cursor: 'pointer' }}  className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">
        {uploading ? 'Uploading...' : 'Upload Image'}
      </label>

      
      

        </div>

      </div>

    </div>


    <div className="mt-10 space-y-6">

      
      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          gap-6
        "
      >

        <div className="w-full">
          <label className="block text-sm font-semibold text-slate-800 mb-2">
            Full Name
          </label>

          <input
            type="text"
            disabled
            placeholder="John Doe"
            className="
              w-full
              p-3
              rounded-xl
              border
              border-slate-200
              bg-slate-50
              text-slate-700
              shadow-sm
              focus:outline-none
            "
          />
        </div>

        <div className="w-full">
          <label className="block text-sm font-semibold text-slate-800 mb-2">
            Roll No
          </label>

          <input
            type="text"
            disabled
            placeholder="25BTCSE05"
            className="
              w-full
              p-3
              rounded-xl
              border
              border-slate-200
              bg-slate-50
              text-slate-700
              shadow-sm
              focus:outline-none
            "
          />
        </div>

      </div>

      
      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          gap-6
        "
      >

        <div className="w-full">
          <label className="block text-sm font-semibold text-slate-800 mb-2">
            Organisational Email
          </label>

          <input
            type="text"
            disabled
            placeholder="john.doe@organization.com"
            className="
              w-full
              p-3
              rounded-xl
              border
              border-slate-200
              bg-slate-50
              text-slate-700
              shadow-sm
              focus:outline-none
            "
          />
        </div>

        <div className="w-full">
          <label className="block text-sm font-semibold text-slate-800 mb-2">
            Department
          </label>

          <input
            type="text"
            disabled
            placeholder="Computer Science and Engineering"
            className="
              w-full
              p-3
              rounded-xl
              border
              border-slate-200
              bg-slate-50
              text-slate-700
              shadow-sm
              focus:outline-none
            "
          />
        </div>

      </div>

      
      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          lg:grid-cols-3
          gap-6
        "
      >

        <div className="w-full">
          <label className="block text-sm font-semibold text-slate-800 mb-2">
            Semester
          </label>

          <input
            type="text"
            disabled
            placeholder="4"
            className="
              w-full
              p-3
              rounded-xl
              border
              border-slate-200
              bg-slate-50
              text-slate-700
              shadow-sm
              focus:outline-none
            "
          />
        </div>

        <div className="w-full">
          <label className="block text-sm font-semibold text-slate-800 mb-2">
            Section
          </label>

          <input
            type="text"
            disabled
            placeholder="A"
            className="
              w-full
              p-3
              rounded-xl
              border
              border-slate-200
              bg-slate-50
              text-slate-700
              shadow-sm
              focus:outline-none
            "
          />
        </div>

        <div className="w-full">
          <label className="block text-sm font-semibold text-slate-800 mb-2">
            Registration Number
          </label>

          <input
            type="text"
            disabled
            placeholder="12345678"
            className="
              w-full
              p-3
              rounded-xl
              border
              border-slate-200
              bg-slate-50
              text-slate-700
              shadow-sm
              focus:outline-none
            "
          />
        </div>

      </div>

      
      {/* <div
        className="
          pt-4
          flex
          justify-center
          sm:justify-start
        "
      >

        {/* <button
          type="submit"
          onClick={handleSubmit}
          className="
            bg-indigo-600
            hover:bg-indigo-700
            text-white
            font-semibold
            tracking-wide
            px-6
            py-3
            rounded-xl
            transition-all
            shadow-sm
            hover:shadow-md
            active:scale-95
            w-full
            sm:w-fit
          "
        >
          Submit
        </button> */}

      {/* </div>  */}

    </div>

  </div>

          {showCropModal && (
            
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
    
    <div className="w-full max-w-lg rounded-2xl bg-white p-6">
            <div className='relative h-[400px] w-full '>
             
              <Cropper
              image={`${preview}`} 
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_, croppedPixels) => {
                setCroppedAreaPixels(croppedPixels);
              }}
              
              
              />

              <div>
                
              </div>
            </div>

            <div className='flex lg:flex-row justify-between mt-6 '>
                <button className=' px-2 py-3 flex items-center gap-2 bg-red-500 rounded-lg font-bold tracking-wide disabled:opacity-50 disabled:cursor-not-allowed' disabled={loading} onClick={() => {setShowCropModal(false); setPreview(null) }}><X size={20} /> Cancel</button>

                <button type='submit'className="flex items-center gap-2 bg-green-500 py-3 px-3 rounded-lg font-bold tracking-wide cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" onClick={handleSave} disabled={loading}>
                <Save size={20} />
                {loading===true ? "Saving..." : "Save "}
                </button>
    </div>
    </div>

    
  </div>
)}
    </>
  )
}

export default setting

 
