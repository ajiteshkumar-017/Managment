
"use client"
import React from 'react'
import Skeleton from '@/utils/Skeleton'
import { useState } from 'react'

function page() {

    const [loading, setLoading]= useState(true)
  return (
    <div className='mt-6 p-6'>
        {
        loading ? (
          <Skeleton />
        ) : (
         <div>
            Actual Content
         </div>
        )
      }
    </div>
  )
}

export default page